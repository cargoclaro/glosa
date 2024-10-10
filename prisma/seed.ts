import { PrismaClient } from "@prisma/client";
import hashPassword from "../app/utils/hash-password";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: "user@cargoclaro.com",
      password: await hashPassword("secretpass"),
      name: "user",
      lastName: "name",
      position: "CEO",
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
