import { useEffect, useMemo, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";

import AppSnackbar from "../components/common/AppSnackbar";
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
  MODULE_OPTIONS,
  PMS_OPTIONS,
  PMS_TYPE_OPTIONS,
  STATUS_OPTIONS,
  SYSTEM_TYPE_OPTIONS,
} from "../data/constants";
import { TIMEZONES } from "../data/timezones";
import { portfolioService } from "../services/portfolioService";
import { propertyService } from "../services/propertyService";
import { unifiedOnboardingDefaults } from "../validations/unifiedOnboardingSchema";
import { fileToBase64 } from "../utils/file";

import { useLocation } from "react-router-dom";

const PMS_DETAILS_OPTIONS = ["Choice", "Redroof", "OperaCloud"];
const REPORTS_ON_EMAIL_OPTIONS = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

const steps = [
  "Property Information",
  "Portfolio Setup",
  "Events",
  "PMS Details",
  "Review & Submit",
];

const eventTableColumns = [
  { id: "name", label: "Name" },
  { id: "type", label: "Type" },
  { id: "impact", label: "Impact" },
  { id: "startDate", label: "Start Date" },
  { id: "endDate", label: "End Date" },
];

const eventTableRows = [
  { id: "evt-001", name: "New Year's Day", type: "Holiday", impact: "High", startDate: "01/01/2026", endDate: "01/01/2026" },
  { id: "evt-002", name: "Independence Day", type: "Holiday", impact: "High", startDate: "07/04/2026", endDate: "07/04/2026" },
  { id: "evt-003", name: "Veterans Day", type: "Holiday", impact: "Mid", startDate: "11/11/2026", endDate: "11/11/2026" },
  { id: "evt-004", name: "Thanksgiving", type: "Holiday", impact: "High", startDate: "11/26/2026", endDate: "11/26/2026" },
  {
    id: "evt-005",
    name: "Washington's Birthday - Long Weekend",
    type: "Holiday",
    impact: "Mid",
    startDate: "02/14/2026",
    endDate: "02/16/2026",
  },
  {
    id: "evt-006",
    name: "Memorial Day - Long Weekend",
    type: "Holiday",
    impact: "High",
    startDate: "05/23/2026",
    endDate: "05/25/2026",
  },
  {
    id: "evt-007",
    name: "Juneteenth - Long Weekend",
    type: "Holiday",
    impact: "Mid",
    startDate: "06/19/2026",
    endDate: "06/21/2026",
  },
  {
    id: "evt-008",
    name: "Labor Day - Long Weekend",
    type: "Holiday",
    impact: "Mid",
    startDate: "09/05/2026",
    endDate: "09/07/2026",
  },
  { id: "evt-009", name: "Oak Brook Home Show", type: "Expos", impact: "-", startDate: "02/14/2026", endDate: "02/15/2026" },
  {
    id: "evt-010",
    name: "Construction Expo & Safety Conference",
    type: "Expos",
    impact: "-",
    startDate: "03/02/2026",
    endDate: "03/04/2026",
  },
  {
    id: "evt-011",
    name: "Body Mind Spirit Celebration",
    type: "Expos",
    impact: "-",
    startDate: "03/07/2026",
    endDate: "03/09/2026",
  },
  {
    id: "evt-012",
    name: "Riot Fest (Chicago) at Douglass Park",
    type: "Festivals",
    impact: "-",
    startDate: "09/19/2026",
    endDate: "09/20/2026",
  },
  {
    id: "evt-013",
    name: "Meet the SeatGeek Sidekicks - Effie",
    type: "Sports",
    impact: "-",
    startDate: "01/02/2026",
    endDate: "01/02/2026",
  },
  {
    id: "evt-014",
    name: "TESTING ONLY: Meet the SeatGeek Sidekicks - K6 Load Test",
    type: "Sports",
    impact: "-",
    startDate: "01/02/2026",
    endDate: "01/02/2026",
  },
];

