const PREDICTHQ_BASE_URL = "https://api.predicthq.com/v1";
const DEFAULT_EVENT_LIMIT = 500;

const getAuthHeaders = () => {
  const apiToken = import.meta.env.VITE_PREDICTHQ_TOKEN;

  if (!apiToken) {
    throw new Error("Missing PredictHQ token. Set VITE_PREDICTHQ_TOKEN in your environment.");
  }

  return {
    Authorization: `Bearer ${apiToken}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const splitGeoLocation = (geoLocation) => {
  const [latitudePart, longitudePart] = String(geoLocation || "")
    .split(",")
    .map((value) => value.trim());

  const latitude = Number(latitudePart);
  const longitude = Number(longitudePart);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("Geo location must include valid latitude and longitude.");
  }

  if (latitude < -90 || latitude > 90) {
    throw new Error("Latitude must be between -90 and 90.");
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error("Longitude must be between -180 and 180.");
  }

  return { latitude, longitude };
};

const createSavedLocation = async ({ propertyName, latitude, longitude, radiusMiles }) => {
  const requestBody = {
    name: propertyName,
    geojson: {
      type: "Feature",
      geometry: {
        type: "Point",
        // GeoJSON coordinates are [longitude, latitude].
        coordinates: [longitude, latitude],
      },
      properties: {
        radius: Number(radiusMiles) || 15.53,
        radius_unit: "mi",
      },
    },
  };

  console.log("PredictHQ createSavedLocation payload:\n", JSON.stringify(requestBody, null, 2));

  const response = await fetch(`${PREDICTHQ_BASE_URL}/saved-locations`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create saved location (${response.status}): ${errorText}`);
  }

  const payload = await response.json();
  console.log("PredictHQ createSavedLocation response:\n", JSON.stringify(payload, null, 2));
  console.log("PredictHQ created location_id:", payload?.location_id);
  return payload.location_id;
};

const fetchEventsForSavedLocation = async ({ savedLocationId, startDate, endDate }) => {
  const events = [];
  let offset = 0;

  while (true) {
    const query = new URLSearchParams({
      "end.lt": endDate,
      limit: String(DEFAULT_EVENT_LIMIT),
      "saved_location.location_id": savedLocationId,
      "start.gt": startDate,
      sort: "start",
      country: "US",
      offset: String(offset),
    });

    const response = await fetch(`${PREDICTHQ_BASE_URL}/events/?${query.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch events (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const results = Array.isArray(data.results) ? data.results : [];
    events.push(...results);

    if (!data.next) {
      break;
    }

    offset += DEFAULT_EVENT_LIMIT;
  }

  return events;
};

const deleteSavedLocation = async (savedLocationId) => {
  if (!savedLocationId) {
    return;
  }

  await fetch(`${PREDICTHQ_BASE_URL}/saved-locations/${savedLocationId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

const toUiEvent = (event) => {
  const eventType = event?.entities?.[0]?.type || "";
  const startDate = event?.start?.local || event?.start || "-";
  const endDate = event?.end?.local || event?.end || "-";

  return {
    id: event.id,
    name: event.title || "-",
    type: eventType || event.category || "-",
    impact: "Mid",
    startDate,
    endDate,
    eventId: event.id,
    raw: event,
  };
};

export const predictHqService = {
  async fetchEventsByProperty({ propertyName, geoLocation, eventRadius }) {
    if (!propertyName?.trim()) {
      throw new Error("Property name is required to fetch events.");
    }

    const { latitude, longitude } = splitGeoLocation(geoLocation);
    const startDate = formatDate(new Date());
    const end = new Date();
    end.setDate(end.getDate() + 365);
    const endDate = formatDate(end);

    let savedLocationId = "";

    try {
      savedLocationId = await createSavedLocation({
        propertyName: propertyName.trim(),
        latitude,
        longitude,
        radiusMiles: eventRadius,
      });

      console.log("PredictHQ savedLocationId (after property created):", savedLocationId);
      // eslint-disable-next-line no-debugger
      debugger;

      if (!savedLocationId) {
        throw new Error("PredictHQ saved location did not return location_id.");
      }

      // PredictHQ needs a brief moment after creating a saved location before
      // it becomes queryable via the events endpoint. Wait, then retry on 404.
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const maxAttempts = 5;
      const initialDelayMs = 3000;
      let events = [];
      let lastError = null;

      await sleep(initialDelayMs);

      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
          console.log(
            `PredictHQ fetchEventsForSavedLocation attempt ${attempt}/${maxAttempts} for location_id:`,
            savedLocationId
          );
          events = await fetchEventsForSavedLocation({ savedLocationId, startDate, endDate });
          lastError = null;
          break;
        } catch (error) {
          lastError = error;
          const isNotFound = /\(404\)/.test(String(error?.message || ""));
          if (!isNotFound || attempt === maxAttempts) {
            throw error;
          }
          const backoffMs = 2000 * attempt;
          console.log(
            `PredictHQ location not yet indexed, retrying in ${backoffMs}ms (attempt ${attempt}/${maxAttempts})...`
          );
          await sleep(backoffMs);
        }
      }

      if (lastError) {
        throw lastError;
      }

      return events.map(toUiEvent);
    } finally {
      await deleteSavedLocation(savedLocationId);
    }
  },
};
