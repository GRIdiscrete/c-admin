import { db } from "@/lib/firebase";
import {  Order } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { NextResponse } from "next/server";


export const GET = async (reQ: Request,
    {params} : {params: {userId : string}}
) => {
    try {



        const storesSnapshot = await getDocs(collection(db, "stores"));
        const storeIds = storesSnapshot.docs.map(doc => doc.id);

        // Step 2: Fetch orders for each store
        let allOrders : Order[] = [];
        for (const storeId of storeIds) {

            const ordersQuery = query(
                collection(doc(db, "stores", storeId), "orders"),
                where("userId", "==", params.userId)
            );



            const ordersSnapshot = await getDocs(ordersQuery);
            const orders = ordersSnapshot.docs.map(doc => doc.data() as Order);
            allOrders = allOrders.concat(orders);
        }


        return NextResponse.json(allOrders)
    
    
    }
   

 catch (error) {
    console.log(`ORDERS_GET:${error}`);
    return new NextResponse("Internal Server Error", {status : 500})
}
};





export const PATCH = async (reQ: Request,
    {params} : {params: { userId : string}}
) => {
    try {
        const {userId} = auth()
        const body = await reQ.json()
    
        if(!userId){
            return new NextResponse("Unauthorized", {status: 400})
        }
    
        const {order_status, isPaid} = body;
    
    
        if(!order_status){
            return new NextResponse("Order Gone Missing", {status: 400})
        }



        if(!params.userId){
            return new NextResponse("No order specified", {status: 400})
        }



        const storesSnapshot = await getDocs(collection(db, "stores"));
        const storeIds = storesSnapshot.docs.map(doc => doc.id);
        
        for (const storeId of storeIds) {
            const ordersRef = collection(db, "stores", storeId, "orders");
            const q = query(ordersRef, where("id", "==", params.userId));
        
            const querySnapshot = await getDocs(q);
            
            // Create an array of update promises
            const updatePromises = querySnapshot.docs.map(doc => 
                updateDoc(doc.ref, { 
                    ...doc.data(),  // Preserve existing data
                    order_status,  // Update these fields
                    isPaid,        // (make sure casing matches your Firestore fields)
                    updatedAt: serverTimestamp()  // Add update timestamp
                })
            );
        
            // Execute all updates in parallel
            await Promise.all(updatePromises);
        }
        
        return NextResponse.json("Success", { status: 200 });
    
    }
   

 catch (error) {
    console.log(`ORDER_PATCH:${error}`);
    return new NextResponse("Internal Server Error", {status : 500})
}
};
