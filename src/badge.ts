/**
 * Badge JSON creation for Shields endpoint badges.
 */

export interface BadgeJson {
  schemaVersion: 1;
  label: string;
  message: string;
  color: string;
  isError?: true;
}

export interface PreprintMeta {
  doi: string;
  version?: string;
}

export interface PublishedMeta {
  doi: string;
  publishedDoi?: string;
  publishedJournal?: string;
}

const BIORXIV_RED = "B31B1B";
const PUBLISHED_GREEN = "2E8B57";

export function makePreprintBadge(meta?: PreprintMeta): BadgeJson {
  const message =
    meta?.version && meta.version !== "1"
      ? `preprint v${meta.version}`
      : "preprint";

  return {
    schemaVersion: 1,
    label: "bioRxiv",
    message,
    color: BIORXIV_RED,

  };
}

export function makePublishedBadge(meta: PublishedMeta): BadgeJson {
  const message =
    meta.publishedJournal
      ? truncate(`published in ${meta.publishedJournal}`, 40)
      : "published";

  return {
    schemaVersion: 1,
    label: "bioRxiv",
    message,
    color: PUBLISHED_GREEN,

  };
}

export function makeErrorBadge(message = "not found"): BadgeJson {
  return {
    schemaVersion: 1,
    label: "bioRxiv",
    message,
    color: "red",
    isError: true,

  };
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 1) + "\u2026" : str;
}
