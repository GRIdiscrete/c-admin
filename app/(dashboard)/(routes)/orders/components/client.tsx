"use client"

import { Heading } from "@/components/heading"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Separator } from "@/components/ui/separator"
import { Billboards } from "@/types-db"
import { Phone, Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { OrderColumns, columns } from "./columns"
import ApiList from "@/components/api_list"
import toast from "react-hot-toast"

interface OrderClientProps {
  data: OrderColumns[]
}

export const OrderClient = ({data}: OrderClientProps) => {
    const params = useParams()
    const router = useRouter()

    const sortedData = [...data].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`Orders (${data.length})`}
          description="Manage all orders on the platform!"
        />
      </div>
      <Separator/>
      <DataTable 
        columns={columns} 
        data={sortedData} 
        searchKey="name" 
        initialState={{
          sorting: [
            {
              id: "createdAt",  // This should match your accessorKey
              desc: true        // Sort in descending order (newest first)
            }
          ]
        }}
      />
    </>
  );
}