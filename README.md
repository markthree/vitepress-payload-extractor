# vitepress-payload-extractor

Extracting duplicate payloads of meta information after vitepress wrapping

<br />

This project has been `blocked`, because the `vitepress`
[1.0.0-beta.6](https://github.com/vuejs/vitepress/pull/2626) Supported
[metaChunk](https://github.com/vuejs/vitepress/pull/2626) option

<br />

## README 🦉

[简体中文](./README_CN.md) | English

<br />

## Motivation

Our team was using [vitepress](https://github.com/vuejs/vitepress) to build
large project documents, but as the number of documents grew, the meta
information payload of html pages became oversized, so I made this tool that
extracts the duplicate payload of pages and reduces the size of the package.

With it, our team's production documents went from `255MB` to `94.4MB`, which is
`37%` of the original size. If you are in the same dilemma, maybe you can try
this tool!

<br />

## Usage

### install

```shell
npm i vitepress-payload-extractor -D
```

### Configuration

Introduce the package in your `vitepress` configuration file

#### optimizeHtml

Extract duplicate meta information payloads during `vitepress` packaging and
compress `html`.

```ts
import { defineConfig } from "vitepress";
import { optimizeHtml } from "vitepress-payload-extractor";

export default defineConfig({
  transformHtml(code) {
    return optimizeHtml(code);
  },
});
```

---

#### payloadExtraction

Extract duplicate meta-message payloads during `vitepress` packaging process

```ts
// .vitepress/config.js
import { defineConfig } from "vitepress";
import { payloadExtraction } from "vitepress-payload-extractor";

export default defineConfig({
  transformHtml(code, _, ctx) {
    return payloadExtraction(code, ctx.siteConfig.outDir);
  },
});
```

<br />

#### minifyHtml

Compresses html and is compatible with vitepress

```ts
import { defineConfig } from "vitepress";
import { minifyHtml } from "vitepress-payload-extractor";

export default defineConfig({
  transformHtml(code) {
    return minifyHtml(code);
  },
});
```

<br />

## Inspiration

- [DreaMinder · nuxt-payload-extractor](https://github.com/DreaMinder/nuxt-payload-extractor)
- [nuxt · issue · Payload extraction support](https://github.com/nuxt/nuxt/issues/14507)

<br />

## License

Made with [markthree](https://github.com/markthree)

Published under [MIT License](./LICENSE).
