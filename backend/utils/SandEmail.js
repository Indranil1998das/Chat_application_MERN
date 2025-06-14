const nodeMiler = require("nodemailer");
// Realtime Email Send
const SendEmail = async (userEmail, message) => {
  const transporter = nodeMiler.createTransport({
    service: process.env.SENDEMAIL_SERVICE,
    auth: {
      user: process.env.SENDEMAIL_COMPANY_GMAIL_ID,
      pass: process.env.SENDEMAIL_COMPANY_GMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SENDEMAIL_COMPANY_GMAIL_ID,
    to: userEmail,
    subject: "Password Recover",
    text: message,
  });
};

module.exports = SendEmail;
