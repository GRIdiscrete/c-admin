import { db } from "@/lib/firebase";
import fs, { createReadStream } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import {  Category, Part } from "@/types-db";
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

        console.log("dgfsgdfgdfgdfgdfgdfgdfgdfgdgdfgdgdfgdg");


        const processCarParts = async () => {
                const __filename = fileURLToPath(import.meta.url);
                const __dirname = path.dirname(__filename);
                const filePath = path.join(__dirname, 'carparts_chunk_2.json');
            
                // Use stream-based JSON parsing
                const stream = createReadStream(filePath, { encoding: 'utf8' });
                let jsonBuffer = '';
            
                await new Promise((resolve, reject) => {
                  stream
                    .on('data', (chunk) => {
                      jsonBuffer += chunk;
                      // Add chunk size check
                    })
                    .on('end', resolve)
                    .on('error', reject);
                });
                
                const sample = JSON.parse(jsonBuffer);
                var holder = []

                for (let i = 0; i < sample.length; i++) {
                    holder.push(sample[i]);
                  }
    
  
                  var counter = 0;
                  const startIndex = 290000;
              // Process data
              for (let i = startIndex; i < sample.length; i++) {
                const x = sample[i]; // Access the element starting from startIndex
                const data = {
                    id: x.id,
                    Name: x.Name, // This exists in your data
                    PartCode: x.part_code, // Example of correct field access
                    Category: x.Category,
                    Make: x.Make,
                    Model: x.Model,
                    Year: x.Year,
                    Photo: x.Photo,
                };

                const NameRef = await addDoc(
                    collection(db, "data", "wModRJCDon6XLQYmnuPT", "parts2"),
                    data
                );

                console.log(x);
                counter += 1;
                console.log(counter);
            }

              
              



            } 
          
          await processCarParts()
    
          return NextResponse.json({ status: 200 });

    }
   

 catch (error) {
    console.log(`CATEGORIES_POST:${error}`);
    return new NextResponse("Internal Server Error", {status : 500})
}
};


export const GET = async (reQ: Request,
) => {
    try {

        const categoryData = (
            await getDocs(
                collection(doc(db, "data", "wModRJCDon6XLQYmnuPT"), "categories")
            )
        ).docs.map(doc => doc.data()) as Category[];

        return NextResponse.json(categoryData)
    
    
    }
   

 catch (error) {
    console.log(`CATEGORIESS_GET:${error}`);
    return new NextResponse("Internal Server Error", {status : 500})
}
};


