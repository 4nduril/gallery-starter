/*
 * InfoRecord (see: easyimage documentation)
 *
 * {
 *   path: string
 *   width: number
 *   height: number
 *   name: string
 * }
 *
 */

// resizeToHeightAndWriteImageWith :: easyimage -> number -> [string, string] -> Promise<InfoRecord>
export const resizeToHeightAndWriteImageWith =
  ({ info, resize }) =>
  (targetHeight) =>
    function resizeToHeightAndWriteImage([srcPath, dstPath]) {
      return info(srcPath)
        .then(convertDimensionsTo(targetHeight))
        .then(({ width, height }) =>
          resize({
            src: srcPath,
            dst: dstPath,
            height,
            width,
          }),
        );
    };

/**
 * Dimensions
 *
 * {
 *   width: number,
 *   height: number,
 * }
 */

// convertDimensionsTo :: number -> Dimensions -> Dimensions
export const convertDimensionsTo =
  (toHeight) =>
  ({ width, height }) => ({
    width: Math.round((toHeight * width) / height),
    height: toHeight,
  });
