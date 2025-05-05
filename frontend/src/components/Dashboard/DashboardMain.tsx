"use client";

import Streak from "@/components/Dashboard/Streak";
import CategoryChart from "@/components/Dashboard/CategoryChart";
import MatchHistory from "@/components/Dashboard/MatchHistory";
import Link from "next/link";
import { Button } from "@/components/ui/button"; 
import useDashboardData from "@/hooks/useDashboardData";

export default function DashboardMain() {
  const user_id = "user-id-here"; // TODO: replace with auth stuff
  // TODO: UNCOMMENT BELOW WHEN AUTH IS FIGURED OUT  
//   const { streak, categories, matchHistory, loading, error } = useDashboardData(user_id);
  
//   if (loading) return <p className="text-white text-center mt-10">Loading dashboard...</p>;
//   if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  
  return (
    <div className="min-h-screen bg-[#1E2328] text-white">
      <main className="container mx-auto p-6">
        {/* Welcome Header */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center md:text-left">
        Welcome, <span className="text-orange-400">User</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left side: Streak and CategoryChart */}
          <div className="flex flex-col gap-6 md:col-span-2">

            {/* TODO: UNCOMMENT BELOW WHEN AUTH STUFF IS FIGURED OUT */}
            {/* <Streak streak={streak} />
            <CategoryChart categories={categories} /> */}

            {/* DELTE WHEN AUTH IS FIGURED OUT - MOCK VALUES TO AVOID SITE SAYING FAILED TO LOAD DASHBOARD */}
            <Streak streak={12} />
            <CategoryChart categories={[
                { name: "Arrays", value: 4 },
                { name: "Strings", value: 2 },
                { name: "Graphs", value: 1 }
            ]} />

          </div>

          {/* Right side: Match History */}
          <div className="flex flex-col gap-6">

            {/* TODO: UNCOMMENT BELOW WHEN AUTH STUFF IS FIGURED OUT */}
            {/* <MatchHistory matchHistory={matchHistory} /> */}
            
            {/* DELTE WHEN AUTH IS FIGURED OUT - MOCK VALUES TO AVOID SITE SAYING FAILED TO LOAD DASHBOARD */}
            <MatchHistory matchHistory={[
                { problem_id: 101, category: "Arrays", status: true },
                { problem_id: 102, category: "Graphs", status: false },
                { problem_id: 103, category: "Strings", status: true }
            ]} />
          </div>
        </div>

        {/* Find Match Button (centered) */}
        <div className="flex justify-center mt-20">
          <Link href="/matchmaking">
            <Button size="lg" className="bg-[#F67E21] hover:bg-orange-600 text-white text-3xl font-extrabold px-20 py-8 rounded-2xl shadow-xl">
              Find Match
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
