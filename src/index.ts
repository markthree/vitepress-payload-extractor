import { join } from "path";
import { existsSync } from "fs";
import { murmurHash } from "ohash";
import { writeFile } from "fs/promises";
import htmlMinifier from "html-minifier";

/**
 * Generic regular expressions
 */
export const regs = {
  tail: /<\/body>/,
  meta: /<script>(__VP_HASH_MAP__[\w\W]*?)<\/script>/,
};

/**
 * Extract duplicate meta-message payloads during `vitepress` packaging process
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

/**
 * Compresses html and is compatible with `vitepress`
 * @param {string} html
 * @link https://github.com/kangax/html-minifier
 * @example
 * ```ts
 * import { defineConfig } from "vitepress";
 * import { minifyHtml } from "vitepress-payload-extractor";
 *
 * export default defineConfig({
 *  transformHtml(code) {
 *     return minifyHtml(code);
 *  }
 * })
 * ```
 */
export function minifyHtml(html: string) {
  return htmlMinifier.minify(html, {
    html5: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
    caseSensitive: true,
    keepClosingSlash: true,
    collapseWhitespace: true,
    trimCustomFragments: true,
    conservativeCollapse: true,
    removeAttributeQuotes: true,
    removeRedundantAttributes: true,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: false,
  });
}

/**
 * Extract html payload and compress html
 * @param {string} html
 * @param {string} dist
 * @example
 * ```ts
 * import { defineConfig } from "vitepress";
 * import { optimizeHtml } from "vitepress-payload-extractor";
 *
 * export default defineConfig({
 *  transformHtml(code, _, ctx) {
 *     return optimizeHtml(code, ctx.siteConfig.outDir);
 *  }
 * })
 * ```
 */
export async function optimizeHtml(html: string, dist: string) {
  // Extract duplicate html payloads first, then html compression
  return minifyHtml(payloadExtraction(html, dist));
}
