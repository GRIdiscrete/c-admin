import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, Timestamp, where } from "firebase/firestore";
import {  Brand, Category, Industry, Model, Part, Product, Review} from "@/types-db"
import { ProductForm } from "./_components/product-form";

const ProductPage = async ({
    params}: {params: { storeId : string ,productId: string}}) => {

        const Product = (await getDoc(doc(db, "stores", params.storeId,
            "products", params.productId
        ))).data() as Product;

        const categoryData = (
            await getDocs(
                query(
                collection(doc(db, "data", "wModRJCDon6XLQYmnuPT"), "reviews"),
                where("productID", "==", params.productId))
            )
        ).docs.map(doc => doc.data()) as Review[];

        console.log(categoryData)



        const partsData = (
            await getDocs(collection(doc(db, "data", "wModRJCDon6XLQYmnuPT"), 
        "parts"))
        ).docs.map(doc => doc.data()) as Part[];

        const industriesData = (
            await getDocs(collection(doc(db, "data", "wModRJCDon6XLQYmnuPT"), 
        "industries"))
        ).docs.map(doc => doc.data()) as Industry[];



        const timeElapsed = (createdAt: Timestamp) => {
            if(createdAt){
                const now = new Date().getTime();
                const created = new Date(createdAt.seconds * 1000).getTime()
                const diff = now - created;
              
                const seconds = Math.floor(diff / 1000);
                const minutes = Math.floor(seconds / 60);
                const hours = Math.floor(minutes / 60);
                const days = Math.floor(hours / 24);
              
                if (days > 0) {
                  return `${days} day(s) ago`;
                } else if (hours > 0) {
                  return `${hours} hour(s) ago`;
                } else if (minutes > 0) {
                  return `${minutes} minute(s) ago`;
                } else {
                  return `${seconds} second(s) ago`;
                }
            }
          };


    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <ProductForm initialData={Product}
            industries={industriesData}
            parts={partsData}></ProductForm>

                
        <div className="w-full mt-4 mb-4">
                {categoryData.map((review) => (
        <div key={review.id} className="w-full h-fit-content max-h-[300px] bg-gray-100 bg-opacity-50 overflow-y-auto rounded-md border border-gray-100 p-4">
            <h2  className="text-blue-400 text-xs p-2 rounded-md w-fit-content">{review.userName}</h2>
            <p  className="text-gray-500 bg-white shadow-md pl-8 p-2 m-2 rounded-md">{review.comment}</p>
            <p className="text-gray-400 text-xs">Added: {timeElapsed(review.createdAt)}</p>
        </div>
      ))}
                </div>
            
        </div>
    );
}

export default ProductPage; 
