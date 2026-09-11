# Safeguarding Survey

Mobile-first bilingual (English / Simplified Chinese) parent and visitor safeguarding survey for DAIS, styled to align with Nord Anglia Education branding and ready for Vercel deployment.

## Development

```bash
npm install
npm run dev
```

## Submission endpoint

Set `SURVEY_WEBHOOK_URL` in Vercel to the HTTP endpoint that should receive survey submissions. The app sends JSON via `/api/submit` so the external endpoint is never exposed to the browser.
