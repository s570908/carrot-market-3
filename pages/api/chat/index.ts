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
  } = req;
  const chatRoomList = await client.chatRoom.findMany({
    where: {
      OR: [{ user1Id: user?.id }, { user2Id: user?.id }],
    },
    include: {
      recentMsg: {
        select: {
          chatMsg: true,
        },
      },
      user1: {
        select: {
          name: true,
          avatar: true,
        },
      },
      user2: {
        select: {
          name: true,
          avatar: true,
        },
      },
    },
  });
  res.json({
    ok: true,
    chatRoomList,
  });
}

export default withApiSession(
  withHandler({ methods: ["GET"], handler, isPrivate: true })
);
