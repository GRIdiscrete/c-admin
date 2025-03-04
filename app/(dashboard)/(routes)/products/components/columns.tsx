"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CellAction } from "./cell-action"
import { Timestamp } from "firebase/firestore"

export type ProductColumns = {
    id: string;
    name: string;
    price: string,
    images: {url: string}[],
    isFeatured?: boolean,
    isArchived: boolean,
    category: string,
    industry: string,
    brand: string,
    model: string,
}
export const columns: ColumnDef<ProductColumns>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "price",
    header : "Price"
  },
  {
    accessorKey: "isFeatured",
    header : "Featured"
  },
  {
    accessorKey: "isArchived",
    header : "Archived"
  },
  {
    accessorKey: "category",
    header : "Category"
  },
  {
    accessorKey: "industry",
    header : "Industry"
  },
  {
    accessorKey: "brand",
    header : "Brand"
  },
  {
    accessorKey: "model",
    header : "Model"
  },
  {
    accessorKey: "year",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },

  {
    id: "Actions",
    cell: ({row}) => <CellAction data={row.original} />
  }
]
