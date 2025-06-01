import { db } from "@/lib/firebase";
import { Order } from "@/types-db";
import { collection, getDocs, query } from "firebase/firestore";

export const getOrders2 = async (): Promise<Order[]> => {
    // 1. Get all stores
    const storesSnapshot = await getDocs(collection(db, "stores"));
    
    // 2. For each store, get its orders subcollection
    const allOrders: Order[] = [];
    
    for (const storeDoc of storesSnapshot.docs) {
        const storeId = storeDoc.id;
        const ordersRef = collection(db, "stores", storeId, "orders");
        const ordersSnapshot = await getDocs(ordersRef);
        
        // 3. Combine results with store context
        const storeOrders = ordersSnapshot.docs.map(doc => ({
            id: doc.id,
            store_id: storeId, // Include store ID with each order
            ...doc.data()
        }) as Order);
        
        allOrders.push(...storeOrders);
    }
    
    return allOrders;
};