import { db } from "@/lib/firebase";
import {  Order } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { NextResponse } from "next/server";


export const GET = async (reQ: Request,
    {params} : {params: {orderId : string}}
) => {
    try {



        const storesSnapshot = await getDocs(collection(db, "stores"));
        const storeIds = storesSnapshot.docs.map(doc => doc.id);

        // Step 2: Fetch orders for each store
        let allOrders : Order = {} as Order;
        for (const storeId of storeIds) {

            const ordersRef = collection(db, "stores", storeId, "orders");
            const q = query(ordersRef,  where("id", "==", params.orderId));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                if(doc.exists()){
                    allOrders = doc.data() as Order;
                }
            });

        }
    
        return NextResponse.json(allOrders)
    
    
    }
   

 catch (error) {
    console.log(`ORDERS_GET:${error}`);
    return new NextResponse("Internal Server Error", {status : 500})
}
};





export const PATCH = async (reQ: Request,
    {params} : {params: { orderId : string}}
) => {
    try {
        const {userId} = auth()
        const body = await reQ.json()

     
    
        if(!userId){
            return new NextResponse("Unauthorized", {status: 400})
        }
    
        const {order_status, store_id} = body;

        console.log(order_status, store_id)
    
    
        if(!order_status){
            return new NextResponse("Order Gone Missing", {status: 400})
        }



        if(!params.orderId){
            return new NextResponse("No order specified", {status: 400})
        }


        const orderQuery = await getDocs(
            collection(db, "stores", store_id, "orders")
        );
        
        if (!orderQuery.empty) {
            console.log("------------------------------")
            console.log(orderQuery.docs[0].data())
            await updateDoc(
                doc(db, "stores", store_id, "orders", params.orderId), {
                    ...orderQuery.docs[0].data(),
                    order_status,
                    updatedAt: serverTimestamp(),
                }
            );
        
     }else{
        return new NextResponse("Order not found!", {status: 404})
     }

     const order = (
        await getDoc(
            doc(db, "stores", store_id, "orders", params.orderId)
        )
     ).data() as Order;


    return NextResponse.json(order);
    
    
    }
   

 catch (error) {
    console.log(`ORDER_PATCH:${error}`);
    return new NextResponse("Internal Server Error", {status : 500})
}
};




export const DELETE = async (reQ: Request,
    {params} : {params: {orderId : string}}
) => {
    try {

        console.log("Arrival!!!!!!")
        const {userId} = auth()
    
        if(!userId){
            return new NextResponse("Unauthorized", {status: 400})
        }

        if(!params.orderId){
            return new NextResponse("No order selected", {status: 400})
        }
  
        const storesSnapshot = await getDocs(collection(db, "stores"));
        const storeIds = storesSnapshot.docs.map(doc => doc.id);
        
        for (const storeId of storeIds) {
            const store = await getDoc(doc(db, "stores", storeId, "orders", params.orderId))

            if(store.exists()){
                const orderRef = doc(db, "stores", storeId, "orders", params.orderId)
                await deleteDoc(orderRef);

            }
        }
        return NextResponse.json({msg: "order Deleted"});
    
    
    }
   

 catch (error) {
    console.log(`order_DELETE:${error}`);
    return new NextResponse("Internal Server Error", {status : 500})
}
};



