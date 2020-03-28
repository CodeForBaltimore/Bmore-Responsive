import nodemailer from "nodemailer";
import nunjucks from "nunjucks";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

/**
 * Generic email send function
 * @param {string} to address to send mail to
 * @param {string} subject email subject
 * @param {string} html  html text of the email
 * @param {string} text  plain text of the email
 */
const sendMail = async (to, subject, html, text) => {
  let info = await transporter.sendMail({
    from: `"Healthcare Roll Call" <${process.env.SMTP_USER}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html // html body
  });
  console.log("Email sent: %s", info.messageId);
};

/**
 * Send a forgot password email.
 * @param {string} userEmail email address of the user we're sending to
 * @param {string} resetPasswordToken temporary token for the reset password link
 */
const sendForgotPassword = async (userEmail, resetPasswordToken) => {
  const emailResetLink = `https://healthcarerollcall.org/reset/${resetPasswordToken}`;
  await sendMail(
    userEmail,
    "Password Reset - Healthcare Roll Call",
    nunjucks.render("forgot_password_html.njk", { emailResetLink }),
    nunjucks.render("forgot_password_text.njk", { emailResetLink })
  );
  return true;
};

export default { sendForgotPassword };
