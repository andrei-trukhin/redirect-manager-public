import Link from 'next/link';
import { Text } from '../atoms/Text';

export function Footer() {
  return (
    <footer className="px-6 py-12 bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-6">
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link href="/docs" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
              Documentation
            </Link>
            <Link href="/docs/api" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
              API Reference
            </Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
              Contact
            </Link>
            <Link
              href="https://hub.docker.com/r/andreitrukhin/redirect-manager-api" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Docker Hub
            </Link>
            <Link
              href="https://buymeacoffee.com/andreitrukhin" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Buy me a coffee
            </Link>
            <Link
              href="https://www.linkedin.com/in/andrei-trukhin/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Feedback (LinkedIn)
            </Link>
          </nav>
          <Text size="sm" className="text-gray-500 text-center">
            © 2026 Redirect Manager — created and maintained by Andrei Trukhin.
          </Text>
        </div>
      </div>
    </footer>
  );
}
