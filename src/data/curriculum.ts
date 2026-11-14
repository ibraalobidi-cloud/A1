export interface StanceComparisonRow {
  criterion: string;
  apSeogi: string;
  apKubi: string;
}

export interface StanceDetail {
  id: 'ap_seogi' | 'ap_kubi';
  arabicName: string;
  koreanHangul: string;
  koreanPronunciation: string;
  subtitle: string;
  stepLengthCm: number;
  frontKneeFlexDeg: number;
  frontWeightPct: number;
  backWeightPct: number;
  summary: string;
  keyPoints: string[];
  commonMistake: string;
  correction: string;
  voiceScript: string;
}

export interface OffensiveSkill {
  id: 'high_punch' | 'middle_punch' | 'front_kick';
  arabicName: string;
  koreanHangul: string;
  koreanPronunciation: string;
  targetZone: string;
  strikingSurface: string;
  summary: string;
  steps: {
    title: string;
    detail: string;
  }[];
  coachingTip: string;
  voiceScript: string;
}

export interface TerminologyCard {
  id: string;
  arabic: string;
  koreanHangul: string;
  koreanRomanized: string;
  phoneticArabic: string;
  category: 'stances' | 'offense' | 'performance';
  categoryLabel: string;
  explanation: string;
}

export interface SelfAssessmentCriterion {
  id: string;
  levelLabel: string;
  title: string;
  description: string;
}

export interface QuizQuestion {
  id: number;
  levelTag: string;
  question: string;
  options: string[];
  correctIndex: number;
  feedbackCorrect: string;
  feedbackWrong: string;
}

export interface SequenceMove {
  id: string;
  stanceId: 'ap_seogi' | 'ap_kubi';
  stanceLabel: string;
  skillId: 'high_punch' | 'middle_punch' | 'front_kick';
  skillLabel: string;
  koreanCall: string;
  breathingCue: string;
  balanceFocus: string;
}

export const STANCES: Record<'ap_seogi' | 'ap_kubi', StanceDetail> = {
  ap_seogi: {
    id: 'ap_seogi',
    arabicName: 'وقفة المشي',
    koreanHangul: '앞 서기',
    koreanPronunciation: 'أب سوجي',
    subtitle: 'المستوى الأول · وقفة انتقال وتوازن طبيعي',
    stepLengthCm: 40,
    frontKneeFlexDeg: 10,
    frontWeightPct: 50,
    backWeightPct: 50,
    summary:
      'وقفة طبيعية تشبه خطوة المشي العادية؛ تمنح اللاعب سرعة في التقدم والتراجع مع ثبات متوازن على كلا القدمين.',
    keyPoints: [
      'المسافة بين القدمين تساوي خطوة مشي طبيعية (عرض القدم ونصف تقريباً).',
      'الركبة الأمامية مثنية ثنياً طفيفاً جداً والرجل الخلفية مستقيمة ومريحة.',
      'يتوزع وزن الجسم بالتساوي بنسبة 50% على القدم الأمامية و50% على الخلفية.',
      'تتجه أصابع القدم الأمامية للأمام مباشرة، والقدم الخلفية تميل قليلاً للخارج بزاوية 15 إلى 30 درجة.'
    ],
    commonMistake: 'المبالغة في تضييق المسافة الجانبية بحيث تقف القدمان على خط مستقيم واحد، مما يضعف التوازن الجانبي.',
    correction: 'احرص على وجود مسافة عرضية بمقدار عرض الحوض أو قبضة يد واحدة بين مساري القدمين.',
    voiceScript:
      'مرحباً يا بطل! اليوم سنتعرف معاً على وقفة المشي، وتُسمى بالكورية: أب سوجي. تكون المسافة بين القدمين بمقدار خطوة مشي طبيعية ومريحة... ويتوزع وزن جسمك بالتساوي، خمسين بالمئة على القدم الأمامية، وخمسين بالمئة على القدم الخلفية، مع بقاء الظهر منتصباً والنظر للأمام بثبات.'
  },
  ap_kubi: {
    id: 'ap_kubi',
    arabicName: 'وقفة الطعن الأمامية',
    koreanHangul: '앞 굽이',
    koreanPronunciation: 'أب كوبي',
    subtitle: 'المستوى الأول · وقفة قوة ودفع هجومي عميق',
    stepLengthCm: 85,
    frontKneeFlexDeg: 45,
    frontWeightPct: 60,
    backWeightPct: 40,
    summary:
      'وقفة هجومية عميقة ومنخفضة توفر قاعدة ارتكاز عريضة وثابتة لدفع اللكمات القوية والصدات الحاسمة للأمام.',
    keyPoints: [
      'المسافة الطولية بين القدمين تعادل خطوتين طبيعيتين أو نحو ضعف عرض الكتفين.',
      'تُثنى الركبة الأمامية بوضوح حتى تغطي عمودياً مشط أصابع القدم الأمامية.',
      'تمتد الرجل الخلفية بالكامل باستقامة وقوة مع تثبيت الكعب على البساط.',
      'يتحمل الجانب الأمامي 60% من وزن الجسم مقابل 40% للرجل الخلفية، مع بقاء الظهر مستقيماً.'
    ],
    commonMistake: 'رفع كعب القدم الخلفية عن الأرض أو انحناء الجذع للأمام عند ثني الركبة الأمامية.',
    correction: 'ثبّت كعب القدم الخلفية بالكامل على البساط وشد عضلات الفخذ الخلفي مع إبقاء الصدر والرأس عموديين.',
    voiceScript:
      'أحسنت! والآن لننتقل إلى وقفة الطعن الأمامية، وتُسمى بالكورية: أب كوبي! هنا نخطو مسافة خطوتين للأمام، مع ثني الركبة الأمامية بوضوح لتغطي مشط القدم... وفرد الرجل الخلفية بقوة وثبات. يرتكز ستون بالمئة من وزن الجسم على القدم الأمامية، وأربعون بالمئة على القدم الخلفية!'
  }
};

