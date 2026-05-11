import PropTypes from "prop-types";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import useAuth from "../context/useAuth";

const FullPageLoader = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_35%)]" />

      <div className="relative flex flex-col items-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-indigo-500/30 blur-2xl" />

          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-white/20 border-t-indigo-400" />
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-bold tracking-tight text-white">
          Securing Session
        </h2>

        <p className="mt-3 max-w-sm text-center text-sm leading-6 text-slate-400">
          Verifying authentication and
          preparing access to the
          Vendor Risk platform.
        </p>
      </div>
    </div>
  );
};

const ProtectedRoute = ({
  children,
}) => {
  const location = useLocation();

  const {
    isAuthenticated,
    loading,
    initialized,
  } = useAuth();

  if (loading || !initialized) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
};

ProtectedRoute.propTypes = {
  children:
    PropTypes.node.isRequired,
};

export default ProtectedRoute;