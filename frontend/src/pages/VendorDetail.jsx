import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../services/api";

import LoadingSkeleton from "../components/LoadingSkeleton";

import EmptyState from "../components/EmptyState";

import AddVendorModal from "../components/AddVendorModal";

const VendorDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [vendor, setVendor] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [
    openEditModal,
    setOpenEditModal,
  ] = useState(false);

  const fetchVendor =
    useCallback(async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/vendors/${id}`
        );

        setVendor(response.data);
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load vendor details"
        );
      } finally {
        setLoading(false);
      }
    }, [id]);

  useEffect(() => {
    fetchVendor();
  }, [fetchVendor]);

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this vendor?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/vendors/${id}`
      );

      toast.success(
        "Vendor deleted successfully"
      );

      navigate("/vendors");
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to delete vendor"
      );
    }
  };

  const riskMeta = useMemo(() => {
    const score = Number(
      vendor?.riskScore || 0
    );

    if (score >= 70) {
      return {
        label: "High Risk",

        color:
          "bg-red-100 text-red-700 border-red-200",

        progress: "bg-red-500",
      };
    }

    if (score >= 40) {
      return {
        label: "Moderate Risk",

        color:
          "bg-yellow-100 text-yellow-700 border-yellow-200",

        progress:
          "bg-yellow-500",
      };
    }

    return {
      label: "Low Risk",

      color:
        "bg-emerald-100 text-emerald-700 border-emerald-200",

      progress:
        "bg-emerald-500",
    };
  }, [vendor]);

  if (loading) {
    return (
      <LoadingSkeleton variant="detail" />
    );
  }

  if (!vendor) {
    return (
      <EmptyState
        title="Vendor Not Found"
        description="The requested vendor record could not be located in the system."
        actionLabel="Back To Vendors"
        onAction={() =>
          navigate("/vendors")
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.22),transparent_35%)]" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl font-bold text-white shadow-xl">
              {vendor.name?.charAt(0)}
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Vendor Profile
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight">
                {vendor.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                  {vendor.category}
                </span>

                <span
                  className={`rounded-full border px-4 py-2 text-sm font-semibold ${riskMeta.color}`}
                >
                  {riskMeta.label}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() =>
                setOpenEditModal(true)
              }
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Edit Vendor
            </button>

            <button
              onClick={handleDelete}
              className="rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
            >
              Delete Vendor
            </button>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="grid gap-6 xl:grid-cols-3">
        {/* LEFT */}
        <div className="space-y-6 xl:col-span-2">
          {/* OVERVIEW */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Vendor Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Operational
                  information and vendor
                  intelligence summary.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                ID #{vendor.id}
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Vendor Name
                </p>

                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                  {vendor.name}
                </h3>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Category
                </p>

                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                  {vendor.category}
                </h3>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Current Status
                </p>

                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                  {vendor.status}
                </h3>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Risk Score
                </p>

                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                  {vendor.riskScore}%
                </h3>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Vendor Description
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Vendor
              responsibilities,
              compliance,
              operational impact, and
              ecosystem
              relationships.
            </p>

            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <p className="text-sm leading-7 text-slate-600">
                {vendor.description ||
                  "No detailed vendor description available."}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* RISK */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Risk Analysis
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current portfolio
                  exposure.
                </p>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskMeta.color}`}
              >
                {riskMeta.label}
              </span>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Risk Score
                </span>

                <span className="text-lg font-bold text-slate-900">
                  {vendor.riskScore}%
                </span>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${riskMeta.progress}`}
                  style={{
                    width: `${vendor.riskScore}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Quick Actions
            </h2>

            <div className="mt-6 space-y-3">
              <button
                onClick={() =>
                  setOpenEditModal(true)
                }
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-5 py-4 text-left transition hover:bg-slate-50"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    Edit Vendor
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Update vendor
                    information.
                  </p>
                </div>

                <span>✏️</span>
              </button>

              <button
                onClick={() =>
                  navigate("/analytics")
                }
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-5 py-4 text-left transition hover:bg-slate-50"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    View Analytics
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Open enterprise
                    analytics.
                  </p>
                </div>

                <span>📈</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL */}
      <AddVendorModal
        isOpen={openEditModal}
        onClose={() =>
          setOpenEditModal(false)
        }
        onSuccess={fetchVendor}
        initialData={vendor}
      />
    </div>
  );
};

export default VendorDetail;