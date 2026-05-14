import * as yup from "yup";

const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const todayIsoDate = new Date().toISOString().split("T")[0];

const isAfterOrEqual = (value, compareValue) => {
  if (!value || !compareValue) return true;
  return value >= compareValue;
};

export const unifiedOnboardingSchema = yup.object({
  picture: yup
    .mixed()
    .nullable()
    .test("fileType", "Only JPG, JPEG, and PNG files are allowed.", (file) => {
      if (!file) return true;
      return SUPPORTED_IMAGE_TYPES.includes(file.type);
    })
    .test("fileSize", "Image size must be less than 2MB.", (file) => {
      if (!file) return true;
      return file.size <= MAX_IMAGE_SIZE;
    }),
  status: yup.string().required("Status is required."),
  propertyCode: yup.string().trim().required("Property Code is required."),
  propertyName: yup.string().trim().required("Property Name is required."),
  displayName: yup.string().trim().required("Display Name is required."),
  brand: yup.string().required("Brand is required."),
  franchise: yup.string().required("Franchise is required."),
  pms: yup.string().required("PMS is required."),
  pmsType: yup.string().required("PMS Type is required."),
  chain: yup.string().required("Chain is required."),
  classification: yup.string().required("Classification is required."),
  timezone: yup.string().required("Timezone is required."),
  currency: yup.string().required("Currency is required."),
  managerId: yup.string().required("Manager is required."),
  systemType: yup.string().required("System Type is required."),
  webUrl: yup.string().trim().url("Web URL must be a valid URL.").nullable().notRequired(),
  brandUrl: yup.string().trim().url("Brand URL must be a valid URL.").nullable().notRequired(),
  geoLocation: yup.string().trim().required("Geo Location is required."),
  eventRadius: yup
    .number()
    .typeError("Event Radius must be a number.")
    .min(0, "Event Radius cannot be negative.")
    .required("Event Radius is required."),
  contactName: yup.string().trim().required("Contact Name is required."),
  email: yup.string().email("Enter a valid email address.").required("Email is required."),
  mobileNo: yup
    .string()
    .matches(/^[0-9]{7,15}$/, "Mobile No must be 7 to 15 digits.")
    .required("Mobile No is required."),
  contactNo: yup.string().matches(/^[0-9]{7,15}$/, "Contact No must be 7 to 15 digits."),
  address: yup.string().trim().required("Address is required."),
  city: yup.string().trim().required("City is required."),
  state: yup.string().trim().required("State is required."),
  country: yup.string().trim().required("Country is required."),
  zipCode: yup
    .string()
    .matches(/^[A-Za-z0-9 -]{4,10}$/, "Zip Code format is invalid.")
    .required("Zip Code is required."),

  portfolioCode: yup.string().trim().required("Portfolio Code is required."),
  portfolioName: yup.string().trim().required("Portfolio Name is required."),
  portfolioClassification: yup.string().required("Portfolio Classification is required."),
  portfolioManager: yup.string().trim().required("Primary Manager is required."),
  portfolioModule: yup.string().required("Portfolio Module is required."),
  portfolioPropertyName: yup.string().required("Property is required."),
  portfolioSecondaryManager: yup.string().trim().required("Secondary Manager is required."),
  portfolioDistribution: yup.string().trim().required("Distribution is required."),
  addPortfolioSetupCode: yup.string().trim().required("Code is required."),
  addPortfolioSetupName: yup.string().trim().required("Name is required."),
  addPortfolioSetupClassification: yup.string().required("Classification is required."),
  addPortfolioSetupManagerId: yup.string().required("Manager is required."),
  addPortfolioSetupDetail: yup.string().trim().required("Detail is required."),

  pmsDetailsSelection: yup.string().required("PMS Selection is required."),
  isReportsOnEmail: yup.string().oneOf(["Yes", "No"]).required("Is Reports On Email is required."),
  reservationStartDate: yup.string().when("isReportsOnEmail", {
    is: "No",
    then: (schema) =>
      schema
        .required("Reservation Start Date is required.")
        .test("reservationStartMaxToday", "Reservation Start Date cannot be in the future.", (value) => {
          if (!value) return true;
          return value <= todayIsoDate;
        }),
    otherwise: (schema) => schema.notRequired(),
  }),
  reservationEndDate: yup.string().when(["isReportsOnEmail", "reservationStartDate"], {
    is: (isReportsOnEmail) => isReportsOnEmail === "No",
    then: (schema) =>
      schema
        .required("Reservation End Date is required.")
        .test("reservationEndMaxToday", "Reservation End Date cannot be in the future.", (value) => {
          if (!value) return true;
          return value <= todayIsoDate;
        })
        .test("reservationEndAfterStart", "Reservation End Date must be on or after start date.", function test(value) {
          return isAfterOrEqual(value, this.parent.reservationStartDate);
        }),
    otherwise: (schema) => schema.notRequired(),
  }),
  occupancyStartDate: yup.string().when("isReportsOnEmail", {
    is: "No",
    then: (schema) => schema.required("Occupancy Start Date is required."),
    otherwise: (schema) => schema.notRequired(),
  }),
  occupancyEndDate: yup.string().when(["isReportsOnEmail", "occupancyStartDate"], {
    is: (isReportsOnEmail) => isReportsOnEmail === "No",
    then: (schema) =>
      schema
        .required("Occupancy End Date is required.")
        .test("occupancyEndAfterStart", "Occupancy End Date must be on or after start date.", function test(value) {
          return isAfterOrEqual(value, this.parent.occupancyStartDate);
        }),
    otherwise: (schema) => schema.notRequired(),
  }),
  reportsReceiverEmail: yup.string().when(["isReportsOnEmail", "pmsDetailsSelection"], {
    is: (isReportsOnEmail, pmsDetailsSelection) =>
      isReportsOnEmail === "Yes" &&
      String(pmsDetailsSelection || "").trim().toLowerCase().replace(/\s+/g, "") === "operacloud",
    then: (schema) => schema.email("Enter a valid reports receiver email.").required("Reports Receiver Email is required."),
    otherwise: (schema) => schema.notRequired(),
  }),
  yourEmail: yup.string().when(["isReportsOnEmail", "pmsDetailsSelection"], {
    is: (isReportsOnEmail, pmsDetailsSelection) =>
      isReportsOnEmail === "Yes" &&
      String(pmsDetailsSelection || "").trim().toLowerCase().replace(/\s+/g, "") === "operacloud",
    then: (schema) => schema.email("Enter a valid email address.").required("Your Email is required."),
    otherwise: (schema) => schema.notRequired(),
  }),
  reservationFileLabelName: yup.string().when(["isReportsOnEmail", "pmsDetailsSelection"], {
    is: (isReportsOnEmail, pmsDetailsSelection) =>
      isReportsOnEmail === "Yes" &&
      String(pmsDetailsSelection || "").trim().toLowerCase().replace(/\s+/g, "") === "operacloud",
    then: (schema) => schema.trim().required("Reservation File Label Name is required."),
    otherwise: (schema) => schema.notRequired(),
  }),
  occupancyFileLabelName: yup.string().when(["isReportsOnEmail", "pmsDetailsSelection"], {
    is: (isReportsOnEmail, pmsDetailsSelection) =>
      isReportsOnEmail === "Yes" &&
      String(pmsDetailsSelection || "").trim().toLowerCase().replace(/\s+/g, "") === "operacloud",
    then: (schema) => schema.trim().required("Occupancy File Label Name is required."),
    otherwise: (schema) => schema.notRequired(),
  }),
  cancellationFileLabelName: yup.string().when(["isReportsOnEmail", "pmsDetailsSelection"], {
    is: (isReportsOnEmail, pmsDetailsSelection) =>
      isReportsOnEmail === "Yes" &&
      String(pmsDetailsSelection || "").trim().toLowerCase().replace(/\s+/g, "") === "operacloud",
    then: (schema) => schema.trim().required("Cancellation File Label Name is required."),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const unifiedOnboardingDefaults = {
  picture: null,
  status: "Active",
  propertyCode: "",
  propertyName: "",
  displayName: "",
  brand: "",
  franchise: "",
  pms: "",
  pmsType: "",
  chain: "",
  classification: "",
  timezone: "",
  currency: "USD",
  managerId: "",
  systemType: "",
  webUrl: "",
  brandUrl: "",
  geoLocation: "",
  eventRadius: "",
  contactName: "",
  email: "",
  mobileNo: "",
  contactNo: "",
  address: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",

  portfolioCode: "",
  portfolioName: "",
  portfolioClassification: "",
  portfolioManager: "",
  portfolioModule: "",
  portfolioPropertyName: "",
  portfolioSecondaryManager: "",
  portfolioDistribution: "",
  addPortfolioSetupCode: "",
  addPortfolioSetupName: "",
  addPortfolioSetupClassification: "",
  addPortfolioSetupManagerId: "",
  addPortfolioSetupDetail: "",

  pmsDetailsSelection: "",
  isReportsOnEmail: "",
  reservationStartDate: "",
  reservationEndDate: "",
  occupancyStartDate: "",
  occupancyEndDate: "",
  reportsReceiverEmail: "",
  yourEmail: "",
  reservationFileLabelName: "",
  occupancyFileLabelName: "",
  cancellationFileLabelName: "",
};
