import { db } from "@/lib/firebase"
import { Order } from "@/types-db"
import { collection, doc, getDocs } from "firebase/firestore"

export const getOrders = async () => {
    const storesSnapshot = await getDocs(collection(db, "stores"));

    const totalOrders = storesSnapshot.size

    return totalOrders;
}
