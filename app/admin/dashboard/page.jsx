"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, MapPin, Gift, UserCog, FileText, Package, CreditCard } from "lucide-react";

const modules = [
  {
    title: "New Applications",
    href: "/admin/dashboard/applications",
    icon: Users,
    key: "applications",
    accent: "text-blue-400",
  },
  {
    title: "Coverage Regions",
    href: "/admin/dashboard/coverage",
    icon: MapPin,
    key: "regions",
    accent: "text-green-400",
  },
  {
    title: "Offers",
    href: "/admin/dashboard/offers",
    icon: Gift,
    key: "offers",
    accent: "text-orange-400",
  },
  {
    title: "Managers",
    href: "/admin/dashboard/managers",
    icon: UserCog,
    key: "managers",
    accent: "text-cyan-400",
  },
  {
    title: "Packages",
    href: "/admin/dashboard/packages",
    icon: Package,
    key: "packages",
    accent: "text-amber-300",
  },
  {
    title: "Site Content",
    href: "/admin/dashboard/settings",
    icon: FileText,
    key: "contentFiles",
    accent: "text-fuchsia-400",
  },
  {
    title: "Payments",
    href: "/admin/dashboard/payments",
    icon: CreditCard,
    key: "payments",
    accent: "text-emerald-400",
  },
];

export default function DashboardPage() {
  const [counts, setCounts] = useState({ applications: 0, regions: 0, offers: 0, managers: 0, contentFiles: 0, packages: 0, payments: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [applicationsRes, coverageRes, offersRes, managersRes, contentRes, homeRes, pricingRes, paymentsRes] = await Promise.all([
          fetch("/api/apply", { cache: "no-store" }),
          fetch("/api/coverage", { cache: "no-store" }),
          fetch("/api/offers", { cache: "no-store" }),
          fetch("/api/admin/managers", { cache: "no-store" }),
          fetch("/api/admin/content", { cache: "no-store" }),
          fetch("/api/admin/content?key=home", { cache: "no-store" }),
          fetch("/api/admin/content?key=pricing", { cache: "no-store" }),
          fetch("/api/admin/payments", { cache: "no-store" }),
        ]);

        const [applications, coverage, offers, managers, content, homeData, pricingData, paymentsData] = await Promise.all([
          applicationsRes.json(),
          coverageRes.json(),
          offersRes.json(),
          managersRes.json(),
          contentRes.json(),
          homeRes.json(),
          pricingRes.json(),
          paymentsRes.json(),
        ]);

        const heroPackagesCount =
          homeData?.data?.content?.heroSlides?.find((slide) => slide.type === "packages")?.items?.length || 0;
        const pricingPlansCount =
          (pricingData?.data?.content?.regularPlans?.length || 0) +
          (pricingData?.data?.content?.smePlans?.length || 0);

        setCounts({
          applications: applications?.data?.length || 0,
          regions: coverage?.data?.regions?.length || 0,
          offers: offers?.data?.offers?.length || 0,
          managers: managers?.data?.length || 0,
          contentFiles: content?.data?.length || 0,
          packages: heroPackagesCount + pricingPlansCount,
          payments: paymentsData?.summary?.total || 0,
        });
      } catch {
        setCounts({ applications: 0, regions: 0, offers: 0, managers: 0, contentFiles: 0, packages: 0, payments: 0 });
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black">Dashboard Overview</h1>
        <p className="text-slate-400">Manage requests, coverage and campaigns from one place.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {modules.map((item) => {
          const Icon = item.icon;
          const count = counts[item.key];
          return (
            <Link
              key={item.href}
              href={item.href}
              className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] hover:border-orange-500/40 transition-all"
            >
              <div className="mb-4 bg-slate-800 w-14 h-14 flex items-center justify-center rounded-2xl">
                <Icon className={item.accent} />
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Total</p>
              <h2 className="text-4xl font-black mb-3">{count}</h2>
              <h3 className="text-lg font-bold">{item.title}</h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
