import { db } from "@/lib/firebase";
import { Order, Store } from "@/types-db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { OrderColumns } from "../components/columns";
import { formatter } from "@/lib/utils";
import {format} from "date-fns"
import DeliveryCalendar from "./component";
const Calendar = async () => {
    let allOrders : Order[] = [];


    const storesSnapshot = await getDocs(collection(db, "stores"));
    const storeIds = storesSnapshot.docs.map(doc => doc.id);
    for (const storeId of storeIds) {
        const ordersData = (
            await getDocs(
                collection(doc(db, "stores", storeId), "orders")
            )
        ).docs.map(doc => doc.data()) as Order[];

        const storeData = (await getDoc(doc(db, "stores", storeId))).data() as Store;

        if (storeData.address) {
            for(const x of ordersData){
                x.store_address = storeData.address;
            }
        }
        else {
            for(const x of ordersData){
                x.store_address = '';
            }
        }

        const filteredOrders = ordersData.filter(order => order.order_status !== "Complete");

        const Neworders = allOrders.concat(filteredOrders)
        allOrders = Neworders;
    }
 


    


    const formattedorders : OrderColumns[] = allOrders.map(
        item =>({
            id: item.id,
            isPaid: item.isPaid,
            number: item.number,
            address: item.address,
            deliveryIn: item.deliveryInstructions,
            store_name: item.store_name,
            clientName: item.clientName,
            clientEmail: item.clientEmail,
            store_address: item.store_address,
            products: item.orderItems.map(ite => ite.name).join(", "),
            store_id: item.store_id,
            order_status: item.order_status,
            userID: item.userID,
            totalPrice: formatter.format(
                item.orderItems.reduce((total, item) =>{
                    if(item && item.qty !== undefined){
                        return total + Number(item.price * item.qty)
                    }
                    return total
                }, 0)
            ),
            images: item.orderItems.map(item => item.images[0].url),
            createdAt: item.createdAt ? format(item.createdAt.toDate(), "MMMM dd, yyyy") : "",
            lat: item.lat,
            lng: item.lng,
            updatedAt: item.updatedAt ? format(item.createdAt.toDate(), "MMMM dd, yyyy") : "",
            
        })
    )
    return ( <>
    <DeliveryCalendar orders={allOrders}/>
    </> );
}
 
export default Calendar;