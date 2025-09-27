#!/usr/bin/env node

/**
 * Venus Hotel & SPA - Strapi to Firebase Migration Script
 * Migrates data from Strapi CMS to Firebase Firestore
 */

const admin = require("firebase-admin");
const fetch = require("node-fetch");

// Firebase configuration
const serviceAccount = require("./firebase-service-account.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "venus-hotel-spa",
});

const db = admin.firestore();

// Strapi API configuration
const STRAPI_URL = "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || "";

// Helper function to fetch data from Strapi
async function fetchStrapiData(endpoint) {
  try {
    const url = `${STRAPI_URL}/api/${endpoint}`;
    const headers = STRAPI_API_TOKEN
      ? {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        }
      : {};

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message);
    return [];
  }
}

// Helper function to transform Strapi data to Firestore format
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

// Migration functions for each collection
async function migrateRooms() {
  console.log("🛏️  Migrating rooms...");
  const rooms = await fetchStrapiData("rooms?populate=*");
  const transformedRooms = transformStrapiData(rooms, "room");

  for (const room of transformedRooms) {
    try {
      await db.collection("rooms").doc(room.id.toString()).set(room);
      console.log(`✅ Room migrated: ${room.name || room.id}`);
    } catch (error) {
      console.error(`❌ Error migrating room ${room.id}:`, error.message);
    }
  }
  console.log(`🎉 Migrated ${transformedRooms.length} rooms`);
}

async function migrateSpaServices() {
  console.log("💆 Migrating spa services...");
  const services = await fetchStrapiData("spa-services?populate=*");
  const transformedServices = transformStrapiData(services, "spa-service");

  for (const service of transformedServices) {
    try {
      await db
        .collection("spa-services")
        .doc(service.id.toString())
        .set(service);
      console.log(`✅ Spa service migrated: ${service.name || service.id}`);
    } catch (error) {
      console.error(
        `❌ Error migrating spa service ${service.id}:`,
        error.message
      );
    }
  }
  console.log(`🎉 Migrated ${transformedServices.length} spa services`);
}

async function migrateAttractions() {
  console.log("🎡 Migrating attractions...");
  const attractions = await fetchStrapiData("attractions?populate=*");
  const transformedAttractions = transformStrapiData(attractions, "attraction");

  for (const attraction of transformedAttractions) {
    try {
      await db
        .collection("attractions")
        .doc(attraction.id.toString())
        .set(attraction);
      console.log(
        `✅ Attraction migrated: ${attraction.name || attraction.id}`
      );
    } catch (error) {
      console.error(
        `❌ Error migrating attraction ${attraction.id}:`,
        error.message
      );
    }
  }
  console.log(`🎉 Migrated ${transformedAttractions.length} attractions`);
}

async function migrateGalleries() {
  console.log("📸 Migrating galleries...");
  const galleries = await fetchStrapiData("galleries?populate=*");
  const transformedGalleries = transformStrapiData(galleries, "gallery");

  for (const gallery of transformedGalleries) {
    try {
      await db.collection("galleries").doc(gallery.id.toString()).set(gallery);
      console.log(`✅ Gallery migrated: ${gallery.name || gallery.id}`);
    } catch (error) {
      console.error(`❌ Error migrating gallery ${gallery.id}:`, error.message);
    }
  }
  console.log(`🎉 Migrated ${transformedGalleries.length} galleries`);
}

async function migrateContactPages() {
  console.log("📞 Migrating contact pages...");
  const contactPages = await fetchStrapiData("contact-pages?populate=*");
  const transformedContactPages = transformStrapiData(
    contactPages,
    "contact-page"
  );

  for (const contactPage of transformedContactPages) {
    try {
      await db
        .collection("contact-pages")
        .doc(contactPage.id.toString())
        .set(contactPage);
      console.log(`✅ Contact page migrated: ${contactPage.id}`);
    } catch (error) {
      console.error(
        `❌ Error migrating contact page ${contactPage.id}:`,
        error.message
      );
    }
  }
  console.log(`🎉 Migrated ${transformedContactPages.length} contact pages`);
}

async function migratePages() {
  console.log("📄 Migrating pages...");
  const pages = await fetchStrapiData("pages?populate=*");
  const transformedPages = transformStrapiData(pages, "page");

  for (const page of transformedPages) {
    try {
      await db.collection("pages").doc(page.id.toString()).set(page);
      console.log(`✅ Page migrated: ${page.title || page.id}`);
    } catch (error) {
      console.error(`❌ Error migrating page ${page.id}:`, error.message);
    }
  }
  console.log(`🎉 Migrated ${transformedPages.length} pages`);
}

// Main migration function
async function migrateAll() {
  console.log("🚀 Starting Strapi to Firebase migration...");
  console.log("==========================================");

  try {
    // Check if Strapi is running
    const healthCheck = await fetch(`${STRAPI_URL}/api/health`);
    if (!healthCheck.ok) {
      throw new Error(
        "Strapi is not running. Please start Strapi first: npm run develop"
      );
    }
    console.log("✅ Strapi is running");

    // Run migrations
    await migrateRooms();
    await migrateSpaServices();
    await migrateAttractions();
    await migrateGalleries();
    await migrateContactPages();
    await migratePages();

    console.log("🎉 Migration completed successfully!");
    console.log("🌐 Your data is now in Firebase Firestore");
    console.log(
      "📊 Check Firebase Console: https://console.firebase.google.com/project/venus-hotel-spa/firestore"
    );
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateAll();
}

module.exports = {
  migrateAll,
  migrateRooms,
  migrateSpaServices,
  migrateAttractions,
  migrateGalleries,
  migrateContactPages,
  migratePages,
};
