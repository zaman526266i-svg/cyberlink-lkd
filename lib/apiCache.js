/** Shared cache headers for public read APIs (CDN + browser). */
export const PUBLIC_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};
