"use client"

import { Heading } from "@/components/heading"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Separator } from "@/components/ui/separator"
import { Billboards } from "@/types-db"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { ProductColumns, columns } from "./columns"
import ApiList from "@/components/api_list"


interface ProductClientProps {
  data: ProductColumns[]
}

export const ProductClient = ({data}: ProductClientProps) => {
    const params = useParams()
    const router = useRouter()
  return (<>
  <div className="flex items-center justify-between">
    <Heading title={`Products (${data.length})`}
    description="Manage products for your store"/>
    <Button onClick={() => router.push(`/stores/${params.storeId}/products/new`)}>
        <Plus className="h4 w-4 mr-2" />
        Add New
    </Button>
  </div>
  <Separator/>
  <DataTable columns={columns} data={data} searchKey="name"/>

  <Heading title="API" description="API calls for products"/>
  <Separator/>

  <ApiList entityName="products" entityId="productId"/>

  </>);
}
