import { Gallery } from "@/components/Gallery";
import { galleryTransform } from "@/utils/schema";

export default async function Home() {
  const photoData = await fetch(
    `${process.env.PHOTO_BASE_URL}/grid-gallery-data.json`,
  )
    .then((res) => res.json())
    .catch((error) => {
      console.error("Error fetching photo data:", error);
      return [];
    })
    .then((data) => {
      return galleryTransform.parse(data);
    });
  return (
    <main>
      <Gallery photos={photoData} />
    </main>
  );
}
