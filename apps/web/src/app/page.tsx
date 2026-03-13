import Link from 'next/link';

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="gradient-hero relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-20 -left-20 w-60 h-60 bg-accent-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Open for enrolment
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
              Learn Without
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                Limits
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-indigo-100/80 max-w-2xl mb-10 leading-relaxed">
              An inclusive e-learning platform empowering women, persons with disabilities, and teachers in Nigeria with digital skills, safe spaces, and remote work opportunities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white text-primary-700 font-bold text-lg hover:bg-amber-50 hover:scale-105 hover:shadow-xl transition-all duration-300"
                id="hero-cta-primary"
              >
                Start Learning Free
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                id="hero-cta-secondary"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Built for <span className="text-gradient">Everyone</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Every feature is designed with accessibility and inclusion at its core.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '📚',
                title: 'Accessible Courses',
                desc: 'Video lessons with captions, NSL overlay, and read-aloud support for every learner.',
                color: 'from-primary-50 to-primary-100/50',
                border: 'border-primary-200/50',
              },
              {
                icon: '🛡️',
                title: 'Safe Space',
                desc: 'Anonymous reporting system to keep the learning community safe and welcoming.',
                color: 'from-green-50 to-emerald-100/50',
                border: 'border-green-200/50',
              },
              {
                icon: '🤝',
                title: 'Champions & Mentors',
                desc: 'Connect with accessibility champions for 1-on-1 mentoring via video calls.',
                color: 'from-amber-50 to-orange-100/50',
                border: 'border-amber-200/50',
              },
              {
                icon: '🤖',
                title: 'AI Assistant',
                desc: 'Ally chatbot powered by LLaMA 3 for instant help in English and Pidgin.',
                color: 'from-violet-50 to-purple-100/50',
                border: 'border-violet-200/50',
              },
              {
                icon: '♿',
                title: 'Accessibility Toolbar',
                desc: 'Dyslexia font, high contrast mode, and text scaling — right at your fingertips.',
                color: 'from-sky-50 to-blue-100/50',
                border: 'border-sky-200/50',
              },
              {
                icon: '💼',
                title: 'Job Opportunities',
                desc: 'Browse inclusive, remote-friendly job listings curated for our learner community.',
                color: 'from-rose-50 to-pink-100/50',
                border: 'border-rose-200/50',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={'group relative p-8 rounded-2xl bg-gradient-to-br ' + feature.color + ' border ' + feature.border + ' hover:shadow-lg hover:-translate-y-1 transition-all duration-300'}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gradient-primary rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to begin your journey?
              </h2>
              <p className="text-lg text-indigo-100/80 mb-8 max-w-xl mx-auto">
                Join thousands of learners building digital skills in an inclusive, supportive environment.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-700 font-bold text-lg rounded-2xl hover:scale-105 hover:shadow-xl transition-all duration-300"
                id="cta-signup"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
