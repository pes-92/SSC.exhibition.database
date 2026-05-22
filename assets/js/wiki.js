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
  const searchBox = document.querySelector(".search");
  if (!searchBox) return;

  if (role === "ssc" || role === "admin") {
    searchBox.style.setProperty("display", "block", "important");
  } else {
    searchBox.style.setProperty("display", "none", "important");
  }

  updateHomeSearchVisibility(role);
}

function isSearchAllowed(role) {
  return role === "ssc" || role === "admin";
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

function getSidebarSearchInput() {
  return document.querySelector(".search input");
}

function getSidebarSearchResults() {
  return document.querySelector(".search .results-panel");
}

function syncHomeSearchResults() {
  const homeResults = document.getElementById("homeSearchResults");
  const sidebarResults = getSidebarSearchResults();
  if (!homeResults || !sidebarResults) return;

  homeResults.innerHTML = sidebarResults.innerHTML;
}

function bindHomeSearchResultsObserver() {
  const sidebarResults = getSidebarSearchResults();
  if (!sidebarResults || sidebarResults.dataset.homeSearchObserved === "true") return;

  const observer = new MutationObserver(syncHomeSearchResults);
  observer.observe(sidebarResults, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });

  sidebarResults.dataset.homeSearchObserved = "true";
  syncHomeSearchResults();
}

function bindSidebarSearchInputSync() {
  const sidebarInput = getSidebarSearchInput();
  if (!sidebarInput || sidebarInput.dataset.homeSearchSynced === "true") return;

  sidebarInput.addEventListener("input", syncHomeSearchInputFromSidebar);
  sidebarInput.addEventListener("change", syncHomeSearchInputFromSidebar);
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
  if (!sidebarInput) return;

  sidebarInput.value = value;
  sidebarInput.dispatchEvent(new Event("input", { bubbles: true }));
  sidebarInput.dispatchEvent(new Event("change", { bubbles: true }));
  setTimeout(syncHomeSearchResults, 80);
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

document.addEventListener("click", function (e) {
  document.querySelectorAll(".footnote-popup").forEach(el => el.remove());

  const ref = e.target.closest(".footnote-ref");
  if (!ref) return;

  const noteId = ref.dataset.note;
  const note = document.getElementById(noteId);
  if (!note) return;

  const popup = document.createElement("div");
  popup.className = "footnote-popup";
  popup.innerHTML = note.innerHTML;

  ref.appendChild(popup);
  e.stopPropagation();
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
  }, 100);
});

window.updateAuthUI = updateAuthUI;
window.loadExcerpts = loadExcerpts;
window.goHome = goHome;
window.goHall = goHall;
window.goBack = goBack;
window.goCurrentHall = goCurrentHall;
