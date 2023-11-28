// import { Transporter } from 'nodemailer';
// // import * as nodemailer from 'nodemailer-smtp-transport';

// export const sendMail:Transporter  = (receiverEmail: string,url?: string) => {
//     const transporter = nodemailer.createTransport({
//         host: "sandbox.smtp.mailtrap.io",
//         port: 465,
//         secure: true,
//         auth: {
//           // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//           user: '679b1e147437a0',
//           pass: '0abecb3ffc7460'
//         }
//       });
//       async function main() {
//         // send mail with defined transport object
//         const info = await transporter.sendMail({
//           from: '"Fred Foo 👻" Expense manager', // sender address
//           to: receiverEmail, // list of receivers
//           subject: "Reset Password ✔", // Subject line
//           text: "Click the link below to reset your password", // plain text body
//           html: "<a href='https://google.com'>link</a>", // html body
//         });
      
//         console.log("Message sent: %s", info.messageId);
//         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
//         //
//         // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
//         //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
//         //       <https://github.com/forwardemail/preview-email>
//         //
//       }
//       main().catch(console.error);
// }