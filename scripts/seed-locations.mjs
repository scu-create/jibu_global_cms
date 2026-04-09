/**
 * Seeds franchise locations from stores.json into per-country Strapi collections.
 * 
 * Usage:
 *   STRAPI_URL=https://willing-smile-871b31522c.strapiapp.com \
 *   STRAPI_TOKEN=your_token \
 *   node scripts/seed-locations.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const STRAPI_URL = process.env.STRAPI_URL || 'https://willing-smile-871b31522c.strapiapp.com';
const TOKEN = process.env.STRAPI_TOKEN;

if (!TOKEN) {
  console.error('Set STRAPI_TOKEN env var');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

// Map country prefix to Strapi collection plural name
const countryMap = {
  'RW': 'rws',
  'UG': 'ugs',
  'KE': 'kes',
  'TZ': 'tzs',
  'BI': 'bis',
  'ZM': 'zms',
  'CD': 'cds',
  'GH': 'ghs',
  'DRCG': 'cds',  // DRC Goma stores use "DRCG" prefix
};

// Extract country code from storeid
function getCountryCode(storeid) {
  if (!storeid) return null;
  const id = storeid.trim().toUpperCase();
  // Check DRCG first (before generic two-letter match)
  if (id.startsWith('DRCG')) return 'CD';
  // Match first 2 letters
  const match = id.match(/^([A-Z]{2})/);
  return match ? match[1] : null;
}

// Load stores.json
const storesPath = resolve(__dirname, '../../jibu_new/src/data/stores.json');
let storeData;
try {
  storeData = JSON.parse(readFileSync(storesPath, 'utf-8'));
} catch (err) {
  console.error('Could not load stores.json from:', storesPath);
  console.error(err.message);
  process.exit(1);
}

console.log(`Loaded ${storeData.features.length} store locations from stores.json\n`);

// Group stores by country code
const grouped = {};
for (const feature of storeData.features) {
  const { storeid, name, phone, description } = feature.properties;
  const [lng, lat] = feature.geometry.coordinates; // GeoJSON is [lng, lat]
  
  const countryCode = getCountryCode(storeid);
  
  if (!countryCode || !countryMap[countryCode]) {
    // Only log truly unknown ones, not whitespace issues
    if (storeid && storeid.trim()) {
      console.log(`  Skipping: ${storeid?.trim()} (${name})`);
    }
    continue;
  }
  
  const pluralName = countryMap[countryCode];
  if (!grouped[pluralName]) grouped[pluralName] = [];
  
  grouped[pluralName].push({
    locations: {
      name: name || 'Unknown',
      address: description || '',
      position: `${lat},${lng}`,
      phone: phone || '',
      email: `info@jibuco.com`,  // Placeholder — Strapi email field can't be empty
    }
  });
}

// Print summary
console.log('\nStore counts by collection:');
for (const [collection, stores] of Object.entries(grouped)) {
  console.log(`  ${collection}: ${stores.length} locations`);
}

async function createEntry(pluralName, data) {
  const res = await fetch(`${STRAPI_URL}/api/${pluralName}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data }),
  });
  const json = await res.json();
  if (!res.ok) {
    console.error(`  FAIL ${pluralName}:`, json.error?.message || JSON.stringify(json));
    return null;
  }
  return json;
}

async function publishEntry(pluralName, documentId) {
  await fetch(`${STRAPI_URL}/api/${pluralName}/${documentId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }),
  });
}

// Seed each country
async function seedCountryLocations() {
  for (const [pluralName, stores] of Object.entries(grouped)) {
    console.log(`\n--- Seeding ${pluralName}: ${stores.length} locations ---`);
    
    let success = 0;
    let fail = 0;
    
    for (const store of stores) {
      const result = await createEntry(pluralName, store);
      if (result?.data?.documentId) {
        await publishEntry(pluralName, result.data.documentId);
        success++;
      } else {
        fail++;
      }
      
      // Progress indicator every 10 entries
      if ((success + fail) % 10 === 0) {
        process.stdout.write(`  Progress: ${success + fail}/${stores.length}\r`);
      }
    }
    
    console.log(`  Result: ${success} created, ${fail} failed           `);
  }
}

async function main() {
  console.log('\nSeeding franchise locations into Strapi...');
  
  try {
    const health = await fetch(`${STRAPI_URL}/_health`);
    if (health.status > 299) throw new Error(`Status ${health.status}`);
  } catch (err) {
    console.error('Cannot reach Strapi at', STRAPI_URL, '-', err.message);
    process.exit(1);
  }
  console.log('Strapi is reachable\n');
  
  await seedCountryLocations();
  console.log('\nDone! All franchise locations seeded.');
}

main().catch(console.error);
