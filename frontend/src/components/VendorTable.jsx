import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const getRiskStyles = (score) => {
  if (score >= 70) {
    return {
      badge:
        "bg-red-100 text-red-700 border-red-200",
      progress: "bg-red-500",
      label: "High",
    };
  }

  if (score >= 40) {
    return {
      badge:
        "bg-yellow-100 text-yellow-700 border-yellow-200",
      progress: "bg-yellow-500",
      label: "Moderate",
    };
  }

  return {
    badge:
      "bg-emerald-100 text-emerald-700 border-emerald-200",
    progress: "bg-emerald-500",
    label: "Low",
  };
};

const getStatusStyles = (status) => {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700";

    case "HIGH_RISK":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

const VendorTable = ({ vendors }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Vendor Registry
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Monitor vendor risk posture and
            operational status.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
          {vendors.length} Vendors
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-100">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Vendor
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Category
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Risk Score
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {vendors.map((vendor) => {
              const riskStyles =
                getRiskStyles(
                  vendor.riskScore
                );

              return (
                <tr
                  key={vendor.id}
                  className="group transition hover:bg-slate-50/80"
                >
                  {/* VENDOR */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white shadow">
                        {vendor.name?.charAt(0) ||
                          "V"}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {vendor.name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          ID #{vendor.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="px-6 py-5">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {vendor.category}
                    </span>
                  </td>

                  {/* RISK */}
                  <td className="px-6 py-5">
                    <div className="max-w-[180px]">
                      <div className="mb-2 flex items-center justify-between">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${riskStyles.badge}`}
                        >
                          {riskStyles.label}
                        </span>

                        <span className="text-sm font-semibold text-slate-800">
                          {vendor.riskScore}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${riskStyles.progress}`}
                          style={{
                            width: `${vendor.riskScore}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(
                        vendor.status
                      )}`}
                    >
                      {vendor.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() =>
                        navigate(
                          `/vendors/${vendor.id}`
                        )
                      }
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* EMPTY */}
      {vendors.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-4xl">
            📭
          </div>

          <h3 className="mt-6 text-xl font-bold text-slate-900">
            No Vendors Found
          </h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            No vendor records are currently
            available. Add vendors to begin risk
            monitoring and analytics.
          </p>
        </div>
      )}
    </div>
  );
};

VendorTable.propTypes = {
  vendors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      name: PropTypes.string,
      category: PropTypes.string,
      riskScore: PropTypes.number,
      status: PropTypes.string,
    })
  ),
};

VendorTable.defaultProps = {
  vendors: [],
};

export default VendorTable;