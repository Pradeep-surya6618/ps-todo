// Cosmic-themed email template for SunMoonie
export function getVerificationCodeEmail(code) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - SunMoonie</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 24px; box-shadow: 0 20px 60px rgba(255, 46, 99, 0.15); overflow: hidden;">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #ff2e63 0%, #ff6b9d 100%); padding: 40px 30px; text-align: center;">
              <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 12px 24px; border-radius: 50px; backdrop-filter: blur(10px); margin-bottom: 16px;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
                  🌙 SunMoonie
                </h1>
              </div>
              <p style="margin: 0; color: rgba(255, 255, 255, 0.95); font-size: 16px; font-weight: 500;">
                Password Reset Request
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 48px 40px;">
              <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 24px; font-weight: 700; text-align: center;">
                Reset Your Password
              </h2>
              <p style="margin: 0 0 32px 0; color: #64748b; font-size: 15px; line-height: 1.6; text-align: center;">
                We received a request to reset your password. Use the verification code below to continue:
              </p>

              <!-- Verification Code Box -->
              <div style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border: 2px solid #ff2e63; border-radius: 16px; padding: 32px; text-align: center; margin: 0 0 32px 0; box-shadow: 0 8px 24px rgba(255, 46, 99, 0.1);">
                <p style="margin: 0 0 12px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                  Your Verification Code
                </p>
                <div style="font-size: 48px; font-weight: 800; color: #ff2e63; letter-spacing: 12px; font-family: 'Courier New', monospace; text-shadow: 0 2px 8px rgba(255, 46, 99, 0.2);">
                  ${code}
                </div>
                <p style="margin: 16px 0 0 0; color: #94a3b8; font-size: 13px;">
                  This code expires in <strong style="color: #ff2e63;">10 minutes</strong>
                </p>
              </div>

              <!-- Instructions -->
              <div style="background: #f8fafc; border-left: 4px solid #ff2e63; border-radius: 8px; padding: 20px 24px; margin: 0 0 32px 0;">
                <p style="margin: 0 0 12px 0; color: #1e293b; font-size: 14px; font-weight: 600;">
                  📝 Next Steps:
                </p>
                <ol style="margin: 0; padding-left: 20px; color: #64748b; font-size: 14px; line-height: 1.8;">
                  <li>Enter this code on the verification page</li>
                  <li>Create your new password</li>
                  <li>Sign in with your new credentials</li>
                </ol>
              </div>

              <!-- Security Notice -->
              <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 16px 20px; margin: 0 0 24px 0;">
                <p style="margin: 0; color: #9a3412; font-size: 13px; line-height: 1.6;">
                  <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email or contact support if you have concerns.
                </p>
              </div>

              <!-- Footer Text -->
              <p style="margin: 0; color: #94a3b8; font-size: 13px; text-align: center; line-height: 1.6;">
                This is an automated message from SunMoonie.<br>
                Please do not reply to this email.
              </p>
            </td>
          </tr>

          <!-- Footer with Cosmic Theme -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 32px 40px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 600;">
                ✨ Harmonize your workflow with SunMoonie
              </p>
              <p style="margin: 0; color: rgba(255, 255, 255, 0.6); font-size: 12px;">
                © ${new Date().getFullYear()} SunMoonie. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Plain text version for email clients that don't support HTML
export function getVerificationCodeText(code) {
  return `
SunMoonie - Password Reset Request

Your verification code is: ${code}

This code expires in 10 minutes.

Next Steps:
1. Enter this code on the verification page
2. Create your new password
3. Sign in with your new credentials

If you didn't request this password reset, please ignore this email.

© ${new Date().getFullYear()} SunMoonie
  `.trim();
}
