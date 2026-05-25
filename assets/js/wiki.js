// 1. 계정 정보
// 비밀번호 해시는 현재 값 그대로 유지
const accounts = {
  admin: {
    role: "admin",
    passwordHash: "cf57c4cba557fdbed571882d31531b47526060d35411369cca94668e7f47fe87"
  },
  ssc: {
    role: "ssc",
    passwordHash: "4225466f46976e5877d0c8f7a77eafbf97a92841dedabae705816fa4c76e033f"
  },
  junior: {
    role: "junior",
    passwordHash: "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4"
  }
};

const roleSecrets = {
  admin: "A1x9-admin-key",
  ssc: "B7k2-ssc-key",
  junior: "C3m8-junior-key"
};

// 전시실 개요 파일명 매핑
const hallIndexMap = {
  blue: "B-hall",
  orange: "O-hall",
  green: "G-hall"
};

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function makeRoleToken(role, loginId) {
  return await sha256(`${loginId}|${role}|${roleSecrets[role]}`);
}

async function saveSession(loginId, role) {
  const token = await makeRoleToken(role, loginId);
  sessionStorage.setItem("loginId", loginId);
  sessionStorage.setItem("role", role);
  sessionStorage.setItem("roleToken", token);
}

async function verifySession() {
  const loginId = sessionStorage.getItem("loginId");
  const role = sessionStorage.getItem("role");
  const roleToken = sessionStorage.getItem("roleToken");

  if (!loginId || !role || !roleToken) return false;
  if (!roleSecrets[role]) return false;

  const expected = await makeRoleToken(role, loginId);
  return expected === roleToken;
}

function clearSession() {
  sessionStorage.removeItem("loginId");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("roleToken");
}

function getRoleLabel(role) {
  if (role === "admin") return "관리자";
  if (role === "ssc") return "해설사";
  if (role === "junior") return "자원봉사자";
  return "로그아웃";
}

async function loginUser(loginId, password) {
  const account = accounts[loginId];
  if (!account) return false;

  const inputHash = await sha256(password);
  if (inputHash !== account.passwordHash) return false;

  await saveSession(loginId, account.role);
  return true;
}

function applyContentByRole(role) {
  document.querySelectorAll(".logged-out-only").forEach(el => {
    el.style.display = (!role || role === "none") ? "block" : "none";
  });

  document.querySelectorAll(".volunteer").forEach(el => {
    el.style.display = (role === "junior" || role === "ssc" || role === "admin") ? "block" : "none";
  });

  document.querySelectorAll(".ssc-only").forEach(el => {
    el.style.display = (role === "ssc" || role === "admin") ? "block" : "none";
  });

  document.querySelectorAll(".admin-only").forEach(el => {
    el.style.display = (role === "admin") ? "block" : "none";
  });
}

function applyMenuByRole(role) {
  const links = document.querySelectorAll(".sidebar a");

  links.forEach(link => {
    const href = link.getAttribute("href");
    const item = link.parentElement;
    if (!href || !item) return;

    item.style.display = "";

    if (href.includes("admin/") && role !== "admin") {
      item.style.display = "none";
    }

    if (href.includes("ssc/") && !(role === "ssc" || role === "admin")) {
      item.style.display = "none";
    }
  });
}

function protectPage(role) {
  const isLoggedOut = !role || role === "none";

  const isHome = isHomePath();

  if (isLoggedOut && !isHome) {
    alert("로그인이 필요합니다.");
    location.href = "#/";
  }

  /*
  if (path.includes("/admin/") && role !== "admin") {
    alert("관리자만 접근할 수 있습니다.");
    location.href = "#/";
    return;
  }

  if (path.includes("/ssc/") && !(role === "ssc" || role === "admin")) {
    alert("SSC 전용 자료입니다.");
    location.href = "#/";
    return;
  }
  */
}

function toggleSearchByRole(role) {
  const searchBox = ensureSidebarSearch();
  if (!searchBox) return;

  if (role === "ssc" || role === "admin") {
    searchBox.style.setProperty("display", "block", "important");
  } else {
    searchBox.style.setProperty("display", "none", "important");
  }

  updateHomeSearchVisibility(role);
}

function isSearchAllowed(role) {
  return role === "junior" || role === "ssc" || role === "admin";
}

