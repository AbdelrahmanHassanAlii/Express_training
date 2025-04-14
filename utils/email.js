/* eslint-disable import/no-extraneous-dependencies */
const { createTransport } = require('nodemailer');

const sendEmail = async (options) => {
    // 1 ) create the Transporter
    const transporter = createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    // 2 ) create the email options
    const mailOptions = {
        from: process.env.EMAIL_FROM_NAME,
        to: options.to,
        subject: options.subject,
        text: options.message
    };
    // 3 ) send the email
    await transporter.sendMail(mailOptions);
    // 4 ) return the result
    return true;
}

module.exports = sendEmail;