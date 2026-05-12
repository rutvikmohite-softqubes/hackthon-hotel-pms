import { beforeEach, describe, expect, it } from "vitest";

import { portfolioService } from "../services/portfolioService";
import { propertyService } from "../services/propertyService";

beforeEach(() => {
  localStorage.clear();
});

describe("mock service layer", () => {
  it("creates and lists a property", async () => {
    const created = await propertyService.create({
      status: "Active",
      propertyCode: "TX001",
      propertyName: "Austin Plaza",
      managerId: "mgr-001",
      city: "Austin",
      country: "USA",
    });

    const listed = await propertyService.list();

    expect(created.id).toBeTruthy();
    expect(listed).toHaveLength(1);
    expect(listed[0].propertyName).toBe("Austin Plaza");
  });

  it("creates and lists a portfolio", async () => {
    await propertyService.create({
      status: "Active",
      propertyCode: "CA001",
      propertyName: "Pacific Suites",
      managerId: "mgr-002",
      city: "San Diego",
      country: "USA",
    });

    const properties = await propertyService.list();

    const createdPortfolio = await portfolioService.create({
      code: "PORT-CA",
      name: "West Collection",
      classification: "Luxury",
      manager: "Ava Thompson",
      module: "CRM",
      propertyId: properties[0].id,
      secondaryManager: "Liam Patel",
      distribution: "OTA",
    });

    const portfolios = await portfolioService.list();

    expect(createdPortfolio.id).toBeTruthy();
    expect(portfolios).toHaveLength(1);
    expect(portfolios[0].name).toBe("West Collection");
  });
});
