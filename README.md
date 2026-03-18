# My Amazing Learner App

A mobile-first, AI-powered educational web application for children aged 3–11 and their parents.

Built for **My Amazing Learner Ltd** — Gosport, Hampshire, UK.

---

## About the App

The My Amazing Learner App is the digital companion to the MAL physical product range. It features:

- **Sparky AI Tutor** — powered by the Anthropic Claude API
- **Interactive Quiz** — 3 difficulty levels (Budding, Growing, Flourishing)
- **Progress Tracker** — animated progress bars across 6 learning areas
- **Craft Activities** — 6 cards linking digital activities to physical MAL products
- **Rewards System** — star counter and 8 unlockable badges
- **SEN Tools** — 6 accessibility-focused tool cards
- **Two Modes** — separate Parent and Child interfaces in one app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (Pages Router) |
| Language | JavaScript / JSX |
| Styling | CSS Custom Properties |
| Fonts | Baloo 2 + Nunito (Google Fonts) |
| AI | Anthropic Claude API (via secure backend proxy) |
| Storage | localStorage |
| Deployment | Vercel |
| Analytics | Vercel Analytics |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)
- An Anthropic API key (provided separately by MAL Ltd via secure channel)

---

## Local Development Setup

**1. Clone the repository**

```bash
git clone https://github.com/lomagundi-tech/My-Amazing-Learner-App.git
cd My-Amazing-Learner-App
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

Create a `.env.local` file in the project root:

```
ANTHROPIC_API_KEY=your_key_goes_here
```

> The API key will be provided by My Amazing Learner Ltd via a secure channel.
> Never commit this file — it is already listed in `.gitignore`.

**4. Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Description | Where to set |
|---|---|---|
| `ANTHROPIC_API_KEY` | Anthropic Claude API key for Sparky AI Tutor | `.env.local` (dev), Vercel Dashboard (production) |

> **Important:** The API key is handled exclusively by the backend proxy (`/api/chat`). It is never exposed to the browser or included in the client-side bundle.

---

## Project Structure

```
/
├── pages/
│   ├── index.js          ← Main app entry point
│   └── api/
│       └── chat.js       ← Secure Anthropic API proxy
├── src/
│   ├── components/       ← UI components (one per tab + layout)
│   ├── hooks/            ← useChat.js, useQuiz.js
│   ├── data/             ← Hardcoded quiz, craft, badge, market data
│   ├── styles/           ← tokens.css (design system), global.css
│   └── utils/            ← api.js, storage.js (localStorage helpers)
├── public/               ← Static assets (logo SVG)
├── .env.local            ← API key (git-ignored, never committed)
└── README.md
```

---

## Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Production — auto-deploys to Vercel |
| `develop` | Active development |
| `feature/*` | One branch per feature or phase |

**Commit message convention:**
- `feat: description` — new feature
- `fix: description` — bug fix
- `style: description` — visual/CSS changes

**Examples:**
- `feat: AI tutor backend proxy`
- `feat: quiz panel with star rewards`
- `fix: mode toggle coral colour`

---

## Deployment

The app is deployed on **Vercel** and will be accessible at:

```
https://app.myamazinglearner.co.uk
```

Production deployments happen automatically when changes are merged to `main`.
Preview deployments are generated for every push to `develop` and `feature/*` branches.

### Production environment variables

Set `ANTHROPIC_API_KEY` in the Vercel project dashboard under:
**Settings → Environment Variables → Production**

---

## Development Phases

| Phase | Focus | Status |
|---|---|---|
| Phase 1 | Core UI Shell — navigation, mode switcher, Home tab | In Progress |
| Phase 2 | Features + AI — all 7 tabs, Sparky tutor, quiz, rewards | Upcoming |
| Phase 3 | Polish + Launch — SEN tools, pricing UI, accessibility audit | Upcoming |

**Target go-live:** End of April 2026
**Soft launch:** May half-term 2026

---

## Sign-Off Process

At the end of each phase, a Vercel preview URL and written summary will be shared.
Please review within 2 business days and confirm approval before the next phase begins.

---

## Contact

**Development team:** lomagundi-tech
**Client:** My Amazing Learner Ltd
**Client contact:** hello@myamazinglearner.co.uk
**Client website:** [myamazinglearner.co.uk](https://myamazinglearner.co.uk)
