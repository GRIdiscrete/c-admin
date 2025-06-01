'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StoreData {
  name: string;
  value: number;
}

interface TopStoresChartProps {
  data: StoreData[];
}

export const TopStoresChart = ({ data }: TopStoresChartProps) => {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          tickFormatter={(value) => formatCurrency(value)}
        />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={120} 
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
          labelFormatter={(label) => `Store: ${label}`}
        />
        <Legend />
        <Bar 
          dataKey="value" 
          name="Total Revenue" 
          fill="#82ca9d" 
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};