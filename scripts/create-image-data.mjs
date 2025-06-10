import { join as pJoin, basename } from "path";
import { readdir, writeFile } from "fs/promises";
import easyimage from "easyimage";

import { sequentialMapToPromiseAllWith } from "../utils/sequentialMapToPromiseAllWith.mjs";
import { resizeToHeightAndWriteImageWith } from "../utils/resizeToHeightAndWriteImage.mjs";

// CONFIGURATION

const RAW_IMG_DIR = pJoin(import.meta.dirname, "..", "raw-imgs");
const OUTPUT_DIR = "/public/images";
const LG_FILES_DIRNAME = "large";
const SM_FILES_DIRNAME = "thumbnails";
const GALLERY_CONFIG_PATH = pJoin(
  import.meta.dirname,
  "..",
  "/public/data/grid-gallery-data.json",
);
const absoluteOutputDir = pJoin(import.meta.dirname, "..", OUTPUT_DIR);

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
      original: filenameToLgPath(lgInfoRecord.name).replace("public/", ""),
      src: filenameToSmPath(smInfoRecord.name).replace("public/", ""),
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
    const filenameToLgPath = filenameToPath(pJoin(outputDir, LG_FILES_DIRNAME));
    const filenameToSmPath = filenameToPath(pJoin(outputDir, SM_FILES_DIRNAME));

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
const writeToDataFile = (dataString) =>
  writeFile(GALLERY_CONFIG_PATH, dataString);

// Actual executing code

getSourcePaths(RAW_IMG_DIR)
  .then(convertFiles(absoluteOutputDir))
  .then(makeImageInfoSuitableForGallery)
  .then(toJSON)
  .then(writeToDataFile)
  .then(log("Ready"));
