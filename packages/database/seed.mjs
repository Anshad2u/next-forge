import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const pages = [
  "Getting Started Guide",
  "API Documentation",
  "User Management",
  "Settings Overview",
  "Billing & Subscriptions",
  "Team Collaboration",
  "Security Best Practices",
  "Deployment Guide",
  "Analytics Dashboard",
  "Integration Tutorials",
];

for (const name of pages) {
  await prisma.page.create({ data: { name } });
  console.log("Created:", name);
}

await prisma.$disconnect();
console.log("Seed complete!");