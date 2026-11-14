import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#levels', label: 'المستويات' },
    { href: '#simulator', label: 'محاكاة الوزن' },
    { href: '#terminology', label: 'المصطلحات' },
    { href: '#quiz', label: 'الاختبار' },
    { href: '#certificate', label: 'الشهادة' }
  ];

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-[#0B1D3A] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          أبطال التايكوندو
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600" aria-label="التنقل الرئيسي">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#0B1D3A] hover:underline underline-offset-8 decoration-2 decoration-blue-700 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action + mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#level-1"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0B1D3A] rounded-lg hover:bg-[#142F5C] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            ابدأ التدريب
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-200 text-[#0B1D3A] hover:bg-slate-100 cursor-pointer"
            aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Compact mobile navigation drawer */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1" aria-label="قائمة الجوال">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0B1D3A] rounded-lg"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#level-1"
            onClick={() => setMobileMenuOpen(false)}
            className="block mt-2 text-center px-4 py-2.5 text-sm font-semibold text-white bg-[#0B1D3A] rounded-lg"
          >
            ابدأ التدريب
          </a>
        </nav>
      )}
    </header>
  );
}
