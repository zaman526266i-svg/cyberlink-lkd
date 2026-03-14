import { NextResponse } from "next/server";
import { readContentByKey } from "@/lib/serverContent";

export async function GET(_request, { params }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json(
        { success: false, error: "Valid offer id is required." },
        { status: 400 }
      );
    }

    const record = await readContentByKey("offers");
    const data = record?.content || { offers: [] };
    const offer = data.offers.find((item) => item.id === id);

    if (!offer) {
      return NextResponse.json(
        { success: false, error: "Offer not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: offer });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
