import {
  FILE_UPLOAD_LIMIT,
  ALLOWED_UPLOAD_TYPES,
} from "./constants";

export const isRequired = (
  value
) => {
  if (
    value === null ||
    value === undefined
  ) {
    return false;
  }

  return (
    String(value)
      .trim()
      .length > 0
  );
};

export const isValidEmail = (
  email = ""
) => {
  const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
};

export const isValidPassword =
  (password = "") => {
    return (
      password.length >= 6
    );
  };

export const isValidRiskScore =
  (score) => {
    const numericScore =
      Number(score);

    return (
      Number.isFinite(
        numericScore
      ) &&
      numericScore >= 0 &&
      numericScore <= 100
    );
  };

export const validateVendorForm =
  (values = {}) => {
    const errors = {};

    if (
      !isRequired(values.name)
    ) {
      errors.name =
        "Vendor name is required";
    }

    if (
      !isRequired(
        values.category
      )
    ) {
      errors.category =
        "Vendor category is required";
    }

    if (
      !isValidRiskScore(
        values.riskScore
      )
    ) {
      errors.riskScore =
        "Risk score must be between 0 and 100";
    }

    if (
      !isRequired(
        values.description
      )
    ) {
      errors.description =
        "Description is required";
    }

    if (
      !isRequired(
        values.status
      )
    ) {
      errors.status =
        "Vendor status is required";
    }

    return errors;
  };

export const validateLoginForm =
  (values = {}) => {
    const errors = {};

    if (
      !isRequired(
        values.email
      )
    ) {
      errors.email =
        "Email is required";
    } else if (
      !isValidEmail(
        values.email
      )
    ) {
      errors.email =
        "Invalid email address";
    }

    if (
      !isRequired(
        values.password
      )
    ) {
      errors.password =
        "Password is required";
    } else if (
      !isValidPassword(
        values.password
      )
    ) {
      errors.password =
        "Password must contain at least 6 characters";
    }

    return errors;
  };

export const validateFileUpload =
  (file) => {
    if (!file) {
      return {
        valid: false,

        message:
          "File is required",
      };
    }

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase();

    if (
      !ALLOWED_UPLOAD_TYPES.includes(
        extension
      )
    ) {
      return {
        valid: false,

        message:
          "Only CSV and XLSX files are allowed",
      };
    }

    if (
      file.size >
      FILE_UPLOAD_LIMIT
    ) {
      return {
        valid: false,

        message:
          "File size must be less than 5MB",
      };
    }

    return {
      valid: true,

      message: "",
    };
  };

export const hasValidationErrors =
  (errors = {}) => {
    return (
      Object.keys(errors)
        .length > 0
    );
  };