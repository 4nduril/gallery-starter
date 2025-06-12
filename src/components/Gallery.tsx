"use client";

import { MasonryPhotoAlbum } from "react-photo-album";
import "react-photo-album/masonry.css";
import photos from "../../image-data/grid-gallery-data.json";
import { FunctionComponent } from "react";

type GalleryProps = {
  photoBaseUrl: string;
};

export const Gallery: FunctionComponent<GalleryProps> = ({ photoBaseUrl }) => {
  if (!photos || photos.length === 0) {
    return <div>No photos available</div>;
  }
  const photoData = photos.map((photo) => ({
    ...photo,
    src: `${photoBaseUrl}/${photo.src}`,
    original: `${photoBaseUrl}/${photo.original}`,
  }));

  return (
    <MasonryPhotoAlbum
      photos={photoData}
      onClick={({ photo }) => console.log(photo.original)}
    />
  );
};
