import axios from "axios";

const USER_API_BASE = "https://user.hotelswitchboard.com/api/v1";

const getAuthToken = () => {
  try {
    const raw = localStorage.getItem("hotelPms.auth");
    if (!raw) return "";
    const parsed = JSON.parse(raw);
    // The login API returns the JWT under the `token` key.
    return parsed?.token || parsed?.data?.token || "";
  } catch {
    return "";
  }
};

export const userService = {
  async getList({
    pageNum = 1,
    pageSize = 100,
    statusterm = "Active",
  } = {}) {
    const token = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const payload = {
      pageNum,
      pageSize,
      sortColumn: "",
      sortDirection: "asc",
      email: "",
      mobileno: "",
      displayname: "",
      firstname: "",
      lastname: "",
      statusterm,
      isdefault: null,
      search: "",
    };

    const response = await axios.post(`${USER_API_BASE}/User/getlist`, payload, { headers });
    const data = Array.isArray(response?.data?.data) ? response.data.data : [];
    return data;
  },

  async listManagers() {
    const users = await userService.getList();
    return users.map((user) => ({
      id: user.userid,
      name: user.displayname,
      email: user.email,
      mobileNo: user.mobileno,
      raw: user,
    }));
  },
};

export default userService;
