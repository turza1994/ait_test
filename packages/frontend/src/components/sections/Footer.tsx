import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-white">
              Fullstack Boilerplate
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Production-ready application template
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link
              href="/login"
              className="hover:text-white transition-colors duration-200 motion-reduce:transition-none"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="hover:text-white transition-colors duration-200 motion-reduce:transition-none"
            >
              Sign Up
            </Link>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-6 pt-6 text-center text-sm text-slate-400">
          <p>&copy; {currentYear} Fullstack Boilerplate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
