# Multi-Company Email Signature Generator

Internal MERN application that produces Outlook + Gmail ready email signatures for ONEPWS, WMSPL, and PWS Floor without changing the approved HTML structure.

## Stack

- MongoDB + Mongoose for persistence
- Express.js REST API
- React 19 + Vite + Tailwind CSS (Space Grotesk)
- Lucide icons

## Project Structure

```
.
├── server          # Express API, template renderer, Mongo models
├── client          # React dashboard + generator UI
└── one pws (...).htm   # Original template copy (kept for reference)
```

## Getting Started

1. **Environment**
   ```bash
   # server/.env
   cp server/.env.example server/.env
   # client/.env
   cp client/.env.example client/.env
   ```
   Update `MONGODB_URI`, `PORT`, and `VITE_API_BASE_URL` as needed.

2. **Install & Run**
   ```bash
   # API
   cd server
   npm install
   npm run dev

   # Frontend
   cd ../client
   npm install
   npm run dev
   ```

   The client expects the API at `http://localhost:5000/api` by default.

## Key Features

- Sidebar dashboard with analytics, creation flow, full directory, edit center, template view, and export actions.
- Company selector auto-fills company name, website, and switches logos stored under `client/src/assets` (encoded in `client/src/constants/logoData.js` for inline delivery).
- Company-specific HTML templates live under `server/templates/` (`signature-onepws.html`, `signature-wmspl.html`, `signature-pwsfloor.html`). The renderer swaps placeholders (name, logo, widths, tagline, etc.) without touching the structure Outlook/Gmail expect.
- Live preview panel renders the generated signature through `dangerouslySetInnerHTML`. Buttons let users copy HTML or download an `.html` file.
- MongoDB stores every generated signature, including the final HTML snippet and metadata (company, counts, timestamps).
- Dashboard exposes total signatures, company-wise counts, and the five most recent entries.
- All signatures table supports search + company filters with pagination, edit shortcuts, and HTML copy helpers.
- Edit hub lets users search and jump into the edit form for any record. `PUT /api/signatures/:id` regenerates HTML through the same template logic.
- Template view exposes the locked read-only templates, while Export offers CSV/JSON dumps for compliance backups.

## API Summary

| Method | Endpoint                    | Description                                  |
|--------|-----------------------------|----------------------------------------------|
| GET    | `/api/template`             | Returns the raw placeholder template (use `?company=` for variants) |
| GET    | `/api/signatures`           | List with search + filter params             |
| POST   | `/api/signatures`           | Create a signature and persist HTML          |
| GET    | `/api/signatures/:id`       | Fetch a single signature                     |
| PUT    | `/api/signatures/:id`       | Update a signature, regenerating HTML        |
| GET    | `/api/signatures/stats`     | Dashboard metrics                            |
| GET    | `/api/signatures/export`    | CSV (default) or JSON export (`?format=`)    |

## Notes

- Only white, black, grey, and branded red (#D4292B) are used to meet the requested palette.
- The provided Outlook/Gmail-safe HTML wasn’t structurally modified—only placeholder tokens were inserted, now with per-company template copies to support bespoke tweaks (text removal, logo sizing, colors).
- Logos are stored as PNG assets and pre-encoded as `data:` URIs so email clients can render them without external hosting.
