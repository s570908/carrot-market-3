import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      query: { page },
    } = req;
    const limit = 10;
    const products = await client.products.findMany({
      where: {
        isSell: false,
      },
      include: {
        _count: {
          select: {
            fav: true,
          },
        },
        fav: {
          select: {
            userId: true,
          },
        },
        user: {
          select: {
            id: true,
          },
        },
      },
      take: limit,
      skip: (+page - 1) * limit,
      orderBy: { created: "desc" },
    });
    const nextProducts = await client.products.findMany({
      where: {
        isSell: false,
      },
      include: {
        _count: {
          select: {
            fav: true,
          },
        },
        fav: {
          select: {
            userId: true,
          },
        },
        user: {
          select: {
            id: true,
          },
        },
      },
      take: limit,
      skip: (+page + 1 - 1) * limit,
      orderBy: { created: "desc" },
    });
    res.json({
      ok: true,
      products,
      nextProducts,
    });
  }
  if (req.method === "POST") {
    const {
      body: { name, price, description, photoId },
      session: { user },
    } = req;
    const products = await client.products.create({
      data: {
        image: photoId,
        name,
        price: +price,
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({
      ok: true,
      products,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
