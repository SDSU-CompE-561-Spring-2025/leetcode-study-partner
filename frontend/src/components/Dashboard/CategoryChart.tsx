'use client';

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#FED7AA", "#FDBA74", "#FB923C", "#F97316", "#EA580C"];

interface CategoryChartProps {
    categories: { name: string; value: number }[];
}
  
export default function CategoryChart({ categories }: CategoryChartProps) {
  return (
    <Card className="bg-[#2A2E34] text-white">
      <CardHeader>
        <h2 className="text-2xl font-bold"> Problem Categories</h2>
      </CardHeader>
      
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categories}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ name, midAngle, outerRadius, cx, cy }) => {
                const RADIAN = Math.PI / 180;
                const radius = outerRadius + 20; // push label out
                const xPos = cx + radius * Math.cos(-midAngle * RADIAN);
                const yPos = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text
                    x={xPos}
                    y={yPos}
                    fill="#fff"
                    fontSize={16}
                    textAnchor={xPos > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                  >
                    {name}
                  </text>
                );
              }}
            >
              {categories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
             contentStyle={{
             backgroundColor: "#3B3F46",
             border: "1px solid #4A4F55",
             borderRadius: "8px",
             color: "#fff",
             fontSize: "13px",
             padding: "10px",
                }}
            labelStyle={{ color: "#fff" }} 
            itemStyle={{ color: "#fff" }}  
            formatter={(value, name) => [`${value} problems`, `${name}`]}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// icon: 📊
