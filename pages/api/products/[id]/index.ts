import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    const {
      query: { id, seller },
      session: { user },
    } = req;
    const purchaseProduct = await client.purchase.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        product: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    });
    const saleProduct = await client.sale.create({
      data: {
        user: {
          connect: {
            id: +seller.toString(),
          },
        },
        product: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    });
    await client.products.update({
      where: {
        id: +id.toString(),
      },
      data: {
        isSell: true,
      },
    });
    res.json({ ok: true, purchaseProduct, saleProduct });
  }
  if (req.method === "GET") {
    const {
      query: { id },
      session: { user },
    } = req;
    const product = await client.products.findUnique({
      where: {
        id: +id.toString(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        productReviews: {
          select: {
            createBy: {
              select: {
                name: true,
                avatar: true,
              },
            },
            review: true,
            score: true,
            created: true,
          },
        },
      },
    });
    const terms = product?.name.split(" ").map((word) => ({
      name: {
        contains: word,
      },
    }));
    const relatedProducts = await client.products.findMany({
      where: {
        OR: terms,
        AND: {
          id: {
            not: product?.id,
          },
        },
      },
      orderBy: {
        created: "desc",
      },
      take: 10,
    });
    const isLike = Boolean(
      await client.fav.findFirst({
        where: {
          productId: product?.id,
          userId: user?.id,
        },
        select: {
          id: true,
        },
      })
    );
    res.json({ ok: true, product, isLike, relatedProducts });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
