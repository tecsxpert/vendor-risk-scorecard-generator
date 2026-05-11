import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

const VendorFilters = ({
  filters,
  onChange,
  totalResults,
}) => {
  const [localSearch, setLocalSearch] = useState(
    filters.search || ""
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({
        ...filters,
        search: localSearch,
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [localSearch]);

  const statusOptions = useMemo(
    () => [
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
    ],
    []
  );

  const sortOptions = useMemo(
    () => [
      {
        label: "Newest First",
        value: "newest",
      },
      {
        label: "Oldest First",
        value: "oldest",
      },
      {
        label: "Risk Score High → Low",
        value: "risk_desc",
      },
      {
        label: "Risk Score Low → High",
        value: "risk_asc",
      },
    ],
    []
  );

  const clearFilters = () => {
    setLocalSearch("");

    onChange({
      search: "",
      status: "",
      sort: "newest",
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_30%)]" />

      <div className="relative p-6">
        {/* TOP */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Vendor Filters
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search, filter, and organize vendor
              intelligence.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            {totalResults} Results
          </div>
        </div>

        {/* FILTER GRID */}
        <div className="mt-6 grid gap-4 xl:grid-cols-4">
          {/* SEARCH */}
          <div className="xl:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Search Vendors
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <input
                type="text"
                value={localSearch}
                onChange={(e) =>
                  setLocalSearch(e.target.value)
                }
                placeholder="Search by vendor name or category..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
              />
            </div>
          </div>

          {/* STATUS */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              value={filters.status}
              onChange={(e) =>
                onChange({
                  ...filters,
                  status: e.target.value,
                })
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
            >
              {statusOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* SORT */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Sort By
            </label>

            <select
              value={filters.sort}
              onChange={(e) =>
                onChange({
                  ...filters,
                  sort: e.target.value,
                })
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
            >
              {sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {filters.search && (
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                Search: {filters.search}
              </span>
            )}

            {filters.status && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Status: {filters.status}
              </span>
            )}
          </div>

          <button
            onClick={clearFilters}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

VendorFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    status: PropTypes.string,
    sort: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  totalResults: PropTypes.number,
};

VendorFilters.defaultProps = {
  totalResults: 0,
};

export default VendorFilters;