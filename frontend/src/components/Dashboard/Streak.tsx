'use client';

import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function Streak() {
  return (
    <Card className="bg-[#2A2E34] text-white">
      <CardHeader>
        <h2 className="text-2xl font-bold"> Streak</h2>
      </CardHeader>
      <CardContent>
        <p className="text-lg">
          Current Streak: <span className="text-[#F67E21] font-semibold">12 days</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Streak ends after 36 hours of inactivity.
        </p>
      </CardContent>
    </Card>
  );
}
// icon: 🔥