export const STANCE_COMPARISON_ROWS: StanceComparisonRow[] = [
  {
    criterion: 'طول الخطوة',
    apSeogi: 'خطوة مشي طبيعية (35 – 45 سم)',
    apKubi: 'خطوتان عميقتان (75 – 95 سم)'
  },
  {
    criterion: 'توزيع وزن الجسم',
    apSeogi: 'متوازن بالتساوي: 50% أمام / 50% خلف',
    apKubi: 'ارتكاز أمامي: 60% أمام / 40% خلف'
  },
  {
    criterion: 'زاوية الركبة الأمامية',
    apSeogi: 'ثني خفيف جداً ومريح (~10°)',
    apKubi: 'ثني عميق يغطي مشط القدم (~45°)'
  },
  {
    criterion: 'وضع الرجل الخلفية',
    apSeogi: 'مستقيمة باسترخاء مع تلامس كامل للقدم',
    apKubi: 'ممدودة ومشدودة بالكامل والكعب ثابت'
  },
  {
    criterion: 'ارتفاع مركز الثقل',
    apSeogi: 'مرتفع نسبياً لمرونة الحركة السريعة',
    apKubi: 'منخفض لتعزيز الثبات والدفع القوي'
  },
  {
    criterion: 'الاستخدام الحركي',
    apSeogi: 'التنقل التمهيدي والربط السريع في البومسي',
    apKubi: 'الاندفاع الهجومي واللكمات والصدات القوية'
  }
];

