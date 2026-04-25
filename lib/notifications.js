import { sendEmail } from "@/lib/mailer";

function normalizeEmailList(raw) {
  return String(raw || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function unique(values) {
  return Array.from(new Set(values));
}

function formatRequestBlock(requestDoc) {
  return [
    `Request ID: ${requestDoc?._id?.toString?.() || requestDoc?._id || "N/A"}`,
    `Name: ${requestDoc?.fullName || "N/A"}`,
    `Phone: ${requestDoc?.mobile || requestDoc?.phone || "N/A"}`,
    `Email: ${requestDoc?.email || "N/A"}`,
    `Package: ${requestDoc?.package || "N/A"}`,
    `Location: ${requestDoc?.location || "N/A"}`,
    `Referred By: ${requestDoc?.reference || "N/A"}`,
    `Status: ${requestDoc?.status || "N/A"}`,
    `Assignment Status: ${requestDoc?.assignmentStatus || "N/A"}`,
  ].join("\n");
}

export async function getAdminNotificationRecipients(db) {
  const envList = normalizeEmailList(process.env.ADMIN_NOTIFICATION_EMAIL);
  const adminDocs = await db
    .collection("admins")
    .find(
      {
        role: { $in: ["master_admin", "admin"] },
        email: { $type: "string", $ne: "" },
      },
      { projection: { email: 1 } }
    )
    .toArray();
  const dbList = adminDocs.map((doc) => String(doc.email || "").trim().toLowerCase()).filter(Boolean);
  return unique([...envList, ...dbList]);
}

export async function notifyAdminsNewRequest(db, requestDoc) {
  const recipients = await getAdminNotificationRecipients(db);
  if (!recipients.length) return { success: false, skipped: true, reason: "no_admin_recipients" };

  return sendEmail({
    to: recipients.join(","),
    subject: `New Connection Request: ${requestDoc?.fullName || "Unknown"}`,
    text: `A new connection request was submitted.\n\n${formatRequestBlock(requestDoc)}`,
  });
}

export async function notifyManagerAssigned({ managerEmail, managerName, requestDoc }) {
  if (!managerEmail) return { success: false, skipped: true, reason: "missing_manager_email" };

  return sendEmail({
    to: managerEmail,
    subject: `New Assigned Request (${requestDoc?.fullName || "Client"})`,
    text: `Hello ${managerName || "Manager"},\n\nA request has been assigned to you.\n\n${formatRequestBlock(requestDoc)}`,
  });
}

export async function notifyAdminsManagerCompleted(db, requestDoc, managerName) {
  const recipients = await getAdminNotificationRecipients(db);
  if (!recipients.length) return { success: false, skipped: true, reason: "no_admin_recipients" };

  return sendEmail({
    to: recipients.join(","),
    subject: `Manager Completed Request: ${requestDoc?.fullName || "Client"}`,
    text: `Manager "${managerName || "Unknown"}" marked a request as completed.\n\n${formatRequestBlock(requestDoc)}`,
  });
}
