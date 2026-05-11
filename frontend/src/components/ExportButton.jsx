import { useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import api from "../services/api";

const ExportButton = ({
  endpoint = "/export/vendors",
  filename = "vendors-report.csv",
  label = "Export CSV",
}) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);

      const response = await api.get(endpoint, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", filename);

      document.body.appendChild(link);

      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Export completed successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-purple-500/0 opacity-0 transition group-hover:opacity-100" />

      <div className="relative flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
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
                d="M12 16V4m0 12l-4-4m4 4l4-4M4 20h16"
              />
            </svg>
          )}
        </div>

        <div className="text-left">
          <p className="text-sm font-semibold text-slate-900">
            {loading ? "Preparing Export..." : label}
          </p>

          <p className="text-xs text-slate-500">
            Download vendor analytics report
          </p>
        </div>
      </div>
    </button>
  );
};

ExportButton.propTypes = {
  endpoint: PropTypes.string,
  filename: PropTypes.string,
  label: PropTypes.string,
};

export default ExportButton;