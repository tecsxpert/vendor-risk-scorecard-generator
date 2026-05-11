import { useState } from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import useAuth from "../context/useAuth";

const Login = () => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const from =
    location.state?.from ||
    "/dashboard";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.email.trim() ||
      !form.password.trim()
    ) {
      toast.error(
        "Email and password are required"
      );

      return;
    }

    try {
      setLoading(true);

      const result = await login({
        email: form.email.trim(),
        password: form.password,
      });

      if (!result?.success) {
        toast.error(
          result?.message ||
            "Login failed"
        );

        return;
      }

      toast.success(
        "Login successful"
      );

      navigate(from, {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-700 via-slate-900 to-slate-950 p-10 text-white lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.35),transparent_35%)]" />

          <div className="relative flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium tracking-[0.2em] text-white/80">
                TOOL-93
              </div>

              <h1 className="mt-8 max-w-xl text-5xl font-bold tracking-tight">
                Vendor Risk Scorecard
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-slate-200">
                Secure access to an
                enterprise-style vendor
                intelligence platform with
                dashboards, risk
                analytics, and operational
                workflows.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  Monitoring
                </p>

                <p className="mt-3 text-2xl font-bold">
                  24/7
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  Risk Engine
                </p>

                <p className="mt-3 text-2xl font-bold">
                  Live
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  Security
                </p>

                <p className="mt-3 text-2xl font-bold">
                  JWT
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-slate-950/80 px-6 py-10 sm:px-10">
          <div className="w-full max-w-md rounded-[1.75rem] border border-white/10 bg-white/95 p-8 shadow-2xl">
            <div className="mb-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-lg">
                V
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Sign in
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Access the vendor risk
                dashboard and manage
                intelligence workflows.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@company.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                  autoComplete="email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="relative z-10">
                  {loading
                    ? "Signing in..."
                    : "Sign in"}
                </span>

                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-indigo-500/20 to-purple-600/0 opacity-0 transition group-hover:opacity-100" />
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Demo access
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Use any company email and
                password if your backend
                auth is mocked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;