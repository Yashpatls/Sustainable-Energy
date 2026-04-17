# 🌿 EcoAI — Implementation Guide

## Project Overview

**EcoAI** is a web application that tracks the environmental impact of AI token usage. It calculates energy consumption (kWh), carbon emissions (gCO₂), and water usage, and provides tools to optimize and reduce that impact.

---

## Tech Stack

| Technology       | Purpose                          |
|------------------|----------------------------------|
| React 19         | Frontend UI framework            |
| Vite 8           | Development server & bundler     |
| Express.js       | Backend REST API server          |
| Recharts         | Bar chart data visualization     |
| Lucide React     | SVG icon library                 |
| Vanilla CSS      | Custom dark-theme design system  |
| JSON File        | Local database (database.json)   |

---

## Project Structure

```
sustanible Energy/
├── index.html              → HTML entry point (loads Google Fonts)
├── vite.config.js          → Vite config with React plugin
├── package.json            → Scripts & dependencies
├── server.js               → Express backend API (6 endpoints)
├── database.json           → Local JSON database (auto-created)
├── src/
│   ├── main.jsx            → React entry point (renders App)
│   ├── index.css           → Global CSS design system
│   ├── App.jsx             → Main application (all features)
│   └── components/
│       └── AuthScreen.jsx  → Login/Signup component
```

---

## Step 1: Project Setup

Created a React + Vite project and installed dependencies:

```bash
npx -y create-vite@latest ./ --template react
npm install react react-dom recharts lucide-react express cors
```

---

## Step 2: Global CSS Design System (`index.css`)

- **CSS Variables** — Colors, fonts, spacing defined as reusable tokens
- **Glassmorphism** — Frosted-glass card effect using `backdrop-filter: blur()`
- **Gradient Text** — Blue-to-green gradient on headings
- **Fixed Header** — Sticky navigation with blur background
- **Buttons** — Primary (solid blue pill) and Secondary (outlined) with hover lift
- **Animations** — `fadeInUp` and `fadeInDown` keyframes
- **Cursor Glow** — A 600px blue radial gradient that follows the mouse
- **Responsive** — Mobile layout adjustments at 768px breakpoint

---

## Step 3: Backend Server (`server.js`)

An Express.js REST API that reads/writes `database.json`:

| Endpoint                  | Purpose                              |
|---------------------------|--------------------------------------|
| `POST /api/signup`        | Register new user                    |
| `POST /api/login`         | Login with email & password          |
| `POST /api/social-login`  | Login via Google/Facebook/Microsoft  |
| `POST /api/update-tokens` | Save token usage & session log       |
| `POST /api/update-profile-pic` | Save profile picture (Base64)  |
| `GET  /api/stats/:name`   | Get user's stats                     |

- Frontend runs on **port 5173**, backend on **port 3000**
- CORS middleware enables cross-origin communication

---

## Step 4: Authentication Component (`AuthScreen.jsx`)

- **Email/Password** — Form with signup/login toggle
- **Social Login** — Mock popups for Google, Facebook, Microsoft
- **Flow:** User authenticates → API returns user data → App shows dashboard

---

## Step 5: Main Application (`App.jsx`)

### Core Formula

```
Energy (kWh)  = Tokens × 0.00005
Carbon (gCO₂) = Energy × 400
Water (ml)     = Tokens × 0.01
```

### App Sections

1. **Navigation Header** — Fixed top bar with links and profile button
2. **Hero Section** — Welcome message with animated CTA buttons
3. **Solutions Section** — Two cards explaining Token Optimization & Efficient AI Models
4. **Live Token Optimizer** — Type prompts → see real-time energy stats → Execute & Log to profile
5. **Green Mode** — Toggle that reduces token output by 40%
6. **Hardware Comparison** — Select 2 devices → Recharts bar chart compares energy & cost per 1M tokens
7. **Energy Calculator** — Adjust prompts, tokens, savings % → see daily energy/carbon impact
8. **User Profile** — Avatar, editable name, lifetime stats, badge system, session history

### Badge System

| Badge            | Requirement    |
|------------------|----------------|
| 🌱 Seedling      | 100 tokens     |
| ⚡ Spark         | 1,000 tokens   |
| 🌿 EcoWarrior    | 5,000 tokens   |
| 🏆 GreenChampion | 10,000 tokens  |

---

## How to Run

**Terminal 1 — Frontend:**
```bash
npm run dev
```
Opens at → http://localhost:5175

**Terminal 2 — Backend:**
```bash
node server.js
```
Runs at → http://localhost:3000

> Both servers must be running for the app to work fully.