export const OFFENSIVE_SKILLS: OffensiveSkill[] = [
  {
    id: 'high_punch',
    arabicName: 'اللكمة العالية',
    koreanHangul: '얼굴 지르기',
    koreanPronunciation: 'أولغول جيروغي',
    targetZone: 'مستوى الرأس والذقن (الأعلى)',
    strikingSurface: 'مقدمة عقدتي السبابة والوسطى',
    summary:
      'لكمة مستقيمة وسريعة تنطلق من جانب الخصر لتصيب الهدف في مستوى الوجه أو الذقن في خط مستقيم من الكتف.',
    steps: [
      {
        title: '1. التحضير من الخصر',
        detail: 'تستقر القبضة عند عظم الحوض بحيث يتجه باطن اليد للأعلى، بينما تشير اليد المقابلة نحو الهدف.'
      },
      {
        title: '2. الانطلاق المساري',
        detail: 'تندفع القبضة للأمام وللأعلى تدريجياً مع بقاء المرفق قريباً من الجسم حتى منتصف المسافة.'
      },
      {
        title: '3. التدوير عند الإصابة',
        detail: 'يدور الساعد في اللحظة الأخيرة قبل الوصول بحيث يصبح ظهر القبضة للأعلى وتقابل الهدف.'
      },
      {
        title: '4. القوة المضادة',
        detail: 'تسحب اليد الأخرى بقوة إلى الخصر في التوقيت ذاته لتضاعف سرعة اللكمة وتمنع دوران الكتفين.'
      }
    ],
    coachingTip: 'احرص أن يكون ارتفاع القبضة في نهاية اللكمة موازياً لمستوى فمك أو أنفك دون رفع الكتف للأذن.',
    voiceScript:
      'اللكمة العالية، أولغول جيروغي. تنطلق القبضة من الخصر في خط مستقيم نحو مستوى الوجه والذقن، مع تدوير الساعد في اللحظة الأخيرة وسحب اليد الأخرى للخصر لتحقيق أقصى سرعة وثبات.'
  },
  {
    id: 'middle_punch',
    arabicName: 'اللكمة المتوسطة',
    koreanHangul: '몸통 지르기',
    koreanPronunciation: 'مومتونغ جيروغي',
    targetZone: 'منتصف الجذع والضفيرة الشمسية',
    strikingSurface: 'مقدمة عقدتي السبابة والوسطى',
    summary:
      'اللكمة الأساسية الأكثر شيوعاً في التايكوندو، تستهدف منتصف الجذع أمام المحور الوسطي للجسم مباشرة.',
    steps: [
      {
        title: '1. الاستعداد والثبات',
        detail: 'يبدأ الكتفان في استقامة واحدة موازية للأمام مع شد خفيف في عضلات الجذع الأساسية.'
      },
      {
        title: '2. خط الدفع الأفقي',
        detail: 'تتحرك القبضة أفقياً نحو منتصف الصدر (المستوى المتوسط) مع انزلاق المرفق بمحاذاة الضلوع.'
      },
      {
        title: '3. السحب المتزامن',
        detail: 'تُشد اليد المقابلة للخلف عند الخصر في اللحظة نفسها التي تنطلق فيها القبضة الضاربة.'
      },
      {
        title: '4. الإغلاق والتوقف الحاسم',
        detail: 'تستقر الذراع ممدودة بالكامل أمام محور الجسم مع معصم مستقيم وتنفس زفيري حاسم.'
      }
    ],
    coachingTip: 'تجنب مد الكتف للأمام خلف القبضة؛ اترك الكتف في موضعه الطبيعي لحماية المفصل والحفاظ على توازن الوقفة.',
    voiceScript:
      'اللكمة المتوسطة، مومتونغ جيروغي. توجه نحو منتصف الجذع أمام الضفيرة الشمسية مباشرة، مع استقامة المعصم وسحب اليد المعاكسة إلى الخصر بالتزامن التام.'
  },
  {
    id: 'front_kick',
    arabicName: 'الركلة الأمامية',
    koreanHangul: '앞 차기',
    koreanPronunciation: 'أب تشاغي',
    targetZone: 'المستوى المتوسط أو العالي للأمام',
    strikingSurface: 'مقدمة بطن القدم (أب تشوك)',
    summary:
      'ركلة سريعة وخاطفة تعتمد على رفع الركبة عالياً ثم بسط الساق للأمام كالسوط وضرب الهدف ببطن القدم مع ثني الأصابع للخلف.',
    steps: [
      {
        title: '1. التحضير ورفع الركبة',
        detail: 'تُرفع ركبة الرجل الراكلة عالياً أمام الصدر مع سحب الكعب نحو المقعد والحفاظ على ثبات رجل الارتكاز.'
      },
      {
        title: '2. البسط والإصابة',
        detail: 'تُمد الساق للأمام بسرعة خاطفة ليلامس بطن القدم الهدف مع شد أصابع القدم للخلف لحمايتها.'
      },
      {
        title: '3. السحب السريع (الارتداد)',
        detail: 'تُثنى الركبة مرة أخرى فوراً بعد الإصابة لمنع إمساك الساق والحفاظ على الجاهزية.'
      },
      {
        title: '4. الهبوط المتوازن',
        detail: 'تهبط القدم للأمام داخل وقفة متزنة (وقفة مشي أو طعن أمامية) دون سقوط الجذع للأمام.'
      }
    ],
    coachingTip: 'سر ارتفاع الركلة ودقتها يكمن في المرحلة الأولى: كلما ارتفعت الركبة أعلى قبل البسط، زادت سرعة الركلة وتوازنك.',
    voiceScript:
      'الركلة الأمامية، أب تشاغي. تمر بأربع مراحل: رفع الركبة عالياً أمام الصدر، ثم بسط الساق وضرب الهدف ببطن القدم، ثم سحب الساق سريعاً، وأخيراً الهبوط بثبات وتوازن.'
  }
];

