"use client";

import { MasonryPhotoAlbum, Photo } from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "react-photo-album/masonry.css";
import "yet-another-react-lightbox/styles.css";
import { FunctionComponent, useState } from "react";

type GalleryProps = {
  photos: Array<Photo & { original: string }>;
  className?: string;
};

export const Gallery: FunctionComponent<GalleryProps> = ({
  photos,
  className,
}) => {
  const [currentSlide, setCurrentSlide] = useState(-1);
  return (
    <>
      <div className={className}>
        <MasonryPhotoAlbum
          photos={photos}
          onClick={({ index }) => setCurrentSlide(index)}
        />
      </div>
      <Lightbox
        open={currentSlide >= 0}
        index={currentSlide}
        slides={photos.map((photo) => ({ src: photo.original }))}
        close={() => setCurrentSlide(-1)}
      />
    </>
  );
};
