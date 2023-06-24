# vitepress-payload-extractor

Extracting duplicate payloads of meta information after vitepress wrapping

<br />

## README 🦉

[简体中文](./README_CN.md) | English

<br />

## Motivation

Our team was using vitepress to build large project documents, but as the number
of documents grew, the meta-information payload of html pages became oversized,
so I made this tool which extracts the duplicate payload of pages and reduces
the size of the package.

With it, the documents in our team's production environment went from `255MB` to
`94.4MB`, which is `37%` of the original size. If you have encountered the same
problem, you are welcome to try it out!

<br />

## Usage

### install

```shell
npm i vitepress-payload-extractor -D
```

### Configuration

Introduce the package in your `vitepress` configuration file and use the
`buildEnd` hook in the

```ts
// .vitepress/config.js
import { defineConfig } from "vitepress";
import { payloadExtraction } from "vitepress-payload-extractor";

export default defineConfig({
  async buildEnd(siteConfig) {
    await payloadExtraction(siteConfig.outDir); // After build, it will be extracted automatically, no need to be careful
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
