#!/usr/bin/env python3
"""
Email Sender Script for EcoCircle
Called by Node.js backend to send emails using working Python SMTP implementation.
"""

import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import sys
import json
import os

# Email configuration
SMTP_SERVER = "smtp.hostinger.com"
SMTP_PORT = 465
USERNAME = "support@ecocircle.in"
PASSWORD = "Ecocircle@123"

def send_password_reset_email(recipient_email, reset_url, user_name="User"):
    """Send password reset email."""
    try:
        print(f"📧 Sending password reset email to {recipient_email}...")
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = f"EcoCircle Team <{USERNAME}>"
        msg['To'] = recipient_email
        msg['Subject'] = "🔐 Reset Your EcoCircle Password - Action Required"
        
        # Premium HTML email content with emotional design
        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your EcoCircle Password</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
            padding: 30px 20px;
        }}
        
        .email-container {{
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }}
        
        .header {{
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 50px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }}
        
        .floating-leaves {{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
        }}
        
        .leaf {{
            position: absolute;
            color: rgba(255, 255, 255, 0.2);
            font-size: 20px;
            animation: float 6s ease-in-out infinite;
        }}
        
        .leaf:nth-child(1) {{ top: 10%; left: 20%; animation-delay: 0s; }}
        .leaf:nth-child(2) {{ top: 20%; right: 25%; animation-delay: 2s; }}
        .leaf:nth-child(3) {{ top: 60%; left: 15%; animation-delay: 4s; }}
        .leaf:nth-child(4) {{ top: 70%; right: 20%; animation-delay: 1s; }}
        .leaf:nth-child(5) {{ top: 40%; left: 70%; animation-delay: 3s; }}
        
        @keyframes float {{
            0%, 100% {{ transform: translateY(0px) rotate(0deg); }}
            50% {{ transform: translateY(-10px) rotate(5deg); }}
        }}
        
        .logo {{
            font-size: 36px;
            font-weight: 700;
            color: white;
            margin-bottom: 12px;
            position: relative;
            z-index: 2;
        }}
        
        .logo::before {{
            content: "🌱";
            margin-right: 10px;
        }}
        
        .tagline {{
            font-size: 20px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
            position: relative;
            z-index: 2;
            margin-bottom: 8px;
        }}
        
        .subtitle {{
            color: rgba(255, 255, 255, 0.8);
            font-size: 16px;
            font-weight: 400;
            position: relative;
            z-index: 2;
        }}
        
        .content {{
            padding: 50px 40px;
            text-align: center;
        }}
        
        .greeting {{
            font-size: 24px;
            color: #1f2937;
            margin-bottom: 20px;
            font-weight: 600;
        }}
        
        .greeting::before {{
            content: "👋";
            margin-right: 10px;
        }}
        
        .message {{
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 35px;
            line-height: 1.8;
            max-width: 450px;
            margin-left: auto;
            margin-right: auto;
        }}
        
        .message strong {{
            color: #1f2937;
            font-weight: 600;
        }}
        
        .cta-button {{
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
            margin: 20px 0;
        }}
        
        .cta-button:hover {{
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
        }}
        
        .cta-button::before {{
            content: "🔒";
            margin-right: 10px;
        }}
        
        .alternative-link {{
            margin-top: 30px;
            padding: 20px;
            background: #f9fafb;
            border-radius: 12px;
            border-left: 4px solid #10b981;
        }}
        
        .alternative-link p {{
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 10px;
            font-weight: 500;
        }}
        
        .alternative-link a {{
            color: #10b981;
            word-break: break-all;
            font-size: 12px;
            text-decoration: none;
        }}
        
        .security-notice {{
            margin-top: 40px;
            padding: 20px;
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-radius: 12px;
            border-left: 4px solid #f59e0b;
        }}
        
        .security-notice p {{
            font-size: 14px;
            color: #92400e;
            margin: 0;
            line-height: 1.6;
        }}
        
        .divider {{
            height: 2px;
            background: linear-gradient(90deg, transparent, #10b981, transparent);
            margin: 30px 0;
        }}
        
        .footer {{
            background: #f9fafb;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }}
        
        .footer p {{
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
        }}
        
        .footer .company-name {{
            font-weight: 600;
            color: #1f2937;
            font-size: 16px;
        }}
        
        .footer .mission {{
            font-style: italic;
            color: #10b981;
            font-weight: 500;
            margin: 12px 0;
        }}
        
        @media (max-width: 600px) {{
            .email-container {{
                margin: 10px;
                border-radius: 15px;
            }}
            
            .header {{
                padding: 30px 20px;
            }}
            
            .content {{
                padding: 40px 25px;
            }}
            
            .footer {{
                padding: 25px 20px;
            }}
            
            .logo {{
                font-size: 32px;
            }}
            
            .tagline {{
                font-size: 18px;
            }}
            
            .greeting {{
                font-size: 22px;
            }}
            
            .message {{
                font-size: 15px;
            }}
            
            .cta-button {{
                padding: 14px 30px;
                font-size: 15px;
            }}
        }}
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="floating-leaves">
                <div class="leaf">🍃</div>
                <div class="leaf">🌿</div>
                <div class="leaf">🍃</div>
                <div class="leaf">🌿</div>
                <div class="leaf">🍃</div>
            </div>
            <div class="logo">EcoCircle</div>
            <div class="tagline">Your Journey Continues 💚</div>
            <div class="subtitle">Let's get you back to making a difference for our planet!</div>
        </div>
        
        <div class="content">
            <div class="greeting">Hello, Earth Champion!</div>
            
            <div class="message">
                <strong>We received a request to reset your password</strong><br><br>
                Your commitment to sustainable waste management inspires us! 
                Let's get you back to your eco-friendly mission with a 
                <strong>secure password reset</strong>.
            </div>
            
            <a href="{reset_url}" class="cta-button">
                Reset My Password ✨
            </a>
            
            <div class="alternative-link">
                <p><strong>Button not working?</strong> Copy and paste this link:</p>
                <a href="{reset_url}">{reset_url}</a>
            </div>
            
            <div class="divider"></div>
            
            <div class="security-notice">
                <p>
                    <strong>🛡️ Security First:</strong> This link expires in 15 minutes for your protection. 
                    If you didn't request this reset, please ignore this email and your password will remain unchanged.
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p class="company-name">EcoCircle Team</p>
            <p class="mission">"Together, we're building a cleaner, greener future 🌍"</p>
            <p>This email was sent because you requested a password reset. If you have questions, contact our support team.</p>
        </div>
    </div>
</body>
</html>
        """
        
        # Plain text version
        text_content = f"""
EcoCircle Password Reset

Hello {user_name},

Someone requested a password reset for your EcoCircle account. If this was you, use the link below to reset your password:

{reset_url}

If you didn't request this, you can safely ignore this email. Your password won't be changed.

SECURITY NOTICE: This reset link will expire in 15 minutes for your security.

---
EcoCircle Team
Making waste management sustainable and efficient for a better tomorrow.
        """
        
        # Attach both versions
        part1 = MIMEText(text_content, 'plain')
        part2 = MIMEText(html_content, 'html')
        
        msg.attach(part1)
        msg.attach(part2)
        
        # Create SSL context and send
        context = ssl.create_default_context()
        
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
            server.login(USERNAME, PASSWORD)
            server.send_message(msg)
            
        print("✅ Password reset email sent successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send password reset email: {e}")
        return False

def main():
    """Main function to handle command line arguments."""
    if len(sys.argv) != 3:
        print("Usage: python3 send_email.py <recipient_email> <reset_url>")
        sys.exit(1)
    
    recipient_email = sys.argv[1]
    reset_url = sys.argv[2]
    
    success = send_password_reset_email(recipient_email, reset_url)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
