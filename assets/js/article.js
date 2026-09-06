const params = new URLSearchParams(window.location.search);
const articleId = params.get('id');

const titleEl = document.querySelector('[data-article-title]');
const categoryEl = document.querySelector('[data-article-category]');
const summaryEl = document.querySelector('[data-article-summary]');
const metaEl = document.querySelector('[data-article-meta]');
const bodyEl = document.querySelector('[data-article-body]');
const backEl = document.querySelector('[data-article-back]');

Promise.all([
  fetch('data/articles.json').then(r => {
    if (!r.ok) throw new Error(`Unable to load article catalog (${r.status})`);
    return r.json();
  }),
  loadDependencies()
])
.then(([items]) => {
  const article = items.find(a => a.id === articleId);
  if (!article) throw new Error('Article not found.');

  titleEl.textContent = article.title;
  categoryEl.textContent = article.categoryLabel || 'Technical Article';
  summaryEl.textContent = article.summary || '';
  document.title = `${article.title} | Zenova Systems`;

  const date = article.date ? new Date(`${article.date}T00:00:00`).toLocaleDateString(undefined, {
    year:'numeric', month:'long', day:'numeric'
  }) : '';

  metaEl.innerHTML = [
    date ? `<span class="article-chip">${escapeHtml(date)}</span>` : '',
    ...(article.tags || []).map(t => `<span class="article-chip">${escapeHtml(t)}</span>`)
  ].join('');

  backEl.href = `articles.html?category=${encodeURIComponent(article.category)}`;
  backEl.textContent = `← ${article.categoryLabel || 'Articles'}`;

  if (!article.gist || /USERNAME|GIST_ID/.test(article.gist)) {
    bodyEl.innerHTML = `
      <div class="article-error">
        This article is registered, but its GitHub Gist raw Markdown URL has not been configured yet.
        Update <code>data/articles.json</code> with the Gist raw URL.
      </div>`;
    return;
  }

  return fetch(article.gist, {cache:'no-store'})
    .then(r => {
      if (!r.ok) throw new Error(`Unable to load Markdown from GitHub Gist (${r.status})`);
      return r.text();
    })
    .then(markdown => {
      const rendered = marked.parse(markdown, {
        gfm: true,
        breaks: false
      });
      bodyEl.innerHTML = DOMPurify.sanitize(rendered, {
        USE_PROFILES: {html: true}
      });
      bodyEl.querySelectorAll('a').forEach(a => {
        if (a.hostname && a.hostname !== window.location.hostname) {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
      });
    });
})
.catch(err => {
  bodyEl.innerHTML = `<div class="article-error">${escapeHtml(err.message)}</div>`;
});

function loadDependencies() {
  return Promise.all([
    loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js', 'marked'),
    loadScript('https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js', 'DOMPurify')
  ]);
}

function loadScript(src, globalName) {
  if (window[globalName]) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`Unable to load ${globalName}`));
    document.head.appendChild(s);
  });
}

function escapeHtml(value='') {
  return String(value).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[c]));
}