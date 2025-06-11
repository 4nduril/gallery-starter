import { join as pJoin, basename } from "path";
import { readdir, writeFile } from "fs/promises";
import easyimage from "easyimage";
import "dotenv/config";

import { sequentialMapToPromiseAllWith } from "../utils/sequentialMapToPromiseAllWith.mjs";
import { resizeToHeightAndWriteImageWith } from "../utils/resizeToHeightAndWriteImage.mjs";

// CONFIGURATION

const RAW_IMG_DIR = process.env.RAW_IMG_DIR;
const rawImgDir = RAW_IMG_DIR.startsWith("/")
  ? RAW_IMG_DIR
  : pJoin(import.meta.dirname, "..", RAW_IMG_DIR);
const OUTPUT_DIR = process.env.OUTPUT_DIR;
const galleryDataPath = pJoin(
  import.meta.dirname,
  "../public",
  process.env.GALLERY_DATA_PATH,
);

const LG_FILES_DIRNAME = "large";
const SM_FILES_DIRNAME = "thumbnails";

// END: CONFIGURATION

// Utility functions

// isFunction :: x -> boolean
const isFunction = (fn) => typeof fn === "function";

// filenameToPath :: string -> string -> string
const filenameToPath = (basePath) => (name) => pJoin(basePath, basename(name));

// mapToList :: [(a -> b)] -> a -> [b]
const mapToList =
  (...fns) =>
  (x) =>
    fns.map((fn) => fn(x));

// zip :: [[a], [b]] -> [[a, b]]
const zip = ([listA, listB]) =>
  listA.length > listB.length
    ? listA.map((entryA, idx) => [entryA, listB[idx]])
    : listB.map((entryB, idx) => [listA[idx], entryB]);

// Sub-functions

const log = (s) => () => console.log(s);

/*
 *
 * GalleryInput (see: react-grid-gallery documentation)
 *
 * {
 *   original: string
 *   src: string
 *   width: number
 *   height: number
 * }
 */

// fileInfoToGalleryInput :: string -> [InfoRecord, InfoRecord] -> GalleryInput
const fileInfoToGalleryInput =
  (outputDir) =>
  ([lgInfoRecord, smInfoRecord]) => {
    const filenameToLgPath = filenameToPath(pJoin(outputDir, LG_FILES_DIRNAME));
    const filenameToSmPath = filenameToPath(pJoin(outputDir, SM_FILES_DIRNAME));

    return {
      original: filenameToLgPath(lgInfoRecord.name),
      src: filenameToSmPath(smInfoRecord.name),
      width: smInfoRecord.width,
      height: smInfoRecord.height,
    };
  };

// getSourcePathsWith :: (string -> Promise<[string]>) -> string -> Promise<[string]>
const getSourcePathsWith = (readdir) => (inputDir) =>
  readdir(inputDir).then((list) => list.map(filenameToPath(inputDir)));

// convertFilesWith :: easyimage -> string -> [string] -> Promise<[[InfoRecord], [InfoRecord]]>
const convertFilesWith =
  (imgMethodProvider) => (outputDir) => (inputSrcList) => {
    // Check imgMethods
    const { resize, info } = imgMethodProvider;
    if (!isFunction(resize) || !isFunction(info)) {
      throw new Error(
        'Image method provider not sufficient. We need "resize" and "thumbnail".',
      );
    }

    // Create mappers
    const filenameToLgPath = filenameToPath(
      pJoin(import.meta.dirname, "../public", outputDir, LG_FILES_DIRNAME),
    );
    const filenameToSmPath = filenameToPath(
      pJoin(import.meta.dirname, "../public", outputDir, SM_FILES_DIRNAME),
    );

    // makeLgPathPair :: string -> [string, string]
    const makeLgPathPair = mapToList((x) => x, filenameToLgPath);
    // makeSmPathPair :: string -> [string, string]
    const makeSmPathPair = mapToList((x) => x, filenameToSmPath);

    const lgPathPairs = inputSrcList.map(makeLgPathPair);
    const smPathPairs = inputSrcList.map(makeSmPathPair);
    return Promise.all([
      sequentialMapToPromiseAllWith(
        resizeToHeightAndWriteImageWith(imgMethodProvider)(1280),
      )(lgPathPairs),
      sequentialMapToPromiseAllWith(
        resizeToHeightAndWriteImageWith(imgMethodProvider)(180),
      )(smPathPairs),
    ]);
  };

const getSourcePaths = getSourcePathsWith(readdir);
const convertFiles = convertFilesWith(easyimage);
const makeImageInfoSuitableForGallery = (data) =>
  zip(data).map(fileInfoToGalleryInput(OUTPUT_DIR));
const toJSON = (o) => JSON.stringify(o, null, 2);
const writeToDataFile = (dataString) => writeFile(galleryDataPath, dataString);

// Actual executing code

getSourcePaths(rawImgDir)
  .then(convertFiles(OUTPUT_DIR))
  .then(makeImageInfoSuitableForGallery)
  .then(toJSON)
  .then(writeToDataFile)
  .then(log("Ready"));
