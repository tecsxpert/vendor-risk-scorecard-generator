import {
  RISK_LEVELS,
  RISK_STYLES,
  RISK_THRESHOLDS,
  STATUS_STYLES,
} from "./constants";

export const formatNumber = (
  value = 0
) => {
  return new Intl.NumberFormat(
    "en-US"
  ).format(
    Number(value) || 0
  );
};

export const formatPercentage =
  (value = 0) => {
    return `${Number(
      value || 0
    )}%`;
  };

export const formatDate = (
  value,
  options = {}
) => {
  if (!value) {
    return "-";
  }

  try {
    return new Intl.DateTimeFormat(
      "en-US",
      {
        year: "numeric",

        month: "short",

        day: "numeric",

        ...options,
      }
    ).format(new Date(value));
  } catch {
    return "-";
  }
};

export const formatCurrency = (
  value = 0,
  currency = "USD"
) => {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",

      currency,

      maximumFractionDigits: 0,
    }
  ).format(
    Number(value) || 0
  );
};

export const getInitials = (
  name = ""
) => {
  return name
    .split(" ")
    .map((part) =>
      part
        .charAt(0)
        .toUpperCase()
    )
    .slice(0, 2)
    .join("");
};

export const truncateText = (
  text = "",
  limit = 120
) => {
  if (text.length <= limit) {
    return text;
  }

  return `${text.slice(
    0,
    limit
  )}...`;
};

export const calculateRiskLevel =
  (score = 0) => {
    const numericScore =
      Number(score) || 0;

    if (
      numericScore >=
      RISK_THRESHOLDS.HIGH_MIN
    ) {
      return RISK_LEVELS.HIGH;
    }

    if (
      numericScore >
      RISK_THRESHOLDS.LOW_MAX
    ) {
      return RISK_LEVELS.MODERATE;
    }

    return RISK_LEVELS.LOW;
  };

export const getRiskMeta = (
  score = 0
) => {
  const level =
    calculateRiskLevel(score);

  return {
    level,

    ...(RISK_STYLES[level] ||
      {}),
  };
};

export const getStatusStyle = (
  status = ""
) => {
  return (
    STATUS_STYLES[status] ||
    "bg-slate-100 text-slate-700"
  );
};

export const normalizeApiData =
  (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (
      Array.isArray(
        data?.vendors
      )
    ) {
      return data.vendors;
    }

    if (
      Array.isArray(data?.items)
    ) {
      return data.items;
    }

    if (
      Array.isArray(
        data?.content
      )
    ) {
      return data.content;
    }

    return [];
  };

export const safeNumber = (
  value = 0
) => {
  const parsed =
    Number(value);

  return Number.isFinite(
    parsed
  )
    ? parsed
    : 0;
};

export const buildVendorStats =
  (vendors = []) => {
    const total =
      vendors.length;

    const active =
      vendors.filter(
        (vendor) =>
          vendor.status ===
          "ACTIVE"
      ).length;

    const highRisk =
      vendors.filter(
        (vendor) =>
          safeNumber(
            vendor.riskScore
          ) >= 70
      ).length;

    const averageRisk =
      total > 0
        ? Math.round(
            vendors.reduce(
              (acc, vendor) =>
                acc +
                safeNumber(
                  vendor.riskScore
                ),
              0
            ) / total
          )
        : 0;

    return {
      total,
      active,
      highRisk,
      averageRisk,
    };
  };