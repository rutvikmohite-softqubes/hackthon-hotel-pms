import { describe, expect, it } from "vitest";

import { portfolioSchema } from "../validations/portfolioSchema";

const validPortfolio = {
  code: "PORT001",
  name: "East Coast Luxury",
  classification: "Luxury",
  manager: "Ava Thompson",
  module: "Revenue",
  propertyId: "prop-1746851500000",
  secondaryManager: "Liam Patel",
  distribution: "Direct, OTA, Corporate",
};

describe("portfolioSchema", () => {
  it("accepts a valid payload", async () => {
    await expect(portfolioSchema.validate(validPortfolio)).resolves.toBeTruthy();
  });

  it("rejects missing portfolio name", async () => {
    await expect(
      portfolioSchema.validate({
        ...validPortfolio,
        name: "",
      })
    ).rejects.toThrow();
  });

  it("rejects missing property selection", async () => {
    await expect(
      portfolioSchema.validate({
        ...validPortfolio,
        propertyId: "",
      })
    ).rejects.toThrow();
  });
});
