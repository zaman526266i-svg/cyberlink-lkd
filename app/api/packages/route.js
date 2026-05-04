import { NextResponse } from "next/server";
import { readContentByKey } from "@/lib/serverContent";
import { PUBLIC_CACHE_HEADERS } from "@/lib/apiCache";

export async function GET() {
  try {
    const record = await readContentByKey("packages");
    const data = record?.content || { packages: [] };
    return NextResponse.json({ success: true, data }, { headers: PUBLIC_CACHE_HEADERS });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
