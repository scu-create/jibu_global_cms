'use strict';

const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');
const https = require('https');

const countries = ['rw', 'ke', 'ug', 'tz', 'zm', 'gh', 'bi', 'cd'];

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    });
  });
}

function getFileSizeInBytes(filePath) {
  const stats = fs.statSync(filePath);
  return stats['size'];
}

async function uploadFile(strapi, filePath, name) {
  const ext = path.extname(name);
  const mimeType = mime.lookup(ext || '') || 'application/octet-stream';
  const size = getFileSizeInBytes(filePath);

  const fileData = {
    filepath: filePath,
    originalFileName: name,
    size,
    mimetype: mimeType,
  };

  return strapi.plugin('upload').service('upload').upload({
    files: fileData,
    data: {
      fileInfo: {
        alternativeText: `Extracted WP Image ${name}`,
        caption: name,
        name,
      },
    },
  });
}

async function migrateImages(strapi) {
  for (const countryCode of countries) {
    console.log(`\n--- Fetching images for ${countryCode.toUpperCase()} ---`);
    const apiUrl = `https://jibuco.com/${countryCode}/wp-json/wp/v2/media?per_page=100`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        console.log(`Skipping ${countryCode}, API returned ${response.status}`);
        continue;
      }
      
      const mediaItems = await response.json();
      console.log(`Found ${mediaItems.length} images for ${countryCode}`);

      if (mediaItems.length === 0) continue;

      const uploadedFiles = [];

      for (const item of mediaItems) {
        if (!item.source_url) continue;
        const imageUrl = item.source_url;
        const fileName = path.basename(new URL(imageUrl).pathname);
        const tempPath = path.join(__dirname, '..', '.tmp', fileName);
        
        // Ensure .tmp exists
        await fs.ensureDir(path.join(__dirname, '..', '.tmp'));

        try {
          // Check if file with same name already exists in Strapi
          const existingFile = await strapi.query('plugin::upload.file').findOne({
            where: { name: fileName },
          });

          if (existingFile) {
            console.log(`[SKIPPED] ${fileName} already exists in Strapi`);
            uploadedFiles.push(existingFile);
            continue;
          }

          console.log(`Downloading ${fileName}...`);
          await downloadImage(imageUrl, tempPath);
          console.log(`Uploading ${fileName} to Strapi...`);
          const [uploadedFile] = await uploadFile(strapi, tempPath, fileName);
          uploadedFiles.push(uploadedFile);
          
          // Cleanup
          await fs.remove(tempPath);
        } catch (err) {
          console.error(`Error processing ${fileName}:`, err?.message);
        }
      }

      // Try to link these files to the corresponding SingleType country if it exists
      // The single types are typically full country names or codes. Let's see if there's a match.
      // Need to find which single type corresponds to this country code.
      // E.g. API ID might be "rwanda" for "rw". We'll do a quick map.
      const codeToName = {
        'rw': 'rwanda',
        'ke': 'kenya',
        'ug': 'uganda',
        'tz': 'tanzania',
        'zm': 'zambia',
        'gh': 'ghana',
        'bi': 'burundi',
        'cd': 'drc' // guessing
      };
      
      const modelName = codeToName[countryCode];
      if (modelName) {
        console.log(`Attempting to attach gallery to api::${modelName}.${modelName}`);
        try {
          const entry = await strapi.documents(`api::${modelName}.${modelName}`).findFirst({ populate: '*' });
          if (entry) {
            const siteInfo = entry.siteInfo || {};
            const existingGallery = siteInfo.gallery || [];
            
            // Append new images to existing gallery (avoiding duplicates)
            const existingGalleryIds = existingGallery.map(f => f.id);
            const newGalleryIds = [...existingGalleryIds];
            
            for (const f of uploadedFiles) {
              if (f && !existingGalleryIds.includes(f.id)) {
                newGalleryIds.push(f.id);
              }
            }
            
            await strapi.documents(`api::${modelName}.${modelName}`).update({
              documentId: entry.documentId,
              data: {
                siteInfo: {
                  ...siteInfo,
                  gallery: newGalleryIds
                }
              }
            });
            console.log(`Successfully updated ${modelName} gallery.`);
          } else {
             console.log(`No entry found for ${modelName}`);
          }
        } catch (err) {
            console.log(`Error updating ${modelName} with gallery:`, err?.message);
        }
      }

    } catch (error) {
      console.error(`Error fetching media for ${countryCode}:`, error?.message);
    }
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'error';

  console.log('Starting Image Migration...');
  await migrateImages(app);
  console.log('Migration Complete.');
  
  await app.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
