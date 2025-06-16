"use client";

import { MasonryPhotoAlbum, Photo } from "react-photo-album";
import "react-photo-album/masonry.css";
import { FunctionComponent } from "react";

type GalleryProps = {
  photos: Array<Photo & { original: string }>;
};

export const Gallery: FunctionComponent<GalleryProps> = ({ photos }) => {
  return (
    <MasonryPhotoAlbum
      photos={photos}
      onClick={({ photo }) => console.log(photo.original)}
    />
  );
};
