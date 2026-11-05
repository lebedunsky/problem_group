import { useEffect, useState } from "react";
import { api, ApiError } from "../api/client";

export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    setLoading(true);
    api<T>(path)
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setError(null);
        }
      })
      .catch((e: ApiError) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  return { data, loading, error, setData };
}
