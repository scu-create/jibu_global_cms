/**
 * Seed script for the NEW Strapi Cloud instance.
 * Only populates content that the frontend actively fetches.
 *
 * Usage:
 *   STRAPI_URL=https://willing-smile-871b31522c.strapiapp.com \
 *   STRAPI_TOKEN=your_api_token \
 *   node scripts/seed-cloud.mjs
 */

const STRAPI_URL = process.env.STRAPI_URL || 'https://exciting-cheese-7f9803973b.strapiapp.com';
const TOKEN = process.env.STRAPI_TOKEN;

if (!TOKEN) {
  console.error('Set STRAPI_TOKEN env var (create a Full Access token in Strapi admin)');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

// ─── Helpers ────────────────────────────────────────────────
async function createEntry(pluralName, data) {
  const res = await fetch(`${STRAPI_URL}/api/${pluralName}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data }),
  });
  const json = await res.json();
  if (!res.ok) {
    console.error(`  FAIL ${pluralName}:`, JSON.stringify(json.error || json, null, 2));
    return null;
  }
  console.log(`  OK Created ${pluralName}: ${data.Name || data.Question || '(entry)'}`);
  return json;
}

async function updateSingleType(singularName, data) {
  const res = await fetch(`${STRAPI_URL}/api/${singularName}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ data }),
  });
  const json = await res.json();
  if (!res.ok) {
    console.error(`  FAIL ${singularName}:`, JSON.stringify(json.error || json, null, 2));
    return null;
  }
  console.log(`  OK Updated single type: ${singularName}`);
  return json;
}

async function publishEntry(pluralName, documentId) {
  const res = await fetch(`${STRAPI_URL}/api/${pluralName}/${documentId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }),
  });
  if (!res.ok) {
    const json = await res.json();
    console.error(`  WARN Could not publish ${pluralName}/${documentId}:`, json.error?.message || '');
  }
}

async function publishSingleType(singularName) {
  const res = await fetch(`${STRAPI_URL}/api/${singularName}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }),
  });
  if (!res.ok) {
    const json = await res.json();
    console.error(`  WARN Could not publish ${singularName}:`, json.error?.message || '');
  }
}

// ─── 1. FRANCHISEES (Home page carousel) ────────────────────
// Note: Images will need to be added manually via Strapi admin.
// The Headshot field is a media upload - we create entries with Name & Location first.
const franchisees = [
  { Name: "Rehema Uwamahoro", Location: "Franchisee in Rwamagana, Rwanda" },
  { Name: "Dorcus", Location: "Franchisee in Buruburu, Kenya" },
  { Name: "Mediatrice Muvuna", Location: "Franchisee in Kinamba, Musanze, Nyagatare - Rwanda" },
  { Name: "Carol Mbabazi", Location: "Franchisee in Kicukiro & Sonatube, Rwanda" },
  { Name: "Ivan Ntabazi", Location: "Franchisee in Ggaba & Munyonyo, Uganda" },
  { Name: "Ian Odong", Location: "Franchisee in Ntinda, Uganda" },
  { Name: "Charity Wafula", Location: "Franchisee in Karen, Kenya" },
  { Name: "Rosine Uwamaharo", Location: "Franchisee in Nyamata & Gasogi 1, Rwanda" },
  { Name: "Aimee Kanyoni", Location: "Franchisee in Ville, Goma, DRC" },
  { Name: "Bahati Patient", Location: "Franchisee in Unigom, Goma, DRC" },
  { Name: "Eric Nsengimana", Location: "Franchisee in Virunga 2, Goma, DRC" },
  { Name: "Walter Opio", Location: "Franchisee in Najjanankumbi, Uganda" },
];

async function seedFranchisees() {
  console.log('\n--- Seeding Franchisees (12 entries) ---');
  for (const f of franchisees) {
    const result = await createEntry('franchisees', f);
    if (result?.data?.documentId) {
      await publishEntry('franchisees', result.data.documentId);
    }
  }
}

