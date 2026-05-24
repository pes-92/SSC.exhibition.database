(function () {
  function normalizeTag(tag) {
    return String(tag || "")
      .replace(/^#/, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function parseTags(value) {
    return String(value || "")
      .split(/[,|\n]/)
      .map(normalizeTag)
      .filter(Boolean);
  }

  function makeTagButton(tag) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "doc-tag";
    button.dataset.tag = tag;
    button.textContent = `#${tag}`;
    return button;
  }

  function renderDocTags(root) {
    const scope = root || document;
    const containers = scope.querySelectorAll(".doc-tags[data-tags], [data-doc-tags]");

    containers.forEach(container => {
      const rawTags = container.dataset.tags || container.dataset.docTags;
      const tags = parseTags(rawTags);
      if (!tags.length) return;

      container.classList.add("doc-tags");
      container.replaceChildren();
      tags.forEach(tag => container.appendChild(makeTagButton(tag)));
    });
  }

  function getTagItems(tag) {
    const index = window.tagIndex || {};
    return index[normalizeTag(tag)] || [];
  }

  function getTypeLabel(type) {
    if (type === "exhibit") return "전시물";
    if (type === "theory") return "이론";
    if (type === "guide") return "해설";
    return "문서";
  }

  function closeTagPanel() {
    document.querySelectorAll(".tag-result-panel").forEach(panel => panel.remove());
  }

  function makeResultLink(item) {
    const link = document.createElement("a");
    link.className = "tag-result-link";
    link.href = `#${encodeURI(item.path)}`;

    const title = document.createElement("span");
    title.className = "tag-result-title";
    title.textContent = item.title;

    const type = document.createElement("span");
    type.className = "tag-result-type";
    type.textContent = getTypeLabel(item.type);

    link.appendChild(title);
    link.appendChild(type);
    return link;
  }

  function showTagPanel(tag, anchor) {
    closeTagPanel();

    const items = getTagItems(tag);
    const panel = document.createElement("div");
    panel.className = "tag-result-panel";

    const title = document.createElement("div");
    title.className = "tag-result-heading";
    title.textContent = `#${tag}`;
    panel.appendChild(title);

    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "tag-result-empty";
      empty.textContent = "아직 이 태그로 연결된 문서가 없습니다.";
      panel.appendChild(empty);
    } else {
      const list = document.createElement("div");
      list.className = "tag-result-list";
      items.forEach(item => list.appendChild(makeResultLink(item)));
      panel.appendChild(list);
    }

    anchor.insertAdjacentElement("afterend", panel);
  }

  function renderTagBrowser(root) {
    const scope = root || document;
    const browsers = scope.querySelectorAll("[data-tag-browser]");
    const index = window.tagIndex || {};
    const tags = Object.keys(index).sort((a, b) => a.localeCompare(b, "ko"));

    browsers.forEach(browser => {
      browser.classList.add("tag-browser");
      browser.replaceChildren();

      if (!tags.length) {
        const empty = document.createElement("p");
        empty.className = "tag-result-empty";
        empty.textContent = "아직 등록된 태그가 없습니다.";
        browser.appendChild(empty);
        return;
      }

      tags.forEach(tag => browser.appendChild(makeTagButton(tag)));
    });
  }

  function processTags(root) {
    renderDocTags(root);
    renderTagBrowser(root);
  }

  document.addEventListener("click", event => {
    const tagButton = event.target.closest(".doc-tag");
    if (!tagButton) {
      if (!event.target.closest(".tag-result-panel")) closeTagPanel();
      return;
    }

    showTagPanel(tagButton.dataset.tag, tagButton);
    event.preventDefault();
    event.stopPropagation();
  });

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => processTags(), 100);
  });

  window.addEventListener("hashchange", () => {
    setTimeout(() => processTags(), 150);
  });

  window.processTags = processTags;
})();
