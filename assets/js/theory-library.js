(function () {
  const categories = ["전체", "물리", "화학", "생물", "지구과학", "수학", "인물", "미분류"];

  function normalize(value) {
    return String(value || "")
      .replace(/^#/, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLocaleLowerCase("ko");
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

  function getVisibleText(item, role) {
    const segments = (item.segments || [])
      .filter(segment => canRoleSee(segment.role, role))
      .map(segment => segment.text);
    const tags = (item.tags || [])
      .filter(tag => canRoleSee(tag.role, role))
      .map(tag => tag.tag);

    return {
      text: [item.title, ...segments, ...tags].join(" "),
      tags
    };
  }

  function getCategories(item) {
    const values = Array.isArray(item.categories) ? item.categories : [];
    const valid = values.filter(category => categories.includes(category) && category !== "전체");
    return valid.length ? valid : ["미분류"];
  }

  function getTheoryItems(role, category, rawQuery) {
    const query = normalize(rawQuery);
    const isTagSearch = String(rawQuery || "").trim().startsWith("#");

    return (window.searchIndex || [])
      .filter(item => item.type === "theory")
      .filter(item => item.path !== "#/docs/theory/list")
      .filter(item => category === "전체" || getCategories(item).includes(category))
      .filter(item => {
        if (!query) return true;

        const visible = getVisibleText(item, role);
        if (isTagSearch) {
          return visible.tags.some(tag => normalize(tag) === query);
        }
        return normalize(visible.text).includes(query);
      })
      .sort((a, b) => a.title.localeCompare(b.title, "ko"));
  }

  function createCategoryLabel(item) {
    const label = document.createElement("span");
    label.className = "theory-list-categories";
    label.textContent = getCategories(item).join(" · ");
    return label;
  }

  function renderTheoryLibrary() {
    const library = document.getElementById("theoryLibrary");
    if (!library) return;

    const input = document.getElementById("theorySearchInput");
    const status = document.getElementById("theoryLibraryStatus");
    const results = document.getElementById("theoryLibraryResults");
    const tabs = Array.from(library.querySelectorAll(".theory-category-tab"));
    if (!input || !status || !results || !tabs.length) return;

    let activeCategory = library.dataset.activeCategory || "전체";
    if (!categories.includes(activeCategory)) activeCategory = "전체";

    const draw = () => {
      const role = sessionStorage.getItem("role") || "none";
      const items = getTheoryItems(role, activeCategory, input.value);

      tabs.forEach(tab => {
        const active = tab.dataset.category === activeCategory;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-pressed", String(active));
      });

      const query = input.value.trim();
      status.textContent = query
        ? `${activeCategory} 검색 결과 ${items.length}개`
        : `${activeCategory} 이론 문서 ${items.length}개`;

      results.replaceChildren();
      if (!items.length) {
        const empty = document.createElement("p");
        empty.className = "theory-library-empty";
        empty.textContent = "조건에 맞는 이론 문서가 없습니다.";
        results.appendChild(empty);
        return;
      }

      const list = document.createElement("ul");
      list.className = "theory-document-list";

      items.forEach(item => {
        const row = document.createElement("li");
        const link = document.createElement("a");

        link.href = item.path;
        link.dataset.route = item.path;
        link.textContent = item.title;
        row.appendChild(link);
        row.appendChild(createCategoryLabel(item));
        list.appendChild(row);
      });

      results.appendChild(list);
    };

    if (library.dataset.bound !== "true") {
      input.addEventListener("input", draw);
      tabs.forEach(tab => {
        tab.addEventListener("click", () => {
          activeCategory = tab.dataset.category || "전체";
          library.dataset.activeCategory = activeCategory;
          draw();
        });
      });
      library.dataset.bound = "true";
    }

    draw();
  }

  window.renderTheoryLibrary = renderTheoryLibrary;
})();
