'use client';

import { useEffect, useState } from "react";
import axios from "axios";

export default function useDashboardData(user_id: string) {
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
          axios.get(`/api/users/${user_id}/dashboard`),
          axios.get(`/api/users/${user_id}/match-categories`),
          axios.get(`/api/match/history/${user_id}?reqBody=${user_id}`),
        ]);

        setStreak(streakRes.data.streaks);

        // Convert category dict to chart-ready format
        const catData = Object.entries(catRes.data).map(([key, val]) => ({
          name: key,
          value: val as number,
        }));
        setCategories(catData);

        setMatchHistory(historyRes.data);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (user_id) fetchData();
  }, [user_id]);

  return { streak, categories, matchHistory, loading, error };
}
