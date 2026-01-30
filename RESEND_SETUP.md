# Resend Email Setup Guide (FREE - Production Ready)

## Why Resend?

✅ **100% FREE** - 3,000 emails/month forever  
✅ **No credit card required**  
✅ **5-minute setup**  
✅ **Better deliverability** than Gmail  
✅ **Production-ready**  
✅ **Built for developers**

---

## Quick Setup (5 Minutes)

### Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Click **"Start Building"** or **"Sign Up"**
3. Sign up with your email (no credit card needed!)
4. Verify your email address

### Step 2: Get Your API Key

1. After logging in, go to **API Keys** in the dashboard
2. Click **"Create API Key"**
3. Give it a name (e.g., "SunMoonie Production")
4. Select **"Sending access"** permission
5. Click **"Add"**
6. **Copy the API key** (starts with `re_...`)

### Step 3: Add to Your Project

Open your `.env.local` file and add:

```env
# Resend Email Configuration
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM="SunMoonie" <onboarding@resend.dev>
```

**Important:** Replace `re_your_actual_api_key_here` with your actual API key!

### Step 4: Test It!

1. Restart your dev server (`npm run dev`)
2. Go to `/forgot-password`
3. Enter your email
4. Check your inbox! 📧

---

## Custom Domain (Optional - For Production)

By default, emails come from `onboarding@resend.dev`. To use your own domain:

### Step 1: Add Your Domain in Resend

1. Go to **Domains** in Resend dashboard
2. Click **"Add Domain"**
3. Enter your domain (e.g., `sunmoonie.com`)

### Step 2: Add DNS Records

Resend will show you DNS records to add. Add these to your domain provider:

- **MX records** (for receiving bounces)
- **TXT records** (for authentication)
- **CNAME records** (for DKIM)

### Step 3: Update Your .env.local

```env
RESEND_FROM="SunMoonie" <noreply@sunmoonie.com>
```

---

## Free Tier Limits

| Feature      | Free Tier       |
| ------------ | --------------- |
| Emails/month | **3,000**       |
| Emails/day   | **100**         |
| API Keys     | Unlimited       |
| Domains      | 1 custom domain |
| Team Members | 1               |

**Perfect for most apps!** 3,000 emails = ~100 password resets/day

---

## Alternative Free Options

If you need more emails:

### Brevo (9,000 emails/month)

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-email
SMTP_PASSWORD=your-brevo-smtp-key
```

### Mailgun (5,000 emails/month)

Requires credit card but won't charge for free tier.

---

## Troubleshooting

### "API key not found" error

- Make sure you copied the full API key (starts with `re_`)
- Check there are no extra spaces in `.env.local`
- Restart your dev server after adding the key

### Emails going to spam

- Use Resend's default domain (`onboarding@resend.dev`) for testing
- For production, set up a custom domain with proper DNS records
- Resend has excellent deliverability, so this is rare

### Rate limit exceeded

- Free tier: 100 emails/day, 3,000/month
- Upgrade to paid plan if you need more
- Or use multiple email services

---

## Production Checklist

- [ ] Sign up for Resend account
- [ ] Get API key from dashboard
- [ ] Add `RESEND_API_KEY` to production environment variables
- [ ] (Optional) Set up custom domain
- [ ] Test password reset flow
- [ ] Monitor email delivery in Resend dashboard

---

## Resend Dashboard Features

- 📊 **Email Analytics** - See delivery rates, opens, clicks
- 🔍 **Email Logs** - Debug failed emails
- 📧 **Email Testing** - Send test emails
- 🚨 **Webhooks** - Get notified of bounces/complaints

---

## Need Help?

- 📚 [Resend Documentation](https://resend.com/docs)
- 💬 [Resend Discord](https://resend.com/discord)
- 📧 [Resend Support](mailto:support@resend.com)

---

## Cost Comparison

| Service    | Free Tier   | Paid Plans Start At |
| ---------- | ----------- | ------------------- |
| **Resend** | 3,000/mo    | $20/mo (50k emails) |
| SendGrid   | 100/day     | $15/mo (40k emails) |
| Mailgun    | 5,000/mo    | $35/mo (50k emails) |
| AWS SES    | 62,000/mo\* | $0.10/1k emails     |

\*AWS SES free tier only if hosted on AWS EC2

**Winner: Resend** for ease of use and generous free tier! 🏆
