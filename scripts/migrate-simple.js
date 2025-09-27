#!/usr/bin/env node

/**
 * Venus Hotel & SPA - Simple Strapi to Firebase Migration
 * Uses Firebase CLI instead of service account
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Configuration
const STRAPI_URL = "http://localhost:1337";
const OUTPUT_DIR = "./migration-data";

// Helper function to fetch data from Strapi
async function fetchStrapiData(endpoint) {
  try {
    const url = `${STRAPI_URL}/api/${endpoint}`;
    console.log(`📡 Fetching: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error(`❌ Error fetching ${endpoint}:`, error.message);
    return [];
  }
}

// Helper function to transform Strapi data
function transformStrapiData(data, type) {
  if (Array.isArray(data)) {
    return data.map((item) => transformStrapiData(item, type));
  }

  const transformed = {
    id: data.id?.toString() || data.id,
    createdAt: data.attributes?.createdAt || new Date().toISOString(),
    updatedAt: data.attributes?.updatedAt || new Date().toISOString(),
    publishedAt: data.attributes?.publishedAt || new Date().toISOString(),
  };

  // Transform attributes
  if (data.attributes) {
    Object.keys(data.attributes).forEach((key) => {
      if (key !== "createdAt" && key !== "updatedAt" && key !== "publishedAt") {
        const value = data.attributes[key];

        // Handle rich text content
        if (typeof value === "object" && value?.type === "doc") {
          transformed[key] = JSON.stringify(value);
        }
        // Handle image fields
        else if (typeof value === "object" && value?.data) {
          if (Array.isArray(value.data)) {
            transformed[key] = value.data.map((img) => ({
              id: img.id,
              url: img.attributes?.url || "",
              name: img.attributes?.name || "",
              formats: img.attributes?.formats || {},
            }));
          } else {
            transformed[key] = {
              id: value.data.id,
              url: value.data.attributes?.url || "",
              name: value.data.attributes?.name || "",
              formats: value.data.attributes?.formats || {},
            };
          }
        }
        // Handle regular fields
        else {
          transformed[key] = value;
        }
      }
    });
  }

  return transformed;
}

// Migration functions
async function migrateCollection(collectionName, endpoint) {
  console.log(`🔄 Migrating ${collectionName}...`);

  const data = await fetchStrapiData(endpoint);
  const transformedData = transformStrapiData(data, collectionName);

  if (transformedData.length === 0) {
    console.log(`⚠️  No ${collectionName} found in Strapi`);
    return;
  }

  // Save to JSON file
  const outputFile = path.join(OUTPUT_DIR, `${collectionName}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(transformedData, null, 2));

  console.log(
    `✅ ${collectionName}: ${transformedData.length} items saved to ${outputFile}`
  );

  // Create Firestore import file
  const firestoreFile = path.join(
    OUTPUT_DIR,
    `firestore-${collectionName}.json`
  );
  const firestoreData = {};

  transformedData.forEach((item) => {
    firestoreData[item.id] = item;
  });

  fs.writeFileSync(firestoreFile, JSON.stringify(firestoreData, null, 2));
  console.log(`📊 Firestore format saved to ${firestoreFile}`);
}

// Main migration function
async function migrateAll() {
  console.log("🚀 Starting Strapi to Firebase migration...");
  console.log("==========================================");

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    // Check if Strapi is running
    console.log("🔍 Checking if Strapi is running...");
    const healthCheck = await fetch(`${STRAPI_URL}/api/attractions`);
    if (!healthCheck.ok) {
      throw new Error(
        "Strapi is not running. Please start Strapi first: cd backend && npm run develop"
      );
    }
    console.log("✅ Strapi is running");

    // Migrate all collections
    await migrateCollection("rooms", "rooms?populate=*");
    await migrateCollection("spa-services", "spa-services?populate=*");
    await migrateCollection("attractions", "attractions?populate=*");
    await migrateCollection("galleries", "galleries?populate=*");
    await migrateCollection("contact-pages", "contact-pages?populate=*");
    await migrateCollection("pages", "pages?populate=*");

    console.log("\n🎉 Migration completed successfully!");
    console.log("📁 Data saved to ./migration-data/");
    console.log("\n📋 Next steps:");
    console.log(
      "1. Open Firebase Console: https://console.firebase.google.com/project/venus-hotel-spa/firestore"
    );
    console.log('2. Go to "Data" tab');
    console.log('3. Click "Start collection" for each collection');
    console.log("4. Import JSON files from ./migration-data/");
    console.log("\n📊 Or use Firebase CLI to import:");
    console.log("firebase firestore:import ./migration-data");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateAll();
}

module.exports = { migrateAll };