// ─── 2. COUNTRY SINGLE TYPES (Country pages) ───────────────
const countries = [
  {
    endpoint: 'rwanda',
    siteInfo: {
      country: 'Rwanda', countryCode: 'rw', center: '-1.9403,29.8739',
      phone: '+250 788 000 000', address: 'Kigali, Rwanda',
      facebook: 'https://www.facebook.com/JibuRwanda',
      instagram: 'https://www.instagram.com/jibuafrica',
      twitter: 'https://twitter.com/jibuafrica',
      linkedin: 'https://www.linkedin.com/company/jibu',
    },
  },
  {
    endpoint: 'uganda',
    siteInfo: {
      country: 'Uganda', countryCode: 'ug', center: '0.3476,32.5825',
      phone: '+256 700 000 000', address: 'Kampala, Uganda',
      facebook: 'https://www.facebook.com/JibuUganda',
      instagram: 'https://www.instagram.com/jibuafrica',
      twitter: 'https://twitter.com/jibuafrica',
      linkedin: 'https://www.linkedin.com/company/jibu',
    },
  },
  {
    endpoint: 'kenya',
    siteInfo: {
      country: 'Kenya', countryCode: 'ke', center: '-1.2921,36.8219',
      phone: '+254 700 000 000', address: 'Nairobi, Kenya',
      facebook: 'https://www.facebook.com/JibuKenya',
      instagram: 'https://www.instagram.com/jibuafrica',
      twitter: 'https://twitter.com/jibuafrica',
      linkedin: 'https://www.linkedin.com/company/jibu',
    },
  },
  {
    endpoint: 'tanzania',
    siteInfo: {
      country: 'Tanzania', countryCode: 'tz', center: '-6.7924,39.2083',
      phone: '+255 700 000 000', address: 'Dar es Salaam, Tanzania',
      facebook: 'https://www.facebook.com/JibuTanzania',
      instagram: 'https://www.instagram.com/jibuafrica',
      twitter: 'https://twitter.com/jibuafrica',
      linkedin: 'https://www.linkedin.com/company/jibu',
    },
  },
  {
    endpoint: 'burundi',
    siteInfo: {
      country: 'Burundi', countryCode: 'bi', center: '-3.3731,29.3644',
      phone: '+257 70 000 000', address: 'Bujumbura, Burundi',
      facebook: 'https://www.facebook.com/JibuBurundi',
      instagram: 'https://www.instagram.com/jibuafrica',
      twitter: 'https://twitter.com/jibuafrica',
      linkedin: 'https://www.linkedin.com/company/jibu',
    },
  },
  {
    endpoint: 'zambia',
    siteInfo: {
      country: 'Zambia', countryCode: 'zm', center: '-15.4167,28.2833',
      phone: '+260 97 000 0000', address: 'Lusaka, Zambia',
      facebook: 'https://www.facebook.com/JibuZambia',
      instagram: 'https://www.instagram.com/jibuafrica',
      twitter: 'https://twitter.com/jibuafrica',
      linkedin: 'https://www.linkedin.com/company/jibu',
    },
  },
  {
    endpoint: 'drc',
    siteInfo: {
      country: 'DRC', countryCode: 'cd', center: '-1.6577,29.2249',
      phone: '+243 99 000 0000', address: 'Goma, DRC',
      facebook: 'https://www.facebook.com/JibuDRC',
      instagram: 'https://www.instagram.com/jibuafrica',
      twitter: 'https://twitter.com/jibuafrica',
      linkedin: 'https://www.linkedin.com/company/jibu',
    },
  },
  {
    endpoint: 'ghana',
    siteInfo: {
      country: 'Ghana', countryCode: 'gh', center: '5.6037,-0.1870',
      phone: '+233 50 000 0000', address: 'Accra, Ghana',
      facebook: 'https://www.facebook.com/JibuGhana',
      instagram: 'https://www.instagram.com/jibuafrica',
      twitter: 'https://twitter.com/jibuafrica',
      linkedin: 'https://www.linkedin.com/company/jibu',
    },
  },
];

async function seedCountries() {
  console.log('\n--- Seeding Country Site Info (8 single types) ---');
  for (const c of countries) {
    const result = await updateSingleType(c.endpoint, { siteInfo: c.siteInfo });
    if (result) {
      await publishSingleType(c.endpoint);
    }
  }
}

// ─── 3. FAQs (FAQ page) ────────────────────────────────────
const faqs = [
  { Question: "What is Jibu?", Answer: "Jibu is a for-profit social enterprise that capitalizes, equips, and trains emerging market entrepreneurs to launch and grow essential service franchises, with drinking water as our anchor product." },
  { Question: "How does the Jibu franchise model work?", Answer: "Jibu provides franchisees with purification equipment, branded bottles, training, and ongoing support. Franchisees purify local water sources and sell affordable, safe drinking water to their communities." },
  { Question: "In which countries does Jibu operate?", Answer: "Jibu currently operates in 8 African countries: Uganda, Kenya, Rwanda, Tanzania, Burundi, Zambia, DRC (Democratic Republic of the Congo), and Ghana." },
  { Question: "Is Jibu water safe to drink?", Answer: "Yes. Jibu uses internationally accredited purification systems including ultrafiltration and blended RO-hybrid technology to consistently produce safe drinking water through a four-step filtration method." },
  { Question: "How can I become a Jibu franchisee?", Answer: "You can apply to become a franchisee by filling out the franchise application form on our website. We will review your application and get in touch to discuss the opportunity." },
  { Question: "What products does Jibu offer besides water?", Answer: "In addition to purified drinking water, Jibu franchisees sell other essential products including LPG (cooking gas) and fortified porridge, depending on the market." },
  { Question: "How much does it cost to start a Jibu franchise?", Answer: "Franchise costs vary by country and location. Please contact us or fill out the franchise application form for detailed pricing information for your desired location." },
  { Question: "What is Jibuntu?", Answer: "Jibuntu is Jibu's philanthropic initiative that extends the mission of delivering safe drinking water to underserved, low-income families who cannot afford water at ordinary prices. The name combines 'Jibu' and 'Ubuntu' (meaning 'I am because we are')." },
];

async function seedFaqs() {
  console.log('\n--- Seeding FAQs (8 entries) ---');
  for (const faq of faqs) {
    const result = await createEntry('faqs', faq);
    if (result?.data?.documentId) {
      await publishEntry('faqs', result.data.documentId);
    }
  }
}

// ─── RUN ────────────────────────────────────────────────────
async function main() {
  console.log('Seeding Strapi Cloud:', STRAPI_URL);
  console.log('Only populating content the frontend actively uses.\n');

  // Verify connection
  try {
    const health = await fetch(`${STRAPI_URL}/_health`);
    if (!health.ok) throw new Error(`Status ${health.status}`);
  } catch (err) {
    console.error('Cannot reach Strapi at', STRAPI_URL, '-', err.message);
    process.exit(1);
  }
  console.log('Strapi is reachable\n');

  await seedFranchisees();
  await seedCountries();
  await seedFaqs();

  console.log('\nDone! Content seeded successfully.');
  console.log('Next: Add Executives & Team Members manually in the Strapi admin.');
  console.log('Also: Add Headshot images to Franchisees manually in the admin.');
}

main().catch(console.error);
