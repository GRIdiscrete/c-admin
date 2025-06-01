'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BrandData {
  name: string;
  value: number;
}

interface TopBrandsChartProps {
  data: BrandData[];
}

export const TopBrandsChart = ({ data }: TopBrandsChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={80} 
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          formatter={(value) => [`${value} units`, 'Quantity']}
          labelFormatter={(label) => `Brand: ${label}`}
        />
        <Legend />
        <Bar 
          dataKey="value" 
          name="Units Sold" 
          fill="#8884d8" 
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};