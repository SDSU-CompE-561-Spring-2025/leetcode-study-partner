'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { API_HOST_BASE_URL } from "@/lib/constants";

export default function useDashboardData(user_id: string, accessToken: string) {
  const [streak, setStreak] = useState<number | null>(null);
  const [categories, setCategories] = useState<{ name: string; value: number }[]>([]);
  const [matchHistory, setMatchHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [streakRes, catRes, historyRes] = await Promise.all([
          axios.get(`${API_HOST_BASE_URL}data/users/${user_id}/dashboard`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
          axios.get(`${API_HOST_BASE_URL}data/users/${user_id}/match-categories`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
          axios.get(`${API_HOST_BASE_URL}api/match/history/${user_id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
        ]);

        setStreak(streakRes.data.streaks?.current_streak ?? 0);

        const catData = Object.entries(catRes.data || {}).map(([key, val]) => ({
          name: key,
          value: val as number,
        }));
        setCategories(catData);

        setMatchHistory(historyRes.data || []);
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || err.message || "Unknown error";
        setError(`Failed to load dashboard data: ${errorMessage}`);
        console.error("Dashboard fetch error:", err.response?.status, err.response?.data);
      } finally {
        setLoading(false);
      }
    }

    if (user_id && accessToken) fetchData();
  }, [user_id, accessToken]);

  return { streak, categories, matchHistory, loading, error };
}