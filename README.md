# Gallery starter

## Make a new gallery

1. Clone the repo.
2. Run `npm install`.
3. Create a bucket in DigitalOcean Spaces.
4. Create an access key for that bucket.
5. Create a `.env` file in the root of the project with the following content:
   ```
   RAW_IMG_DIR="raw-imgs"
   IMAGE_DATA_OUTPUT_DIR="/images"
   GALLERY_DATA_NAME="grid-gallery-data.json"
   DO_SPACES_KEY=your_access_key
   DO_SPACES_SECRET=your_secret_key
   DO_SPACES_BUCKET=your_bucket_name
   DO_SPACES_REGION="your_region" # e.g. "nyc3", "ams3", etc.
   PHOTO_BASE_URL=https://$DO_SPACES_BUCKET_NAME.$DO_SPACES_REGION.digitaloceanspaces.com
   ```
   Optionally add
   ```
   PAGE_TITLE=Your Gallery Title
   PAGE_DESCRIPTION=Your Gallery Description
   ```
6. Create a folder inside the root named `raw-imgs` and add all images there.
7. Run `npm run build:images:create`.
8. Run `npm run build:images:upload`.
