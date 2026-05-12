import apiClient from "./apiClient";

export const propertyService = {
  async list() {
    const response = await apiClient.get("/properties");
    return response.data.data;
  },
  async create(payload) {
    const response = await apiClient.post("/properties", payload);
    return response.data.data;
  },
  async listManagers() {
    const response = await apiClient.get("/managers");
    return response.data.data;
  },
};
