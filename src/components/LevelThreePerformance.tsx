import { useEffect, useState } from 'react';
import { CheckCircle2, Play, Pause, Plus, RotateCcw, ArrowLeft } from 'lucide-react';
import { DEFAULT_SEQUENCE_MOVES, SequenceMove } from '../data/curriculum';
import { VoiceoverButton } from './VoiceoverButton';
import { stopArabicSpeech } from '../utils/speech';

interface LevelThreePerformanceProps {
  onCompleteLevel3: () => void;
  level3Completed: boolean;
}

const AVAILABLE_MOVES: Omit<SequenceMove, 'id'>[] = [
  {
    stanceId: 'ap_seogi',
    stanceLabel: 'وقفة المشي (أب سوجي)',
    skillId: 'middle_punch',
    skillLabel: 'اللكمة المتوسطة',
    koreanCall: 'أب سوجي · مومتونغ جيروغي',
    breathingCue: 'زفير سريع ومنضبط مع اكتمال اللكمة.',
    balanceFocus: 'توزيع وزن متساوٍ 50% / 50% وثبات الجذع.'
  },
  {
    stanceId: 'ap_kubi',
    stanceLabel: 'وقفة الطعن الأمامية (أب كوبي)',
    skillId: 'high_punch',
    skillLabel: 'اللكمة العالية',
    koreanCall: 'أب كوبي · أولغول جيروغي',
    breathingCue: 'توجيه النفس نحو مستوى الرأس مع ثبات الكتف.',
    balanceFocus: 'تثبيت كعب القدم الخلفية وارتكاز 60% للأمام.'
  },
  {
    stanceId: 'ap_seogi',
    stanceLabel: 'ارتكاز انتقالي',
    skillId: 'front_kick',
    skillLabel: 'الركلة الأمامية (أب تشاغي)',
    koreanCall: 'أب تشاغي',
    breathingCue: 'شهيق عند رفع الركبة، وزفير حاد لحظة الضرب.',
    balanceFocus: 'ثبات رجل الارتكاز دون تمايل للخلف.'
  }
];

