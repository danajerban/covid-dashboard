import {
  searchCountry,
  getCountryData,
  getCountryTotalCases,
} from "../controllers/searchController.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

describe("searchController Testing", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should search a country", async () => {
    const req = { query: { q: "United" } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await searchCountry(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it("should get country data", async () => {
    const req = { params: { countryId: "clng4vpu3002grrevxz73tbmf" } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await getCountryData(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it("should get country total cases", async () => {
    const req = { params: { countryId: "clng4vpu3002grrevxz73tbmf" } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await getCountryTotalCases(req, res);
    expect(res.json).toHaveBeenCalled();
  });
});
