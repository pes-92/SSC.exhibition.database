window.$docsify = {
  name: "SeoulScienceCenter Wiki",
  homepage: "README.md",
  loadSidebar: "sidebar.md",
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
          if (window.loadGuideExcerpts) {
            await window.loadGuideExcerpts();
          }
          if (window.processFootnotes) {
            window.processFootnotes();
          }
          if (window.renderTheoryLinks) {
            window.renderTheoryLinks();
          }
          if (window.processTags) {
            window.processTags();
          }
          if (window.MathJax && window.MathJax.typesetPromise) {
            await window.MathJax.typesetPromise();
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
