import apiClient from "./apiClient";

export const portfolioService = {
  async list() {
    const response = await apiClient.get("/portfolios");
    return response.data.data;
  },
  async create(payload) {
    const response = await apiClient.post("/portfolios", payload);
    return response.data.data;
  },
};
