'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp } from 'lucide-react';

interface PopularProductsChartProps {
  data: {
    name: string;
    count: number;
  }[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

export const PopularProductsChart = ({ data }: PopularProductsChartProps) => {
  return (
    <Card className="col-span-1 border-indigo-100 w-full shadow-sm h-fit-content p-4">
      <CardHeader className="flex items-center justify-between flex-row pb-2">
        <CardTitle className="text-sm font-medium text-indigo-600">
          Top 5 Selling Products
        </CardTitle>
        <TrendingUp className="h-5 w-5 text-indigo-400" />
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderColor: '#eee' }}
              itemStyle={{ color: '#333' }}
              formatter={(value, name, props) => [`${value} orders`, name]}
            />
            <Legend 
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};