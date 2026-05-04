export const CONTENT_FILES = [
  { key: "home", label: "Home Page" },
  { key: "about", label: "About Page" },
  { key: "pricing", label: "Pricing Page" },
  { key: "offers", label: "Offers Page" },
  { key: "coverage", label: "Coverage Page" },
  { key: "contact", label: "Contact Page" },
  { key: "payBill", label: "Pay Bill Page" },
  { key: "selfcare", label: "Selfcare Page" },
  { key: "articles", label: "Articles Page" },
  { key: "packages", label: "Connection Packages" },
  { key: "services", label: "Services Catalog" },
];

export function getContentFileByKey(key) {
  return CONTENT_FILES.find((item) => item.key === key) || null;
}

export function collectionNameForContentKey(key) {
  return `site_content_${key}`;
}
