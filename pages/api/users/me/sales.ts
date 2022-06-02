import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    query: { page, limit },
  } = req;

  // client.record.findMany({
  //   where: {
  //     userId: user?.id,
  //     kind: "Fav",
  //   },
  // });
  const sales = await client.sale.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      product: {
        include: {
          fav: {
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              fav: true,
            },
          },
        },
      },
    },
    orderBy: {
      created: "desc",
    },
    take: +limit,
    skip: (+page - 1) * +limit,
  });
  const next = await client.sale.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      product: {
        include: {
          fav: {
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              fav: true,
            },
          },
        },
      },
    },
    orderBy: {
      created: "desc",
    },
    take: +limit,
    skip: (+page + 1 - 1) * +limit,
  });
  res.json({
    ok: true,
    sales,
    next,
  });
}

export default withApiSession(
  withHandler({ methods: ["GET"], handler, isPrivate: true })
);
