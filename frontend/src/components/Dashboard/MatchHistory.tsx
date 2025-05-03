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
  {
    problemID: 104,
    category: 'Trees',
    status: false,
  },
  {
    problemID: 105,
    category: 'Dynamic Programming',
    status: true,
  },
  {
    problemID: 106,
    category: 'Greedy',
    status: false,
  },
  {
    problemID: 107,
    category: 'Backtracking',
    status: true,
  },
  {
    problemID: 104,
    category: 'Trees',
    status: false,
  },
  {
    problemID: 105,
    category: 'Dynamic Programming',
    status: true,
  },
  {
    problemID: 106,
    category: 'Greedy',
    status: false,
  },
  {
    problemID: 107,
    category: 'Backtracking',
    status: true,
  },
  ];
  
  export default function MatchHistory() {
    return (
      <Card className="bg-[#2A2E34] p-4 h-full min-h-[450px] overflow-y-auto">
        <CardContent className="space-y-3">
          <h2 className="text-xl font-semibold text-center text-white mb-4">Match History</h2>
          <div className="space-y-2">
          {/* using a Map here to remove any duplicate problemIDs — and then spreading it to turn it back into an array so we can map over it */}
          {[...new Map(mockMatchHistory.map(item => [item.problemID, item])).values()].map((match) => (
            <Card
              key={match.problemID}
              className="bg-[#3B3F46] text-white rounded-md shadow-sm px-4 py-2"
            >
              <CardContent className="p-2 text-sm space-y-1">
                <div className="flex justify-between items-center">
                  <span className="whitespace-nowrap font-medium">Problem ID: {match.problemID}</span>
                  <span
                    className={cn(
                      "whitespace-nowrap font-semibold",
                      match.status ? "text-green-400" : "text-red-400"
                    )}
                  >
                    Status: {match.status ? 'Pass' : 'Fail'}
                  </span>
                </div>
                <div className="text-left">
                  <span className="whitespace-nowrap">Category: {match.category}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        </CardContent>
      </Card>
    );
  }
  