const stepFieldMap = [
  [
    "picture",
    "status",
    "propertyCode",
    "propertyName",
    "displayName",
    "brand",
    "franchise",
    "pms",
    "pmsType",
    "chain",
    "classification",
    "timezone",
    "currency",
    "managerId",
    "systemType",
    "geoLocation",
    "eventRadius",
    "contactName",
    "email",
    "mobileNo",
    "address",
    "city",
    "state",
    "country",
    "zipCode",
  ],
  [
    "portfolioCode",
    "portfolioName",
    "portfolioClassification",
    "portfolioManager",
    "portfolioModule",
    "portfolioPropertyName",
    "portfolioSecondaryManager",
    "portfolioDistribution",
    "addPortfolioSetupCode",
    "addPortfolioSetupName",
    "addPortfolioSetupClassification",
    "addPortfolioSetupManagerId",
    "addPortfolioSetupDetail",
  ],
  [
  ],
  [
    "pmsDetailsSelection",
    "isReportsOnEmail",
    "reservationStartDate",
    "reservationEndDate",
    "occupancyStartDate",
    "occupancyEndDate",
    "reportsReceiverEmail",
    "yourEmail",
    "reservationFileLabelName",
    "occupancyFileLabelName",
    "cancellationFileLabelName",
  ],
  [],
];

const Connector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 14,
    left: "calc(-50% + 14px)",
    right: "calc(50% + 14px)",
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === "light" ? "#9ec9ef" : "#3b82f6",
    borderTopWidth: 2,
    borderRadius: 3,
  },
}));

const StepDotRoot = styled("div")(({ theme, ownerState }) => ({
  width: 28,
  height: 28,
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  fontSize: 14,
  color: "#fff",
  transition: "all 0.2s ease",
  backgroundColor: ownerState.active || ownerState.completed ? "#3ba8ff" : "#dbe7f4",
  boxShadow:
    ownerState.active || ownerState.completed
      ? "0 0 0 6px rgba(59, 168, 255, 0.18), 0 6px 16px rgba(59, 168, 255, 0.32)"
      : "none",
}));

const StepDot = (props) => {
  const { active, completed, icon } = props;
  return (
    <StepDotRoot ownerState={{ active, completed }}>
      {completed ? <CheckIcon sx={{ fontSize: 16 }} /> : icon}
    </StepDotRoot>
  );
};

const deriveFallbackCoordinates = (input) => {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }

  const normalized = Math.abs(hash);
  const latitude = ((normalized % 1800000) / 10000) - 90;
  const longitude = ((Math.floor(normalized / 13) % 3600000) / 10000) - 180;

  return {
    latitude: latitude.toFixed(6),
    longitude: longitude.toFixed(6),
  };
};

