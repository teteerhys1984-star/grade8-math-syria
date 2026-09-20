import './style.css';
import { catalog as demoCatalog } from './data/content.js';
import lesson01 from './data/lessons/algebra/lesson-01.js';

// Keep the existing catalog as the fallback for other sections while the
// extracted first Algebra lesson is served from its source-specific data file.
const catalog = {
  ...demoCatalog,
  algebra: { ...demoCatalog.algebra, lessons: [lesson01] }
};

const app = document.querySelector('#app');
const iconArrow = '<span aria-hidden="true">←</span>';

function layout(content, active = '') {
  return `<header class="site-header"><a class="brand" href="#/" aria-label="العودة إلى الرئيسية"><span class="brand-mark">∑</span><span><strong>رياضيات</strong><small>الصف الثامن · المنهاج السوري</small></span></a><nav><a class="nav-link ${active === 'home' ? 'active' : ''}" href="#/">الرئيسية</a><a class="nav-link ${active === 'algebra' ? 'active' : ''}" href="#/section/algebra">الجبر</a><a class="nav-link ${active === 'geometry' ? 'active' : ''}" href="#/section/geometry">الهندسة</a></nav></header><main>${content}</main><footer>رياضيات الصف الثامن <span>·</span> المنهاج السوري</footer>`;
}

function home() {
  return layout(`<section class="hero"><div class="eyebrow"><span class="dot"></span> تعلّم بوضوح، خطوة بخطوة</div><h1>دروس الرياضيات<br><em>للصف الثامن</em></h1><p class="lead">مساحة منظمة لفهم الرياضيات وفق المنهاج السوري،<br class="desktop-only"> من المفهوم إلى التدريب.</p><div class="section-label">اختر القسم الذي تريد البدء به</div><div class="subject-grid">${subjectCard('algebra')} ${subjectCard('geometry')}</div></section>`, 'home');
}
function subjectCard(key) {
  const item = catalog[key];
  return `<a class="subject-card ${key}" href="#/section/${key}"><div class="card-top"><span class="subject-icon">${item.icon}</span><span class="circle-arrow">${iconArrow}</span></div><div><h2>${item.name}</h2><p>${item.description}</p></div><span class="card-link">استعرض الدروس ${iconArrow}</span></a>`;
}
function sectionPage(key) {
  const item = catalog[key];
  return layout(`<section class="page-shell"><a class="back-link" href="#/">${iconArrow} العودة للرئيسية</a><div class="section-heading"><div><div class="eyebrow"><span class="dot"></span> قسم ${item.name}</div><h1>دروس ${item.name}</h1><p>اختر درسًا للبدء. ستجد كل درس مقسمًا إلى مواضيع قصيرة ومستقلة.</p></div><span class="large-symbol">${item.icon}</span></div><div class="lesson-list">${item.lessons.map((lesson, i) => `<a class="lesson-row" href="#/lesson/${key}/${i}"><span class="lesson-number">${String(lesson.number ?? i + 1).padStart(2, '0')}</span><span class="lesson-copy"><strong>${lesson.title}</strong><small>${lesson.description ? `${lesson.description} · ` : ''}<b>${lesson.topics.length} موضوعات</b></small></span><span class="row-arrow">${iconArrow}</span></a>`).join('')}</div><div class="future-note"><span>＋</span><div><strong>مساحة قابلة للتوسع</strong><p>ستضاف الدروس الجديدة هنا مع الحفاظ على نفس بنية الموقع.</p></div></div></section>`, key);
}

