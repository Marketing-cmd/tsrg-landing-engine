# TSRG Landing Engine

Config-driven real estate landing page system for **The Smith Realty Group**.  
Six UTM-targeted campaigns, lead scoring, Agent Locator CRM via Zapier, Docker-ready.

---

## Edit Content From GitHub (No Code Required)

Every push to `main` auto-deploys to your server. You can edit these files directly
in the GitHub web editor (click the pencil icon on any file) and changes go live in
about 60 seconds.

### The two files you will edit most often

| File | What it controls |
|---|---|
| [`backend/config/contentConfig.js`](backend/config/contentConfig.js) | All landing page text — headlines, subheadlines, CTA buttons, form fields, features, testimonials, trust badges, colours |
| [`backend/config/siteConfig.js`](backend/config/siteConfig.js) | Phone number, email, logo, GA4 ID, brokerage / RECO details, Zapier webhook URL |

### How to edit a file on GitHub

1. Open the file above
2. Click the **pencil icon** (top right of the file view)
3. Make your changes
4. Scroll down → **Commit changes** → write a short note → click **Commit changes**
5. GitHub Actions deploys automatically — live in ~60 seconds

---

## Campaigns

Each campaign is driven by `utm_campaign` in the ad URL.

| Campaign key | Who it targets | Key qualifying fields |
|---|---|---|
| `foreclosure-access` | Distressed property buyers | Purchase timeline, Financing status |
| `seller` | Homeowners ready to sell | Property address, Selling timeline, Listing status |
| `home-evaluation` | Sellers wanting a valuation | Property address, Bedrooms, Reason |
| `first-time-buyer` | First-time buyers | Budget, Pre-approval, Timeline |
| `investment-buyers` | Investors | Budget, Financing approach |
| `senior-downsizing` | Seniors and families | Move timeline, Who is moving |

**Example ad URL:**
```
https://yourdomain.com/?utm_campaign=seller&utm_source=google&utm_medium=cpc&utm_term=Etobicoke
```

---

## Admin Panel

`/admin` — password-protected content editor.  
Set `ADMIN_PASSWORD` in your `.env` file on the server.  
Changes made here are instant (no redeploy needed) and survive restarts.

---

## First-Time Server Setup

### 1. Clone and configure

```bash
git clone https://github.com/Marketing-cmd/tsrg-landing-engine
cd tsrg-landing-engine
cp .env.example .env
nano .env   # fill in your values
```

### 2. `.env` values

```
PORT=3000
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/YOUR_ID/PLACEHOLDER/
SITE_BASE_URL=https://yourdomain.com
ADMIN_PASSWORD=choose-a-strong-password
```

### 3. Start

```bash
docker compose up -d
```

---

## Auto-Deploy Setup (GitHub Actions)

Add these four **Secrets** to your GitHub repo:  
**Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Value |
|---|---|
| `DEPLOY_HOST` | Your server IP address |
| `DEPLOY_USER` | SSH username (e.g. `root` or `ubuntu`) |
| `DEPLOY_KEY` | Your SSH private key (the full contents of `~/.ssh/id_rsa`) |
| `DEPLOY_PATH` | Full path to the repo on the server (e.g. `/root/tsrg-landing-engine`) |

Once those are set, every commit to `main` — including edits made on GitHub.com —
will SSH into your server, pull the latest code, and rebuild the container.

---

## Local Development

```bash
npm install
cp .env.example .env
npm run dev      # starts with --watch (auto-reloads on file save)
```

Open `http://localhost:3000`

---

## Project Structure

```
backend/
  config/
    contentConfig.js   ← ALL page content lives here
    siteConfig.js      ← Phone, email, logo, GA4, Zapier
  middleware/
    contentResolver.js ← Merges default + campaign + overrides
    utmParser.js       ← Reads and persists UTM params (30-day cookie)
  routes/
    leads.js           ← Lead scoring, sanitization, Zapier POST
    admin.js           ← Password-protected /admin editor
frontend/
  public/css/          ← Stylesheets
  public/js/           ← Form handler, GA4 events, UTM tracker
  views/
    partials/          ← hero, lead-form, features, footer, etc.
.github/workflows/
  deploy.yml           ← Auto-deploy on push to main
Dockerfile
docker-compose.yml
```
