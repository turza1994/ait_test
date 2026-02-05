import { Briefcase, Users, Sparkles, Shield } from 'lucide-react';

const features = [
  {
    icon: Briefcase,
    title: 'For employers',
    description:
      'Post jobs with title, tech stack, and deadline. View applicants and their source (manual or invitation). Invite talents and see AI-matched candidates with relevance scores.',
  },
  {
    icon: Users,
    title: 'For talents',
    description:
      'Browse jobs, apply with one click, and track your applications. Receive invitations from employers and accept or decline. See job and company details at a glance.',
  },
  {
    icon: Sparkles,
    title: 'AI-powered',
    description:
      'Job descriptions generated from title and tech stack. Talent–job matching scores to surface the best fits. Built for real workflows, not demos.',
  },
  {
    icon: Shield,
    title: 'Secure & real',
    description:
      'Real authentication and role-based access. Employers and talents only see what they’re allowed to. No mock data – everything runs on a live database.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            How it works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            One marketplace for employers and AI & data experts. Post, apply, invite, and match.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