const topicSymbols = { intro: '∑', concept: 'x + y', example: 'a = b', practice: '✓', quiz: '?', activity: '◇' };
function topicContent(topic) {
  const content = topic.content || topic;
  const extras = [];
  if (content.explanation) extras.push(`<p>${content.explanation}</p>`);
  if (content.examples?.length || content.examplesContinued?.length) extras.push(`<div class="data-block"><strong>أمثلة</strong><span>${(content.examples?.length || 0) + (content.examplesContinued?.length || 0)} مثال</span></div>`);
  if (content.notes?.length) extras.push(`<div class="data-block"><strong>ملاحظات مهمة</strong><span>${content.notes.length} ملاحظة</span></div>`);
  if (content.commonMistakes?.length) extras.push(`<div class="data-block"><strong>أخطاء شائعة</strong><span>${content.commonMistakes.length} تنبيه</span></div>`);
  if (content.exercises?.length) extras.push(`<div class="data-block"><strong>تمارين</strong><span>${content.exercises.length} تمرين</span></div>`);
  if (content.interactions?.length) extras.push(`<div class="data-block"><strong>أسئلة تفاعلية</strong><span>${content.interactions.length} سؤال</span></div>`);
  if (content.assessment) extras.push(`<div class="data-block"><strong>اختبار الدرس</strong><span>${content.assessment.questions.length} أسئلة</span></div>`);
  if (content.instructions?.length) extras.push(`<div class="data-block"><strong>تعليمات المصدر</strong><span>${content.instructions.length} تعليمات</span></div>`);
  return extras.join('') || '<div class="content-placeholder">هيكل المحتوى جاهز للإضافة لاحقًا</div>';
}
function lessonPage(key, index, topicIndex = 0) {
  const item = catalog[key]; const lesson = item.lessons[index];
  if (!lesson) return sectionPage(key);
  const safeIndex = Math.max(0, Math.min(topicIndex, lesson.topics.length - 1));
  const topic = lesson.topics[safeIndex];
  const previous = safeIndex > 0 ? safeIndex - 1 : null; const next = safeIndex < lesson.topics.length - 1 ? safeIndex + 1 : null;
  const topicUrl = n => `#/lesson/${key}/${index}/${n}`;
  return layout(`<section class="lesson-shell"><a class="back-link" href="#/section/${key}">${iconArrow} العودة إلى دروس ${item.name}</a><div class="lesson-title"><div><div class="eyebrow"><span class="dot"></span> ${item.name} · ${lesson.title}</div><h1>${lesson.title}</h1></div><span class="lesson-count">${String(safeIndex + 1).padStart(2, '0')} / ${String(lesson.topics.length).padStart(2, '0')}</span></div><div class="progress-track" aria-label="التقدم في الدرس"><span style="width:${((safeIndex + 1) / lesson.topics.length) * 100}%"></span></div><div class="topic-tabs" role="tablist" aria-label="موضوعات الدرس">${lesson.topics.map((t, i) => `<a role="tab" aria-selected="${i === safeIndex}" class="topic-tab ${i === safeIndex ? 'selected' : ''}" href="${topicUrl(i)}"><span>${String(i + 1).padStart(2, '0')}</span>${t.label || t.title}</a>`).join('')}</div><article class="topic-panel"><div class="topic-kicker">الموضوع ${String(safeIndex + 1).padStart(2, '0')} · ${topic.sourcePages?.length === 1 ? 'الصفحة' : 'الصفحات'} ${topic.sourcePages?.join('، ') || 'غير محددة'}</div><div class="topic-art ${topic.type || topic.kind || ''}" aria-hidden="true">${topicSymbols[topic.type || topic.kind] || '•'}</div><h2>${topic.title || topic.heading}</h2><div class="topic-data">${topicContent(topic)}</div></article><div class="lesson-navigation"><a class="nav-button ${previous === null ? 'disabled' : ''}" ${previous === null ? 'aria-disabled="true"' : `href="${topicUrl(previous)}"`}>${iconArrow} <span>السابق</span></a><span class="position-label">الموضوع ${safeIndex + 1} من ${lesson.topics.length}</span><a class="nav-button primary ${next === null ? 'disabled' : ''}" ${next === null ? 'aria-disabled="true"' : `href="${topicUrl(next)}"`}><span>التالي</span> <span aria-hidden="true">→</span></a></div></section>`, key);
}

function render() {
  const parts = location.hash.replace(/^#\/?/, '').split('/');
  if (!parts[0]) app.innerHTML = home();
  else if (parts[0] === 'section' && catalog[parts[1]]) app.innerHTML = sectionPage(parts[1]);
  else if (parts[0] === 'lesson' && catalog[parts[1]]) app.innerHTML = lessonPage(parts[1], Number(parts[2] || 0), Number(parts[3] || 0));
  else app.innerHTML = home();
  window.scrollTo({ top: 0, behavior: 'instant' });
}
window.addEventListener('hashchange', render); render();