function isHomePath() {
  const path = location.hash || "#/";
  return (
    path === "#/" ||
    path === "#" ||
    path === "" ||
    path === "#/README" ||
    path === "#/README.md"
  );
}

function ensureSidebarSearch() {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return null;

  let searchBox = sidebar.querySelector(".search");
  if (searchBox) return searchBox;

  searchBox = document.createElement("div");
  searchBox.className = "search custom-search";
  searchBox.innerHTML = `
    <input type="search" placeholder="검색" autocomplete="off">
    <div class="results-panel"></div>
  `;

  const nav = sidebar.querySelector(".sidebar-nav");
  if (nav) {
    sidebar.insertBefore(searchBox, nav);
  } else {
    sidebar.appendChild(searchBox);
  }

  return searchBox;
}

function getSidebarSearchInput() {
  ensureSidebarSearch();
  return document.querySelector(".search input");
}

function getSidebarSearchResults() {
  ensureSidebarSearch();
  const searchBox = document.querySelector(".search");
  if (!searchBox) return null;

  let results = searchBox.querySelector(".results-panel");
  if (!results) {
    results = document.createElement("div");
    results.className = "results-panel";
    searchBox.appendChild(results);
  }

  return results;
}

function getSearchRole() {
  return sessionStorage.getItem("role") || "none";
}

function getRoleLevel(role) {
  if (role === "admin") return 3;
  if (role === "ssc") return 2;
  if (role === "junior" || role === "volunteer") return 1;
  if (role === "public") return 0;
  return -1;
}

function canRoleSee(requiredRole, currentRole) {
  return getRoleLevel(currentRole) >= getRoleLevel(requiredRole || "public");
}

