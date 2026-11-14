import { Award, Printer, Download } from 'lucide-react';
import { SaudiFlag } from './SaudiFlag';

interface CertificateSectionProps {
  studentName: string;
  onStudentNameChange: (name: string) => void;
  progressPct: number;
  quizScore: number | null;
  quizTotal: number;
  onExportHtml: () => void;
}

export function CertificateSection({
  studentName,
  onStudentNameChange,
  progressPct,
  quizScore,
  quizTotal,
  onExportHtml
}: CertificateSectionProps) {
  const displayName = studentName.trim() || 'بطل أكاديمية التايكوندو';
  const todayStr = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const beltRank =
    progressPct >= 80 && (quizScore ?? 0) >= 6
      ? 'الوسام الذهبي للإتقان الحركي'
      : progressPct >= 50
        ? 'وسام المتدرب المتقدم'
        : 'وسام المبتدئ الطموح';

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="certificate" className="py-14 lg:py-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Controls (hidden during print) */}
        <div className="no-print flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-xs sm:text-sm font-semibold text-amber-700 mb-1.5">
              التتويج وتوثيق الإنجاز
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B1D3A]">
              شهادة إنجاز قابلة للطباعة
            </h2>
            <p className="text-slate-600 mt-1.5 text-sm sm:text-base">
              أدخل اسمك ليظهر مباشرة داخل الشهادة الرسمية، ثم اطبعها أو صدّر ملخصك التفاعلي.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={studentName}
              onChange={(e) => onStudentNameChange(e.target.value)}
              placeholder="اكتب اسم الطالب الثلاثي"
              aria-label="اسم الطالب في الشهادة"
              className="px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-[#0B1D3A] focus:outline-none focus:ring-2 focus:ring-blue-700 w-56"
            />
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#0B1D3A] rounded-lg hover:bg-[#14305E] transition-colors cursor-pointer min-h-[44px] whitespace-nowrap"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span>طباعة الشهادة</span>
            </button>
            <button
              type="button"
              onClick={onExportHtml}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#0B1D3A] bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer min-h-[44px] whitespace-nowrap"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>ملخص HTML</span>
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div className="print-only-container bg-white p-4 sm:p-8 rounded-2xl border border-slate-300 shadow-sm">
          <div className="border-4 border-[#0B1D3A] p-2 rounded-xl">
            <div className="border-2 border-amber-500 rounded-lg px-6 py-10 sm:px-12 sm:py-12 text-center space-y-6 bg-gradient-to-b from-white to-slate-50/60">
              {/* Academy Emblem & Saudi Flag */}
              <div className="flex flex-col items-center gap-2.5">
                <div className="flex items-center gap-3">
                  <SaudiFlag className="w-8 h-5" />
                  <div className="w-16 h-16 rounded-full bg-[#0B1D3A] text-amber-400 flex items-center justify-center border-2 border-amber-400">
                    <Award className="w-8 h-8" aria-hidden="true" />
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#C81E2B] tracking-wide">
                  المملكة العربية السعودية · أبطال التايكوندو — أكاديمية المهارات الحركية
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B1D3A]">
                  شهادة إتمام وإنجاز
                </h3>
                <p className="text-sm sm:text-base text-slate-600">
                  تشهد أكاديمية أبطال التايكوندو للمهارات الحركية بأن المتدرب / المتدربة
                </p>
              </div>

              {/* Student Name */}
              <div className="py-3 px-6 border-b-2 border-t-2 border-amber-400/70 inline-block min-w-[260px] sm:min-w-[360px]">
                <span className="font-display text-2xl sm:text-3xl font-extrabold text-blue-800">
                  {displayName}
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed">
                قد أتمّ بنجاح دراسة وتطبيق وحدة التايكوندو التعليمية بمستوياتها الثلاثة: الوقفات الأساسية (وقفة المشي ووقفة الطعن الأمامية)، والمهارات الهجومية من الحركة، وتطبيقات الأداء والجملة الحركية.
              </p>

              {/* Quantitative Achievement Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-2 text-sm">
                <div className="p-3 rounded-lg bg-white border border-slate-200">
                  <div className="text-xs text-slate-500">التصنيف المستحق</div>
                  <div className="font-bold text-[#0B1D3A] mt-0.5">{beltRank}</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-slate-200">
                  <div className="text-xs text-slate-500">نسبة إتمام الوحدة</div>
                  <div className="font-mono font-bold text-blue-700 mt-0.5 tabular-nums">{progressPct}%</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-slate-200">
                  <div className="text-xs text-slate-500">نتيجة الاختبار</div>
                  <div className="font-mono font-bold text-[#C81E2B] mt-0.5 tabular-nums">
                    {quizScore !== null ? `${quizScore} / ${quizTotal}` : 'قيد الاستكمال'}
                  </div>
                </div>
              </div>

              {/* Footer Signatures */}
              <div className="pt-8 mt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs sm:text-sm text-slate-600">
                <div>
                  <div className="font-bold text-[#0B1D3A]">تاريخ الإصدار</div>
                  <div className="mt-1">{todayStr}</div>
                </div>

                <div className="flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-xl border border-amber-400 bg-amber-50/40">
                  <SaudiFlag className="w-7 h-5" />
                  <span className="text-[11px] font-bold text-[#0B1D3A]">ختم الأكاديمية المعتمد</span>
                </div>

                <div>
                  <div className="font-bold text-[#0B1D3A]">المعلمة المشرفة</div>
                  <div className="mt-1 text-blue-800 font-bold">أ. عزيزة العنزي</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
