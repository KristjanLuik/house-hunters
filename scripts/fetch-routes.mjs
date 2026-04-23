#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, '..', 'src', 'data');

const KEY = process.env.ORS_API_KEY;
if (!KEY) {
  console.error('ORS_API_KEY is not set. Run with: node --env-file=.env scripts/fetch-routes.mjs');
  process.exit(1);
}

const MODES = ['driving-car', 'foot-walking'];
const DELAY_MS = 500;

const houses = JSON.parse(await readFile(resolve(dataDir, 'houses.json'), 'utf8'));
const places = JSON.parse(await readFile(resolve(dataDir, 'places.json'), 'utf8'));

const out = [];
const failures = [];

for (const house of houses) {
  for (const place of places) {
    for (const mode of MODES) {
      const url = `https://api.openrouteservice.org/v2/directions/${mode}/geojson`;
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: KEY,
            'Content-Type': 'application/json',
            Accept: 'application/geo+json, application/json',
          },
          body: JSON.stringify({
            coordinates: [
              [house.lng, house.lat],
              [place.lng, place.lat],
            ],
            instructions: false,
          }),
        });
        if (!res.ok) {
          const body = await res.text();
          throw new Error(`${res.status} ${body.slice(0, 200)}`);
        }
        const data = await res.json();
        const feat = data.features[0];
        const { distance, duration } = feat.properties.summary;
        out.push({
          houseId: house.id,
          placeId: place.id,
          mode,
          distance_m: distance,
          duration_s: duration,
          geometry: feat.geometry,
        });
        console.log(
          `OK  ${house.id} → ${place.id} (${mode}): ${distance.toFixed(0)}m ${duration.toFixed(0)}s`,
        );
      } catch (err) {
        failures.push({ houseId: house.id, placeId: place.id, mode, err: String(err) });
        console.error(`ERR ${house.id} → ${place.id} (${mode}): ${err}`);
      }
      await sleep(DELAY_MS);
    }
  }
}

const outPath = resolve(dataDir, 'routes.json');
await writeFile(outPath, JSON.stringify(out));
console.log(`\nWrote ${out.length} routes to ${outPath}`);
if (failures.length) {
  console.error(`${failures.length} failed:`);
  for (const f of failures) console.error(`  ${f.houseId} → ${f.placeId} (${f.mode}): ${f.err}`);
  process.exit(1);
}
