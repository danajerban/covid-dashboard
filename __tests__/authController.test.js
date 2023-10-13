const request = require("supertest");
const express = require("express");
import authController from "../controllers/authController.js";
const app = express();
app.use(express.json()); // for POST requests

app.post("/login", authController.login);
app.post("/register", authController.register);

describe("authController Testing", () => {
  it("should handle login", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "admin", password: "admin" });
    expect(res.statusCode).toEqual(200);
  });

  it("should handle register", async () => {
    const uniqueUsername = `test${Date.now()}`;
    const res = await request(app)
      .post("/register")
      .send({ username: uniqueUsername, password: "test" });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe("Registered successfully");
  });
});
