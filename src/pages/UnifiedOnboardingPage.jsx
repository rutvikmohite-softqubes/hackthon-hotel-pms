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
import MenuItem from "@mui/material/MenuItem";
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
import TablePagination from "@mui/material/TablePagination";
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
import { predictHqService } from "../services/predictHqService";
import { propertyService } from "../services/propertyService";
import { userService } from "../services/userService";
import { configurationService } from "../services/configurationService";
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

const impactOptions = ["High", "Mid", "Low"];

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
  const [eventRows, setEventRows] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [lastEventFetchKey, setLastEventFetchKey] = useState("");
  const [eventsPage, setEventsPage] = useState(0);
  const [eventsRowsPerPage, setEventsRowsPerPage] = useState(10);
  const [configTerms, setConfigTerms] = useState({});
  const [portfolioRows, setPortfolioRows] = useState([
    { id: 1, module: "", property: "", managerId: "", distribution: [] },
  ]);
  const [distributionModalOpen, setDistributionModalOpen] = useState(false);
  const [activeDistributionRowId, setActiveDistributionRowId] = useState(null);
  const [distributionInput, setDistributionInput] = useState("");
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
  const watchedGeoLocation = watch("geoLocation");
  const watchedEventRadius = watch("eventRadius");
  const watchedPms = watch("pms");

  const isOperaCloud = useMemo(
    () => String(watchedPms || "").trim().toLowerCase().replace(/\s+/g, "") === "operacloud",
    [watchedPms]
  );
  const isChoice = useMemo(
    () => String(watchedPms || "").trim().toLowerCase() === "choice",
    [watchedPms]
  );
  const todayIsoDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {

    const loadManagers = async () => {
      try {
        const managerData = await userService.listManagers();
        setManagers(managerData);
      } catch (error) {
        console.error("Failed to load managers from User/getlist:", error);
        // Fallback to the existing mock managers service so the UI still works.
        try {
          const fallback = await propertyService.listManagers();
          setManagers(fallback);
        } catch (fallbackError) {
          setSnackbar({
            open: true,
            message: fallbackError.message || error.message || "Failed to load managers.",
            severity: "error",
          });
        }
      }
    };

    loadManagers();

    const loadConfigTerms = async () => {
      try {
        const grouped = await configurationService.getTermsByCategories();
        setConfigTerms(grouped);
      } catch (error) {
        console.error("Failed to load configuration terms:", error);
      }
    };

    loadConfigTerms();
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
    // Mirror the Step 1 PMS value into the PMS Details selection so the
    // existing payload/review screens continue to work.
    setValue("pmsDetailsSelection", watchedPms || "", { shouldValidate: false });
  }, [setValue, watchedPms]);

  useEffect(() => {
    if (isChoice) {
      // Choice flow uses username/password/twilio + reservation/occupancy dates.
      setValue("reportsReceiverEmail", "", { shouldValidate: false });
      setValue("yourEmail", "", { shouldValidate: false });
      setValue("reservationFileLabelName", "", { shouldValidate: false });
      setValue("occupancyFileLabelName", "", { shouldValidate: false });
      setValue("cancellationFileLabelName", "", { shouldValidate: false });
      return;
    }

    if (isOperaCloud) {
      // OperaCloud flow uses email/file label fields, not the dates or Choice creds.
      setValue("reservationStartDate", "", { shouldValidate: false });
      setValue("reservationEndDate", "", { shouldValidate: false });
      setValue("occupancyStartDate", "", { shouldValidate: false });
      setValue("occupancyEndDate", "", { shouldValidate: false });
      setValue("pmsUsername", "", { shouldValidate: false });
      setValue("pmsPassword", "", { shouldValidate: false });
      setValue("pmsTwilioNumber", "", { shouldValidate: false });
      return;
    }

    // For any other PMS, clear the flow-specific fields.
    setValue("pmsUsername", "", { shouldValidate: false });
    setValue("pmsPassword", "", { shouldValidate: false });
    setValue("pmsTwilioNumber", "", { shouldValidate: false });
    setValue("reportsReceiverEmail", "", { shouldValidate: false });
    setValue("yourEmail", "", { shouldValidate: false });
    setValue("reservationFileLabelName", "", { shouldValidate: false });
    setValue("occupancyFileLabelName", "", { shouldValidate: false });
    setValue("cancellationFileLabelName", "", { shouldValidate: false });
  }, [isChoice, isOperaCloud, setValue]);

  const managerOptions = useMemo(
    () => managers.map((manager) => ({ label: manager.name, value: manager.id })),
    [managers]
  );

  const brandOptions = useMemo(
    () => (configTerms.Brand?.length ? configTerms.Brand : BRAND_OPTIONS),
    [configTerms]
  );
  const franchiseOptions = useMemo(
    () => (configTerms.Frenchise?.length ? configTerms.Frenchise : FRANCHISE_OPTIONS),
    [configTerms]
  );
  const pmsOptions = useMemo(
    () => (configTerms.PMS?.length ? configTerms.PMS : PMS_OPTIONS),
    [configTerms]
  );
  const pmsTypeOptions = useMemo(
    () => (configTerms["PMS Type"]?.length ? configTerms["PMS Type"] : PMS_TYPE_OPTIONS),
    [configTerms]
  );
  const chainOptions = useMemo(
    () => (configTerms.Chain?.length ? configTerms.Chain : CHAIN_OPTIONS),
    [configTerms]
  );
  const currencyOptions = useMemo(
    () => (configTerms.Currency?.length ? configTerms.Currency : CURRENCY_OPTIONS),
    [configTerms]
  );
  const timezoneOptions = useMemo(
    () => (configTerms.Timezone?.length ? configTerms.Timezone : TIMEZONES),
    [configTerms]
  );
  const classificationOptions = useMemo(
    () => (configTerms.Classification?.length ? configTerms.Classification : CLASSIFICATION_OPTIONS),
    [configTerms]
  );

  const propertyRowOptions = useMemo(() => {
    const name = (watchedPropertyName || "").trim();
    return name ? [{ label: name, value: name }] : [];
  }, [watchedPropertyName]);

  // When the property name from step 1 changes, sync the dropdown default
  // selection for every portfolio row that hasn't been manually changed yet.
  useEffect(() => {
    const name = (watchedPropertyName || "").trim();
    setPortfolioRows((prev) =>
      prev.map((row) =>
        !row.property || row.property !== name ? { ...row, property: name } : row
      )
    );
  }, [watchedPropertyName]);

  const updatePortfolioRow = (id, field, value) => {
    setPortfolioRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const addPortfolioRow = () => {
    setPortfolioRows((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((r) => r.id)) + 1 : 1,
        module: "",
        property: (watchedPropertyName || "").trim(),
        managerId: "",
        distribution: [],
      },
    ]);
  };

  const removePortfolioRow = (id) => {
    setPortfolioRows((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== id) : prev));
  };

  const openDistributionModal = (rowId) => {
    setActiveDistributionRowId(rowId);
    setDistributionInput("");
    setDistributionModalOpen(true);
  };

  const activeDistributionRow = portfolioRows.find((row) => row.id === activeDistributionRowId);

  const selectedEvents = useMemo(
    () => eventRows.filter((row) => selectedEventIds.includes(row.id)),
    [eventRows, selectedEventIds]
  );

  const allEventsSelected = selectedEventIds.length > 0 && selectedEventIds.length === eventRows.length;
  const partiallySelected = selectedEventIds.length > 0 && selectedEventIds.length < eventRows.length;

  const handleFetchEvents = async () => {
    if (!watchedPropertyName?.trim() || !watchedGeoLocation?.trim()) {
      setSnackbar({
        open: true,
        message: "Property name and geo location are required before loading events.",
        severity: "error",
      });
      return;
    }

    try {
      setEventsLoading(true);

      const events = await predictHqService.fetchEventsByProperty({
        propertyName: watchedPropertyName,
        geoLocation: watchedGeoLocation,
        eventRadius: watchedEventRadius,
      });

      setEventRows(events);
      setSelectedEventIds([]);
      setEventsPage(0);
      setSnackbar({
        open: true,
        message: events.length ? `Loaded ${events.length} events from PredictHQ.` : "No events found for this location.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to fetch PredictHQ events.",
        severity: "error",
      });
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    if (activeStep !== 2) {
      return;
    }

    const fetchKey = `${watchedPropertyName || ""}|${watchedGeoLocation || ""}|${watchedEventRadius || ""}`;
    if (!watchedPropertyName?.trim() || !watchedGeoLocation?.trim()) {
      return;
    }

    if (fetchKey === lastEventFetchKey) {
      return;
    }

    setLastEventFetchKey(fetchKey);
    handleFetchEvents();
  }, [
    activeStep,
    watchedPropertyName,
    watchedGeoLocation,
    watchedEventRadius,
    lastEventFetchKey,
  ]);

  const handleToggleAllEvents = (isChecked) => {
    setSelectedEventIds(isChecked ? eventRows.map((event) => event.id) : []);
  };

  const handleToggleEvent = (eventId) => {
    setSelectedEventIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const handleImpactChange = (eventId, impact) => {
    setEventRows((prev) => prev.map((event) => (event.id === eventId ? { ...event, impact } : event)));
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
      setEventRows([]);
      setLastEventFetchKey("");
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
              <SelectInput name="brand" control={control} label="Brand" options={brandOptions} />
              <SelectInput name="franchise" control={control} label="Franchise" options={franchiseOptions} />
              <SelectInput name="pms" control={control} label="PMS" options={pmsOptions} />
              <SelectInput name="pmsType" control={control} label="PMS Type" options={pmsTypeOptions} />
              <SelectInput name="chain" control={control} label="Chain" options={chainOptions} />
              <SelectInput name="classification" control={control} label="Classification" options={classificationOptions} />
              <SelectInput name="timezone" control={control} label="Timezone" options={timezoneOptions} />
              <SelectInput name="currency" control={control} label="Currency" options={currencyOptions} />
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
            options={classificationOptions}
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

      <FormSection title="Portfolio Modules">
        <TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: (theme) => theme.palette.action.hover }}>
                <TableCell sx={{ fontWeight: 700, textTransform: "uppercase", minWidth: 180 }}>
                  Module
                </TableCell>
                <TableCell sx={{ fontWeight: 700, textTransform: "uppercase", minWidth: 220 }}>
                  Property
                </TableCell>
                <TableCell sx={{ fontWeight: 700, textTransform: "uppercase", minWidth: 220 }}>
                  Manager
                </TableCell>
                <TableCell sx={{ fontWeight: 700, textTransform: "uppercase", minWidth: 180 }}>
                  Distribution
                </TableCell>
                <TableCell sx={{ fontWeight: 700, textTransform: "uppercase", width: 100 }} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {portfolioRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={row.module}
                      onChange={(e) => updatePortfolioRow(row.id, "module", e.target.value)}
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {MODULE_OPTIONS.map((option) => {
                        const value = typeof option === "string" ? option : option.value;
                        const label = typeof option === "string" ? option : option.label;
                        return (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={row.property}
                      onChange={(e) => updatePortfolioRow(row.id, "property", e.target.value)}
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="">
                        <em>Select Hotels</em>
                      </MenuItem>
                      {propertyRowOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={row.managerId}
                      onChange={(e) => updatePortfolioRow(row.id, "managerId", e.target.value)}
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {managerOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => openDistributionModal(row.id)}
                      startIcon={<Typography component="span">+</Typography>}
                    >
                      Add({row.distribution.length})
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => removePortfolioRow(row.id)}
                      disabled={portfolioRows.length <= 1}
                      aria-label="Remove row"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction="row" justifyContent="flex-start" sx={{ mt: 1.5 }}>
          <Button variant="text" onClick={addPortfolioRow}>
            + Add Row
          </Button>
        </Stack>
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
          <TextField
            label="PMS Selection"
            value={watchedPms || ""}
            InputProps={{ readOnly: true }}
            placeholder="Set in Step 1 (Property Information)"
            fullWidth
            size="small"
          />
        </Box>

        {isChoice && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
              gap: 2,
            }}
          >
            <TextInput name="pmsUsername" control={control} label="Username" />
            <TextInput
              name="pmsPassword"
              control={control}
              label="Password"
              type="password"
            />
            <TextInput name="pmsTwilioNumber" control={control} label="Twilio Number For OTP" />
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

        {!isChoice && !isOperaCloud && watchedPms && (
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

        {isOperaCloud && (
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Typography variant="body2" color="text.secondary">
            Selected events: {selectedEventIds.length}
          </Typography>
          <Button variant="outlined" onClick={handleFetchEvents} disabled={eventsLoading}>
            {eventsLoading ? "Loading..." : "Reload Events"}
          </Button>
        </Box>

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
              {eventRows
                .slice(eventsPage * eventsRowsPerPage, eventsPage * eventsRowsPerPage + eventsRowsPerPage)
                .map((eventRow) => {
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
                    <TableCell>
                      <TextField
                        select
                        size="small"
                        value={eventRow.impact}
                        onChange={(event) => handleImpactChange(eventRow.id, event.target.value)}
                        sx={{ minWidth: 100 }}
                      >
                        {impactOptions.map((impact) => (
                          <MenuItem key={impact} value={impact}>
                            {impact}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell>{eventRow.startDate}</TableCell>
                    <TableCell>{eventRow.endDate}</TableCell>
                  </TableRow>
                );
              })}
              {!eventRows.length && (
                <TableRow>
                  <TableCell colSpan={eventTableColumns.length + 1} align="center">
                    {eventsLoading ? "Loading events..." : "No events available."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={eventRows.length}
            page={eventsPage}
            onPageChange={(_, newPage) => setEventsPage(newPage)}
            rowsPerPage={eventsRowsPerPage}
            onRowsPerPageChange={(event) => {
              setEventsRowsPerPage(parseInt(event.target.value, 10));
              setEventsPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
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
                      setEventRows([]);
                      setLastEventFetchKey("");
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

      <Modal
        open={distributionModalOpen}
        onClose={() => setDistributionModalOpen(false)}
        aria-labelledby="distribution-modal-title"
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
          <Typography id="distribution-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
            Distribution
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Distribution channel"
              value={distributionInput}
              onChange={(e) => setDistributionInput(e.target.value)}
              variant="outlined"
              size="small"
            />
            <Button
              variant="contained"
              onClick={() => {
                const value = distributionInput.trim();
                if (!value || activeDistributionRowId == null) return;
                setPortfolioRows((prev) =>
                  prev.map((row) =>
                    row.id === activeDistributionRowId
                      ? { ...row, distribution: [...row.distribution, value] }
                      : row
                  )
                );
                setDistributionInput("");
              }}
            >
              Add
            </Button>
          </Box>

          {activeDistributionRow && activeDistributionRow.distribution.length > 0 && (
            <Box sx={{ mb: 3, maxHeight: 200, overflow: "auto" }}>
              {activeDistributionRow.distribution.map((item, index) => (
                <Box
                  key={`${item}-${index}`}
                  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1 }}
                >
                  <Typography variant="body2">{item}</Typography>
                  <IconButton
                    size="small"
                    onClick={() =>
                      setPortfolioRows((prev) =>
                        prev.map((row) =>
                          row.id === activeDistributionRowId
                            ? {
                                ...row,
                                distribution: row.distribution.filter((_, i) => i !== index),
                              }
                            : row
                        )
                      )
                    }
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button variant="contained" onClick={() => setDistributionModalOpen(false)}>
              Done
            </Button>
            <Button variant="outlined" onClick={() => setDistributionModalOpen(false)}>
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
