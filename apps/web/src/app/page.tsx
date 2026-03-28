import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <>
      {/* ═══════════════════════════════════════════
          1. HERO — Asymmetric Editorial Layout
          ═══════════════════════════════════════════ */}
      <section className="gradient-hero relative overflow-hidden">
        {/* Textile-inspired geometric decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 border-2 border-brand-amber/10 rounded-full" />
          <div className="absolute top-32 right-32 w-40 h-40 border-2 border-brand-green/10 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-brand-amber/5 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl animate-float" />
          {/* Geometric textile pattern — top right */}
          <svg className="absolute top-0 right-0 w-80 h-80 opacity-[0.04]" viewBox="0 0 200 200" fill="none">
            <pattern id="textile" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0 10 L10 0 L20 10 L10 20 Z" stroke="#E8820C" strokeWidth="0.5" fill="none" />
            </pattern>
            <rect width="200" height="200" fill="url(#textile)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-amber/10 border border-brand-amber/20 text-brand-amber-700 text-sm font-body mb-8">
                <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
                Open for enrolment
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-charcoal leading-tight mb-6">
                Learn. Grow. Earn.
                <span className="block text-gradient-warm mt-1">
                  On Your Terms.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-charcoal/70 font-body max-w-xl mb-10 leading-relaxed">
                An inclusive digital learning platform empowering women, persons with disabilities, and teachers in Nigeria — with accessible courses, safe spaces, mentorship, and remote job opportunities.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl gradient-warm text-white font-body font-bold text-lg hover:scale-105 hover:shadow-xl transition-all duration-300 tap-target focus-brand"
                  id="hero-cta-primary"
                >
                  Start Learning Free
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-brand-green/30 text-brand-green font-body font-semibold text-lg hover:bg-brand-green/5 hover:border-brand-green/50 transition-all duration-300 tap-target focus-brand"
                  id="hero-cta-secondary"
                >
                  Explore Courses
                </Link>
              </div>
            </div>

            {/* Right — Hero Image */}
            <div className="relative animate-fade-up hidden lg:block" style={{ animationDelay: '0.2s', opacity: 0 }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-brand-amber/10">
                <Image
                  src="/logo.png"
                  alt="Diverse Nigerian learners using the Ally-Ability platform"
                  width={600}
                  height={500}
                  className="w-full h-auto object-contain bg-ivory-200 p-12"
                  priority
                />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-brand-amber/10 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center text-white text-lg">🎓</div>
                  <div>
                    <p className="text-sm font-body font-bold text-charcoal">500+</p>
                    <p className="text-xs text-charcoal/60 font-body">Learners Enrolled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. ACCESSIBILITY PROMISE BAR
          ═══════════════════════════════════════════ */}
      <section className="bg-brand-green text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm font-body">
            {[
              { icon: '🤟', label: 'Nigerian Sign Language' },
              { icon: '📝', label: 'Closed Captions' },
              { icon: '🔊', label: 'Screen Reader Ready' },
              { icon: '📖', label: 'Dyslexia Font' },
              { icon: '🔲', label: 'High Contrast Mode' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 opacity-90">
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. FEATURED COURSES — Horizontal Scroll
          ═══════════════════════════════════════════ */}
      <section className="section-padding bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-4">
              Featured <span className="text-gradient-warm">Courses</span>
            </h2>
            <p className="text-lg text-charcoal/60 font-body max-w-2xl mx-auto">
              Accessible, practical courses designed to build real-world digital skills.
            </p>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
            {[
              { title: 'Introduction to Web Development', category: 'Tech', features: ['Captions', 'NSL', 'Read Aloud'], color: 'border-brand-amber' },
              { title: 'Digital Marketing Fundamentals', category: 'Business', features: ['Captions', 'Dyslexia Font'], color: 'border-brand-green' },
              { title: 'Data Entry & Virtual Assistance', category: 'Remote Work', features: ['Captions', 'NSL', 'High Contrast'], color: 'border-brand-gold' },
              { title: 'Graphic Design with Canva', category: 'Creative', features: ['Captions', 'Read Aloud'], color: 'border-brand-amber' },
            ].map((course, i) => (
              <div key={i} className={`card-editorial flex-shrink-0 w-80 snap-start p-6 border-t-4 ${course.color} opacity-0 animate-stagger-${i + 1}`}>
                <span className="inline-block px-3 py-1 rounded-full bg-ivory-200 text-xs font-body font-semibold text-charcoal/70 mb-4">
                  {course.category}
                </span>
                <h3 className="text-lg font-heading font-bold text-charcoal mb-3">{course.title}</h3>
                <div className="flex flex-wrap gap-2 mb-5">
                  {course.features.map((f, j) => (
                    <span key={j} className="text-xs px-2 py-1 rounded-md bg-brand-green/10 text-brand-green font-body">{f}</span>
                  ))}
                </div>
                <Link href="/courses" className="inline-flex items-center text-sm font-body font-semibold text-brand-amber hover:text-brand-amber-600 transition-colors tap-target">
                  View Course →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. MEET ALLY (AI CHATBOT) — Split Section
          ═══════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Chat Demo */}
            <div className="bg-charcoal rounded-3xl p-8 shadow-xl relative overflow-hidden animate-fade-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-amber/10 rounded-full blur-2xl" />
              <div className="space-y-4 relative">
                {/* Bot message */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full gradient-warm flex items-center justify-center text-xs text-white shrink-0">A</div>
                  <div className="bg-charcoal-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
                    <p className="text-sm text-ivory/90 font-body">Hello! I&apos;m Ally, your learning assistant. How can I help you today? 🤗</p>
                  </div>
                </div>
                {/* User message */}
                <div className="flex gap-3 justify-end">
                  <div className="bg-brand-amber/20 rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs">
                    <p className="text-sm text-ivory font-body">Abeg, which course fit help me learn web design?</p>
                  </div>
                </div>
                {/* Bot reply */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full gradient-warm flex items-center justify-center text-xs text-white shrink-0">A</div>
                  <div className="bg-charcoal-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
                    <p className="text-sm text-ivory/90 font-body">I recommend &quot;Intro to Web Development&quot; — e get captions, NSL overlay, and read-aloud. You go love am! 🎉</p>
                  </div>
                </div>
                {/* Typing indicator */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full gradient-warm flex items-center justify-center text-xs text-white shrink-0">A</div>
                  <div className="bg-charcoal-50 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-ivory/40 rounded-full animate-pulse" />
                      <span className="w-2 h-2 bg-ivory/40 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <span className="w-2 h-2 bg-ivory/40 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Copy */}
            <div className="animate-fade-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-6">
                Meet <span className="text-gradient-warm">Ally</span>,<br />Your Learning Companion
              </h2>
              <p className="text-lg text-charcoal/70 font-body leading-relaxed mb-6">
                Ally speaks your language — literally. Whether you prefer standard English or Nigerian Pidgin, our AI assistant powered by LLaMA 3 is here to guide you through courses, answer questions, and help you succeed.
              </p>
              <ul className="space-y-3 text-charcoal/70 font-body">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0 mt-0.5 text-sm">✓</span>
                  English and Pidgin support
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0 mt-0.5 text-sm">✓</span>
                  Course recommendations tailored to you
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0 mt-0.5 text-sm">✓</span>
                  Available 24/7, no judgment
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. CHAMPIONS (MENTORS) — 3-Column Grid
          ═══════════════════════════════════════════ */}
      <section className="section-padding bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-4">
              Our <span className="text-gradient-green">Champions</span>
            </h2>
            <p className="text-lg text-charcoal/60 font-body max-w-2xl mx-auto">
              Experienced mentors dedicated to guiding your learning journey through 1-on-1 video sessions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Adaeze Okafor', expertise: ['Web Development', 'Accessibility'], available: true },
              { name: 'Fatima Abdullahi', expertise: ['Digital Marketing', 'Content Creation'], available: true },
              { name: 'Chidinma Eze', expertise: ['Data Analysis', 'Remote Work'], available: false },
            ].map((mentor, i) => (
              <div key={i} className={`card-editorial p-6 text-center opacity-0 animate-stagger-${i + 1}`}>
                {/* Avatar */}
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="w-20 h-20 rounded-full bg-ivory-200 flex items-center justify-center text-2xl font-heading font-bold text-brand-amber border-2 border-brand-amber/20">
                    {mentor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {/* Availability dot */}
                  <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${mentor.available ? 'bg-brand-green' : 'bg-gray-400'}`} />
                </div>
                <h3 className="font-heading font-bold text-charcoal text-lg mb-2">{mentor.name}</h3>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {mentor.expertise.map((tag, j) => (
                    <span key={j} className="text-xs px-3 py-1 rounded-full bg-brand-green/10 text-brand-green font-body">{tag}</span>
                  ))}
                </div>
                <Link href="/champions" className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl gradient-warm text-white text-sm font-body font-semibold hover:scale-105 transition-all tap-target focus-brand">
                  Book a Session
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. SAFE SPACE — Dark Section
          ═══════════════════════════════════════════ */}
      <section className="gradient-safe text-ivory section-padding relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-60 h-60 bg-brand-green/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-brand-amber/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-up">
            {/* Shield icon */}
            <div className="w-16 h-16 rounded-2xl bg-brand-green/20 flex items-center justify-center mx-auto mb-8 animate-pulse-soft">
              <span className="text-3xl">🛡️</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ivory mb-6">
              Your Safety Is<br /><span className="text-gradient-warm">Non-Negotiable.</span>
            </h2>
            <p className="text-lg text-ivory/70 font-body leading-relaxed max-w-2xl mx-auto mb-8">
              Our Safe Space feature lets you report bullying, harassment, or discrimination — anonymously if you prefer. Every report is reviewed by trained moderators who take action promptly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-ivory/10 border border-ivory/10 text-ivory/80 text-sm font-body">
                <span>🔒</span> End-to-end encrypted
              </div>
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-ivory/10 border border-ivory/10 text-ivory/80 text-sm font-body">
                <span>👁️‍🗨️</span> Anonymous reporting
              </div>
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-ivory/10 border border-ivory/10 text-ivory/80 text-sm font-body">
                <span>⚡</span> 24-hour response
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          7. JOB BOARD PREVIEW
          ═══════════════════════════════════════════ */}
      <section className="section-padding bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-4">
              Find <span className="text-gradient-warm">Inclusive</span> Jobs
            </h2>
            <p className="text-lg text-charcoal/60 font-body max-w-2xl mx-auto">
              Curated remote-friendly job listings from organizations committed to accessibility and inclusion.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { title: 'Junior Frontend Developer', company: 'TechBridge Nigeria', tags: ['Remote', 'Accessible Workplace'], salary: '₦250k-₦400k' },
              { title: 'Content Writer', company: 'Inclusive Media', tags: ['Remote', 'Nigeria', 'Part-time'], salary: '₦150k-₦250k' },
              { title: 'Virtual Assistant', company: 'GlobalAssist', tags: ['Remote', 'Flexible Hours'], salary: '₦100k-₦180k' },
            ].map((job, i) => (
              <div key={i} className={`card-editorial p-6 opacity-0 animate-stagger-${i + 1}`}>
                <h3 className="font-heading font-bold text-charcoal text-lg mb-1">{job.title}</h3>
                <p className="text-sm text-charcoal/60 font-body mb-3">{job.company}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.map((tag, j) => (
                    <span key={j} className="text-xs px-2.5 py-1 rounded-full bg-brand-amber/10 text-brand-amber-700 font-body">{tag}</span>
                  ))}
                </div>
                <p className="text-sm font-body font-semibold text-brand-green">{job.salary}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/jobs" className="inline-flex items-center px-8 py-4 rounded-xl gradient-warm text-white font-body font-bold text-lg hover:scale-105 hover:shadow-xl transition-all duration-300 tap-target focus-brand">
              View All Jobs →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          8. PARTNER WIDGET CTA — B2B Section
          ═══════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-editorial p-10 sm:p-14 text-center border-t-4 border-brand-green animate-fade-up">
            <span className="inline-block text-4xl mb-4">🧩</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-4">
              Bring Accessibility to<br />Your Platform in <span className="text-gradient-green">5 Minutes</span>
            </h2>
            <p className="text-lg text-charcoal/60 font-body leading-relaxed max-w-xl mx-auto mb-8">
              The Ally-Engine Widget adds dyslexia fonts, high-contrast mode, text scaling, and screen reader support to any website with a single line of code.
            </p>
            <Link href="/widget" className="inline-flex items-center px-8 py-4 rounded-xl bg-brand-green text-white font-body font-bold text-lg hover:bg-brand-green-600 hover:scale-105 hover:shadow-xl transition-all duration-300 tap-target focus-brand">
              Explore the Widget →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          9. TESTIMONIALS — Large Pull-Quote
          ═══════════════════════════════════════════ */}
      <section className="section-padding bg-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-up">
          <span className="text-6xl text-brand-amber/30 font-heading">&ldquo;</span>
          <blockquote className="text-2xl sm:text-3xl font-heading font-medium text-charcoal leading-relaxed mb-8 -mt-4">
            Ally-Ability gave me the confidence to pursue tech. The captions and NSL overlay meant I could finally learn at my own pace, without barriers.
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-lg font-heading font-bold text-brand-green">AB</div>
            <div className="text-left">
              <p className="text-sm font-body font-bold text-charcoal">Amaka B.</p>
              <p className="text-xs text-charcoal/60 font-body">Web Development Learner, Lagos</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          10. FINAL CTA
          ═══════════════════════════════════════════ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gradient-warm rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
                Ready to Begin Your Journey?
              </h2>
              <p className="text-lg text-white/80 font-body mb-8 max-w-xl mx-auto">
                Join hundreds of learners building digital skills in an inclusive, supportive environment — completely free to start.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-brand-amber-700 font-body font-bold text-lg rounded-2xl hover:scale-105 hover:shadow-xl transition-all duration-300 tap-target focus-brand"
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
