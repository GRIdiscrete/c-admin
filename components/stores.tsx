'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp } from 'lucide-react';

interface PopularProductsChartProps {
  data: {
    name: string;
    count: number;
    fullName?: string; // Add fullName to store the untruncated version
  }[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FFBB28'];

// Helper function to truncate store names/IDs
const truncateStoreName = (name: string) => {
  if (name.startsWith('Store ')) {
    const storeId = name.replace('Store ', '');
    return storeId.length > 8 ? `Store...${storeId.slice(-5)}` : name;
  }
  return name.length > 12 ? `${name.substring(0, 10)}...` : name;
};

export const PopularStoresChart = ({ data }: PopularProductsChartProps) => {
  // Process data to include both truncated and full names
  const chartData = data.map(item => ({
    ...item,
    displayName: truncateStoreName(item.name),
    fullName: item.name // Store original name for tooltip
  }));

  return (
    <Card className="col-span-1 w-full border-indigo-100 shadow-sm h-fit-content p-4">
      <CardHeader className="flex items-center justify-between flex-row pb-2">
        <CardTitle className="text-sm font-medium text-indigo-600">
          Top Selling Stores
        </CardTitle>
        <TrendingUp className="h-5 w-5 text-indigo-400" />
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              nameKey="displayName" // Use truncated names for labels
              label={({ displayName, percent }) => `${displayName}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderColor: '#eee',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              itemStyle={{ color: '#333' }}
              formatter={(value, name, props) => {
                // Show full name in tooltip
                const fullName = props.payload.fullName || name;
                return [`${value} orders`, fullName];
              }}
            />
            <Legend 
              layout="vertical"
              verticalAlign="middle"
              align="right"
              formatter={(value, entry, index) => {
                // Use truncated names in legend
                return chartData[index]?.displayName || value;
              }}
              wrapperStyle={{ 
                fontSize: '12px',
                paddingLeft: '16px' 
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};