import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getInventory } from "@/actions/get-inventory";
import { getRevenue } from "@/actions/get-revenue";
import { getStatusRevenue } from "@/actions/get-status-revenue";
import { getOrders2 } from "@/actions/orders";
import { Heading } from "@/components/heading";
import Overview from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/firebase";
import { Store } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";
import { DollarSign, Package, ShoppingBag, TrendingUp } from "lucide-react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
// Helper function to safely calculate percentage change
const calculatePercentageChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
};

interface DashboardOverviewProps {}

const DashboardOverview = async () => {
  const tproducts = await getInventory();
  const orders = await getOrders2();
  const mgr = await getGraphRevenue();

  // Filter paid orders
  const paidOrders = orders.filter((order) => order.isPaid);

  // Calculate total revenue
  const totalRevenue = paidOrders.reduce((sum, order) => {
    return (
      sum +
      order.orderItems.reduce(
        (orderSum, product) => orderSum + (product.price || 0),
        0
      )
    );
  }, 0);

  // Format total revenue
  const formattedTotalRevenue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalRevenue);

  // Get current date in UTC
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth();

  // Calculate date ranges for current month (UTC)
  const firstDayCurrentMonth = new Date(Date.UTC(currentYear, currentMonth, 1));
  const lastDayCurrentMonth = new Date(
    Date.UTC(currentYear, currentMonth + 1, 0, 23, 59, 59, 999)
  );

  // Calculate date ranges for previous month (UTC)
  const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const firstDayPreviousMonth = new Date(Date.UTC(prevMonthYear, prevMonth, 1));
  const lastDayPreviousMonth = new Date(
    Date.UTC(prevMonthYear, prevMonth + 1, 0, 23, 59, 59, 999)
  );

  // Filter orders by month
  const currentMonthPaidOrders = paidOrders.filter((order) => {
    const orderDate = new Date(order.createdAt.seconds);
    return (
      orderDate >= firstDayCurrentMonth && orderDate <= lastDayCurrentMonth
    );
  });

  const previousMonthPaidOrders = paidOrders.filter((order) => {
    const orderDate = new Date(order.createdAt.seconds);
    return (
      orderDate >= firstDayPreviousMonth && orderDate <= lastDayPreviousMonth
    );
  });

  // Calculate revenue metrics
  const currentMonthRevenue = currentMonthPaidOrders.reduce((sum, order) => {
    return (
      sum +
      order.orderItems.reduce(
        (orderSum, product) => orderSum + (product.price || 0),
        0
      )
    );
  }, 0);

  const previousMonthRevenue = previousMonthPaidOrders.reduce((sum, order) => {
    return (
      sum +
      order.orderItems.reduce(
        (orderSum, product) => orderSum + (product.price || 0),
        0
      )
    );
  }, 0);

  // Calculate sales counts
  const currentMonthSalesCount = currentMonthPaidOrders.length;
  const previousMonthSalesCount = previousMonthPaidOrders.length;

  // Calculate percentage changes
  const revenuePercentageChange = calculatePercentageChange(
    currentMonthRevenue,
    previousMonthRevenue
  );
  const salesPercentageChange = calculatePercentageChange(
    currentMonthSalesCount,
    previousMonthSalesCount
  );

  // Format percentage displays
  const formatPercentageDisplay = (percentage: number): string => {
    if (percentage > 0) return `+${percentage.toFixed(1)}%`;
    if (percentage < 0) return `${percentage.toFixed(1)}%`;
    return "0%";
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title="Dashboard"
          description="Overview of your store performance"
        />
        <Separator className="bg-indigo-100" />

        <div className="grid gap-6 grid-cols-4">
          {/* Total Revenue Card */}
          <Card className="col-span-2 border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex items-center justify-between flex-row pb-2">
              <CardTitle className="text-sm font-medium text-indigo-600">
                TOTAL REVENUE
              </CardTitle>
              <DollarSign className="h-5 w-5 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-800">
                {formattedTotalRevenue}
              </div>
              <p className="text-xs text-indigo-400 mt-1">
                {formatPercentageDisplay(revenuePercentageChange)} from last
                month
              </p>
            </CardContent>
          </Card>

          {/* Sales Card */}
          <Card className="border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex items-center justify-between flex-row pb-2">
              <CardTitle className="text-sm font-medium text-indigo-600">
                SALES
              </CardTitle>
              <ShoppingBag className="h-5 w-5 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-800">
                {paidOrders.length}
              </div>
              <p className="text-xs text-indigo-400 mt-1">
                {formatPercentageDisplay(salesPercentageChange)} from last month
              </p>
            </CardContent>
          </Card>

          {/* Products Card */}
          <Card className="border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex items-center justify-between flex-row pb-2">
              <CardTitle className="text-sm font-medium text-indigo-600">
                PRODUCTS
              </CardTitle>
              <Package className="h-5 w-5 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-800">
                {tproducts}
              </div>
              <p className="text-xs text-indigo-400 mt-1">
                +5 new this month
              </p>
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card className="col-span-4 border-indigo-100 shadow-sm">
            <CardHeader className="flex items-center justify-between flex-row pb-2">
              <CardTitle className="text-sm font-medium text-indigo-600">
                REVENUE TREND
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-indigo-400" />
            </CardHeader>
            <CardContent className="pl-2">
              <Overview data={mgr} />
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;