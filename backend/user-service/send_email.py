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
SMTP_SERVER = "smtp.migadu.com"
SMTP_PORT = 465
USERNAME = "test@gccglobetech.com"
PASSWORD = "Gofortest@321"

def send_password_reset_email(recipient_email, reset_url, user_name="User"):
    """Send password reset email."""
    try:
        print(f"📧 Sending password reset email to {recipient_email}...")
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = f"EcoCircle Team <{USERNAME}>"
        msg['To'] = recipient_email
        msg['Subject'] = "🔐 EcoCircle - Password Reset Request"
        
        # Ultra-simple HTML matching the first image exactly
        html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>EcoCircle Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
    <div style="max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #333; margin: 0; font-size: 18px;">🔐 EcoCircle Password Reset</h2>
        </div>
        
        <div style="text-align: center; margin-bottom: 30px;">
            <p style="color: #666; margin: 0; font-size: 14px;">Click the link below to reset your password:</p>
        </div>
        
        <div style="text-align: center; margin-bottom: 30px;">
            <a href="{reset_url}" style="display: inline-block; background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: normal;">Reset Password</a>
        </div>
        
        <div style="text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">This link expires in 15 minutes.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            <p style="color: #666; font-size: 12px; margin: 0;">🌱 EcoCircle Team</p>
        </div>
        
    </div>
</body>
</html>
        """
        
        # Plain text version
        text_content = f"""
EcoCircle Password Reset

Click the link below to reset your password:
{reset_url}

This link expires in 15 minutes.

EcoCircle Team
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
