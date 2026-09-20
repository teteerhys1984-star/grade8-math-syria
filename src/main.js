import './style.css';
import { catalog as demoCatalog } from './data/content.js';
import lesson01 from './data/lessons/algebra/lesson-01.js';
import algebraEnrichment from './data/lessons/algebra/lesson-01-enrichment.js';

// Keep the existing catalog as a fallback for the other sections while the
// extracted Algebra lesson is rendered from its source-specific data file.
const catalog = {
  ...demoCatalog,
  algebra: { ...demoCatalog.algebra, lessons: [lesson01] }
};

const app = document.querySelector('#app');
const iconArrow = '<span aria-hidden="true">←</span>';
const ACCESS_KEY = 'grade8-math-syria-access';
const PASSWORD = 'CloseYourEyes173';
const QUIZ_ROUTE = 'final-quiz';

let gateError = '';
let quizState = createQuizState();

function createQuizState() {
  return { answers: {}, submitted: false, score: null, notice: '' };
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderText(value) {
  const raw = String(value ?? '');
  // Text in the source extraction sometimes contains fractions as plain text.
  // Turn those occurrences into the same visual fraction used by math objects.
  const atom = '[−-]?(?:\\d+(?:[.]\\d+)?|[٠-٩]+(?:[.٫][٠-٩]+)?|[A-Za-z]|…|\\([−-]?(?:\\d+(?:[.]\\d+)?|[٠-٩]+)\\))';
  const fractionPattern = new RegExp(`(${atom})\\/(${atom})`, 'g');
  let output = '';
  let cursor = 0;
  raw.replace(fractionPattern, (match, numerator, denominator, offset) => {
    output += escapeHtml(raw.slice(cursor, offset));
    output += renderFraction(numerator.replace(/^\\((.*)\\)$/, '$1'), denominator.replace(/^\\((.*)\\)$/, '$1'));
    cursor = offset + match.length;
    return match;
  });
  output += escapeHtml(raw.slice(cursor));
  return output;
}

function renderFraction(numerator, denominator) {
  return `<span class="fraction" dir="ltr"><span class="fraction-numerator">${renderInline(numerator)}</span><span class="fraction-bar"></span><span class="fraction-denominator">${renderInline(denominator)}</span></span>`;
}

function renderInline(value) {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.map(renderInline).join('');
  if (typeof value === 'string' || typeof value === 'number') return renderText(value);
  if (typeof value !== 'object') return renderText(value);
  if (value.type === 'fraction') return renderFraction(value.numerator, value.denominator);
  if (value.type === 'math') return `<span class="math-line" dir="ltr">${(value.parts || []).map(renderInline).join('')}</span>`;
  if (value.type === 'text') return renderText(value.value);
  if (Object.prototype.hasOwnProperty.call(value, 'value')) return renderInline(value.value);
  return renderText(value.text || '');
}

function renderRichText(value, className = '') {
  return `<span class="rich-text ${className}">${renderInline(value)}</span>`;
}

function renderList(items, className = 'content-list', ordered = false) {
  if (!items?.length) return '';
  const tag = ordered ? 'ol' : 'ul';
  return `<${tag} class="${className}">${items.map(item => `<li>${renderRichText(item)}</li>`).join('')}</${tag}>`;
}

function renderPages(pages = []) {
  if (!pages?.length) return 'غير محددة';
  return pages.join('، ');
}

function renderExample(example, index) {
  const work = example.work?.length
    ? `<div class="solution-block"><strong>خطوات الحل</strong><ol class="solution-steps">${example.work.map(step => `<li>${renderRichText(step)}</li>`).join('')}</ol></div>`
    : '';
  const blanks = example.blanks?.length
    ? `<div class="blank-exercise"><strong>أكمل الفراغات:</strong><div class="blank-row">${example.blanks.map(blank => renderFraction(blank.numerator, blank.denominator)).join('<span class="blank-separator">،</span>')}</div></div>`
    : '';
  const items = example.items?.length ? renderList(example.items, 'content-list compact-list') : '';
  return `<article class="example-card"><div class="example-heading"><span>${renderText(example.label || `مثال ${index + 1}`)}</span><small>صفحة ${renderPages([example.page])}</small></div>${example.prompt ? `<p class="example-prompt">${renderRichText(example.prompt)}</p>` : ''}${example.expression ? `<div class="display-expression">${renderInline(example.expression)}</div>` : ''}${work}${blanks}${items}${example.note ? `<p class="source-note"><strong>ملاحظة:</strong> ${renderRichText(example.note)}</p>` : ''}</article>`;
}

function renderExamples(content) {
  const examples = [...(content.examples || []), ...(content.examplesContinued || [])];
  if (!examples.length) return '';
  return `<section class="source-block"><h3>الأمثلة وخطوات الحل</h3><div class="examples-grid">${examples.map(renderExample).join('')}</div></section>`;
}

function renderExercises(exercises = []) {
  if (!exercises.length) return '';
  return `<section class="source-block"><h3>التمارين والتدريبات</h3><div class="exercise-grid">${exercises.map((exercise, index) => `<article class="exercise-card"><div class="exercise-heading"><span>تمرين ${renderText(exercise.number || index + 1)}</span><small>صفحة ${renderPages([exercise.page])}</small></div>${exercise.text ? `<p>${renderRichText(exercise.text)}</p>` : ''}${exercise.items?.length ? renderList(exercise.items, 'content-list compact-list') : ''}${exercise.unclear?.length ? `<div class="unclear-note">${exercise.unclear.map(item => `<p>${renderRichText(item)}</p>`).join('')}</div>` : ''}</article>`).join('')}</div></section>`;
}

function renderBookContent(lesson, topic) {
  const content = topic.content || topic;
  const relevantIssues = (lesson.extractionIssues || []).filter(issue => issue.page && topic.sourcePages?.includes(issue.page));
  const sourceFiles = lesson.sourceFiles?.length ? lesson.sourceFiles.join('، ') : 'غير محددة';
  const sourceReference = `<aside class="source-reference"><strong>مرجع المحتوى</strong><span>الصفحات: ${renderPages(topic.sourcePages)}</span><span>الملفات المصدرية: ${renderText(sourceFiles)}</span>${lesson.sourceNote ? `<p>${renderRichText(lesson.sourceNote)}</p>` : ''}</aside>`;
  const parts = [];
  if (content.heading) parts.push(`<h3 class="content-heading">${renderRichText(content.heading)}</h3>`);
  if (content.question) parts.push(`<div class="question-callout"><strong>سؤال الدرس</strong><p>${renderRichText(content.question)}</p></div>`);
  if (content.explanation) parts.push(`<div class="explanation-block"><strong>شرح من المصدر</strong><p>${renderRichText(content.explanation)}</p></div>`);
  if (content.instructions?.length) parts.push(`<section class="source-block"><h3>التعليمات والنشاط</h3>${renderList(content.instructions, 'content-list')}</section>`);
  if (content.rules?.length) parts.push(`<section class="source-block"><h3>القاعدة</h3><div class="formula-list">${content.rules.map(rule => `<div class="formula-card">${renderInline(rule)}</div>`).join('')}</div></section>`);
  if (content.notes?.length) parts.push(`<section class="source-block"><h3>ملاحظات مهمة</h3>${renderList(content.notes, 'note-list')}</section>`);
  parts.push(renderExamples(content));
  parts.push(renderExercises(content.exercises));
  if (content.interactions?.length) parts.push(`<section class="source-block"><h3>أسئلة تفاعلية من البيانات</h3>${renderList(content.interactions.map(item => item.question || item.text || item), 'content-list')}</section>`);
  if (content.commonMistakes?.length) parts.push(`<section class="source-block"><h3>أخطاء شائعة مذكورة في المصدر</h3>${renderList(content.commonMistakes, 'mistake-list')}</section>`);
  if (content.assessment?.questions?.length) parts.push(`<section class="source-block"><h3>اختبار المصدر</h3><p>${content.assessment.questions.length} أسئلة</p></section>`);
  if (relevantIssues.length || content.unclear?.length) {
    const warnings = [...relevantIssues.map(issue => issue.note), ...(content.unclear || [])];
    parts.push(`<aside class="unclear-panel"><strong>تنبيهات المصدر</strong>${warnings.map(note => `<p>${renderRichText(note)}</p>`).join('')}</aside>`);
  }
  if (!parts.filter(Boolean).length) parts.push('<p class="content-placeholder">لا يوجد محتوى إضافي في بيانات هذا الموضوع.</p>');
  return `<section class="book-section"><div class="section-banner book-banner"><span class="section-emoji">📘</span><div><h2>كتاب الطالب (المنهاج السوري)</h2><p>محتوى معروض من بيانات الدرس الأصلية دون استكمال أو تخمين.</p></div></div>${sourceReference}<div class="book-content">${parts.filter(Boolean).join('')}</div></section>`;
}

function renderEnrichmentTopic(topicIndex) {
  const topic = algebraEnrichment.topics[topicIndex];
  if (!topic) return '';
  const examples = topic.examples?.length
    ? `<section class="enrichment-block"><h3>أمثلة إضافية محلولة</h3><div class="examples-grid">${topic.examples.map((example, index) => `<article class="enrichment-example"><div class="example-heading"><span>${renderText(example.title || `مثال إضافي ${index + 1}`)}</span></div><div class="display-expression">${renderInline(example.expression)}</div>${example.steps?.length ? `<ol class="solution-steps">${example.steps.map(step => `<li>${renderRichText(step)}</li>`).join('')}</ol>` : ''}${example.answer ? `<div class="final-answer"><strong>النتيجة:</strong> ${renderRichText(example.answer)}</div>` : ''}</article>`).join('')}</div></section>`
    : '';
  const mistakes = topic.commonMistakes?.length
    ? `<section class="enrichment-block"><h3>أخطاء شائعة وتصحيحها</h3><div class="mistakes-grid">${topic.commonMistakes.map(mistake => `<article class="mistake-card"><p class="wrong-way">✕ ${renderRichText(mistake.mistake || mistake.wrong)}</p><p class="right-way">✓ ${renderRichText(mistake.correction || mistake.right)}</p></article>`).join('')}</div></section>`
    : '';
  const checks = topic.quickChecks?.length
    ? `<section class="enrichment-block"><h3>تحقق سريع</h3><div class="quick-checks">${topic.quickChecks.map((check, index) => `<article class="quick-check"><p><strong>${index + 1}.</strong> ${renderRichText(check.question)}</p>${check.options?.length ? renderList(check.options, 'quick-options') : ''}<button type="button" class="quick-toggle" data-action="toggle-check" data-topic="${topicIndex}" data-check="${index}" aria-expanded="false">إظهار الحل</button><div class="quick-answer" data-answer="${topicIndex}-${index}" hidden><strong>الحل:</strong> ${renderRichText(check.answer)}${check.explanation ? `<p>${renderRichText(check.explanation)}</p>` : ''}</div></article>`).join('')}</div></section>`
    : '';
  return `<section class="enrichment-section"><div class="section-banner enrichment-banner"><span class="section-emoji">💡</span><div><h2>إضاءة إثرائية وفهم أعمق</h2><p>شرح إضافي مستقل للمساعدة على الفهم، وليس نصًا من الكتاب المدرسي.</p></div></div><div class="enrichment-content"><div class="enrichment-block"><h3>الفكرة بعمق</h3><p>${renderRichText(topic.explanation)}</p></div>${topic.steps?.length ? `<div class="enrichment-block"><h3>طريقة التفكير خطوة بخطوة</h3><ol class="thinking-steps">${topic.steps.map(step => `<li>${renderRichText(step)}</li>`).join('')}</ol></div>` : ''}${examples}${mistakes}${checks}</div></section>`;
}

function sourceTopic(lesson, topic) {
  const enrichmentIndex = lesson === lesson01 ? (topic.topicOrder ?? 1) - 1 : -1;
  return `<article class="topic-content"><div class="topic-kicker">الموضوع ${String(topic.topicOrder || 1).padStart(2, '0')} · الصفحات ${renderPages(topic.sourcePages)}</div><div class="topic-art" aria-hidden="true">${topicSymbols[topic.type || topic.kind] || '∑'}</div><h2>${renderText(topic.title || topic.heading)}</h2>${renderBookContent(lesson, topic)}${renderEnrichmentTopic(enrichmentIndex)}</article>`;
}

const topicSymbols = { intro: '∑', concept: 'x + y', example: 'a = b', practice: '✓', quiz: '?', activity: '◇' };

const finalQuiz = [
  { prompt: 'احسب: (−7/9) + (4/9)', options: ['−1/3', '1/3', '−11/9', '11/9'], correct: 0, explanation: 'المقامات متساوية، لذلك −7 + 4 = −3، ومن ثم −3/9 = −1/3.' },
  { prompt: 'لتوحيد مقامي 1/4 و3/8، نضرب الكسر الأول بالعدد:', options: ['2', '4', '8', '1/2'], correct: 0, explanation: 'نحوّل المقام 4 إلى 8، ولذلك نضرب البسط والمقام في 2.' },
  { prompt: 'احسب: 5/11 − 12/11', options: ['7/11', '−7/11', '17/11', '−17/11'], correct: 1, explanation: 'المقامات متساوية: 5 − 12 = −7، إذن الناتج −7/11.' },
  { prompt: 'احسب: 1/2 + 5/8', options: ['6/10', '7/8', '9/8', '11/8'], correct: 2, explanation: 'نحوّل 1/2 إلى 4/8، ثم 4/8 + 5/8 = 9/8.' },
  { prompt: 'ما أصغر مضاعف مشترك للمقامين 6 و8؟', options: ['12', '18', '24', '48'], correct: 2, explanation: 'مضاعفات 6 و8 تلتقي أول مرة عند 24.' },
  { prompt: 'احسب: −2/3 + 1/6', options: ['−1/2', '1/2', '−1/6', '−5/6'], correct: 0, explanation: '−2/3 = −4/6، ومن ثم −4/6 + 1/6 = −3/6 = −1/2.' },
  { prompt: 'احسب: 3/5 − (−2/5)', options: ['1/5', '−1', '1', '5/25'], correct: 2, explanation: 'طرح السالب جمع: 3/5 + 2/5 = 5/5 = 1.' },
  { prompt: 'احسب: 3 − 4/5', options: ['7/5', '11/5', '13/5', '−1/5'], correct: 1, explanation: 'نكتب 3 على صورة 15/5، ثم 15/5 − 4/5 = 11/5.' },
  { prompt: 'احسب: −1.5 + 1/2', options: ['−2', '−1', '1', '−1/2'], correct: 1, explanation: '1/2 = 0.5، ولذلك −1.5 + 0.5 = −1.' },
  { prompt: 'احسب بأبسط صورة: 7/12 + 5/12', options: ['1', '12/24', '7/24', '5/12'], correct: 0, explanation: '7/12 + 5/12 = 12/12 = 1.' },
  { prompt: 'احسب: 5/4 − 1/2 + 3/8', options: ['7/8', '9/8', '11/8', '3/2'], correct: 1, explanation: 'نوحّد المقام إلى 8: 10/8 − 4/8 + 3/8 = 9/8.' },
  { prompt: 'جمع أي كسر مع نظيره الجمعي يساوي:', options: ['1', '−1', 'ضعف الكسر', '0'], correct: 3, explanation: 'النظير الجمعي للكسر a هو −a، ومجموع a + (−a) يساوي صفرًا.' },
  { prompt: 'العبارة: a/b − c/d تكافئ a/b + (−c/d).', options: ['صائبة', 'خاطئة'], correct: 0, explanation: 'طرح عدد يكافئ جمع نظيره الجمعي، لذلك العبارة صائبة.' },
  { prompt: 'شربت ليان 1/4 لتر ثم 3/8 لتر. ما كمية ما شربته؟', options: ['1/2 لتر', '5/8 لتر', '7/8 لتر', '3/4 لتر'], correct: 1, explanation: '1/4 = 2/8، ثم 2/8 + 3/8 = 5/8 لتر.' },
  { prompt: 'قُرئ 2/7 من كتاب في يوم و3/7 في يوم آخر. ما المتبقي؟', options: ['1/7', '2/7', '3/7', '5/7'], correct: 1, explanation: 'المقروء 5/7، والمتبقي 1 − 5/7 = 2/7.' },
  { prompt: 'احسب: 3/2 − (1/4 + 1/2)', options: ['1/4', '1/2', '3/4', '5/4'], correct: 2, explanation: 'داخل القوس 1/4 + 2/4 = 3/4، و3/2 = 6/4، إذن 6/4 − 3/4 = 3/4.' },
  { prompt: 'إذا كان x + 2/3 = 7/3، فما قيمة x؟', options: ['3/5', '5/3', '9/3', '2/3'], correct: 1, explanation: 'نطرح 2/3 من الطرفين: x = 7/3 − 2/3 = 5/3.' },
  { prompt: 'احسب: (−5/6) − (1/6)', options: ['−1', '−2/3', '1', '−4/6'], correct: 0, explanation: '−5/6 − 1/6 = −6/6 = −1.' }
];

function quizResultLabel(score) {
  if (score >= 16) return '🌟 ممتاز';
  if (score >= 13) return '👍 جيد جدًا';
  return '🔄 بحاجة لمراجعة';
}

function quizResultCard() {
  if (!quizState.submitted) return '';
  const percentage = Math.round((quizState.score / finalQuiz.length) * 100);
  return `<section class="quiz-result" aria-live="polite"><div><span class="result-label">نتيجة الاختبار</span><strong>${quizState.score} / ${finalQuiz.length}</strong></div><div><span class="result-label">النسبة المئوية</span><strong>${percentage}%</strong></div><div class="result-category"><span class="result-label">التصنيف التعليمي</span><strong>${quizResultLabel(quizState.score)}</strong></div></section>`;
}

function renderQuizQuestion(question, index) {
  const selected = quizState.answers[index];
  const submitted = quizState.submitted;
  return `<fieldset class="quiz-question ${submitted ? 'is-checked' : ''}"><legend><span class="question-number">${index + 1}</span><span>${renderRichText(question.prompt)}</span></legend><div class="quiz-options">${question.options.map((option, optionIndex) => {
    const isCorrect = submitted && optionIndex === question.correct;
    const isWrong = submitted && selected === optionIndex && optionIndex !== question.correct;
    const stateClass = isCorrect ? 'option-correct' : isWrong ? 'option-wrong' : '';
    return `<label class="quiz-option ${stateClass}"><input type="radio" name="quiz-${index}" value="${optionIndex}" data-quiz-question="${index}" ${selected === optionIndex ? 'checked' : ''} ${submitted ? 'disabled' : ''}><span>${renderRichText(option)}</span>${submitted && isCorrect ? '<b class="option-mark">✓ الإجابة الصحيحة</b>' : ''}${submitted && isWrong ? '<b class="option-mark">✕ اختيارك</b>' : ''}</label>`;
  }).join('')}</div>${submitted ? `<div class="quiz-explanation"><strong>شرح مختصر:</strong> ${renderRichText(question.explanation)}</div>` : ''}</fieldset>`;
}

function finalQuizPage(item, lesson, key, index) {
  const topicUrl = n => `#/lesson/${key}/${index}/${n}`;
  return layout(`<section class="lesson-shell quiz-shell"><a class="back-link" href="#/section/${key}">${iconArrow} العودة إلى دروس ${item.name}</a><div class="lesson-title"><div><div class="eyebrow"><span class="dot"></span> ${renderText(item.name)} · ${renderText(lesson.title)}</div><h1>الاختبار النهائي</h1><p class="quiz-intro">اختبر فهمك لموضوع الجمع والطرح. أجب عن الأسئلة الثمانية عشر ثم اطلب التصحيح.</p></div><span class="lesson-count">18 سؤالًا</span></div><div class="progress-track"><span style="width:100%"></span></div><nav class="topic-tabs quiz-tabs" role="tablist" aria-label="تبويبات درس الجمع والطرح">${lesson.topics.map((topic, topicIndex) => `<a role="tab" class="topic-tab" href="${topicUrl(topicIndex)}"><span>${String(topicIndex + 1).padStart(2, '0')}</span>${renderText(topic.title)}</a>`).join('')}<a role="tab" aria-selected="true" class="topic-tab selected final-quiz-tab" href="#/lesson/${key}/${index}/${QUIZ_ROUTE}"><span>★</span> الاختبار النهائي (18 سؤالاً)</a></nav>${quizState.notice ? `<div class="quiz-notice" role="alert">${renderText(quizState.notice)}</div>` : ''}${quizResultCard()}<form id="final-quiz-form" class="final-quiz-form"><div class="quiz-question-list">${finalQuiz.map(renderQuizQuestion).join('')}</div><div class="quiz-actions"><button class="nav-button primary submit-quiz" type="submit">تسليم وتصحيح الاختبار</button>${quizState.submitted ? '<button class="nav-button reset-quiz" type="button" data-action="reset-quiz">🔄 إعادة حل الاختبار</button>' : ''}</div></form></section>`, 'algebra');
}

function layout(content, active = '') {
  return `<header class="site-header"><a class="brand" href="#/" aria-label="العودة إلى الرئيسية"><span class="brand-mark">∑</span><span><strong>رياضيات</strong><small>الصف الثامن · المنهاج السوري</small></span></a><nav><a class="nav-link ${active === 'home' ? 'active' : ''}" href="#/">الرئيسية</a><a class="nav-link ${active === 'algebra' ? 'active' : ''}" href="#/section/algebra">الجبر</a><a class="nav-link ${active === 'geometry' ? 'active' : ''}" href="#/section/geometry">الهندسة</a></nav><button class="lock-button" type="button" data-action="lock" aria-label="قفل الموقع">🔒 قفل</button></header><main>${content}</main>${contactCard()}<footer>رياضيات الصف الثامن <span>·</span> المنهاج السوري</footer>`;
}

function contactCard() {
  return `<section class="contact-wrap"><div class="contact-card"><div class="contact-icon" aria-hidden="true">✦</div><div class="contact-copy"><span class="contact-label">للاستفسار والتواصل</span><strong>المهندس سومر شاهين</strong><a class="phone-link" href="tel:+963930215022" dir="ltr">0930215022</a></div><a class="whatsapp-button" href="https://wa.me/963930215022" target="_blank" rel="noopener noreferrer">تواصل عبر WhatsApp <span aria-hidden="true">↗</span></a></div></section>`;
}

function home() {
  return layout(`<section class="hero"><div class="eyebrow"><span class="dot"></span> تعلّم بوضوح، خطوة بخطوة</div><h1>دروس الرياضيات<br><em>للصف الثامن</em></h1><p class="lead">مساحة منظمة لفهم الرياضيات وفق المنهاج السوري،<br class="desktop-only"> من المفهوم إلى التدريب.</p><div class="section-label">اختر القسم الذي تريد البدء به</div><div class="subject-grid">${subjectCard('algebra')} ${subjectCard('geometry')}</div></section>`, 'home');
}

function subjectCard(key) {
  const item = catalog[key];
  return `<a class="subject-card ${key}" href="#/section/${key}"><div class="card-top"><span class="subject-icon">${item.icon}</span><span class="circle-arrow">${iconArrow}</span></div><div><h2>${renderText(item.name)}</h2><p>${renderText(item.description)}</p></div><span class="card-link">استعرض الدروس ${iconArrow}</span></a>`;
}

function sectionPage(key) {
  const item = catalog[key];
  return layout(`<section class="page-shell"><a class="back-link" href="#/">${iconArrow} العودة للرئيسية</a><div class="section-heading"><div><div class="eyebrow"><span class="dot"></span> قسم ${renderText(item.name)}</div><h1>دروس ${renderText(item.name)}</h1><p>اختر درسًا للبدء. ستجد كل درس مقسمًا إلى مواضيع قصيرة ومستقلة.</p></div><span class="large-symbol">${item.icon}</span></div><div class="lesson-list">${item.lessons.map((lesson, i) => `<a class="lesson-row" href="#/lesson/${key}/${i}"><span class="lesson-number">${String(lesson.number ?? i + 1).padStart(2, '0')}</span><span class="lesson-copy"><strong>${renderText(lesson.title)}</strong><small>${lesson.description ? `${renderText(lesson.description)} · ` : ''}<b>${lesson.topics.length} موضوعات</b></small></span><span class="row-arrow">${iconArrow}</span></a>`).join('')}</div><div class="future-note"><span>＋</span><div><strong>مساحة قابلة للتوسع</strong><p>ستضاف الدروس الجديدة هنا مع الحفاظ على نفس بنية الموقع.</p></div></div></section>`, key);
}

function lessonPage(key, index, topicIndex = 0) {
  const item = catalog[key];
  const lesson = item.lessons[index];
  if (!lesson) return sectionPage(key);
  if (topicIndex === QUIZ_ROUTE && key === 'algebra') return finalQuizPage(item, lesson, key, index);
  const numericIndex = Number(topicIndex);
  const safeIndex = Number.isFinite(numericIndex) ? Math.max(0, Math.min(numericIndex, lesson.topics.length - 1)) : 0;
  const topic = lesson.topics[safeIndex];
  const previous = safeIndex > 0 ? safeIndex - 1 : null;
  const next = safeIndex < lesson.topics.length - 1 ? safeIndex + 1 : null;
  const topicUrl = n => `#/lesson/${key}/${index}/${n}`;
  const topicTabs = lesson.topics.map((currentTopic, i) => `<a role="tab" aria-selected="${i === safeIndex}" class="topic-tab ${i === safeIndex ? 'selected' : ''}" href="${topicUrl(i)}"><span>${String(i + 1).padStart(2, '0')}</span>${renderText(currentTopic.label || currentTopic.title)}</a>`).join('');
  const quizTab = key === 'algebra' ? `<a role="tab" aria-selected="false" class="topic-tab final-quiz-tab" href="${topicUrl(QUIZ_ROUTE)}"><span>★</span> الاختبار النهائي (18 سؤالاً)</a>` : '';
  return layout(`<section class="lesson-shell"><a class="back-link" href="#/section/${key}">${iconArrow} العودة إلى دروس ${renderText(item.name)}</a><div class="lesson-title"><div><div class="eyebrow"><span class="dot"></span> ${renderText(item.name)} · ${renderText(lesson.title)}</div><h1>${renderText(lesson.title)}</h1></div><span class="lesson-count">${String(safeIndex + 1).padStart(2, '0')} / ${String(lesson.topics.length).padStart(2, '0')}</span></div><div class="progress-track" aria-label="التقدم في الدرس"><span style="width:${((safeIndex + 1) / lesson.topics.length) * 100}%"></span></div><div class="topic-tabs" role="tablist" aria-label="موضوعات الدرس">${topicTabs}${quizTab}</div>${sourceTopic(lesson, topic)}<div class="lesson-navigation"><a class="nav-button ${previous === null ? 'disabled' : ''}" ${previous === null ? 'aria-disabled="true"' : `href="${topicUrl(previous)}"`}>${iconArrow} <span>السابق</span></a><span class="position-label">الموضوع ${safeIndex + 1} من ${lesson.topics.length}</span><a class="nav-button primary ${next === null ? 'disabled' : ''}" ${next === null ? 'aria-disabled="true"' : `href="${topicUrl(next)}"`}><span>التالي</span> <span aria-hidden="true">→</span></a></div></section>`, key);
}

function gatePage() {
  return `<main class="gate-page"><section class="access-gate" aria-labelledby="gate-title"><div class="gate-mark">∑</div><div class="eyebrow"><span class="dot"></span> مساحة تعلم خاصة</div><h1 id="gate-title">مرحبًا بك في رياضيات الصف الثامن</h1><p>أدخل كلمة المرور للمتابعة إلى الدروس والأنشطة.</p><form id="password-form" class="password-form"><label for="site-password">كلمة المرور</label><div class="password-field"><input id="site-password" name="password" type="password" autocomplete="current-password" required autofocus placeholder="أدخل كلمة المرور"><button type="submit">دخول</button></div>${gateError ? `<p class="gate-error" role="alert">${renderText(gateError)}</p>` : ''}</form><small class="gate-note">هذه بوابة واجهة للموقع التعليمي وليست حماية أمنية حقيقية.</small></section></main>`;
}

function isUnlocked() {
  try {
    return window.localStorage.getItem(ACCESS_KEY) === 'unlocked';
  } catch {
    return false;
  }
}

function unlock() {
  try {
    window.localStorage.setItem(ACCESS_KEY, 'unlocked');
  } catch {
    // The page still opens for this session if storage is unavailable.
  }
  gateError = '';
  render();
}

function lock() {
  try {
    window.localStorage.removeItem(ACCESS_KEY);
  } catch {
    // Nothing else is required when storage is unavailable.
  }
  gateError = '';
  quizState = createQuizState();
  render();
}

function parseRoute() {
  return location.hash.replace(/^#\/?/, '').split('/');
}

function render() {
  document.documentElement.lang = 'ar';
  document.documentElement.dir = 'rtl';
  const parts = parseRoute();
  const isQuiz = parts[0] === 'lesson' && parts[3] === QUIZ_ROUTE;
  if (!isQuiz) quizState = createQuizState();
  if (!isUnlocked()) {
    document.body.classList.add('locked');
    app.innerHTML = gatePage();
    requestAnimationFrame(() => document.querySelector('#site-password')?.focus());
    return;
  }
  document.body.classList.remove('locked');
  if (!parts[0]) app.innerHTML = home();
  else if (parts[0] === 'section' && catalog[parts[1]]) app.innerHTML = sectionPage(parts[1]);
  else if (parts[0] === 'lesson' && catalog[parts[1]]) app.innerHTML = lessonPage(parts[1], Number(parts[2] || 0), parts[3] ?? 0);
  else app.innerHTML = home();
  window.scrollTo(0, 0);
}

app.addEventListener('submit', event => {
  if (event.target.id === 'password-form') {
    event.preventDefault();
    const password = new FormData(event.target).get('password');
    if (password === PASSWORD) unlock();
    else {
      gateError = 'كلمة المرور غير صحيحة. حاول مرة أخرى.';
      render();
    }
    return;
  }
  if (event.target.id === 'final-quiz-form') {
    event.preventDefault();
    const missing = finalQuiz.some((_, index) => quizState.answers[index] === undefined);
    if (missing) {
      quizState.notice = 'يرجى اختيار إجابة لكل سؤال قبل تسليم الاختبار.';
      quizState.submitted = false;
      render();
      return;
    }
    quizState.score = finalQuiz.reduce((score, question, index) => score + (quizState.answers[index] === question.correct ? 1 : 0), 0);
    quizState.submitted = true;
    quizState.notice = '';
    render();
  }
});

app.addEventListener('change', event => {
  const questionIndex = event.target.dataset.quizQuestion;
  if (questionIndex !== undefined && !quizState.submitted) quizState.answers[questionIndex] = Number(event.target.value);
});

app.addEventListener('click', event => {
  const actionElement = event.target.closest('[data-action]');
  if (!actionElement) return;
  const action = actionElement.dataset.action;
  if (action === 'lock') {
    lock();
    return;
  }
  if (action === 'reset-quiz') {
    quizState = createQuizState();
    render();
    return;
  }
  if (action === 'toggle-check') {
    const answer = document.querySelector(`[data-answer="${actionElement.dataset.topic}-${actionElement.dataset.check}"]`);
    if (!answer) return;
    const isHidden = answer.hasAttribute('hidden');
    answer.toggleAttribute('hidden', !isHidden);
    actionElement.setAttribute('aria-expanded', String(isHidden));
    actionElement.textContent = isHidden ? 'إخفاء الحل' : 'إظهار الحل';
  }
});

window.addEventListener('hashchange', render);
render();
