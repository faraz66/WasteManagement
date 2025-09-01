const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

transporter.sendMail({
  from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_USER}>`,
  to: 'farazshaikh66@gmail.com',
  subject: '🚀 EcoCircle Server Email Test',
  text: 'Email working from production server!'
}).then(() => {
  console.log('✅ Server email test successful!');
}).catch(err => {
  console.error('❌ Server email test failed:', err.message);
});
