import { PrismaClient } from "@prisma/client";
import hashPassword from "../app/shared/utils/hash-password";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Alfonso",
      email: "user@cargoclaro.com",
      password: await hashPassword("secretpass"),
      lastName: "Rojas",
      patentNumber: 349076,
    },
  });

  const anotherUser = await prisma.user.create({
    data: {
      name: "Juan",
      email: "anotheruser@cargoclaro.com",
      password: await hashPassword("secretpass"),
      lastName: "Perez",
      patentNumber: 349077,
    },
  });

  console.log(user);
  console.log(anotherUser);

  // const customsEntries = [
  //   {
  //     city: "Ciudad de México",
  //     latitude: 19.0326,
  //     longitude: -99.8332,
  //     users: {
  //       create: [
  //         {
  //           user: {
  //             connect: {
  //               id: user.id,
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     city: "Guadalajara",
  //     latitude: 20.3597,
  //     longitude: -104.3496,
  //     users: {
  //       create: [
  //         {
  //           user: {
  //             connect: {
  //               id: user.id,
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     city: "Monterrey",
  //     latitude: 25.2866142,
  //     longitude: -100.9161126,
  //     users: {
  //       create: [
  //         {
  //           user: {
  //             connect: {
  //               id: user.id,
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     city: "Tijuana",
  //     latitude: 32.5149469,
  //     longitude: -117.0382471,
  //     users: {
  //       create: [
  //         {
  //           user: {
  //             connect: {
  //               id: anotherUser.id,
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     city: "Cancún",
  //     latitude: 21.4619,
  //     longitude: -87.2515,
  //     users: {
  //       create: [
  //         {
  //           user: {
  //             connect: {
  //               id: anotherUser.id,
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     city: "Guanajuato",
  //     latitude: 20.5190145,
  //     longitude: -102.0673586,
  //     users: {
  //       create: [
  //         {
  //           user: {
  //             connect: {
  //               id: anotherUser.id,
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     city: "Subteniente López",
  //     latitude: 18.5037,
  //     longitude: -88.3051,
  //     users: {
  //       create: [
  //         {
  //           user: {
  //             connect: {
  //               id: anotherUser.id,
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   },
  // ];

  // customsEntries.forEach(async (entry) => {
  //   await prisma.custom.create({
  //     data: entry,
  //   });
  // });
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
