import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    body,
    session: { user },
  } = req;
  const sellerChat = await client.sellerChat.create({
    data: {
      chatMsg: body.message,
      ChatRoom: {
        connect: {
          id: +id.toString(),
        },
      },
      createBy: {
        connect: {
          id: user?.id,
        },
      },
    },
  });

  res.json({ ok: true, sellerChat });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
