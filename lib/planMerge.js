/** Normalize plan speed / label keys for deduping. */
export function normalizePlanKey(value) {
  return String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
}

/**
 * Stable React list key for merged plans — CMS `id` can repeat across home vs pricing.
 */
export function publicPlanListKey(plan, tab, index) {
  const speed = normalizePlanKey(plan.speed) || "na";
  const name = normalizePlanKey(plan.name) || "na";
  const base = tab === "sme" ? `sme:${speed}:${name}` : `reg:${speed}`;
  return `${base}:${index}`;
}

/**
 * Union of home + pricing regular plans (same speeds on both pages).
 * When both define a speed, pricing fields win (rate, features, name).
 * Order: pricing page order first, then home-only plans.
 */
export function mergeRegularPlansForSite(homePlans, pricingPlans) {
  const home = Array.isArray(homePlans) ? homePlans : [];
  const pricing = Array.isArray(pricingPlans) ? pricingPlans : [];
  const bySpeed = new Map();

  for (const plan of home) {
    const speed = String(plan.speed || "").trim();
    if (!speed) continue;
    const key = normalizePlanKey(speed);
    if (!bySpeed.has(key)) {
      bySpeed.set(key, { ...plan });
    }
  }
  for (const plan of pricing) {
    const speed = String(plan.speed || "").trim();
    if (!speed) continue;
    const key = normalizePlanKey(speed);
    const prev = bySpeed.get(key) || {};
    bySpeed.set(key, { ...prev, ...plan });
  }

  const order = [];
  const used = new Set();
  for (const plan of pricing) {
    const speed = String(plan.speed || "").trim();
    if (!speed) continue;
    const key = normalizePlanKey(speed);
    if (used.has(key)) continue;
    used.add(key);
    order.push(key);
  }
  for (const plan of home) {
    const speed = String(plan.speed || "").trim();
    if (!speed) continue;
    const key = normalizePlanKey(speed);
    if (used.has(key)) continue;
    used.add(key);
    order.push(key);
  }

  return order.map((k) => bySpeed.get(k)).filter(Boolean);
}

function smePlanKey(plan) {
  const speed = String(plan.speed || "").trim();
  const name = String(plan.name || "").trim();
  if (!speed) return "";
  const label = name ? `${speed} — ${name} (SME)` : `${speed} (SME)`;
  return normalizePlanKey(label);
}

/**
 * Union of home + pricing SME plans; pricing wins on duplicate keys.
 * Order: pricing list order, then home-only SME plans.
 */
export function mergeSmePlansForSite(homePlans, pricingPlans) {
  const home = Array.isArray(homePlans) ? homePlans : [];
  const pricing = Array.isArray(pricingPlans) ? pricingPlans : [];
  const byKey = new Map();

  for (const plan of home) {
    const key = smePlanKey(plan);
    if (!key) continue;
    if (!byKey.has(key)) {
      byKey.set(key, { ...plan });
    }
  }
  for (const plan of pricing) {
    const key = smePlanKey(plan);
    if (!key) continue;
    const prev = byKey.get(key) || {};
    byKey.set(key, { ...prev, ...plan });
  }

  const order = [];
  const used = new Set();
  for (const plan of pricing) {
    const key = smePlanKey(plan);
    if (!key || used.has(key)) continue;
    used.add(key);
    order.push(key);
  }
  for (const plan of home) {
    const key = smePlanKey(plan);
    if (!key || used.has(key)) continue;
    used.add(key);
    order.push(key);
  }

  return order.map((k) => byKey.get(k)).filter(Boolean);
}
