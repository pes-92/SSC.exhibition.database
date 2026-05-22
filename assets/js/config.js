window.$docsify = {
  name: "SeoulScienceCenter Wiki",
  homepage: "README.md",
  loadSidebar: "_sidebar.md",
  auto2top: true,
  search: {
    placeholder: "검색",
    noData: "검색 결과 없음",
    depth: 3
  },
  plugins: [
    function (hook) {
      hook.doneEach(function () {
        setTimeout(async () => {
          if (window.updateAuthUI) {
            await window.updateAuthUI();
          }
          if (window.loadExcerpts) {
            await window.loadExcerpts();
          }
        }, 200);
      });
    }
  ]
};

window.MathJax = {
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"]]
  }
};
