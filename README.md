# TSRG Landing Engine

Config-driven real estate landing page system for **The Smith Realty Group**.  
Six UTM-targeted campaigns, lead scoring, Agent Locator CRM via Zapier, PostgreSQL lead database.

---

## Deploy Free on Railway (Recommended)

Railway hosts the app and database for free. Every time you push to GitHub (or edit a file on GitHub.com), it redeploys automatically in about 60 seconds.

### One-time setup (15 minutes)

**1. Create a Railway account**  
Go to [railway.app](https://railway.app) → **Login with GitHub**

**2. Create a new project**  
Click **New Project** → **Deploy from GitHub repo** → select `tsrg-landing-engine`

**3. Add a PostgreSQL database**  
Inside your project → **+ New** → **Database** → **Add PostgreSQL**  
Railway automatically sets `DATABASE_URL` — you don't need to copy anything.

**4. Set environment variables**  
Click your app service → **Variables** tab → add these:

```
ZAPIER_WEBHOOK_URL   = https://hooks.zapier.com/hooks/catch/YOUR_ID/PLACEHOLDER/
ADMIN_PASSWORD       = choose-a-strong-password
SITE_BASE_URL        = https://your-app.up.railway.app
GA4_MEASUREMENT_ID   = G-XXXXXXXXXX
```

**5. Deploy**  
Railway builds and deploys automatically. Click **View Logs** to watch it start.  
Your live URL appears in the **Settings** tab under **Domains**.

That's it. The database tables are created automatically on first boot.

---

## Edit Content From GitHub (No Code Required)

Every commit to `main` redeploys automatically. You can edit files directly in the GitHub web editor.

### Files you'll edit most

| File | What it controls |
|---|---|
| [`backend/config/contentConfig.js`](backend/config/contentConfig.js) | All headlines, CTAs, form fields, features, testimonials, colours |
| [`backend/config/siteConfig.js`](backend/config/siteConfig.js) | Phone, email, logo, GA4, RECO/brokerage details |

### How to edit on GitHub

1. Click the file above
2. Click the **pencil icon** (top right)
3. Make your change
4. **Commit changes** at the bottom
5. Railway redeploys — live in ~60 seconds

---

## Admin Panel

Go to `/admin` on your live URL. Password is whatever you set as `ADMIN_PASSWORD`.

- **Leads tab** — every form submission, colour-coded by score, filterable by campaign, CSV export
- **Campaign tabs** — edit any headline, CTA, or testimonial without touching code

---

## Campaigns

Each campaign is driven by `utm_campaign` in the ad URL.

| Campaign key | Who sees it | Qualifying fields |
|---|---|---|
| `foreclosure-access` | Distressed property buyers | Purchase timeline, Financing |
| `seller` | Homeowners selling | Property address, Timeline, Listing status |
| `home-evaluation` | Sellers wanting a valuation | Property address, Bedrooms, Reason |
| `first-time-buyer` | First-time buyers | Budget, Pre-approval, Timeline |
| `investment-buyers` | Investors | Budget, Financing |
| `senior-downsizing` | Seniors / families | Move timeline, Who is moving |

**Example ad URL:**
```
https://your-app.up.railway.app/?utm_campaign=seller&utm_source=google&utm_medium=cpc&utm_term=Etobicoke
```

---

## Local Development

```bash
npm install
cp .env.example .env   # fill in values
npm run dev            # auto-reloads on save
```

Open `http://localhost:3000` — works without a database (falls back to JSON file).

---

## Moving to Your Own Server Later

When you're ready for a paid VPS, add these four secrets to your GitHub repo  
(**Settings → Secrets and variables → Actions**):

| Secret | Value |
|---|---|
| `DEPLOY_HOST` | Server IP |
| `DEPLOY_USER` | SSH username |
| `DEPLOY_KEY` | SSH private key |
| `DEPLOY_PATH` | Repo path on server |

Then `docker compose up -d` on the server — the GitHub Actions workflow in this repo takes over.

---

## Project Structure

```
backend/
  config/
    contentConfig.js   ← ALL page content lives here
    siteConfig.js      ← Phone, email, logo, GA4, Zapier
  lib/
    db.js              ← PostgreSQL connection pool
    migrations.js      ← Auto-creates tables on startup
    contentOverrides.js← DB-backed content overrides (JSON fallback locally)
  routes/
    leads.js           ← Saves lead to DB, forwards to Zapier
    admin.js           ← /admin routes + leads API + CSV export
frontend/
  views/
    admin.ejs          ← Admin panel (leads table + content editor)
    partials/          ← hero, lead-form, features, footer…
.github/workflows/
  deploy.yml           ← SSH auto-deploy (activates when secrets are set)
Dockerfile
docker-compose.yml     ← Local Docker with PostgreSQL
```
