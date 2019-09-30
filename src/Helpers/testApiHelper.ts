import axios from "axios";
import { createServer } from "../app";
import { Server } from "http";
import { AddressInfo } from "net";

/**
 * Creates a status asserter that asserts the given status on the response,
 * then returns the response data.
 *
 * @param {number} status
 */
export function assertStatus(status: number) {
  return async function statusAsserter(resp: any) {
    if (resp.status !== status) {
      throw new Error(
        `Expected ${status} but got ${resp.status}: ${resp.request.method} ${resp.request.path}`
      );
    }
    return resp.data;
  };
}

const startServer = async () => {
  return (await createServer()).listen();
};

export async function apiHelper() {
  const server: Server = await startServer();
  const { port } = server.address() as AddressInfo;
  const baseURL = `http://127.0.0.1:${port}`;
  const client = axios.create({
    baseURL
  });
  return {
    client,
    command: (data: any) => client.post("/command", data).then(assertStatus(200)),
    query: (data: any) => client.post("/query", data).then(assertStatus(200))
  };
}

afterAll(async () => {
  // Server is memoized so it won't start a new one.
  // We need to close it.
  const server = await startServer();
  return new Promise(resolve => server.close(resolve));
});
