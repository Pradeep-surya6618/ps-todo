# Password Reset Setup Guide

## Overview

The password reset system uses email verification with 4-digit codes. Users receive a beautifully designed email matching the SunMoonie cosmic theme.

## Email Service Configuration

### Option 1: Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account Settings → Security
   - Under "Signing in to Google", select "App passwords"
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Add to `.env.local`**:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
SMTP_FROM="SunMoonie" <your-email@gmail.com>
```

### Option 2: SendGrid (Recommended for Production)

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key
3. Add to `.env.local`:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM="SunMoonie" <noreply@yourdomain.com>
```

### Option 3: Other SMTP Services

You can use any SMTP service (Mailgun, AWS SES, etc.). Just update the configuration accordingly.

## Testing the Flow

1. **Request Reset Code**:
   - Go to `/forgot-password`
   - Enter your email
   - Click "Send Reset Link"

2. **Check Your Email**:
   - Open the email (check spam if not in inbox)
   - Copy the 4-digit verification code

3. **Verify Code**:
   - You'll be redirected to `/verify-code`
   - Enter the 4-digit code (or paste it)
   - Click "Verify Code"

4. **Reset Password**:
   - You'll be redirected to `/reset-password`
   - Enter your new password
   - Confirm the password
   - Click "Update Password"

5. **Login**:
   - You'll be redirected to `/login`
   - Sign in with your new password

## Security Features

- ✅ Codes expire after 10 minutes
- ✅ Codes are deleted after successful password reset
- ✅ Passwords are hashed with bcrypt
- ✅ Email existence is not revealed for security
- ✅ Verification required before password reset

## Troubleshooting

### Email Not Sending

1. Check your `.env.local` file has all SMTP variables
2. Verify SMTP credentials are correct
3. Check console for error messages
4. For Gmail, ensure App Password is used (not regular password)

### Code Not Working

1. Check if code has expired (10 minutes)
2. Request a new code
3. Ensure you're using the latest code sent

### Database Issues

1. Ensure MongoDB connection is working
2. Check that PasswordReset model is created
3. Verify indexes are created properly

## Email Template

The email template features:

- 🎨 Cosmic gradient design matching SunMoonie theme
- 💖 Primary color (#ff2e63) accents
- 📱 Fully responsive for mobile devices
- ✨ Professional and modern layout
- 🔒 Security notices and instructions

## API Endpoints

- `POST /api/forgot-password` - Send verification code
- `POST /api/verify-reset-code` - Verify code
- `POST /api/reset-password` - Reset password

## Files Created

### Backend

- `src/lib/email.js` - Email service configuration
- `src/lib/emailTemplates.js` - HTML email template
- `src/models/PasswordReset.js` - Database model
- `src/app/api/forgot-password/route.js` - Send code API
- `src/app/api/verify-reset-code/route.js` - Verify code API
- `src/app/api/reset-password/route.js` - Reset password API

### Frontend

- `src/app/verify-code/page.js` - 4-box code input page
- Updated `src/app/forgot-password/page.js`
- Updated `src/app/reset-password/page.js`
