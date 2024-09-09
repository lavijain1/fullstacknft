const nodemailer = require("nodemailer");

const sender = async (options) => {
  //   const transporter = nodemailer.createTransport({
  //     host: process.env.EMAIL_HOST,
  //     port: process.env.EMAIL_PORT,
  //     auth: {
  //       user: process.env.EMAIL_USERNAME,
  //       pass: process.env.EMAIL_PASSWORD,
  //     },
  //   });
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "ethyl71@ethereal.email",
      pass: "Tn3H7nmp7cfvXJXP9B",
    },
  });

  const maildetails = {
    from: "Lavi Jain <hello@lavi.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(maildetails);
};

module.exports = sender;
