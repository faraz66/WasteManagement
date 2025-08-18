const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('🧪 Testing Migadu SMTP Email Service...\n');

// Test different SMTP configurations
const configs = [
  {
    name: 'Migadu Port 465 (SSL)',
    config: {
      host: 'smtp.migadu.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    }
  },
  {
    name: 'Migadu Port 587 (STARTTLS)',
    config: {
      host: 'smtp.migadu.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    }
  }
];

async function testEmailConfig(configName, transportConfig) {
  console.log(`\n📧 Testing: ${configName}`);
  console.log(`   Host: ${transportConfig.host}`);
  console.log(`   Port: ${transportConfig.port}`);
  console.log(`   Secure: ${transportConfig.secure}`);
  console.log(`   User: ${transportConfig.auth.user}`);
  
  try {
    // Create transporter
    const transporter = nodemailer.createTransport(transportConfig);
    
    // Test connection
    console.log('🔍 Testing connection...');
    await transporter.verify();
    console.log('✅ Connection verified successfully!');
    
    // Send test email
    console.log('📤 Sending test email...');
    const testEmail = {
      from: process.env.EMAIL_USER, // Use simple email address without display name
      to: 'farazshaikh66@gmail.com', // Send to your Gmail for testing
      subject: '🧪 EcoWaste Email Test - ' + new Date().toLocaleString(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px;">
            <h1 style="color: white; margin: 0;">🧪 Email Test Successful!</h1>
            <p style="color: white; margin: 10px 0 0 0;">EcoWaste Migadu SMTP Test</p>
          </div>
          <div style="padding: 30px; background: #f8fafc; border-radius: 10px; margin-top: 10px;">
            <h2 style="color: #1f2937;">Test Results</h2>
            <p><strong>Configuration:</strong> ${configName}</p>
            <p><strong>Host:</strong> ${transportConfig.host}</p>
            <p><strong>Port:</strong> ${transportConfig.port}</p>
            <p><strong>Secure:</strong> ${transportConfig.secure}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p style="color: #10b981; font-weight: bold;">✅ Email service is working correctly!</p>
          </div>
        </div>
      `
    };
    
    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${result.messageId}`);
    console.log(`   Response: ${result.response}`);
    
    return { success: true, config: configName };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('   Error code:', error.code);
    return { success: false, config: configName, error: error.message };
  }
}

async function runEmailTests() {
  console.log('Environment variables:');
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(`EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET'}`);
  console.log(`EMAIL_HOST: ${process.env.EMAIL_HOST}`);
  console.log(`EMAIL_PORT: ${process.env.EMAIL_PORT}`);
  
  const results = [];
  
  for (const { name, config } of configs) {
    const result = await testEmailConfig(name, config);
    results.push(result);
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n📊 Test Summary:');
  console.log('================');
  
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.config}: SUCCESS`);
    } else {
      console.log(`❌ ${result.config}: FAILED - ${result.error}`);
    }
  });
  
  const successfulConfigs = results.filter(r => r.success);
  if (successfulConfigs.length > 0) {
    console.log(`\n🎉 Found ${successfulConfigs.length} working configuration(s)!`);
    console.log('✅ Email service is ready for integration.');
  } else {
    console.log('\n💥 No working configurations found.');
    console.log('❌ Email service needs configuration fixes.');
  }
}

// Run the tests
runEmailTests().catch(console.error);
