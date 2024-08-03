const nodemailer = require("nodemailer");
const config = require("../../config");

/**
 * @description function service to send email to the user
 * @param {*} options `email`, `subject`, `message`
 * @returns Promise
 */
const sendEmail = async (options) => {
  //   1) Create a transporter (service that send the email like gmail, sendgrid, etc)
  const transporter = nodemailer.createTransport({
    host: config.email_host,
    port: config.email_port,
    secure: config.email_secure,
    auth: {
      user: config.email_user,
      pass: config.email_pass,
    },
  });

  //   2) Define the email optiosn (like subject, body, etc)
  const mailOptions = {
    from: "E-Shop <kimoomar007@gmail>",
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  //   3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
