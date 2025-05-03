'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const mockMatchHistory = [
    {
      problemID: 101,
      category: 'Arrays',
      status: true, // passed
    },
    {
      problemID: 102,
      category: 'Graphs',
      status: false, // failed
    },
    {
      problemID: 103,
      category: 'Strings',
      status: true,
    },
  ];
  
  export default function MatchHistory() {
    return (
      <Card className="bg-[#2A2E34] p-4">
        <CardContent className="space-y-3">
          <h2 className="text-xl font-semibold text-center text-white">Match History</h2>
          <div className="space-y-2">
          {mockMatchHistory.map((match) => (
            <Card
              key={match.problemID}
              className="bg-[#3B3F46] text-white rounded-md shadow-sm px-4 py-2"
            >
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 text-sm">
                <span className="whitespace-nowrap font-medium">Problem ID: {match.problemID}</span>
                <span className="whitespace-nowrap">Category: {match.category}</span>
                <span
                  className={cn(
                    "whitespace-nowrap font-semibold",
                    match.status ? "text-green-400" : "text-red-400"
                  )}
                >
                  Status: {match.status ? 'Pass' : 'Fail'}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
        </CardContent>
      </Card>
    );
  }
  