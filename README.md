# Gallery starter

## Make a new gallery

1. Clone the repo.
2. Run `npm install`.
3. Create a folder inside the root named `raw-imgs` and add all images there.
4. Run `npm run build:images`.
5. Create a bucket in DigitalOcean Spaces.
6. Create an access key for that bucket.
7. Create a `.env` file in the root of the project with the following content:
   ```
   RAW_IMG_DIR="raw-imgs"
   OUTPUT_DIR="/images"
   GALLERY_DATA_PATH="/data/grid-gallery-data.json"
   DO_SPACES_KEY=your_access_key
   DO_SPACES_SECRET=your_secret_key
   DO_SPACES_BUCKET=your_bucket_name
   ```
