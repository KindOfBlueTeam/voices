import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Voices",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center gap-6">
        <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
          ← Public site
        </Link>
        <span className="text-gray-700">|</span>
        <Link href="/admin" className="font-semibold text-white text-sm hover:text-indigo-400 transition-colors">
          🎙️ Admin
        </Link>
        <Link href="/admin" className="text-gray-400 hover:text-white text-sm transition-colors ml-auto">
          Voice Actors
        </Link>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-10">{children}</div>
    </div>
  );
}
