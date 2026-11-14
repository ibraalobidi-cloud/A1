import { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  ArrowLeftRight
} from 'lucide-react';
import apSeogiImg from '../assets/images/stance_ap_seogi_dobok_1794648044982.jpg';
import apKubiImg from '../assets/images/stance_ap_kubi_saudi_1794649577511.jpg';
import { STANCES, STANCE_COMPARISON_ROWS } from '../data/curriculum';
import { VoiceoverButton } from './VoiceoverButton';
import { stopArabicSpeech } from '../utils/speech';

interface LevelOneStancesProps {
  onCompleteLevel1: () => void;
  onUseSimulator: () => void;
  level1Completed: boolean;
  simulatorCompleted: boolean;
}

export function LevelOneStances({
  onCompleteLevel1,
  onUseSimulator,
  level1Completed,
  simulatorCompleted
}: LevelOneStancesProps) {
  const [activeStance, setActiveStance] = useState<'ap_seogi' | 'ap_kubi'>('ap_seogi');
  const [imgErrors, setImgErrors] = useState<{ ap_seogi?: boolean; ap_kubi?: boolean }>({});

  // Simulator interactive physics parameters
  const [stepLengthCm, setStepLengthCm] = useState<number>(40);
  const [kneeFlexDeg, setKneeFlexDeg] = useState<number>(10);
  const [frontWeightPct, setFrontWeightPct] = useState<number>(50);

  const backWeightPct = 100 - frontWeightPct;

  const applyPreset = (preset: 'ap_seogi' | 'ap_kubi' | 'imbalance') => {
    onUseSimulator();
    if (preset === 'ap_seogi') {
      setStepLengthCm(40);
      setKneeFlexDeg(10);
      setFrontWeightPct(50);
    } else if (preset === 'ap_kubi') {
      setStepLengthCm(85);
      setKneeFlexDeg(45);
      setFrontWeightPct(60);
    } else {
      setStepLengthCm(90);
      setKneeFlexDeg(52);
      setFrontWeightPct(80);
    }
  };

  // Biomechanical evaluation logic
  const getDiagnosis = () => {
    const isApSeogiMatch =
      stepLengthCm >= 32 &&
      stepLengthCm <= 52 &&
      kneeFlexDeg <= 18 &&
      frontWeightPct >= 45 &&
      frontWeightPct <= 55;

    const isApKubiMatch =
      stepLengthCm >= 72 &&
      stepLengthCm <= 95 &&
      kneeFlexDeg >= 34 &&
      kneeFlexDeg <= 50 &&
      frontWeightPct >= 55 &&
      frontWeightPct <= 68;

    if (isApSeogiMatch) {
      return {
        status: 'optimal',
        badgeText: 'تطابق مثالي · وقفة المشي (أب سوجي)',
        detail:
          'توزيع الوزن متعادل (قريب من 50% / 50%) وخطوة طبيعية مرنة تسمح بالانتقال السريع مع ثبات الجذع.'
      };
    }
    if (isApKubiMatch) {
      return {
        status: 'optimal',
        badgeText: 'تطابق مثالي · وقفة الطعن الأمامية (أب كوبي)',
        detail:
          'خطوة عميقة وثني ركبة أمامية يغطي مشط القدم، مع توزيع وزن مثالي نحو 60% أمام و40% خلف.'
      };
    }
    if (frontWeightPct > 70) {
      return {
        status: 'warning',
        badgeText: 'تنبيه توازن · ثقل مفرط على القدم الأمامية',
        detail:
          'اندفاع الوزن فوق 70% للأمام يفقدك الارتكاز الخلفي ويسهّل اختلال التوازن عند تلقي صد أو تغيير الاتجاه.'
      };
    }
    if (frontWeightPct < 42) {
      return {
        status: 'warning',
        badgeText: 'تنبيه توازن · تراجع زائد للخلف',
        detail:
          'انزياح الوزن للخلف يضعف قوة الدفع الهجومي في الوقفات الأمامية. أعد توزيع الثقل بين 50% و60% للأمام.'
      };
    }
    return {
      status: 'adjusting',
      badgeText: 'وضعية انتقالية · اضبط طول الخطوة وزاوية الركبة',
      detail:
        'جرّب المواءمة بين طول الخطوة وزاوية ثني الركبة الأمامية لتصل إلى إحدى الوقفتين القياسيتين (أب سوجي أو أب كوبي).'
    };
  };

  const diagnosis = getDiagnosis();

  // Compute SVG biomechanical coordinates
  // Mat baseline y = 240, Hip center x shifts smoothly with frontWeightPct
  const rearFootX = 240 - (stepLengthCm - 30) * 1.45; // 240 down to ~145
  const frontFootX = 300 + (stepLengthCm - 30) * 1.45; // 300 up to ~395
  const spanWidth = frontFootX - rearFootX;
  const weightRatio = frontWeightPct / 100;
  const cogX = rearFootX + spanWidth * weightRatio;

  // Knee bend lowers hip slightly and pushes front knee forward
  const hipY = 132 + kneeFlexDeg * 0.48;
  const frontKneeX = frontFootX - 8 + kneeFlexDeg * 0.55;
  const frontKneeY = 186 + kneeFlexDeg * 0.25;
  const rearKneeX = (rearFootX + cogX) * 0.52;
  const rearKneeY = 188 + (kneeFlexDeg < 20 ? 2 : 0);

  // Torso lean slightly when overweighted front (> 68%)
  const torsoLean = frontWeightPct > 68 ? (frontWeightPct - 68) * 1.1 : 0;
  const shoulderX = cogX + torsoLean;
  const shoulderY = hipY - 56;
  const headX = shoulderX + torsoLean * 0.35;
  const headY = shoulderY - 22;

  const currentDetail = STANCES[activeStance];

  return (
    <section id="level-1" className="py-14 lg:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Level Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
          <div>
            <div className="text-xs sm:text-sm font-semibold text-blue-700 mb-1.5">
              المستوى الأول · الأساس الميكانيكي للاتزان
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1D3A]">
              الوقفات الأساسية والمقارنة التفاعلية
            </h2>
            <p className="text-slate-600 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
              تعلّم الفرق الدقيق بين وقفة المشي (أب سوجي) ووقفة الطعن الأمامية (أب كوبي)، ثم اختبر توزيع وزن الجسم عملياً في مختبر المحاكاة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <VoiceoverButton
              id={`stance_${activeStance}`}
              text={currentDetail.voiceScript}
              title={`شرح ${currentDetail.arabicName}`}
              tone="lesson"
              label={`استمع لشرح ${currentDetail.arabicName}`}
              variant="navy"
            />
            <button
              type="button"
              onClick={onCompleteLevel1}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-colors cursor-pointer min-h-[40px] whitespace-nowrap ${
                level1Completed
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-[#0B1D3A] border-slate-300 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>{level1Completed ? 'تم إتمام المستوى الأول' : 'تحديد المستوى كمكتمل'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Stance Selector + Side-by-Side Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Stance Visual Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="inline-flex p-1 bg-slate-200/80 rounded-lg self-start" role="tablist" aria-label="اختيار الوقفة الأساسية">
              <button
                type="button"
                role="tab"
                aria-selected={activeStance === 'ap_seogi'}
                onClick={() => {
                  stopArabicSpeech();
                  setActiveStance('ap_seogi');
                }}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  activeStance === 'ap_seogi'
                    ? 'bg-white text-[#0B1D3A] shadow-sm'
                    : 'text-slate-600 hover:text-[#0B1D3A]'
                }`}
              >
                وقفة المشي (أب سوجي)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeStance === 'ap_kubi'}
                onClick={() => {
                  stopArabicSpeech();
                  setActiveStance('ap_kubi');
                }}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  activeStance === 'ap_kubi'
                    ? 'bg-white text-[#0B1D3A] shadow-sm'
                    : 'text-slate-600 hover:text-[#0B1D3A]'
                }`}
              >
                وقفة الطعن الأمامية (أب كوبي)
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex-1 flex flex-col">
              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                {!imgErrors[activeStance] ? (
                  <img
                    src={activeStance === 'ap_seogi' ? apSeogiImg : apKubiImg}
                    alt={`${currentDetail.arabicName} (${currentDetail.koreanPronunciation}) في بدلة التايكوندو`}
                    referrerPolicy="no-referrer"
                    onError={() => setImgErrors((prev) => ({ ...prev, [activeStance]: true }))}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-100 to-blue-50">
                    <ShieldCheck className="w-10 h-10 text-[#0B1D3A] mb-2" />
                    <span className="font-display font-bold text-[#0B1D3A]">{currentDetail.arabicName}</span>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-[#0B1D3A]">
                    {currentDetail.arabicName}
                  </h3>
                  <span className="text-sm font-semibold text-[#C81E2B]">
                    {currentDetail.koreanPronunciation}
                  </span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">{currentDetail.summary}</p>

                <ul className="space-y-2 text-sm text-slate-700 pt-2 border-t border-slate-100">
                  {currentDetail.keyPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="font-mono text-xs font-bold text-blue-700 mt-1 tabular-nums">
                        0{idx + 1}.
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-3 border-t border-slate-100 text-xs sm:text-sm space-y-1.5">
                  <p className="text-red-700 font-semibold">
                    خطأ شائع: <span className="font-normal text-slate-700">{currentDetail.commonMistake}</span>
                  </p>
                  <p className="text-emerald-800 font-semibold">
                    التصحيح: <span className="font-normal text-slate-700">{currentDetail.correction}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Stance Comparison Matrix */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#0B1D3A]">
                    جدول المقارنة التفاعلي بين الوقفتين
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    اضغط على أي صف أو عمود لمعاينة الفروق الهندسية والميكانيكية مباشرة
                  </p>
                </div>
                <ArrowLeftRight className="w-5 h-5 text-blue-700 shrink-0" aria-hidden="true" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#0B1D3A] text-white">
                      <th className="py-3 px-4 font-semibold rounded-tr-lg">معيار الأداء</th>
                      <th
                        onClick={() => setActiveStance('ap_seogi')}
                        className={`py-3 px-4 font-semibold cursor-pointer transition-colors ${
                          activeStance === 'ap_seogi' ? 'bg-blue-700' : 'hover:bg-slate-800'
                        }`}
                      >
                        وقفة المشي (أب سوجي)
                      </th>
                      <th
                        onClick={() => setActiveStance('ap_kubi')}
                        className={`py-3 px-4 font-semibold rounded-tl-lg cursor-pointer transition-colors ${
                          activeStance === 'ap_kubi' ? 'bg-[#C81E2B]' : 'hover:bg-slate-800'
                        }`}
                      >
                        وقفة الطعن (أب كوبي)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {STANCE_COMPARISON_ROWS.map((row) => (
                      <tr key={row.criterion} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-[#0B1D3A] whitespace-nowrap">
                          {row.criterion}
                        </td>
                        <td
                          onClick={() => setActiveStance('ap_seogi')}
                          className={`py-3.5 px-4 cursor-pointer transition-colors ${
                            activeStance === 'ap_seogi'
                              ? 'bg-blue-50/70 text-[#0B1D3A] font-medium'
                              : 'text-slate-600'
                          }`}
                        >
                          {row.apSeogi}
                        </td>
                        <td
                          onClick={() => setActiveStance('ap_kubi')}
                          className={`py-3.5 px-4 cursor-pointer transition-colors ${
                            activeStance === 'ap_kubi'
                              ? 'bg-red-50/70 text-[#0B1D3A] font-medium'
                              : 'text-slate-600'
                          }`}
                        >
                          {row.apKubi}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-slate-600">
                انتقل الآن لتجربة تغيير طول الخطوة وثني الركبة ومراقبة مركز الثقل في المحاكاة التفاعلية أدناه.
              </p>
              <a
                href="#simulator"
                onClick={() => applyPreset(activeStance)}
                className="inline-flex items-center justify-center px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
              >
                تجربة {currentDetail.arabicName} في المحاكاة
              </a>
            </div>
          </div>
        </div>

        {/* Two-Zone Body Weight Distribution Simulator */}
        <div id="simulator" className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="text-xs font-semibold text-[#C81E2B] mb-1">
                المختبر الحركي التفاعلي · محاكاة الميكانيكا الحيوية
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#0B1D3A]">
                محاكاة مرئية لتوزيع وزن الجسم ومركز الثقل
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => applyPreset('ap_seogi')}
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer whitespace-nowrap min-h-[40px]"
              >
                وقفة المشي (50/50)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('ap_kubi')}
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer whitespace-nowrap min-h-[40px]"
              >
                وقفة الطعن (60/40)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('imbalance')}
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer whitespace-nowrap min-h-[40px]"
              >
                محاكاة اختلال التوازن
              </button>
              <button
                type="button"
                onClick={() => applyPreset('ap_seogi')}
                aria-label="إعادة ضبط المحاكاة"
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-start">
            {/* Left/Primary Zone (60-65%): Interactive Biomechanical Canvas */}
            <div className="lg:col-span-7 space-y-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span>المسقط الجانبي الحي · توزيع القوى على البساط</span>
                  <span className="font-mono text-[#0B1D3A] font-semibold tabular-nums">
                    المسافة: {stepLengthCm} سم · ثني الركبة: {kneeFlexDeg}°
                  </span>
                </div>

                {/* Live SVG Biomechanical Figure */}
                <svg
                  viewBox="0 0 540 290"
                  className="w-full h-auto max-h-[340px]"
                  role="img"
                  aria-label="رسم تفاعلي لتوزيع وزن الجسم في وقفات التايكوندو"
                >
                  {/* Background Subtle Grid */}
                  <defs>
                    <pattern id="dojangGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect x="0" y="0" width="540" height="240" fill="url(#dojangGrid)" rx="8" />

                  {/* Dojang Mat Base */}
                  <rect x="30" y="240" width="480" height="14" rx="4" fill="#1D4ED8" />
                  <rect x="190" y="240" width="160" height="14" fill="#C81E2B" />

                  {/* Balanced Target Zone Highlight */}
                  <rect
                    x={rearFootX + spanWidth * 0.45}
                    y="236"
                    width={spanWidth * 0.23}
                    height="6"
                    rx="3"
                    fill="#10B981"
                    opacity="0.7"
                  />

                  {/* Center of Gravity Plumb Line */}
                  <line
                    x1={cogX}
                    y1={hipY}
                    x2={cogX}
                    y2="240"
                    stroke={diagnosis.status === 'warning' ? '#DC2626' : '#B4860B'}
                    strokeWidth="2.5"
                    strokeDasharray="5 4"
                  />
                  <circle
                    cx={cogX}
                    cy={hipY}
                    r="7"
                    fill={diagnosis.status === 'warning' ? '#DC2626' : '#D4AF37'}
                    stroke="#0B1D3A"
                    strokeWidth="2"
                  />

                  {/* Rear Leg (Dobok White with Navy outline) */}
                  <polyline
                    points={`${cogX},${hipY} ${rearKneeX},${rearKneeY} ${rearFootX},238`}
                    fill="none"
                    stroke="#0B1D3A"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points={`${cogX},${hipY} ${rearKneeX},${rearKneeY} ${rearFootX},238`}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Front Leg */}
                  <polyline
                    points={`${cogX},${hipY} ${frontKneeX},${frontKneeY} ${frontFootX},238`}
                    fill="none"
                    stroke="#0B1D3A"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points={`${cogX},${hipY} ${frontKneeX},${frontKneeY} ${frontFootX},238`}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Feet Pads */}
                  <ellipse cx={rearFootX - 6} cy="238" rx="14" ry="5" fill="#0B1D3A" />
                  <ellipse cx={frontFootX + 8} cy="238" rx="15" ry="5" fill="#0B1D3A" />

                  {/* Torso (White Dobok Jacket) */}
                  <line
                    x1={cogX}
                    y1={hipY}
                    x2={shoulderX}
                    y2={shoulderY}
                    stroke="#0B1D3A"
                    strokeWidth="24"
                    strokeLinecap="round"
                  />
                  <line
                    x1={cogX}
                    y1={hipY}
                    x2={shoulderX}
                    y2={shoulderY}
                    stroke="#FFFFFF"
                    strokeWidth="19"
                    strokeLinecap="round"
                  />

                  {/* Belt Tie (Red/Blue Accent) */}
                  <rect
                    x={cogX - 11}
                    y={hipY - 6}
                    width="22"
                    height="7"
                    rx="2"
                    fill="#C81E2B"
                  />

                  {/* Guard Arm */}
                  <polyline
                    points={`${shoulderX},${shoulderY + 6} ${shoulderX + 26},${shoulderY + 18} ${shoulderX + 46},${shoulderY + 4}`}
                    fill="none"
                    stroke="#0B1D3A"
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points={`${shoulderX},${shoulderY + 6} ${shoulderX + 26},${shoulderY + 18} ${shoulderX + 46},${shoulderY + 4}`}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx={shoulderX + 48} cy={shoulderY + 3} r="5.5" fill="#E2A87E" stroke="#0B1D3A" strokeWidth="1.5" />

                  {/* Head */}
                  <circle cx={headX} cy={headY} r="14" fill="#F1C2A0" stroke="#0B1D3A" strokeWidth="2.5" />
                  <path
                    d={`M ${headX - 13} ${headY - 4} Q ${headX} ${headY - 19} ${headX + 13} ${headY - 4}`}
                    fill="#0B1D3A"
                  />

                  {/* Labels */}
                  <text x={rearFootX} y="274" textAnchor="middle" fontSize="12" fontWeight="700" fill="#C81E2B">
                    القدم الخلفية ({backWeightPct}%)
                  </text>
                  <text x={frontFootX} y="274" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1D4ED8">
                    القدم الأمامية ({frontWeightPct}%)
                  </text>
                  <text x={cogX} y={hipY - 72} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0B1D3A">
                    مركز الثقل
                  </text>
                </svg>

                {/* Live Weight Distribution Pressure Bars */}
                <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-blue-800">ضغط القدم الأمامية</span>
                      <span className="font-mono text-blue-800 tabular-nums">{frontWeightPct}%</span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-700 transition-all duration-150"
                        style={{ width: `${frontWeightPct}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-[#C81E2B]">ضغط القدم الخلفية</span>
                      <span className="font-mono text-[#C81E2B] tabular-nums">{backWeightPct}%</span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C81E2B] transition-all duration-150"
                        style={{ width: `${backWeightPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Zone (35-40%): Sliders & Live Biomechanical Feedback */}
            <div className="lg:col-span-5 space-y-6">
              {/* Sliders */}
              <div className="space-y-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div>
                  <div className="flex justify-between items-center text-sm font-semibold text-[#0B1D3A] mb-2">
                    <label htmlFor="slider-step">طول الخطوة (المسافة بين القدمين)</label>
                    <span className="font-mono text-blue-700 tabular-nums">{stepLengthCm} سم</span>
                  </div>
                  <input
                    id="slider-step"
                    type="range"
                    min={30}
                    max={95}
                    step={5}
                    value={stepLengthCm}
                    onChange={(e) => {
                      onUseSimulator();
                      setStepLengthCm(Number(e.target.value));
                    }}
                    className="w-full accent-[#0B1D3A] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>30 سم (خطوة قصيرة)</span>
                    <span>95 سم (طعن عميق)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-sm font-semibold text-[#0B1D3A] mb-2">
                    <label htmlFor="slider-knee">زاوية ثني الركبة الأمامية</label>
                    <span className="font-mono text-blue-700 tabular-nums">{kneeFlexDeg}°</span>
                  </div>
                  <input
                    id="slider-knee"
                    type="range"
                    min={5}
                    max={55}
                    step={5}
                    value={kneeFlexDeg}
                    onChange={(e) => {
                      onUseSimulator();
                      setKneeFlexDeg(Number(e.target.value));
                    }}
                    className="w-full accent-blue-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>5° (ممدودة تقريباً)</span>
                    <span>55° (ثني عميق)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-sm font-semibold text-[#0B1D3A] mb-2">
                    <label htmlFor="slider-weight">نسبة ارتكاز الوزن على القدم الأمامية</label>
                    <span className="font-mono text-[#C81E2B] tabular-nums">
                      {frontWeightPct}% أمام / {backWeightPct}% خلف
                    </span>
                  </div>
                  <input
                    id="slider-weight"
                    type="range"
                    min={30}
                    max={85}
                    step={5}
                    value={frontWeightPct}
                    onChange={(e) => {
                      onUseSimulator();
                      setFrontWeightPct(Number(e.target.value));
                    }}
                    className="w-full accent-[#C81E2B] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>30% أمام (خلفي)</span>
                    <span>50% متوازن</span>
                    <span>85% مفرط للأمام</span>
                  </div>
                </div>
              </div>

              {/* Explicit Dual-Coded Status Diagnosis */}
              <div
                className={`p-5 rounded-xl border ${
                  diagnosis.status === 'optimal'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : diagnosis.status === 'warning'
                      ? 'bg-red-50 border-red-200 text-red-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm mb-2">
                  {diagnosis.status === 'optimal' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-700 shrink-0" aria-hidden="true" />
                  )}
                  <span>{diagnosis.badgeText}</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed opacity-90">{diagnosis.detail}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <VoiceoverButton
                  id="sim_diagnosis"
                  label="قراءة التشخيص الحركي"
                  title="تشخيص محاكاة توزيع الوزن"
                  tone={diagnosis.status === 'optimal' ? 'encourage_correct' : 'lesson'}
                  variant="outline"
                  text={`${diagnosis.badgeText}. نسبة الوزن الحالية هي ${frontWeightPct} بالمئة على القدم الأمامية و${backWeightPct} بالمئة على القدم الخلفية. ${diagnosis.detail}`}
                />
                {simulatorCompleted && (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    تم حفظ تجربة المحاكاة
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
