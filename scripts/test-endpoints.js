#!/usr/bin/env node

/**
 * Venus Hotel & SPA - Railway Strapi Endpoints Test
 * Tests all API endpoints on Railway deployment
 */

const RAILWAY_URL = "https://venus-strapi-backend-production.up.railway.app";

const endpoints = [
  { name: "Health Check", path: "/api/health" },
  { name: "Rooms", path: "/api/rooms" },
  { name: "SPA Services", path: "/api/spa-services" },
  { name: "Attractions", path: "/api/attractions" },
  { name: "Galleries", path: "/api/galleries" },
  { name: "Contact Pages", path: "/api/contact-pages" },
  { name: "Pages", path: "/api/pages" },
];

async function testEndpoint(endpoint) {
  try {
    const url = `${RAILWAY_URL}${endpoint.path}`;
    console.log(`🔍 Testing: ${endpoint.name}`);
    console.log(`   URL: ${url}`);

    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      const count = data.data ? data.data.length : 0;
      console.log(`   ✅ Status: ${response.status} - Found ${count} items`);

      if (count > 0 && data.data[0]) {
        const firstItem = data.data[0];
        const title =
          firstItem.title || firstItem.name || firstItem.id || "unnamed";
        console.log(`   📋 First item: ${title}`);
      }
    } else {
      console.log(
        `   ❌ Status: ${response.status} - ${
          data.error?.message || "Unknown error"
        }`
      );
    }

    console.log("");
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    console.log("");
  }
}

async function testAll() {
  console.log("🚀 Testing Railway Strapi Endpoints");
  console.log("===================================");
  console.log(`🌐 Base URL: ${RAILWAY_URL}`);
  console.log("");

  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log("🎉 Testing completed!");
  console.log(`🔗 Admin Panel: ${RAILWAY_URL}/admin`);
}

// Run if executed directly
if (require.main === module) {
  testAll().catch(console.error);
}

module.exports = { testAll };
