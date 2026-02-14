import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-18 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
              Redirect Manager Demo Website
            </Link>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link href="/content" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              Content
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
