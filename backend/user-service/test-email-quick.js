const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('🧪 Quick Email Service Test...\n');

// Create transporter with simplified settings (matching working Python approach)
const transporter = nodemailer.createTransport({
  host: 'smtp.migadu.com',
  port: 465,
  secure: true, // Use SSL like Python's SMTP_SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  // Use nodemailer defaults - no custom timeouts or TLS settings
});

async function testEmailService() {
  console.log('Environment check:');
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(`EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET'}`);
  console.log(`EMAIL_HOST: ${process.env.EMAIL_HOST}`);
  console.log(`EMAIL_PORT: ${process.env.EMAIL_PORT}\n`);

  try {
    console.log('🔍 Testing SMTP connection...');
    
    // Test connection without custom timeout - let nodemailer handle it
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    console.log('📤 Sending test email...');
    
    const testEmail = {
      from: process.env.EMAIL_USER,
      to: 'farazshaikh66@gmail.com',
      subject: '🧪 EcoWaste Quick Test - ' + new Date().toLocaleString(),
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #10b981;">✅ Email Service Working!</h2>
          <p>This is a quick test to verify the email service is functioning properly.</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Status:</strong> Email service is ready for forgot password functionality.</p>
        </div>
      `
    };
    
    // Send email without custom timeout - let nodemailer handle it
    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${result.messageId}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Email service test failed:', error.message);
    console.error('   Error details:', error.code || 'Unknown error');
    return false;
  }
}

// Run the test
testEmailService()
  .then(success => {
    if (success) {
      console.log('\n🎉 Email service is ready!');
      console.log('✅ Forgot password functionality should work properly.');
    } else {
      console.log('\n💥 Email service needs attention!');
      console.log('❌ Forgot password will not work until this is fixed.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
