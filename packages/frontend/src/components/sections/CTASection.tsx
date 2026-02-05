import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-blue-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of developers building amazing applications with our production-ready boilerplate.
          Start for free today.
        </p>
        <Link href="/signup">
          <Button
            size="lg"
            variant="secondary"
            className="w-full sm:w-auto bg-white text-blue-600 hover:bg-slate-50 transition-colors duration-200 motion-reduce:transition-none"
          >
            Create Your Account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
