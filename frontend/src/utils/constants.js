export const APP_NAME =
  "VendorRisk";

export const APP_DESCRIPTION =
  "Enterprise Vendor Risk Intelligence Platform";

export const API_TIMEOUT =
  15000;

export const STORAGE_KEYS = {
  AUTH: "vendor_risk_auth",

  THEME:
    "vendor_risk_theme",
};

export const ROUTES = {
  LOGIN: "/login",

  DASHBOARD:
    "/dashboard",

  VENDORS: "/vendors",

  ANALYTICS:
    "/analytics",
};

export const VENDOR_STATUS = {
  ACTIVE: "ACTIVE",

  HIGH_RISK:
    "HIGH_RISK",

  INACTIVE: "INACTIVE",
};

export const RISK_LEVELS = {
  LOW: "LOW",

  MODERATE: "MODERATE",

  HIGH: "HIGH",
};

export const RISK_THRESHOLDS =
  {
    LOW_MAX: 39,

    MODERATE_MAX: 69,

    HIGH_MIN: 70,
  };

export const STATUS_STYLES =
  {
    ACTIVE:
      "bg-emerald-100 text-emerald-700",

    HIGH_RISK:
      "bg-red-100 text-red-700",

    INACTIVE:
      "bg-slate-100 text-slate-700",
  };

export const RISK_STYLES = {
  LOW: {
    badge:
      "bg-emerald-100 text-emerald-700 border-emerald-200",

    progress:
      "bg-emerald-500",
  },

  MODERATE: {
    badge:
      "bg-yellow-100 text-yellow-700 border-yellow-200",

    progress:
      "bg-yellow-500",
  },

  HIGH: {
    badge:
      "bg-red-100 text-red-700 border-red-200",

    progress: "bg-red-500",
  },
};

export const CATEGORY_OPTIONS =
  [
    "Cloud",
    "Finance",
    "Security",
    "Infrastructure",
    "Compliance",
    "Analytics",
    "Operations",
    "Payments",
    "IT Services",
    "Database",
  ];

export const SORT_OPTIONS = [
  {
    label: "Newest First",

    value: "newest",
  },

  {
    label: "Oldest First",

    value: "oldest",
  },

  {
    label:
      "Risk Score High → Low",

    value: "risk_desc",
  },

  {
    label:
      "Risk Score Low → High",

    value: "risk_asc",
  },
];

export const STATUS_OPTIONS =
  [
    {
      label: "All Status",

      value: "",
    },

    {
      label: "Active",

      value: "ACTIVE",
    },

    {
      label: "High Risk",

      value: "HIGH_RISK",
    },

    {
      label: "Inactive",

      value: "INACTIVE",
    },
  ];

export const CHART_COLORS = [
  "#4F46E5",
  "#7C3AED",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
];

export const MOCK_ANALYTICS_TREND =
  [
    {
      month: "Jan",

      score: 48,
    },

    {
      month: "Feb",

      score: 52,
    },

    {
      month: "Mar",

      score: 61,
    },

    {
      month: "Apr",

      score: 57,
    },

    {
      month: "May",

      score: 64,
    },
  ];

export const TABLE_PAGE_SIZE =
  10;

export const FILE_UPLOAD_LIMIT =
  5 * 1024 * 1024;

export const ALLOWED_UPLOAD_TYPES =
  ["csv", "xlsx"];