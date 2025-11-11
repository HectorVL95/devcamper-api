import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

export const send_email = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMPT_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  })

  let info = await transporter.sendMail({
    from: `${process.env.FROM_NAME} ${process.env.FROM_EMAI}`,
    to: process.env.SMTP_EMAIL,
    subject: 'Hello world subject',
    text: "what's cracking mane? you pimping hoes ?",
    html: "<p>I'll will fuck you up P</p>"
  })
}