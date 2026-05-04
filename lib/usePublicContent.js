"use client";

import { useEffect, useState } from "react";

export default function usePublicContent(key, fallbackData) {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const fallback = JSON.stringify(fallbackData);

  useEffect(() => {
    let mounted = true;
    const parsedFallback = JSON.parse(fallback);

    const loadContent = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/content/${encodeURIComponent(key)}`, {
          cache: "default",
        });
        const result = await response.json();
        if (mounted && response.ok && result.success) {
          setData(result.data.content);
        } else if (mounted) {
          setData(parsedFallback);
        }
      } catch {
        if (mounted) {
          setData(parsedFallback);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadContent();
    return () => {
      mounted = false;
    };
  }, [key, fallback]);

  return { data, loading };
}
