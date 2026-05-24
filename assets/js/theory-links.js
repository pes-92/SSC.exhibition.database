(function () {
  const theoryEntries = [
    { title: "Audible frequency", path: "/docs/theory/Audible frequency" },
    { title: "RFID(Radio Frequency IDentification)", path: "/docs/theory/RFID(Radio Frequency IDentification)" },
    { title: "각운동량", path: "/docs/theory/angular_momentum" },
    { title: "뇌의 진화", path: "/docs/theory/brain_evolution" },
    { title: "뇌의 구조와 기능", path: "/docs/theory/brain_structure_and_function" },
    { title: "숫자로 알아보는 버스 정보", path: "/docs/theory/bus_information_by_numbers" },
    { title: "고전역학(미완)", path: "/docs/theory/classical_mechanics_incomplete" },
    { title: "데카르트와 좌표평면", path: "/docs/theory/descartes_and_coordinate_plane" },
    { title: "도플러 효과", path: "/docs/theory/doppler_effect" },
    { title: "대뇌화지수", path: "/docs/theory/encephalization_quotient" },
    { title: "에라토스테네스의 지구 크기 측정", path: "/docs/theory/eratosthenes_earth_size_measurement" },
    { title: "도형의 이동", path: "/docs/theory/geometric_transformation" },
    { title: "도깨비도로", path: "/docs/theory/gravity_hill" },
    { title: "대권항로", path: "/docs/theory/great_circle_route" },
    { title: "길이 단위의 역사", path: "/docs/theory/history_of_length_units" },
    { title: "물체의 색을 보는 원리", path: "/docs/theory/how_we_see_object_colors" },
    { title: "사람의 신경계", path: "/docs/theory/human_nervous_system" },
    { title: "IC 카드(Integrated Circuit Card)", path: "/docs/theory/integrated_circuit_card" },
    { title: "국제단위계(SI)", path: "/docs/theory/international_system_of_units_si" },
    { title: "광원", path: "/docs/theory/light_source" },
    { title: "구분구적법", path: "/docs/theory/method_of_exhaustion" },
    { title: "뉴런", path: "/docs/theory/neuron" },
    { title: "뇌과학", path: "/docs/theory/neuroscience" },
    { title: "뉴턴의 이중프리즘 실험", path: "/docs/theory/newtons_double_prism_experiment" },
    { title: "방사능과 방사선", path: "/docs/theory/radioactivity_and_radiation" },
    { title: "단위 재정의", path: "/docs/theory/redefinition_of_units" },
    { title: "반사", path: "/docs/theory/reflection" },
    { title: "굴절 망원경", path: "/docs/theory/refracting_telescope" },
    { title: "굴절", path: "/docs/theory/refraction" },
    { title: "서울의 지하철 정보", path: "/docs/theory/seoul_subway_information" },
    { title: "SI 기본 단위의 정의", path: "/docs/theory/si_base_unit_definitions" },
    { title: "우주복", path: "/docs/theory/space_suit" },
    { title: "속력과 속도", path: "/docs/theory/speed_and_velocity" },
    { title: "거리와 시간에 따른 속력 계산", path: "/docs/theory/speed_calculation_by_distance_and_time" },
    { title: "기억의 단계", path: "/docs/theory/stages_of_memory" },
    { title: "별(항성)", path: "/docs/theory/star" },
    { title: "공부하는 침팬지", path: "/docs/theory/studying_chimpanzee" },
    { title: "대칭", path: "/docs/theory/symmetry" },
    { title: "시냅스와 신경신호의 전달", path: "/docs/theory/synapse_and_neural_signal_transmission" },
    { title: "소리의 3요소", path: "/docs/theory/three_elements_of_sound" },
    { title: "단위 기호 표기 방법", path: "/docs/theory/unit_symbol_notation" },
    { title: "zzz(미완)", path: "/docs/theory/zzz_incomplete" }
  ];

  function normalizeTheoryTitle(title) {
    return String(title || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const theoryMap = new Map(
    theoryEntries.map(entry => [normalizeTheoryTitle(entry.title), entry])
  );

  function parseTheoryNames(value) {
    return String(value || "")
      .split(/[,|\n]/)
      .map(normalizeTheoryTitle)
      .filter(Boolean);
  }

  function makeTheoryHref(path) {
    return `#${encodeURI(path)}`;
  }

  function renderTheoryButton(title, entry) {
    const link = document.createElement("a");
    link.className = "theory-link-button";
    link.href = makeTheoryHref(entry.path);
    link.textContent = title;
    return link;
  }

  function renderMissingTheory(title) {
    const missing = document.createElement("span");
    missing.className = "theory-link-missing";
    missing.textContent = title;
    missing.title = "연결된 이론 문서를 찾을 수 없습니다.";
    return missing;
  }

  function renderTheoryLinks(root) {
    const scope = root || document;
    const containers = scope.querySelectorAll("[data-theories]");

    containers.forEach(container => {
      const names = parseTheoryNames(container.dataset.theories);
      if (!names.length) return;

      container.classList.add("theory-link-list");
      container.replaceChildren();

      names.forEach(name => {
        const entry = theoryMap.get(name);
        container.appendChild(entry ? renderTheoryButton(name, entry) : renderMissingTheory(name));
      });
    });
  }

  window.theoryLinkEntries = theoryEntries;
  window.renderTheoryLinks = renderTheoryLinks;

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => renderTheoryLinks(), 100);
  });

  window.addEventListener("hashchange", () => {
    setTimeout(() => renderTheoryLinks(), 150);
  });
})();
