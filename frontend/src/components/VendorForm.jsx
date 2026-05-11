import { useMemo, useState } from "react";
import PropTypes from "prop-types";

const STATUS_OPTIONS = [
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

const CATEGORY_OPTIONS = [
  "Cloud",
  "Finance",
  "Security",
  "Infrastructure",
  "Compliance",
  "Analytics",
  "Operations",
];

const VendorForm = ({
  initialValues,
  onSubmit,
  loading,
  submitLabel,
}) => {
  const [form, setForm] = useState({
    name: initialValues.name || "",
    category: initialValues.category || "",
    riskScore:
      initialValues.riskScore || "",
    status:
      initialValues.status || "ACTIVE",
    description:
      initialValues.description || "",
  });

  const [errors, setErrors] = useState(
    {}
  );

  const riskLevel = useMemo(() => {
    const score = Number(form.riskScore);

    if (score >= 70) {
      return {
        label: "High Risk",
        color:
          "bg-red-100 text-red-700 border-red-200",
      };
    }

    if (score >= 40) {
      return {
        label: "Moderate Risk",
        color:
          "bg-yellow-100 text-yellow-700 border-yellow-200",
      };
    }

    return {
      label: "Low Risk",
      color:
        "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
  }, [form.riskScore]);

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name =
        "Vendor name is required";
    }

    if (!form.category.trim()) {
      nextErrors.category =
        "Vendor category is required";
    }

    const score = Number(form.riskScore);

    if (!Number.isFinite(score)) {
      nextErrors.riskScore =
        "Risk score must be valid";
    } else if (score < 0 || score > 100) {
      nextErrors.riskScore =
        "Risk score must be between 0 and 100";
    }

    if (!form.description.trim()) {
      nextErrors.description =
        "Description is required";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const handleChange = (e) => {
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      ...form,
      riskScore: Number(form.riskScore),
    });
  };

  const inputClass = (field) =>
    `w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
      errors[field]
        ? "border-red-300 focus:ring-4 focus:ring-red-100"
        : "border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* BASIC INFO */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Vendor Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure vendor identity and
              operational details.
            </p>
          </div>

          <div
            className={`rounded-full border px-4 py-2 text-xs font-semibold ${riskLevel.color}`}
          >
            {riskLevel.label}
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {/* NAME */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Vendor Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Microsoft Azure"
              className={inputClass("name")}
            />

            {errors.name && (
              <p className="mt-2 text-xs text-red-500">
                {errors.name}
              </p>
            )}
          </div>

          {/* CATEGORY */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClass(
                "category"
              )}
            >
              <option value="">
                Select category
              </option>

              {CATEGORY_OPTIONS.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}
            </select>

            {errors.category && (
              <p className="mt-2 text-xs text-red-500">
                {errors.category}
              </p>
            )}
          </div>

          {/* SCORE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Risk Score
            </label>

            <div className="relative">
              <input
                type="number"
                name="riskScore"
                value={form.riskScore}
                onChange={handleChange}
                placeholder="0 - 100"
                className={inputClass(
                  "riskScore"
                )}
              />

              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-slate-400">
                %
              </div>
            </div>

            {errors.riskScore && (
              <p className="mt-2 text-xs text-red-500">
                {errors.riskScore}
              </p>
            )}
          </div>

          {/* STATUS */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Vendor Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClass("status")}
            >
              {STATUS_OPTIONS.map(
                (status) => (
                  <option
                    key={status.value}
                    value={status.value}
                  >
                    {status.label}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">
          Vendor Overview
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Describe vendor responsibilities,
          compliance considerations, and
          risks.
        </p>

        <div className="mt-5">
          <textarea
            rows="6"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Vendor handles cloud infrastructure, compliance operations, and enterprise integrations..."
            className={`${inputClass(
              "description"
            )} resize-none`}
          />

          <div className="mt-2 flex items-center justify-between">
            {errors.description ? (
              <p className="text-xs text-red-500">
                {errors.description}
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Provide meaningful operational
                context.
              </p>
            )}

            <p className="text-xs text-slate-400">
              {form.description.length}/500
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : submitLabel}
        </button>
      </div>
    </form>
  );
};

VendorForm.propTypes = {
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    category: PropTypes.string,
    riskScore: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    status: PropTypes.string,
    description: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  submitLabel: PropTypes.string,
};

VendorForm.defaultProps = {
  initialValues: {},
  loading: false,
  submitLabel: "Save Vendor",
};

export default VendorForm;