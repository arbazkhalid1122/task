// Helper script to set up environment variables for Prisma
// This allows using different env vars for different environments

const fs = require('fs');
const path = require('path');

// Check for PRISMA_DATABASE_URL first (custom), then POSTGRES_PRISMA_URL (Vercel), then DATABASE_URL (local)
const databaseUrl = 
  process.env.PRISMA_DATABASE_URL || 
  process.env.POSTGRES_PRISMA_URL || 
  process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('⚠️  No database URL found. Set one of: PRISMA_DATABASE_URL, POSTGRES_PRISMA_URL, or DATABASE_URL');
  process.exit(0);
}

// Set POSTGRES_PRISMA_URL if it's not set (for Prisma schema)
if (!process.env.POSTGRES_PRISMA_URL) {
  process.env.POSTGRES_PRISMA_URL = databaseUrl;
}

console.log('✅ Database URL configured for Prisma');

