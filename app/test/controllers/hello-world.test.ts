import request from "supertest";
import app from "../../app";

describe("Hello world", () => {
  it("should return Hello world message", (done) => {
    request(app)
      .get("/hello")
      .then(async (res: any) => {
        const body = res.body;
        expect(body.message).toBe("Hello World");
        done();
      });
  });
});
