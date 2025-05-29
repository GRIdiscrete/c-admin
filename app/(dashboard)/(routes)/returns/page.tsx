"use server"
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

import { ReturnData } from "@/types-db";
import ReturnsPage from "./returnsPage";

const AdminReturnsPage = async () => {
  // Fetch ALL returns data without filtering by store
  const returnsQuery = collection(db, "data", "wModRJCDon6XLQYmnuPT", "returns");

  const returnsSnapshot = await getDocs(returnsQuery);
  const returnsData = returnsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ReturnData[];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ReturnsPage initialData={returnsData} isAdminView={true} />
      </div>
    </div>
  );
}

export default AdminReturnsPage;