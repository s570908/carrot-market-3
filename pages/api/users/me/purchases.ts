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
    query: { page },
  } = req;
  const limit = 10;
  const purchases = await client.purchase.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      product: {
        include: {
          fav: {
            where: {
              userId: user?.id,
            },
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
    take: limit,
    skip: (+page - 1) * limit,
  });
  const next = await client.purchase.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      product: {
        include: {
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
    take: limit,
    skip: (+page + 1 - 1) * limit,
  });
  res.json({
    ok: true,
    purchases,
    next,
  });
}

export default withApiSession(
  withHandler({ methods: ["GET"], handler, isPrivate: true })
);
