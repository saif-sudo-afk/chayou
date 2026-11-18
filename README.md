# CHAYOU JEWELS 💎

Full-stack e-commerce website for a Moroccan jewelry brand: product catalog, shopping cart, order flow with WhatsApp notifications, and an admin back-office to manage delivery and site settings.




## Objectives

- Give a small jewelry business its own online store, in MAD (Moroccan dirham).
- Let the owner manage delivery rules and site content without touching the code.
- Notify the owner instantly when a customer places an order.

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling / UI | Tailwind CSS, shadcn/ui components |
| Database / ORM | Drizzle ORM (migrations in `/drizzle`) |
| Notifications | WhatsApp API (order alerts) |
| Analytics / Hosting | Vercel Analytics, Vercel |

## Features

- **Storefront**: branded homepage with hero banner, product categories, product packs and a small-items menu category.
- **Cart and orders**: customers build a cart and place an order.
- **Free delivery threshold**: delivery is free above 300 MAD, with the amount configurable.
- **WhatsApp order notifications**: each new order is sent to the owner via the WhatsApp API.
- **Admin panel**: delivery control and site settings managed from the back-office.
- **Responsive UI**: redesigned interface working on mobile and desktop.

## Skills demonstrated

- Building a complete product end to end: UI, data layer, admin and deployment.
- Modeling a database and managing schema migrations with Drizzle.
- Integrating a third-party API (WhatsApp) for a real business need.
- Configuration through environment variables (`.env.example` provided).
- Iterating on a real project: redesigns, bug fixes (pack images) and business-rule changes.

## Getting started

```bash
git clone https://github.com/saif-sudo-afk/chayou.git
cd chayou
npm install
cp .env.example .env   # fill in your database and WhatsApp API values
npm run dev
```

Open http://localhost:3000.

## Project structure

```
app/          Pages and routes (Next.js App Router)
components/   Reusable UI components
drizzle/      Database schema and migrations
hooks/        Custom React hooks
lib/          Business logic and helpers
public/       Static assets
scripts/      Utility scripts
```

## Author

**Saif-Eddine Bahiri** — [GitHub](https://github.com/saif-sudo-afk)
