import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getSessionFromRequest } from "@/lib/adminAuth";
import { notifyAdminsManagerCompleted, notifyAdminsNewRequest, notifyManagerAssigned } from "@/lib/notifications";

const DB_NAME = "cluster0";
const COLLECTION_NAME = "connection_requests";
const ADMIN_COLLECTION_NAME = "admins";
const STATUS_VALUES = new Set(["pending", "reviewed", "approved", "connected", "completed", "rejected"]);
const ASSIGNMENT_STATUS_VALUES = new Set(["unassigned", "assigned", "in_progress", "completed", "rejected"]);

function serializeRequest(doc) {
  return {
    ...doc,
    _id: doc._id.toString(),
    assignedManagerId: doc.assignedManagerId ? doc.assignedManagerId.toString() : "",
    requestedAt: doc.requestedAt ? new Date(doc.requestedAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  };
}

export async function GET(request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session.isAuthenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = String(searchParams.get("id") || "");
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const filter = {};
    if (session.isManager && session.objectUserId) {
      filter.assignedManagerId = session.objectUserId;
    }

    if (id) {
      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ success: false, error: "Invalid request id." }, { status: 400 });
      }

      const requestDoc = await db.collection(COLLECTION_NAME).findOne({
        ...filter,
        _id: new ObjectId(id),
      });

      if (!requestDoc) {
        return NextResponse.json({ success: false, error: "Request not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: serializeRequest(requestDoc),
      });
    }

    const requests = await db.collection(COLLECTION_NAME).find(filter).sort({ requestedAt: -1, _id: -1 }).toArray();

    return NextResponse.json({
      success: true,
      data: requests.map(serializeRequest),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const payload = {
      fullName: body.fullName || body.name || "",
      email: body.email || "",
      mobile: body.mobile || body.phone || "",
      phone: body.phone || body.mobile || "",
      location: body.location || body.address || "",
      flatNo: body.flatNo || "",
      houseNo: body.houseNo || "",
      roadNo: body.roadNo || "",
      area: body.area || "",
      landmark: body.landmark || "",
      reference: body.reference || body.referenceSource || "",
      nid: body.nid || "",
      package: body.package || "",
      latitude: Number.isFinite(Number(body.latitude)) ? Number(body.latitude) : null,
      longitude: Number.isFinite(Number(body.longitude)) ? Number(body.longitude) : null,
      mapLink: body.mapLink || "",
      notes: body.notes || "",
      assignedManagerId: null,
      assignedManagerName: "",
      assignmentStatus: "unassigned",
      status: "pending",
      requestedAt: new Date(),
      updatedAt: new Date(),
      source: "apply-api",
    };

    const res = await db.collection(COLLECTION_NAME).insertOne(payload);
    await notifyAdminsNewRequest(db, { ...payload, _id: res.insertedId });
    return NextResponse.json({ success: true, id: res.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session.isAuthenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const id = String(body.id || "");
    const nextStatus = String(body.status || "").toLowerCase();
    const nextAssignmentStatus = String(body.assignmentStatus || "").toLowerCase();
    const hasAssignedManagerId = Object.prototype.hasOwnProperty.call(body, "assignedManagerId");
    const assignedManagerId = String(body.assignedManagerId || "");
    const notes = typeof body.notes === "string" ? body.notes.trim() : null;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Valid request id is required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const filter = { _id: new ObjectId(id) };

    if (session.isManager && session.objectUserId) {
      filter.assignedManagerId = session.objectUserId;
    }

    const current = await db.collection(COLLECTION_NAME).findOne(filter);
    if (!current) {
      return NextResponse.json({ success: false, error: "Request not found." }, { status: 404 });
    }

    const updates = {
      updatedAt: new Date(),
    };

    if (nextStatus) {
      if (!STATUS_VALUES.has(nextStatus)) {
        return NextResponse.json({ success: false, error: "Invalid status value." }, { status: 400 });
      }
      updates.status = nextStatus;
    }

    if (nextAssignmentStatus) {
      if (!ASSIGNMENT_STATUS_VALUES.has(nextAssignmentStatus)) {
        return NextResponse.json({ success: false, error: "Invalid assignment status value." }, { status: 400 });
      }
      updates.assignmentStatus = nextAssignmentStatus;
    }

    if (notes !== null) {
      updates.notes = notes;
    }

    let assignedManagerDoc = null;
    if (session.isAdmin && hasAssignedManagerId) {
      if (!assignedManagerId) {
        updates.assignedManagerId = null;
        updates.assignedManagerName = "";
        updates.assignmentStatus = "unassigned";
      } else {
        if (!ObjectId.isValid(assignedManagerId)) {
          return NextResponse.json({ success: false, error: "Invalid manager id." }, { status: 400 });
        }
        const manager = await db.collection(ADMIN_COLLECTION_NAME).findOne({
          _id: new ObjectId(assignedManagerId),
          role: "manager",
        });

        if (!manager) {
          return NextResponse.json({ success: false, error: "Manager not found." }, { status: 404 });
        }

        assignedManagerDoc = manager;
        updates.assignedManagerId = manager._id;
        updates.assignedManagerName = manager.username;
        updates.assignmentStatus = updates.assignmentStatus || "assigned";
      }
    }

    if (session.isManager) {
      delete updates.assignedManagerId;
      delete updates.assignedManagerName;
    }

    const managerAssignedNow =
      session.isAdmin &&
      hasAssignedManagerId &&
      !!assignedManagerId &&
      (!current.assignedManagerId || current.assignedManagerId.toString() !== assignedManagerId);

    const managerCompletedNow =
      session.isManager &&
      ((updates.assignmentStatus === "completed" && current.assignmentStatus !== "completed") ||
        (updates.status === "completed" && current.status !== "completed"));

    const result = await db.collection(COLLECTION_NAME).updateOne(
      filter,
      {
        $set: updates,
      }
    );

    if (!result.matchedCount) {
      return NextResponse.json(
        { success: false, error: "Request not found." },
        { status: 404 }
      );
    }

    const updated = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Updated request could not be loaded." },
        { status: 500 }
      );
    }

    if (managerAssignedNow && assignedManagerDoc) {
      await notifyManagerAssigned({
        managerEmail: assignedManagerDoc.email || "",
        managerName: assignedManagerDoc.username || "",
        requestDoc: updated,
      });
    }

    if (managerCompletedNow) {
      await notifyAdminsManagerCompleted(db, updated, session.username);
    }

    return NextResponse.json({ success: true, data: serializeRequest(updated) });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session.isAuthenticated || !session.isAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = String(searchParams.get("id") || "");

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Valid request id is required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });

    if (!result.deletedCount) {
      return NextResponse.json({ success: false, error: "Request not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
