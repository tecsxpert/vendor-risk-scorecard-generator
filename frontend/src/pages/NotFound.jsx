import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.22),transparent_35%)]" />

      <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center text-center">
          {/* ICON */}
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-500/20 blur-2xl" />

            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-5xl font-black shadow-2xl">
              404
            </div>
          </div>

          {/* CONTENT */}
          <div className="mt-10">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-300">
              Page Not Found
            </p>

            <h1 className="mt-5 text-5xl font-bold tracking-tight text-white">
              Lost in Vendor Space
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-300">
              The page you are looking
              for does not exist, may
              have been moved, or is
              temporarily unavailable.
              Continue navigating
              through the Vendor Risk
              platform using the
              actions below.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="group relative overflow-hidden rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              <span className="relative z-10">
                Go To Dashboard
              </span>
            </button>

            <button
              onClick={() =>
                navigate("/vendors")
              }
              className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Open Vendor Registry
            </button>
          </div>

          {/* INFO GRID */}
          <div className="mt-14 grid w-full gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                System
              </p>

              <h3 className="mt-3 text-xl font-bold">
                Online
              </h3>

              <p className="mt-2 text-sm text-slate-300">
                Vendor monitoring
                services are active.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Routing
              </p>

              <h3 className="mt-3 text-xl font-bold">
                Secure
              </h3>

              <p className="mt-2 text-sm text-slate-300">
                Protected navigation is
                functioning normally.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Platform
              </p>

              <h3 className="mt-3 text-xl font-bold">
                Stable
              </h3>

              <p className="mt-2 text-sm text-slate-300">
                All vendor intelligence
                modules are operational.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;