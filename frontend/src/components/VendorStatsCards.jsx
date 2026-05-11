import PropTypes from "prop-types";

const StatCard = ({
  title,
  value,
  change,
  icon,
  gradient,
  description,
}) => {
  const isPositive = change >= 0;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_35%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              {title}
            </p>

            <h3 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
              {value}
            </h3>
          </div>

          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
          >
            {icon}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
              isPositive
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-3.5 w-3.5 ${
                isPositive ? "" : "rotate-180"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 15l7-7 7 7"
              />
            </svg>

            {Math.abs(change)}%
          </div>

          <p className="text-xs text-slate-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  change: PropTypes.number.isRequired,
  icon: PropTypes.node.isRequired,
  gradient: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const VendorStatsCards = ({
  totalVendors,
  activeVendors,
  highRiskVendors,
  averageRiskScore,
}) => {
  const stats = [
    {
      title: "Total Vendors",
      value: totalVendors,
      change: 12,
      description:
        "Compared to last month",
      gradient:
        "from-indigo-500 to-purple-600",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5V4H2v16h5m10 0v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6m10 0H7"
          />
        </svg>
      ),
    },
    {
      title: "Active Vendors",
      value: activeVendors,
      change: 8,
      description:
        "Healthy vendor activity",
      gradient:
        "from-emerald-500 to-green-600",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "High Risk",
      value: highRiskVendors,
      change: -5,
      description:
        "Reduced risk exposure",
      gradient:
        "from-red-500 to-rose-600",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-7.938 4h15.876c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L2.33 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    {
      title: "Average Risk",
      value: `${averageRiskScore}%`,
      change: 3,
      description:
        "Portfolio risk index",
      gradient:
        "from-amber-500 to-orange-600",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11 3a1 1 0 012 0v1a1 1 0 11-2 0V3zm5.657 2.343a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0M21 11a1 1 0 100 2h-1a1 1 0 100-2h1zm-9 7a1 1 0 012 0v1a1 1 0 11-2 0v-1zm-7.657-1.343a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414M4 11a1 1 0 100 2H3a1 1 0 100-2h1zm2.343-6.657a1 1 0 00-1.414 0l-.707.707A1 1 0 105.636 6.464l.707-.707a1 1 0 000-1.414M12 8a4 4 0 100 8 4 4 0 000-8z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          description={stat.description}
          icon={stat.icon}
          gradient={stat.gradient}
        />
      ))}
    </div>
  );
};

VendorStatsCards.propTypes = {
  totalVendors: PropTypes.number,
  activeVendors: PropTypes.number,
  highRiskVendors: PropTypes.number,
  averageRiskScore: PropTypes.number,
};

VendorStatsCards.defaultProps = {
  totalVendors: 0,
  activeVendors: 0,
  highRiskVendors: 0,
  averageRiskScore: 0,
};

export default VendorStatsCards;