# House Hunters 🏡


A small, static site for tracking houses I'm considering buying. Map on the right, filterable sidebar list on the left. All data lives in a single JSON file.

Stack: Vite + React + TypeScript + Tailwind + React-Leaflet (OpenStreetMap tiles, no API key).

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Add a new house

Edit [`src/data/houses.json`](src/data/houses.json) and add an entry. Each house needs:

```json
{
  "id": "unique-slug",
  "address": "Street 1, Neighborhood, City",
  "lat": 59.4370,
  "lng": 24.7536,
  "price": 450000,
  "bedrooms": 3,
  "bathrooms": 2,
  "sqm": 95,
  "status": "interested",
  "notes": "Any notes for yourself",
  "listingUrl": "https://...",
  "photos": ["https://..."]
}
```

Valid `status` values: `interested`, `viewing-scheduled`, `visited`, `offer-made`, `rejected`.

**Getting lat/lng:**
- **Google Maps**: right-click anywhere on the map — the first item in the context menu is the `lat, lng` pair. Click it to copy.
- **Nominatim** (open-source): https://nominatim.openstreetmap.org/ui/search.html — search the address, copy the coordinates from the result.

`id` must be unique across the file. `photos` is optional — omit it or use `[]` if you don't have any.

## Deploy to GitHub Pages

1. Push this project to a GitHub repo (e.g. `github.com/<you>/house-hunters`).
2. In [`vite.config.ts`](vite.config.ts), set `base` to `'/<repo-name>/'`. For example: `base: '/house-hunters/'`.
3. On GitHub → **Settings** → **Pages**, set **Source** to **GitHub Actions**.
4. Push to `main`. The workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) will build and publish automatically.

The deployed URL will be `https://<you>.github.io/<repo-name>/`.
