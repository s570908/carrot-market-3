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
    session: { user },
  } = req;
  const sellerChat = await client.sellerChat.findMany({
    where: {
      chatRoomId: +id.toString(),
    },
    include: {
      user: {
        select: {
          name: true,
          avatar: true,
        },
      },
    },
  });
  const seller = await client.chatRoom.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
      buyer: {
        select: {
          name: true,
          avatar: true,
        },
      },
      seller: {
        select: {
          name: true,
          avatar: true,
        },
      },
    },
  });
  res.json({ ok: true, sellerChat, seller });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
