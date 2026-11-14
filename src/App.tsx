import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProgressStrip } from './components/ProgressStrip';
import { LevelOneStances } from './components/LevelOneStances';
import { LevelTwoOffense } from './components/LevelTwoOffense';
import { LevelThreePerformance } from './components/LevelThreePerformance';
import { TerminologyDeck } from './components/TerminologyDeck';
import { SelfAssessmentCard, MasteryLevel } from './components/SelfAssessmentCard';
import { InteractiveQuiz } from './components/InteractiveQuiz';
import { CertificateSection } from './components/CertificateSection';
import { AudioControlBar } from './components/AudioControlBar';
import { SaudiFlag } from './components/SaudiFlag';
import { QUIZ_QUESTIONS, SELF_ASSESSMENT_CRITERIA } from './data/curriculum';
import { downloadStandaloneHtml } from './utils/exportHtml';

const STORAGE_KEY = 'taekwondo_heroes_academy_v1';

interface SavedAcademyState {
  studentName: string;
  completedMilestones: string[];
  ratings: Record<string, MasteryLevel>;
  assessmentSaved: boolean;
  bestQuizScore: number | null;
}

const TOTAL_MILESTONES = 6;

function loadSavedState(): SavedAcademyState {
  if (typeof window === 'undefined') {
    return {
      studentName: '',
      completedMilestones: [],
      ratings: {},
      assessmentSaved: false,
      bestQuizScore: null
    };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        studentName: '',
        completedMilestones: [],
        ratings: {},
        assessmentSaved: false,
        bestQuizScore: null
      };
    }
    const parsed = JSON.parse(raw) as Partial<SavedAcademyState>;
    return {
      studentName: typeof parsed.studentName === 'string' ? parsed.studentName : '',
      completedMilestones: Array.isArray(parsed.completedMilestones) ? parsed.completedMilestones : [],
      ratings: parsed.ratings && typeof parsed.ratings === 'object' ? parsed.ratings : {},
      assessmentSaved: Boolean(parsed.assessmentSaved),
      bestQuizScore: typeof parsed.bestQuizScore === 'number' ? parsed.bestQuizScore : null
    };
  } catch {
    return {
      studentName: '',
      completedMilestones: [],
      ratings: {},
      assessmentSaved: false,
      bestQuizScore: null
    };
  }
}

export default function App() {
  const [state, setState] = useState<SavedAcademyState>(loadSavedState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const markMilestone = (milestone: string) => {
    setState((prev) => {
      if (prev.completedMilestones.includes(milestone)) return prev;
      return {
        ...prev,
        completedMilestones: [...prev.completedMilestones, milestone]
      };
    });
  };

  const progressPct = Math.round((state.completedMilestones.length / TOTAL_MILESTONES) * 100);

  const handleExportHtml = () => {
    const masteredCount = Object.values(state.ratings).filter((r) => r === 'mastered').length;
    downloadStandaloneHtml({
      studentName: state.studentName,
      progressPct,
      quizScore: state.bestQuizScore,
      quizTotal: QUIZ_QUESTIONS.length,
      selfAssessmentMastered: masteredCount,
      selfAssessmentTotal: SELF_ASSESSMENT_CRITERIA.length
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1">
        <HeroSection />

        <ProgressStrip
          studentName={state.studentName}
          onStudentNameChange={(name) => setState((prev) => ({ ...prev, studentName: name }))}
          completedMilestones={state.completedMilestones}
          totalMilestones={TOTAL_MILESTONES}
          progressPct={progressPct}
          onExportHtml={handleExportHtml}
        />

        <LevelOneStances
          onCompleteLevel1={() => markMilestone('level1')}
          onUseSimulator={() => markMilestone('simulator')}
          level1Completed={state.completedMilestones.includes('level1')}
          simulatorCompleted={state.completedMilestones.includes('simulator')}
        />

        <LevelTwoOffense
          onCompleteLevel2={() => markMilestone('level2')}
          level2Completed={state.completedMilestones.includes('level2')}
        />

        <LevelThreePerformance
          onCompleteLevel3={() => markMilestone('level3')}
          level3Completed={state.completedMilestones.includes('level3')}
        />

        <TerminologyDeck />

        <SelfAssessmentCard
          ratings={state.ratings}
          onRate={(criterionId, level) =>
            setState((prev) => ({
              ...prev,
              assessmentSaved: false,
              ratings: { ...prev.ratings, [criterionId]: level }
            }))
          }
          onSaveAssessment={() => {
            setState((prev) => ({
              ...prev,
              assessmentSaved: true,
              completedMilestones: prev.completedMilestones.includes('self_assessment')
                ? prev.completedMilestones
                : [...prev.completedMilestones, 'self_assessment']
            }));
          }}
          assessmentSaved={state.assessmentSaved}
        />

        <InteractiveQuiz
          bestScore={state.bestQuizScore}
          onFinishQuiz={(score) => {
            setState((prev) => ({
              ...prev,
              bestQuizScore: prev.bestQuizScore === null ? score : Math.max(prev.bestQuizScore, score),
              completedMilestones: prev.completedMilestones.includes('quiz')
                ? prev.completedMilestones
                : [...prev.completedMilestones, 'quiz']
            }));
          }}
        />

        <CertificateSection
          studentName={state.studentName}
          onStudentNameChange={(name) => setState((prev) => ({ ...prev, studentName: name }))}
          progressPct={progressPct}
          quizScore={state.bestQuizScore}
          quizTotal={QUIZ_QUESTIONS.length}
          onExportHtml={handleExportHtml}
        />
      </main>

      <footer className="no-print bg-[#0B1D3A] text-slate-300 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-2.5">
            <SaudiFlag className="w-6 h-4" />
            <span>أبطال التايكوندو | أكاديمية المهارات الحركية — إعداد المعلمة: <strong className="text-white">عزيزة العنزي</strong></span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#top" className="hover:text-white transition-colors">
              العودة للأعلى
            </a>
            <a href="#quiz" className="hover:text-white transition-colors">
              الاختبار التفاعلي
            </a>
            <a href="#certificate" className="hover:text-white transition-colors">
              الشهادة
            </a>
          </div>
        </div>
      </footer>

      <AudioControlBar />
    </div>
  );
}