export function LevelThreePerformance({ onCompleteLevel3, level3Completed }: LevelThreePerformanceProps) {
  const [sequence, setSequence] = useState<SequenceMove[]>(DEFAULT_SEQUENCE_MOVES);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => {
        if (prev >= sequence.length - 1) {
          setIsPlaying(false);
          return sequence.length - 1;
        }
        return prev + 1;
      });
    }, 1700);
    return () => window.clearInterval(timer);
  }, [isPlaying, sequence.length]);

  const currentMove = sequence[activeIndex] ?? sequence[0];

  const handleAddMove = (template: Omit<SequenceMove, 'id'>) => {
    if (sequence.length >= 6) return;
    setSequence((prev) => [...prev, { ...template, id: `custom_${Date.now()}` }]);
  };

  const handleResetSequence = () => {
    stopArabicSpeech();
    setIsPlaying(false);
    setSequence(DEFAULT_SEQUENCE_MOVES);
    setActiveIndex(0);
  };

  return (
    <section id="level-3" className="py-14 lg:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
          <div>
            <div className="text-xs sm:text-sm font-semibold text-blue-700 mb-1.5">
              المستوى الثالث · الربط الإيقاعي والتقويم
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1D3A]">
              تطبيقات الأداء والجملة الحركية (البومسي)
            </h2>
            <p className="text-slate-600 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
              تعتمد الجملة الحركية على دمج الوقفات الأساسية مع المهارات الهجومية في مسار متصل يبرز الربط، والتوازن، والتنفس، وتوجيه النظر.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <VoiceoverButton
              id="level3_poomsae"
              label="استمع لمفهوم الجملة الحركية"
              title="تطبيقات الأداء · الجملة الحركية"
              tone="lesson"
              variant="navy"
              text="رائع يا بطل! وصلنا الآن إلى المستوى الثالث: الجملة الحركية، أو البومسي! هنا نربط الوقفات الأساسية بالمهارات الهجومية في تسلسل إيقاعي متزن... حافظ على ثبات الرأس والظهر عند الانتقال من خطوة لأخرى، مع ضبط التنفس وتوجيه النظر قبل كل حركة."
            />
            <button
              type="button"
              onClick={onCompleteLevel3}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-colors cursor-pointer min-h-[40px] whitespace-nowrap ${
                level3Completed
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-[#0B1D3A] border-slate-300 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>{level3Completed ? 'تم إتمام المستوى الثالث' : 'تحديد المستوى كمكتمل'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Sequence Builder & Player */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-bold text-[#0B1D3A]">
                مختبر تسلسل الجملة الحركية ({sequence.length} حركات)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                اضغط على أي خطوة لاستعراضها أو شغّل التسلسل الكامل، ويمكنك إضافة حركات حتى 6 خطوات.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (activeIndex >= sequence.length - 1 && !isPlaying) setActiveIndex(0);
                  setIsPlaying((prev) => !prev);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#C81E2B] rounded-lg hover:bg-red-700 transition-colors cursor-pointer min-h-[40px] whitespace-nowrap"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" aria-hidden="true" />
                    <span>إيقاف العرض</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" aria-hidden="true" />
                    <span>تشغيل الجملة الحركية</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResetSequence}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 cursor-pointer min-h-[40px] whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>الافتراضي</span>
              </button>
            </div>
          </div>

          {/* Horizontal Sequence Chain */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {sequence.map((move, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={move.id}
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveIndex(idx);
                  }}
                  className={`text-right p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-[#0B1D3A] text-white border-[#0B1D3A] shadow-sm'
                      : 'bg-slate-50 text-[#0B1D3A] border-slate-200 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-2 tabular-nums">
                    <span className={isActive ? 'text-amber-300 font-bold' : 'text-blue-700 font-bold'}>
                      0{idx + 1}.
                    </span>
                    {idx < sequence.length - 1 && (
                      <ArrowLeft className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} aria-hidden="true" />
                    )}
                  </div>
                  <div className="font-display font-bold text-sm">{move.skillLabel}</div>
                  <div className={`text-xs mt-1 ${isActive ? 'text-slate-300' : 'text-slate-600'}`}>
                    {move.stanceLabel}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Move Coaching Detail + Add Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-slate-200">
            <div className="lg:col-span-7 bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-display text-lg font-bold text-[#0B1D3A]">
                  الخطوة {activeIndex + 1}: {currentMove.skillLabel} من {currentMove.stanceLabel}
                </h4>
                <VoiceoverButton
                  id={`seq_step_${currentMove.id}`}
                  label="توجيه الخطوة"
                  title={`الخطوة ${activeIndex + 1} · ${currentMove.skillLabel}`}
                  tone="lesson"
                  variant="subtle"
                  text={`الخطوة رقم ${activeIndex + 1}: نفّذ ${currentMove.skillLabel} من ${currentMove.stanceLabel}. تذكّر: ${currentMove.balanceFocus} ${currentMove.breathingCue}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm">
                <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                  <div className="text-xs font-bold text-blue-700 mb-1">ضبط التوازن والمحور</div>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{currentMove.balanceFocus}</p>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                  <div className="text-xs font-bold text-[#C81E2B] mb-1">التنفس والإيقاع</div>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{currentMove.breathingCue}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="text-sm font-bold text-[#0B1D3A]">
                أضف حركة جديدة لتخصيص جملتك ({sequence.length}/6)
              </div>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_MOVES.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={sequence.length >= 6}
                    onClick={() => handleAddMove(tpl)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-[#0B1D3A] hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-h-[38px]"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
                    <span>{tpl.skillLabel}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars of Performance Evaluation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="font-mono text-xs font-bold text-blue-700 mb-2">01. معيار الربط الحركي</div>
            <h3 className="font-display text-lg font-bold text-[#0B1D3A] mb-2">انسيابية الانتقال</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              تلافي التوقف العشوائي أو رفع الورك أثناء الانتقال من وقفة المشي إلى وقفة الطعن، مع تحريك القدمين في مسار متوازٍ.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="font-mono text-xs font-bold text-[#C81E2B] mb-2">02. معيار التوازن والثبات</div>
            <h3 className="font-display text-lg font-bold text-[#0B1D3A] mb-2">استقامة المحور</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              الحفاظ على استقامة العمود الفقري والرأس دون اهتزاز بعد الركلة الأمامية أو أثناء تدوير الجذع عند تنفيذ اللكمة.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="font-mono text-xs font-bold text-amber-700 mb-2">03. معيار التقويم والتوجيه</div>
            <h3 className="font-display text-lg font-bold text-[#0B1D3A] mb-2">التركيز والنظر</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              توجيه النظر إلى اتجاه الحركة قبل تحريك القدم، وإنهاء الجملة الحركية بالعودة لوضعية الاستعداد (جونبي) بهدوء وانضباط.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
