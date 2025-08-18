const nodemailer = require('nodemailer');

console.log('🧪 Testing Gmail SMTP Email Service (Temporary Solution)...\n');

async function testGmailConfig() {
  console.log('📧 Testing Gmail SMTP Configuration');
  
  // Gmail SMTP configuration
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'farazshaikh66@gmail.com',
      pass: 'your-gmail-app-password', // You'll need to generate this
    },
  });
  
  try {
    // Test connection
    console.log('🔍 Testing Gmail connection...');
    await transporter.verify();
    console.log('✅ Gmail connection verified successfully!');
    
    // Send test email
    console.log('📤 Sending test email via Gmail...');
    const testEmail = {
      from: 'farazshaikh66@gmail.com',
      to: 'farazshaikh66@gmail.com',
      subject: '🧪 EcoWaste Gmail Test - ' + new Date().toLocaleString(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px;">
            <h1 style="color: white; margin: 0;">🧪 Gmail Test Successful!</h1>
            <p style="color: white; margin: 10px 0 0 0;">EcoWaste Gmail SMTP Test</p>
          </div>
          <div style="padding: 30px; background: #f8fafc; border-radius: 10px; margin-top: 10px;">
            <h2 style="color: #1f2937;">Gmail Configuration Working!</h2>
            <p><strong>From:</strong> farazshaikh66@gmail.com</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p style="color: #10b981; font-weight: bold;">✅ Ready to integrate with forgot password feature!</p>
          </div>
        </div>
      `
    };
    
    const result = await transporter.sendMail(testEmail);
    console.log('✅ Gmail test email sent successfully!');
    console.log(`   Message ID: ${result.messageId}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Gmail test failed:', error.message);
    console.error('   Error code:', error.code);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Gmail Setup Required:');
      console.log('1. Go to Google Account settings');
      console.log('2. Enable 2-Factor Authentication');
      console.log('3. Generate App Password for "Mail"');
      console.log('4. Use the app password instead of regular password');
    }
    
    return false;
  }
}

// Run Gmail test
testGmailConfig().then(success => {
  if (success) {
    console.log('\n🎉 Gmail SMTP is ready!');
    console.log('✅ Can integrate with forgot password feature immediately.');
  } else {
    console.log('\n❌ Gmail setup needed before integration.');
  }
}).catch(console.error);
