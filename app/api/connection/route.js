import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { notifyAdminsNewRequest } from "@/lib/notifications";

export async function POST(request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db("cluster0");

    const payload = {
      fullName: data.fullName || data.name || "",
      email: data.email || "",
      mobile: data.mobile || data.phone || "",
      phone: data.phone || data.mobile || "",
      location: data.location || data.address || "",
      flatNo: data.flatNo || "",
      houseNo: data.houseNo || "",
      roadNo: data.roadNo || "",
      area: data.area || "",
      landmark: data.landmark || "",
      reference: data.reference || data.referenceSource || "",
      package: data.package || "",
      nid: data.nid || "",
      latitude: Number.isFinite(Number(data.latitude)) ? Number(data.latitude) : null,
      longitude: Number.isFinite(Number(data.longitude)) ? Number(data.longitude) : null,
      mapLink: data.mapLink || "",
      notes: data.notes || "",
      assignedManagerId: null,
      assignedManagerName: "",
      assignmentStatus: "unassigned",
      status: "pending",
      requestedAt: new Date(),
      updatedAt: new Date(),
      source: "connection-page",
    };

    const res = await db.collection("connection_requests").insertOne(payload);
    const requestDoc = { ...payload, _id: res.insertedId };
    const mailResult = await notifyAdminsNewRequest(db, requestDoc);

    return NextResponse.json({
      success: true,
      id: res.insertedId.toString(),
      request: {
        ...payload,
        _id: res.insertedId.toString(),
      },
      mailSent: Boolean(mailResult?.success),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
