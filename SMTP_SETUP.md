# SMTP Email Setup Guide

After this migration, email authentication now uses SMTP instead of the Loops API. Here's how to set it up:

## 1. Choose an SMTP Provider

**Free Options:**
- **Gmail**: Use Gmail with app password (recommended for development)
- **Outlook/Hotmail**: Use Outlook.com SMTP

**Paid Options (recommended for production):**
- **SendGrid**: Reliable email delivery service
- **Mailgun**: Developer-friendly email API
- **Amazon SES**: AWS email service

## 2. Configure Environment Variables

Add these to your `.env` file:

### Gmail Example:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
```

### SendGrid Example:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
```

### Mailgun Example:
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASSWORD=your-mailgun-password
SMTP_FROM=noreply@yourdomain.com
```

## 3. Test Email Authentication

1. Start your application: `npm run dev`
2. Go to the authentication page
3. Try signing in with email
4. Check that you receive the magic link email

## Migration Notes

- **Before**: Used Loops API (`LOOPS_API_KEY`)
- **After**: Uses standard SMTP (any email provider)
- **Benefits**: Better self-hosting, no external API dependency
- **Compatibility**: All existing authentication flows work the same

The old `sendMagicLink` function is now deprecated and will throw an error if used. Email sending is now handled automatically by NextAuth's built-in SMTP provider.