import './style.css';

const lessonTemplate = (section, title) => ({
  section,
  title,
  topics: [
    { label: 'مقدمة', kind: 'intro', heading: 'نبدأ من هنا', body: 'سيُضاف محتوى هذا الموضوع عند إعداد الدرس. هذا المكان مخصص لمقدمة قصيرة تمهّد للفكرة الأساسية.' },
    { label: 'المفهوم', kind: 'concept', heading: 'المفهوم الأساسي', body: 'سيُعرض هنا الشرح المنظم للمفهوم، مع إبقاء كل فكرة في تبويب مستقل ليسهل على الطالب التركيز.' },
    { label: 'مثال', kind: 'example', heading: 'مثال توضيحي', body: 'سيُضاف هنا مثال محلول خطوة بخطوة. ستظهر المعادلات لاحقًا ضمن مساحة واضحة من اليمين إلى اليسار حسب الحاجة.' },
    { label: 'تدريب', kind: 'practice', heading: 'تدريب قصير', body: 'سيُضاف هنا تدريب تفاعلي يساعد الطالب على تطبيق ما تعلّمه قبل الانتقال إلى الاختبار.' },
    { label: 'اختبار', kind: 'quiz', heading: 'تحقق من فهمك', body: 'سيُضاف هنا اختبار قصير مرتبط بهذا الدرس.' }
  ]
});

const catalog = {
  algebra: { name: 'الجبر', icon: '＋', description: 'أساسيات التعبير الجبري والمعادلات', lessons: ['الدرس الأول', 'الدرس الثاني', 'الدرس الثالث'].map(title => lessonTemplate('الجبر', title)) },
  geometry: { name: 'الهندسة', icon: '△', description: 'الأشكال والعلاقات الهندسية', lessons: ['الدرس الأول', 'الدرس الثاني', 'الدرس الثالث'].map(title => lessonTemplate('الهندسة', title)) }
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
  return layout(`<section class="page-shell"><a class="back-link" href="#/">${iconArrow} العودة للرئيسية</a><div class="section-heading"><div><div class="eyebrow"><span class="dot"></span> قسم ${item.name}</div><h1>دروس ${item.name}</h1><p>اختر درسًا للبدء. ستجد كل درس مقسمًا إلى مواضيع قصيرة ومستقلة.</p></div><span class="large-symbol">${item.icon}</span></div><div class="lesson-list">${item.lessons.map((lesson, i) => `<a class="lesson-row" href="#/lesson/${key}/${i}"><span class="lesson-number">${String(i + 1).padStart(2, '0')}</span><span class="lesson-copy"><strong>${lesson.title}</strong><small>موضوعات الدرس <b>${lesson.topics.length}</b></small></span><span class="row-arrow">${iconArrow}</span></a>`).join('')}</div><div class="future-note"><span>＋</span><div><strong>مساحة قابلة للتوسع</strong><p>ستضاف الدروس الجديدة هنا مع الحفاظ على نفس بنية الموقع.</p></div></div></section>`, key);
}
function lessonPage(key, index, topicIndex = 0) {
  const item = catalog[key]; const lesson = item.lessons[index];
  if (!lesson) return sectionPage(key);
  const topic = lesson.topics[topicIndex] || lesson.topics[0];
  const previous = topicIndex > 0 ? topicIndex - 1 : null; const next = topicIndex < lesson.topics.length - 1 ? topicIndex + 1 : null;
  const topicUrl = n => `#/lesson/${key}/${index}/${n}`;
  return layout(`<section class="lesson-shell"><a class="back-link" href="#/section/${key}">${iconArrow} العودة إلى دروس ${item.name}</a><div class="lesson-title"><div><div class="eyebrow"><span class="dot"></span> ${item.name} · ${lesson.title}</div><h1>${lesson.title}</h1></div><span class="lesson-count">${String(topicIndex + 1).padStart(2, '0')} / ${String(lesson.topics.length).padStart(2, '0')}</span></div><div class="progress-track" aria-label="التقدم في الدرس"><span style="width:${((topicIndex + 1) / lesson.topics.length) * 100}%"></span></div><div class="topic-tabs" role="tablist" aria-label="موضوعات الدرس">${lesson.topics.map((t, i) => `<a role="tab" aria-selected="${i === topicIndex}" class="topic-tab ${i === topicIndex ? 'selected' : ''}" href="${topicUrl(i)}"><span>${String(i + 1).padStart(2, '0')}</span>${t.label}</a>`).join('')}</div><article class="topic-panel"><div class="topic-kicker">الموضوع ${String(topicIndex + 1).padStart(2, '0')}</div><div class="topic-art ${topic.kind}" aria-hidden="true">${topic.kind === 'intro' ? '∑' : topic.kind === 'concept' ? 'x + y' : topic.kind === 'example' ? 'a = b' : topic.kind === 'practice' ? '✓' : '?'}</div><h2>${topic.heading}</h2><p>${topic.body}</p><div class="content-placeholder">هيكل المحتوى جاهز للإضافة لاحقًا</div></article><div class="lesson-navigation"><a class="nav-button ${previous === null ? 'disabled' : ''}" ${previous === null ? 'aria-disabled="true"' : `href="${topicUrl(previous)}"`}>${iconArrow} <span>السابق</span></a><span class="position-label">الموضوع ${topicIndex + 1} من ${lesson.topics.length}</span><a class="nav-button primary ${next === null ? 'disabled' : ''}" ${next === null ? 'aria-disabled="true"' : `href="${topicUrl(next)}"`}><span>التالي</span> <span aria-hidden="true">→</span></a></div></section>`, key);
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
