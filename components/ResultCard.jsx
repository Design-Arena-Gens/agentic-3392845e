"use client";

import { useState } from "react";

function CopyBtn({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="btn bg-white/10 hover:bg-white/20 text-white text-xs"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? "Copied!" : label}
    </button>
  );
}

export default function ResultCard({ item }) {
  const allText = [
    "Hooks:\n- " + item.hooks.join("\n- "),
    "Script:\n" + item.script,
    "Caption:\n" + item.caption,
    "Keywords:\n" + item.keywords.join(", "),
    "Hashtags:\n" + item.hashtags.join(" "),
    "Thumbnail:\n" + item.thumbnailText,
    "CTA:\n" + item.cta,
  ].join("\n\n");

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg">{item.title}</h3>
          <p className="text-xs text-white/60">
            {item.platforms.join(" ? ")} ? {item.language.toUpperCase()} ? ~{item.durationSec}s
          </p>
        </div>
        <CopyBtn text={allText} label="Copy all" />
      </div>

      <div>
        <p className="text-white/60 text-xs mb-2">Hooks (3?5)</p>
        <ul className="list-disc pl-5 space-y-1">
          {item.hooks.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-white/60 text-xs mb-2">Script</p>
        <div className="bg-white/5 rounded-lg p-4 whitespace-pre-wrap leading-relaxed">
          {item.script}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-white/60 text-xs mb-2">Caption</p>
          <div className="bg-white/5 rounded-lg p-3 whitespace-pre-wrap">
            {item.caption}
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-white/60 text-xs mb-1">Keywords</p>
            <div className="flex flex-wrap gap-2">
              {item.keywords.map((k, i) => (
                <span key={i} className="badge">{k}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white/60 text-xs mb-1">Hashtags</p>
            <div className="flex flex-wrap gap-2">
              {item.hashtags.map((h, i) => (
                <span key={i} className="badge">{h}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white/60 text-xs mb-1">Thumbnail text</p>
            <div className="bg-white/5 rounded-lg p-3 font-bold text-brand-300 uppercase tracking-wide">
              {item.thumbnailText}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-white/60 text-xs">CTA: {item.cta}</p>
        <CopyBtn text={item.caption + "\n\n" + item.hashtags.join(" ")} label="Copy caption" />
      </div>
    </div>
  );
}
