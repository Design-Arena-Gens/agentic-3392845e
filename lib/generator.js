import { customAlphabet } from "nanoid";

const id = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 6);

const langPhrases = {
  en: {
    stop: ["Stop scrolling!", "Wait 3 seconds.", "Hold up!", "Don't miss this."],
    share: ["Share this with a friend!", "Send this to your group.", "Save + Share!"],
    cta: [
      "Follow for daily actionable nuggets.",
      "Like + Save for part 2.",
      "Comment 'MORE' and I'll drop the list.",
      "Tag a friend who needs this!",
    ],
  },
  hing: {
    stop: ["Ruko zara!", "Ek sec ruk jao!", "Listen yaar!", "Wait, yeh zaroor suno!"],
    share: ["Dost ko bhejo!", "Group me daal do!", "Save + Share karo!"],
    cta: [
      "Roz aise hi tactical tips ke liye follow karo.",
      "Like + Save karo, Part 2 aa raha hai!",
      "Comment 'MORE' aur full list milegi.",
      "Us dost ko tag karo jise yeh chahiye!",
    ],
  },
  hi: {
    stop: ["Rukiye!", "Bas 3 second!", "Dhyan dijiye!", "Isse miss mat kijiye."],
    share: ["Doston ke saath baantien!", "Group me bhejein!", "Save + Share karein!"],
    cta: [
      "Roz ke practical tips ke liye follow kijiye.",
      "Like + Save kijiye, Part 2 jaldi aayega.",
      "Comment 'MORE' karen, poori list dunga.",
      "Jise zarurat ho use tag karein!",
    ],
  },
};

function pick(arr, n) {
  const copy = [...arr];
  const out = [];
  while (out.length < Math.min(n, copy.length)) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

function wordsForDuration(sec) {
  // ~ 2.5 words/sec speaking pace for short-form
  return Math.max(30, Math.min(140, Math.round(sec * 2.5)));
}

function makeHooks({ language, topic, niche, tone, emotion, controversy }) {
  const lp = langPhrases[language] || langPhrases.en;
  const starters = lp.stop;
  const spicy = controversy === "high";
  const emot = emotion !== "low";

  const variants = [
    `${pick(starters, 1)[0]} ${topic} ka sach jo koi nahi batata?`,
    `If you ${niche || "you"} still don't know ${topic}, you're leaving growth on the table.`,
    `${topic} in ${tone === "high-energy" ? "30 seconds" : "1 minute"} ? real talk only.`,
    `${emot ? "Hot take:" : "Truth:"} ${topic} will ${spicy ? "trigger some of you" : "change how you think"}.`,
    `${niche ? niche + "" : ""} creators are doing THIS about ${topic} (and it's working).`,
  ];

  return pick(variants, 4 + (Math.random() > 0.5 ? 1 : 0));
}

function makeScript({ language, topic, niche, durationSec, tone }) {
  const targetWords = wordsForDuration(durationSec);
  const bulletCount = Math.max(3, Math.min(6, Math.round(targetWords / 35)));
  const bullets = [];

  const prefix =
    language === "hi"
      ? `${topic} ke bare me fast breakdown:`
      : language === "hing"
      ? `${topic} ka fast breakdown:`
      : `Fast breakdown on ${topic}:`;

  bullets.push(prefix);

  for (let i = 1; i <= bulletCount; i++) {
    const point =
      tone === "story"
        ? `Step ${i}: Real example that proves why this works.`
        : tone === "motivational"
        ? `Rule ${i}: Do this daily for 7 days.`
        : tone === "educational"
        ? `Tip ${i}: Specific, actionable, 10-second implementation.`
        : `Hack ${i}: Shortcut you can try today.`;
    bullets.push(point);
  }

  bullets.push(
    language === "hi"
      ? `Bonus: Ek simple template jo abhi apply ho sakta hai.`
      : language === "hing"
      ? `Bonus: Ek simple template jo abhi apply ho sakta hai.`
      : `Bonus: A simple template you can apply now.`
  );

  return bullets.join("\n");
}

function makeCaption({ language, topic, niche }) {
  const lp = langPhrases[language] || langPhrases.en;
  const open = pick(lp.share, 1)[0];
  const lines = [
    `${open}`,
    niche ? `Niche: ${niche}` : `Topic: ${topic}`,
    `Comment "MORE" if you want the full list.`,
  ];
  return lines.join("\n");
}

function makeHashtags({ topic, niche, platforms }) {
  const base = [
    "viral",
    "reels",
    "shorts",
    "tiktok",
    "content",
    "creator",
    "algorithm",
    "growth",
    "2025",
  ];
  const top = (topic || "").toLowerCase().split(/[^a-z0-9]+/i).filter(Boolean);
  const nic = (niche || "").toLowerCase().split(/[^a-z0-9]+/i).filter(Boolean);
  const plat = platforms
    .map((p) => p.split(" ")[0].toLowerCase())
    .filter(Boolean);
  const all = Array.from(new Set([...top, ...nic, ...plat, ...base]))
    .slice(0, 15)
    .map((x) => (x.startsWith("#") ? x : `#${x}`));
  return all;
}

function makeKeywords({ topic, niche }) {
  const tokens = Array.from(
    new Set(
      `${topic} ${niche}`
        .toLowerCase()
        .split(/[^a-z0-9]+/i)
        .filter(Boolean)
    )
  );
  while (tokens.length < 8) tokens.push("viral");
  return tokens.slice(0, 12);
}

function makeThumbnail({ language, topic }) {
  const emph = topic.toUpperCase().slice(0, 22);
  if (language === "hi" || language === "hing") {
    return `SACH: ${emph}`;
  }
  return `FACTS: ${emph}`;
}

export function generateContent({
  items,
  inputs,
}) {
  const out = items.map((topicRaw) => {
    const topic = topicRaw.replace(/\s+/g, " ").trim();
    const hooks = makeHooks({ ...inputs, topic });
    const script = makeScript({ ...inputs, topic });
    const caption = makeCaption({ ...inputs, topic });
    const hashtags = makeHashtags({ topic, niche: inputs.niche, platforms: inputs.platforms });
    const keywords = makeKeywords({ topic, niche: inputs.niche });
    const thumbnailText = makeThumbnail({ language: inputs.language, topic });
    const cta = (langPhrases[inputs.language] || langPhrases.en).cta[0 | (Math.random() * 4) % 4];

    return {
      id: id(),
      title: `${topic} ? ${inputs.tone}`,
      language: inputs.language,
      durationSec: inputs.durationSec,
      platforms: inputs.platforms,
      hooks,
      script,
      caption,
      keywords,
      hashtags,
      thumbnailText,
      cta,
    };
  });

  return out;
}
