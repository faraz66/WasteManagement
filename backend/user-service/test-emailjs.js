const { SMTPClient } = require('emailjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('🧪 Testing EmailJS Package...\n');

async function testEmailJS() {
  console.log('Environment check:');
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(`EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET'}`);
  console.log(`EMAIL_HOST: ${process.env.EMAIL_HOST}`);
  console.log(`EMAIL_PORT: ${process.env.EMAIL_PORT}\n`);

  try {
    console.log('🔍 Testing SMTP connection with EmailJS...');
    
    const client = new SMTPClient({
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
      host: 'smtp.migadu.com',
      port: 465,
      ssl: true, // Use SSL like Python
    });

    console.log('📤 Sending test email...');
    
    const message = {
      text: `This is a test email using EmailJS package instead of nodemailer.

Test Details:
- Package: emailjs
- SMTP Server: smtp.migadu.com
- Port: 465 (SSL)
- Time: ${new Date().toLocaleString()}

If you receive this email, the EmailJS package is working correctly!

Best regards,
EcoWaste Team`,
      from: process.env.EMAIL_USER,
      to: 'farazshaikh66@gmail.com',
      subject: `🧪 EcoWaste EmailJS Test - ${new Date().toLocaleString()}`,
    };

    // Send email using EmailJS
    const result = await new Promise((resolve, reject) => {
      client.send(message, (err, message) => {
        if (err) {
          reject(err);
        } else {
          resolve(message);
        }
      });
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('   Result:', result);

    return true;

  } catch (error) {
    console.error('❌ EmailJS test failed:', error.message);
    console.error('   Error details:', error.code || 'Unknown error');
    return false;
  }
}

// Run the test
testEmailJS()
  .then(success => {
    if (success) {
      console.log('\n🎉 EmailJS package is working!');
      console.log('✅ We can replace nodemailer with EmailJS.');
    } else {
      console.log('\n💥 EmailJS package failed!');
      console.log('❌ Need to try a different approach.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
