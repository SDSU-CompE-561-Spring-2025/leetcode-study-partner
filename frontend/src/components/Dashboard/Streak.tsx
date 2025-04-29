'use client';
import React from "react";

export default function Streak() {
  return (
    <div className="bg-[#2A2E34] p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4"> Streak</h2>
      <p className="text-lg">Current Streak: <span className="text-[#F67E21] font-semibold">12 days</span></p>
      <p className="text-sm text-gray-400 mt-2">Streak ends after 36 hours of inactivity.</p>
    </div>
  );
}

// icon: 🔥