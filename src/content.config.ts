import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const publications = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/publications",
  }),

  schema: z.object({
    title: z.string(),

    authors: z.array(z.string()),

    year: z.number(),

    venue: z.string(),

    doi: z.string().optional(),

    hal: z.string().optional(),

    image: z.string().optional(),


    /* =========================
       COMPARAISON 2 IMAGES
       ========================= */

    comparison: z
  .array(
    z.object({
      src: z.string(),
      alt: z.string(),
    })
  )
  .optional(),

    /* =========================
       LABELS DES 2 IMAGES
       ========================= */
    comparisonLabels: z
  .array(z.string())
  .max(2)
  .optional(),

    /* =========================
       COMPARAISON 4 IMAGES
       ========================= */

    comparison4: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
        })
      )
      .max(4)
      .optional(),


    /* =========================
       LABELS DES 4 IMAGES
       ========================= */

    comparison4Labels: z
      .array(z.string())
      .max(4)
      .optional(),


    /* =========================
       GALLERY
       ========================= */

    gallery: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
        })
      )
      .optional(),
      
      
    /* =========================
   COMPARAISON 2 VIDÉOS
   ========================= */

videoComparison: z
  .object({
    videos: z
      .array(
        z.object({
          frames: z
            .array(
              z.object({
                src: z.string(),
                alt: z.string().optional(),
              })
            )
            .min(1),
        })
      )
      .length(2),

    labels: z
      .array(z.string())
      .max(2)
      .optional(),

    fps: z.number().optional(),
  })
  .optional(),
      
          /* =========================
       VISUALISATION 3D (.PLY)
       ========================= */
    plyViewer: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string().optional(),
          label: z.string().optional(),
          pointSize: z.number().optional(),
          color: z.string().optional(),
          backgroundColor: z.string().optional(),
          autoRotate: z.boolean().optional(),
        })
      )
      .optional(),
      
      /* =========================
   VISUALISATION 3D ANIMÉE (.PLY)
   ========================= */
	plyVideo: z
	  .object({
	    srcs: z.array(z.string()),
	    fps: z.number().optional(),
	    pointSize: z.number().optional(),
	    color: z.string().optional(),
	    backgroundColor: z.string().optional(),
	    autoRotate: z.boolean().optional(),
	    shading: z
	      .enum(["matcap", "standard"])
	      .optional(),
	    flatShading: z.boolean().optional(),
	  })
	  .optional(),
      
      
  }),
});


export const collections = {
  publications,
};
