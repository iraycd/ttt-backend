import { apiHelper } from "../../Helpers/testApiHelper";

describe("Get Game Query", () => {
  it("Get Game Query", async done => {
    const api = await apiHelper();
    const todo = await api.query({
      action: "listGame",
      model: {}
    });
    expect(todo.length).toBeGreaterThan(0);
    done();
  });
});