function normalizeSearchText(value) {
  return String(value || "")
    .replace(/^#/, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("ko");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getTypeLabel(type) {
  if (type === "exhibit") return "전시물";
  if (type === "theory") return "이론";
  if (type === "guide") return "해설";
  if (type === "curriculum") return "교육과정";
  return "문서";
}

function getVisibleSegments(item, role) {
  return (item.segments || []).filter(segment => canRoleSee(segment.role, role));
}

function getVisibleTags(item, role) {
  return (item.tags || []).filter(tag => canRoleSee(tag.role, role));
}

function makeSearchSnippet(item, query, role) {
  const normalizedQuery = normalizeSearchText(query);
  const segments = getVisibleSegments(item, role);
  const match = segments.find(segment => normalizeSearchText(segment.text).includes(normalizedQuery));
  const source = match ? match.text : (segments[0] && segments[0].text) || "";
  if (!source) return "";

  const sourceLower = source.toLocaleLowerCase("ko");
  const index = sourceLower.indexOf(normalizedQuery);
  const start = Math.max(0, index - 45);
  const end = Math.min(source.length, (index < 0 ? 0 : index) + normalizedQuery.length + 75);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < source.length ? "..." : "";

  return `${prefix}${source.slice(start, end)}${suffix}`;
}

function searchIndexItems(rawQuery, role) {
  const index = window.searchIndex || [];
  const query = normalizeSearchText(rawQuery);
  if (!query) return [];

  const isTagSearch = String(rawQuery || "").trim().startsWith("#");

  return index
    .map(item => {
      const visibleSegments = getVisibleSegments(item, role);
      const visibleTags = getVisibleTags(item, role);
      const visibleText = [
        item.title,
        item.path,
        ...visibleSegments.map(segment => segment.text),
        ...visibleTags.map(tag => tag.tag)
      ].join(" ");
      const normalizedText = normalizeSearchText(visibleText);
      const tagMatched = visibleTags.some(tag => normalizeSearchText(tag.tag) === query);
      const textMatched = normalizedText.includes(query);

      if (isTagSearch ? !tagMatched : !textMatched) return null;

      return {
        item,
        score: (tagMatched ? 100 : 0) +
          (normalizeSearchText(item.title).includes(query) ? 20 : 0) +
          (normalizeSearchText(item.path).includes(query) ? 5 : 0),
        snippet: isTagSearch ? `#${query} 태그가 달린 문서입니다.` : makeSearchSnippet(item, query, role)
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.item.title.localeCompare(b.item.title, "ko");
    })
    .slice(0, 80);
}

function renderSearchResults(container, rawQuery, role) {
  if (!container) return;

  const query = String(rawQuery || "").trim();
  container.replaceChildren();
  if (!query) return;

  const results = searchIndexItems(query, role);
  if (!results.length) {
    const empty = document.createElement("p");
    empty.textContent = "검색 결과 없음";
    container.appendChild(empty);
    return;
  }

  results.forEach(({ item, snippet }) => {
    const post = document.createElement("div");
    post.className = "matching-post";

    const link = document.createElement("a");
    link.href = item.path;
    link.dataset.route = item.path;
    link.innerHTML = `${escapeHtml(item.title)} <span class="search-result-type">${escapeHtml(getTypeLabel(item.type))}</span>`;

    const detail = document.createElement("p");
    detail.textContent = snippet || item.path;

    post.appendChild(link);
    post.appendChild(detail);
    container.appendChild(post);
  });
}

function renderSearchEverywhere(value) {
  const role = getSearchRole();
  renderSearchResults(getSidebarSearchResults(), value, role);
  renderSearchResults(document.getElementById("homeSearchResults"), value, role);
}

function syncHomeSearchResults() {
  const homeResults = document.getElementById("homeSearchResults");
  const sidebarResults = getSidebarSearchResults();
  if (!homeResults || !sidebarResults) return;

  homeResults.innerHTML = sidebarResults.innerHTML;
}

function bindHomeSearchResultsObserver() {
  renderSearchEverywhere((getSidebarSearchInput() && getSidebarSearchInput().value) || "");
}

function bindSidebarSearchInputSync() {
  const sidebarInput = getSidebarSearchInput();
  if (!sidebarInput || sidebarInput.dataset.homeSearchSynced === "true") return;

  sidebarInput.addEventListener("input", () => {
    syncHomeSearchInputFromSidebar();
    setTimeout(() => renderSearchEverywhere(sidebarInput.value), 0);
    setTimeout(() => renderSearchEverywhere(sidebarInput.value), 80);
  });
  sidebarInput.addEventListener("change", () => {
    syncHomeSearchInputFromSidebar();
    renderSearchEverywhere(sidebarInput.value);
  });
  sidebarInput.dataset.homeSearchSynced = "true";
}

function syncHomeSearchInputFromSidebar() {
  const homeInput = document.getElementById("homeSearchInput");
  const sidebarInput = getSidebarSearchInput();
  if (!homeInput || !sidebarInput) return;

  if (homeInput.value !== sidebarInput.value) {
    homeInput.value = sidebarInput.value;
  }
}

function runDocsifySearchFromHome(value) {
  const sidebarInput = getSidebarSearchInput();

  if (sidebarInput && sidebarInput.value !== value) {
    sidebarInput.value = value;
  }

  renderSearchEverywhere(value);
  setTimeout(() => renderSearchEverywhere(value), 80);
}

function ensureHomeSearch() {
  const content = document.querySelector(".markdown-section");
  if (!content) return;

  let homeSearch = document.getElementById("homeSearch");

  if (!homeSearch) {
    homeSearch = document.createElement("section");
    homeSearch.id = "homeSearch";
    homeSearch.className = "home-search";
    homeSearch.innerHTML = `
      <label class="home-search-label" for="homeSearchInput">전시물 검색</label>
      <input id="homeSearchInput" class="home-search-input" type="search" placeholder="검색어를 입력하세요" autocomplete="off">
      <div id="homeSearchResults" class="home-search-results"></div>
    `;

    content.insertBefore(homeSearch, content.firstChild);

    const homeInput = document.getElementById("homeSearchInput");
    if (homeInput) {
      homeInput.addEventListener("input", () => {
        runDocsifySearchFromHome(homeInput.value);
      });
    }
  }

  bindHomeSearchResultsObserver();
  bindSidebarSearchInputSync();
  syncHomeSearchInputFromSidebar();
  syncHomeSearchResults();
}

function updateHomeSearchVisibility(role) {
  const isHome = isHomePath();
  const homeSearch = document.getElementById("homeSearch");

  if (!isHome) {
    if (homeSearch) homeSearch.classList.add("hidden");
    return;
  }

  ensureHomeSearch();

  const ensuredHomeSearch = document.getElementById("homeSearch");
  if (!ensuredHomeSearch) return;

  const shouldShow = isSearchAllowed(role);
  ensuredHomeSearch.classList.toggle("hidden", !shouldShow);

  if (shouldShow) {
    bindHomeSearchResultsObserver();
    bindSidebarSearchInputSync();
    syncHomeSearchInputFromSidebar();
    syncHomeSearchResults();
  }
}

async function updateAuthUI() {
  const authStatus = document.getElementById("authStatus");
  const loginForm = document.getElementById("loginForm");
  const userActions = document.getElementById("userActions");

  if (!authStatus || !loginForm || !userActions) return;

  const valid = await verifySession();

  if (!valid) {
    clearSession();
    authStatus.textContent = "로그아웃 상태";
    loginForm.classList.remove("hidden");
    userActions.classList.add("hidden");

    applyContentByRole("none");
    applyMenuByRole("none");
    protectPage("none");
    toggleSearchByRole("none");
    return;
  }

  const role = sessionStorage.getItem("role");
  authStatus.textContent = `로그인: ${getRoleLabel(role)}`;
  loginForm.classList.add("hidden");
  userActions.classList.remove("hidden");

  applyContentByRole(role);
  applyMenuByRole(role);
  toggleSearchByRole(role);
  protectPage(role);
}

function goHome() {
  location.hash = "#/";
}

function goHall(hall) {
  const page = hallIndexMap[hall];
  if (!page) return;
  location.hash = `#/docs/halls/${hall}/${page}`;
}

function goBack() {
  history.back();
}

function goCurrentHall() {
  const match = location.hash.match(/docs\/halls\/([^/]+)/);
  if (!match) return;

  const hall = match[1];
  const page = hallIndexMap[hall];
  if (!page) return;

  location.hash = `#/docs/halls/${hall}/${page}`;
}

async function loadExcerpts() {
  const excerpts = document.querySelectorAll(".excerpt-md");

  for (const el of excerpts) {
    const src = el.dataset.src;
    const sectionId = el.dataset.section;

    try {
      const res = await fetch(src);
      const text = await res.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");
      const section = doc.querySelector(`#${sectionId}`);

      if (section) {
        el.innerHTML = section.innerHTML;
      } else {
        el.innerHTML = "섹션을 찾을 수 없습니다.";
      }
    } catch (e) {
      el.innerHTML = "불러오기 실패";
    }
  }
}

function footnoteId(label) {
  return `fn-${String(label).replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function footnoteRefId(label, index) {
  return `fnref-${String(label).replace(/[^a-zA-Z0-9_-]/g, "-")}-${index}`;
}

function isFootnoteDefinition(el) {
  return /^\s*\[\^[^\]]+\]:/.test(el.textContent || "");
}

function collectFootnoteDefinitions(content) {
  const definitions = new Map();
  const blocks = Array.from(content.querySelectorAll("p, li"));

  blocks.forEach(block => {
    if (!isFootnoteDefinition(block)) return;

    const match = block.textContent.match(/^\s*\[\^([^\]]+)\]:/);
    if (!match) return;

    const label = match[1];
    const html = block.innerHTML.replace(/^\s*\[\^[^\]]+\]:\s*/, "");
    definitions.set(label, html);
    block.remove();
  });

  return definitions;
}

function replaceFootnoteReferences(content, definitions) {
  const counts = new Map();
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (!node.nodeValue.includes("[^")) return NodeFilter.FILTER_REJECT;
      if (parent.closest("code, pre, script, style, .footnotes, .footnote-popup")) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    const text = node.nodeValue;
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    const pattern = /\[\^([^\]]+)\]/g;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      const label = match[1];

      fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));

      if (!definitions.has(label)) {
        fragment.appendChild(document.createTextNode(match[0]));
      } else {
        const index = (counts.get(label) || 0) + 1;
        counts.set(label, index);

        const refId = footnoteRefId(label, index);
        const noteId = footnoteId(label);
        const sup = document.createElement("sup");
        const link = document.createElement("a");

        sup.id = refId;
        link.href = `#${noteId}`;
        link.className = "footnote-ref";
        link.dataset.note = noteId;
        link.dataset.ref = refId;
        link.textContent = label;
        link.setAttribute("aria-label", `각주 ${label}`);

        sup.appendChild(link);
        fragment.appendChild(sup);
      }

      lastIndex = pattern.lastIndex;
    }

    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    node.replaceWith(fragment);
  });

  return counts;
}

