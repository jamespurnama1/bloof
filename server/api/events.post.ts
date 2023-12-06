import nodemailer from 'nodemailer';
import type { IncomingMessage, ServerResponse } from "http";

const config = useRuntimeConfig()
const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      auth: {
          user: config.GMAIL_SEND,
          pass: config.GMAIL_PASSWORD,
      },
      secure: true,
  });

export default defineEventHandler(async(event) => {
    const body = await readBody(event)
    const { name, phone, email, notes, date, pax, budget } = body;

  await new Promise((resolve, reject) => {
      // verify connection configuration
      transporter.verify(function (error, success) {
          if (error) {
              console.log(error);
              reject(error);
          } else {
              resolve(success);
          }
      });
  });

  const mailData = {
      from: {
        name: 'Bloof Dev',
        address: config.GMAIL_SEND,
      },
      replyTo: email,
      to: config.GMAIL_RECEIVE,
      subject: `Plan an event - ${name}`,
      text: `${name} is planning to have an event on ${date}. Phone: ${phone}, E-mail: ${email}, Pax: ${pax}, Budget: ${budget}, Notes: ${notes}`,
      html: `<strong>${name} is planning to have an event on ${date}.</strong><br><ul><li>Phone: ${phone}</li><li>E-mail: ${email}</li><li>Pax: ${pax}</li><li>Budget: ${budget}</li><li>Notes: ${notes}</li>`,
  };

  await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(mailData, (err, info) => {
          if (err) {
              console.error(err);
              reject(err);
          } else {
              console.log(info);
              resolve(info);
          }
      });
  });

//   res.status(200).json({ status: "OK" });
});