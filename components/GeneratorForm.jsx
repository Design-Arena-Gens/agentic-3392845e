"use client";

import { useMemo, useState } from "react";
import ResultCard from "./ResultCard";

const platforms = [
  "Instagram Reels",
  "YouTube Shorts",
  "TikTok",
  "Facebook Reels",
];

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "hing", label: "Hinglish" },
];

export default function GeneratorForm() {
  const [form, setForm] = useState({
    niche: "finance",
    language: "hing",
    durationSec: 30,
    emotion: "high",
    controversy: "medium",
    count: 3,
    platforms: [platforms[0], platforms[1]],
    tone: "high-energy",
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => !!form.niche && form.count > 0, [form]);

  const togglePlatform = (p) => {
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(p)
        ? f.platforms.filter((x) => x !== p)
        : [...f.platforms, p],
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to generate");
      const data = await res.json();
      setResults(data.items || []);
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[380px,1fr]">
      <form onSubmit={onSubmit} className="card p-4 md:p-6 space-y-4 h-fit">
        <div>
          <label className="block text-sm mb-1">Niche / Topic</label>
          <input
            className="input"
            placeholder="e.g., fitness, crypto, travel, skincare"
            value={form.niche}
            onChange={(e) => setForm((f) => ({ ...f, niche: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              className={`btn ${
                form.language === l.code
                  ? "btn-primary"
                  : "bg-white/10 hover:bg-white/20"
              }`}
              onClick={() => setForm((f) => ({ ...f, language: l.code }))}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Duration (sec)</label>
            <select
              className="select"
              value={form.durationSec}
              onChange={(e) =>
                setForm((f) => ({ ...f, durationSec: Number(e.target.value) }))
              }
            >
              {[15, 30, 45, 60].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">How many ideas?</label>
            <select
              className="select"
              value={form.count}
              onChange={(e) =>
                setForm((f) => ({ ...f, count: Number(e.target.value) }))
              }
            >
              {[1, 2, 3, 4, 5].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Emotion</label>
            <select
              className="select"
              value={form.emotion}
              onChange={(e) => setForm((f) => ({ ...f, emotion: e.target.value }))}
            >
              {[
                { v: "high", l: "High" },
                { v: "medium", l: "Medium" },
                { v: "low", l: "Low" },
              ].map((o) => (
                <option key={o.v} value={o.v}>
                  {o.l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Controversy</label>
            <select
              className="select"
              value={form.controversy}
              onChange={(e) =>
                setForm((f) => ({ ...f, controversy: e.target.value }))
              }
            >
              {[
                { v: "high", l: "High" },
                { v: "medium", l: "Medium" },
                { v: "low", l: "Low" },
              ].map((o) => (
                <option key={o.v} value={o.v}>
                  {o.l}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Tone</label>
          <select
            className="select"
            value={form.tone}
            onChange={(e) => setForm((f) => ({ ...f, tone: e.target.value }))}
          >
            {["high-energy", "educational", "story", "motivational"].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">Platforms</label>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                className={`badge ${
                  form.platforms.includes(p)
                    ? "bg-brand-500 text-white"
                    : "bg-white/10"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary w-full" disabled={!canSubmit || loading}>
          {loading ? "Generating?" : "Generate"}
        </button>

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>

      <section className="space-y-4">
        {results.length === 0 && !loading && (
          <div className="card p-6">
            <p className="text-white/70">
              Start by entering your niche, choose language, duration and platforms. You'll get 3?5 viral hooks, a punchy script, caption, keywords, hashtags and thumbnail text per idea.
            </p>
          </div>
        )}
        {results.map((r, idx) => (
          <ResultCard key={idx} item={r} />
        ))}
      </section>
    </div>
  );
}
