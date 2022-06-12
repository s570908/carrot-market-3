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
      chatMsg: body.chatMsg,
      ChatRoom: {
        connect: {
          id: +id.toString(),
        },
      },
      chatRoomId: +id.toString(),
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });

  res.json({ ok: true, sellerChat });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
