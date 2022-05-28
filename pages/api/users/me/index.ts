import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const profile = await client.user.findUnique({
    where: { id: req.session.user?.id },
    include: {
      fav: {
        select: {
          id: true,
          productId: true,
        },
      },
    },
  });
  res.json({
    ok: true,
    profile,
  });
}

export default withApiSession(
  withHandler({ methods: ["GET"], handler, isPrivate: true })
);
