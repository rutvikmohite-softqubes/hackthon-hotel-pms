import axios from "axios";

import { mockApiAdapter } from "./mockApiAdapter";

const apiClient = axios.create({
  baseURL: "/api",
  adapter: mockApiAdapter,
});

export default apiClient;
