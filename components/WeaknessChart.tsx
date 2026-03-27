// components/WeaknessChart.tsx
"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export const WeaknessChart = ({ data }: any) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No performance data available yet. Complete some lessons to see your progress!
      </div>
    );
  }

  // Filter out items with zero value? Or show them? Let's show all
  const chartData = data.map((item: any) => ({
    ...item,
    displayValue: item.value
  }));

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Performance by Skill</h3>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 14 }}
              interval={0}
            />
            <YAxis 
              label={{ 
                value: 'Weakness Score', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
              domain={[0, 'auto']}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border rounded-lg shadow-lg">
                      <p className="font-bold">{label}</p>
                      <p className="text-sm">
                        Score: {payload[0].value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {payload[0].value === 0 
                          ? "No weaknesses detected" 
                          : "Areas that need improvement"}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm">Grammar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm">Vocabulary</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-sm">Listening</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm">Reading</span>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 text-center mt-4">
        Note: Higher scores indicate more areas for improvement
      </div>
    </div>
  );
};