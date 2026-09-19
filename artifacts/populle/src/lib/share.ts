export const SITE_URL = "https://populle.com";

export type ShareResult = "shared" | "copied" | "failed";

export interface SharePayload {
  title: string;
  text: string;
  url: string;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildCountryUrl(iso3: string): string {
  return `${SITE_URL}/country/${encodeURIComponent(iso3.toLowerCase())}`;
}

export function buildCityUrl(name: string): string {
  return `${SITE_URL}/city/${encodeURIComponent(slugify(name))}`;
}

export function buildStoryUrl(year: number): string {
  return `${SITE_URL}/story/${year}`;
}

export function buildQuizResultUrl(slug: string): string {
  return `${SITE_URL}/quiz?result=${encodeURIComponent(slugify(slug))}`;
}

export function buildContrastUrl(pair: string): string {
  return `${SITE_URL}/contrast?pair=${encodeURIComponent(slugify(pair))}`;
}

export async function shareOrCopy({
  title,
  text,
  url,
}: SharePayload): Promise<ShareResult> {
  const shareText = text ? `${text}\n${url}` : url;

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title, text, url });
      return "shared";
    } catch (err) {
      // User cancelled — treat as failed without falling through to clipboard noise
      if (err instanceof DOMException && err.name === "AbortError") {
        return "failed";
      }
    }
  }

  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareText);
      return "copied";
    }
  } catch {
    // fall through
  }

  return "failed";
}
