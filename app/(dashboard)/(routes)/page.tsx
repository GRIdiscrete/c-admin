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
import { db } from "@/lib/firebase";
import { Order, Store } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";
import { DollarSign, Package, ShoppingBag, TrendingUp } from "lucide-react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
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

  const getTopProducts = (orders: Order[]) => {
    const productCountMap = new Map<string, { name: string; count: number }>();
  
    orders.forEach(order => {
      if (!order.isPaid) return; // Only consider paid orders
      
      // Track unique products per order to avoid duplicates
      const uniqueProducts = new Set<string>();
      
      order.orderItems.forEach(item => {
        uniqueProducts.add(item.id);
      });
  
      // Count each product only once per order
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
  
    // Convert to array and sort by count descending
    return Array.from(productCountMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Get top 5 products
  };
  
  const topProducts = getTopProducts(orders);


  const getTopStores = (orders: Order[]) => {
    const storeCountMap = new Map<string, { name: string; count: number }>();
  
    orders.forEach(order => {
      if (!order.isPaid) return; // Only consider paid orders
      
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
  
    // Convert to array and sort by count descending
    return Array.from(storeCountMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Get top 5 stores
  };
  
  const topStores = getTopStores(orders);

  

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
                {paidOrders.length}
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
                {tproducts}
              </div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-500">+5</span>
                <span className="text-xs text-muted-foreground ml-1">
                  new this month
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Additional Metric Card (if needed) */}
          {/* <Card className="border-indigo-100 shadow-sm hover:shadow-md transition-all duration-300">
            [Additional metric]
          </Card> */}
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
            <Overview data={mgr} />
          </CardContent>
        </Card>

        {/* Analytics Section */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <PopularProductsChart data={topProducts} />
          <PopularStoresChart data={topStores} />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;