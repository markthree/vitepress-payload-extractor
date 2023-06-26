import { join } from "path";
import { existsSync } from "fs";
import { murmurHash } from "ohash";
import { writeFile } from "fs/promises";

/**
 * Generic regular expressions
 */
export const regs = {
  tail: /<\/body>/,
  meta: /<script>(__VP_HASH_MAP__[\w\W]*?)<\/script>/,
};

/**
 * Extracting duplicate payloads of meta information after vitepress wrapping
 * @param {string} html html text
 * @param {string} outDir output folder for payload files
 * @link https://github.com/nuxt/nuxt/issues/14507
 * @example
 * ```ts
 * import { defineConfig } from "vitepress";
 * import { payloadExtraction } from "vitepress-payload-extractor";
 *
 * export default defineConfig({
 *  transformHtml(code, _, ctx) {
 *     return payloadExtraction(code, ctx.siteConfig.outDir);
 *  }
 * })
 * ```
 */
export function payloadExtraction(html: string, outDir: string) {
  const metaCode = html.match(regs.meta)?.[0] ?? "";
  if (!metaCode) {
    return html;
  }
  const text = metaCode.replace(regs.meta, "$1");
  const hash = murmurHash(text);
  const file = `payload_${hash}.js`;
  const filePath = join(outDir, file);
  const script = `<script src="/${file}"></script></body>`;

  if (!existsSync(filePath)) {
    writeFile(filePath, text); // await is not needed because it is not relevant to the following
  }
  return html.replace(metaCode, "").replace(regs.tail, script);
}
