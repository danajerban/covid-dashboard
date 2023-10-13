import request from "supertest";
import app from "../index.js";
import http from "http";

//another way of testing the server
let server;
beforeAll(() => {
  server = http.createServer(app); // create a new server instance with your app and start listening to a random port
  server.listen();
});

afterAll((done) => {
  server.close(done); // close the server after all tests are done
});

describe("Routes Testing", () => {
  it("should return all countries", async () => {
    const res = await request(server).get("/");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should get total cases", async () => {
    const res = await request(server).get("/total-cases");
    expect(res.statusCode).toEqual(200);
  });

  it("should return 404 for an unknown route", async () => {
    const res = await request(server).get("/unknown-route");
    expect(res.statusCode).toEqual(404);
  });
});
