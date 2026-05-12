import { NextResponse } from "next/server";
import { readContentByKey } from "@/lib/serverContent";
import { PUBLIC_CACHE_HEADERS } from "@/lib/apiCache";
import { mergeRegularPlansForSite, mergeSmePlansForSite, normalizePlanKey } from "@/lib/planMerge";

function formatPackagePrice(price) {
  const s = String(price ?? "").trim();
  if (!s) return "";
  if (/tk\b/i.test(s)) return s;
  return `${s} TK`;
}

function pushSmePackageRow(merged, seen, plan) {
  const speed = String(plan.speed || "").trim();
  const name = String(plan.name || "").trim();
  if (!speed) return;
  const label = name ? `${speed} — ${name} (SME)` : `${speed} (SME)`;
  const key = normalizePlanKey(label);
  if (seen.has(key)) return;
  seen.add(key);
  merged.push({ label, price: formatPackagePrice(plan.price), category: "sme" });
}

export async function GET() {
  try {
    const [homeRecord, pricingRecord] = await Promise.all([
      readContentByKey("home"),
      readContentByKey("pricing"),
    ]);

    const home = homeRecord?.content || {};
    const pricing = pricingRecord?.content || {};

    const regularMerged = mergeRegularPlansForSite(home.regularPlans, pricing.regularPlans);
    const smeMerged = mergeSmePlansForSite(home.smePlans, pricing.smePlans);

    const merged = [];
    const seen = new Set();

    for (const plan of regularMerged) {
      const speed = String(plan.speed || "").trim();
      if (!speed) continue;
      const key = normalizePlanKey(speed);
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push({ label: speed, price: formatPackagePrice(plan.price) });
    }

    for (const plan of smeMerged) {
      pushSmePackageRow(merged, seen, plan);
    }

    return NextResponse.json({ success: true, data: { packages: merged } }, { headers: PUBLIC_CACHE_HEADERS });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
