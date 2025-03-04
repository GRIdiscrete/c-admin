import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import {Billboards, Category} from "@/types-db"
import { CategoryForm } from "./_components/category-form";

const CategoryPage = async ({
    params}: {params: { categoryId: string}}) => {
        const category = (await getDoc(doc(db, "data", "wModRJCDon6XLQYmnuPT", 
            "categories", params.categoryId
        ))).data() as Category;

        const billboardData = (
            await getDocs(
                collection(doc(db, "data", "wModRJCDon6XLQYmnuPT"), "billboards")
            )
        ).docs.map(doc => doc.data()) as Billboards[];



    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryForm initialData={category} billboards={billboardData}></CategoryForm>
        </div>
    );
}

export default CategoryPage; 