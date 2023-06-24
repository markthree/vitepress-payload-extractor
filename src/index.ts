import fg from "fast-glob";
import { readFile, writeFile } from "fs/promises";
import { murmurHash } from "ohash";
import { join } from "path";

/**
 * Extracting duplicate payloads of meta information after vitepress wrapping
 * @param {string} outDir vitepress final dist
 * @example
 * ```ts
 * import { defineConfig } from "vitepress"
 * import { payloadExtraction } from "vitepress-payload-extractor"
 *
 * export default defineConfig({
 *   async buildEnd(siteConfig) {
 *      await payloadExtraction(siteConfig.outDir)
 *   }
 * })
 * ```
 */
export async function payloadExtraction(outDir: string) {
  const htmls = await fg("**/*.html", {
    cwd: outDir,
    absolute: true,
    onlyFiles: true,
  });

  const html0 = htmls[0];

  const html0Text = await readFile(html0, { encoding: "utf-8" });

  const text = html0Text.match(/<script>(__VP_HASH_MAP__[\w\W]*)<\/script>/)
    ?.[0];

  if (text) {
    // hash 是为了防止 payload 改变，浏览器命中旧缓存
    // hash is to prevent the payload from changing and the browser from hitting the old cache
    const payloadFile = `payload_${murmurHash(text)}.js`;
    const payload = {
      text,
      path: join(outDir, payloadFile),
      scriptText: `<script src="/${payloadFile}"></script>`,
    };
    await writeFile(
      payload.path,
      payload.text.replace(/<script>([\w\W]*)<\/script>/, "$1"),
    );
    await Promise.all(htmls.map(async (path) => {
      const htmlText = await readFile(path, { encoding: "utf-8" });
      const newHtmlText = htmlText.replace(
        payload.text,
        payload.scriptText,
      );
      return writeFile(path, newHtmlText, { encoding: "utf8" });
    }));
  }
}