export const TERMINOLOGY_CARDS: TerminologyCard[] = [
  {
    id: 'term_ap_seogi',
    arabic: 'وقفة المشي',
    koreanHangul: '앞 서기',
    koreanRomanized: 'Ap Seogi',
    phoneticArabic: 'أب سوجي',
    category: 'stances',
    categoryLabel: 'الوقفات الأساسية',
    explanation: 'وقفة طبيعية بطول خطوة مشي واحدة وتوزيع وزن متساوٍ 50% / 50%.'
  },
  {
    id: 'term_ap_kubi',
    arabic: 'وقفة الطعن الأمامية',
    koreanHangul: '앞 굽이',
    koreanRomanized: 'Ap Kubi',
    phoneticArabic: 'أب كوبي',
    category: 'stances',
    categoryLabel: 'الوقفات الأساسية',
    explanation: 'وقفة عميقة بمسافة خطوتين، ركبة أمامية مثنية ورجل خلفية ممدودة، ووزن 60% أمام.'
  },
  {
    id: 'term_olgul_jireugi',
    arabic: 'اللكمة العالية',
    koreanHangul: '얼굴 지르기',
    koreanRomanized: 'Olgul Jireugi',
    phoneticArabic: 'أولغول جيروغي',
    category: 'offense',
    categoryLabel: 'المهارات الهجومية',
    explanation: 'لكمة مستقيمة موجهة نحو مستوى الرأس والوجه.'
  },
  {
    id: 'term_momtong_jireugi',
    arabic: 'اللكمة المتوسطة',
    koreanHangul: '몸통 지르기',
    koreanRomanized: 'Momtong Jireugi',
    phoneticArabic: 'مومتونغ جيروغي',
    category: 'offense',
    categoryLabel: 'المهارات الهجومية',
    explanation: 'لكمة أفقية قوية موجهة نحو منتصف الجذع والضفيرة الشمسية.'
  },
  {
    id: 'term_ap_chagi',
    arabic: 'الركلة الأمامية',
    koreanHangul: '앞 차기',
    koreanRomanized: 'Ap Chagi',
    phoneticArabic: 'أب تشاغي',
    category: 'offense',
    categoryLabel: 'المهارات الهجومية',
    explanation: 'ركلة أمامية سريعة تضرب الهدف بمقدمة بطن القدم مع سحب الركبة سريعاً.'
  },
  {
    id: 'term_poomsae',
    arabic: 'الجملة الحركية',
    koreanHangul: '품새',
    koreanRomanized: 'Poomsae',
    phoneticArabic: 'بومسي',
    category: 'performance',
    categoryLabel: 'تطبيقات الأداء',
    explanation: 'تسلسل منسق يربط الوقفات الأساسية بالمهارات الهجومية والدفاعية بتوازن وإيقاع.'
  },
  {
    id: 'term_dobok',
    arabic: 'بدلة التايكوندو',
    koreanHangul: '도복',
    koreanRomanized: 'Dobok',
    phoneticArabic: 'دوبوك',
    category: 'performance',
    categoryLabel: 'ثقافة الصالة',
    explanation: 'الزي الرياضي الأبيض الرسمي في رياضة التايكوندو.'
  },
  {
    id: 'term_dojang',
    arabic: 'صالة التدريب',
    koreanHangul: '도장',
    koreanRomanized: 'Dojang',
    phoneticArabic: 'دوجانغ',
    category: 'performance',
    categoryLabel: 'ثقافة الصالة',
    explanation: 'القاعة المخصصة لتدريب التايكوندو وتُحترم فيها قواعد الانضباط والتحية.'
  },
  {
    id: 'term_charyeot',
    arabic: 'انتباه / استعد',
    koreanHangul: '차렷',
    koreanRomanized: 'Charyeot',
    phoneticArabic: 'تشاريوت',
    category: 'performance',
    categoryLabel: 'أوامر الصالة',
    explanation: 'أمر الوقوف باعتدال وضم القدمين وإسدال الذراعين بجانب الجسم.'
  },
  {
    id: 'term_gyeongnye',
    arabic: 'تحية الاحترام',
    koreanHangul: '경례',
    koreanRomanized: 'Gyeongnye',
    phoneticArabic: 'كيونغ نيه',
    category: 'performance',
    categoryLabel: 'أوامر الصالة',
    explanation: 'انحناءة خفيفة بالرأس والجذع إظهاراً للاحترام للمدرب والزملاء.'
  },
  {
    id: 'term_junbi',
    arabic: 'تهيؤ للبدء',
    koreanHangul: '준비',
    koreanRomanized: 'Junbi',
    phoneticArabic: 'جونبي',
    category: 'stances',
    categoryLabel: 'أوامر الصالة',
    explanation: 'وضعية الاستعداد المتوازنة بفتح القدمين بمقدار عرض الكتفين قبل بدء الجملة الحركية.'
  },
  {
    id: 'term_kihap',
    arabic: 'صيحة التركيز والطاقة',
    koreanHangul: '기합',
    koreanRomanized: 'Kihap',
    phoneticArabic: 'كيهاب',
    category: 'offense',
    categoryLabel: 'تطبيقات الأداء',
    explanation: 'زفير صوتي قوي في نهاية المهارة الحاسمة لتوحيد التنفس والقوة العضلية.'
  }
];

