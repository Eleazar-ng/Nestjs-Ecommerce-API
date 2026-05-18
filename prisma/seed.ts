import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { encrypt } from "../src/utils/hash";



const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL
  })
});

async function main() {
  console.log('Seeding...');

  const superAdmin = await prisma.user.upsert({
    where: {
      email: "superadmin@store.com"
    },
    update: {},
    create: {
      email: "superadmin@store.com",
      password: await encrypt("Superadmin01$"),
      firstName: "Super",
      lastName: 'Admin',
    }
  })

  const admin = await prisma.user.upsert({
  where: {
    email: "admin@store.com"
  },
  update: {},
  create: {
    email: "admin@store.com",
    password: await encrypt("Admin001$"),
    firstName: "Admin",
    lastName: "Doe"
  }
})

console.log(`\n *************** Seed data inserted successfully ************ \n 1. ${superAdmin.email} \n 2. ${admin.email}`)
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });