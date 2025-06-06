import { db } from "@/lib/firebase";
import {  Industry } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (reQ: Request,
) => {
    try {
        const {userId} = auth()
        const body = await reQ.json()
    
        if(!userId){
            return new NextResponse("Unauthorized", {status: 400})
        }
    
        const {name, value} = body;
    
    
        if(!name){
            return new NextResponse("Category Name Missing", {status: 400})
        }
        if(!value){
            return new NextResponse("Industry definition Missing", {status: 400})
        }

        const IndustryData = {
            name,
            value,
            createdAt: serverTimestamp()
        }

        const IndustryRef = await addDoc(
            collection(db,"data", "wModRJCDon6XLQYmnuPT", "industries"),
            IndustryData
        );

        const id = IndustryRef.id;
        await updateDoc(doc(db, "data", "wModRJCDon6XLQYmnuPT", "industries", id), 
        {...IndustryData,
            id,
            updatedAt: serverTimestamp()
        }
    );

    return NextResponse.json({id, ...IndustryData})
    
    
    }
   

 catch (error) {
    console.log(`INDUSTRIES_POST:${error}`);
    return new NextResponse("Internal Server Error", {status : 500})
}
};


export const GET = async (reQ: Request,
) => {
    try {


        const categoryData = (
            await getDocs(
                collection(doc(db, "data", "wModRJCDon6XLQYmnuPT"), "industries")
            )
        ).docs.map(doc => doc.data()) as Industry[];

        return NextResponse.json(categoryData)
    
    
    }
   

 catch (error) {
    console.log(`INDUSTRIES_GET:${error}`);
    return new NextResponse("Internal Server Error", {status : 500})
}
};


