# TradLink 🪁

a simple, free, and opensource alternative to Linktree.

> **Warning**
> As of May 4th, 2025, new account creation has been temporarily disabled due to an increase in phishing attempts. We take the security of our users seriously and are implementing enhanced threat detection and anti-phishing measures. We expect to resume new signups by June 1st with these improved security features in place. Existing accounts remain fully functional.

## 🚀 Getting Started

#### TradLink Hosted

- Head to [tradlink.com](https://tradlink.com)
- Hit the `Get Started` button
- Sign up with Github, Google, or Email
- Follow the onboarding steps to create your first link

#### Self Hosted

- Clone the [tradlink repo](httsp://github.com/aleemrehmtulla/kytelink) and run `npm install`
- Follow the `.env.example` file to create your own `.env` file
- Set up your database by running `npx prisma migrate dev --name init` and `npx prisma generate`
- Run `npm run dev` to start the development server

When setting it up, all environment variables are optional at build-time, but required througout usage. For example, if you don't want to include Github or Google authentication, you can leave those variables blank. However, if you try to use them, it will throw an error.

**Email Configuration**: TradLink uses SMTP for sending magic link authentication emails. Configure the `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` environment variables to enable email authentication. This works with any SMTP provider like Gmail, SendGrid, Mailgun, etc.

## 📝 Features

- [x] Customizable links and icons
- [x] Over 9 beautiful themes
- [x] Advanced analytic engine
- [x] Use custom domains for free
- [x] Fully self-hostable and open source
- [x] Blazingly fast using SSR

## 📦 Built With

- [Next.js](https://nextjs.org/)
- [Chakra UI](https://chakra-ui.com/)
- [Prisma](https://prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Vercel](https://vercel.com/)
- [Cloudflare](https://cloudflare.com/)

## ✨ Developer Notes

- This project is still in early development, so there may be bugs 🐛
- If you have any questions, feel free to reach out to me on [Twitter](https://twitter.com/aleemrehmtulla) 🍉

<br />

**tradlink is completely free for all features**

**if you end up using it, consider tossing a star ⭐**
