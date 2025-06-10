import { S3 } from "@aws-sdk/client-s3";

const client = new S3({
  forcePathStyle: false,
  endpoint: "fra1.digitaloceanspaces.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});
