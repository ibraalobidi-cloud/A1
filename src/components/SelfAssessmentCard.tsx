import { CheckCircle2, ClipboardCheck } from 'lucide-react';
import { SELF_ASSESSMENT_CRITERIA } from '../data/curriculum';
import { speakArabic } from '../utils/speech';

export type MasteryLevel = 'mastered' | 'developing' | 'needs_practice';

interface SelfAssessmentCardProps {
  ratings: Record<string, MasteryLevel>;
  onRate: (criterionId: string, level: MasteryLevel) => void;
  onSaveAssessment: () => void;
  assessmentSaved: boolean;
}

export function SelfAssessmentCard({
  ratings,
  onRate,
  onSaveAssessment,
  assessmentSaved
}: SelfAssessmentCardProps) {
  const totalCount = SELF_ASSESSMENT_CRITERIA.length;
  const ratedCount = Object.keys(ratings).length;
  const masteredCount = Object.values(ratings).filter((v) => v === 'mastered').length;
  const scorePoints = Object.values(ratings).reduce((acc, v) => {
    if (v === 'mastered') return acc + 3;
    if (v === 'developing') return acc + 2;
    return acc + 1;
  }, 0);
  const maxPoints = totalCount * 3;
  const masteryPct = ratedCount > 0 ? Math.round((scorePoints / maxPoints) * 100) : 0;

  return (
    <section id="self-assessment" className="no-print py-14 lg:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
          <div>
            <div className="text-xs sm:text-sm font-semibold text-[#C81E2B] mb-1.5">
              المراقبة الذاتية للأداء الحركي
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1D3A]">
              بطاقة التقييم الذاتي للمتعلم
            </h2>
            <p className="text-slate-600 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
              قيّم مستوى إتقانك لكل مهارة بصدق بعد التدريب العملي لتحديد المهارات التي تتقنها والتي تحتاج لمراجعة إضافية.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 flex items-center gap-5 shrink-0">
            <div>
              <div className="text-xs text-slate-500">المعايير المقيمة</div>
              <div className="font-mono text-lg font-bold text-[#0B1D3A] tabular-nums">
                {ratedCount} / {totalCount}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <div className="text-xs text-slate-500">مؤشر الإتقان</div>
              <div className="font-mono text-lg font-bold text-blue-700 tabular-nums">{masteryPct}%</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-200">
            {SELF_ASSESSMENT_CRITERIA.map((item) => {
              const selected = ratings[item.id];
              return (
                <div
                  key={item.id}
                  className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="text-xs font-semibold text-blue-700">{item.levelLabel}</div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-[#0B1D3A]">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0" role="group" aria-label={`تقييم ${item.title}`}>
                    <button
                      type="button"
                      onClick={() => onRate(item.id, 'mastered')}
                      className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-colors cursor-pointer min-h-[40px] whitespace-nowrap ${
                        selected === 'mastered'
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-emerald-50'
                      }`}
                    >
                      أتقنت المهارة
                    </button>
                    <button
                      type="button"
                      onClick={() => onRate(item.id, 'developing')}
                      className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-colors cursor-pointer min-h-[40px] whitespace-nowrap ${
                        selected === 'developing'
                          ? 'bg-blue-700 text-white border-blue-700'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-blue-50'
                      }`}
                    >
                      قيد التطوير
                    </button>
                    <button
                      type="button"
                      onClick={() => onRate(item.id, 'needs_practice')}
                      className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-colors cursor-pointer min-h-[40px] whitespace-nowrap ${
                        selected === 'needs_practice'
                          ? 'bg-[#C81E2B] text-white border-[#C81E2B]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-red-50'
                      }`}
                    >
                      أحتاج تدريباً
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 px-6 py-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-slate-700">
              {ratedCount < totalCount
                ? `اختر تقييمك للمعايير المتبقية (${totalCount - ratedCount}) ثم احفظ بطاقة التقييم الذاتي.`
                : masteredCount === totalCount
                  ? 'أداء متميز! أتقنت جميع المهارات الخمس للوحدة ويمكنك الانتقال للاختبار النهائي.'
                  : `أتممت تقييم ${masteredCount} مهارات متقنة. راجع المهارات القيد التطوير عبر محاكاة التوازن أو مشغل الحركة.`}
            </div>

            <button
              type="button"
              onClick={() => {
                onSaveAssessment();
                const msg =
                  masteredCount === totalCount
                    ? 'ما شاء الله! رائع جداً، أتقنت جميع المهارات الخمس للوحدة. هيا بنا الآن إلى الاختبار التفاعلي!'
                    : `أحسنت يا بطل! تم حفظ تقييمك الذاتي بنجاح، وقد أتقنت ${masteredCount} مهارات حتى الآن. واصل التدريب بثقة!`;
                void speakArabic(msg, 'self_assessment_save', {
                  tone: 'encourage_correct',
                  title: 'تشجيع التقييم الذاتي',
                  forceReplay: true
                });
              }}
              disabled={ratedCount === 0}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#0B1D3A] rounded-lg hover:bg-[#153463] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer min-h-[44px] whitespace-nowrap shrink-0"
            >
              {assessmentSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-amber-300" aria-hidden="true" />
                  <span>تم حفظ التقييم الذاتي</span>
                </>
              ) : (
                <>
                  <ClipboardCheck className="w-4 h-4" aria-hidden="true" />
                  <span>حفظ التقييم الذاتي</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
