import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/adminAuth";
import { getPaymentsCollection, serializePayment } from "@/lib/payments";

function toDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function GET(request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session.isAuthenticated || !session.isAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = String(searchParams.get("q") || "").trim();
    const status = String(searchParams.get("status") || "").trim().toUpperCase();
    const flowType = String(searchParams.get("flowType") || "").trim().toLowerCase();
    const from = toDate(searchParams.get("from"));
    const to = toDate(searchParams.get("to"));
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(5, Number(searchParams.get("limit") || 20)));
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;
    if (flowType) filter.flowType = flowType;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = from;
      if (to) filter.createdAt.$lte = to;
    }
    if (q) {
      filter.$or = [{ tranId: { $regex: q, $options: "i" } }, { customerId: { $regex: q, $options: "i" } }];
    }

    const payments = await getPaymentsCollection();
    const [items, total, byStatus, byFlow] = await Promise.all([
      payments.find(filter).sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit).toArray(),
      payments.countDocuments(filter),
      payments
        .aggregate([{ $match: filter }, { $group: { _id: "$status", count: { $sum: 1 } } }])
        .toArray(),
      payments
        .aggregate([{ $match: filter }, { $group: { _id: "$flowType", count: { $sum: 1 } } }])
        .toArray(),
    ]);

    return NextResponse.json({
      success: true,
      data: items.map(serializePayment),
      summary: {
        total,
        byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item._id || "UNKNOWN"]: item.count }), {}),
        byFlowType: byFlow.reduce((acc, item) => ({ ...acc, [item._id || "unknown"]: item.count }), {}),
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

