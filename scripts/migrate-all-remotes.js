'use strict';

const countries = ['ug', 'ke', 'tz', 'bi', 'zm', 'cd', 'gh'];
const STRAPI_BASE_URL = "https://committed-paradise-9b1cb948f5.strapiapp.com/api";

const ADMIN_API_TOKEN = "38407076ae86a84785f24e26dec2bf377ba485b5a0a8a2891b4b2068da2fc44a814d511cafb58e01779f6b6b805dc5ad58ddde06b3d2273cff6c2edbc9bf02adc0cb6e5a37149ec1e634e78af1101533056bf7a8db04ac251ea09a6f85ec87c13bea1fe5b7052d10ea6bcd2c17a4cc1eb98633c45e690c9d1506d85096af3bb5";

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function main() {
  for (const cc of countries) {
    console.log(`\n===========================================`);
    console.log(`Migrating Franchise Locations for [ ${cc.toUpperCase()} ]`);
    console.log(`===========================================`);

    const jsonUrl = `https://storage.googleapis.com/jibu-${cc}-store-locator/stores.json`;

    let features = [];
    try {
      const res = await fetch(jsonUrl);
      if (!res.ok) {
        console.warn(`[Skip] ❌ No valid stores.json found for ${cc} at ${jsonUrl} (${res.status})`);
        continue;
      }
      const data = await res.json();
      if (!data.features) {
        console.warn(`[Skip] ❌ Invalid GeoJSON structure for ${cc}.`);
        continue;
      }
      features = data.features;
      console.log(`[Success] Fetching ${features.length} locations from GeoJSON bucket...`);
    } catch (e) {
      console.warn(`[Skip] ❌ Fetch Error mapping bucket for ${cc}:`, e.message);
      continue;
    }

    let successCount = 0;

    for (const f of features) {
      if (f.geometry?.type !== 'Point' || !f.geometry.coordinates) continue;

      // Extract details
      const locName = f.properties.name || "Jibu Store";
      const locAddress = f.properties.description || f.properties.address || "";
      const locPhone = f.properties.phone || "";
      const locEmail = f.properties.email || "";

      // Convert [Lng, Lat] format to Strapi expected storage [Lat, Lng]
      const positionArr = [f.geometry.coordinates[1], f.geometry.coordinates[0]];

      const locationObj = {
        name: locName,
        address: locAddress,
        position: JSON.stringify(positionArr)
      };

      if (locPhone) locationObj.phone = locPhone;
      if (locEmail) locationObj.email = locEmail;

      const entryData = {
        locations: [locationObj] // Strapi repeatable components strictly expect arrays
      };

      const endpoint = `${STRAPI_BASE_URL}/${cc}s?status=published`;

      try {
        const postRes = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ADMIN_API_TOKEN}`
          },
          body: JSON.stringify({ data: entryData })
        });

        if (!postRes.ok) {
          const contentType = postRes.headers.get("content-type") || "";
          if (contentType.includes("text/html") || postRes.status === 503) {
             console.error(`\n[FATAL] Strapi instance suspended or offline (503). Aborting to prevent flooding...`);
             process.exit(1);
          }
          const errorText = await postRes.text();
          console.error(`  - ❌ Failed to create ${locName} in Strapi: ${postRes.status} ${errorText.slice(0, 100)}...`);
        } else {
          // const resData = await postRes.json();
          process.stdout.write('.'); // progress indicator instead of spammy logs
          successCount++;
        }

      } catch (err) {
        console.error(`  - ❌ Network Error creating ${locName}: ${err.message}`);
      }

      // Small delay to prevent API rate limiting issues on Strapi Cloud
      await delay(150);
    }

    console.log(`\n✅ Finished [ ${cc.toUpperCase()} ]: Successfully uploaded ${successCount} locations to Strapi!\n`);
  }

  console.log(`\n🎉 ALL COUNTRIES COMPLETED MIGRATION! 🎉\n`);
}

main();
