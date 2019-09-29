import * as Koa from "koa";
import * as KoaRouter from "koa-router";
import { scopePerRequest, makeInvoker } from "awilix-koa";
import container from "./awilix";
import * as koaBodyImport from "koa-body";
import * as cors from "koa2-cors";
import * as fs from 'fs';
import * as path from 'path'
import serve from 'koa-static';
import * as CircularJSON from 'circular-json';
import { URL } from "url";

//TO REMOVE IN FUTURE
if (process.env.UPLOAD_PATH) {
  if (!fs.existsSync(process.env.UPLOAD_PATH)) {
    console.log('CREATE FOLDER');
    fs.mkdirSync(process.env.UPLOAD_PATH);
  }
}
// @ts-ignore
let koaBody = koaBodyImport({
  multipart: true,
  formLimit: "10mb",
  jsonLimit: "10mb",
  textLimit: "10mb",
  json: true,
  text: true,
});


const app = new Koa();
const router = new KoaRouter();

app.use(cors());


// This installs a scoped container into our
// context - we will use this to register our current user!
// @ts-ignore
app.use(scopePerRequest(container));
// Let's do that now!
app.use((ctx, next) => {
  console.log(ctx.state.container)
  ctx.state.container.register({
    // Imagine some auth middleware somewhere...
    // This makes currentUser available to all services!
    // currentUser: ctx.state.user
  });
  return next();
});

const cqrsPreprocess = () => {
  const commandExec = async ctx => {
    const body = ctx.request.body;
    const action = ctx.state.container.resolve(body.action);
    let model = {};
    if (typeof (body.model) == "object") {
      model = body.model
    } else {
      model = JSON.parse(decodeURIComponent(body.model));
    }
    action.init(model);
    await cqrsHandler(action, ctx);
  };
  const queryExec = async ctx => {
    const body = ctx.request.body;
    const action = ctx.state.container.resolve(body.action);
    let model = {};
    if (typeof (body.model) == "object") {
      model = body.model
    } else {
      model = JSON.parse(decodeURIComponent(body.model));
    }
    action.init(model);
    return cqrsHandler(action, ctx);
  };

  const cqrsHandler = async (action, ctx) => {
    let result = null;
    try {
      let token = ctx.request.header.authorization;
      let lang = ctx.request.header.language;
      action.token = token;
      action.referer = ctx.request.header.referer ? (new URL(ctx.request.header.referer)).origin : 'http://localhost.8080'
      action.language = lang;
      result = await action.run();
      ctx.body = CircularJSON.stringify(result);
      ctx.status = 200;
      ctx.type = 'application/json'
    } catch (exception) {
      ctx.body = CircularJSON.stringify(exception);;
      ctx.status = 400; // Number(exception.Status);
      ctx.type = 'application/json'
    }
    return ctx;
  };
  return {
    queryExec,
    queryExecAsync: async ctx => {
      return await queryExec(ctx);
    },
    commandExec,
    commandExecAsync: async ctx => {
      return await commandExec(ctx);
    },
    cqrsHandler
  };
};

const api = makeInvoker(cqrsPreprocess);
router.post("/query", koaBody, api("queryExecAsync"));
router.post("/command", koaBody, api("commandExecAsync"));
app.use(router.routes());
app.listen(process.env.PORT || 1337);

module.exports = cqrsPreprocess;