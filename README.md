# Cycle Wellness App

A deployment-ready React/Vite web app for period tracking, phase-based wellness guidance, daily activity tracking, food ideas, hydration, sleep, and intermittent fasting.

## Included features

- Period tracking and cycle calendar
- Predicted ovulation and fertile window
- Chance of pregnancy estimate
- Menstrual, follicular, ovulation, and luteal phase detection
- Phase-based supplement, diet, and exercise guidance
- Daily symptoms and notes check-in
- Local history tracking
- Steps, active minutes, calories, distance, sleep, weight, and water tracking
- Food search UI and barcode scan placeholder button
- Intermittent fasting tracker
- Local storage persistence
- WordPress embed friendly after hosting

## Run locally

1. Install Node.js 18+
2. Open this folder in terminal
3. Run:

```bash
npm install
npm run dev
```

## Build for deployment

```bash
npm install
npm run build
```

The production files will be created in `dist/`.

## Easiest deployment for a non-developer

### Option A: Vercel

1. Create a free Vercel account.
2. Create a new project.
3. Upload this project folder or import it from GitHub.
4. Framework preset: **Vite**
5. Build command: `npm run build`
6. Output directory: `dist`
7. Deploy.

### Option B: Netlify

1. Create a free Netlify account.
2. Add new site.
3. Upload this project folder or connect GitHub.
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy.

## Add to WordPress

After deployment, copy your live app URL and paste this into a **Custom HTML** block in WordPress:

```html
<iframe
  src="https://your-live-app-url.com"
  width="100%"
  height="920"
  style="border:none;border-radius:24px;overflow:hidden;"
  loading="lazy"
></iframe>
```

## Important note

This package is front-end only.

These are not included yet and would require extra work later:

- real user accounts and cloud sync
- real barcode scanning and camera integration
- Apple Health or Samsung Health sync
- reminders / push notifications
- subscriptions / payments
- backend database
