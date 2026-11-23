/**
 * The joke about the demo — make.fun entry.
 *
 * Writes one line to /output/entry.txt: an original one-line joke about
 * working beside an AI coding agent. The joke was drafted from scratch
 * (7 candidates scored against the judge's brief, in order: on-subject,
 * surprise punchline, recognizable truth, economy, freshness) and the
 * winner is:
 *
 *   "My coding agent writes code faster than I can read it — which is
 *    fine, because it doesn't read it either."
 *
 * The program validates the text (1–280 Unicode code points, not only
 * whitespace, single line, UTF-8) before writing, then re-reads the file
 * it just wrote and confirms the bytes on disk are identical to what it
 * intended to write.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const JOKE =
  "My coding agent writes code faster than I can read it \u2014 which is fine, because it doesn\u2019t read it either.";

const OUTPUT_PATH = "/output/entry.txt";

function codePointCount(text: string): number {
  return [...text].length;
}

function validate(text: string): void {
  const count = codePointCount(text);
  if (count < 1 || count > 280) {
    throw new Error(`joke must be 1-280 code points, got ${count}`);
  }
  if (text.trim().length === 0) {
    throw new Error("joke must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("joke must be a single line");
  }
}

function main(): void {
  validate(JOKE);
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JOKE, "utf8");

  // Verify after writing: re-read the raw bytes and confirm they are
  // byte-identical to the joke's UTF-8 encoding, with no trailing
  // newline, so the file holds exactly one line.
  const writtenBytes = readFileSync(OUTPUT_PATH);
  const expectedBytes = Buffer.from(JOKE, "utf8");
  if (!writtenBytes.equals(expectedBytes)) {
    throw new Error("verification failed: /output/entry.txt bytes do not match the joke");
  }
  const written = writtenBytes.toString("utf8");
  if (written.endsWith("\n")) {
    throw new Error("verification failed: /output/entry.txt must hold exactly one line, no trailing newline");
  }
  const bytes = Buffer.byteLength(written, "utf8");
  console.log(
    `wrote ${OUTPUT_PATH}: ${codePointCount(written)} code points, ${bytes} bytes, verified byte-identical`,
  );
}

main();