function renderFootnoteList(content, definitions, counts) {
  if (!definitions.size) return;

  const section = document.createElement("section");
  section.className = "footnotes";
  section.setAttribute("aria-label", "각주 및 출처");

  const title = document.createElement("h2");
  title.textContent = "각주 및 출처";
  section.appendChild(title);

  const list = document.createElement("ol");

  definitions.forEach((html, label) => {
    const item = document.createElement("li");
    const noteId = footnoteId(label);
    const count = counts.get(label) || 0;

    item.id = noteId;
    item.className = "footnote-item";
    item.dataset.firstRef = count ? footnoteRefId(label, 1) : "";
    item.innerHTML = `<span class="footnote-label">[${label}]</span> ${html}`;

    for (let i = 1; i <= count; i += 1) {
      const back = document.createElement("a");
      back.href = `#${footnoteRefId(label, i)}`;
      back.className = "footnote-backref";
      back.textContent = "↩";
      back.setAttribute("aria-label", `본문의 각주 ${label} 위치로 이동`);
      item.appendChild(document.createTextNode(" "));
      item.appendChild(back);
    }

    list.appendChild(item);
  });

  section.appendChild(list);
  content.appendChild(section);
}

function processFootnotes() {
  const content = document.querySelector(".markdown-section");
  if (!content) return;

  const definitions = collectFootnoteDefinitions(content);
  if (!definitions.size) return;

  const counts = replaceFootnoteReferences(content, definitions);
  renderFootnoteList(content, definitions, counts);
}

