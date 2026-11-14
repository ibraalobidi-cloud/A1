import { useState } from 'react';
import { Volume2, RotateCw } from 'lucide-react';
import { TERMINOLOGY_CARDS } from '../data/curriculum';
import { speakArabic, stopArabicSpeech } from '../utils/speech';

export function TerminologyDeck() {
  const [filter, setFilter] = useState<'all' | 'stances' | 'offense' | 'performance'>('all');
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});

  const filteredCards =
    filter === 'all'
      ? TERMINOLOGY_CARDS
      : TERMINOLOGY_CARDS.filter((c) => c.category === filter);

  const toggleFlip = (id: string) => {
    setFlippedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="terminology" className="no-print py-14 lg:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
          <div>
            <div className="text-xs sm:text-sm font-semibold text-blue-700 mb-1.5">
              المعجم الحركي · المصطلحات المعتمدة
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1D3A]">
              بطاقات المصطلحات والتسميات الرياضية
            </h2>
            <p className="text-slate-600 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
              اضغط على أي بطاقة لعرض الشرح التدريبي، أو استمع إلى النطق السليم للمصطلحات المعتمدة في صالات التايكوندو.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl" role="tablist" aria-label="تصفية المصطلحات">
            {[
              { id: 'all', label: 'الكل (12)' },
              { id: 'stances', label: 'الوقفات' },
              { id: 'offense', label: 'الهجوم' },
              { id: 'performance', label: 'الأداء والصالة' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={filter === tab.id}
                onClick={() => {
                  stopArabicSpeech();
                  setFilter(tab.id as typeof filter);
                }}
                className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap min-h-[38px] ${
                  filter === tab.id
                    ? 'bg-[#0B1D3A] text-white'
                    : 'text-slate-700 hover:text-[#0B1D3A] hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCards.map((card) => {
            const isFlipped = Boolean(flippedIds[card.id]);
            return (
              <div
                key={card.id}
                className={`rounded-xl border transition-colors p-5 flex flex-col justify-between min-h-[200px] ${
                  isFlipped
                    ? 'bg-[#0B1D3A] text-white border-[#0B1D3A]'
                    : 'bg-slate-50 text-[#0B1D3A] border-slate-200 hover:border-blue-300'
                }`}
              >
                <div>
                  <div className={`text-xs font-medium mb-2 ${isFlipped ? 'text-amber-300' : 'text-slate-500'}`}>
                    {card.categoryLabel}
                  </div>

                  {!isFlipped ? (
                    <div className="space-y-2.5 py-2">
                      <h3 className="font-display text-lg font-extrabold text-[#0B1D3A]">{card.arabic}</h3>
                      <div className="text-base font-bold text-[#C81E2B]">المصطلح: {card.phoneticArabic}</div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{card.explanation}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-2">
                      <h3 className="font-display text-base font-bold text-white">
                        {card.arabic} ({card.phoneticArabic})
                      </h3>
                      <p className="text-sm text-slate-200 leading-relaxed">{card.explanation}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-4 mt-2 border-t border-slate-200/20">
                  <button
                    type="button"
                    onClick={() => toggleFlip(card.id)}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors min-h-[36px] ${
                      isFlipped
                        ? 'bg-white/15 text-white hover:bg-white/25'
                        : 'bg-white text-[#0B1D3A] border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isFlipped ? 'عرض المصطلح' : 'الشرح التدريبي'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void speakArabic(
                        `${card.arabic}، وتنطق بالكورية: ${card.phoneticArabic}. ${card.explanation}`,
                        `term_${card.id}`,
                        {
                          tone: 'term',
                          title: `${card.arabic} (${card.phoneticArabic})`
                        }
                      )
                    }
                    aria-label={`استمع لنطق ${card.arabic}`}
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer transition-colors ${
                      isFlipped
                        ? 'bg-amber-400 text-[#0B1D3A] hover:bg-amber-300'
                        : 'bg-blue-700 text-white hover:bg-blue-800'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