export const DEFAULT_SEQUENCE_MOVES: SequenceMove[] = [
  {
    id: 'step_1',
    stanceId: 'ap_seogi',
    stanceLabel: 'وقفة المشي (أب سوجي)',
    skillId: 'middle_punch',
    skillLabel: 'اللكمة المتوسطة',
    koreanCall: 'أب سوجي · مومتونغ جيروغي',
    breathingCue: 'زفير قصير ومنضبط مع اكتمال اللكمة.',
    balanceFocus: 'توزيع وزن متساوٍ 50% / 50% وثبات الكتفين.'
  },
  {
    id: 'step_2',
    stanceId: 'ap_kubi',
    stanceLabel: 'وقفة الطعن الأمامية (أب كوبي)',
    skillId: 'middle_punch',
    skillLabel: 'اللكمة المتوسطة القوية',
    koreanCall: 'أب كوبي · مومتونغ جيروغي',
    breathingCue: 'ربط الزفير بالاندفاع للأمام وثني الركبة.',
    balanceFocus: 'تثبيت كعب القدم الخلفية وارتكاز 60% للأمام.'
  },
  {
    id: 'step_3',
    stanceId: 'ap_seogi',
    stanceLabel: 'ارتكاز وانتقال أمامي',
    skillId: 'front_kick',
    skillLabel: 'الركلة الأمامية (أب تشاغي)',
    koreanCall: 'أب تشاغي',
    breathingCue: 'شهيق عند رفع الركبة، وزفير حاد لحظة الضرب ببطن القدم.',
    balanceFocus: 'ثبات رجل الارتكاز دون تمايل الجذع للخلف.'
  },
  {
    id: 'step_4',
    stanceId: 'ap_kubi',
    stanceLabel: 'الهبوط في وقفة الطعن الأمامية',
    skillId: 'high_punch',
    skillLabel: 'اللكمة العالية (أولغول جيروغي) + كيهاب',
    koreanCall: 'أب كوبي · أولغول جيروغي · كيهاب',
    breathingCue: 'إطلاق صيحة التركيز (كيهاب) في الختام.',
    balanceFocus: 'امتصاص الهبوط بثني الركبة الأمامية واستقامة الظهر.'
  }
];

