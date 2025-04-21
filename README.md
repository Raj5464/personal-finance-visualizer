This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# 📄 CHANGELOG.md – Personal Finance Visualizer

## ✅ Stage 1 – Basic Transaction Tracking

### 1.0.0
- Initialized Next.js project
- Set up MongoDB connection
- Created basic transaction schema and API route to save transactions

### 1.0.1
- Built the `/dashboard/transactions` frontend
- Added form to input transactions (amount, category, date, note)
- Transactions saved to MongoDB

### 1.0.2
- Displayed all transactions in a table or card format
- Implemented fetching logic from the backend

---

## ✅ Stage 2 – Categories

### 2.0.0
- Added category dropdown in transaction form
- Updated backend to store and use categories

### 2.0.1
- Created `/api/transactions/categories` to aggregate by category
- Grouped transactions using MongoDB `$group`

### 2.0.2
- Implemented pie/bar charts to visualize category spend
- Improved frontend design and responsiveness

---

## ✅ Stage 3 – Budgeting

### 3.0.0
- Created `budgets` collection in MongoDB
- Designed budget input form with (category, amount, month)
- POST route created to save and update budgets

### 3.0.1
- Connected the budget form to backend
- Prevented duplicate budget entries (updated instead)

### 3.0.2
- Added month selector dropdown in UI
- Connected pie chart to show budget vs actual spend
- Pulled budget from `budgets`, spend from `transactions`

### 3.0.3
- Created 5 color-coded category cards
- Each card includes a month-year selector
- Chart shows comparison in red and pink

### 3.0.4
- Added delete option for each category’s budget
- Delete only affects budgets, not transactions

### 3.0.5
- Finalized layout design
- Synced chart and card updates after any CRUD operation
- Improved error handling in backend routes

---

## 🔮 Future Enhancements (Stage 4)

### Planned:
- NextAuth user authentication
- Budget overview summary
- CSV/PDF export options
- Alerts for budget overruns
- Personal finance goal tracking


