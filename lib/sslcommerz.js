import crypto from "crypto";

function requireEnv(name, fallback = "") {
  const value = process.env[name] || fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getSslConfig() {
  const baseUrl = (process.env.SSLCOMMERZ_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
  return {
    storeId: requireEnv("SSLCOMMERZ_STORE_ID"),
    storePassword: requireEnv("SSLCOMMERZ_STORE_PASSWORD"),
    sessionUrl: process.env.SSLCOMMERZ_SESSION_URL || "https://securepay.sslcommerz.com/gwprocess/v4/api.php",
    validationUrl:
      process.env.SSLCOMMERZ_VALIDATION_URL ||
      "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php",
    successUrl: process.env.SSLCOMMERZ_SUCCESS_URL || `${baseUrl}/api/payments/success`,
    failUrl: process.env.SSLCOMMERZ_FAIL_URL || `${baseUrl}/api/payments/fail`,
    cancelUrl: process.env.SSLCOMMERZ_CANCEL_URL || `${baseUrl}/api/payments/cancel`,
    ipnUrl: process.env.SSLCOMMERZ_IPN_URL || `${baseUrl}/api/payments/ipn`,
  };
}

function encodeForm(data) {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    params.set(key, value === null || value === undefined ? "" : String(value));
  });
  return params;
}

async function safeJson(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Unexpected response from SSLCommerz: ${text.slice(0, 200)}`);
  }
}

export function generateTransactionId(prefix = "TXN") {
  const timePart = Date.now().toString(36);
  const randPart = crypto.randomBytes(4).toString("hex");
  return `${prefix}-${timePart}-${randPart}`.toUpperCase();
}

export async function createSslSession(payload) {
  const cfg = getSslConfig();
  const body = encodeForm({
    store_id: cfg.storeId,
    store_passwd: cfg.storePassword,
    success_url: cfg.successUrl,
    fail_url: cfg.failUrl,
    cancel_url: cfg.cancelUrl,
    ipn_url: cfg.ipnUrl,
    currency: "BDT",
    product_category: "internet",
    product_profile: "general",
    shipping_method: "NO",
    ...payload,
  });

  const response = await fetch(cfg.sessionUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  const result = await safeJson(response);
  if (!response.ok || result.status === "FAILED") {
    throw new Error(result.failedreason || result.status || "Failed to create SSLCommerz session.");
  }
  return result;
}

export async function validateSslTransaction({ valId, tranId }) {
  const cfg = getSslConfig();
  const query = new URLSearchParams({
    store_id: cfg.storeId,
    store_passwd: cfg.storePassword,
    format: "json",
  });
  if (valId) query.set("val_id", String(valId));
  if (tranId) query.set("tran_id", String(tranId));

  const url = `${cfg.validationUrl}?${query.toString()}`;
  const response = await fetch(url, { method: "GET", cache: "no-store" });
  const result = await safeJson(response);
  if (!response.ok) {
    throw new Error(result?.error || "Failed to validate SSLCommerz transaction.");
  }
  return result;
}

