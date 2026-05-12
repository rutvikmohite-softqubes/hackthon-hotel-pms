export const samplePropertyPayload = {
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

export const samplePortfolioPayload = {
  code: "PORT001",
  name: "East Coast Luxury",
  classification: "Luxury",
  manager: "Ava Thompson",
  module: "Revenue",
  propertyId: "prop-1746851500000",
  secondaryManager: "Liam Patel",
  distribution: "Direct, OTA, Corporate",
};

export const mockApiResponses = {
  createProperty: {
    success: true,
    data: {
      id: "prop-1746851500000",
      createdAt: "2026-05-10T10:00:00.000Z",
      ...samplePropertyPayload,
    },
  },
  createPortfolio: {
    success: true,
    data: {
      id: "port-1746851900000",
      createdAt: "2026-05-10T10:05:00.000Z",
      ...samplePortfolioPayload,
    },
  },
};
