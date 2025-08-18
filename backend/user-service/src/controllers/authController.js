const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { exec } = require('child_process');
const path = require('path');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

exports.registerUser = async (req, res) => {
  const { username, email, password, user_type } = req.body;

  if (!username || !email || !password || !user_type) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    let user = await User.findByEmail(email);
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = await User.create({ username, email, password, user_type });
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, username: user.username, email: user.email, user_type: user.user_type },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await User.comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Logged in successfully',
      user: { id: user.id, username: user.username, email: user.email, user_type: user.user_type },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate password reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send email using Python script (working solution)
const sendEmailViaPython = (recipientEmail, resetUrl) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '../../send_email.py');
    const command = `python3 "${pythonScript}" "${recipientEmail}" "${resetUrl}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Python script error:', error);
        reject(error);
      } else {
        console.log('Python script output:', stdout);
        if (stderr) console.log('Python script stderr:', stderr);
        resolve(stdout);
      }
    });
  });
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ 
        message: 'If an account with that email exists, we have sent a password reset link.' 
      });
    }

    console.log(`📧 User found: ${user.email}, generating reset token...`);

    // Generate reset token and expiry (15 minutes)
    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save reset token to user
    await User.updateResetToken(user.id, resetToken, resetTokenExpiry);
    console.log('💾 Reset token saved to database');

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    console.log(`🔗 Reset URL generated: ${resetUrl}`);

    // For development: Log the reset URL to console as fallback
    console.log('\n🔗 DEVELOPMENT MODE - Password Reset Link:');
    console.log(`   ${resetUrl}`);
    console.log('   Copy this link to reset the password\n');

    // Modern email template with enhanced styling
    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your EcoWaste Password</title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
          
          <!-- Header with gradient background -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
            <!-- Decorative elements -->
            <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; opacity: 0.7;"></div>
            <div style="position: absolute; bottom: -30px; left: -30px; width: 60px; height: 60px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; opacity: 0.5;"></div>
            
            <!-- Logo and title -->
            <div style="position: relative; z-index: 2;">
              <div style="background: rgba(255, 255, 255, 0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                <span style="color: white; font-size: 32px; font-weight: bold;">🌱</span>
              </div>
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">EcoWaste</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Sustainable Waste Management Platform</p>
            </div>
          </div>
          
          <!-- Main content -->
          <div style="padding: 50px 40px; background: white;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 28px; font-weight: 600; line-height: 1.2;">Reset Your Password</h2>
              <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #10b981, #059669); margin: 0 auto; border-radius: 2px;"></div>
            </div>
            
            <p style="color: #4b5563; line-height: 1.7; margin-bottom: 30px; font-size: 16px; text-align: center;">
              We received a request to reset your password for your EcoWaste account. Click the button below to create a new password.
            </p>
            
            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 35px; font-size: 14px; text-align: center;">
              If you didn't make this request, you can safely ignore this email. Your password will remain unchanged.
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                        color: white; 
                        padding: 16px 32px; 
                        text-decoration: none; 
                        border-radius: 12px; 
                        font-weight: 600; 
                        font-size: 16px;
                        display: inline-block; 
                        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                        transition: all 0.3s ease;
                        letter-spacing: 0.5px;">
                🔐 Reset My Password
              </a>
            </div>
            
            <!-- Security notice -->
            <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center;">
              <div style="color: #92400e; font-size: 18px; margin-bottom: 8px;">⏰</div>
              <p style="color: #92400e; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">Security Notice</p>
              <p style="color: #a16207; font-size: 13px; line-height: 1.5; margin: 0;">
                This reset link will expire in <strong>15 minutes</strong> for your security. If you need a new link, please request another password reset.
              </p>
            </div>
            
            <!-- Alternative link -->
            <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0 0 10px 0; text-align: center;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #10b981; font-size: 12px; word-break: break-all; background: #ffffff; padding: 12px; border-radius: 6px; margin: 0; border: 1px solid #e5e7eb; font-family: monospace;">
                ${resetUrl}
              </p>
            </div>
            
            <!-- Help section -->
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 15px 0;">Need help? Contact our support team</p>
              <a href="mailto:support@superfreshinnovation.com" style="color: #10b981; text-decoration: none; font-weight: 500; font-size: 14px;">
                📧 support@superfreshinnovation.com
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #1f2937; padding: 30px; text-align: center;">
            <div style="margin-bottom: 20px;">
              <span style="color: #10b981; font-size: 24px; font-weight: bold;">🌱 EcoWaste</span>
            </div>
            <p style="color: #9ca3af; font-size: 14px; margin: 0 0 15px 0; line-height: 1.5;">
              Making waste management sustainable and efficient for a better tomorrow.
            </p>
            <div style="margin: 20px 0;">
              <a href="#" style="color: #6b7280; text-decoration: none; margin: 0 15px; font-size: 12px;">Privacy Policy</a>
              <a href="#" style="color: #6b7280; text-decoration: none; margin: 0 15px; font-size: 12px;">Terms of Service</a>
              <a href="#" style="color: #6b7280; text-decoration: none; margin: 0 15px; font-size: 12px;">Unsubscribe</a>
            </div>
            <p style="color: #6b7280; font-size: 12px; margin: 15px 0 0 0;">
              © 2024 EcoWaste by SuperFresh Innovation. All rights reserved.
            </p>
          </div>
        </div>
        
        <!-- Mobile responsiveness -->
        <style>
          @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .content { padding: 30px 20px !important; }
            .header { padding: 30px 20px !important; }
            .button { padding: 14px 24px !important; font-size: 14px !important; }
          }
        </style>
      </body>
      </html>
    `;

    // Try to send email with timeout handling (non-blocking)
    console.log('📤 Attempting to send password reset email...');
    
    // Always respond to user first, then try email in background
    res.status(200).json({ 
      message: 'If an account with that email exists, we have sent a password reset link.' 
    });

    // Send email in background using Python script (proven to work!)
    const sendEmailInBackground = async () => {
      try {
        console.log(`📧 Sending email via Python script to: ${email}`);
        
        // Use the working Python script to send email
        const result = await sendEmailViaPython(email, resetUrl);
        
        console.log('✅ Password reset email sent successfully via Python!');
        console.log('   Python script completed successfully');
        
      } catch (emailError) {
        console.error('❌ Failed to send password reset email via Python:', emailError.message);
        console.log('🔗 Reset link is still available in console logs above for development');
      }
    };

    // Start email sending in background
    sendEmailInBackground();

  } catch (error) {
    console.error('❌ Forgot password error:', error.message);
    console.error('Full error details:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Validate Reset Token
exports.validateResetToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Reset token is required' });
  }

  try {
    const user = await User.findByResetToken(token);
    
    if (!user || !user.reset_token_expiry || new Date() > user.reset_token_expiry) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    res.status(200).json({ message: 'Token is valid' });

  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  try {
    const user = await User.findByResetToken(token);
    
    if (!user || !user.reset_token_expiry || new Date() > user.reset_token_expiry) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token
    await User.resetPassword(user.id, password);

    res.status(200).json({ message: 'Password has been reset successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
