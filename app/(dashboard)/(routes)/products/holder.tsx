"use client";

import { collection, doc, getDocs } from "firebase/firestore";
import { format } from "date-fns";
import { ProductClient } from "./components/client";
import { db } from "@/lib/firebase";
import { Product } from "@/types-db";
import { ProductColumns } from "./components/columns";
import { formatter } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let holder: Product[] = [];
        
        const storesSnapshot = await getDocs(collection(db, "stores"));
        const storeIds = storesSnapshot.docs.map(doc => doc.id);

        for (const storeId of storeIds) {
          const productsData = (
            await getDocs(collection(doc(db, "stores", storeId), "products"))
          ).docs.map(doc => doc.data()) as Product[];
          
          holder = [...holder, ...productsData];
        }

        setProducts(holder);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formattedProducts: ProductColumns[] = products.map(item => ({
    id: item.id,
    name: item.name,
    price: formatter.format(item.price),
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    category: item.category,
    industry: item.industry,
    brand: item.brand,
    model: item.model,
    images: item.images,
    // year: item.year ? format(item.createdAt.toDate(), "yyyy") : "",
    // createdAt: item.createdAt ? format(item.createdAt.toDate(), "MMMM dd, yyyy") : ""
  }));

  if (loading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="space-y-4">
            {/* Header Skeleton */}
            <Skeleton className="h-10 w-[200px]" />
            
            {/* Table Skeleton */}
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;