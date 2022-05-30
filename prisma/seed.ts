import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function main() {
  [...Array.from(Array(30).keys())].forEach(async (item) => {
    // await client.stream.create({
    //   data: {
    //     name: String(item),
    //     description: String(item),
    //     price: item,
    //     user: {
    //       connect: {
    //         id: 1,
    //       },
    //     },
    //   },
    // });
    // await client.products.create({
    //   data: {
    //     image: "blabla",
    //     name: String(item),
    //     description: String(item),
    //     price: item,
    //     user: {
    //       connect: {
    //         id: 1,
    //       },
    //     },
    //   },
    // });
    await client.post.create({
      data: {
        question: String(item),
        latitude: 36.7809841,
        longitude: 126.9433485,
        user: {
          connect: {
            id: 1,
          },
        },
      },
    });
    console.log(`${item}/30`);
  });
}

main()
  .catch((e) => console.log(e))
  .finally(() => client.$disconnect);
