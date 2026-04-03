import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voices — Voice Actor Database",
  description: "Explore voice actors and the animated characters they've brought to life.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-brand-navy">
        <header className="bg-brand-navy text-white">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-2xl">🎙️</span>
              <span className="font-bold text-xl tracking-tight text-brand-gold">Voices</span>
            </a>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-10">{children}</main>
        <footer className="text-center text-brand-navy/50 text-sm py-8 border-t border-brand-gold/40 mt-16">
          Voices — A voice actor character database
        </footer>
      </body>
    </html>
  );
}
