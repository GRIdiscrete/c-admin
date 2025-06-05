"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CellAction } from "./cell-action"
import CellImage from "./cell-image"
import { cn } from "@/lib/utils"

export type OrderColumns = {
  id: string;
  number: string,
  address: string,
  products: string,
  totalPrice : string,
  images: string[],
  isPaid: boolean;
  clientName: string,
  clientEmail: string,
  store_name: string,
  createdAt: string,
  order_status: string,
  store_id: string,
  store_address: string,
  userID: string,
  deliveryIn: string
}
export const columns: ColumnDef<OrderColumns>[] = [
  {
    accessorKey: "images",
    header: "Images",
    cell : ({row}) => (
      <div className="grid grid-cols-2 gap-2 olverflow-y-auto">
        <CellImage data={row.original.images}/>
      </div>
    )
  },
  {
    accessorKey: "products",
    header: "Products"
  },
  {
    accessorKey: "number",
    header: "Client Phone"
  },
  {
    accessorKey: "address",
    header: "Client Address"
  },
  {
    accessorKey: "shop_name",
    header: "Shop Name"
  },
  {
    accessorKey: "store_address",
    header: "Store address"
  },
  {
    accessorKey: "totalPrice",
    header: "Amount"
  },
  {
    accessorKey: "isPaid",
    header: "Payment Status",
    cell : ({row}) => {
      const {isPaid} = row.original;

      return <p
      className={cn("text-lg font-semibold",
        isPaid ? "text-green-500" : "text-red-500"
      )}>
        {isPaid ? "Paid" : "Not Paid"}</p>
    }
  },

  {
    accessorKey: "order_status",
    header: "Order Status",
    cell : ({row}) => {
      const {order_status} = row.original

      return (
        <p className={cn(
          "text-base font-semibold",
          (order_status === "Processing" && "text-yellow-600") ||
          (order_status === "Delivering" && "text-orange-500") ||
          (order_status === "Delivered" && "text-blue-500") ||
          (order_status === "Delivered" && "text-green-500")
        )}>
          {order_status}</p>
      )
    } 
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: (rowA, rowB) => {
      const dateA: any = new Date(rowA.original.createdAt).getTime();
      const dateB: any = new Date(rowB.original.createdAt).getTime();
      return dateB - dateA; // Changed from dateA - dateB to dateB - dateA
    },
  },
  
  {
    id: "Actions",
    cell: ({row}) => <CellAction data={row.original} />
  }
]
