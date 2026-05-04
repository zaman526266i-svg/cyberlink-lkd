import { NextResponse } from "next/server";
import { resolveAmountForMonthlyBill, resolveAmountForNewConnection } from "@/lib/payments";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const flowType = String(searchParams.get("flowType") || "").toLowerCase();

    let pricing = null;
    if (flowType === "new_connection") {
      pricing = await resolveAmountForNewConnection({
        requestId: String(searchParams.get("requestId") || ""),
        packageLabel: String(searchParams.get("packageLabel") || ""),
      });
    } else if (flowType === "monthly_bill") {
      pricing = await resolveAmountForMonthlyBill({
        customerId: String(searchParams.get("customerId") || ""),
        serviceType: String(searchParams.get("serviceType") || ""),
      });
    } else {
      return NextResponse.json({ success: false, error: "Invalid flowType." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        amount: pricing.amount,
        currency: pricing.currency || "BDT",
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

