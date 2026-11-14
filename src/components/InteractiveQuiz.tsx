import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  RotateCcw,
  Award,
  Volume2,
  VolumeX
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/curriculum';
import { VoiceoverButton } from './VoiceoverButton';
import { speakArabic, stopArabicSpeech } from '../utils/speech';

interface InteractiveQuizProps {
  bestScore: number | null;
  onFinishQuiz: (score: number) => void;
}

export function InteractiveQuiz({ bestScore, onFinishQuiz }: InteractiveQuizProps) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [autoSpeakFeedback, setAutoSpeakFeedback] = useState<boolean>(true);

  const currentQuestion = QUIZ_QUESTIONS[currentIdx];
  const hasAnswered = selectedOption !== null;
  const isCorrect = selectedOption === currentQuestion.correctIndex;

  const handleSelectOption = (optionIdx: number) => {
    if (hasAnswered) return;
    setSelectedOption(optionIdx);
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIdx }));

    const answeredCorrectly = optionIdx === currentQuestion.correctIndex;
    if (autoSpeakFeedback) {
      const spokenFeedback = answeredCorrectly
        ? `رائع جداً! أحسنت يا بطل! ${currentQuestion.feedbackCorrect}`
        : `محاولة جميلة! لا بأس، أنت قادر على النجاح. ${currentQuestion.feedbackWrong}`;

      void speakArabic(spokenFeedback, `quiz_fb_${currentQuestion.id}`, {
        tone: answeredCorrectly ? 'encourage_correct' : 'encourage_retry',
        title: answeredCorrectly ? 'تشجيع الإجابة الصحيحة' : 'توجيه وتصحيح لطيف',
        forceReplay: true
      });
    }
  };

  const handleNext = () => {
    stopArabicSpeech();
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      const totalCorrect = QUIZ_QUESTIONS.reduce((sum, q) => {
        const ans = q.id === currentQuestion.id ? selectedOption : answers[q.id];
        return ans === q.correctIndex ? sum + 1 : sum;
      }, 0);
      setQuizCompleted(true);
      onFinishQuiz(totalCorrect);

      if (autoSpeakFeedback) {
        const completionMsg =
          totalCorrect >= 7
            ? `ألف مبروك يا بطل! نتيجتك النهائية هي ${totalCorrect} من ${QUIZ_QUESTIONS.length}. أداء مذهل وتستحق شهادة الإنجاز الذهبية!`
            : totalCorrect >= 5
              ? `أحسنت يا بطل! نتيجتك ${totalCorrect} من ${QUIZ_QUESTIONS.length}. نتيجة جيدة جداً، ويمكنك الآن طباعة شهادتك أو المحاولة مجدداً!`
              : `محاولة طيبة يا بطل! حصلت على ${totalCorrect} من ${QUIZ_QUESTIONS.length}. راجع الدروس ومحاكاة الوزن ثم عد إلينا بقوة!`;

        void speakArabic(completionMsg, 'quiz_final_result', {
          tone: totalCorrect >= 5 ? 'encourage_correct' : 'encourage_retry',
          title: 'النتيجة النهائية للاختبار',
          forceReplay: true
        });
      }
    }
  };

  const handleRetry = () => {
    stopArabicSpeech();
    setCurrentIdx(0);
    setSelectedOption(null);
    setAnswers({});
    setQuizCompleted(false);
  };

  const finalScore = QUIZ_QUESTIONS.reduce((sum, q) => {
    return answers[q.id] === q.correctIndex ? sum + 1 : sum;
  }, 0);

  return (
    <section id="quiz" className="no-print py-14 lg:py-20 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="text-xs sm:text-sm font-semibold text-blue-700 mb-1.5">
              التقويم النهائي · تغذية راجعة فورية
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B1D3A]">
              الاختبار التفاعلي (8 أسئلة)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setAutoSpeakFeedback((prev) => !prev)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border cursor-pointer transition-colors min-h-[38px] ${
                autoSpeakFeedback
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
              aria-pressed={autoSpeakFeedback}
            >
              {autoSpeakFeedback ? (
                <Volume2 className="w-4 h-4" aria-hidden="true" />
              ) : (
                <VolumeX className="w-4 h-4" aria-hidden="true" />
              )}
              <span>{autoSpeakFeedback ? 'التشجيع الصوتي مفعّل' : 'التشجيع الصوتي صامت'}</span>
            </button>

            {bestScore !== null && (
              <div className="text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 font-mono tabular-nums">
                أفضل نتيجة مسجلة: {bestScore} / {QUIZ_QUESTIONS.length}
              </div>
            )}
          </div>
        </div>

        {!quizCompleted ? (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
            {/* Progress Header */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs sm:text-sm font-semibold text-[#C81E2B]">
                {currentQuestion.levelTag}
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold text-[#0B1D3A] tabular-nums">
                السؤال {currentIdx + 1} من {QUIZ_QUESTIONS.length}
              </span>
            </div>

            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0B1D3A] transition-all duration-300"
                style={{ width: `${((currentIdx + (hasAnswered ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question Stem */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#0B1D3A] leading-snug">
                {currentQuestion.question}
              </h3>
              <VoiceoverButton
                id={`quiz_q_${currentQuestion.id}`}
                title={`السؤال ${currentIdx + 1}`}
                tone="question"
                text={`${currentQuestion.question} ... الاختيارات هي: ${currentQuestion.options.join('، أو ')}`}
                label="قراءة السؤال"
                variant="subtle"
              />
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isOptionCorrect = idx === currentQuestion.correctIndex;

                let btnStyle =
                  'bg-white border-slate-300 text-[#0B1D3A] hover:border-blue-500 hover:bg-blue-50/40';
                if (hasAnswered) {
                  if (isOptionCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold';
                  } else if (isSelected && !isOptionCorrect) {
                    btnStyle = 'bg-red-50 border-red-400 text-red-950';
                  } else {
                    btnStyle = 'bg-white border-slate-200 text-slate-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-right p-4 rounded-xl border transition-colors flex items-center justify-between gap-3 ${btnStyle} ${
                      !hasAnswered ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold w-6 h-6 rounded-md bg-slate-100 text-[#0B1D3A] flex items-center justify-center shrink-0 tabular-nums">
                        {idx + 1}
                      </span>
                      <span className="text-sm sm:text-base">{opt}</span>
                    </div>

                    {hasAnswered && isOptionCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                    )}
                    {hasAnswered && isSelected && !isOptionCorrect && (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Immediate Explanatory Feedback */}
            {hasAnswered && (
              <div
                className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-red-50 border-red-200 text-red-950'
                }`}
              >
                <div className="space-y-1">
                  <div className="font-bold text-sm flex items-center gap-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                        <span>إجابة صحيحة</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-700" aria-hidden="true" />
                        <span>تحتاج إلى مراجعة</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    {isCorrect ? currentQuestion.feedbackCorrect : currentQuestion.feedbackWrong}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <VoiceoverButton
                    id={`quiz_fb_${currentQuestion.id}`}
                    title={isCorrect ? 'تشجيع الإجابة الصحيحة' : 'توجيه وتصحيح لطيف'}
                    tone={isCorrect ? 'encourage_correct' : 'encourage_retry'}
                    label="سماع التعليق"
                    variant="outline"
                    text={
                      isCorrect
                        ? `رائع جداً! أحسنت يا بطل! ${currentQuestion.feedbackCorrect}`
                        : `محاولة جميلة! لا بأس، أنت قادر على النجاح. ${currentQuestion.feedbackWrong}`
                    }
                  />
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#0B1D3A] rounded-lg hover:bg-[#14305E] transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[44px]"
                  >
                    <span>
                      {currentIdx < QUIZ_QUESTIONS.length - 1 ? 'السؤال التالي' : 'عرض النتيجة النهائية'}
                    </span>
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#0B1D3A] text-white rounded-xl p-8 text-center space-y-6">
            <Award className="w-14 h-14 text-amber-300 mx-auto" aria-hidden="true" />
            <div className="space-y-2">
              <div className="text-xs font-semibold text-amber-300">النتيجة النهائية للاختبار</div>
              <h3 className="font-display text-3xl sm:text-4xl font-extrabold font-mono tabular-nums">
                {finalScore} / {QUIZ_QUESTIONS.length}
              </h3>
              <p className="text-slate-200 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                {finalScore >= 7
                  ? 'أداء ممتاز! لقد أتقنت مفاهيم الوقفات الأساسية والمهارات الهجومية والجملة الحركية باستحقاق.'
                  : finalScore >= 5
                    ? 'نتيجة جيدة جداً! يمكنك إصدار شهادتك الآن أو إعادة الاختبار لتحقيق الدرجة الكاملة.'
                    : 'ننصح بمراجعة المستوى الأول والثاني وتجربة محاكاة الوزن ثم إعادة الاختبار لرفع نتيجتك.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="#certificate"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold bg-amber-400 text-[#0B1D3A] rounded-lg hover:bg-amber-300 transition-colors min-h-[44px]"
              >
                <span>عرض شهادة الإنجاز وطباعتها</span>
              </a>
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold bg-white/10 text-white border border-white/25 rounded-lg hover:bg-white/20 transition-colors cursor-pointer min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>إعادة الاختبار</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
