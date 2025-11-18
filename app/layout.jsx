import "./globals.css";

export const metadata = {
  title: 'Viral Content Agent 1.0',
  description: 'Trend-based hooks, scripts, captions, keywords & hashtags for short-form video.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-white">
        <div className="container-max py-8">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Viral Content Agent <span className="text-brand-400">1.0</span>
            </h1>
            <p className="text-white/70 mt-2">
              Generate ultra-viral ideas, hooks, scripts, captions, keywords & hashtags for Reels, Shorts, TikTok & FB.
            </p>
          </header>
          {children}
          <footer className="mt-10 text-sm text-white/40">
            Built for creators. High-retention. High-shareability.
          </footer>
        </div>
      </body>
    </html>
  );
}
