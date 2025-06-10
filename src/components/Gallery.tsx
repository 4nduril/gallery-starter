"use client";

import { MasonryPhotoAlbum } from "react-photo-album";
import "react-photo-album/masonry.css";
import photos from "../../public/data/grid-gallery-data.json";

export const Gallery = () => (
  <MasonryPhotoAlbum
    photos={photos}
    onClick={({ photo }) => console.log(photo.original)}
  />
);
