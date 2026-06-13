window.$docsify = {
  name: "SeoulScienceCenter Wiki",
  homepage: "README.md",
  loadSidebar: "_sidebar.md",
  auto2top: true,
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
          if (window.scrollToPendingCurriculumTarget) {
            window.scrollToPendingCurriculumTarget();
          }
          if (window.renderTheoryLinks) {
            window.renderTheoryLinks();
          }
          if (window.renderTheoryLibrary) {
            window.renderTheoryLibrary();
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
