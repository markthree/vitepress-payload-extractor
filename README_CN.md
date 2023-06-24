# vitepress-payload-extractor

提取 vitepress 打包后重复的有效元信息载荷

<br />

## README 🦉

简体中文 | [English](./README.md)

<br />

## Motivation

我们团队正在使用 [vitepress](https://github.com/vuejs/vitepress)
来构建大型项目文档，但随着文档数量越来越多，html 页面的元信息 payload
也变得超大，所以我做了这个工具，它可以提取页面重复的 payload，减少包的体积。

通过它，我们团队生产环境下的文档从 `255MB` 降到了 `94.4MB`， 体积是原来的
`37%`。如果你也遇到了同样的窘境，也许你可以试试这个工具!

<br />

## Usage

### install

```shell
npm i vitepress-payload-extractor -D
```

### Configuration

在你的 `vitepress` 配置文件中引入包，并在 `buildEnd` 钩子中使用

```ts
// .vitepress/config.js
import { defineConfig } from "vitepress";
import { payloadExtraction } from "vitepress-payload-extractor";

export default defineConfig({
  async buildEnd(siteConfig) {
    await payloadExtraction(siteConfig.outDir); // 构建后，将自动提取，无需担心
  },
});
```

<br />

## 灵感来源

- [DreaMinder · nuxt-payload-extractor](https://github.com/DreaMinder/nuxt-payload-extractor)
- [nuxt · issue · Payload extraction support](https://github.com/nuxt/nuxt/issues/14507)

<br />

## License

Made with [markthree](https://github.com/markthree)

Published under [MIT License](./LICENSE).
