'use client';

import React from "react";
import NavBar from "@/components/Navbar";
import Streak from "@/components/Dashboard/Streak";
import CategoryChart from "@/components/Dashboard/CategoryChart";
import MatchHistory from "@/components/Dashboard/MatchHistory";
import Link from "next/link";

export default function DashboardMain() {
  return (
    <div className="min-h-screen bg-[#1E2328] text-white">

      {/* Main Dashboard Layout */}
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left side: Streak and CategoryChart */}
          <div className="flex flex-col gap-6 md:col-span-2">
            <Streak />
            <CategoryChart />
          </div>

          {/* Right side: Match History */}
          <div className="flex flex-col gap-6">
            <MatchHistory />
          </div>
        </div>

        {/* Find Match Button */}
        <div className="flex justify-center mt-10">
          <Link href="/matchmaking">
            <button className="bg-[#F67E21] hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transition">
              Find Match
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}

  