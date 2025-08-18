const SMTPClient = require('smtp-client').SMTPClient;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('🧪 Testing SMTP Client Package...\n');

async function testSMTPClient() {
  console.log('Environment check:');
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(`EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET'}`);
  console.log(`EMAIL_HOST: ${process.env.EMAIL_HOST}`);
  console.log(`EMAIL_PORT: ${process.env.EMAIL_PORT}\n`);

  try {
    console.log('🔍 Testing SMTP connection with smtp-client...');
    
    const client = new SMTPClient({
      host: 'smtp.migadu.com',
      port: 465,
      secure: true, // Use SSL
    });

    // Connect to server
    await client.connect();
    console.log('✅ Connected to SMTP server successfully!');

    // Authenticate
    await client.greet({ hostname: 'localhost' });
    await client.authLogin({
      username: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
    });
    console.log('✅ Authentication successful!');

    // Send test email
    console.log('📤 Sending test email...');
    
    const emailContent = `From: ${process.env.EMAIL_USER}
To: farazshaikh66@gmail.com
Subject: 🧪 EcoWaste SMTP Client Test - ${new Date().toLocaleString()}

This is a test email using smtp-client package instead of nodemailer.

Test Details:
- Package: smtp-client
- SMTP Server: smtp.migadu.com
- Port: 465 (SSL)
- Time: ${new Date().toLocaleString()}

If you receive this email, the smtp-client package is working correctly!

Best regards,
EcoWaste Team`;

    await client.mail({ from: process.env.EMAIL_USER });
    await client.rcpt({ to: 'farazshaikh66@gmail.com' });
    await client.data(emailContent);
    
    console.log('✅ Test email sent successfully!');

    // Close connection
    await client.quit();
    console.log('✅ Connection closed properly');

    return true;

  } catch (error) {
    console.error('❌ SMTP Client test failed:', error.message);
    console.error('   Error details:', error.code || 'Unknown error');
    return false;
  }
}

// Run the test
testSMTPClient()
  .then(success => {
    if (success) {
      console.log('\n🎉 SMTP Client package is working!');
      console.log('✅ We can replace nodemailer with smtp-client.');
    } else {
      console.log('\n💥 SMTP Client package failed!');
      console.log('❌ Need to try a different approach.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
