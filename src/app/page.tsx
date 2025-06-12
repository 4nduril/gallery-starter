import { Gallery } from "@/components/Gallery";

export default function Home() {
  if (!process.env.PHOTO_BASE_URL) {
    throw new Error(
      "PHOTO_BASE_URL is not defined in the environment variables.",
    );
  }
  return (
    <main>
      <Gallery photoBaseUrl={process.env.PHOTO_BASE_URL} />
    </main>
  );
}
