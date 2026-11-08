#!/usr/bin/env node
// One-off: generate AI postcard illustrations for missing Oceania city slots
// via Black Forest Labs FLUX 3 (flux-3-image), then write JPEGs into public/cities.
import { writeFile, mkdir, readFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import sharp from "sharp";

const KEY = process.env.BFL_API_KEY;
if (!KEY) throw new Error("BFL_API_KEY not set");

const W = 1920;
const H = 1080;

const STYLE =
  "Photorealistic travel photograph, shot on a full-frame DSLR with a 24mm lens at f/8, " +
  "natural daylight, crisp realistic detail, true-to-life colours, documentary travel-photography look, " +
  "high dynamic range, no HDR halos. Real tourists and local people going about their day in the middle distance, " +
  "natural candid poses, nobody looking at the camera or posing. " +
  "This is a photograph, not an illustration: no painting, no drawing, no cartoon, no CGI, no 3D render, no stylisation. " +
  "No text, no letters, no words, no captions, no logos, no watermark, no borders, no frame.";

const JOBS = [
  {
    iso: "pg",
    city: "Milne Bay",
    slug: "milne-bay",
    scene:
      "Milne Bay, Papua New Guinea: a coral-fringed tropical bay with small lush green volcanic islands, " +
      "turquoise shallows fading to deep blue water, wooden jetty with traditional outrigger canoes moored, " +
      "handmade clay pots laid out on the sand, a group of local fishermen and a few visitors walking along the waterfront, " +
      "green mountains in the background.",
  },
  {
    iso: "pg",
    city: "Sepik",
    slug: "sepik",
    scene:
      "The Sepik River, Papua New Guinea: a wide river through dense tropical rainforest, " +
      "a tall traditional spirit house (haus tambaran) with a carved facade on the riverbank, " +
      "long dugout canoes with local paddlers on the water, people standing on the muddy bank, " +
      "wooden carvings and thatched roofs of a riverside village, soft morning light.",
  },
  {
    iso: "sb",
    city: "Makira",
    slug: "makira",
    scene:
      "Makira island, Solomon Islands: a turquoise cove with a village of thatched-roof stilt houses over the water, " +
      "palm trees and rainforest hills along the shore, outrigger canoes tied to the walkways, " +
      "local villagers and a couple of travellers on the wooden boardwalk, bright tropical daylight.",
  },
  {
    iso: "vu",
    city: "Banks",
    slug: "banks",
    scene:
      "The Banks Islands, Vanuatu: volcanic green islands rising from a deep blue Pacific lagoon, " +
      "a white-sand beach with coconut palms, traditional outrigger canoes pulled onto the shore, " +
      "thatched huts among the trees, a few local people and visitors on the beach, gentle clouds.",
  },
  {
    iso: "vu",
    city: "Malekula",
    slug: "malekula",
    scene:
      "Malekula island, Vanuatu: a tropical coastline with dark volcanic sand and dense jungle-covered hills, " +
      "a village of thatched huts with carved wooden posts, sand drawings traced on the beach, " +
      "local villagers in colourful island dress and a small group of tourists looking on, warm late-afternoon light.",
  },
];

async function submit(prompt) {
  const res = await fetch("https://api.bfl.ai/v1/flux-3-image", {
    method: "POST",
    headers: { "x-key": KEY, "content-type": "application/json" },
    body: JSON.stringify({ prompt, width: W, height: H }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`submit ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

async function poll(pollingUrl) {
  for (let i = 0; i < 120; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(pollingUrl, { headers: { "x-key": KEY } });
    const json = await res.json();
    if (json.status === "Ready") return json.result.sample;
    if (json.status === "Error" || json.status === "Failed")
      throw new Error(`generation failed: ${JSON.stringify(json)}`);
  }
  throw new Error("poll timeout");
}

async function run(job) {
  const prompt = `${job.scene} ${STYLE}`;
  const started = Date.now();
  const { polling_url, cost } = await submit(prompt);
  console.log(`[${job.iso}] ${job.city}: submitted (cost ${cost})`);
  const sample = await poll(polling_url);
  const buf = Buffer.from(await (await fetch(sample)).arrayBuffer());
  const dest = join("public", "cities", job.iso, `${job.slug}-0.jpg`);
  await mkdir(dirname(dest), { recursive: true });
  const jpg = await sharp(buf).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
  await writeFile(dest, jpg);
  const meta = await sharp(dest).metadata();
  console.log(
    `[${job.iso}] ${job.city}: wrote ${dest} ${meta.width}x${meta.height} ` +
      `${(jpg.length / 1024).toFixed(0)}KB in ${((Date.now() - started) / 1000).toFixed(0)}s`,
  );
}

const targets = process.argv.slice(2);
const todo = targets.length ? JOBS.filter((j) => targets.includes(j.slug)) : JOBS;
for (const job of todo) {
  try {
    await run(job);
  } catch (e) {
    console.error(`[${job.iso}] ${job.city}: FAILED ${e.message}`);
  }
}
