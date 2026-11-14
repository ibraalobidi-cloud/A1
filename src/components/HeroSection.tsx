import { useState } from 'react';
import { ArrowDownLeft, ShieldCheck } from 'lucide-react';
import heroDojangImg from '../assets/images/hero_saudi_dojang_1794649575541.jpg';
import { VoiceoverButton } from './VoiceoverButton';
import { SaudiFlag } from './SaudiFlag';

export function HeroSection() {
  const [imgError, setImgError] = useState(false);

  const overviewChapters = [
    {
      index: '01',
      title: 'الوقفات الأساسية',
      detail: 'وقفة المشي ووقفة الطعن الأمامية وتوزيع الوزن',
      href: '#level-1'
    },
    {
      index: '02',
      title: 'المهارات الهجومية',
      detail: 'اللكمة العالية والمتوسطة والركلة الأمامية من الحركة',
      href: '#level-2'
    },
    {
      index: '03',
      title: 'تطبيقات الأداء',
      detail: 'الجملة الحركية والربط والتوازن والتقويم المرحلي',
      href: '#level-3'
    },
    {
      index: '04',
      title: 'التقويم والشهادة',
      detail: 'بطاقة تقييم ذاتي واختبار من 8 أسئلة وشهادة طباعة',
      href: '#quiz'
    }
  ];

  return (
    <section id="top" className="no-print bg-[#0B1D3A] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Right/Main Text Column in RTL */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-medium text-amber-300/95 tracking-wide">
              <SaudiFlag className="w-6 h-4" />
              <span>المملكة العربية السعودية</span>
              <span aria-hidden="true">·</span>
              <span>منهج التربية البدنية والدفاع عن النفس</span>
              <span aria-hidden="true">·</span>
              <span className="text-white font-bold">إعداد المعلمة: عزيزة العنزي</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-white">
              أبطال التايكوندو: أكاديمية المهارات الحركية
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
              منصة تدريبية متدرجة تأخذك عبر ثلاثة مستويات مترابطة من إتقان الوقفات الأساسية وتوزيع وزن الجسم، إلى تنفيذ المهارات الهجومية من الحركة، وصولاً إلى بناء الجملة الحركية والحصول على شهادة الإنجاز.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#level-1"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-bold bg-[#C81E2B] text-white rounded-lg hover:bg-red-700 transition-colors min-h-[44px] whitespace-nowrap shrink-0"
              >
                <span>ابدأ المستوى الأول</span>
                <ArrowDownLeft className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href="#simulator"
                className="inline-flex items-center justify-center px-5 py-3 text-sm sm:text-base font-semibold bg-white/10 text-white border border-white/25 rounded-lg hover:bg-white/20 transition-colors min-h-[44px] whitespace-nowrap shrink-0"
              >
                محاكاة توزيع الوزن
              </a>

              <VoiceoverButton
                id="hero_intro"
                label="مقدمة صوتية"
                title="ترحيب المعلمة عزيزة العنزي"
                tone="lesson"
                variant="outline"
                text="مرحباً بكم يا أبطال! معكم المعلمة عزيزة العنزي في أكاديمية أبطال التايكوندو. هل أنتم مستعدون لخوض تحدٍ رياضي ممتع؟ اليوم سنتعلم معاً ثلاثة مستويات رائعة: الوقفات الأساسية وتوزيع وزن الجسم، ثم المهارات الهجومية من الحركة، وأخيراً تطبيقات الجملة الحركية. هيا بنا نبدأ!"
              />
            </div>
          </div>

          {/* Left Media Column in RTL */}
          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[280px] lg:min-h-[360px] rounded-xl overflow-hidden border border-white/15 bg-[#10284F]">
              {!imgError ? (
                <img
                  src={heroDojangImg}
                  alt="صالة تدريب التايكوندو المدرسية بالبساط الأزرق والأحمر"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full lg:h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#0B1D3A] via-[#17376B] to-[#C81E2B]/40">
                  <ShieldCheck className="w-12 h-12 text-amber-300 mb-3" />
                  <p className="font-display font-bold text-lg text-white">صالة التايكوندو المدرسية (الدوجانغ)</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D3A]/90 via-[#0B1D3A]/20 to-transparent" />
              <div className="absolute bottom-0 right-0 left-0 p-5 sm:p-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-amber-300 font-semibold">بيئة التدريب القياسية · صالة التايكوندو</p>
                  <p className="text-sm sm:text-base font-bold text-white mt-0.5">
                    البساط التدريبي المعتمد لتنمية التوازن والانضباط الحركي
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-column curriculum index strip directly below hero split */}
        <div id="levels" className="mt-10 pt-8 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {overviewChapters.map((item) => (
            <a
              key={item.index}
              href={item.href}
              className="group block p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-300/50 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-mono text-amber-300 mb-1.5 tabular-nums">
                <span>{item.index}.</span>
                <span className="text-slate-300 group-hover:text-white transition-colors">انتقال للدرس</span>
              </div>
              <h2 className="font-display text-base font-bold text-white">{item.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">{item.detail}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
