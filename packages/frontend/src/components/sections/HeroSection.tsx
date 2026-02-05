import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="bg-slate-50 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            TalentX – AI & Data Expert Marketplace
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Employers find the right talent. Talents find the right jobs. AI-powered matching and job descriptions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/jobs">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 motion-reduce:transition-none"
              >
                Browse jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors duration-200 motion-reduce:transition-none"
              >
                Get started
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="ghost"
                className="w-full sm:w-auto text-slate-700 hover:bg-slate-100 transition-colors duration-200 motion-reduce:transition-none"
              >
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
