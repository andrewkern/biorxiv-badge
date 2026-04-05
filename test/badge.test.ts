import { describe, it, expect } from "vitest";
import {
  makePreprintBadge,
  makePublishedBadge,
  makeErrorBadge,
} from "../src/badge.js";
import { buildMarkdownSnippet } from "../src/generate.js";

describe("makePreprintBadge", () => {
  it("creates a default preprint badge", () => {
    const badge = makePreprintBadge({ doi: "10.1101/123", version: "1" });
    expect(badge.schemaVersion).toBe(1);
    expect(badge.label).toBe("bioRxiv");
    expect(badge.message).toBe("preprint");
    expect(badge.color).toBe("B31B1B");

  });

  it("includes version when > 1", () => {
    const badge = makePreprintBadge({ doi: "10.1101/123", version: "3" });
    expect(badge.message).toBe("preprint v3");
  });

  it("handles no meta", () => {
    const badge = makePreprintBadge();
    expect(badge.message).toBe("preprint");
    expect(badge.color).toBe("B31B1B");
  });
});

describe("makePublishedBadge", () => {
  it("creates a basic published badge", () => {
    const badge = makePublishedBadge({ doi: "10.1101/123" });
    expect(badge.schemaVersion).toBe(1);
    expect(badge.label).toBe("bioRxiv");
    expect(badge.message).toBe("published");
    expect(badge.color).toBe("2E8B57");

  });

  it("includes journal name when available", () => {
    const badge = makePublishedBadge({
      doi: "10.1101/123",
      publishedJournal: "eLife",
    });
    expect(badge.message).toBe("published in eLife");
  });

  it("truncates long journal names", () => {
    const badge = makePublishedBadge({
      doi: "10.1101/123",
      publishedJournal: "Journal of Very Long Named Scientific Research Papers",
    });
    expect(badge.message.length).toBeLessThanOrEqual(40);
  });
});

describe("makeErrorBadge", () => {
  it("creates an error badge with default message", () => {
    const badge = makeErrorBadge();
    expect(badge.schemaVersion).toBe(1);
    expect(badge.label).toBe("bioRxiv");
    expect(badge.message).toBe("not found");
    expect(badge.color).toBe("red");
    expect(badge.isError).toBe(true);

  });

  it("accepts a custom error message", () => {
    const badge = makeErrorBadge("API error");
    expect(badge.message).toBe("API error");
    expect(badge.isError).toBe(true);
  });
});

describe("buildMarkdownSnippet", () => {
  it("generates valid markdown badge link", () => {
    const md = buildMarkdownSnippet(
      "10.1101__2026.01.01.123456",
      "10.1101/2026.01.01.123456",
      "https://user.github.io/biorxiv-badge",
    );

    expect(md).toContain("[![bioRxiv]");
    expect(md).toContain("img.shields.io/endpoint");
    expect(md).toContain("https://doi.org/10.1101/2026.01.01.123456");
    expect(md).toContain(encodeURIComponent("https://user.github.io/biorxiv-badge/badges/10.1101__2026.01.01.123456.json"));
  });
});
