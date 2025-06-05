
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import {Billboards, Category, Order} from "@/types-db"
import { OrderPage } from "./_components/order-page";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FixPage } from "./_components/fix-page";
import { Phone } from "lucide-react";
import toast from "react-hot-toast";

const DriverPage = async ({
    params}: {params: { userId : string }}) => {

        const storesSnapshot = await getDocs(collection(db, "stores"));
        const storeIds = storesSnapshot.docs.map(doc => doc.id);


        let allOrders : Order[] = [];
        let di = ''

         for (const storeId of storeIds) {

            const ordersQuery = query(
                collection(doc(db, "stores", storeId), "orders"),
                where("id", "==", params.userId)
            );

            const ordersSnapshot = await getDocs(ordersQuery);
            const order = ordersSnapshot.docs.map(doc => doc.data() as Order);

            const filteredOrders = order.filter(order => order.order_status !== "Complete");



            if(filteredOrders.length > 0){
                allOrders = allOrders.concat(filteredOrders);
            }
        }

        for(const x of allOrders){
            console.log(x);
            if(x.deliveryInstructions){
                di = x.deliveryInstructions
            }
        }

        const tryone = () => {
            console.log("hey!!")
        }



    return (
        
        <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center">
            <Heading 
                title={`Order Page for Order (${params.userId})`}
                description="Please ensure timely and customer friendly delivery, and remember to set your number"
                
            />
        </div>
        <Separator />
        <h2 className="text-lg md:text-xl lg:text-2xl">Delivery Instructions</h2>
        <p className="w-full p-4 md:p-6 lg:p-8 m-4 shadow-md rounded-md">
            {di}
        </p>
        <Separator />
        <OrderPage 
            userId={params.userId} 
            initialData={allOrders}
        />
    </div>
    
    );
}

export default DriverPage; 