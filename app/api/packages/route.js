import { NextResponse } from "next/server";
import { readContentByKey } from "@/lib/serverContent";
import { PUBLIC_CACHE_HEADERS } from "@/lib/apiCache";

function formatPackagePrice(price) {
  const s = String(price ?? "").trim();
  if (!s) return "";
  if (/tk\b/i.test(s)) return s;
  return `${s} TK`;
}

function normalizeKey(value) {
  return String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
}

function pushSmePlan(merged, seen, plan) {
  const speed = String(plan.speed || "").trim();
  const name = String(plan.name || "").trim();
  if (!speed) return;
  const label = name ? `${speed} — ${name} (SME)` : `${speed} (SME)`;
  const key = normalizeKey(label);
  if (seen.has(key)) return;
  seen.add(key);
  merged.push({ label, price: formatPackagePrice(plan.price), category: "sme" });
}

export async function GET() {
  try {
    const [packagesRecord, homeRecord, pricingRecord] = await Promise.all([
      readContentByKey("packages"),
      readContentByKey("home"),
      readContentByKey("pricing"),
    ]);

    const basePackages = Array.isArray(packagesRecord?.content?.packages) ? packagesRecord.content.packages : [];
    const home = homeRecord?.content || {};
    const pricing = pricingRecord?.content || {};
    const regularPlans = Array.isArray(home.regularPlans) ? home.regularPlans : [];
    const homeSmePlans = Array.isArray(home.smePlans) ? home.smePlans : [];
    const pricingSmePlans = Array.isArray(pricing.smePlans) ? pricing.smePlans : [];

    const merged = basePackages.map((p) => ({
      ...p,
      price: formatPackagePrice(p.price),
    }));

    const seen = new Set(merged.map((p) => normalizeKey(p.label)));

    for (const plan of regularPlans) {
      const speed = String(plan.speed || "").trim();
      if (!speed) continue;
      const key = normalizeKey(speed);
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push({ label: speed, price: formatPackagePrice(plan.price) });
    }

    for (const plan of homeSmePlans) {
      pushSmePlan(merged, seen, plan);
    }

    for (const plan of pricingSmePlans) {
      pushSmePlan(merged, seen, plan);
    }

    return NextResponse.json({ success: true, data: { packages: merged } }, { headers: PUBLIC_CACHE_HEADERS });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
