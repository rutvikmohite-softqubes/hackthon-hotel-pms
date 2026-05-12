import { MOCK_MANAGERS } from "../data/mockManagers";
import { STORAGE_KEYS } from "../data/constants";
import { readStorage, writeStorage } from "../utils/storage";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildResponse = (config, status, data) => ({
  data,
  status,
  statusText: status >= 200 && status < 300 ? "OK" : "Error",
  headers: {},
  config,
});

export const mockApiAdapter = async (config) => {
  // Simulate network latency so loading states can be tested in UI.
  await delay(600);

  const { method = "get", url = "", data } = config;
  const normalizedMethod = method.toLowerCase();

  if (url === "/managers" && normalizedMethod === "get") {
    return buildResponse(config, 200, { success: true, data: MOCK_MANAGERS });
  }

  if (url === "/properties" && normalizedMethod === "get") {
    const properties = readStorage(STORAGE_KEYS.properties, []);
    return buildResponse(config, 200, { success: true, data: properties });
  }

  if (url === "/properties" && normalizedMethod === "post") {
    const payload = JSON.parse(data || "{}");
    const properties = readStorage(STORAGE_KEYS.properties, []);
    const created = {
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...payload,
    };
    writeStorage(STORAGE_KEYS.properties, [created, ...properties]);
    return buildResponse(config, 201, { success: true, data: created });
  }

  if (url === "/portfolios" && normalizedMethod === "get") {
    const portfolios = readStorage(STORAGE_KEYS.portfolios, []);
    return buildResponse(config, 200, { success: true, data: portfolios });
  }

  if (url === "/portfolios" && normalizedMethod === "post") {
    const payload = JSON.parse(data || "{}");
    const portfolios = readStorage(STORAGE_KEYS.portfolios, []);
    const created = {
      id: `port-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...payload,
    };
    writeStorage(STORAGE_KEYS.portfolios, [created, ...portfolios]);
    return buildResponse(config, 201, { success: true, data: created });
  }

  return buildResponse(config, 404, {
    success: false,
    message: `No mock route found for ${normalizedMethod.toUpperCase()} ${url}`,
  });
};
