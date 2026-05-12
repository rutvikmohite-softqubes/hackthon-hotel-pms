import { describe, expect, it } from "vitest";

import { propertySchema } from "../validations/propertySchema";

const validProperty = {
  picture: null,
  status: "Active",
  propertyCode: "NYC001",
  propertyName: "Hudson Grand Hotel",
  displayName: "Hudson Grand",
  brand: "Marriott",
  franchise: "Marriott Inn",
  pms: "Choice",
  pmsType: "Hotel",
  chain: "Ramada Inn",
  classification: "Luxury",
  timezone: "America/New_York",
  currency: "USD",
  managerId: "mgr-001",
  systemType: "PMS",
  eventRadius: 25,
  latitude: 40.7128,
  longitude: -74.006,
  contactName: "Emma Johnson",
  email: "emma.johnson@hudsongrand.com",
  mobileNo: "9175550123",
  contactNo: "2125551122",
  address: "123 Madison Ave",
  city: "New York",
  state: "NY",
  country: "USA",
  zipCode: "10016",
};

describe("propertySchema", () => {
  it("accepts a valid payload", async () => {
    await expect(propertySchema.validate(validProperty)).resolves.toBeTruthy();
  });

  it("rejects invalid email", async () => {
    await expect(
      propertySchema.validate({
        ...validProperty,
        email: "invalid-email",
      })
    ).rejects.toThrow();
  });

  it("rejects missing required property code", async () => {
    await expect(
      propertySchema.validate({
        ...validProperty,
        propertyCode: "",
      })
    ).rejects.toThrow();
  });

  it("rejects out-of-range latitude", async () => {
    await expect(
      propertySchema.validate({
        ...validProperty,
        latitude: 99,
      })
    ).rejects.toThrow();
  });
});
