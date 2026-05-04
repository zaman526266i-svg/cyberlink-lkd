import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { createSslSession, generateTransactionId } from "@/lib/sslcommerz";
import {
  getPaymentsCollection,
  resolveAmountForMonthlyBill,
  resolveAmountForNewConnection,
  serializePayment,
} from "@/lib/payments";

function getFlowType(value) {
  const flowType = String(value || "").trim().toLowerCase();
  if (flowType === "new_connection" || flowType === "monthly_bill") return flowType;
  return "";
}

export async function POST(request) {
  try {
    const body = await request.json();
    const flowType = getFlowType(body.flowType);
    if (!flowType) {
      return NextResponse.json({ success: false, error: "Valid flowType is required." }, { status: 400 });
    }

    const requestId = String(body.requestId || "");
    const packageLabel = String(body.packageLabel || "");
    const customerId = String(body.customerId || "");
    const serviceType = String(body.serviceType || "");
    const source = String(body.source || "website");
    const manualAmount = Number(body.manualAmount);

    const pricingBase =
      flowType === "new_connection"
        ? await resolveAmountForNewConnection({ requestId, packageLabel })
        : await resolveAmountForMonthlyBill({ customerId, serviceType });
    const allowManual = flowType === "monthly_bill" && Number.isFinite(manualAmount) && manualAmount > 0;
    const pricing = {
      ...pricingBase,
      amount: allowManual ? Number(manualAmount.toFixed(2)) : pricingBase.amount,
      amountSource: allowManual ? "manual_override" : "server_resolved",
    };

    const tranId = generateTransactionId(flowType === "new_connection" ? "NEW" : "BILL");
    const now = new Date();

    const paymentDoc = {
      tranId,
      flowType,
      source,
      amountSource: pricing.amountSource,
      status: "INITIATED",
      validationStatus: "PENDING",
      amount: pricing.amount,
      currency: pricing.currency || "BDT",
      requestId: requestId && ObjectId.isValid(requestId) ? new ObjectId(requestId) : null,
      customerId: customerId || "",
      packageLabel: pricing.packageLabel || packageLabel || "",
      serviceType: serviceType || "",
      customer: pricing.customer,
      gatewayMeta: {},
      createdAt: now,
      updatedAt: now,
    };

    const payments = await getPaymentsCollection();
    await payments.insertOne(paymentDoc);

    const session = await createSslSession({
      total_amount: pricing.amount,
      tran_id: tranId,
      cus_name: pricing.customer.name,
      cus_email: pricing.customer.email,
      cus_phone: pricing.customer.phone,
      cus_add1: pricing.customer.address,
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      value_a: flowType,
      value_b: requestId || "",
      value_c: customerId || "",
      value_d: source,
    });

    await payments.updateOne(
      { tranId },
      {
        $set: {
          status: "SESSION_CREATED",
          updatedAt: new Date(),
          gatewayMeta: {
            GatewayPageURL: session.GatewayPageURL || "",
            sessionkey: session.sessionkey || "",
            status: session.status || "",
            failedreason: session.failedreason || "",
          },
          sslSession: session,
        },
      }
    );

    const saved = await payments.findOne({ tranId });
    return NextResponse.json({
      success: true,
      data: {
        tranId,
        gatewayUrl: session.GatewayPageURL,
        payment: saved ? serializePayment(saved) : null,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

