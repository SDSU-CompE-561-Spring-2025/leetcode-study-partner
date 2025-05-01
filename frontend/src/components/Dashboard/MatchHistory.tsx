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
          {mockMatchHistory.map((match) => (
            <Card
              key={match.problemID}
              className={cn(
                'text-white p-3 rounded-md shadow-md text-sm',
                match.status ? 'bg-green-600' : 'bg-red-600'
              )}
            >
              <CardContent className="p-2 space-y-1">
                <p className="font-semibold text-base">Problem ID: {match.problemID}</p>
                <p className="text-sm">Category: {match.category}</p>
                <p className="text-sm">Status: {match.status ? 'Pass' : 'Fail'}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    );
  }
  