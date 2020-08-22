import nodemailer from 'nodemailer'
import nunjucks from 'nunjucks'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
})

/**
 * Generic email send function
 * @param {string} to address to send mail to
 * @param {string} subject email subject
 * @param {string} html  html text of the email
 * @param {string} text  plain text of the email
 */
const sendMail = async (to, subject, html, text) => {
  try {
    await transporter.sendMail({
      from: `"Healthcare Roll Call" <${process.env.SMTP_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html // html body
    })
  } catch (e) {
    console.error(e)
  }
}

/**
 * Send a forgot password email.
 * @param {string} userEmail email address of the user we're sending to
 * @param {string} resetPasswordToken temporary token for the reset password link
 * 
 * @returns {Boolean}
 */
const sendForgotPassword = async (userEmail, resetPasswordToken) => {
  try {
    const emailResetLink = `https://healthcarerollcall.org/reset/${resetPasswordToken}`
    await sendMail(
      userEmail,
      'Password Reset - Healthcare Roll Call',
      nunjucks.render('forgot_password_html.njk', { emailResetLink }),
      nunjucks.render('forgot_password_text.njk', { emailResetLink })
    )
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

const sendContactCheckInEmail = async (info) => {
  try {
    const entityLink = `${process.env.URL}/checkin/${info.entityId}?token=${info.token}`
    const emailTitle = `${info.entityName} Check In`
    const emailContents = `Hello ${info.name}! It is time to update the status of ${info.entityName}. Please click the link below to check in.`
    await sendMail(
      info.email,
      emailTitle,
      nunjucks.render('contact_check_in_html.njk', { emailTitle, emailContents, entityLink }),
      nunjucks.render('contact_check_in_text.njk', { emailTitle, emailContents, entityLink })
    )

    return true
  } catch (e) {
    console.error(e)
  }
}

export default { sendForgotPassword, sendContactCheckInEmail }
