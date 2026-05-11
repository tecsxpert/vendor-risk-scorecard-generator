import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import api from "../services/api";

const useFetch = ({
  url,
  method = "GET",
  body = null,
  params = {},
  immediate = true,
}) => {
  const mountedRef = useRef(true);

  const [data, setData] = useState(null);

  const [loading, setLoading] =
    useState(immediate);

  const [error, setError] =
    useState(null);

  const execute = useCallback(
    async (overrideConfig = {}) => {
      try {
        setLoading(true);
        setError(null);

        const response = await api({
          url:
            overrideConfig.url || url,

          method:
            overrideConfig.method ||
            method,

          data:
            overrideConfig.body || body,

          params:
            overrideConfig.params ||
            params,
        });

        if (mountedRef.current) {
          setData(response.data);
        }

        return {
          success: true,
          data: response.data,
        };
      } catch (err) {
        console.error(
          "Fetch request failed",
          err
        );

        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong";

        if (mountedRef.current) {
          setError(message);
        }

        return {
          success: false,
          error: message,
        };
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [url, method, body, params]
  );

  useEffect(() => {
    mountedRef.current = true;

    if (immediate) {
      execute();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [execute, immediate]);

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

export default useFetch;