import { PrismaClient } from "./generated/client";

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

const pages = [
  { name: "Getting Started Guide" },
  { name: "API Documentation" },
  { name: "User Management" },
  { name: "Settings Overview" },
  { name: "Billing & Subscriptions" },
  { name: "Team Collaboration" },
  { name: "Security Best Practices" },
  { name: "Deployment Guide" },
  { name: "Analytics Dashboard" },
  { name: "Integration Tutorials" },
];

for (const page of pages) {
  await prisma.page.create({ data: page });
  console.log(`Created: ${page.name}`);
}

await prisma.$disconnect();
console.log("Seed complete!");