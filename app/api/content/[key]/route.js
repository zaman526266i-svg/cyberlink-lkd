import { NextResponse } from "next/server";
import { getContentFileByKey } from "@/lib/contentFiles";
import { readContentByKey } from "@/lib/serverContent";
import { PUBLIC_CACHE_HEADERS } from "@/lib/apiCache";

export async function GET(request, context) {
  try {
    const { key: rawKey } = await context.params;
    const key = String(rawKey || "");

    const meta = getContentFileByKey(key);
    if (!meta) {
      return NextResponse.json({ success: false, error: "Invalid content key." }, { status: 400 });
    }

    const data = await readContentByKey(key);
    if (!data) {
      return NextResponse.json({ success: false, error: "Content not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data }, { headers: PUBLIC_CACHE_HEADERS });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
