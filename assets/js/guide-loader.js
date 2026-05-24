(function () {
  function getFetchUrl(src) {
    return new URL(String(src || "").replace(/^\/+/, ""), document.baseURI).toString();
  }

  function normalizeGuideId(id) {
    return String(id || "").trim();
  }

  function getMarkdownRenderer() {
    if (window.marked && typeof window.marked.parse === "function") {
      return markdown => window.marked.parse(markdown);
    }

    if (typeof window.marked === "function") {
      return markdown => window.marked(markdown);
    }

    return markdown => String(markdown)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\n{2,}/g, "</p><p>")
      .replace(/\n/g, "<br>");
  }

  function extractGuideSection(markdown, guideId) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(markdown, "text/html");
    const escapedId = window.CSS && CSS.escape ? CSS.escape(guideId) : guideId.replace(/"/g, '\\"');
    return doc.querySelector(`[data-guide-id="${escapedId}"], section#${escapedId}, .scenario-section#${escapedId}`);
  }

  function extractGuideTitle(markdown) {
    const match = markdown.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : "";
  }

  function extractGuideOverview(markdown) {
    const lines = markdown.split(/\r?\n/);
    const startIndex = lines.findIndex(line => /^##\s+해설 개요\s*$/.test(line.trim()));
    if (startIndex === -1) return [];

    const overviewLines = [];
    for (let i = startIndex + 1; i < lines.length; i += 1) {
      const line = lines[i].trim();
      if (/^##\s+/.test(line)) break;
      if (/^-\s+/.test(line)) overviewLines.push(line.replace(/^-\s+/, ""));
      if (overviewLines.length >= 2) break;
    }

    return overviewLines;
  }

  function extractGuideMetadata(markdown) {
    const metadata = {};
    const lines = markdown.split(/\r?\n/);
    const startIndex = lines.findIndex(line => /^##\s+해설 개요\s*$/.test(line.trim()));
    if (startIndex === -1) return metadata;

    for (let i = startIndex + 1; i < lines.length; i += 1) {
      const line = lines[i].trim();
      if (/^##\s+/.test(line)) break;

      const match = line.match(/^-\s*([^:：]+)\s*[:：]\s*(.+)$/);
      if (!match) continue;

      metadata[match[1].trim()] = match[2].trim();
    }

    return metadata;
  }

  function makeGuideRoute(src) {
    const cleanSrc = String(src || "")
      .replace(/^\/+/, "")
      .replace(/\.md$/, "");

    return `#/${encodeURI(cleanSrc)}`;
  }

  function rewriteRelativeUrl(value, sourceUrl) {
    if (!value || /^(?:[a-z]+:|#|\/)/i.test(value)) return value;
    return new URL(value, sourceUrl).toString();
  }

  function rewriteRelativeAssets(container, sourceUrl) {
    container.querySelectorAll("img[src]").forEach(img => {
      img.src = rewriteRelativeUrl(img.getAttribute("src"), sourceUrl);
    });

    container.querySelectorAll("a[href]").forEach(link => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#/") || href.startsWith("#")) return;
      link.href = rewriteRelativeUrl(href, sourceUrl);
    });
  }

  function getGuideTitle(section, fallback) {
    return section.dataset.guideTitle ||
      section.getAttribute("aria-label") ||
      fallback ||
      "";
  }

  function renderGuideMeta(markdown) {
    const title = extractGuideTitle(markdown);
    const overview = extractGuideOverview(markdown);
    const meta = document.createElement("div");

    meta.className = "guide-loader-meta";

    if (title) {
      const heading = document.createElement("div");
      heading.className = "guide-loader-main-title";
      heading.textContent = title;
      meta.appendChild(heading);
    }

    if (overview.length) {
      const list = document.createElement("ul");
      list.className = "guide-loader-overview";

      overview.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
      });

      meta.appendChild(list);
    }

    return meta;
  }

  function renderGuideFullLink(src) {
    const actions = document.createElement("div");
    const link = document.createElement("a");

    actions.className = "guide-loader-actions";
    link.className = "guide-loader-full-link";
    link.href = makeGuideRoute(src);
    link.textContent = "해설 전문 보러가기";

    actions.appendChild(link);
    return actions;
  }

  function renderGuideSection(container, markdown, section, sourceUrl) {
    const renderer = getMarkdownRenderer();
    const title = getGuideTitle(section, container.dataset.guideTitle);
    const metadata = extractGuideMetadata(markdown);
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    const summaryTitle = document.createElement("div");
    const summaryMeta = document.createElement("div");
    const body = document.createElement("div");

    details.className = "guide-loader-card";
    summary.className = "guide-loader-summary";
    summaryTitle.className = "guide-loader-summary-title";
    summaryMeta.className = "guide-loader-summary-meta";
    summaryTitle.textContent = title || extractGuideTitle(markdown) || "해설";
    summaryMeta.innerHTML = `
      <span>작성자: ${metadata["작성자"] || "확인 필요"}</span>
      <span>작성일: ${metadata["작성일"] || "확인 필요"}</span>
    `;

    body.className = "guide-loader-body";
    body.innerHTML = renderer(section.innerHTML.trim());
    rewriteRelativeAssets(body, sourceUrl);

    container.classList.add("guide-loader-ready");
    container.replaceChildren();
    summary.appendChild(summaryTitle);
    summary.appendChild(summaryMeta);
    details.appendChild(summary);
    details.appendChild(body);
    details.appendChild(renderGuideFullLink(container.dataset.guideSrc));
    container.appendChild(details);
  }

  function renderGuideError(container, message) {
    container.classList.add("guide-loader-error");
    container.textContent = message;
  }

  async function loadGuideExcerpt(container) {
    const src = container.dataset.guideSrc;
    const guideId = normalizeGuideId(container.dataset.guideId);

    if (!src || !guideId) {
      renderGuideError(container, "해설 파일 또는 전시물 ID가 지정되지 않았습니다.");
      return;
    }

    const sourceUrl = getFetchUrl(src);
    container.classList.add("guide-loader-loading");
    container.textContent = "해설을 불러오는 중...";

    try {
      const response = await fetch(sourceUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const markdown = await response.text();
      const section = extractGuideSection(markdown, guideId);

      if (!section) {
        renderGuideError(container, `${guideId} 해설을 찾을 수 없습니다.`);
        return;
      }

      renderGuideSection(container, markdown, section, sourceUrl);
    } catch (error) {
      renderGuideError(container, "해설을 불러오지 못했습니다.");
    } finally {
      container.classList.remove("guide-loader-loading");
    }
  }

  async function loadGuideExcerpts(root) {
    const scope = root || document;
    const containers = Array.from(scope.querySelectorAll(".guide-loader[data-guide-src][data-guide-id]"))
      .filter(container => container.dataset.guideLoaded !== "true");

    for (const container of containers) {
      container.dataset.guideLoaded = "true";
      await loadGuideExcerpt(container);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => loadGuideExcerpts(), 100);
  });

  window.addEventListener("hashchange", () => {
    setTimeout(() => loadGuideExcerpts(), 150);
  });

  window.loadGuideExcerpts = loadGuideExcerpts;
})();
