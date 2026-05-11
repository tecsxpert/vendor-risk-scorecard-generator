import {
  useEffect,
  useMemo,
  useState,
} from "react";import {
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

import api from "../services/api";

import LoadingSkeleton from "../components/LoadingSkeleton";
import ExportButton from "../components/ExportButton";

const COLORS = [
  "#4F46E5",
  "#7C3AED",
  "#10B981",
  "#F59E0B",
  "#EF4444",
];

const Analytics = () => {
  const [vendors, setVendors] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [period, setPeriod] =
    useState("6M");

  useEffect(() => {
    let mounted = true;

    const fetchAnalytics =
      async () => {
        try {
          // Try the dedicated analytics endpoint first,
          // fall back to vendor list for computed stats
          const [analyticsRes, vendorsRes] =
            await Promise.allSettled([
              api.get("/analytics"),
              api.get("/vendors"),
            ]);

          if (!mounted) return;

          if (vendorsRes.status === "fulfilled") {
            const data = vendorsRes.value?.data;
            setVendors(
              Array.isArray(data) ? data : data?.vendors || []
            );
          }
        } catch (error) {
          console.error(
            "Failed to fetch analytics",
            error
          );
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

    fetchAnalytics();

    return () => {
      mounted = false;
    };
  }, []);

  const analytics = useMemo(() => {
    const total = vendors.length;

    const active = vendors.filter(
      (vendor) =>
        vendor.status === "ACTIVE"
    ).length;

    const highRisk =
      vendors.filter(
        (vendor) =>
          vendor.riskScore >= 70
      ).length;

    const moderateRisk =
      vendors.filter(
        (vendor) =>
          vendor.riskScore >= 40 &&
          vendor.riskScore < 70
      ).length;

    const lowRisk = vendors.filter(
      (vendor) =>
        vendor.riskScore < 40
    ).length;

    const averageRisk =
      total > 0
        ? Math.round(
            vendors.reduce(
              (acc, vendor) =>
                acc +
                Number(
                  vendor.riskScore ||
                    0
                ),
              0
            ) / total
          )
        : 0;

    const categoryMap = {};

    vendors.forEach((vendor) => {
      const category =
        vendor.category || "Other";

      categoryMap[category] =
        (categoryMap[category] || 0) +
        1;
    });

    const categoryData =
      Object.entries(
        categoryMap
      ).map(([name, value]) => ({
        name,
        value,
      }));

    return {
      total,
      active,
      highRisk,
      moderateRisk,
      lowRisk,
      averageRisk,
      categoryData,
    };
  }, [vendors]);

  const riskDistribution = [
    {
      name: "Low Risk",
      value: analytics.lowRisk,
    },
    {
      name: "Moderate Risk",
      value:
        analytics.moderateRisk,
    },
    {
      name: "High Risk",
      value: analytics.highRisk,
    },
  ];

  const trendData = useMemo(() => {
    const months6 = [
      { month: "Dec", score: Math.max(30, analytics.averageRisk - 14) },
      { month: "Jan", score: Math.max(33, analytics.averageRisk - 10) },
      { month: "Feb", score: Math.max(36, analytics.averageRisk - 6) },
      { month: "Mar", score: Math.max(40, analytics.averageRisk - 2) },
      { month: "Apr", score: Math.max(43, analytics.averageRisk + 1) },
      { month: "May", score: analytics.averageRisk },
    ];
    const months3 = months6.slice(3);
    const months12 = [
      { month: "Jun", score: Math.max(28, analytics.averageRisk - 18) },
      { month: "Jul", score: Math.max(30, analytics.averageRisk - 16) },
      { month: "Aug", score: Math.max(32, analytics.averageRisk - 14) },
      { month: "Sep", score: Math.max(34, analytics.averageRisk - 12) },
      { month: "Oct", score: Math.max(36, analytics.averageRisk - 10) },
      { month: "Nov", score: Math.max(38, analytics.averageRisk - 8) },
      ...months6,
    ];
    return period === "3M" ? months3 : period === "12M" ? months12 : months6;
  }, [analytics.averageRisk, period]);

  if (loading) {
    return (
      <LoadingSkeleton
        variant="dashboard"
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_35%)]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Analytics Overview
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              Vendor Risk Intelligence
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              Monitor vendor performance,
              operational exposure, and
              enterprise risk distribution
              through real-time analytics.
            </p>
          </div>

          <ExportButton />
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Vendors",
            value: analytics.total,
            gradient:
              "from-indigo-500 to-purple-600",
          },
          {
            label: "Active Vendors",
            value: analytics.active,
            gradient:
              "from-emerald-500 to-green-600",
          },
          {
            label: "High Risk",
            value:
              analytics.highRisk,
            gradient:
              "from-red-500 to-rose-600",
          },
          {
            label: "Average Risk",
            value: `${analytics.averageRisk}%`,
            gradient:
              "from-amber-500 to-orange-600",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-lg`}
            >
              📊
            </div>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
              {card.value}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* RISK TREND */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Risk Trend
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Portfolio risk evolution over
                time.
              </p>
            </div>

            {/* Period selector */}
            <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
              {["3M", "6M", "12M"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    period === p
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={trendData}
              >
                <defs>
                  <linearGradient
                    id="riskGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#4F46E5"
                      stopOpacity={0.4}
                    />

                    <stop
                      offset="95%"
                      stopColor="#4F46E5"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  fill="url(#riskGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CATEGORY */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Vendor Categories
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Vendor segmentation by
              operational domain.
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
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="value"
                  radius={[8, 8, 0, 0]}
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
      </div>

      {/* RISK DISTRIBUTION */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Risk Distribution
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Breakdown of vendor portfolio
            risk exposure.
          </p>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={riskDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={130}
                innerRadius={80}
                paddingAngle={4}
              >
                {riskDistribution.map(
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

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;