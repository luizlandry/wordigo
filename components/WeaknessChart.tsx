"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export const WeaknessChart = ({ data }: any) => {
  return (
    <BarChart width={350} height={250} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  );
};