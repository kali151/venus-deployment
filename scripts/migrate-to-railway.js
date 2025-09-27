#!/usr/bin/env node

/**
 * Venus Hotel & SPA - Strapi Local to Railway Migration
 * Migrates data from local SQLite Strapi to Railway PostgreSQL Strapi
 */

const fs = require("fs");
const path = require("path");

// Configuration
const LOCAL_STRAPI_URL = "http://localhost:1337";
const RAILWAY_STRAPI_URL =
  "https://venus-strapi-backend-production.up.railway.app";
const OUTPUT_DIR = "./migration-data";

// You'll need to create API tokens in both Strapi instances
const LOCAL_TOKEN =
  "5d2224b149049b88ed5f7d58e29ad4e42eb678a0f60d57ccce0f5494be2958882417775e5127036e1baf50e1f2ef2dcae4f051911aeba4daf863adc5d5b834fe8f9ac4e800501edb8a7f8b01ac29e49e8483b16538cb09da4f8aa327468801b97438acc556f1da0499abd0b55d822a5f6b3988c43121a2ec7e7d0f3cd9feb860"; // Create in local Strapi Settings > API Tokens
const RAILWAY_TOKEN =
  "844a9efcbe6a20a8ade495fc29ed8611bb59a2c96135a1c34f4943e013c99dab3ef59ceaae67129f7a604e5bdeca75a9e46ce9adb291f53a46ea24018b651f0e2ad7250afa716b44994cac6c293b345c1a5e45becac4e8b5ebdf9b26f008637b45cd35e5ee0b3e13358e3fa6ce02649c368ad8fb84609f138b84ab703c5cf76b"; // Create in Railway Strapi Settings > API Tokens

// Helper function to fetch data from Strapi
async function fetchStrapiData(baseUrl, endpoint, token) {
  try {
    const url = `${baseUrl}/api/${endpoint}`;
    console.log(`📡 Fetching: ${url}`);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

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

// Helper function to post data to Railway Strapi
async function postToRailway(endpoint, data, token) {
  try {
    const url = `${RAILWAY_STRAPI_URL}/api/${endpoint}`;
    console.log(`📤 Posting to: ${url}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Error posting to ${endpoint}:`, error.message);
    return null;
  }
}

// Transform Strapi data for posting
function transformForPosting(item) {
  const transformed = {};

  // Copy all attributes except metadata and media fields
  Object.keys(item).forEach((key) => {
    if (
      ![
        "id",
        "documentId",
        "createdAt",
        "updatedAt",
        "publishedAt",
        "photos",
        "image",
      ].includes(key)
    ) {
      transformed[key] = item[key];
    }
  });

  return transformed;
}

// Migration function for a single collection
async function migrateCollection(collectionName, endpoint) {
  console.log(`🔄 Migrating ${collectionName}...`);

  // Fetch from local Strapi
  const localData = await fetchStrapiData(
    LOCAL_STRAPI_URL,
    `${endpoint}?populate=*`,
    LOCAL_TOKEN
  );

  if (localData.length === 0) {
    console.log(`⚠️  No ${collectionName} found in local Strapi`);
    return;
  }

  console.log(`📊 Found ${localData.length} ${collectionName} items`);

  // Transform and post each item to Railway
  let successCount = 0;
  for (const item of localData) {
    // Local data is already flat (no attributes wrapper)
    const transformedItem = transformForPosting(item);

    // Debug: show exact JSON being sent
    console.log(
      `🔍 Exact JSON being sent:`,
      JSON.stringify(transformedItem, null, 2).substring(0, 500)
    );

    const result = await postToRailway(
      endpoint,
      transformedItem,
      RAILWAY_TOKEN
    );

    if (result) {
      successCount++;
      console.log(
        `✅ Migrated ${collectionName} item: ${
          transformedItem.title || transformedItem.name || "unnamed"
        }`
      );
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(
    `🎉 ${collectionName}: ${successCount}/${localData.length} items migrated successfully`
  );
}

// Main migration function
async function migrateAll() {
  console.log("🚀 Starting Local Strapi to Railway migration...");
  console.log("=================================================");

  // Check tokens
  if (
    LOCAL_TOKEN === "your-local-strapi-token" ||
    RAILWAY_TOKEN === "your-railway-strapi-token"
  ) {
    console.error("❌ Please set your API tokens in the script!");
    console.log("\n📋 How to get API tokens:");
    console.log(
      "1. Local Strapi: http://localhost:1337/admin → Settings → API Tokens → Create new token"
    );
    console.log(
      "2. Railway Strapi: https://venus-strapi-backend-production.up.railway.app/admin → Settings → API Tokens → Create new token"
    );
    console.log("3. Set Token Type: 'Full access' and Duration: 'Unlimited'");
    process.exit(1);
  }

  try {
    // Check if local Strapi is running
    console.log("🔍 Checking if local Strapi is running...");
    const localHealthCheck = await fetch(`${LOCAL_STRAPI_URL}/api/rooms`);
    if (!localHealthCheck.ok) {
      throw new Error(
        "Local Strapi is not running. Please start: cd backend && npm run develop"
      );
    }
    console.log("✅ Local Strapi is running");

    // Check if Railway Strapi is accessible
    console.log("🔍 Checking Railway Strapi...");
    const railwayHealthCheck = await fetch(`${RAILWAY_STRAPI_URL}/api/health`);
    if (!railwayHealthCheck.ok) {
      throw new Error("Railway Strapi is not accessible");
    }
    console.log("✅ Railway Strapi is accessible");

    // Migrate all collections
    await migrateCollection("rooms", "rooms");
    await migrateCollection("spa-services", "spa-services");
    await migrateCollection("attractions", "attractions");
    await migrateCollection("galleries", "galleries");
    await migrateCollection("contact-pages", "contact-pages");
    await migrateCollection("pages", "pages");

    console.log("\n🎉 Migration completed successfully!");
    console.log("🌐 Check your Railway Strapi admin panel:");
    console.log("https://venus-strapi-backend-production.up.railway.app/admin");
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
