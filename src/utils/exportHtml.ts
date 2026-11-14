import { STANCE_COMPARISON_ROWS, OFFENSIVE_SKILLS, TERMINOLOGY_CARDS } from '../data/curriculum';

export interface ExportProgressSummary {
  studentName: string;
  progressPct: number;
  quizScore: number | null;
  quizTotal: number;
  selfAssessmentMastered: number;
  selfAssessmentTotal: number;
}

export function downloadStandaloneHtml(summary: ExportProgressSummary) {
  const safeName = summary.studentName.trim() || 'بطل التايكوندو';
  const dateStr = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const comparisonHtml = STANCE_COMPARISON_ROWS.map(
    (row) => `
      <tr>
        <td><strong>${row.criterion}</strong></td>
        <td>${row.apSeogi}</td>
        <td>${row.apKubi}</td>
      </tr>`
  ).join('');

  const offenseHtml = OFFENSIVE_SKILLS.map(
    (skill) => `
      <div class="card">
        <h3>${skill.arabicName} <span class="kr">(${skill.koreanPronunciation})</span></h3>
        <p>${skill.summary}</p>
        <p class="meta">الهدف: ${skill.targetZone} | سطح الضرب: ${skill.strikingSurface}</p>
      </div>`
  ).join('');

  const termsHtml = TERMINOLOGY_CARDS.map(
    (term) => `
      <div class="term-box">
        <div class="term-ar">${term.arabic}</div>
        <div class="term-kr">${term.phoneticArabic}</div>
        <div class="term-desc">${term.explanation}</div>
      </div>`
  ).join('');

  const htmlContent = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>أبطال التايكوندو | الملخص التفاعلي المحفوظ</title>
  <style>
    body { font-family: "Cairo", "Segoe UI", Tahoma, sans-serif; background: #f8fafc; color: #0b1d3a; margin: 0; padding: 32px 16px; line-height: 1.7; }
    .container { max-width: 960px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 32px; }
    .header { background: #0b1d3a; color: #ffffff; padding: 24px 28px; border-radius: 10px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
    .header h1 { margin: 0; font-size: 26px; }
    .header p { margin: 6px 0 0; color: #cbd5e1; font-size: 14px; }
    .badge-gold { border: 1px solid #d4af37; color: #facc15; padding: 8px 16px; border-radius: 8px; font-weight: bold; }
    h2 { color: #0b1d3a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 28px; }
    table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 14px; }
    th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: right; }
    th { background: #0b1d3a; color: #ffffff; }
    tr:nth-child(even) { background: #f8fafc; }
    .card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-top: 12px; background: #f8fafc; }
    .card h3 { margin: 0 0 6px; color: #1d4ed8; }
    .kr { color: #c81e2b; font-size: 14px; }
    .meta { font-size: 13px; color: #475569; margin: 8px 0 0; }
    .terms-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; margin-top: 14px; }
    .term-box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
    .term-ar { font-weight: bold; color: #0b1d3a; }
    .term-kr { font-size: 13px; color: #1d4ed8; margin: 4px 0; }
    .term-desc { font-size: 13px; color: #475569; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; display: flex; justify-content: space-between; }
    @media print { body { background: #fff; padding: 0; } .container { border: none; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1>أبطال التايكوندو | أكاديمية المهارات الحركية</h1>
        <p>الطالب: ${safeName} · إعداد المعلمة: عزيزة العنزي · تاريخ التصدير: ${dateStr}</p>
      </div>
      <div class="badge-gold">نسبة الإنجاز: ${summary.progressPct}%</div>
    </div>

    <p><strong>ملخص النتيجة:</strong> التقييم الذاتي (${summary.selfAssessmentMastered} من ${summary.selfAssessmentTotal} مهارات متقنة) · الاختبار التفاعلي (${summary.quizScore !== null ? `${summary.quizScore} من ${summary.quizTotal}` : 'لم يكتمل بعد'})</p>

    <h2>المستوى الأول: مقارنة الوقفات الأساسية</h2>
    <table>
      <thead>
        <tr>
          <th>معيار المقارنة</th>
          <th>وقفة المشي (أب سوجي)</th>
          <th>وقفة الطعن الأمامية (أب كوبي)</th>
        </tr>
      </thead>
      <tbody>${comparisonHtml}</tbody>
    </table>

    <h2>المستوى الثاني: المهارات الهجومية من الحركة</h2>
    ${offenseHtml}

    <h2>قاموس المصطلحات الرياضية</h2>
    <div class="terms-grid">${termsHtml}</div>

    <div class="footer">
      <span>المملكة العربية السعودية · إعداد المعلمة: عزيزة العنزي — أبطال التايكوندو</span>
      <button onclick="window.print()">طباعة الملخص</button>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'أبطال_التايكوندو_ملخص_الإنجاز.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
