import { NextResponse } from "next/server";
import { getRalioClient } from "@/lib/ralio";

export async function GET() {
  try {
    const ralio = await getRalioClient();
    const txns = await ralio.transactions.list({ limit: 20 });
    return NextResponse.json(txns);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
