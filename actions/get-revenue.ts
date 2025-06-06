import { db } from "@/lib/firebase"
import { Order } from "@/types-db"
import { collection, doc, getDocs } from "firebase/firestore"

export const getRevenue = async () => {
    const ordersData = (
        await getDocs(collection(doc(db, "orders"), "orders"))
    ).docs.map((doc) => doc.data()) as Order[];

    const paidOrders = ordersData.filter((order) => order.isPaid);

    const totalRevenue = paidOrders.reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((orderSum, item)=>{
            return orderSum + item.price;
        }, 0)
        return total + orderTotal;
    }, 0)

    return totalRevenue;
}
