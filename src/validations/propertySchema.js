import * as yup from "yup";

const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

export const propertySchema = yup.object({
  picture: yup
    .mixed()
    .nullable()
    .test("fileType", "Only JPG, JPEG, and PNG files are allowed.", (file) => {
      if (!file) {
        return true;
      }
      return SUPPORTED_IMAGE_TYPES.includes(file.type);
    })
    .test("fileSize", "Image size must be less than 2MB.", (file) => {
      if (!file) {
        return true;
      }
      return file.size <= MAX_IMAGE_SIZE;
    }),
  status: yup.string().required("Status is required."),
  propertyCode: yup.string().trim().required("Property Code is required."),
  propertyName: yup.string().trim().required("Property Name is required."),
  displayName: yup.string().trim(),
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
  geoLocation: yup.string().trim(),
  eventRadius: yup
    .number()
    .typeError("Event Radius must be a number.")
    .min(0, "Event Radius cannot be negative.")
    .required("Event Radius is required."),
  latitude: yup
    .number()
    .typeError("Latitude must be a valid number.")
    .min(-90, "Latitude must be between -90 and 90.")
    .max(90, "Latitude must be between -90 and 90."),
  longitude: yup
    .number()
    .typeError("Longitude must be a valid number.")
    .min(-180, "Longitude must be between -180 and 180.")
    .max(180, "Longitude must be between -180 and 180."),
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
});

export const propertyDefaultValues = {
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
  currency: "",
  managerId: "",
  systemType: "",
  webUrl: "",
  brandUrl: "",
  geoLocation: "",
  eventRadius: "",
  latitude: "",
  longitude: "",
  contactName: "",
  email: "",
  mobileNo: "",
  contactNo: "",
  address: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
};
