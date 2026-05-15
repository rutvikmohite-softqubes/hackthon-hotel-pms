import { useEffect, useMemo, useState } from "react";
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
import FormSection from "../components/forms/FormSection";
import SelectInput from "../components/forms/SelectInput";
import TextInput from "../components/forms/TextInput";
import { CLASSIFICATION_OPTIONS, MODULE_OPTIONS } from "../data/constants";
import { portfolioService } from "../services/portfolioService";
import { propertyService } from "../services/propertyService";
import { portfolioDefaultValues } from "../validations/portfolioSchema";

const PortfolioSetupPage = () => {
  const [loading, setLoading] = useState(false);
  const [portfolios, setPortfolios] = useState([]);
  const [properties, setProperties] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: portfolioDefaultValues,
  });

  const propertyOptions = useMemo(
    () =>
      properties.map((property) => ({
        label: property.propertyName,
        value: property.id,
      })),
    [properties]
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [portfolioData, propertyData] = await Promise.all([
        portfolioService.list(),
        propertyService.list(),
      ]);
      setPortfolios(portfolioData);
      setProperties(propertyData);
    } catch (error) {
      setSnackbar({ open: true, message: error.message || "Failed to load data.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      await portfolioService.create(values);
      await loadData();
      reset(portfolioDefaultValues);
      setSnackbar({ open: true, message: "Portfolio saved successfully.", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: error.message || "Failed to save portfolio.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const tableRows = useMemo(
    () =>
      portfolios.map((portfolio) => ({
        id: portfolio.id,
        code: portfolio.code,
        name: portfolio.name,
        classification: portfolio.classification,
        module: portfolio.module,
        property: properties.find((property) => property.id === portfolio.propertyId)?.propertyName || "-",
        manager: portfolio.manager,
        distribution: portfolio.distribution,
      })),
    [portfolios, properties]
  );

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
          boxShadow:
            theme.palette.mode === "light"
              ? "0 2px 10px rgba(15, 23, 42, 0.07)"
              : "0 10px 24px rgba(0, 0, 0, 0.28)",
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
            Add Portfolio Setup
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              <FormSection title="Portfolio Information">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}><TextInput name="code" control={control} label="Portfolio Code" /></Grid>
                  <Grid item xs={12} md={3}><TextInput name="name" control={control} label="Portfolio Name" /></Grid>
                  <Grid item xs={12} md={3}><SelectInput name="classification" control={control} label="Classification" options={CLASSIFICATION_OPTIONS} /></Grid>
                  <Grid item xs={12} md={3}><TextInput name="manager" control={control} label="Primary Manager" /></Grid>
                  <Grid item xs={12} md={4}><SelectInput name="module" control={control} label="Module" options={MODULE_OPTIONS} /></Grid>
                  <Grid item xs={12} md={4}>
                    <SelectInput
                      name="propertyId"
                      control={control}
                      label="Property Name"
                      options={propertyOptions}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}><TextInput name="secondaryManager" control={control} label="Secondary Manager" /></Grid>
                  <Grid item xs={12}><TextInput name="distribution" control={control} label="Distribution" multiline minRows={2} /></Grid>
                </Grid>
              </FormSection>

              <Divider />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="flex-end">
                <Button variant="outlined" color="inherit" onClick={() => reset(portfolioDefaultValues)}>
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
        Records: {properties.length} properties, {portfolios.length} portfolios
      </Typography>

      <DataTable
        title="Saved Portfolios"
        columns={[
          { id: "code", label: "Code" },
          { id: "name", label: "Name" },
          { id: "classification", label: "Classification" },
          { id: "module", label: "Module" },
          { id: "property", label: "Property" },
          { id: "manager", label: "Manager" },
          { id: "distribution", label: "Distribution" },
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

export default PortfolioSetupPage;
