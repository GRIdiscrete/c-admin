import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { format } from "date-fns";
import { OrderClient } from "./components/client";
import { db } from "@/lib/firebase";
import { Order, Store } from "@/types-db";
import { OrderColumns } from "./components/columns";
import { CalendarDays, RefreshCw } from "lucide-react";
import { formatter } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

const statuses = [
  { value: "all", label: "All" },
  { value: "Processing", label: "Processing" },
  { value: "Delivering", label: "Delivering" },
  { value: "Delivered", label: "Delivered" },
  { value: "Complete", label: "Complete" },
];

const OrdersPage = async () => {
  let allOrders: Order[] = [];

  const storesSnapshot = await getDocs(collection(db, "stores"));
  const storeIds = storesSnapshot.docs.map((doc) => doc.id);
  for (const storeId of storeIds) {
    const ordersData = (
      await getDocs(collection(doc(db, "stores", storeId), "orders"))
    ).docs.map((doc) => doc.data()) as Order[];

    const storeData = (await getDoc(doc(db, "stores", storeId))).data() as Store;

    if (storeData.address) {
      for (const x of ordersData) {
        x.store_address = storeData.address;
      }
    } else {
      for (const x of ordersData) {
        x.store_address = "";
      }
    }

    const Neworders = allOrders.concat(ordersData);
    allOrders = Neworders;
  }

  const formatOrders = (orders: Order[]): OrderColumns[] => {
    return orders.map((item) => ({
      id: item.id,
      isPaid: item.isPaid,
      number: item.number,
      address: item.address,
      deliveryIn: item.deliveryInstructions,
      store_name: item.store_name,
      clientName: item.clientName,
      clientEmail: item.clientEmail,
      store_address: item.store_address,
      products: item.orderItems.map((ite) => ite.name).join(", "),
      store_id: item.store_id,
      order_status: item.order_status,
      userID: item.userID,
      totalPrice: formatter.format(
        item.orderItems.reduce((total, item) => {
          if (item && item.qty !== undefined) {
            return total + Number(item.price * item.qty);
          }
          return total;
        }, 0)
      ),
      images: item.orderItems.map((item) => item.images[0].url),
      createdAt: item.createdAt
        ? format(item.createdAt.toDate(), "MMMM dd, yyyy")
        : "",
    }));
  };

  const allFormattedOrders = formatOrders(allOrders);
  const processingOrders = formatOrders(
    allOrders.filter((order) => order.order_status === "Processing")
  );
  const deliveringOrders = formatOrders(
    allOrders.filter((order) => order.order_status === "Delivering")
  );
  const deliveredOrders = formatOrders(
    allOrders.filter((order) => order.order_status === "Delivered")
  );
  const completeOrders = formatOrders(
    allOrders.filter((order) => order.order_status === "Complete")
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Link href="/orders/calendar" passHref>
              <Button
                variant="outline"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                View Delivery Calendar
              </Button>
            </Link>
            <form action={async () => {
              "use server";
              // This will force a refresh of the page
              return null;
            }}>
              <Button variant="outline" type="submit">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </form>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            {statuses.map((status) => (
              <TabsTrigger key={status.value} value={status.value}>
                {status.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {statuses.map((status) => (
            <TabsContent key={status.value} value={status.value} className="space-y-4">
              {status.value === "all" && <OrderClient data={allFormattedOrders} />}
              {status.value === "Processing" && (
                <OrderClient data={processingOrders} />
              )}
              {status.value === "Delivering" && (
                <OrderClient data={deliveringOrders} />
              )}
              {status.value === "Delivered" && (
                <OrderClient data={deliveredOrders} />
              )}
              {status.value === "Complete" && (
                <OrderClient data={completeOrders} />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default OrdersPage;