# Email Service Configuration

## Current Setup: Resend (Recommended)

This project uses **Resend** for sending emails - a modern, developer-friendly email service with a generous free tier.

### Why Resend?

- ✅ **100% FREE** - 3,000 emails/month (no credit card required)
- ✅ **Production-ready** - Better deliverability than Gmail
- ✅ **Easy setup** - Just one API key needed
- ✅ **Great for Node.js** - Official SDK included

---

## Quick Start

### 1. Get Your API Key

1. Sign up at [resend.com](https://resend.com) (free, no credit card)
2. Go to **API Keys** → **Create API Key**
3. Copy your API key (starts with `re_...`)

### 2. Add to .env.local

```env
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM="SunMoonie" <onboarding@resend.dev>
```

### 3. Restart Server

```bash
npm run dev
```

### 4. Test It!

Go to `/forgot-password` and try the password reset flow!

---

## Detailed Setup Guide

See [RESEND_SETUP.md](./RESEND_SETUP.md) for:

- Step-by-step account creation
- Custom domain setup (optional)
- Troubleshooting tips
- Alternative free email services

---

## Alternative Services

If you prefer a different service, you can easily switch:

### Option 1: Keep Resend (Recommended)

Already configured! Just add your API key.

### Option 2: Use Nodemailer with SMTP

Install nodemailer and update `src/lib/email.js`:

```bash
npm install nodemailer
```

See the old implementation in git history or ask for help.

### Option 3: Use SendGrid

```bash
npm install @sendgrid/mail
```

Update `src/lib/email.js` to use SendGrid SDK.

---

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add `RESEND_API_KEY` to environment variables
2. (Optional) Set up custom domain in Resend
3. Update `RESEND_FROM` if using custom domain

**That's it!** Resend works seamlessly in production.

---

## Free Tier Limits

| Metric       | Limit     |
| ------------ | --------- |
| Emails/month | 3,000     |
| Emails/day   | 100       |
| API requests | Unlimited |

**Perfect for most apps!** 100 password resets/day is more than enough.

---

## Need More Emails?

If you exceed the free tier:

1. **Upgrade Resend** - $20/mo for 50,000 emails
2. **Use Brevo** - 9,000 free emails/month (see RESEND_SETUP.md)
3. **Combine services** - Use multiple free tiers

---

## Support

- 📖 [Resend Docs](https://resend.com/docs)
- 💬 [Resend Discord](https://resend.com/discord)
- 🐛 Issues? Check [RESEND_SETUP.md](./RESEND_SETUP.md) troubleshooting section
