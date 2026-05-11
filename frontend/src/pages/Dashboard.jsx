import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import toast from "react-hot-toast";

import api from "../services/api";

import LoadingSkeleton from "../components/LoadingSkeleton";
import VendorStatsCards from "../components/VendorStatsCards";

const FALLBACK_VENDORS = [
  {
    id: 1,
    name: "Amazon",
    category: "Cloud",
    riskScore: 20,
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "Meta",
    category: "Social",
    riskScore: 78,
    status: "HIGH_RISK",
  },
  {
    id: 3,
    name: "TCS",
    category: "IT Services",
    riskScore: 41,
    status: "ACTIVE",
  },
  {
    id: 4,
    name: "Oracle",
    category: "Database",
    riskScore: 58,
    status: "INACTIVE",
  },
  {
    id: 5,
    name: "Infosys",
    category: "IT Services",
    riskScore: 34,
    status: "ACTIVE",
  },
  {
    id: 6,
    name: "Stripe",
    category: "Payments",
    riskScore: 66,
    status: "HIGH_RISK",
  },
];

const COLORS = [
  "#4F46E5",
  "#7C3AED",
  "#10B981",
  "#F59E0B",
  "#EF4444",
];

const normalizeNumber = (value) => {
  const next = Number(value);

  return Number.isFinite(next)
    ? next
    : 0;
};

