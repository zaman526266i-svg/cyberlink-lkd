import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getDbName } from "@/lib/db";
import { readContentByKey } from "@/lib/serverContent";

const PAYMENTS_COLLECTION = "payment_transactions";
const CONNECTION_REQUESTS_COLLECTION = "connection_requests";
const BILLING_ACCOUNTS_COLLECTION = "billing_accounts";
const SERVICE_CHARGES_COLLECTION = "service_charges";

let indexesReady = false;

function parseAmount(value) {
  const parsed = Number(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function toIsoDate(value) {
  return value ? new Date(value).toISOString() : null;
}

export function serializePayment(doc) {
  return {
    ...doc,
    _id: doc._id?.toString?.() || String(doc._id || ""),
    requestId: doc.requestId?.toString?.() || doc.requestId || "",
    paidAt: toIsoDate(doc.paidAt),
    createdAt: toIsoDate(doc.createdAt),
    updatedAt: toIsoDate(doc.updatedAt),
    validatedAt: toIsoDate(doc.validatedAt),
  };
}

export async function getDatabase() {
  const client = await clientPromise;
  return client.db(getDbName());
}

export async function getPaymentsCollection() {
  const db = await getDatabase();
  const collection = db.collection(PAYMENTS_COLLECTION);

  if (!indexesReady) {
    await Promise.all([
      collection.createIndex({ tranId: 1 }, { unique: true }),
      collection.createIndex({ status: 1, createdAt: -1 }),
      collection.createIndex({ flowType: 1, createdAt: -1 }),
      collection.createIndex({ customerId: 1, createdAt: -1 }),
    ]);
    indexesReady = true;
  }

  return collection;
}

export async function resolveAmountForNewConnection({ requestId, packageLabel }) {
  const db = await getDatabase();
  let requestDoc = null;
  if (requestId && ObjectId.isValid(requestId)) {
    requestDoc = await db.collection(CONNECTION_REQUESTS_COLLECTION).findOne({ _id: new ObjectId(requestId) });
  }

  const targetPackage = String(packageLabel || requestDoc?.package || "").trim();
  if (!targetPackage) {
    throw new Error("Package is required for new connection payment.");
  }

  const packagesRecord = await readContentByKey("packages");
  const packages = packagesRecord?.content?.packages || [];
  const found = packages.find((pkg) => String(pkg.label || "").trim() === targetPackage);
  if (!found) {
    throw new Error("Selected package was not found in database.");
  }

  const amount = parseAmount(found.price);
  if (amount <= 0) {
    throw new Error("Package amount is invalid.");
  }

  return {
    amount,
    currency: "BDT",
    packageLabel: targetPackage,
    requestDoc,
    customer: {
      name: requestDoc?.fullName || "New Connection Customer",
      email: requestDoc?.email || "customer@cyberlinkltd.com",
      phone: requestDoc?.mobile || requestDoc?.phone || "01700000000",
      address: requestDoc?.location || "Bangladesh",
    },
  };
}

function defaultServiceCharge(serviceType) {
  const key = String(serviceType || "monthly_bill").toLowerCase();
  if (key === "new_connection") return 1200;
  if (key === "shift_connection") return 800;
  if (key === "reconnection") return 500;
  if (key === "buy_router") return 2500;
  return 0;
}

export async function resolveAmountForMonthlyBill({ customerId, serviceType }) {
  const db = await getDatabase();
  const normalizedCustomerId = String(customerId || "").trim();
  if (!normalizedCustomerId) {
    throw new Error("Customer ID is required.");
  }

  const account = await db.collection(BILLING_ACCOUNTS_COLLECTION).findOne({ customerId: normalizedCustomerId });
  let amount = account ? parseAmount(account.amountDue) : 0;

  if (amount <= 0 && serviceType) {
    const chargeDoc = await db
      .collection(SERVICE_CHARGES_COLLECTION)
      .findOne({ key: String(serviceType).toLowerCase() });
    amount = chargeDoc ? parseAmount(chargeDoc.amount) : defaultServiceCharge(serviceType);
  }

  if (amount <= 0) {
    throw new Error("No payable amount found for this customer.");
  }

  return {
    amount,
    currency: "BDT",
    account,
    customer: {
      name: account?.name || `Customer ${normalizedCustomerId}`,
      email: account?.email || "customer@cyberlinkltd.com",
      phone: account?.phone || "01700000000",
      address: account?.address || "Bangladesh",
    },
  };
}

