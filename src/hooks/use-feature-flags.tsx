"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface FeatureFlag {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface FeatureFlagsContextType {
  flags: FeatureFlag[];
  loading: boolean;
  isEnabled: (slug: string) => boolean;
  refreshFlags: () => Promise<void>;
  toggleFlag: (id: string, isEnabled: boolean) => Promise<void>;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(
  undefined
);

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFlags = async () => {
    try {
      const response = await fetch("/api/feature-flags");
      if (response.ok) {
        const data = await response.json();
        setFlags(data);
      }
    } catch (error) {
      console.error("Error fetching feature flags:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const isEnabled = (slug: string): boolean => {
    const flag = flags.find((f) => f.slug === slug);
    return flag?.is_enabled ?? false;
  };

  const refreshFlags = async () => {
    setLoading(true);
    await fetchFlags();
  };

  const toggleFlag = async (id: string, isEnabled: boolean) => {
    try {
      const response = await fetch("/api/feature-flags", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, is_enabled: isEnabled }),
      });

      if (response.ok) {
        await refreshFlags();
      }
    } catch (error) {
      console.error("Error toggling feature flag:", error);
      throw error;
    }
  };

  return (
    <FeatureFlagsContext.Provider
      value={{ flags, loading, isEnabled, refreshFlags, toggleFlag }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext);
  if (context === undefined) {
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagsProvider"
    );
  }
  return context;
}
