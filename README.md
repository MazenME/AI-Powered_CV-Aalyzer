# HireLens — AI-Powered CV Analyzer

HireLens is a full‑stack React Router application with puter a Service (BaaS) that scores resumes (CVs) against a target job, provides ATS insights, and suggests concrete improvements. Upload a PDF resume, add the job title/company/description, and get an instant, structured review with an ATS score and actionable feedback.

> Current local date/time: 2025-09-11 03:38

## Key Features

- PDF upload with drag & drop, preview, and validation
- Automatic PDF → image conversion for analysis
- AI analysis with structured JSON feedback
- ATS score and section‑by‑section recommendations
- Resume history persisted locally (view previous analyses)
- TypeScript, Tailwind CSS, React Router v7, Vite HMR

## Tech Stack

- React 19 + React Router 7 (SSR-ready)
- TypeScript
- Puter
- Vite 6
- Tailwind CSS 4
- Zustand for state management

## Project Structure (high level)

- `app/components/` UI components (Navbar, Summary, Details, etc.)
- `app/routes/` route files (Home, Upload, Resume view)
- `app/lib/puter.ts` storage, auth, AI helpers (Zustand store)
- `public/` static assets (images/icons)

## Prerequisites

- Node.js 18+ (recommended LTS) and npm or yarn
- No external keys required to run locally by default

## Setup

1. Install dependencies
   - npm install
   - or: yarn install

2. Start the dev server
   - npm run dev
   - App runs at http://localhost:5173

3. Type checking (optional)
   - npm run typecheck

4. Build for production
   - npm run build

5. Start production server (after build)
   - npm start

## Usage Guide

1. Authenticate (automatic/local) and go to Upload
   - Use the Navbar "Upload CV" button, or navigate to /upload

2. Fill in job context
   - Job Title (required)
   - Company Name (optional)
   - Job Description (optional, improves accuracy)

3. Upload your resume (PDF)
   - Drag & drop or click the upload area
   - The app will convert the first page to an image for analysis

4. Analyze
   - Click "Analyze Resume"
   - You’ll see a processing indicator, then be redirected to `/resume/:id`

5. Review results
   - Summary: key strengths and areas to improve
   - ATS: score and compatibility insights
   - Details: section‑level recommendations

6. View history on Home
   - Previously analyzed resumes appear on the Home page with quick access

## Troubleshooting

- Upload errors
  - Ensure the file is a valid PDF and not empty/corrupt.
- Blank feedback
  - Re‑run analysis; ensure Job Title is provided.
- Stuck on loading
  - Hard refresh the page; stop and restart `npm run dev`.

## Scripts

- dev: react-router dev (Vite dev server with HMR)
- build: react-router build
- start: react-router-serve ./build/server/index.js
- typecheck: react-router typegen && tsc

## Docker (optional)

Build and run locally:

- docker build -t hirelens .
- docker run -p 3000:3000 hirelens

Then visit http://localhost:3000

## License

MIT — see LICENSE if provided. Otherwise, treat as proprietary for now.

## Acknowledgements

Built with React Router, Vite, and Tailwind CSS.
