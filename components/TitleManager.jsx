"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const TITLE_MAP = {
  "/": "Home",
  "/about": "About",
  "/articles": "Articles",
  "/btrc-tariff": "BTRC Tariff",
  "/connection": "New Connection",
  "/contact": "Contact",
  "/coverage": "Coverage",
  "/erp": "ERP",
  "/offers": "Offers",
  "/pay-bill": "Pay Bill",
  "/pay-service": "Pay Service",
  "/pricing": "Pricing",
  "/privacy": "Privacy Policy",
  "/refund": "Refund Policy",
  "/selfcare": "Selfcare",
  "/services": "Services",
  "/terms": "Terms & Conditions",
};

function formatSegment(segment) {
  return decodeURIComponent(segment)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function resolveTitle(pathname) {
  if (!pathname) return "Cyberlink";
  if (TITLE_MAP[pathname]) return `Cyberlink | ${TITLE_MAP[pathname]}`;

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "Cyberlink | Home";

  const label = segments.map(formatSegment).join(" | ");
  return `Cyberlink | ${label}`;
}

export default function TitleManager() {
  const pathname = usePathname();

  useEffect(() => {
    document.title = resolveTitle(pathname);
  }, [pathname]);

  return null;
}
