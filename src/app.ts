import * as http from "http";
import * as Koa from "koa";
import * as KoaRouter from "koa-router";
import { scopePerRequest, makeInvoker } from "awilix-koa";
import container from "./awilix";
import * as koaBodyImport from "koa-body";
import * as cors from "koa2-cors";
import * as fs from "fs";
import * as CircularJSON from "circular-json";
import { URL } from "url";

export async function createServer() {
  //TO REMOVE IN FUTURE
  if (process.env.UPLOAD_PATH) {
    if (!fs.existsSync(process.env.UPLOAD_PATH)) {
      console.log("CREATE FOLDER");
      fs.mkdirSync(process.env.UPLOAD_PATH);
    }
  }

  const koaBody = koaBodyImport({
    multipart: true,
    formLimit: "10mb",
    jsonLimit: "10mb",
    textLimit: "10mb",
    json: true,
    text: true
  });

  const app = new Koa();
  const router = new KoaRouter();

  app.use(cors());

  // This installs a scoped container into our
  // context - we will use this to register our current user!

  app.use(scopePerRequest(container));
  // Let's do that now!
  app.use((ctx, next) => {
    ctx.state.container.register({
      // Imagine some auth middleware somewhere...
      // This makes currentUser available to all services!
      // currentUser: ctx.state.user
    });
    return next();
  });

  const cqrsPreprocess = () => {
    const cqrsHandler = async (action: any, ctx: any) => {
      let result = null;
      try {
        const token = ctx.request.header.authorization;
        const lang = ctx.request.header.language;
        action.token = token;
        action.referer = ctx.request.header.referer
          ? new URL(ctx.request.header.referer).origin
          : "http://localhost.8080";
        action.language = lang;
        result = await action.run();
        Object.assign(ctx, {
          body: CircularJSON.stringify(result),
          status: 200,
          type: "application/json"
        });
      } catch (exception) {
        Object.assign(ctx, {
          body: CircularJSON.stringify(exception),
          status: 400,
          type: "application/json"
        });
      }
      return ctx;
    };
    const commandExec = async (ctx: any) => {
      const body = ctx.request.body;
      const action = ctx.state.container.resolve(body.action);
      let model = {};
      if (typeof body.model == "object") {
        model = body.model;
      } else {
        model = JSON.parse(decodeURIComponent(body.model));
      }
      action.init(model);
      await cqrsHandler(action, ctx);
    };
    const queryExec = async (ctx: any) => {
      const body = ctx.request.body;
      const action = ctx.state.container.resolve(body.action);
      let model = {};
      if (typeof body.model == "object") {
        model = body.model;
      } else {
        model = JSON.parse(decodeURIComponent(body.model));
      }
      action.init(model);
      return cqrsHandler(action, ctx);
    };

    return {
      queryExec,
      queryExecAsync: async (ctx: any) => {
        return await queryExec(ctx);
      },
      commandExec,
      commandExecAsync: async (ctx: any) => {
        return await commandExec(ctx);
      },
      cqrsHandler
    };
  };

  const api = makeInvoker(cqrsPreprocess);
  router.post("/query", koaBody, api("queryExecAsync"));
  router.post("/command", koaBody, api("commandExecAsync"));
  app.use(router.routes());
  const server = http.createServer(app.callback());

  // Add a `close` event listener so we can clean up resources.
  server.on("close", () => {
    // You should tear down database connections, TCP connections, etc
    // here to make sure Jest's watch-mode some process management
    // tool does not release resources.
    console.debug("Server closing, bye!");
  });
  console.debug("Server created, ready to listen", { scope: "startup" });
  return server;
}
