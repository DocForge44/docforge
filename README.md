# DocForge — Deployment Guide

## What's in this folder

```
docforge/
├── index.html          ← App entry point
├── package.json        ← Dependencies
├── vite.config.js      ← Build config
├── vercel.json         ← Deployment config
├── src/
│   ├── main.jsx        ← React entry
│   └── App.jsx         ← The full app
└── api/
    └── generate.js     ← Secure AI proxy (serverless function)
```

---

## STEP 1 — Get your Anthropic API key (5 min)

1. Go to https://console.anthropic.com
2. Sign in or create an account
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)
5. Save it somewhere safe — you'll need it in Step 3

---

## STEP 2 — Deploy to Vercel (10 min)

### Option A: GitHub (recommended)
1. Create a free account at https://github.com
2. Create a new repository called `docforge`
3. Upload all these files (drag & drop in GitHub's web UI)
4. Go to https://vercel.com → Sign up with GitHub
5. Click **Add New Project** → Import your `docforge` repo
6. Leave all settings as default → Click **Deploy**

### Option B: Vercel CLI (fastest if you have Node.js)
```bash
npm install -g vercel
cd docforge
npm install
vercel --prod
```

---

## STEP 3 — Add your API key to Vercel (2 min)

1. In Vercel dashboard, go to your project → **Settings** → **Environment Variables**
2. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key from Step 1
3. Click **Save**
4. Go to **Deployments** → click the three dots on your latest deploy → **Redeploy**

Your app is now live at `https://docforge-xxxx.vercel.app` ✅

---

## STEP 4 — Add a custom domain (5 min, optional but recommended)

1. Buy a domain at https://namecheap.com (search `docforge.ai` or `getdocforge.com`, ~$12/yr)
2. In Vercel: **Settings** → **Domains** → Add your domain
3. Follow Vercel's DNS instructions (copy 2 records to Namecheap)
4. Done in ~10 minutes

---

## STEP 5 — Set up payments with Stripe (15 min)

### The fastest way: Stripe Payment Links (no code needed)

1. Go to https://stripe.com → Create account
2. Go to **Payment Links** → **Create Link**
3. Create a product:
   - Name: "DocForge — Document Generation"
   - Price: $9 one-time (or $19/month for subscription)
4. Copy your payment link URL
5. In `src/App.jsx`, find the hero section and add a "Get Access" button linking to your Stripe URL

### Later upgrade: Full Stripe integration
Once you have revenue, ask DocForge AI (me) to build a full Stripe checkout + access gate.

---

## STEP 6 — Launch (30 min)

Post in these places TODAY:

**Reddit:**
- r/Entrepreneur — "I built an AI document generator for small businesses — feedback welcome"
- r/freelance — "Free tool: generate freelance contracts in 30 seconds"
- r/smallbusiness — "Made a free privacy policy / contract generator"

**Other:**
- Product Hunt — submit at https://www.producthunt.com/posts/new
- Indie Hackers — https://www.indiehackers.com/post/new
- Twitter/X — short demo video gets the most traction

**Launch copy template:**
```
I built DocForge — an AI tool that generates professional business documents 
(privacy policies, NDAs, freelance contracts, SOPs) in under 30 seconds.

No more paying lawyers $300/hr for boilerplate docs.

Free to try: [YOUR URL]

Built with React + Claude AI + Vercel
```

---

## Cost structure (your margins)

| Item | Cost |
|------|------|
| Vercel hosting | Free (up to 100GB bandwidth) |
| Anthropic API | ~$0.05–0.15 per document generated |
| Domain | $12/year |
| **Your price per doc** | **$9** |
| **Margin per doc** | **~$8.85 (98%)** |

---

## Questions? 
Ask DocForge (Claude) to help you with any step.
