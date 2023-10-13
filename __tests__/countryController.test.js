const request = require("supertest");
const express = require("express");
import countryController from "../controllers/countryController.js";
const app = express();

app.get("/countries", countryController.getCountries);
app.get("/total-cases", countryController.getTotalCases);

describe("countryController Testing", () => {
  it("should get all countries", async () => {
    const res = await request(app).get("/countries");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should get total cases", async () => {
    const res = await request(app).get("/total-cases");
    expect(res.statusCode).toEqual(200);
  });

  it("should return 404 for an unknown route", async () => {
    const res = await request(app).get("/unknown-route");
    expect(res.statusCode).toEqual(404);
  });
});
