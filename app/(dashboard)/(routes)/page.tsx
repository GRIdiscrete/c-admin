import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getInventory } from "@/actions/get-inventory";
import { getRevenue } from "@/actions/get-revenue";
import { getOrders } from "@/actions/get-sales";
import { getStatusRevenue } from "@/actions/get-status-revenue";
import { Heading } from "@/components/heading";
import Overview from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/firebase";
import { Store } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";
import { Banknote, Car, DollarSign, ShoppingBag } from "lucide-react";


interface DashboardOverviewProps {
}


const DashboardOverview = async () => {



    // const totalRevenue = await getRevenue();
    const tsales = await getOrders();
    const tproducts = await getInventory();


    const mgr = await getGraphRevenue()

    return(<div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of the entire Marketplace" />
        <Separator/>
        <div className="grid gap-4 grid-cols-3 ">
            <Card className="col-span-3 md:col-span-1 shadow-lg border-none">
                <CardHeader className="flex items-center justify-between flex-row">
                    <CardTitle className="text-sm font-medium text-gray-500">
                        Total Revenue
                    </CardTitle>
                    <Banknote className="w-8 h-8   text-hero m-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-700">$: 345345</div>
                </CardContent>
            </Card>


            <Card className="col-span-3 md:col-span-1 shadow-lg border-none"> 
                <CardHeader className="flex items-center justify-between flex-row">
                    <CardTitle className="text-sm font-medium text-gray-500">
                        Total Stores
                    </CardTitle>
                    <ShoppingBag className="w-8 h-8  text-hero m-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-700">{tsales}</div>
                </CardContent>
            </Card>


            <Card className="col-span-3 md:col-span-1 shadow-lg border-none">
                <CardHeader className="flex items-center justify-between flex-row">
                    <CardTitle className="text-sm font-medium text-gray-500">
                        Total Parts
                    </CardTitle>
                    <Car className="w-8 h-8  text-hero  m-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-700">{tproducts}</div>
                </CardContent>
            </Card>


            <Card className="col-span-3 shadow-lg border-none">
                <CardHeader className="flex items-center justify-between flex-row">
                    <CardTitle className="text-sm font-medium text-gray-600">
                        Revenue by Month
                    </CardTitle>
                    <DollarSign className="w-8 h-8  text-hero" />
                </CardHeader>
                <CardContent>
                    <Overview data={mgr}/>
                </CardContent>
            </Card>

            

           
        </div>
        </div>
    </div>)
}

export default DashboardOverview;