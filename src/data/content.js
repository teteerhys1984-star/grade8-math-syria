// مصدر بيانات المحتوى: أضف الدروس إلى القسم المناسب دون تعديل نظام العرض أو التنقل.
// الحقول الاختيارية داخل الموضوع جاهزة للمحتوى الحقيقي: explanation, examples,
// notes, commonMistakes, exercises, interactions, assessment.

const emptyTopic = (id, label, type = 'content') => ({
  id,
  label,
  type,
  title: label,
  explanation: 'موضوع تجريبي للتحقق من بنية المحتوى. سيُستبدل بالمحتوى المعتمد لاحقًا.',
  examples: [],
  notes: [],
  commonMistakes: [],
  exercises: [],
  interactions: [],
  assessment: null
});

const demoQuiz = {
  questions: [],
  settings: { showFeedback: true, allowRetry: true, showFinalScore: true }
};

export const algebraLessons = [
  {
    number: 1,
    title: 'درس تجريبي للجبر',
    description: 'بيانات تجريبية فقط لاختبار بنية درس الجبر وتبويباته.',
    topics: [
      emptyTopic('intro', 'مقدمة', 'intro'),
      emptyTopic('concept', 'شرح المفهوم', 'concept'),
      emptyTopic('practice', 'تدريب', 'practice'),
      { ...emptyTopic('quiz', 'اختبار', 'quiz'), assessment: demoQuiz }
    ]
  }
];

export const geometryLessons = [
  {
    number: 1,
    title: 'درس تجريبي للهندسة',
    description: 'بيانات تجريبية فقط لاختبار بنية درس الهندسة وتبويباته.',
    topics: [
      emptyTopic('intro', 'مقدمة', 'intro'),
      emptyTopic('rule', 'القاعدة', 'concept'),
      emptyTopic('activity', 'نشاط', 'activity'),
      emptyTopic('practice', 'تدريب', 'practice'),
      { ...emptyTopic('quiz', 'اختبار', 'quiz'), assessment: demoQuiz }
    ]
  }
];

export const catalog = {
  algebra: {
    name: 'الجبر',
    icon: '＋',
    description: 'أساسيات التعبير الجبري والمعادلات',
    lessons: algebraLessons
  },
  geometry: {
    name: 'الهندسة',
    icon: '△',
    description: 'الأشكال والعلاقات الهندسية',
    lessons: geometryLessons
  }
};

// أنواع الأسئلة التي يمكن إضافتها إلى topic.interactions أو assessment.questions.
// answer وoptions وsteps وpairs اختيارية بحسب نوع السؤال.
export const questionTypes = [
  'multiple-choice',
  'numeric',
  'text',
  'true-false',
  'ordered-steps',
  'matching',
  'math-interactive'
];
