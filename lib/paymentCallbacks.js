import { validateSslTransaction } from "@/lib/sslcommerz";
import { getPaymentsCollection } from "@/lib/payments";

function normalizeGatewayStatus(rawStatus) {
  const status = String(rawStatus || "").toUpperCase();
  if (status === "VALID" || status === "VALIDATED") return "VALID";
  if (status === "FAILED") return "FAILED";
  if (status === "CANCELLED") return "CANCELLED";
  return "PENDING";
}

export async function parseGatewayPayload(request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return request.json();
  }
  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

export async function finalizePayment({ payload, source, fallbackStatus = "PENDING" }) {
  const tranId = String(payload.tran_id || payload.tranId || "");
  if (!tranId) {
    throw new Error("Transaction ID is missing.");
  }

  const valId = String(payload.val_id || payload.valId || "");
  const requestStatus = String(payload.status || fallbackStatus || "PENDING");
  const normalizedStatus = normalizeGatewayStatus(requestStatus);
  const validation = valId ? await validateSslTransaction({ valId, tranId }) : null;
  const validatedStatus = normalizeGatewayStatus(validation?.status || normalizedStatus);
  const finalStatus = validatedStatus === "PENDING" ? normalizedStatus : validatedStatus;

  const payments = await getPaymentsCollection();
  await payments.updateOne(
    { tranId },
    {
      $set: {
        status: finalStatus,
        validationStatus: validation?.status || normalizedStatus,
        riskLevel: validation?.risk_level || "",
        validatedAt: new Date(),
        updatedAt: new Date(),
        callbackSource: source,
        callbackPayload: payload,
        validationPayload: validation,
      },
    }
  );

  const updated = await payments.findOne({ tranId });
  return { tranId, status: finalStatus, validation, payment: updated };
}

