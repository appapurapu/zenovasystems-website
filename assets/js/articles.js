const qs = new URLSearchParams(window.location.search);
const category = qs.get('category') || 'embedded-edge';

const categoryMap = {
  'ai-intelligent': {
    label: 'AI & Intelligent Systems',
    description: 'LLMs, RAG, agentic workflows, on-device intelligence, model optimization, and applied machine learning.'
  },
  'embedded-edge': {
    label: 'Embedded & Edge Computing',
    description: 'C/C++, Rust, Linux, firmware, IPC, device services, DSPs, real-time behavior, and edge AI.'
  },
  'automotive': {
    label: 'Automotive Platforms',
    description: 'AOSP, AAOS, HALs, Binder, audio, Bluetooth, Wi-Fi, CAN, telematics, and connected vehicle systems.'
  },
  'cloud-connected': {
    label: 'Cloud & Connected Systems',
    description: 'Google Cloud, Firebase, APIs, OTA, observability, backend integration, and device-to-cloud architecture.'
  },
  'systems-performance': {
    label: 'Systems Performance',
    description: 'Concurrency, latency, memory, profiling, deadlocks, race conditions, optimization, and reliability.'
  },
  'emerging-computing': {
    label: 'Emerging Computing',
    description: 'Quantum machine learning, QCNNs, hybrid systems, and experimental intelligent computing.'
  }
};

const meta = categoryMap[category] || {
  label: 'Technical Articles',
  description: 'Engineering and research articles from Zenova Systems.'
};

document.querySelector('[data-category-label]').textContent = meta.label;
document.querySelector('[data-category-description]').textContent = meta.description;
document.title = `${meta.label} Articles | Zenova Systems`;

fetch('data/articles.json')
  .then(r => {
    if (!r.ok) throw new Error(`Unable to load article catalog (${r.status})`);
    return r.json();
  })
  .then(items => {
    const list = document.querySelector('[data-article-list]');
    const matches = items
      .filter(a => a.category === category)
      .sort((a,b) => String(b.date).localeCompare(String(a.date)));

    if (!matches.length) {
      list.innerHTML = '<div class="category-empty">No articles have been published in this category yet.</div>';
      return;
    }

    list.innerHTML = matches.map(a => `
      <a class="article-list-card" href="article.html?id=${encodeURIComponent(a.id)}">
        <div class="section-kicker">${escapeHtml(a.categoryLabel || meta.label)}</div>
        <h3>${escapeHtml(a.title)}</h3>
        <p>${escapeHtml(a.summary || '')}</p>
        <div class="article-list-tags">${(a.tags || []).map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
        <span class="card-link">Read article →</span>
      </a>
    `).join('');
  })
  .catch(err => {
    document.querySelector('[data-article-list]').innerHTML =
      `<div class="article-error">${escapeHtml(err.message)}</div>`;
  });

function escapeHtml(value='') {
  return value.replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[c]));
}