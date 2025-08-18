const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('🧪 Comprehensive Migadu SMTP Testing...\n');

// Multiple Migadu configurations to test
const configs = [
  {
    name: 'Migadu Port 465 (SSL) - Basic',
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
    name: 'Migadu Port 465 (SSL) - With TLS Options',
    config: {
      host: 'smtp.migadu.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      }
    }
  },
  {
    name: 'Migadu Port 587 (STARTTLS) - Basic',
    config: {
      host: 'smtp.migadu.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    }
  },
  {
    name: 'Migadu Port 587 (STARTTLS) - With TLS Options',
    config: {
      host: 'smtp.migadu.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    }
  },
  {
    name: 'Migadu Port 587 - Extended Timeouts',
    config: {
      host: 'smtp.migadu.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
      tls: {
        rejectUnauthorized: false
      }
    }
  }
];

async function testEmailConfig(configName, transportConfig) {
  console.log(`\n📧 Testing: ${configName}`);
  console.log(`   Host: ${transportConfig.host}:${transportConfig.port}`);
  console.log(`   Secure: ${transportConfig.secure}`);
  console.log(`   User: ${transportConfig.auth.user}`);
  
  try {
    // Create transporter
    const transporter = nodemailer.createTransport(transportConfig);
    
    // Test connection with timeout
    console.log('🔍 Testing connection...');
    const startTime = Date.now();
    
    await Promise.race([
      transporter.verify(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout after 30 seconds')), 30000)
      )
    ]);
    
    const connectionTime = Date.now() - startTime;
    console.log(`✅ Connection verified successfully! (${connectionTime}ms)`);
    
    // Send test email
    console.log('📤 Sending test email...');
    const testEmail = {
      from: process.env.EMAIL_USER,
      to: 'farazshaikh66@gmail.com',
      subject: `🧪 EcoWaste Test - ${configName} - ${new Date().toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px;">
            <h1 style="color: white; margin: 0;">🎉 Email Test SUCCESS!</h1>
            <p style="color: white; margin: 10px 0 0 0;">EcoWaste Migadu SMTP Working</p>
          </div>
          <div style="padding: 30px; background: #f8fafc; border-radius: 10px; margin-top: 10px;">
            <h2 style="color: #1f2937;">Test Results</h2>
            <p><strong>Configuration:</strong> ${configName}</p>
            <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
            <p><strong>To:</strong> farazshaikh66@gmail.com</p>
            <p><strong>Connection Time:</strong> ${connectionTime}ms</p>
            <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
            <p style="color: #10b981; font-weight: bold; font-size: 18px;">✅ MIGADU EMAIL SERVICE IS WORKING!</p>
            <p>Ready to integrate with EcoWaste forgot password feature.</p>
          </div>
        </div>
      `
    };
    
    const emailStartTime = Date.now();
    const result = await transporter.sendMail(testEmail);
    const emailTime = Date.now() - emailStartTime;
    
    console.log(`✅ Test email sent successfully! (${emailTime}ms)`);
    console.log(`   Message ID: ${result.messageId}`);
    console.log(`   Response: ${result.response}`);
    
    return { 
      success: true, 
      config: configName, 
      connectionTime, 
      emailTime,
      messageId: result.messageId 
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('   Error code:', error.code);
    console.error('   Error details:', error.command || 'N/A');
    
    return { 
      success: false, 
      config: configName, 
      error: error.message,
      errorCode: error.code 
    };
  }
}

async function runComprehensiveTest() {
  console.log('Environment Check:');
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(`EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET'}`);
  console.log(`EMAIL_HOST: ${process.env.EMAIL_HOST}`);
  console.log(`EMAIL_PORT: ${process.env.EMAIL_PORT}\n`);
  
  const results = [];
  
  for (const { name, config } of configs) {
    const result = await testEmailConfig(name, config);
    results.push(result);
    
    // If we found a working configuration, we can stop testing
    if (result.success) {
      console.log(`\n🎉 FOUND WORKING CONFIGURATION: ${name}`);
      console.log('✅ Stopping tests - we have a winner!');
      break;
    }
    
    // Wait between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('\n📊 Final Test Summary:');
  console.log('======================');
  
  const successfulConfigs = results.filter(r => r.success);
  
  if (successfulConfigs.length > 0) {
    console.log(`\n🎉 SUCCESS! Found ${successfulConfigs.length} working configuration(s):`);
    successfulConfigs.forEach(config => {
      console.log(`✅ ${config.config}`);
      console.log(`   Connection: ${config.connectionTime}ms`);
      console.log(`   Email Send: ${config.emailTime}ms`);
      console.log(`   Message ID: ${config.messageId}`);
    });
    console.log('\n🚀 Ready to integrate with EcoWaste forgot password feature!');
    console.log('📧 Check farazshaikh66@gmail.com for test email confirmation.');
  } else {
    console.log('\n💥 All configurations failed:');
    results.forEach(result => {
      console.log(`❌ ${result.config}: ${result.error} (${result.errorCode})`);
    });
    console.log('\n🔧 Possible solutions:');
    console.log('1. Check network/firewall blocking SMTP ports');
    console.log('2. Verify Migadu account is active and configured');
    console.log('3. Try from a different network/location');
    console.log('4. Contact Migadu support for server status');
  }
}

// Run comprehensive test
runComprehensiveTest().catch(console.error);
