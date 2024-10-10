import { PrismaClient } from "@prisma/client";
import hashPassword from "../app/utils/hash-password";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: "user",
      email: "user@cargoclaro.com",
      password: await hashPassword("secretpass"),
      lastName: "name",
      patentNumber: 123456,
    },
  });
}

main()
  .then(() => {
    console.log("Seeding finished.");
  })
  .catch((e) => {
    console.error("Seeding error: ", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
