import { useEffect, useMemo, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import BusinessIcon from "@mui/icons-material/Business";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import EventIcon from "@mui/icons-material/Event";
import StorageIcon from "@mui/icons-material/Storage";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedIcon from "@mui/icons-material/Verified";
import DiamondIcon from "@mui/icons-material/Diamond";
import PublicIcon from "@mui/icons-material/Public";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LinkIcon from "@mui/icons-material/Link";
import DevicesIcon from "@mui/icons-material/Devices";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import GridViewIcon from "@mui/icons-material/GridView";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
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
const RATE_CODE_TYPE_OPTIONS = ["HIGH", "LOW"];
const MARKET_SEGMENT_OPTIONS = [
  "OTA DISCOUNT",
  "BRAND DISCOUNT",
  "OTAMERNET_U",
  "CORPORATE NEGOTIATED",
  "OTA RETAIL",
  "LOCAL NEGOTIATED",
  "QUALIFIED DISCOUNT",
  "REDEMPTION",
  "GOVERNMENT",
  "UNMAPPED",
];
const CHANNEL_PARTNER_OPTIONS = ["BOOKING.COM", "UNMAPPED"];
const REPORTS_ON_EMAIL_OPTIONS = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

const steps = [
  "Property Information",
  "Portfolio Setup",
  "Events",
  "RateCodes Mapping",
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
    "totalInventory",
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
  const [rateCodeRows, setRateCodeRows] = useState([
    {
      id: 1,
      rateCode: "",
      description: "",
      barBased: false,
      rateCodeType: "HIGH",
      marketSegment: "UNMAPPED",
      channelPartner: "UNMAPPED",
      commission: "0.00",
    },
  ]);
  const [distributionModalOpen, setDistributionModalOpen] = useState(false);
  const [activeDistributionRowId, setActiveDistributionRowId] = useState(null);
  const [distributionInput, setDistributionInput] = useState("");
  const [reviewEventsPage, setReviewEventsPage] = useState(0);
  const [reviewEventsRowsPerPage, setReviewEventsRowsPerPage] = useState(5);
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

  const updateRateCodeRow = (id, field, value) => {
    setRateCodeRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const addRateCodeRow = () => {
    setRateCodeRows((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((r) => r.id)) + 1 : 1,
        rateCode: "",
        description: "",
        barBased: false,
        rateCodeType: "HIGH",
        marketSegment: "UNMAPPED",
        channelPartner: "UNMAPPED",
        commission: "0.00",
      },
    ]);
  };

  const removeRateCodeRow = (id) => {
    setRateCodeRows((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== id) : prev));
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
    // Safety net: only proceed when the user is on the final review step.
    // The form's onSubmit is already disabled, but this guard prevents any
    // accidental programmatic submission from finalizing the onboarding.
    if (activeStep !== steps.length - 1) {
      return;
    }

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
        rateCodes: rateCodeRows,
        totalInventory: values.totalInventory,
        createdAt: new Date().toISOString(),
      };
      const existingPmsDetails = JSON.parse(localStorage.getItem("hotelPms.pmsDetailsConfigs") || "[]");
      localStorage.setItem("hotelPms.pmsDetailsConfigs", JSON.stringify([pmsDetailsPayload, ...existingPmsDetails]));

      reset(unifiedOnboardingDefaults);
      setSelectedEventIds([]);
      setEventRows([]);
      setLastEventFetchKey("");
      setRateCodeRows([
        {
          id: 1,
          rateCode: "",
          description: "",
          barBased: false,
          rateCodeType: "HIGH",
          marketSegment: "UNMAPPED",
          channelPartner: "UNMAPPED",
          commission: "0.00",
        },
      ]);
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

  const renderRateCodesStep = () => (
    <Stack spacing={3}>
      <FormSection
        title="RateCodes Mapping"
        description="Map each rate code to a market segment and channel partner."
        icon={<StorageIcon color="primary" />}
      >
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="flex-end">
            <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={addRateCodeRow}>
              Add Rate Code
            </Button>
          </Stack>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ "& th": { fontWeight: 700, backgroundColor: "action.hover" } }}>
                  <TableCell>RATE CODE</TableCell>
                  <TableCell>DESCRIPTION</TableCell>
                  <TableCell align="center">BAR BASED</TableCell>
                  <TableCell>RATE CODE TYPE</TableCell>
                  <TableCell>MARKET SEGMENT</TableCell>
                  <TableCell>CHANNEL PARTNER</TableCell>
                  <TableCell align="right">COMMISSION</TableCell>
                  <TableCell align="center">ACTION</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rateCodeRows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ minWidth: 130 }}>
                      <TextField
                        value={row.rateCode}
                        onChange={(e) => updateRateCodeRow(row.id, "rateCode", e.target.value)}
                        size="small"
                        fullWidth
                        variant="standard"
                        placeholder="Rate Code"
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 180 }}>
                      <TextField
                        value={row.description}
                        onChange={(e) => updateRateCodeRow(row.id, "description", e.target.value)}
                        size="small"
                        fullWidth
                        variant="standard"
                        placeholder="Description"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={!!row.barBased}
                        onChange={(e) => updateRateCodeRow(row.id, "barBased", e.target.checked)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 130 }}>
                      <TextField
                        select
                        value={row.rateCodeType}
                        onChange={(e) => updateRateCodeRow(row.id, "rateCodeType", e.target.value)}
                        size="small"
                        fullWidth
                        variant="standard"
                      >
                        {RATE_CODE_TYPE_OPTIONS.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell sx={{ minWidth: 180 }}>
                      <TextField
                        select
                        value={row.marketSegment}
                        onChange={(e) => updateRateCodeRow(row.id, "marketSegment", e.target.value)}
                        size="small"
                        fullWidth
                        variant="standard"
                      >
                        {MARKET_SEGMENT_OPTIONS.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell sx={{ minWidth: 160 }}>
                      <TextField
                        select
                        value={row.channelPartner}
                        onChange={(e) => updateRateCodeRow(row.id, "channelPartner", e.target.value)}
                        size="small"
                        fullWidth
                        variant="standard"
                      >
                        {CHANNEL_PARTNER_OPTIONS.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell align="right" sx={{ minWidth: 110 }}>
                      <TextField
                        type="number"
                        value={row.commission}
                        onChange={(e) => updateRateCodeRow(row.id, "commission", e.target.value)}
                        size="small"
                        fullWidth
                        variant="standard"
                        inputProps={{ step: "0.01", min: 0, style: { textAlign: "right" } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => removeRateCodeRow(row.id)}
                        disabled={rateCodeRows.length <= 1}
                        aria-label="Remove rate code"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </FormSection>

      <FormSection
        title="Total Inventory"
        description="Total number of rooms / inventory units available."
        icon={<InventoryIcon color="primary" />}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextInput
              name="totalInventory"
              control={control}
              label="Total Inventory"
              type="number"
              inputProps={{ min: 0, step: 1 }}
              placeholder="e.g. 120"
            />
          </Grid>
        </Grid>
      </FormSection>
    </Stack>
  );

  const renderReviewStep = () => {
    const values = watch();
    const managerName = managerOptions.find((m) => m.value === values.managerId)?.label || "—";
    const selectedEvents = eventRows.filter((row) => selectedEventIds.includes(row.id));
    const pictureSrc =
      values.picture && typeof values.picture === "string"
        ? values.picture
        : values.picture instanceof File
        ? URL.createObjectURL(values.picture)
        : "";

    // Palette tokens from the preview HTML.
    const GREEN = "#22c55e";
    const GREEN_DARK = "#15803d";
    const GREEN_SOFT = "#dcfce7";
    const PURPLE = "#7c3aed";
    const PURPLE_SOFT = "#ede9fe";
    const SLATE_500 = "#64748b";
    const BORDER = "#e5e7eb";
    const BG_SOFT = "#fafafa";
    const EM_DASH = "—";

    // White rounded card.
    const Card = ({ children, sx }) => (
      <Paper
        elevation={0}
        sx={{
          backgroundColor: "#fff",
          borderRadius: "24px",
          border: `1px solid ${BORDER}`,
          p: { xs: 2.5, sm: 4 },
          boxShadow: "0 4px 20px rgba(15,23,42,0.04)",
          ...sx,
        }}
      >
        {children}
      </Paper>
    );

    // Soft gray detail box: label on top, bold value below.
    const DetailBox = ({ label, value, children }) => (
      <Box sx={{ p: 2.25, borderRadius: "16px", backgroundColor: BG_SOFT }}>
        <Typography sx={{ fontSize: 13, color: SLATE_500, mb: 0.75 }}>{label}</Typography>
        {children !== undefined ? (
          children
        ) : (
          <Typography sx={{ fontSize: 17, fontWeight: 600, color: "#0f172a", wordBreak: "break-word" }}>
            {value === 0 ? 0 : value || EM_DASH}
          </Typography>
        )}
      </Box>
    );

    // Pill badge.
    const Badge = ({ label, variant = "purple" }) => {
      const styles =
        variant === "green"
          ? { bg: GREEN_SOFT, color: GREEN_DARK }
          : { bg: PURPLE_SOFT, color: PURPLE };
      return (
        <Box
          sx={{
            display: "inline-block",
            px: 1.75,
            py: 1,
            borderRadius: "999px",
            fontSize: 13,
            fontWeight: 700,
            backgroundColor: styles.bg,
            color: styles.color,
            lineHeight: 1,
          }}
        >
          {label}
        </Box>
      );
    };

    // Section title (plain, no icon).
    const SectionTitle = ({ children }) => (
      <Typography sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: "#0f172a" }}>
        {children}
      </Typography>
    );

    const handleEditProperty = () => setActiveStep(0);

    const detailFields = [
      { label: "Brand", value: values.brand },
      { label: "Franchise", value: values.franchise },
      { label: "Chain", value: values.chain },
      { label: "PMS", value: values.pms },
      { label: "PMS Type", value: values.pmsType },
      { label: "Property Code", value: values.propertyCode },
      { label: "System Type", value: values.systemType },
      { label: "Manager", value: managerName },
      { label: "Geo Location", value: values.geoLocation },
      { label: "Event Radius", value: values.eventRadius },
      { label: "Web URL", value: values.webUrl },
      { label: "Brand URL", value: values.brandUrl },
    ];

    return (
      <Box sx={{ backgroundColor: "#f5f7fb", borderRadius: "24px", p: { xs: 2, sm: 3 }, mx: { xs: -2, sm: -2.5 } }}>
        <Stack spacing={3}>
          {/* Topbar */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
          >
            <Box>
              <Typography sx={{ fontSize: 14, color: SLATE_500, mb: 1.25 }}>
                Properties / Property Review
              </Typography>
              <Typography sx={{ fontSize: { xs: 32, sm: 42 }, fontWeight: 800, lineHeight: 1.1, mb: 1 }}>
                Property Review
              </Typography>
              <Typography sx={{ fontSize: 16, color: SLATE_500 }}>
                Review and confirm property details
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                onClick={handleEditProperty}
                sx={{
                  backgroundColor: "#fff",
                  border: `1px solid ${BORDER}`,
                  borderRadius: "12px",
                  px: 3,
                  py: 1.5,
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#0f172a",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#f8fafc" },
                }}
              >
                Edit Property
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || loading}
                sx={{
                  backgroundColor: GREEN,
                  color: "#fff",
                  borderRadius: "12px",
                  px: 3,
                  py: 1.5,
                  fontSize: 15,
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 6px 16px rgba(34,197,94,0.25)",
                  "&:hover": { backgroundColor: GREEN_DARK, boxShadow: "0 6px 16px rgba(34,197,94,0.35)" },
                  "&.Mui-disabled": { backgroundColor: GREEN, opacity: 0.6, color: "#fff" },
                }}
              >
                {loading ? "Submitting..." : "Approve Property"}
              </Button>
            </Stack>
          </Stack>

          {/* Property card */}
          <Card>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 3.5,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start", flexWrap: { xs: "wrap", sm: "nowrap" } }}>
                <Box
                  sx={{
                    width: 180,
                    height: 120,
                    borderRadius: "18px",
                    overflow: "hidden",
                    flexShrink: 0,
                    backgroundColor: GREEN_SOFT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {pictureSrc ? (
                    <Box
                      component="img"
                      src={pictureSrc}
                      alt={values.propertyName || "Property"}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <BusinessIcon sx={{ fontSize: 64, color: GREEN_DARK }} />
                  )}
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: { xs: 28, sm: 38 },
                      fontWeight: 800,
                      lineHeight: 1.2,
                      mb: 2.25,
                      color: "#0f172a",
                    }}
                  >
                    {values.propertyName || "Untitled Property"}
                  </Typography>
                  <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                    {values.propertyCode && <Badge label={values.propertyCode} variant="purple" />}
                    <Badge label={values.status || "Active"} variant="green" />
                  </Stack>
                </Box>
              </Box>

              <Stack direction="row" spacing={{ xs: 3, sm: 6 }} sx={{ flexWrap: "wrap", rowGap: 2 }}>
                {[
                  { label: "Classification", value: values.classification },
                  { label: "Timezone", value: values.timezone },
                  { label: "Currency", value: values.currency },
                ].map((s) => (
                  <Box key={s.label} sx={{ minWidth: 160 }}>
                    <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#0f172a", mt: 1 }}>
                      {s.value || EM_DASH}
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: SLATE_500, mt: 0.5 }}>{s.label}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box sx={{ height: "1px", backgroundColor: BORDER, my: 3.5 }} />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 3,
              }}
            >
              {detailFields.map((f) => (
                <DetailBox key={f.label} label={f.label} value={f.value} />
              ))}
            </Box>
          </Card>

          {/* Two-column row: Contact + Portfolio Setup */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            <Card>
              <SectionTitle>Contact Information</SectionTitle>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2.75,
                }}
              >
                <DetailBox label="Contact Name" value={values.contactName} />
                <DetailBox label="Email" value={values.email} />
                <DetailBox label="Mobile No" value={values.mobileNo} />
                <DetailBox label="Contact No" value={values.contactNo} />
                <Box sx={{ gridColumn: "1 / -1" }}>
                  <DetailBox
                    label="Address"
                    value={[values.address, values.city, values.state, values.country, values.zipCode]
                      .filter(Boolean)
                      .join(", ")}
                  />
                </Box>
              </Box>
            </Card>

            <Card>
              <SectionTitle>Portfolio Setup</SectionTitle>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2.75,
                }}
              >
                <DetailBox label="Code" value={values.addPortfolioSetupCode} />
                <DetailBox label="Name" value={values.addPortfolioSetupName} />
                <DetailBox label="Classification">
                  {values.addPortfolioSetupClassification ? (
                    <Badge label={values.addPortfolioSetupClassification} variant="purple" />
                  ) : (
                    <Typography sx={{ fontSize: 17, fontWeight: 600 }}>{EM_DASH}</Typography>
                  )}
                </DetailBox>
                <DetailBox
                  label="Manager"
                  value={
                    managerOptions.find((m) => m.value === values.addPortfolioSetupManagerId)?.label || EM_DASH
                  }
                />
              </Box>
            </Card>
          </Box>

          {/* Portfolio Modules */}
          <Card>
            <SectionTitle>Portfolio Modules</SectionTitle>
            <TableContainer sx={{ borderRadius: "18px", border: `1px solid ${BORDER}`, overflow: "hidden" }}>
              <Table>
                <TableHead sx={{ backgroundColor: "#f8fafc" }}>
                  <TableRow>
                    {["Module", "Property", "Manager", "Distribution"].map((h) => (
                      <TableCell
                        key={h}
                        sx={{ fontSize: 14, fontWeight: 600, color: SLATE_500, py: 2.25, border: 0 }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {portfolioRows.length ? (
                    portfolioRows.map((row) => (
                      <TableRow key={row.id} sx={{ "&:hover": { backgroundColor: BG_SOFT } }}>
                        <TableCell sx={{ py: 2.75, fontWeight: 500, borderTop: `1px solid #edf2f7` }}>
                          {row.module || EM_DASH}
                        </TableCell>
                        <TableCell sx={{ py: 2.75, fontWeight: 500, borderTop: `1px solid #edf2f7` }}>
                          {row.property || EM_DASH}
                        </TableCell>
                        <TableCell sx={{ py: 2.75, fontWeight: 500, borderTop: `1px solid #edf2f7` }}>
                          {managerOptions.find((m) => m.value === row.managerId)?.label || EM_DASH}
                        </TableCell>
                        <TableCell sx={{ py: 2.75, fontWeight: 500, borderTop: `1px solid #edf2f7` }}>
                          {row.distribution.length
                            ? row.distribution.map((d, i) => (
                                <Chip key={`${d}-${i}`} size="small" label={d} sx={{ mr: 0.5, mb: 0.5 }} />
                              ))
                            : EM_DASH}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        align="center"
                        sx={{ color: SLATE_500, py: 3, borderTop: `1px solid #edf2f7` }}
                      >
                        No modules added.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* RateCodes Mapping */}
          <Card>
            <SectionTitle>RateCodes Mapping</SectionTitle>
            <TableContainer sx={{ borderRadius: "18px", border: `1px solid ${BORDER}`, overflow: "hidden" }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: "#f8fafc" }}>
                  <TableRow>
                    {[
                      "Rate Code",
                      "Description",
                      "BAR Based",
                      "Type",
                      "Market Segment",
                      "Channel Partner",
                      "Commission",
                    ].map((h) => (
                      <TableCell
                        key={h}
                        sx={{ fontSize: 13, fontWeight: 600, color: SLATE_500, py: 2, border: 0 }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rateCodeRows.length ? (
                    rateCodeRows.map((row) => (
                      <TableRow key={row.id} sx={{ "&:hover": { backgroundColor: BG_SOFT } }}>
                        <TableCell sx={{ py: 2, fontWeight: 500, borderTop: `1px solid #edf2f7` }}>
                          {row.rateCode || EM_DASH}
                        </TableCell>
                        <TableCell sx={{ py: 2, fontWeight: 500, borderTop: `1px solid #edf2f7` }}>
                          {row.description || EM_DASH}
                        </TableCell>
                        <TableCell sx={{ py: 2, fontWeight: 500, borderTop: `1px solid #edf2f7` }}>
                          {row.barBased ? "Yes" : "No"}
                        </TableCell>
                        <TableCell sx={{ py: 2, fontWeight: 500, borderTop: `1px solid #edf2f7` }}>
                          {row.rateCodeType || EM_DASH}
                        </TableCell>
                        <TableCell sx={{ py: 2, fontWeight: 500, borderTop: `1px solid #edf2f7` }}>
                          {row.marketSegment || EM_DASH}
                        </TableCell>
                        <TableCell sx={{ py: 2, fontWeight: 500, borderTop: `1px solid #edf2f7` }}>
                          {row.channelPartner || EM_DASH}
                        </TableCell>
                        <TableCell sx={{ py: 2, fontWeight: 500, borderTop: `1px solid #edf2f7` }}>
                          {row.commission || "0.00"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        align="center"
                        sx={{ color: SLATE_500, py: 3, borderTop: `1px solid #edf2f7` }}
                      >
                        No rate codes mapped.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Total Inventory */}
          <Card>
            <SectionTitle>Total Inventory</SectionTitle>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 2.75,
              }}
            >
              <DetailBox label="Total Inventory" value={values.totalInventory} />
            </Box>
          </Card>

          {/* PMS Details */}
          {(isChoice || isOperaCloud || values.pms) && (
            <Card>
              <SectionTitle>PMS Details</SectionTitle>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 2.75,
                }}
              >
                <DetailBox label="PMS Selection" value={values.pms || values.pmsDetailsSelection} />
                {isChoice && (
                  <>
                    <DetailBox label="Username" value={values.pmsUsername} />
                    <DetailBox label="Password" value={values.pmsPassword ? "••••••••" : EM_DASH} />
                    <DetailBox label="Twilio Number" value={values.pmsTwilioNumber} />
                    <DetailBox label="Reservation Start" value={values.reservationStartDate} />
                    <DetailBox label="Reservation End" value={values.reservationEndDate} />
                    <DetailBox label="Occupancy Start" value={values.occupancyStartDate} />
                    <DetailBox label="Occupancy End" value={values.occupancyEndDate} />
                  </>
                )}
                {isOperaCloud && (
                  <>
                    <DetailBox label="Reports Receiver Email" value={values.reportsReceiverEmail} />
                    <DetailBox label="Your Email" value={values.yourEmail} />
                    <DetailBox label="Reservation File" value={values.reservationFileLabelName} />
                    <DetailBox label="Occupancy File" value={values.occupancyFileLabelName} />
                    <DetailBox label="Cancellation File" value={values.cancellationFileLabelName} />
                  </>
                )}
                {!isChoice && !isOperaCloud && (
                  <>
                    <DetailBox label="Reservation Start" value={values.reservationStartDate} />
                    <DetailBox label="Reservation End" value={values.reservationEndDate} />
                    <DetailBox label="Occupancy Start" value={values.occupancyStartDate} />
                    <DetailBox label="Occupancy End" value={values.occupancyEndDate} />
                  </>
                )}
              </Box>
            </Card>
          )}

          {/* Selected Events */}
          {selectedEvents.length > 0 && (
            <Card>
              <SectionTitle>Selected Events ({selectedEvents.length})</SectionTitle>
              <TableContainer sx={{ borderRadius: "18px", border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#f8fafc" }}>
                    <TableRow>
                      {["Name", "Type", "Impact", "Start", "End"].map((h) => (
                        <TableCell
                          key={h}
                          sx={{ fontSize: 14, fontWeight: 600, color: SLATE_500, py: 2.25, border: 0 }}
                        >
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedEvents
                      .slice(
                        reviewEventsPage * reviewEventsRowsPerPage,
                        reviewEventsPage * reviewEventsRowsPerPage + reviewEventsRowsPerPage
                      )
                      .map((ev) => (
                      <TableRow key={ev.id} sx={{ "&:hover": { backgroundColor: BG_SOFT } }}>
                        <TableCell sx={{ py: 2.5, fontWeight: 500, borderTop: `1px solid #edf2f7` }}>
                          {ev.name}
                        </TableCell>
                        <TableCell sx={{ py: 2.5, fontWeight: 500, borderTop: `1px solid #edf2f7` }}>
                          {ev.type}
                        </TableCell>
                        <TableCell sx={{ py: 2.5, fontWeight: 500, borderTop: `1px solid #edf2f7` }}>
                          <Chip
                            size="small"
                            label={ev.impact}
                            color={
                              ev.impact === "High" ? "error" : ev.impact === "Low" ? "default" : "warning"
                            }
                          />
                        </TableCell>
                        <TableCell sx={{ py: 2.5, fontWeight: 500, borderTop: `1px solid #edf2f7` }}>
                          {ev.startDate}
                        </TableCell>
                        <TableCell sx={{ py: 2.5, fontWeight: 500, borderTop: `1px solid #edf2f7` }}>
                          {ev.endDate}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  component="div"
                  count={selectedEvents.length}
                  page={reviewEventsPage}
                  onPageChange={(_, newPage) => setReviewEventsPage(newPage)}
                  rowsPerPage={reviewEventsRowsPerPage}
                  onRowsPerPageChange={(e) => {
                    setReviewEventsRowsPerPage(parseInt(e.target.value, 10));
                    setReviewEventsPage(0);
                  }}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  sx={{ borderTop: `1px solid ${BORDER}` }}
                />
              </TableContainer>
            </Card>
          )}
        </Stack>
      </Box>
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

          <form
            noValidate
            onSubmit={(event) => {
              // The form is never auto-submitted. The user must click the
              // explicit "Submit All" button on the last review step.
              event.preventDefault();
            }}
            onKeyDown={(event) => {
              // Prevent the browser's implicit form submission when the user
              // presses Enter in any text field on any step.
              if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
                event.preventDefault();
              }
            }}
          >
            <Stack spacing={2.5}>
              <Box sx={{ display: activeStep === 0 ? "block" : "none" }}>{renderPropertyStep()}</Box>
              <Box sx={{ display: activeStep === 1 ? "block" : "none" }}>{renderPortfolioStep()}</Box>
              <Box sx={{ display: activeStep === 2 ? "block" : "none" }}>{renderEventsStep()}</Box>
              <Box sx={{ display: activeStep === 3 ? "block" : "none" }}>{renderRateCodesStep()}</Box>
              <Box sx={{ display: activeStep === 4 ? "block" : "none" }}>{renderPmsDetailsStep()}</Box>
              <Box sx={{ display: activeStep === 5 ? "block" : "none" }}>{renderReviewStep()}</Box>

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
                    <Button
                      variant="contained"
                      type="button"
                      onClick={handleSubmit(onSubmit)}
                      disabled={isSubmitting || loading}
                    >
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
