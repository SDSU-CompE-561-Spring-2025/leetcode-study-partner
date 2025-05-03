'use client';

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const mockCategoryData = [
  { name: "Arrays", value: 4 },
  { name: "Strings", value: 2 },
  { name: "Graphs", value: 1 },
];

const COLORS = ["#FED7AA", "#FDBA74", "#FB923C", "#F97316", "#EA580C"];

export default function CategoryChart() {
  return (
    <Card className="bg-[#2A2E34] text-white">
      <CardHeader>
        <h2 className="text-2xl font-bold"> Problem Categories</h2>
      </CardHeader>
      
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mockCategoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ name, x, y }) => (
                <text x={x} y={y} fill="#fff" fontSize={14} textAnchor="middle">
                  {name}
                </text>
              )}
            >
              {mockCategoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
             contentStyle={{
             backgroundColor: "#2A2E34",
             border: "none",
             borderRadius: "8px",
             color: "#fff",
             fontSize: "12px",
             padding: "8px",
                }}
            formatter={(value, name) => [`${value} problems`, `${name}`]}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// icon: 📊