import { defineConfig } from "vitepress";
import { optimizeHtml } from "vitepress-payload-extractor";

export default defineConfig({
  transformHtml(code, _, ctx) {
    return optimizeHtml(code, ctx.siteConfig.outDir);
  },
});