export const SELF_ASSESSMENT_CRITERIA: SelfAssessmentCriterion[] = [
  {
    id: 'crit_walking_stance',
    levelLabel: 'المستوى 1',
    title: 'إتقان وقفة المشي (أب سوجي)',
    description: 'أحافظ على مسافة خطوة طبيعية وتوزيع وزن متساوٍ (50% / 50%) دون تقاطع القدمين.'
  },
  {
    id: 'crit_front_stance',
    levelLabel: 'المستوى 1',
    title: 'ثبات وقفة الطعن الأمامية (أب كوبي)',
    description: 'أثني الركبة الأمامية لتغطي مشط القدم وأمد الرجل الخلفية بالكامل مع تثبيت الكعب.'
  },
  {
    id: 'crit_punches',
    levelLabel: 'المستوى 2',
    title: 'دقة اللكمة العالية والمتوسطة',
    description: 'أنطلق بالقبضة من الخصر وأدير الساعد في اللحظة الأخيرة مع سحب اليد المقابلة.'
  },
  {
    id: 'crit_front_kick',
    levelLabel: 'المستوى 2',
    title: 'تسلسل مراحل الركلة الأمامية (أب تشاغي)',
    description: 'أرفع الركبة عالياً ثم أبسط الساق لأضرب ببطن القدم وأسحبها قبل الهبوط المتزن.'
  },
  {
    id: 'crit_sequence',
    levelLabel: 'المستوى 3',
    title: 'الربط والتوازن في الجملة الحركية',
    description: 'أنتقل بسلاسة بين الوقفات والمهارات الهجومية مع توجيه النظر وضبط التنفس.'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    levelTag: 'المستوى الأول · الوقفات',
    question: 'ما هي نسبة توزيع وزن الجسم الصحيحة في وقفة المشي (أب سوجي)؟',
    options: [
      '80% على القدم الأمامية و20% على الخلفية',
      '50% على القدم الأمامية و50% على الخلفية',
      '30% على القدم الأمامية و70% على الخلفية',
      '100% على القدم الأمامية مع رفع الكعب الخلفي'
    ],
    correctIndex: 1,
    feedbackCorrect: 'إجابة صحيحة! في وقفة المشي يتوزع الوزن بالتساوي (50% / 50%) مثل خطوة المشي الطبيعية.',
    feedbackWrong: 'توزيع الوزن في وقفة المشي متساوٍ تماماً: 50% على القدم الأمامية و50% على القدم الخلفية.'
  },
  {
    id: 2,
    levelTag: 'المستوى الأول · الوقفات',
    question: 'كيف يكون وضع الرجل الخلفية في وقفة الطعن الأمامية (أب كوبي)؟',
    options: [
      'مثنية بشدة مع ملامسة الركبة للأرض',
      'ممدودة بالكامل ومشدودة مع تثبيت الكعب على البساط',
      'مرتفعة الكعب عن الأرض لتسهيل القفز',
      'موضوعة خلف القدم الأمامية على خط واحد'
    ],
    correctIndex: 1,
    feedbackCorrect: 'ممتاز! امتداد الرجل الخلفية وتثبيت كعبها يمنحان وقفة الطعن قوتها وثباتها.',
    feedbackWrong: 'في وقفة الطعن الأمامية تكون الركبة الأمامية مثنية بينما تمتد الرجل الخلفية بالكامل ويثبت كعبها على الأرض.'
  },
  {
    id: 3,
    levelTag: 'المستوى الأول · الوقفات',
    question: 'أيّ المصطلحات الرياضية التالية يُطلق على وقفة الطعن الأمامية؟',
    options: ['أب سوجي', 'أب كوبي', 'أب تشاغي', 'مومتونغ'],
    correctIndex: 1,
    feedbackCorrect: 'أحسنت! أب كوبي تعني وقفة الطعن الأمامية العميقة.',
    feedbackWrong: 'المصطلح الصحيح لوقفة الطعن الأمامية هو أب كوبي، بينما أب سوجي هي وقفة المشي.'
  },
  {
    id: 4,
    levelTag: 'المستوى الثاني · الهجوم',
    question: 'إلى أي مستوى في الجسم تُوجَّه اللكمة المتوسطة (مومتونغ جيروغي)؟',
    options: [
      'أعلى الرأس والذقن',
      'أسفل الركبة',
      'منتصف الجذع والضفيرة الشمسية',
      'الجانب الخلفي من الكتف'
    ],
    correctIndex: 2,
    feedbackCorrect: 'صحيح! كلمة "مومتونغ" تعني الجذع، وتستهدف اللكمة منتصف الصدر أمام محور الجسم.',
    feedbackWrong: 'تستهدف اللكمة المتوسطة منتصف الجذع (الضفيرة الشمسية)، أما مستوى الرأس فمخصص للكمة العالية.'
  },
  {
    id: 5,
    levelTag: 'المستوى الثاني · الهجوم',
    question: 'ما فائدة سحب اليد الأخرى إلى الخصر أثناء أداء اللكمة في التايكوندو؟',
    options: [
      'توليد قوة مضادة وتوازن وزيادة سرعة اللكمة',
      'إخفاء القبضة عن الحكم فقط',
      'تخفيف التنفس أثناء الحركة',
      'إبطاء حركة الكتفين عمداً'
    ],
    correctIndex: 0,
    feedbackCorrect: 'رائع! سحب اليد المعاكسة للخصر يولّد عزماً دورانياً متوازناً يضاعف سرعة وقوة اللكمة.',
    feedbackWrong: 'سحب اليد الأخرى إلى الخصر يطبق مبدأ الفعل ورد الفعل لتوليد سرعة إضافية ومنع اختلال توازن الكتفين.'
  },
  {
    id: 6,
    levelTag: 'المستوى الثاني · الهجوم',
    question: 'أي جزء من القدم يُستخدم لضرب الهدف في الركلة الأمامية (أب تشاغي)؟',
    options: [
      'عظم الكعب الخلفي',
      'باطن القدم من المنتصف',
      'مقدمة بطن القدم (أب تشوك) مع شد الأصابع للخلف',
      'حافة القدم الخارجية فقط'
    ],
    correctIndex: 2,
    feedbackCorrect: 'إجابة دقيقة! تُؤدى الركلة الأمامية بمقدمة بطن القدم مع ثني الأصابع للخلف لحمايتها.',
    feedbackWrong: 'الضرب في الركلة الأمامية يكون بمقدمة بطن القدم (الموسدة تحت الأصابع) مع سحب الأصابع للخلف.'
  },
  {
    id: 7,
    levelTag: 'المستوى الثاني · الهجوم',
    question: 'ما المرحلة الأولى الصحيحة عند بدء تنفيذ الركلة الأمامية (أب تشاغي)؟',
    options: [
      'بسط الساق مباشرة من الأرض وهي ممدودة',
      'رفع الركبة عالياً أمام الصدر مع ثني الساق',
      'الانحناء للأمام قبل تحريك القدم',
      'القفز بالقدمين معاً في الهواء'
    ],
    correctIndex: 1,
    feedbackCorrect: 'ممتاز! رفع الركبة عالياً (التحضير) هو مفتاح دقة الركلة الأمامية وارتفاعها وتوازنها.',
    feedbackWrong: 'الركلة الأمامية تبدأ برفع الركبة عالياً أمام الصدر أولاً، ثم بسط الساق، ثم سحبها قبل الهبوط.'
  },
  {
    id: 8,
    levelTag: 'المستوى الثالث · الأداء',
    question: 'ما المقصود بالجملة الحركية (البومسي - Poomsae) في تطبيقات الأداء؟',
    options: [
      'تدريب الجري السريع حول الصالة فقط',
      'ربط الوقفات الأساسية والمهارات الهجومية والدفاعية في تسلسل متزن وإيقاعي',
      'تنفيذ لكمة واحدة دون تحريك القدمين',
      'ارتداء البدلة الرياضية قبل الحصة'
    ],
    correctIndex: 1,
    feedbackCorrect: 'إجابة رائعة! الجملة الحركية تجمع بين الوقفات والمهارات بتسلسل انسيابي وتوازن وتوقيت دقيق.',
    feedbackWrong: 'الجملة الحركية (البومسي) هي سلسلة مترابطة من الوقفات والمهارات الهجومية والدفاعية تُؤدى بتوازن وإيقاع منتظم.'
  }
];
