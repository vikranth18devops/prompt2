#!/bin/sh
set -e

echo "🚀 Starting AI Image Studio Container Entrypoint..."

if [ -n "$DATABASE_URL" ]; then
  echo "📦 Database URL detected. Synchronizing Prisma database schema..."
  npx prisma db push --skip-generate || echo "⚠️ Warning: DB Push skipped or already synchronized."
  echo "🌱 Seeding initial prompt categories and admin user..."
  npx prisma db seed || echo "⚠️ Warning: DB Seed skipped or already seeded."
fi

echo "🟢 Launching Next.js Application Server..."
exec node server.js