function closeFootnotePopups() {
  document.querySelectorAll(".footnote-popup").forEach(el => el.remove());
}

function showFootnotePopup(ref) {
  const noteId = ref.dataset.note;
  const note = document.getElementById(noteId);
  if (!note) return;

  const popup = document.createElement("div");
  popup.className = "footnote-popup";
  popup.innerHTML = note.innerHTML;

  const jump = document.createElement("a");
  jump.href = `#${noteId}`;
  jump.className = "footnote-popup-jump";
  jump.textContent = "출처로 이동";
  popup.appendChild(jump);

  ref.appendChild(popup);
}

function scrollToFootnoteTarget(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.scrollIntoView({ behavior: "smooth", block: "center" });
}

function getDocsifyRouteFromMdHref(href) {
  if (!href || href.startsWith("#") || /^[a-z]+:/i.test(href)) return null;

  const cleanHref = href.split("#")[0].split("?")[0].replace(/^\.\//, "").replace(/^\//, "");
  if (!cleanHref.endsWith(".md")) return null;

  return `#/${cleanHref.replace(/\.md$/, "")}`;
}

function routeSidebarMdLink(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;

  const link = e.target.closest("a[data-route], .sidebar a");
  if (!link) return false;

  const route = link.dataset.route || getDocsifyRouteFromMdHref(link.getAttribute("href"));
  if (!route) return false;

  e.preventDefault();
  location.hash = route;
  return true;
}

document.addEventListener("click", routeSidebarMdLink, true);

document.addEventListener("click", function (e) {
  const jump = e.target.closest(".footnote-popup-jump, .footnote-backref");
  if (jump) {
    const targetId = jump.getAttribute("href").replace(/^#/, "");
    closeFootnotePopups();
    scrollToFootnoteTarget(targetId);
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  if (e.target.closest(".footnote-popup")) return;

  const ref = e.target.closest(".footnote-ref");
  if (ref) {
    closeFootnotePopups();
    showFootnotePopup(ref);
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  closeFootnotePopups();

  const item = e.target.closest(".footnote-item");
  if (!item || e.target.closest("a")) return;

  const firstRef = item.dataset.firstRef;
  if (firstRef) scrollToFootnoteTarget(firstRef);
});

document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const loginId = document.getElementById("loginId").value.trim();
      const password = document.getElementById("password").value;
      const ok = await loginUser(loginId, password);

      if (!ok) {
        alert("ID 또는 비밀번호를 확인해주세요.");
        return;
      }

      await updateAuthUI();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      clearSession();
      await updateAuthUI();
    });
  }

  updateAuthUI();
});

window.addEventListener("load", async () => {
  await updateAuthUI();
});

window.addEventListener("hashchange", async () => {
  setTimeout(async () => {
    await updateAuthUI();
    await loadExcerpts();
    processFootnotes();
  }, 100);
});

window.updateAuthUI = updateAuthUI;
window.loadExcerpts = loadExcerpts;
window.processFootnotes = processFootnotes;
window.goHome = goHome;
window.goHall = goHall;
window.goBack = goBack;
window.goCurrentHall = goCurrentHall;
