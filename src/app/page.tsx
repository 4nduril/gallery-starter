import { Gallery } from "@/components/Gallery";
import { PageHeader } from "@/components/PageHeader";
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
    <>
      <PageHeader />
      <main className="mt-8">
        <Gallery photos={photoData} className="mx-auto max-w-5xl" />
      </main>
    </>
  );
}
