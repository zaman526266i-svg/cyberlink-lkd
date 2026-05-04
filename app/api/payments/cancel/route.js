import { NextResponse } from "next/server";
import { finalizePayment, parseGatewayPayload } from "@/lib/paymentCallbacks";

function statusUrl(request, status, tranId) {
  const url = new URL("/payment-status", request.url);
  url.searchParams.set("status", status.toLowerCase());
  if (tranId) {
    url.searchParams.set("tranId", tranId);
  }
  return url;
}

export async function POST(request) {
  try {
    const payload = await parseGatewayPayload(request);
    const { tranId, status } = await finalizePayment({
      payload,
      source: "cancel_callback",
      fallbackStatus: "CANCELLED",
    });
    return NextResponse.redirect(statusUrl(request, status, tranId));
  } catch {
    return NextResponse.redirect(statusUrl(request, "cancelled", ""));
  }
}

export async function GET(request) {
  return NextResponse.redirect(statusUrl(request, "cancelled", ""));
}

