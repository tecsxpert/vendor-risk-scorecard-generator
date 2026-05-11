import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "../services/api";

import VendorTable from "../components/VendorTable";

import VendorFilters from "../components/VendorFilters";

import VendorStatsCards from "../components/VendorStatsCards";

import AddVendorModal from "../components/AddVendorModal";

import UploadModal from "../components/UploadModal";

import ExportButton from "../components/ExportButton";

import EmptyState from "../components/EmptyState";

import LoadingSkeleton from "../components/LoadingSkeleton";

const VendorList = () => {
  const [vendors, setVendors] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    openAddModal,
    setOpenAddModal,
  ] = useState(false);

  const [
    openUploadModal,
    setOpenUploadModal,
  ] = useState(false);

  const [filters, setFilters] =
    useState({
      search: "",
      status: "",
      sort: "newest",
    });

  const fetchVendors =
    useCallback(async () => {
      try {
        setLoading(true);

        const response = await api.get(
          "/vendors"
        );

        const data = Array.isArray(
          response.data
        )
          ? response.data
          : response.data?.vendors ||
            [];

        setVendors(data);
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load vendors"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const filteredVendors =
    useMemo(() => {
      let result = [...vendors];

      if (filters.search) {
        result = result.filter(
          (vendor) =>
            `${vendor.name} ${vendor.category}`
              .toLowerCase()
              .includes(
                filters.search.toLowerCase()
              )
        );
      }

      if (filters.status) {
        result = result.filter(
          (vendor) =>
            vendor.status ===
            filters.status
        );
      }

      switch (filters.sort) {
        case "risk_desc":
          result.sort(
            (a, b) =>
              b.riskScore -
              a.riskScore
          );

          break;

        case "risk_asc":
          result.sort(
            (a, b) =>
              a.riskScore -
              b.riskScore
          );

          break;

        case "oldest":
          result.sort(
            (a, b) => a.id - b.id
          );

          break;

        default:
          result.sort(
            (a, b) => b.id - a.id
          );

          break;
      }

      return result;
    }, [vendors, filters]);

  const stats = useMemo(() => {
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

    return {
      total,
      active,
      highRisk,
      averageRisk,
    };
  }, [vendors]);

  if (loading) {
    return (
      <LoadingSkeleton variant="table" />
    );
  }

  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.22),transparent_35%)]" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Vendor Operations
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              Vendor Registry
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Centralized vendor
              intelligence, risk
              scoring, and operational
              monitoring platform for
              enterprise ecosystems.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() =>
                setOpenAddModal(true)
              }
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Add Vendor
            </button>

            <button
              onClick={() =>
                setOpenUploadModal(
                  true
                )
              }
              className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Upload CSV
            </button>

            <ExportButton />
          </div>
        </div>
      </section>

      {/* STATS */}
      <VendorStatsCards
        totalVendors={stats.total}
        activeVendors={stats.active}
        highRiskVendors={
          stats.highRisk
        }
        averageRiskScore={
          stats.averageRisk
        }
      />

      {/* FILTERS */}
      <VendorFilters
        filters={filters}
        onChange={setFilters}
        totalResults={
          filteredVendors.length
        }
      />

      {/* TABLE */}
      {filteredVendors.length >
      0 ? (
        <VendorTable
          vendors={filteredVendors}
        />
      ) : (
        <EmptyState
          title="No Vendors Found"
          description="No vendors match the current search or filter criteria."
          actionLabel="Clear Filters"
          onAction={() =>
            setFilters({
              search: "",
              status: "",
              sort: "newest",
            })
          }
        />
      )}

      {/* MODALS */}
      <AddVendorModal
        isOpen={openAddModal}
        onClose={() =>
          setOpenAddModal(false)
        }
        onSuccess={fetchVendors}
      />

      <UploadModal
        isOpen={openUploadModal}
        onClose={() =>
          setOpenUploadModal(false)
        }
        onSuccess={fetchVendors}
      />
    </div>
  );
};

export default VendorList;