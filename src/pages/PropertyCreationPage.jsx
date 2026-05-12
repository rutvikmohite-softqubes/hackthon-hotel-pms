import { useEffect, useMemo, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";

import AppSnackbar from "../components/common/AppSnackbar";
import DataTable from "../components/common/DataTable";
import LoadingOverlay from "../components/common/LoadingOverlay";
import FileUpload from "../components/forms/FileUpload";
import FormSection from "../components/forms/FormSection";
import RadioGroupInput from "../components/forms/RadioGroupInput";
import SelectInput from "../components/forms/SelectInput";
import TextInput from "../components/forms/TextInput";
import {
  BRAND_OPTIONS,
  CHAIN_OPTIONS,
  CLASSIFICATION_OPTIONS,
  CURRENCY_OPTIONS,
  FRANCHISE_OPTIONS,
  PMS_OPTIONS,
  PMS_TYPE_OPTIONS,
  STATUS_OPTIONS,
  SYSTEM_TYPE_OPTIONS,
} from "../data/constants";
import { TIMEZONES } from "../data/timezones";
import { portfolioService } from "../services/portfolioService";
import { propertyService } from "../services/propertyService";
import { propertyDefaultValues, propertySchema } from "../validations/propertySchema";
import { fileToBase64 } from "../utils/file";

const PropertyCreationPage = () => {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [managers, setManagers] = useState([]);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: propertyDefaultValues,
    resolver: yupResolver(propertySchema),
  });

  const managerOptions = useMemo(
    () => managers.map((manager) => ({ label: manager.name, value: manager.id })),
    [managers]
  );

  const tableRows = useMemo(
    () =>
      properties.map((property) => ({
        id: property.id,
        propertyCode: property.propertyCode,
        propertyName: property.propertyName,
        status: property.status,
        manager: managers.find((manager) => manager.id === property.managerId)?.name || "-",
        city: property.city,
        country: property.country,
      })),
    [properties, managers]
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [propertyData, managerData, portfolioData] = await Promise.all([
        propertyService.list(),
        propertyService.listManagers(),
        portfolioService.list(),
      ]);
      setProperties(propertyData);
      setManagers(managerData);
      setPortfolioCount(portfolioData.length);
    } catch (error) {
      setSnackbar({ open: true, message: error.message || "Failed to load data.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSnackbar({ open: true, message: "Geolocation is not supported.", severity: "error" });
      return;
    }

    // Read device coordinates and push them into form controls.
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(6);
        const longitude = position.coords.longitude.toFixed(6);
        setValue("latitude", latitude);
        setValue("longitude", longitude);
        setValue("geoLocation", `${latitude}, ${longitude}`);
        setSnackbar({ open: true, message: "Location fetched successfully.", severity: "success" });
      },
      () => {
        setSnackbar({ open: true, message: "Unable to fetch current location.", severity: "error" });
      }
    );
  };

  const onSubmit = async (values) => {
    try {
      setLoading(true);

      let picture = null;
      if (values.picture) {
        // Persist image as Data URL because File objects cannot be stored in localStorage.
        picture = {
          name: values.picture.name,
          type: values.picture.type,
          dataUrl: await fileToBase64(values.picture),
        };
      }

      await propertyService.create({
        ...values,
        picture,
      });

      await loadData();
      reset(propertyDefaultValues);
      setSnackbar({ open: true, message: "Property created successfully.", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: error.message || "Failed to create property.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Paper
        sx={(theme) => ({
          borderRadius: 2,
          border: "1px solid",
          borderColor:
            theme.palette.mode === "light"
              ? "rgba(17, 24, 39, 0.1)"
              : "rgba(138, 160, 186, 0.2)",
          overflow: "hidden",
          backgroundColor: theme.palette.mode === "light" ? "#ffffff" : "#0b121b",
        })}
      >
        <Box
          sx={(theme) => ({
            px: { xs: 2, sm: 2.5 },
            py: 1.6,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background:
              theme.palette.mode === "light"
                ? "linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 100%)"
                : "linear-gradient(90deg, #0f1824 0%, #132334 100%)",
            borderBottom: "none",
          })}
        >
          <Typography
            variant="h6"
            sx={(theme) => ({
              fontWeight: 700,
              color: theme.palette.mode === "light" ? "#111827" : "#fff",
              letterSpacing: 0.3,
            })}
          >
            Add Property Setup
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              <FormSection
                title="Basic Property Information"
                sx={(theme) => ({
                  backgroundColor: theme.palette.mode === "light" ? "#ffffff" : "#0b121b",
                  borderColor:
                    theme.palette.mode === "light"
                      ? "rgba(17, 24, 39, 0.08)"
                      : "rgba(138, 160, 186, 0.2)",
                })}
              >
                {/* Flex layout: left panel fixed, right panel takes all remaining width */}
                <Box sx={{ display: { xs: "block", md: "flex" }, gap: 0 }}>

                  {/* LEFT: image + basic text fields */}
                  <Box
                    sx={{
                      width: { xs: "100%", md: "240px" },
                      flexShrink: 0,
                      pr: { xs: 0, md: 2.5 },
                      pb: { xs: 2.5, md: 0 },
                      borderRight: {
                        md: (theme) =>
                          theme.palette.mode === "light"
                            ? "1px solid rgba(17, 24, 39, 0.12)"
                            : "1px solid rgba(138, 160, 186, 0.25)",
                      },
                    }}
                  >
                    <Stack spacing={1.8}>
                      <FileUpload name="picture" control={control} label="Property Picture" hideLabel />
                      <RadioGroupInput name="status" control={control} label="Status" options={STATUS_OPTIONS} />
                      <TextInput name="propertyCode" control={control} label="Property Code" />
                      <TextInput name="propertyName" control={control} label="Property Name" />
                      <TextInput name="displayName" control={control} label="Display Name" />
                    </Stack>
                  </Box>

                  {/* RIGHT: fills ALL remaining width with 2-column CSS grid */}
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      pl: { xs: 0, md: 2.5 },
                      pt: { xs: 2.5, md: 0 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                        gap: "16px",
                        width: "100%",
                      }}
                    >
                      <SelectInput name="brand" control={control} label="Brand" options={BRAND_OPTIONS} />
                      <SelectInput name="franchise" control={control} label="Franchise" options={FRANCHISE_OPTIONS} />

                      <SelectInput name="pms" control={control} label="PMS" options={PMS_OPTIONS} />
                      <SelectInput name="pmsType" control={control} label="PMS Type" options={PMS_TYPE_OPTIONS} />

                      <SelectInput name="chain" control={control} label="Chain" options={CHAIN_OPTIONS} />
                      <SelectInput name="classification" control={control} label="Classification" options={CLASSIFICATION_OPTIONS} />

                      <SelectInput name="timezone" control={control} label="Timezone" options={TIMEZONES} />
                      <SelectInput name="currency" control={control} label="Currency" options={CURRENCY_OPTIONS} />

                      <SelectInput name="managerId" control={control} label="Manager" options={managerOptions} />
                      <SelectInput name="systemType" control={control} label="System Type" options={SYSTEM_TYPE_OPTIONS} />

                      <TextInput name="webUrl" control={control} label="Web URL" />
                      <TextInput name="brandUrl" control={control} label="Brand URL" />

                      <TextInput name="eventRadius" control={control} label="Event Radius" type="number" />
                      <TextInput name="geoLocation" control={control} label="Geo Location" />

                      <Box sx={{ gridColumn: "1 / -1" }}>
                        <Button
                          variant="outlined"
                          onClick={handleGetCurrentLocation}
                          sx={{ minWidth: 210 }}
                        >
                          Get Current Location
                        </Button>
                      </Box>
                    </Box>
                  </Box>

                </Box>
              </FormSection>

              <FormSection title="Contact Information">
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}><TextInput name="contactName" control={control} label="Contact Name" /></Grid>
              <Grid item xs={12} md={4}><TextInput name="email" control={control} label="Email" /></Grid>
              <Grid item xs={12} md={4}><TextInput name="mobileNo" control={control} label="Mobile No" /></Grid>
              <Grid item xs={12} md={4}><TextInput name="contactNo" control={control} label="Contact No" /></Grid>
              <Grid item xs={12} md={8}><TextInput name="address" control={control} label="Address" multiline minRows={2} /></Grid>
              <Grid item xs={12} md={3}><TextInput name="city" control={control} label="City" /></Grid>
              <Grid item xs={12} md={3}><TextInput name="state" control={control} label="State" /></Grid>
              <Grid item xs={12} md={3}><TextInput name="country" control={control} label="Country" /></Grid>
              <Grid item xs={12} md={3}><TextInput name="zipCode" control={control} label="Zip Code" /></Grid>
            </Grid>
          </FormSection>

              <Divider />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="flex-end">
                <Button variant="outlined" color="inherit" onClick={() => reset(propertyDefaultValues)}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit" disabled={isSubmitting || loading}>
                  Submit
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Paper>

      <Typography variant="body2" color="text.secondary" sx={{ px: 0.5 }}>
        Records: {properties.length} properties, {portfolioCount} portfolios
      </Typography>

      <DataTable
        title="Saved Properties"
        columns={[
          { id: "propertyCode", label: "Property Code" },
          { id: "propertyName", label: "Property Name" },
          { id: "status", label: "Status" },
          { id: "manager", label: "Manager" },
          { id: "city", label: "City" },
          { id: "country", label: "Country" },
        ]}
        rows={tableRows}
      />

      <LoadingOverlay open={loading} />
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Stack>
  );
};

export default PropertyCreationPage;
