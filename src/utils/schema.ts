import { z } from "zod/v4";

if (!process.env.PHOTO_BASE_URL) {
  throw new Error(
    "PHOTO_BASE_URL is not defined in the environment variables.",
  );
}

export const photoSchema = z.object({
  original: z.string(),
  src: z.string(),
  width: z.number(),
  height: z.number(),
});

const photoBaseUrl = process.env.PHOTO_BASE_URL;

export const gallerySchema = z.array(photoSchema);
export const galleryTransform = gallerySchema.transform((photos) =>
  photos.map((photo) => ({
    ...photo,
    src: `${photoBaseUrl}/${photo.src}`,
    original: `${photoBaseUrl}/${photo.original}`,
  })),
);
