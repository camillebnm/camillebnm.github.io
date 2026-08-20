import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  site: "https://camillebnm.github.io",
  base: "/",
  integrations: [
    mdx({
      processor: unified({
        remarkPlugins: [remarkMath],
        rehypePlugins: [
          [
            rehypeKatex,
            {
              macros: {
                "\\cS": "\\mathcal{S}",
                "\\cI": "\\mathcal{I}",
                "\\cJ": "\\mathcal{J}",
                "\\cH": "\\mathcal{H}",
                "\\cT": "\\mathcal{T}",

                "\\R": "\\mathbb{R}",

                "\\D": "\\mathbf{D}",
                "\\V": "\\mathbf{V}",
                "\\U": "\\mathbf{U}",
                "\\W": "\\mathbf{W}",
                "\\T": "\\mathbf{T}",
                "\\F": "\\mathbf{F}",

                "\\nulldiv": "\\textit{*NullDiv*}",
                "\\adadiv": "\\textit{*AdaDiv*}",

                "\\nise": "\\mathrm{NISE}",
                "\\insd": "\\mathrm{INSD}",
                "\\lipmlp": "\\mathrm{LipMLP}",

                "\\pS": "\\partial\\mathcal{S}",
              },
            },
          ],
        ],
      }),
    }),
  ],
});
