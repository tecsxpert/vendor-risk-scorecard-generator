import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import api from "../services/api";

const INITIAL_FORM = {
  name: "",
  category: "",
  riskScore: "",
  status: "ACTIVE",
  description: "",
};

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

const AddVendorModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditMode = useMemo(
    () => Boolean(initialData?.id),
    [initialData]
  );

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        category: initialData.category || "",
        riskScore: initialData.riskScore || "",
        status: initialData.status || "ACTIVE",
        description: initialData.description || "",
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Vendor name is required";
    }

    if (!form.category.trim()) {
      nextErrors.category = "Category is required";
    }

    const score = Number(form.riskScore);

    if (!Number.isFinite(score)) {
      nextErrors.riskScore = "Risk score is required";
    } else if (score < 0 || score > 100) {
      nextErrors.riskScore =
        "Risk score must be between 0 and 100";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        ...form,
        riskScore: Number(form.riskScore),
      };

      if (isEditMode) {
        await api.put(
          `/vendors/${initialData.id}`,
          payload
        );

        toast.success("Vendor updated successfully");
      } else {
        await api.post("/vendors", payload);

        toast.success("Vendor added successfully");
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
      errors[field]
        ? "border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-[fadeIn_.2s_ease]">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Vendor Management
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                {isEditMode
                  ? "Edit Vendor"
                  : "Add Vendor"}
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                Manage vendor information, risk scoring,
                and status.
              </p>
            </div>

            <button
              onClick={onClose}
              className="h-10 w-10 rounded-xl bg-white/10 text-white transition hover:bg-white/20"
            >
              ✕
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 px-8 py-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Vendor Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter vendor name"
                className={inputClass("name")}
              />

              {errors.name && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Cloud, Finance, Security..."
                className={inputClass("category")}
              />

              {errors.category && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.category}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Risk Score
              </label>

              <input
                type="number"
                name="riskScore"
                value={form.riskScore}
                onChange={handleChange}
                placeholder="0 - 100"
                className={inputClass("riskScore")}
              />

              {errors.riskScore && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.riskScore}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass("status")}
              >
                {STATUS_OPTIONS.map((option) => (
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

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              rows="5"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe vendor details, risks, dependencies..."
              className={`${inputClass(
                "description"
              )} resize-none`}
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Adding..."
                : isEditMode
                ? "Update Vendor"
                : "Add Vendor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddVendorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default AddVendorModal;