import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { prisma } from "@prisma/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone, email } = req.body;
  let user;
  if (email) {
    user = await client.user.findUnique({
      where: {
        email,
      },
    });
    if (user) console.log("찾았다");
    if (!user) {
      console.log("못 찾았다. 새로 만들어라.");
      user = await client.user.create({
        data: {
          name: "Anonymous",
          email,
        },
      });
    }
    console.log(user);
  }
  if (phone) {
    user = await client.user.findUnique({
      where: {
        phone: +phone,
      },
    });
    if (user) console.log("찾았다");
    if (!user) {
      console.log("못 찾았다. 새로 만들어라.");
      user = await client.user.create({
        data: {
          name: "Anonymous",
          phone: +phone,
        },
      });
    }
    console.log(user);
  }
  return res.status(200).end();
}

export default withHandler("POST", handler);
