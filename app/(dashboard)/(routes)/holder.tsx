"use client";

import { useState, useEffect } from "react";
import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getInventory } from "@/actions/get-inventory";
import { getRevenue } from "@/actions/get-revenue";
import { getStatusRevenue } from "@/actions/get-status-revenue";
import { getOrders2 } from "@/actions/orders";
import { Heading } from "@/components/heading";
import Overview from "@/components/overview";
import { PopularProductsChart } from "@/components/PopularProductsChart";
import { PopularStoresChart } from "@/components/stores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/firebase";
import { Order, Store } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";
import { DollarSign, Package, ShoppingBag, TrendingUp } from "lucide-react";

const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

interface DashboardOverviewProps {}

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    tproducts: 0,
    orders: [] as Order[],
    mgr: [] as any[],
    totalRevenue: 0,
    currentMonthRevenue: 0,
    previousMonthRevenue: 0,
    currentMonthSalesCount: 0,
    previousMonthSalesCount: 0,
    topProducts: [] as any[],
    topStores: [] as any[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tproducts, orders, mgr] = await Promise.all([
          getInventory(),
          getOrders2(),
          getGraphRevenue(),
        ]);

        // Filter paid orders
        const paidOrders = orders.filter((order) => order.isPaid);

        // Calculate total revenue
        const totalRevenue = paidOrders.reduce((sum, order) => {
          return sum + order.orderItems.reduce(
            (orderSum, product) => orderSum + (product.price || 0), 0
          );
        }, 0);

        // Date calculations
        const now = new Date();
        const currentYear = now.getUTCFullYear();
        const currentMonth = now.getUTCMonth();

        const firstDayCurrentMonth = new Date(Date.UTC(currentYear, currentMonth, 1));
        const lastDayCurrentMonth = new Date(
          Date.UTC(currentYear, currentMonth + 1, 0, 23, 59, 59, 999)
        );

        const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const firstDayPreviousMonth = new Date(Date.UTC(prevMonthYear, prevMonth, 1));
        const lastDayPreviousMonth = new Date(
          Date.UTC(prevMonthYear, prevMonth + 1, 0, 23, 59, 59, 999)
        );

        // Filter orders by month
        const currentMonthPaidOrders = paidOrders.filter((order) => {
          const orderDate = new Date(order.createdAt.seconds);
          return orderDate >= firstDayCurrentMonth && orderDate <= lastDayCurrentMonth;
        });

        const previousMonthPaidOrders = paidOrders.filter((order) => {
          const orderDate = new Date(order.createdAt.seconds);
          return orderDate >= firstDayPreviousMonth && orderDate <= lastDayPreviousMonth;
        });

        // Calculate metrics
        const currentMonthRevenue = currentMonthPaidOrders.reduce((sum, order) => {
          return sum + order.orderItems.reduce(
            (orderSum, product) => orderSum + (product.price || 0), 0
          );
        }, 0);

        const previousMonthRevenue = previousMonthPaidOrders.reduce((sum, order) => {
          return sum + order.orderItems.reduce(
            (orderSum, product) => orderSum + (product.price || 0), 0
          );
        }, 0);

        const currentMonthSalesCount = currentMonthPaidOrders.length;
        const previousMonthSalesCount = previousMonthPaidOrders.length;

        // Top products and stores
        const getTopProducts = (orders: Order[]) => {
          const productCountMap = new Map<string, { name: string; count: number }>();
          orders.forEach(order => {
            if (!order.isPaid) return;
            const uniqueProducts = new Set<string>();
            order.orderItems.forEach(item => uniqueProducts.add(item.id));
            uniqueProducts.forEach(productId => {
              const product = order.orderItems.find(item => item.id === productId);
              if (product) {
                const current = productCountMap.get(productId) || { 
                  name: product.name, 
                  count: 0 
                };
                productCountMap.set(productId, {
                  ...current,
                  count: current.count + 1
                });
              }
            });
          });
          return Array.from(productCountMap.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        };

        const getTopStores = (orders: Order[]) => {
          const storeCountMap = new Map<string, { name: string; count: number }>();
          orders.forEach(order => {
            if (!order.isPaid) return;
            const storeName = order.store_name || `Store ${order.store_id}`;
            const current = storeCountMap.get(storeName) || { 
              name: storeName, 
              count: 0 
            };
            storeCountMap.set(storeName, {
              ...current,
              count: current.count + 1
            });
          });
          return Array.from(storeCountMap.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        };

        setDashboardData({
          tproducts,
          orders,
          mgr,
          totalRevenue,
          currentMonthRevenue,
          previousMonthRevenue,
          currentMonthSalesCount,
          previousMonthSalesCount,
          topProducts: getTopProducts(orders),
          topStores: getTopStores(orders),
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPercentageDisplay = (percentage: number): string => {
    if (percentage > 0) return `+${percentage.toFixed(1)}%`;
    if (percentage < 0) return `${percentage.toFixed(1)}%`;
    return "0%";
  };

  const revenuePercentageChange = calculatePercentageChange(
    dashboardData.currentMonthRevenue,
    dashboardData.previousMonthRevenue
  );

  const salesPercentageChange = calculatePercentageChange(
    dashboardData.currentMonthSalesCount,
    dashboardData.previousMonthSalesCount
  );

  const formattedTotalRevenue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dashboardData.totalRevenue);

  if (loading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {/* Header Skeleton */}
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-[1px] w-full" />
          </div>

          {/* Metrics Grid Skeleton */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex items-center justify-between flex-row pb-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-[120px] mb-2" />
                  <div className="flex items-center">
                    <Skeleton className="h-3 w-[50px]" />
                    <Skeleton className="h-3 w-[80px] ml-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart Skeletons */}
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[200px] mt-1" />
            </CardHeader>
            <CardContent className="h-[350px]">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-[150px]" />
                </CardHeader>
                <CardContent className="h-[300px]">
                  <Skeleton className="h-full w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col space-y-2">
          <Heading
            title="Dashboard"
            description="Overview of your store performance"
          />
          <Separator className="bg-indigo-100" />
        </div>

        {/* Main Metrics Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Revenue Card */}
          <Card className="border-indigo-100 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="flex items-center justify-between flex-row pb-2">
              <CardTitle className="text-sm font-medium text-indigo-600">
                TOTAL REVENUE
              </CardTitle>
              <DollarSign className="h-5 w-5 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-indigo-800">
                {formattedTotalRevenue}
              </div>
              <div className="flex items-center mt-1">
                <span className={`text-xs ${
                  revenuePercentageChange >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatPercentageDisplay(revenuePercentageChange)}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Sales Card */}
          <Card className="border-indigo-100 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="flex items-center justify-between flex-row pb-2">
              <CardTitle className="text-sm font-medium text-indigo-600">
                SALES
              </CardTitle>
              <ShoppingBag className="h-5 w-5 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-indigo-800">
                {dashboardData.orders.filter(order => order.isPaid).length}
              </div>
              <div className="flex items-center mt-1">
                <span className={`text-xs ${
                  salesPercentageChange >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatPercentageDisplay(salesPercentageChange)}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Products Card */}
          <Card className="border-indigo-100 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="flex items-center justify-between flex-row pb-2">
              <CardTitle className="text-sm font-medium text-indigo-600">
                PRODUCTS
              </CardTitle>
              <Package className="h-5 w-5 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-indigo-800">
                {dashboardData.tproducts}
              </div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-500">+5</span>
                <span className="text-xs text-muted-foreground ml-1">
                  new this month
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trend Chart */}
        <Card className="border-indigo-100 shadow-sm">
          <CardHeader className="flex items-center justify-between flex-row pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-indigo-600">
                REVENUE TREND
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Monthly revenue performance
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-indigo-400" />
          </CardHeader>
          <CardContent className="h-[350px]">
            <Overview data={dashboardData.mgr} />
          </CardContent>
        </Card>

        {/* Analytics Section */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <PopularProductsChart data={dashboardData.topProducts} />
          <PopularStoresChart data={dashboardData.topStores} />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;