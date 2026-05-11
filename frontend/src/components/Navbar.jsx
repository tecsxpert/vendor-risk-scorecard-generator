import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import useAuth from "../context/useAuth";

const Navbar = () => {
  const { logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState(false);

  const dropdownRef = useRef(null);

  const navItems = useMemo(
    () => [
      {
        label: "Dashboard",
        path: "/dashboard",
      },
      {
        label: "Vendors",
        path: "/vendors",
      },
      {
        label: "Analytics",
        path: "/analytics",
      },
    ],
    []
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  const isActive = (path) =>
    location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/75 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_30%)]" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* LEFT */}
        <div
          onClick={() => navigate("/dashboard")}
          className="group flex cursor-pointer items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-lg font-bold text-white shadow-lg transition duration-300 group-hover:scale-105 group-hover:shadow-indigo-200">
            V
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              VendorRisk
            </h1>

            <p className="text-xs text-slate-500">
              Vendor Intelligence Platform
            </p>
          </div>
        </div>

        {/* CENTER */}
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`relative overflow-hidden rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {isActive(item.path) && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
              )}

              <span className="relative z-10">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* RIGHT */}
        <div
          ref={dropdownRef}
          className="relative"
        >
          <button
            onClick={() =>
              setOpenMenu((prev) => !prev)
            }
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-sm font-semibold text-white shadow">
              U
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800">
                Admin User
              </p>

              <p className="text-xs text-slate-500">
                Secure Session
              </p>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 text-slate-500 transition ${
                openMenu ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-sm font-semibold text-slate-900">
                  Admin User
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  vendor.admin@company.com
                </p>
              </div>

              <div className="p-2">
                <button
                  onClick={() =>
                    navigate("/dashboard")
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
                >
                  <span>📊</span>
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() =>
                    navigate("/vendors")
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
                >
                  <span>🏢</span>
                  <span>Vendors</span>
                </button>

                <button
                  onClick={() =>
                    navigate("/analytics")
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
                >
                  <span>📈</span>
                  <span>Analytics</span>
                </button>
              </div>

              <div className="border-t border-slate-100 p-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;