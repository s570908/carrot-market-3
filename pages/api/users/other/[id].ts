import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import products from "pages/api/products";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
  } = req;
  const other = await client.user.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
      sale: {
        where: {
          userId: +id.toString(),
        },
        select: {
          product: {
            select: {
              id: true,
              userId: true,
              image: true,
              name: true,
              price: true,
              productReviews: {
                select: {
                  score: true,
                },
              },
            },
          },
        },
        orderBy: {
          created: "desc",
        },
        take: 10,
      },
    },
  });
  res.json({
    ok: true,
    other,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
