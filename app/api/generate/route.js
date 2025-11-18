import Parser from "rss-parser";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateContent } from "../../../lib/generator";

const schema = z.object({
  niche: z.string().min(2).max(60),
  language: z.enum(["en", "hi", "hing"]).default("hing"),
  durationSec: z.number().min(10).max(120).default(30),
  emotion: z.enum(["low", "medium", "high"]).default("high"),
  controversy: z.enum(["low", "medium", "high"]).default("medium"),
  count: z.number().min(1).max(5).default(3),
  platforms: z.array(z.string()).min(1),
  tone: z.enum(["high-energy", "educational", "story", "motivational"]).default("high-energy"),
});

async function fetchTrendingTopics(query, geo) {
  const parser = new Parser();
  const feeds = [
    `https://trends.google.com/trends/trendingsearches/daily/rss?geo=${geo}`,
  ];
  const titles = [];
  for (const url of feeds) {
    try {
      const feed = await parser.parseURL(url);
      for (const item of feed.items || []) {
        if (item.title) titles.push(item.title);
      }
    } catch (e) {
      // ignore
    }
  }
  // lightweight filter by query token if provided
  const q = (query || "").toLowerCase();
  const filtered = q
    ? titles.filter((t) => t.toLowerCase().includes(q.split(" ")[0]))
    : titles;
  return Array.from(new Set(filtered)).slice(0, 20);
}

function fallbackTopics(niche) {
  const bank = [
    `Top 5 ${niche} myths debunked`,
    `${niche} mistakes people still make`,
    `${niche} hacks that still work in 2025`,
    `The brutal truth about ${niche}`,
    `${niche} checklist you can steal today`,
    `${niche} roadmap in 30 seconds`,
  ];
  return bank;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const inputs = schema.parse({
      ...body,
      durationSec: Number(body.durationSec),
      count: Number(body.count),
    });

    // Fetch trending from multiple geos and merge
    const [inTrends, usTrends] = await Promise.all([
      fetchTrendingTopics(inputs.niche, "IN"),
      fetchTrendingTopics(inputs.niche, "US"),
    ]);

    const pool = Array.from(new Set([...(inTrends || []), ...(usTrends || [])]));
    const topics = (pool.length ? pool : fallbackTopics(inputs.niche)).slice(0, inputs.count);

    const items = generateContent({ items: topics, inputs });

    return NextResponse.json({ items }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e?.message || "Invalid request" }, { status: 400 });
  }
}
