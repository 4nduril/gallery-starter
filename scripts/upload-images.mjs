import fs from "fs";
import path from "path";
import { S3, HeadBucketCommand } from "@aws-sdk/client-s3";
import mime from "mime-types";
import "dotenv/config";

const client = new S3({
  forcePathStyle: false,
  endpoint: "https://fra1.digitaloceanspaces.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});

const bucketExists = async (bucketName) => {
  try {
    await client.send(new HeadBucketCommand({ Bucket: bucketName }));
    return true; // Bucket exists and is accessible
  } catch (error) {
    if (error.name === "NotFound") {
      return false; // Bucket does not exist
    }
    if (error.name === "Forbidden") {
      // Bucket exists, but you don't have permission
      return true;
    }
    // Other unexpected errors
    console.error("Error checking bucket:", error);
    throw error;
  }
};

const uploadFolderRecursively = async (
  bucketName,
  folderPath,
  s3BaseKey = "",
) => {
  // withFileTypes is used to be able to call isFile and isDirectory on entries.
  const entries = await fs.promises.readdir(folderPath, {
    withFileTypes: true,
  });
  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);
    const s3Key = path.posix.join(s3BaseKey, entry.name);

    if (entry.isDirectory()) {
      await uploadFolderRecursively(bucketName, fullPath, s3Key);
    } else if (entry.isFile()) {
      const fileContent = await fs.promises.readFile(fullPath);
      await client.putObject({
        Bucket: bucketName,
        Key: s3Key,
        Body: fileContent,
        ContentType: mime.lookup(entry.name) || "application/octet-stream",
        ACL: "public-read", // Make the file publicly readable
      });
      console.log(`Uploaded ${s3Key}`);
    }
  }
};

if (!process.env.DO_SPACES_BUCKET_NAME) {
  throw new Error("DO_SPACES_BUCKET_NAME environment variable is not set.");
}

/*
 * Check if set bucket exists, if not, error out.
 * If it exists, create appropriate directories and upload images.
 */

bucketExists(process.env.DO_SPACES_BUCKET_NAME)
  .then((bucketExists) => {
    if (!bucketExists) {
      throw new Error(
        `Bucket ${process.env.DO_SPACES_BUCKET_NAME} does not exist.`,
      );
    }
  })
  .then(() => {
    console.log(
      `Uploading images to bucket: ${process.env.DO_SPACES_BUCKET_NAME}`,
    );
    return uploadFolderRecursively(
      process.env.DO_SPACES_BUCKET_NAME,
      path.join(process.cwd(), process.env.IMAGE_DATA_OUTPUT_DIR),
    );
  });
