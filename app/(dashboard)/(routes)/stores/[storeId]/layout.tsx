import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";
import {Store} from "@/types-db"
import {Navbar} from "@/components/navbar"
import { Navbar2 } from "@/components/nav2";

interface DashboardLayoutProps {
    children: React.ReactNode,
    params: {storeId: string}
}
const DashboardLayout = async ({children, params}: DashboardLayoutProps) => {
    const {userId} = auth()
    if(!userId){
        redirect("/sign-in")
    }


    const storeSnap = await getDocs(
        query(
            collection(db, "stores"),
            where("id", "==", params.storeId)
        )
    );

    let store;

    storeSnap.forEach(doc => {
        store = doc.data() as Store;

    });

    if(!store){
        redirect("/")
    }

    return <>
        <Navbar2 />
        {children}
    </>


    return (<div></div>);
}

export default DashboardLayout;