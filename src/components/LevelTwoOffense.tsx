import { useEffect, useState } from 'react';
import { CheckCircle2, Play, Pause, SkipForward, RotateCcw, Target } from 'lucide-react';
import kickMotionImg from '../assets/images/taekwondo_kick_motion_1794648047389.jpg';
import { OFFENSIVE_SKILLS } from '../data/curriculum';
import { VoiceoverButton } from './VoiceoverButton';
import { stopArabicSpeech } from '../utils/speech';

interface LevelTwoOffenseProps {
  onCompleteLevel2: () => void;
  level2Completed: boolean;
}

export function LevelTwoOffense({ onCompleteLevel2, level2Completed }: LevelTwoOffenseProps) {
  const [selectedSkillId, setSelectedSkillId] = useState<'high_punch' | 'middle_punch' | 'front_kick'>('high_punch');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  const skill = OFFENSIVE_SKILLS.find((s) => s.id === selectedSkillId) ?? OFFENSIVE_SKILLS[0];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= 3) {
          setIsPlaying(false);
          return 3;
        }
        return prev + 1;
      });
    }, 1300);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const handleSelectSkill = (id: 'high_punch' | 'middle_punch' | 'front_kick') => {
    stopArabicSpeech();
    setSelectedSkillId(id);
    setActiveStep(0);
    setIsPlaying(false);
  };

  // Compute kinetic SVG positions based on selected skill and activeStep (0..3)
  const renderKineticDiagram = () => {
    if (selectedSkillId === 'front_kick') {
      // 4 stages of Ap Chagi: 0 chamber, 1 extend, 2 retract, 3 land
      const kneeAngles = [
        { kx: 260, ky: 140, fx: 235, fy: 175, label: 'رفع الركبة عالياً' },
        { kx: 278, ky: 135, fx: 365, fy: 112, label: 'بسط الساق والضرب ببطن القدم' },
        { kx: 260, ky: 142, fx: 240, fy: 174, label: 'سحب الساق سريعاً' },
        { kx: 270, ky: 185, fx: 295, fy: 235, label: 'هبوط متزن للأمام' }
      ];
      const pose = kneeAngles[activeStep];

      return (
        <svg viewBox="0 0 440 265" className="w-full h-auto max-h-[270px]" role="img" aria-label="محاكاة مراحل الركلة الأمامية">
          <rect x="0" y="0" width="440" height="235" fill="#F8FAFC" rx="8" />
          <rect x="20" y="235" width="400" height="12" rx="4" fill="#0B1D3A" />

          {/* Target Indicator */}
          <circle cx="372" cy="112" r="14" fill="none" stroke="#C81E2B" strokeWidth="2" strokeDasharray="4 3" />
          <circle cx="372" cy="112" r="4" fill="#C81E2B" />
          <text x="372" y="88" textAnchor="middle" fontSize="11" fontWeight="700" fill="#C81E2B">
            نقطة الإصابة (بطن القدم)
          </text>

          {/* Standing Support Leg */}
          <line x1="195" y1="145" x2="195" y2="235" stroke="#0B1D3A" strokeWidth="14" strokeLinecap="round" />
          <line x1="195" y1="145" x2="195" y2="235" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" />

          {/* Kicking Leg */}
          <polyline
            points={`195,145 ${pose.kx},${pose.ky} ${pose.fx},${pose.fy}`}
            fill="none"
            stroke="#1D4ED8"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points={`195,145 ${pose.kx},${pose.ky} ${pose.fx},${pose.fy}`}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Striking foot highlight */}
          <circle
            cx={pose.fx}
            cy={pose.fy}
            r="7"
            fill={activeStep === 1 ? '#C81E2B' : '#0B1D3A'}
          />

          {/* Torso & Guard */}
          <line x1="195" y1="145" x2="188" y2="85" stroke="#0B1D3A" strokeWidth="20" strokeLinecap="round" />
          <line x1="195" y1="145" x2="188" y2="85" stroke="#FFFFFF" strokeWidth="15" strokeLinecap="round" />
          <circle cx="188" cy="64" r="13" fill="#F1C2A0" stroke="#0B1D3A" strokeWidth="2" />
          <polyline points="188,92 215,105 225,90" fill="none" stroke="#0B1D3A" strokeWidth="8" strokeLinecap="round" />

          <text x="220" y="260" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0B1D3A">
            {pose.label}
          </text>
        </svg>
      );
    }

    // Punch simulation (High vs Middle)
    const isHigh = selectedSkillId === 'high_punch';
    const targetY = isHigh ? 74 : 114;
    const armExtensions = [
      { fx: 205, fy: 132, hx: 265, hy: 108, label: 'القبضة عند الخصر (التحضير)' },
      { fx: 265, fy: isHigh ? 105 : 122, hx: 230, hy: 120, label: 'انطلاق القبضة في مسار مستقيم' },
      { fx: 325, fy: targetY + 4, hx: 192, hy: 135, label: 'تدوير الساعد وسحب اليد المقابلة' },
      { fx: 342, fy: targetY, hx: 185, hy: 136, label: 'إصابة الهدف واستقامة المعصم' }
    ];
    const p = armExtensions[activeStep];

    return (
      <svg viewBox="0 0 440 265" className="w-full h-auto max-h-[270px]" role="img" aria-label="محاكاة مسار اللكمة">
        <rect x="0" y="0" width="440" height="235" fill="#F8FAFC" rx="8" />
        <rect x="20" y="235" width="400" height="12" rx="4" fill="#0B1D3A" />

        {/* Level Reference Lines */}
        <line x1="60" y1="74" x2="390" y2="74" stroke="#CBD5E1" strokeDasharray="4 4" />
        <text x="72" y="68" fontSize="10" fill="#64748B">مستوى الرأس (أولغول)</text>
        <line x1="60" y1="114" x2="390" y2="114" stroke="#CBD5E1" strokeDasharray="4 4" />
        <text x="72" y="108" fontSize="10" fill="#64748B">مستوى الجذع (مومتونغ)</text>

        {/* Target Marker */}
        <circle cx="348" cy={targetY} r="13" fill="none" stroke="#C81E2B" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="348" cy={targetY} r="4" fill="#C81E2B" />

        {/* Stance Legs */}
        <polyline points="195,145 155,192 135,235" fill="none" stroke="#0B1D3A" strokeWidth="14" strokeLinecap="round" />
        <polyline points="195,145 155,192 135,235" fill="none" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" />
        <polyline points="195,145 245,186 255,235" fill="none" stroke="#0B1D3A" strokeWidth="14" strokeLinecap="round" />
        <polyline points="195,145 245,186 255,235" fill="none" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" />

        {/* Torso */}
        <line x1="195" y1="145" x2="195" y2="85" stroke="#0B1D3A" strokeWidth="22" strokeLinecap="round" />
        <line x1="195" y1="145" x2="195" y2="85" stroke="#FFFFFF" strokeWidth="17" strokeLinecap="round" />
        <rect x="184" y="138" width="22" height="6" rx="2" fill="#1D4ED8" />
        <circle cx="195" cy="64" r="13" fill="#F1C2A0" stroke="#0B1D3A" strokeWidth="2" />

        {/* Counter-pulling Hand (Hikite) */}
        <line x1="195" y1="92" x2={p.hx} y2={p.hy} stroke="#64748B" strokeWidth="8" strokeLinecap="round" />
        <circle cx={p.hx} cy={p.hy} r="5" fill="#E2A87E" stroke="#0B1D3A" strokeWidth="1.5" />

        {/* Striking Arm */}
        <line x1="195" y1="92" x2={p.fx} y2={p.fy} stroke="#1D4ED8" strokeWidth="11" strokeLinecap="round" />
        <line x1="195" y1="92" x2={p.fx} y2={p.fy} stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
        <circle cx={p.fx} cy={p.fy} r="7" fill={activeStep === 3 ? '#C81E2B' : '#E2A87E'} stroke="#0B1D3A" strokeWidth="2" />

        <text x="220" y="260" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0B1D3A">
          {p.label}
        </text>
      </svg>
    );
  };

  return (
    <section id="level-2" className="py-14 lg:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
          <div>
            <div className="text-xs sm:text-sm font-semibold text-[#C81E2B] mb-1.5">
              المستوى الثاني · تطبيق القوة من الحركة
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1D3A]">
              المهارات الهجومية من الحركة
            </h2>
            <p className="text-slate-600 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
              تعلّم التسلسل الحركي الدقيق للكمة العالية، واللكمة المتوسطة، والركلة الأمامية عبر مشغل المراحل الأربع والتوجيه الصوتي.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <VoiceoverButton
              id={`offense_${skill.id}`}
              text={skill.voiceScript}
              title={`شرح ${skill.arabicName}`}
              tone="lesson"
              label={`استمع لشرح ${skill.arabicName}`}
              variant="navy"
            />
            <button
              type="button"
              onClick={onCompleteLevel2}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-colors cursor-pointer min-h-[40px] whitespace-nowrap ${
                level2Completed
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-[#0B1D3A] border-slate-300 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>{level2Completed ? 'تم إتمام المستوى الثاني' : 'تحديد المستوى كمكتمل'}</span>
            </button>
          </div>
        </div>

        {/* Skill Selection Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-xl w-fit" role="tablist" aria-label="اختر المهارة الهجومية">
          {OFFENSIVE_SKILLS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selectedSkillId === item.id}
              onClick={() => handleSelectSkill(item.id)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap min-h-[40px] ${
                selectedSkillId === item.id
                  ? 'bg-[#0B1D3A] text-white shadow-sm'
                  : 'text-slate-700 hover:text-[#0B1D3A] hover:bg-white/70'
              }`}
            >
              {item.arabicName} ({item.koreanPronunciation})
            </button>
          ))}
        </div>

        {/* Two-Zone Kinetic Stage & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Interactive Kinetic Motion Stage */}
          <div className="lg:col-span-6 bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#0B1D3A]">
                    {skill.arabicName}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#C81E2B] font-semibold">
                    {skill.koreanPronunciation}
                  </p>
                </div>
                <div className="text-xs font-mono text-slate-600 tabular-nums">
                  المرحلة {activeStep + 1} من 4
                </div>
              </div>

              {renderKineticDiagram()}
            </div>

            {/* Playback Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (activeStep === 3 && !isPlaying) setActiveStep(0);
                    setIsPlaying((prev) => !prev);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer min-h-[40px] whitespace-nowrap"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" aria-hidden="true" />
                      <span>إيقاف مؤقت</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" aria-hidden="true" />
                      <span>تشغيل الحركة</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveStep((prev) => (prev + 1) % 4);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#0B1D3A] bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer min-h-[40px] whitespace-nowrap"
                >
                  <SkipForward className="w-4 h-4" aria-hidden="true" />
                  <span>الخطوة التالية</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveStep(0);
                  }}
                  aria-label="إعادة الخطوات"
                  className="p-2 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Target className="w-4 h-4 text-[#C81E2B]" aria-hidden="true" />
                <span>{skill.strikingSurface}</span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Guide & Kick Photo Reference */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span>منطقة الاستهداف: <strong className="text-[#0B1D3A]">{skill.targetZone}</strong></span>
                <span aria-hidden="true">·</span>
                <span>سطح الضرب: <strong className="text-[#C81E2B]">{skill.strikingSurface}</strong></span>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{skill.summary}</p>

              {/* Clickable 4 Stages */}
              <div className="space-y-2.5 pt-2">
                {skill.steps.map((step, idx) => {
                  const isCurrent = activeStep === idx;
                  return (
                    <button
                      key={step.title}
                      type="button"
                      onClick={() => {
                        setIsPlaying(false);
                        setActiveStep(idx);
                      }}
                      className={`w-full text-right p-3.5 rounded-lg border transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-[#0B1D3A] text-white border-[#0B1D3A]'
                          : 'bg-white text-[#0B1D3A] border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-display font-bold text-sm">{step.title}</div>
                      <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${isCurrent ? 'text-slate-200' : 'text-slate-600'}`}>
                        {step.detail}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-200 text-xs sm:text-sm text-blue-900 bg-blue-50/70 p-3.5 rounded-lg border border-blue-200">
                <strong>نصيحة المدرب:</strong> {skill.coachingTip}
              </div>
            </div>

            {/* Compact Photo Reference Strip */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
              <div className="w-28 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                {!imgError ? (
                  <img
                    src={kickMotionImg}
                    alt="نموذج تطبيقي للركلة الأمامية في صالة التايكوندو"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#0B1D3A]" />
                )}
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-[#0B1D3A]">
                  معيار التنفيذ من الحركة
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  يُقاس جودة الهجوم بثبات قدم الارتكاز، واستقامة الجذع، وسحب اليد أو الرجل بسرعة بعد ملامسة الهدف.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
