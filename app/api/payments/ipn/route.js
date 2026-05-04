import { NextResponse } from "next/server";
import { finalizePayment, parseGatewayPayload } from "@/lib/paymentCallbacks";

export async function POST(request) {
  try {
    const payload = await parseGatewayPayload(request);
    await finalizePayment({ payload, source: "ipn", fallbackStatus: "VALIDATED" });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

