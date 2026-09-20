/**
 * استخراج حرفي من الصور المرفقة للصفحات 5، 6، 7.
 * المصدر الوحيد: image-1.png، image-2.png، image-3.png.
 * لا يحتوي هذا الملف على حلول أو أسئلة مضافة من خارج الصور.
 */

const fraction = (numerator, denominator) => ({ type: 'fraction', numerator, denominator });
const math = (...parts) => ({ type: 'math', direction: 'ltr', parts });
const text = value => ({ type: 'text', value });

export const lesson01 = {
  subject: 'الرياضيات',
  grade: 'الثامن',
  section: 'الجبر',
  unit: null,
  lessonNumber: null,
  title: 'الجمع والطرح',
  sourcePages: [5, 6, 7],
  sourceFiles: ['image-1.png', 'image-2.png', 'image-3.png'],
  sourceNote: 'الأرقام الظاهرة أسفل الصور هي 5 و6 و7. رقم الوحدة ورقم الدرس غير ظاهرين بوضوح في الصور المرفقة.',
  topics: [
    {
      topicOrder: 1,
      title: 'نشاط: تذكير القواعد التي عُرضت في الصف السابع لتشمل الكسور',
      sourcePages: [5],
      content: {
        heading: 'المقامات متساوية',
        instructions: [
          'قام كل من الطالبين باسم وهاشم بجمع الكسرين −9/7 و5/7.',
          'اشرح الطريقة التي اتبعتها لحساب المجموع.',
          'واحد من مضاعفات قيمة المقامات.'
        ],
        notes: [
          'عندما نكتب الكسرين 1/2 و5/8 بمقام مشترك 8، نقول إننا وحّدنا مقامي الكسرين، ويتم ذلك بضرب كل من بسط ومقام الكسر الأول بالعدد 4.',
          'مضاعفات العدد 2 هي: 2، 4، 6، 8، 10، 12، 14، 16، 18، ...',
          'مضاعفات العدد 3 هي: 3، 6، 9، 12، 15، 18، 21، ...'
        ],
        examples: [
          {
            id: 'page5-example-1',
            label: 'حل باسم / حل هاشم',
            page: 5,
            prompt: 'جمع الكسرين −9/7 و5/7.',
            work: [
              math(fraction('−9', '7'), text(' + '), fraction('5', '7'), text(' = '), fraction('−9 + 5', '7'), text(' = '), fraction('−4', '7'))
            ],
            note: 'يعرض المصدر طريقتين للحساب باسم وهاشم؛ النص المصوّر يوضح أن الناتج −4/7.'
          },
          {
            id: 'page5-example-2',
            label: 'أكمل',
            page: 5,
            prompt: '−1/2 + 5/8 = …/8 + 5/8 = …/8 = …',
            blanks: [
              { numerator: '…', denominator: '8' },
              { numerator: '…', denominator: '8' },
              { numerator: '…', denominator: '…' }
            ]
          }
        ],
        exercises: [
          { id: 'page5-question-1', number: '1', page: 5, text: 'قام كل من الطالبين باسم وهاشم بجمع الكسرين −9/7 و5/7. اشرح الطريقة التي اتبعتها لحساب المجموع.' },
          { id: 'page5-question-2', number: '2', page: 5, text: 'واحد من مضاعفات قيمة المقامات. انسخ ثم أكمل: −1/2 + 5/8 = …/8 + 5/8 = …/8 = …' },
          { id: 'page5-question-3', number: '3', page: 5, text: 'وخُذ مقامي الكسرين −1/2 و5/3، ثم احسب −1/2 + 5/3 بصيغة كسر.' }
        ]
      }
    },
    {
      topicOrder: 2,
      title: 'تعلّم — خاصة 1',
      sourcePages: [5],
      content: {
        explanation: 'لجمع (أو طرح) كسور عادية ذات مقامات متساوية، نجمع (أو نطرح) بسطَي هذه الكسور ونحتفظ بالمقام المشترك.',
        rules: [
          math(fraction('a', 'b'), text(' + '), fraction('c', 'b'), text(' = '), fraction('a + c', 'b')),
          math(fraction('a', 'b'), text(' − '), fraction('c', 'b'), text(' = '), fraction('a − c', 'b'))
        ],
        examples: []
      }
    },
    {
      topicOrder: 3,
      title: 'أمثلة على الجمع والطرح',
      sourcePages: [6],
      content: {
        examples: [
          {
            id: 'page6-example-1', label: 'مثال', page: 6,
            expression: math(fraction('−7', '3'), text(' + '), fraction('0.5', '3'), text(' = '), fraction('−7 + 0.5', '3'), text(' = '), fraction('−6.5', '3'))
          },
          {
            id: 'page6-example-2', label: 'مثال', page: 6,
            expression: math(fraction('1', '5'), text(' − '), fraction('3', '5'), text(' = '), fraction('1 − 3', '5'), text(' = '), fraction('−2', '5'), text(' = '), fraction('−2', '5'))
          }
        ],
        heading: 'خاصة 2',
        explanation: 'لجمع (أو طرح) كسور عادية ذات مقامات مختلفة، نوحّد مقاماتها، ثم نجري العمليات وفق الخاصة 1.',
        examplesContinued: [
          {
            id: 'page6-example-3', label: 'مثال', page: 6,
            expression: math(fraction('5', '6'), text(' + '), fraction('3', '4'), text(' = '), fraction('10', '12'), text(' + '), fraction('9', '12'), text(' = '), fraction('10 + 9', '12'), text(' = '), fraction('19', '12')),
            note: 'العدد 12 هو مضاعف مشترك للعددين 6 و4، لذلك استبدلنا، بكل كسر، كسراً يساويه مقامه يساوي 12.'
          },
          {
            id: 'page6-example-4', label: 'مثال', page: 6,
            expression: math(text('−2.5 − '), fraction('1', '3'), text(' = '), fraction('−5', '2'), text(' − '), fraction('1', '3'), text(' = '), fraction('−15', '6'), text(' − '), fraction('2', '6'), text(' = '), fraction('−17', '6'), text(' = '), fraction('−17', '6')),
            note: 'العدد 6 هو مضاعف مشترك للعددين 2 و3، لذلك استبدلنا، بكل كسر، كسراً يساويه مقامه يساوي 6.'
          },
          {
            id: 'page6-example-5', label: 'مثال', page: 6,
            prompt: 'لإنجاز العملية',
            expression: math(fraction('1', '2'), text(' + '), fraction('3', '4')),
            work: [math(fraction('1', '2'), text(' + '), fraction('3', '4'), text(' = '), fraction('2', '4'), text(' + '), fraction('3', '4'), text(' = '), fraction('5', '4'))],
            note: 'نلاحظ أن 4 هو مقام مشترك للكسرين.'
          }
        ]
      }
    },
    {
      topicOrder: 4,
      title: 'اكتساب معارف',
      sourcePages: [6, 7],
      content: {
        question: 'كيف ننجز سلسلة من عمليات الجمع والطرح؟',
        explanation: 'لإنجاز سلسلة من عمليات الجمع والطرح على كسور عادية، يفضل أن نبدأ بإجراء العمليات على الكسور ذات المقامات المتساوية.',
        examples: [
          {
            id: 'page6-example-6', label: 'مثال', page: 6,
            prompt: 'أنجز حساب A بصيغة كسر عادي.',
            expression: math(text('A = '), fraction('5', '3'), text(' − '), fraction('7', '6'), text(' + '), fraction('3', '8')),
            work: [
              'مضاعف 6 العدد 3، فلنوحّد مقامات الكسور الثلاثة، يكفي إيجاد مضاعف للعددين 6 و8.',
              'مضاعفات العدد 6 هي: 6، 12، 18، 24، 30، ...',
              'مضاعفات العدد 8 هي: 8، 16، 24، ...',
              '24 هو أصغر مضاعف مشترك للعددين 6 و8.',
              math(text('A = '), fraction('40', '24'), text(' − '), fraction('28', '24'), text(' + '), fraction('9', '24'), text(' = '), fraction('40 − 28 + 9', '24'), text(' = '), fraction('21', '24'), text(' = '), fraction('3 × 7', '3 × 8'), text(' = '), fraction('7', '8'))
            ]
          }
        ]
      }
    },
    {
      topicOrder: 5,
      title: 'تحقق من فهمك',
      sourcePages: [7],
      content: {
        exercises: [
          { id: 'page7-check-1', number: '1', page: 7, text: 'انسخ وأكمل: 5/9 + 1/3 = 5/9 + …/9 = …/9 = …' },
          {
            id: 'page7-check-2', number: '2', page: 7,
            text: 'احسب الناتج في كل حالة من الحالات الآتية بصيغة كسر عادي.',
            items: [
              '① −7/5 + (−3/5)',
              '② 4/7 − 9.1/7',
              '③ −4/3 + 5/3',
              '④ 13/(−6) + (−5)/6',
              '⑤ 4/1.2 − 5.3/1.2 − 0.7/1.2',
              '⑥ −6/7 + 21.3/35'
            ],
            unclear: ['الكتابة الصغيرة في البند ⑤ تحتاج مراجعة من الصورة الأصلية للتأكد من الإشارة الأولى في التعبير.']
          },
          { id: 'page7-check-3', number: '3', page: 7, text: 'اكتب بضعة مضاعفات العدد 6، ثم بضعة مضاعفات العدد 8.' }
        ]
      }
    },
    {
      topicOrder: 6,
      title: 'تدرب',
      sourcePages: [7],
      content: {
        exercises: [
          {
            id: 'page7-practice-1', number: '1', page: 7, text: 'انسخ وأكمل.',
            items: [
              '① 5/8 − 1/6 = …/24 − …/24 = …/…',
              '② 5/3 − 7/4 = …/12 − …/12 = …/12'
            ]
          },
          {
            id: 'page7-practice-2', number: '2', page: 7, text: 'احسب بصيغة كسر عادي.',
            items: ['① 7/4 + 2/9', '② −5/8 + 1/12', '③ 7/9 − 5.1/6']
          },
          {
            id: 'page7-practice-3', number: '3', page: 7, text: 'احسب بصيغة كسر، ثم اختصر ما حصلت عليه، إن أمكن. (لاحظ أن عددًا x يكتب x/1).',
            items: [
              '① 5/3 + (−13/3)',
              '② −4/7 + 12/7',
              '③ −4/5 − (−3/5)',
              '④ −13/9 + 27/9',
              '⑤ 22/15 − 8/15 + 7/15',
              '⑥ −1/4 − 5/4 + 3/4',
              '⑦ −6 + 3/5'
            ]
          },
          {
            id: 'page7-practice-4', number: '4', page: 7,
            text: 'خلطت زينة 3/5 اللتر من عصير التفاح مع 6/5 اللتر من عصير العنب لملء وعاء سعته لتران. كم لترًا من عصير الموز تحتاج زينة إضافته؟'
          }
        ]
      }
    }
  ],
  figures: [],
  tables: [],
  extractionIssues: [
    { page: 5, location: 'سطر النشاط الأول — الحل باسم وهاشم', note: '[غير واضح في المصدر] يمكن قراءة الناتج −4/7، لكن بعض خطوات الحل الوسيطة صغيرة ولا يمكن اعتماد نسخ حرفي موثوق لها من الصورة المتاحة.' },
    { page: 7, location: 'تحقق من فهمك، السؤال 2، البند ⑤', note: '[غير واضح في المصدر] لا يمكن اعتماد ترتيب الإشارات في التعبير اعتمادًا حرفيًا من الصورة المتاحة.' },
    { page: 7, location: 'تدرب، السؤال 4', note: '[غير واضح في المصدر] لا يمكن اعتماد اسم العصير الأخير اعتمادًا حرفيًا من الصورة المتاحة.' }
  ],
  assessment: null
};

export default lesson01;