const extractVendorList = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.vendors)) {
    return data.vendors;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  return [];
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [vendors, setVendors] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshKey, setRefreshKey] =
    useState(0);

  const [message, setMessage] =
    useState("");

  const loadDashboard =
    useCallback(async () => {
      try {
        setLoading(true);

        const [
          vendorsResult,
          statsResult,
        ] = await Promise.allSettled([
          api.get("/vendors"),
          api.get("/stats"),
        ]);

        let nextVendors =
          FALLBACK_VENDORS;

        let nextMessage =
          "Using demo analytics until backend data is available.";

        if (
          vendorsResult.status ===
          "fulfilled"
        ) {
          const data =
            extractVendorList(
              vendorsResult.value?.data
            );

          if (data.length > 0) {
            nextVendors = data;
            nextMessage = "";
          }
        }

        if (
          statsResult.status ===
          "fulfilled"
        ) {
          const statsVendors =
            extractVendorList(
              statsResult.value?.data
            );

          if (
            statsVendors.length > 0
          ) {
            nextVendors =
              statsVendors;

            nextMessage = "";
          }
        }

        setVendors(nextVendors);
        setMessage(nextMessage);
      } catch {
        setVendors(
          FALLBACK_VENDORS
        );

        setMessage(
          "Using demo analytics until backend data is available."
        );

        toast.error(
          "Failed to load live dashboard data"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard, refreshKey]);

  const analytics = useMemo(() => {
    const total = vendors.length;

    const active = vendors.filter(
      (vendor) =>
        vendor.status === "ACTIVE"
    ).length;

    const highRisk =
      vendors.filter(
        (vendor) =>
          vendor.status ===
          "HIGH_RISK"
      ).length;

    const inactive =
      vendors.filter(
        (vendor) =>
          vendor.status ===
          "INACTIVE"
      ).length;

    const averageRisk = total
      ? Math.round(
          vendors.reduce(
            (sum, vendor) =>
              sum +
              normalizeNumber(
                vendor.riskScore ??
                  vendor.risk_score
              ),
            0
          ) / total
        )
      : 0;

    const riskBuckets = {
      low: vendors.filter(
        (vendor) =>
          normalizeNumber(
            vendor.riskScore ??
              vendor.risk_score
          ) < 40
      ).length,

      moderate: vendors.filter(
        (vendor) => {
          const score =
            normalizeNumber(
              vendor.riskScore ??
                vendor.risk_score
            );

          return (
            score >= 40 &&
            score < 70
          );
        }
      ).length,

      high: vendors.filter(
        (vendor) =>
          normalizeNumber(
            vendor.riskScore ??
              vendor.risk_score
          ) >= 70
      ).length,
    };

    const categoryMap =
      vendors.reduce(
        (acc, vendor) => {
          const category =
            vendor.category ||
            "Other";

          acc[category] =
            (acc[category] || 0) + 1;

          return acc;
        },
        {}
      );

    const categoryData =
      Object.entries(
        categoryMap
      ).map(([name, value]) => ({
        name,
        value,
      }));

    const trendData = [
      {
        month: "Jan",
        score: Math.max(
          35,
          averageRisk - 10
        ),
      },
      {
        month: "Feb",
        score: Math.max(
          38,
          averageRisk - 6
        ),
      },
      {
        month: "Mar",
        score: Math.max(
          42,
          averageRisk - 2
        ),
      },
      {
        month: "Apr",
        score: Math.max(
          45,
          averageRisk + 1
        ),
      },
      {
        month: "May",
        score: averageRisk,
      },
    ];

    const topRiskVendors = [
      ...vendors,
    ]
      .map((vendor) => ({
        id: vendor.id,
        name:
          vendor.name ??
          "Unnamed vendor",
        category:
          vendor.category ?? "-",
        status:
          vendor.status ??
          "UNKNOWN",
        score: normalizeNumber(
          vendor.riskScore ??
            vendor.risk_score
        ),
      }))
      .sort(
        (a, b) =>
          b.score - a.score
      )
      .slice(0, 5);

    return {
      total,
      active,
      highRisk,
      inactive,
      averageRisk,
      riskBuckets,
      categoryData,
      trendData,
      topRiskVendors,
    };
  }, [vendors]);

  const pieData = [
    {
      name: "Low Risk",
      value:
        analytics.riskBuckets.low,
    },
    {
      name: "Moderate Risk",
      value:
        analytics.riskBuckets
          .moderate,
    },
    {
      name: "High Risk",
      value:
        analytics.riskBuckets.high,
    },
  ];

  const handleRefresh = () => {
    setRefreshKey(
      (current) => current + 1
    );
  };

  if (loading) {
    return (
      <LoadingSkeleton
        variant="dashboard"
      />
    );
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_35%)]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Vendor Risk Intelligence
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              Executive Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              Monitor vendor exposure,
              operational risk, and
              category concentration from
              a single control center.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Refresh Data
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/vendors")
              }
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Open Vendors
            </button>
          </div>
        </div>
      </section>

      {message ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {message}
        </div>
      ) : null}

      <VendorStatsCards
        totalVendors={
          analytics.total
        }
        activeVendors={
          analytics.active
        }
        highRiskVendors={
          analytics.highRisk
        }
        averageRiskScore={
          analytics.averageRisk
        }
      />

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Risk Trend
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                A simple view of portfolio
                risk movement over time.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
              Average risk:{" "}
              {
                analytics.averageRisk
              }
              %
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={
                  analytics.trendData
                }
              >
                <defs>
                  <linearGradient
                    id="trendGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#4F46E5"
                      stopOpacity={0.35}
                    />

                    <stop
                      offset="95%"
                      stopColor="#4F46E5"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="month"
                  tick={{
                    fill: "#64748B",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  tick={{
                    fill: "#64748B",
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius:
                      "16px",
                    border:
                      "1px solid #E2E8F0",
                    boxShadow:
                      "0 20px 40px rgba(15, 23, 42, 0.08)",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  fill="url(#trendGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Risk Mix
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Distribution of risk across
              the portfolio.
            </p>
          </div>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={78}
                  paddingAngle={4}
                >
                  {pieData.map(
                    (_, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius:
                      "16px",
                    border:
                      "1px solid #E2E8F0",
                    boxShadow:
                      "0 20px 40px rgba(15, 23, 42, 0.08)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Category Distribution
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Breakdown of vendors by
              operational category.
            </p>
          </div>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={
                  analytics.categoryData
                }
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: "#64748B",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  tick={{
                    fill: "#64748B",
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius:
                      "16px",
                    border:
                      "1px solid #E2E8F0",
                    boxShadow:
                      "0 20px 40px rgba(15, 23, 42, 0.08)",
                  }}
                />

                <Bar
                  dataKey="value"
                  radius={[
                    10,
                    10,
                    0,
                    0,
                  ]}
                >
                  {analytics.categoryData.map(
                    (_, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Top Risk Vendors
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Highest-risk vendors
                currently in the portfolio.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
              Top 5
            </div>
          </div>

          <div className="space-y-4">
            {analytics.topRiskVendors.map(
              (vendor) => (
                <button
                  key={vendor.id}
                  type="button"
                  onClick={() =>
                    navigate(
                      `/vendors/${vendor.id}`
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {vendor.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {
                          vendor.category
                        }
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        vendor.status ===
                        "HIGH_RISK"
                          ? "bg-red-100 text-red-700"
                          : vendor.status ===
                            "ACTIVE"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Risk score
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      {vendor.score}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${
                        vendor.score >= 70
                          ? "bg-red-500"
                          : vendor.score >=
                            40
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          vendor.score,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </button>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;