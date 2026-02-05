import { Rocket, Shield, Zap, Layers, Globe, Database } from 'lucide-react';

const features = [
  {
    icon: Rocket,
    title: 'Next.js 16 App Router',
    description: 'Modern React framework with server-side rendering and optimized performance out of the box.',
  },
  {
    icon: Shield,
    title: 'JWT Authentication',
    description: 'Secure authentication with access tokens, refresh tokens, and automatic token refresh.',
  },
  {
    icon: Zap,
    title: 'Type-Safe API',
    description: 'Full TypeScript support with automatic type inference and Zod validation for all requests.',
  },
  {
    icon: Layers,
    title: 'Modular Architecture',
    description: 'Clean separation of concerns with controllers, services, and repositories.',
  },
  {
    icon: Globe,
    title: 'Responsive Design',
    description: 'Mobile-first design with Tailwind CSS and shadcn/ui components.',
  },
  {
    icon: Database,
    title: 'PostgreSQL & Drizzle',
    description: 'Type-safe database operations with Drizzle ORM and migration support.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A complete toolkit for building modern web applications with best practices built in.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-6 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200 motion-reduce:transition-none cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
