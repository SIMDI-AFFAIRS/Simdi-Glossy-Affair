import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const authUser = process.env.BREVO_AUTH_USER;
const authPass = process.env.BREVO_AUTH_PASS;
const senderEmail = 'info@mandc2025.org';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: authUser,
    pass: authPass,
  },
  debug: true,
  logger: true,
});

/**
 * Send an OTP to the user
 * @param {string} email - Recipients email address
 * @param {number} otp - OTP to be sent
 * @returns {Promise<void>} - aA promise tha resolves when the email is sent
*/

export const SendOtpEmail = async (email, otp) => {
  const emailBody = `<P>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`;

  try {
    const info = await transporter.sendMail({
      from: `SIMDI GLOSSY AFFAIR <${senderEmail}>`, // sender address
      to: email, // Recipient address
      subject: 'OTP Request Code',
      text: 'Your OTP code',
      html: emailBody,
      replyTo: senderEmail,
    });

    console.log('OTP sent: ', info);
  } catch (error) {
    console.error(error);
  }
};