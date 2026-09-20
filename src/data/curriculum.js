/**
 * Curriculum Map — المصدر الرسمي المطلوب استخراجه من كتاب الرياضيات للصف الثامن.
 *
 * هذه الخريطة متروكة فارغة عمدًا لأن نسخة الكتاب لم تكن موجودة في المستودع عند
 * تنفيذ مرحلة الاستخراج. يمنع هذا الملف إدخال أسماء أو أرقام صفحات تخمينية.
 * بعد توفير المصدر، تُملأ sections.algebra وsections.geometry بالترتيب الحرفي
 * للكتاب، مع إبقاء sourcePages وtextbookSection لكل عنصر.
 */
export const curriculumSource = {
  status: 'source-not-available',
  sourceFile: null,
  note: 'لم يُعثر على ملف كتاب أو مرفق قابل للقراءة داخل المستودع أو مساحة العمل.',
  reviewedCompletely: false
};

/**
 * المخطط المعتمد لكل وحدة ودرس وموضوع عند توفر المصدر.
 * لا تُضاف عناصر إلى هذه القوائم إلا بعد مراجعة صفحات الكتاب نفسها.
 */
export const curriculum = {
  algebra: {
    section: 'الجبر',
    units: []
  },
  geometry: {
    section: 'الهندسة',
    units: []
  }
};

// Shape reference (ليس محتوى منهاجيًا):
// {
//   unitNumber: 1,
//   unitTitle: 'من المصدر حرفيًا',
//   sourcePages: { from: 0, to: 0 },
//   lessons: [{
//     lessonNumber: 1,
//     lessonTitle: 'من المصدر حرفيًا',
//     order: 1,
//     sourcePages: { from: 0, to: 0 },
//     textbookSection: 'اسم القسم كما هو في الكتاب',
//     topics: [{
//       topicOrder: 1,
//       title: 'العنوان كما هو في الكتاب',
//       sourcePages: { from: 0, to: 0 },
//       examples: [], activities: [], exercises: [], questions: [],
//       figures: [], tables: []
//     }]
//   }]
// }
