(function () {
  const base = new URL('.', document.baseURI);
  const registers = ['image-register-internal.md', 'image-register-external.md'];
  let records = new Map();
  let failed = false;
  let revision = 0;
  let observer;
  let loadedRoute = null;

  function plain(value) {
    const node = document.createElement('span');
    node.innerHTML = value || '';
    return node.textContent.trim();
  }

  function safeURL(value) {
    try {
      const url = new URL(value, base);
      return /^https?:$/.test(url.protocol) ? url : null;
    } catch (_) { return null; }
  }

  function key(value) {
    const url = safeURL(value);
    if (!url) return '';
    try { return url.origin + decodeURIComponent(url.pathname); }
    catch (_) { return url.origin + url.pathname; }
  }

  function parseTable(markdown) {
    const defaultStatus = markdown.match(/<!--\s*image-default-status:\s*(.*?)\s*-->/);
    let headers = [];
    const result = new Map();
    for (const line of markdown.split('\n')) {
      if (!line.trim().startsWith('|')) continue;
      const cells = line.trim().split('|').slice(1, -1).map(cell => cell.trim());
      if (cells.includes('그림명') || cells.includes('그림명·파일')) { headers = cells; continue; }
      if (!headers.length) continue;
      const field = name => cells[headers.indexOf(name)] || '';
      const nameCell = field('그림명') || field('그림명·파일');
      const previewPath = field('미리보기').match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i);
      const path = previewPath || nameCell.match(/<!--\s*image-path:\s*(.*?)\s*-->/) || nameCell.match(/<code>(.*?)<\/code>/);
      if (!path) continue;
      const sourceLink = field('원본 링크').match(/\]\(([^\s]+)\)/);
      result.set(key(plain(path[1])), {
        source: plain(field('출처 및 저작자') || field('출처·저작자') || field('출처·저작자 및 기존 기록')),
        method: plain(field('제작방식(제작자)') || field('제작방식')),
        status: plain(field('저작권 유형') || field('이용 상태')) || (defaultStatus ? plain(defaultStatus[1]) : ''),
        license: defaultStatus ? '' : plain(field('라이선스·점검 메모')),
        original: sourceLink ? safeURL(plain(sourceLink[1])) : null
      });
    }
    return result;
  }

  function apply() {
    const content = document.querySelector('.markdown-section');
    if (loadedRoute !== location.hash || !content) return;
    if (/\/docs\/image\/image-register(?:-|\b)/.test(location.hash)) {
      content.querySelectorAll('table img').forEach(img => {
        const imageURL = safeURL(img.getAttribute('src'));
        if (!imageURL) return;
        const record = records.get(key(imageURL.href));
        const target = record && record.original || imageURL;
        let link = img.closest('a');
        if (!link) {
          link = document.createElement('a');
          img.before(link);
          link.append(img);
        }
        link.href = target.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.title = record && record.original ? '원본 출처 열기 (새 탭)' : '이미지 크게 보기 (새 탭)';
      });
      return;
    }
    content.querySelectorAll('img').forEach(img => {
      if (img.closest('.image-credit, .exhibit-map, .footnote-popup') || img.hasAttribute('usemap')) return;
      const imageURL = safeURL(img.getAttribute('src'));
      if (!imageURL || /\/docs\/image\/exhibition\//.test(imageURL.pathname)) return;
      // Interface assets and logos are not document illustrations.
      if (!records.has(key(imageURL.href)) && !/\/docs\/image\//.test(imageURL.pathname) && !/\/docs\/theory\//.test(location.hash)) return;
      const record = records.get(key(imageURL.href));
      const original = record && record.original;
      const target = original || imageURL;
      const group = document.createElement('span');
      group.className = 'image-credit';
      let link = img.closest('a');
      if (link && (link.querySelectorAll('img').length !== 1 || link.textContent.trim())) return;
      const anchor = link || img;
      anchor.before(group);
      if (!link) { link = document.createElement('a'); link.append(img); }
      link.href = target.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.title = original ? '원본 출처 열기 (새 탭)' : '이미지 크게 보기 (새 탭)';
      group.append(link);
      const caption = document.createElement('span');
      caption.className = 'image-credit-caption';
      const source = document.createElement('span');
      source.className = 'image-credit-source';
      source.append('출처: ' + (record && record.source && record.source !== '미등록' ? record.source : '미등록'));
      if (record && record.method) source.append(' · 제작방식: ' + record.method);
      const view = document.createElement('a');
      view.href = target.href;
      view.target = '_blank';
      view.rel = 'noopener noreferrer';
      view.textContent = original ? '원본 보기' : '이미지 크게 보기';
      view.setAttribute('aria-label', view.textContent + ' (새 탭)');
      source.append(original ? ' · ' : ' · 원본 링크 미등록 · ', view);
      const status = document.createElement('span');
      status.className = 'image-credit-status';
      status.append('이용 상태: ');
      const label = document.createElement('strong');
      label.textContent = record && record.status || '확인 필요';
      status.append(label);
      if (record && record.license) status.append(' · ' + record.license);
      if (failed) status.append(' · 관리 자료 일부를 불러오지 못했습니다. 페이지를 새로고침해 주세요.');
      caption.append(source, status);
      group.append(caption);
    });
  }

  window.renderImageCredits = async function () {
    const current = ++revision;
    const route = location.hash;
    loadedRoute = null;
    const results = await Promise.allSettled(registers.map(async file => {
      const response = await fetch(new URL('docs/image/' + file, base), { cache: 'no-store' });
      if (!response.ok) throw new Error('Image register unavailable');
      const text = await response.text();
      if (!text.includes('그림명')) throw new Error('Invalid image register');
      return parseTable(text);
    }));
    if (current !== revision || route !== location.hash) return;
    loadedRoute = route;
    records = new Map();
    failed = results.some(result => result.status === 'rejected');
    results.forEach(result => {
      if (result.status === 'fulfilled') result.value.forEach((value, path) => records.set(path, value));
    });
    // Rebuild existing captions when the register has been fetched again.
    if (observer) observer.disconnect();
    document.querySelectorAll('.markdown-section .image-credit').forEach(group => {
      const img = group.querySelector('img');
      if (img) group.replaceWith(img);
    });
    if (!observer) {
      observer = new MutationObserver(apply);
    }
    apply();
    observer.observe(document.body, { childList: true, subtree: true });
  };
})();
