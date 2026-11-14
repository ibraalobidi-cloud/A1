import { CheckCircle2, Download } from 'lucide-react';

interface ProgressStripProps {
  studentName: string;
  onStudentNameChange: (name: string) => void;
  completedMilestones: string[];
  totalMilestones: number;
  progressPct: number;
  onExportHtml: () => void;
}

const MILESTONE_LABELS: Record<string, string> = {
  level1: 'الوقفات الأساسية',
  simulator: 'محاكاة الوزن',
  level2: 'المهارات الهجومية',
  level3: 'الجملة الحركية',
  self_assessment: 'التقييم الذاتي',
  quiz: 'الاختبار التفاعلي'
};

export function ProgressStrip({
  studentName,
  onStudentNameChange,
  completedMilestones,
  totalMilestones,
  progressPct,
  onExportHtml
}: ProgressStripProps) {
  return (
    <section
      aria-label="شريط التقدم وحفظ الإنجاز"
      className="no-print bg-white border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 flex-1">
          <div className="flex items-center gap-2">
            <label htmlFor="student-name-input" className="text-xs sm:text-sm font-semibold text-[#0B1D3A] whitespace-nowrap">
              اسم البطل:
            </label>
            <input
              id="student-name-input"
              type="text"
              value={studentName}
              onChange={(e) => onStudentNameChange(e.target.value)}
              placeholder="اكتب اسمك للشهادة..."
              className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-[#0B1D3A] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white w-48 sm:w-56"
            />
          </div>

          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
              <span>تقدمك في الأكاديمية (محفوظ تلقائياً)</span>
              <span className="font-mono text-[#0B1D3A] tabular-nums">
                {completedMilestones.length} / {totalMilestones} · {progressPct}%
              </span>
            </div>
            <div
              className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-gradient-to-l from-[#1D4ED8] to-[#0B1D3A] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2
              className={`w-4 h-4 ${progressPct === 100 ? 'text-emerald-600' : 'text-blue-700'}`}
              aria-hidden="true"
            />
            <span>
              {completedMilestones.length > 0
                ? `آخر إنجاز: ${MILESTONE_LABELS[completedMilestones[completedMilestones.length - 1]] ?? 'مسجل'}`
                : 'ابدأ باستكشاف المستويات لتسجيل تقدمك'}
            </span>
          </div>

          <button
            type="button"
            onClick={onExportHtml}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#0B1D3A] bg-amber-50 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
          >
            <Download className="w-4 h-4 text-amber-700" aria-hidden="true" />
            <span>تحميل الملخص HTML</span>
          </button>
        </div>
      </div>
    </section>
  );
}
