import { apiHelper } from "../../Helpers/testApiHelper";
import ArangoDB from "../../Database/models";
import configJSON from "../../Database/config/config";

describe("Get Game Query", () => {
  beforeAll(async () => {
    const systemDB = ArangoDB.db.useDatabase("_system");
    await systemDB.dropDatabase(configJSON.ARANGO_DB);
    await systemDB.createDatabase(configJSON.ARANGO_DB);
    const testDB = ArangoDB.db.useDatabase(configJSON.ARANGO_DB);
    await testDB.collection("game").create();
  });
  it("Get Game Query", async done => {
    const api = await apiHelper();
    const todo = await api.query({
      action: "listGame",
      model: {}
    });
    expect(todo.length).toEqual(0);
    done();
  });
});
