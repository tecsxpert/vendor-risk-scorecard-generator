import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import PropTypes from "prop-types";

import api from "../services/api";

export const AuthContext =
  createContext(null);

const STORAGE_KEY = "vendor_risk_auth";

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [initialized, setInitialized] =
    useState(false);

  const setAuthHeader = (token) => {
    if (token) {
      api.defaults.headers.common.Authorization =
        `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common
        .Authorization;
    }
  };

  const persistSession = (session) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(session)
    );
  };

  const clearSession = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedSession =
          localStorage.getItem(STORAGE_KEY);

        if (!savedSession) {
          return;
        }

        const parsedSession =
          JSON.parse(savedSession);

        if (!parsedSession?.token) {
          clearSession();

          return;
        }

        setAuthHeader(parsedSession.token);

        setUser(
          parsedSession.user || null
        );
      } catch (error) {
        console.error(
          "Failed to restore session",
          error
        );

        clearSession();
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(
    async ({
      email,
      password,
    }) => {
      try {
        setLoading(true);

        const response =
          await api.post(
            "/auth/login",
            {
              email,
              password,
            }
          );

        const data = response.data;

        const session = {
          token: data.token,
          user: {
            id: data.user?.id,
            name: data.user?.name,
            email: data.user?.email,
            role: data.user?.role,
          },
        };

        persistSession(session);

        setAuthHeader(session.token);

        setUser(session.user);

        return {
          success: true,
        };
      } catch (error) {
        console.error(
          "Authentication failed",
          error
        );

        return {
          success: false,
          message:
            error?.response?.data
              ?.message ||
            "Invalid credentials",
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    clearSession();

    setAuthHeader(null);

    setUser(null);
  }, []);

  const updateUser = useCallback(
    (updatedUser) => {
      setUser((prev) => {
        const nextUser = {
          ...prev,
          ...updatedUser,
        };

        const existing =
          JSON.parse(
            localStorage.getItem(
              STORAGE_KEY
            )
          ) || {};

        persistSession({
          ...existing,
          user: nextUser,
        });

        return nextUser;
      });
    },
    []
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      initialized,
      isAuthenticated:
        Boolean(user),
      login,
      logout,
      updateUser,
    }),
    [
      user,
      loading,
      initialized,
      login,
      logout,
      updateUser,
    ]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;