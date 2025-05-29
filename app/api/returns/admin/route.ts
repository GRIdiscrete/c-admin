import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const returnsQuery = collection(db, "data", "wModRJCDon6XLQYmnuPT", "returns");
    const returnsSnapshot = await getDocs(returnsQuery);
    const returnsData = returnsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(returnsData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch returns" },
      { status: 500 }
    );
  }
}