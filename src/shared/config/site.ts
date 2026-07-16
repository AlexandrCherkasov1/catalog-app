const DEFAULT_SITE_URL = "https://catalog-app-next.netlify.app";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
).replace(/\/$/, "");

export function getAbsoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}