const geocodePropertyName = async (propertyName) => {
  const endpoint = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(propertyName)}`;
  const response = await fetch(endpoint, { headers: { Accept: "application/json" } });

  if (!response.ok) {
    throw new Error("Failed to geocode property name.");
  }

  const locations = await response.json();
  const location = locations?.[0];
  if (!location) {
    throw new Error("No geocode result found.");
  }

  return {
    latitude: Number(location.lat).toFixed(6),
    longitude: Number(location.lon).toFixed(6),
  };
};

const UnifiedOnboardingPage = () => {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState([]);
  const [emailListModalOpen, setEmailListModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [selectedEventIds, setSelectedEventIds] = useState([]);
  const location = useLocation();

  const {
    control,
    handleSubmit,
    trigger,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: unifiedOnboardingDefaults,
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });

  const watchedPropertyName = watch("propertyName");
  const watchedPmsDetailsSelection = watch("pmsDetailsSelection");
  const watchedIsReportsOnEmail = watch("isReportsOnEmail");

  const isOperaCloud = useMemo(
    () => String(watchedPmsDetailsSelection || "").trim().toLowerCase().replace(/\s+/g, "") === "operacloud",
    [watchedPmsDetailsSelection]
  );
  const isChoice = useMemo(
    () => String(watchedPmsDetailsSelection || "").trim().toLowerCase() === "choice",
    [watchedPmsDetailsSelection]
  );
  const todayIsoDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {

    const loadManagers = async () => {
      try {
        const managerData = await propertyService.listManagers();
        setManagers(managerData);
      } catch (error) {
        setSnackbar({ open: true, message: error.message || "Failed to load managers.", severity: "error" });
      }
    };

    loadManagers();
  }, []);

  useEffect(() => {
    if (watchedPropertyName) {
      setValue("portfolioPropertyName", watchedPropertyName, { shouldValidate: true });
    }
  }, [setValue, watchedPropertyName]);

  useEffect(() => {

    // Clear geoLocation when propertyName is cleared
    if (!watchedPropertyName?.trim()) {
      setValue("geoLocation", "", { shouldValidate: false });
      return;
    }
    let cancelled = false;

    const timeoutId = setTimeout(() => {
      (async () => {
        try {
          const { latitude, longitude } = await geocodePropertyName(watchedPropertyName.trim());
          if (!cancelled) {
            setValue("geoLocation", `${latitude}, ${longitude}`, { shouldValidate: false });
          }
        } catch {
          const { latitude, longitude } = deriveFallbackCoordinates(watchedPropertyName.trim());
          if (!cancelled) {
            setValue("geoLocation", `${latitude}, ${longitude}`, { shouldValidate: false });
          }
        }
      })();
    }, 650);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [setValue, watchedPropertyName]);

  useEffect(() => {
    if (isChoice && watchedIsReportsOnEmail !== "No") {
      setValue("isReportsOnEmail", "No", { shouldValidate: false });
      return;
    }

    if (isOperaCloud && watchedIsReportsOnEmail !== "Yes") {
      setValue("isReportsOnEmail", "Yes", { shouldValidate: false });
    }
  }, [isChoice, isOperaCloud, setValue, watchedIsReportsOnEmail]);

  useEffect(() => {
    if (watchedIsReportsOnEmail === "No") {
      setValue("reportsReceiverEmail", "", { shouldValidate: false });
      setValue("yourEmail", "", { shouldValidate: false });
      setValue("reservationFileLabelName", "", { shouldValidate: false });
      setValue("occupancyFileLabelName", "", { shouldValidate: false });
      setValue("cancellationFileLabelName", "", { shouldValidate: false });
      return;
    }

    setValue("reservationStartDate", "", { shouldValidate: false });
    setValue("reservationEndDate", "", { shouldValidate: false });
    setValue("occupancyStartDate", "", { shouldValidate: false });
    setValue("occupancyEndDate", "", { shouldValidate: false });

    if (!isOperaCloud) {
      setValue("reportsReceiverEmail", "", { shouldValidate: false });
      setValue("yourEmail", "", { shouldValidate: false });
      setValue("reservationFileLabelName", "", { shouldValidate: false });
      setValue("occupancyFileLabelName", "", { shouldValidate: false });
      setValue("cancellationFileLabelName", "", { shouldValidate: false });
    }
  }, [isOperaCloud, setValue, watchedIsReportsOnEmail]);

  const managerOptions = useMemo(
    () => managers.map((manager) => ({ label: manager.name, value: manager.id })),
    [managers]
  );

  const selectedEvents = useMemo(
    () => eventTableRows.filter((row) => selectedEventIds.includes(row.id)),
    [selectedEventIds]
  );

  const allEventsSelected = selectedEventIds.length > 0 && selectedEventIds.length === eventTableRows.length;
  const partiallySelected = selectedEventIds.length > 0 && selectedEventIds.length < eventTableRows.length;

  const handleToggleAllEvents = (isChecked) => {
    setSelectedEventIds(isChecked ? eventTableRows.map((event) => event.id) : []);
  };

  const handleToggleEvent = (eventId) => {
    setSelectedEventIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const handleNext = async () => {
    const fields = stepFieldMap[activeStep] || [];
    const valid = await trigger(fields, { shouldFocus: true });
    if (!valid) {
      setSnackbar({ open: true, message: "Please complete required fields before continuing.", severity: "error" });
      return;
    }

    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = async (values) => {
    try {
      setLoading(true);

      let picture = null;
      if (values.picture) {
        picture = {
          name: values.picture.name,
          type: values.picture.type,
          dataUrl: await fileToBase64(values.picture),
        };
      }

      const propertyPayload = {
        picture,
        status: values.status,
        propertyCode: values.propertyCode,
        propertyName: values.propertyName,
        displayName: values.displayName,
        brand: values.brand,
        franchise: values.franchise,
        pms: values.pms,
        pmsType: values.pmsType,
        chain: values.chain,
        classification: values.classification,
        timezone: values.timezone,
        currency: values.currency,
        managerId: values.managerId,
        systemType: values.systemType,
        webUrl: values.webUrl,
        brandUrl: values.brandUrl,
        geoLocation: values.geoLocation,
        eventRadius: values.eventRadius,
        contactName: values.contactName,
        email: values.email,
        mobileNo: values.mobileNo,
        contactNo: values.contactNo,
        address: values.address,
        city: values.city,
        state: values.state,
        country: values.country,
        zipCode: values.zipCode,
      };

      const createdProperty = await propertyService.create(propertyPayload);

      const addPortfolioManagerName =
        managerOptions.find((item) => item.value === values.addPortfolioSetupManagerId)?.label || "";

      const portfolioPayload = {
        code: values.portfolioCode,
        name: values.portfolioName,
        classification: values.portfolioClassification,
        manager: values.portfolioManager,
        module: values.portfolioModule,
        propertyId: createdProperty.id,
        secondaryManager: values.portfolioSecondaryManager,
        distribution: values.portfolioDistribution,
        portfolioSetupAddOn: {
          code: values.addPortfolioSetupCode,
          name: values.addPortfolioSetupName,
          classification: values.addPortfolioSetupClassification,
          manager: addPortfolioManagerName,
          detail: values.addPortfolioSetupDetail,
        },
      };
      await portfolioService.create(portfolioPayload);

      const pmsDetailsPayload = {
        id: Date.now().toString(),
        propertyId: createdProperty.id,
        pmsSelection: values.pmsDetailsSelection,
        isReportsOnEmail: values.isReportsOnEmail,
        reservationStartDate: values.reservationStartDate,
        reservationEndDate: values.reservationEndDate,
        occupancyStartDate: values.occupancyStartDate,
        occupancyEndDate: values.occupancyEndDate,
        reportsReceiverEmail: values.reportsReceiverEmail,
        yourEmail: values.yourEmail,
        reservationFileLabelName: values.reservationFileLabelName,
        occupancyFileLabelName: values.occupancyFileLabelName,
        cancellationFileLabelName: values.cancellationFileLabelName,
        selectedEventIds,
        selectedEvents,
        createdAt: new Date().toISOString(),
      };
      const existingPmsDetails = JSON.parse(localStorage.getItem("hotelPms.pmsDetailsConfigs") || "[]");
      localStorage.setItem("hotelPms.pmsDetailsConfigs", JSON.stringify([pmsDetailsPayload, ...existingPmsDetails]));

      reset(unifiedOnboardingDefaults);
      setSelectedEventIds([]);
      setActiveStep(0);
      setSnackbar({
        open: true,
        message: "Property, portfolio, and PMS details submitted successfully.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({ open: true, message: error.message || "Failed to submit onboarding.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const renderPropertyStep = () => (
    <Stack spacing={2.5}>
      <FormSection title="Basic Information">
        <Box sx={{ display: { xs: "block", md: "flex" } }}>
          <Box
            sx={{
              width: { xs: "100%", md: 250 },
              flexShrink: 0,
              pr: { md: 2.5 },
              pb: { xs: 2.5, md: 0 },
              borderRight: { md: "1px solid", xs: "none" },
              borderColor: "divider",
            }}
          >
            <Stack spacing={1.6}>
              <FileUpload name="picture" control={control} label="Property Picture" hideLabel />
              <RadioGroupInput name="status" control={control} label="Status" options={STATUS_OPTIONS} />
              <TextInput name="propertyCode" control={control} label="Property Code" />
              <TextInput name="propertyName" control={control} label="Property Name" />
              <TextInput name="displayName" control={control} label="Display Name" />
            </Stack>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0, pl: { md: 2.5 }, pt: { xs: 2.5, md: 0 } }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
                gap: 2,
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
            </Box>
          </Box>
        </Box>
      </FormSection>

      <FormSection title="Contact Information">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
            gap: 2,
          }}
        >
          <TextInput name="contactName" control={control} label="Contact Name" />
          <TextInput name="email" control={control} label="Email" />
          <TextInput name="mobileNo" control={control} label="Mobile No" />
          <TextInput name="contactNo" control={control} label="Contact No" />
          <TextInput name="address" control={control} label="Address" multiline minRows={2} />
          <TextInput name="city" control={control} label="City" />
          <TextInput name="state" control={control} label="State" />
          <TextInput name="country" control={control} label="Country" />
          <TextInput name="zipCode" control={control} label="Zip Code" />
        </Box>
      </FormSection>

      <FormSection title="Module">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
            gap: 2,
            alignItems: "end",
          }}
        >
          <SelectInput 
            name="module" 
            control={control} 
            label="Module" 
            options={MODULE_OPTIONS} 
          />
          <Button 
            variant="outlined" 
            startIcon={<Typography>+</Typography>}
            sx={{ height: "40px" }}
            onClick={() => setEmailListModalOpen(true)}
          >
            Email List {emailList.length > 0 && `(${emailList.length})`}
          </Button>
          <SelectInput 
            name="moduleStatus" 
            control={control} 
            label="Status" 
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" }
            ]} 
          />
        </Box>
      </FormSection>
    </Stack>
  );

  const renderPortfolioStep = () => (
    <Stack spacing={2.5}>
      <FormSection title="Add Portfolio Setup">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            gap: 2,
          }}
        >
          <TextInput name="addPortfolioSetupCode" control={control} label="Code" />
          <TextInput name="addPortfolioSetupName" control={control} label="Name" />
          <SelectInput
            name="addPortfolioSetupClassification"
            control={control}
            label="Classification"
            options={CLASSIFICATION_OPTIONS}
          />
          <SelectInput
            name="addPortfolioSetupManagerId"
            control={control}
            label="Manager"
            options={managerOptions}
          />
          <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
            <TextInput name="addPortfolioSetupDetail" control={control} label="Detail" multiline minRows={3} />
          </Box>
        </Box>
      </FormSection>
    </Stack>
  );

  const renderPmsDetailsStep = () => (
    <FormSection title="PMS Details">
      <Stack spacing={2.5}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
            gap: 2,
          }}
        >
          <SelectInput name="pmsDetailsSelection" control={control} label="PMS Selection" options={PMS_DETAILS_OPTIONS} />
          <RadioGroupInput
            name="isReportsOnEmail"
            control={control}
            label="Is Reports On Email"
            options={REPORTS_ON_EMAIL_OPTIONS}
          />
        </Box>

        {watchedIsReportsOnEmail === "No" && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
              gap: 2,
            }}
          >
            <TextInput
              name="reservationStartDate"
              control={control}
              label="Reservation Start Date"
              type="date"
              inputProps={{ max: todayIsoDate }}
            />
            <TextInput
              name="reservationEndDate"
              control={control}
              label="Reservation End Date"
              type="date"
              inputProps={{ max: todayIsoDate }}
            />
            <Box />
            <TextInput
              name="occupancyStartDate"
              control={control}
              label="Occupancy Start Date"
              type="date"
            />
            <TextInput
              name="occupancyEndDate"
              control={control}
              label="Occupancy End Date"
              type="date"
            />
          </Box>
        )}

        {watchedIsReportsOnEmail === "Yes" && isOperaCloud && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
              gap: 2,
            }}
          >
            <TextInput name="reportsReceiverEmail" control={control} label="Reports Receiver Email" />
            <TextInput name="yourEmail" control={control} label="Your Email" />
            <Box />
            <TextInput name="reservationFileLabelName" control={control} label="Reservation File Label Name" />
            <TextInput name="occupancyFileLabelName" control={control} label="Occupancy File Label Name" />
            <TextInput name="cancellationFileLabelName" control={control} label="Cancellation File Label Name" />
          </Box>
        )}
      </Stack>
    </FormSection>
  );

  const renderEventsStep = () => (
    <FormSection title="Events">
      <Stack spacing={1.5}>
        <Typography variant="body2" color="text.secondary">
          Selected events: {selectedEventIds.length}
        </Typography>

        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={allEventsSelected}
                    indeterminate={partiallySelected}
                    onChange={(event) => handleToggleAllEvents(event.target.checked)}
                    inputProps={{ "aria-label": "Select all events" }}
                  />
                </TableCell>
                {eventTableColumns.map((column) => (
                  <TableCell key={column.id} sx={{ fontWeight: 700 }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {eventTableRows.map((eventRow) => {
                const isChecked = selectedEventIds.includes(eventRow.id);

                return (
                  <TableRow key={eventRow.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isChecked}
                        onChange={() => handleToggleEvent(eventRow.id)}
                        inputProps={{ "aria-label": `Select ${eventRow.name}` }}
                      />
                    </TableCell>
                    <TableCell>{eventRow.name}</TableCell>
                    <TableCell>{eventRow.type}</TableCell>
                    <TableCell>{eventRow.impact}</TableCell>
                    <TableCell>{eventRow.startDate}</TableCell>
                    <TableCell>{eventRow.endDate}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </FormSection>
  );

  const renderReviewStep = () => {
    const values = watch();

    return (
      <FormSection title="Review Before Submit">
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}><Typography variant="body2" color="text.secondary">Property</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{values.propertyName || "-"}</Typography></Grid>
          <Grid item xs={12} md={4}><Typography variant="body2" color="text.secondary">Property Code</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{values.propertyCode || "-"}</Typography></Grid>
          <Grid item xs={12} md={4}><Typography variant="body2" color="text.secondary">Manager</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{managerOptions.find((item) => item.value === values.managerId)?.label || "-"}</Typography></Grid>
          <Grid item xs={12} md={4}><Typography variant="body2" color="text.secondary">Portfolio</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{values.portfolioName || "-"}</Typography></Grid>
          <Grid item xs={12} md={4}><Typography variant="body2" color="text.secondary">Portfolio Module</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{values.portfolioModule || "-"}</Typography></Grid>
          <Grid item xs={12} md={4}><Typography variant="body2" color="text.secondary">Distribution</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{values.portfolioDistribution || "-"}</Typography></Grid>
          <Grid item xs={12} md={4}><Typography variant="body2" color="text.secondary">Add setup — Code</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{values.addPortfolioSetupCode || "-"}</Typography></Grid>
          <Grid item xs={12} md={4}><Typography variant="body2" color="text.secondary">Add setup — Name</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{values.addPortfolioSetupName || "-"}</Typography></Grid>
          <Grid item xs={12} md={4}><Typography variant="body2" color="text.secondary">Add setup — Manager</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{managerOptions.find((item) => item.value === values.addPortfolioSetupManagerId)?.label || "-"}</Typography></Grid>
          <Grid item xs={12} md={4}><Typography variant="body2" color="text.secondary">Add setup — Classification</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{values.addPortfolioSetupClassification || "-"}</Typography></Grid>
          <Grid item xs={12} md={8}><Typography variant="body2" color="text.secondary">Add setup — Detail</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{values.addPortfolioSetupDetail || "-"}</Typography></Grid>
          <Grid item xs={12} md={4}><Typography variant="body2" color="text.secondary">PMS Details Selection</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{values.pmsDetailsSelection || "-"}</Typography></Grid>
          <Grid item xs={12} md={4}><Typography variant="body2" color="text.secondary">Reports On Email</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{values.isReportsOnEmail || "-"}</Typography></Grid>
          <Grid item xs={12} md={4}><Typography variant="body2" color="text.secondary">Selected Events</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedEventIds.length}</Typography></Grid>
        </Grid>
      </FormSection>
    );
  };

  return (
    <Stack spacing={3}>
      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box
          sx={(theme) => ({
            px: { xs: 2, sm: 2.5 },
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            background:
              theme.palette.mode === "light"
                ? "linear-gradient(90deg, #ecf3fa 0%, #f5f8fb 100%)"
                : "linear-gradient(90deg, #0f1824 0%, #132334 100%)",
          })}
        >
          <SettingsSuggestIcon sx={{ color: "primary.main" }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Smart Onboarding Wizard</Typography>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Stepper alternativeLabel activeStep={activeStep} connector={<Connector />} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={StepDot}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              <Box sx={{ display: activeStep === 0 ? "block" : "none" }}>{renderPropertyStep()}</Box>
              <Box sx={{ display: activeStep === 1 ? "block" : "none" }}>{renderPortfolioStep()}</Box>
              <Box sx={{ display: activeStep === 2 ? "block" : "none" }}>{renderEventsStep()}</Box>
              <Box sx={{ display: activeStep === 3 ? "block" : "none" }}>{renderPmsDetailsStep()}</Box>
              <Box sx={{ display: activeStep === 4 ? "block" : "none" }}>{renderReviewStep()}</Box>

              <Divider />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="space-between">
                <Button variant="outlined" color="inherit" disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>

                <Box sx={{ display: "flex", gap: 1.2 }}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => {
                      reset(unifiedOnboardingDefaults);
                      setSelectedEventIds([]);
                      setActiveStep(0);
                    }}
                  >
                    Reset
                  </Button>

                  {activeStep < steps.length - 1 ? (
                    <Button variant="contained" onClick={handleNext}>Next</Button>
                  ) : (
                    <Button variant="contained" type="submit" disabled={isSubmitting || loading}>
                      Submit All
                    </Button>
                  )}
                </Box>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Paper>

      <Modal
        open={emailListModalOpen}
        onClose={() => setEmailListModalOpen(false)}
        aria-labelledby="email-list-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 0,
          }}
        >
          <Typography id="email-list-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
            Email List
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              variant="outlined"
              size="small"
            />
            <Button 
              variant="contained" 
              onClick={() => {
                if (emailInput.trim()) {
                  setEmailList([...emailList, emailInput.trim()]);
                  setEmailInput("");
                }
              }}
            >
              Add
            </Button>
          </Box>

          {emailList.length > 0 && (
            <Box sx={{ mb: 3, maxHeight: 200, overflow: "auto" }}>
              {emailList.map((email, index) => (
                <Box key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1 }}>
                  <Typography variant="body2">{email}</Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => setEmailList(emailList.filter((_, i) => i !== index))}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button 
              variant="contained" 
              onClick={() => {
                setEmailListModalOpen(false);
                // Handle done logic here
              }}
            >
              Done
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setEmailListModalOpen(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Stack>
  );
};

export default UnifiedOnboardingPage;
