import * as yup from "yup";

export const portfolioSchema = yup.object({
  code: yup.string().trim().required("Code is required."),
  name: yup.string().trim().required("Name is required."),
  classification: yup.string().required("Classification is required."),
  manager: yup.string().trim().required("Manager is required."),
  module: yup.string().required("Module is required."),
  propertyId: yup.string().required("Property is required."),
  secondaryManager: yup.string().trim().required("Secondary Manager is required."),
  distribution: yup.string().trim().required("Distribution is required."),
});

export const portfolioDefaultValues = {
  code: "",
  name: "",
  classification: "",
  manager: "",
  module: "",
  propertyId: "",
  secondaryManager: "",
  distribution: "",
};
