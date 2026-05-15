import axios from "axios";

const CONFIG_API_BASE = "https://configuration.hotelswitchboard.com/api/v1";

const getAuthToken = () => {
  try {
    const raw = localStorage.getItem("hotelPms.auth");
    if (!raw) return "";
    const parsed = JSON.parse(raw);
    return parsed?.token || parsed?.data?.token || "";
  } catch {
    return "";
  }
};

// Categories requested from the configuration API. The API uses the spelling
// "Frenchise" (note: not "Franchise") — keep it as-is to match the backend.
const REQUESTED_CATEGORIES = [
  "Brand",
  "Frenchise",
  "PMS",
  "PMS Type",
  "Chain",
  "Currency",
  "Timezone",
  "Classification",
];

export const configurationService = {
  async getTermsByCategories(categories = REQUESTED_CATEGORIES) {
    const token = getAuthToken();
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const payload = {
      categorynamebycomma: categories.join(","),
    };

    const response = await axios.post(
      `${CONFIG_API_BASE}/ProjectTerm/getlistbymulticategory`,
      payload,
      { headers }
    );

    const rows = Array.isArray(response?.data?.data) ? response.data.data : [];

    // Group by termcategoryname → array of { label, value } using `term` as both.
    const grouped = {};
    for (const row of rows) {
      const category = row?.termcategoryname;
      const term = row?.term;
      if (!category || !term) continue;
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push({ label: term, value: term, raw: row });
    }
    return grouped;
  },
};

export default configurationService;
