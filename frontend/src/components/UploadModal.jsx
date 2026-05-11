import { useRef, useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import api from "../services/api";

const UploadModal = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const allowedExtensions = [
    "csv",
    "xlsx",
  ];

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;

    const extension =
      selectedFile.name
        .split(".")
        .pop()
        ?.toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      toast.error(
        "Only CSV and XLSX files are allowed"
      );

      return false;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size must be below 5MB");

      return false;
    }

    return true;
  };

  const handleFile = (selectedFile) => {
    if (!validateFile(selectedFile)) return;

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setDragging(false);

    const droppedFile =
      e.dataTransfer.files?.[0];

    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");

      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);

      await api.post(
        "/upload/vendors",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        "File uploaded successfully"
      );

      setFile(null);

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);

      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Bulk Upload
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Upload Vendor Data
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                Import vendor records using
                CSV or Excel files.
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

        {/* CONTENT */}
        <div className="px-8 py-8">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() =>
              setDragging(false)
            }
            className={`relative rounded-3xl border-2 border-dashed px-8 py-14 text-center transition ${
              dragging
                ? "border-indigo-500 bg-indigo-50"
                : "border-slate-300 bg-slate-50"
            }`}
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-900">
              Drag & Drop Your File
            </h3>

            <p className="mt-3 text-sm text-slate-500">
              Upload vendor records using CSV
              or XLSX format.
            </p>

            <button
              onClick={() =>
                inputRef.current?.click()
              }
              className="mt-8 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
            >
              Browse Files
            </button>

            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx"
              hidden
              onChange={(e) =>
                handleFile(
                  e.target.files?.[0]
                )
              }
            />
          </div>

          {/* FILE PREVIEW */}
          {file && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-xl">
                    📄
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {file.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {(
                        file.size / 1024
                      ).toFixed(2)}{" "}
                      KB
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setFile(null)
                  }
                  className="rounded-xl px-3 py-2 text-sm text-red-500 transition hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Uploading..."
                : "Upload Vendors"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

UploadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default UploadModal;