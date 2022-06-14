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
      body: { review, score },
    } = req;
    const writtenReview = await client.review.create({
      data: {
        review,
        score,
        createBy: {
          connect: {
            id: user?.id,
          },
        },
        createFor: {
          connect: {
            id: +seller.toString(),
          },
        },
        productFor: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    });
    res.json({ ok: true, writtenReview });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
