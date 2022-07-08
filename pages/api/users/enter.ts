// import twilio from "twilio";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";

// const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
// const nodemailer = require("nodemailer");
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.GMAIL_ID,
//     pass: process.env.GMAIL_PWD,
//   },
// });
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone: phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });
  if (phone) {
    console.log(`당신의 폰 로그인 토큰은 ${payload}입니다.`);
    // const messages = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   to: process.env.MY_PHONE!, // 정상적으로는 req.phone을 써야 함
    //   body: `당신의 로그인 토큰은 ${payload}입니다.`,
    // });
    // console.log(messages);
  } else if (email) {
    console.log(`당신의 이메일 로그인 토큰은 ${payload}입니다.`);
    // const sendEmail = await transporter
    //   .sendMail({
    //     from: process.env.GMAIL_ID,
    //     to: process.env.GMAIL_ID,
    //     subject: "token",
    //     test: `your token is ${payload}`,
    //     html: `
    //       <div style="text-align: center;">
    //         <h3 style="color: #FA5882">ABC</h3>
    //         <br />
    //         <p>your login token is ${payload}</p>
    //       </div>
    //   `,
    //   })
    //   .then((result: any) => console.log(result))
    //   .catch((error: any) => console.log(error));
  }
  return res.json({
    ok: true,
    payload,
  });
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
