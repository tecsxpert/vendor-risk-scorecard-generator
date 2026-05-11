import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./routes/ProtectedRoute";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import VendorList from "./pages/VendorList";
import VendorDetail from "./pages/VendorDetail";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const ProtectedLayout = ({
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-100">

      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

    </div>
  );
};

function App() {
  return (
    <AuthProvider>

      <Router>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,

            style: {
              borderRadius: "16px",
              background: "#0F172A",
              color: "#FFFFFF",
              padding: "14px 16px",
              fontSize: "14px",
              fontWeight: 500,
              boxShadow:
                "0 10px 40px rgba(15, 23, 42, 0.18)",
            },
          }}
        />

        <Routes>

          {/* PUBLIC */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* PROTECTED */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>

                <ProtectedLayout>
                  <Dashboard />
                </ProtectedLayout>

              </ProtectedRoute>
            }
          />

          <Route
            path="/vendors"
            element={
              <ProtectedRoute>

                <ProtectedLayout>
                  <VendorList />
                </ProtectedLayout>

              </ProtectedRoute>
            }
          />

          <Route
            path="/vendors/:id"
            element={
              <ProtectedRoute>

                <ProtectedLayout>
                  <VendorDetail />
                </ProtectedLayout>

              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>

                <ProtectedLayout>
                  <Analytics />
                </ProtectedLayout>

              </ProtectedRoute>
            }
          />

          {/* DEFAULT */}
          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </Router>

    </AuthProvider>
  );
}

export default App;