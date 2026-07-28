(function () {
  const theoryEntries = [
    {
        "title": "COVID-19와 인류세",
        "path": "/docs/theory/covid19_and_anthropocene"
    },
    {
        "title": "DNA 지문검사 단계",
        "path": "/docs/theory/dna_fingerprint_testing_process"
    },
    {
        "title": "IC 카드(Integrated Circuit Card)",
        "path": "/docs/theory/integrated_circuit_card"
    },
    {
        "title": "RFID(Radio Frequency IDentification)",
        "path": "/docs/theory/RFID(Radio Frequency IDentification)"
    },
    {
        "title": "SI 기본 단위의 정의",
        "path": "/docs/theory/si_base_unit_definitions"
    },
    {
        "title": "가뭄",
        "path": "/docs/theory/drought"
    },
    {
        "title": "가수분해",
        "path": "/docs/theory/hydrolysis"
    },
    {
        "title": "가청주파수",
        "path": "/docs/theory/Audible frequency"
    },
    {
        "title": "각운동량",
        "path": "/docs/theory/angular_momentum"
    },
    {
        "title": "간상세포와 원추세포",
        "path": "/docs/theory/rod_and_cone_cells"
    },
    {
        "title": "갈릴레오 갈릴레이",
        "path": "/docs/theory/galileo_galilei"
    },
    {
        "title": "감수분열",
        "path": "/docs/theory/meiosis"
    },
    {
        "title": "거리와 시간에 따른 속력 계산",
        "path": "/docs/theory/speed_calculation_by_distance_and_time"
    },
    {
        "title": "건축에서 사용되는 수학적 개념",
        "path": "/docs/theory/mathematical_concepts_in_architecture"
    },
    {
        "title": "고전역학(미완)",
        "path": "/docs/theory/classical_mechanics_incomplete"
    },
    {
        "title": "공부하는 침팬지",
        "path": "/docs/theory/studying_chimpanzee"
    },
    {
        "title": "관성",
        "path": "/docs/theory/inertia"
    },
    {
        "title": "관성의 법칙",
        "path": "/docs/theory/law_of_inertia"
    },
    {
        "title": "광물 자원",
        "path": "/docs/theory/mineral_resources"
    },
    {
        "title": "광물 종류",
        "path": "/docs/theory/types_of_minerals"
    },
    {
        "title": "광원",
        "path": "/docs/theory/light_source"
    },
    {
        "title": "구분구적법",
        "path": "/docs/theory/method_of_exhaustion"
    },
    {
        "title": "국내 지진 규모별 순위",
        "path": "/docs/theory/domestic_earthquake_magnitude_ranking"
    },
    {
        "title": "국제단위계(SI)",
        "path": "/docs/theory/international_system_of_units_si"
    },
    {
        "title": "굴절",
        "path": "/docs/theory/refraction"
    },
    {
        "title": "굴절 망원경",
        "path": "/docs/theory/refracting_telescope"
    },
    {
        "title": "굴절의 법칙",
        "path": "/docs/theory/law_of_refraction"
    },
    {
        "title": "귀의 구조와 기능",
        "path": "/docs/theory/structure_and_function_of_ear"
    },
    {
        "title": "규모",
        "path": "/docs/theory/magnitude"
    },
    {
        "title": "기관계",
        "path": "/docs/theory/organ_systems"
    },
    {
        "title": "기름유출",
        "path": "/docs/theory/oil_spill"
    },
    {
        "title": "기억의 단계",
        "path": "/docs/theory/stages_of_memory"
    },
    {
        "title": "기체 스펙트럼",
        "path": "/docs/theory/gas_spectrum"
    },
    {
        "title": "길이 단위의 역사",
        "path": "/docs/theory/history_of_length_units"
    },
    {
        "title": "뇌과학",
        "path": "/docs/theory/neuroscience"
    },
    {
        "title": "뇌의 구조와 기능",
        "path": "/docs/theory/brain_structure_and_function"
    },
    {
        "title": "뇌의 진화",
        "path": "/docs/theory/brain_evolution"
    },
    {
        "title": "눈의 구조와 기능",
        "path": "/docs/theory/structure_and_function_of_eye"
    },
    {
        "title": "뉴런",
        "path": "/docs/theory/neuron"
    },
    {
        "title": "뉴턴의 이중프리즘 실험",
        "path": "/docs/theory/newtons_double_prism_experiment"
    },
    {
        "title": "다리구조의 힘의 분산 원리",
        "path": "/docs/theory/force_distribution_in_bridge_structures"
    },
    {
        "title": "다양한 동공모양",
        "path": "/docs/theory/various_pupil_shapes"
    },
    {
        "title": "단위 기호 표기 방법",
        "path": "/docs/theory/unit_symbol_notation"
    },
    {
        "title": "단위 재정의",
        "path": "/docs/theory/redefinition_of_units"
    },
    {
        "title": "대권항로",
        "path": "/docs/theory/great_circle_route"
    },
    {
        "title": "대뇌겉질",
        "path": "/docs/theory/cerebral_cortex"
    },
    {
        "title": "대뇌화지수",
        "path": "/docs/theory/encephalization_quotient"
    },
    {
        "title": "대멸종",
        "path": "/docs/theory/mass_extinction"
    },
    {
        "title": "대칭",
        "path": "/docs/theory/symmetry"
    },
    {
        "title": "데카르트와 좌표평면",
        "path": "/docs/theory/descartes_and_coordinate_plane"
    },
    {
        "title": "도깨비도로",
        "path": "/docs/theory/gravity_hill"
    },
    {
        "title": "도시 및 교통설계 전문가",
        "path": "/docs/theory/urban_and_transportation_planning_expert"
    },
    {
        "title": "도시구조 변화의 시대적 배경",
        "path": "/docs/theory/historical_background_of_urban_structure_change"
    },
    {
        "title": "도체",
        "path": "/docs/theory/conductor"
    },
    {
        "title": "도플러 효과",
        "path": "/docs/theory/doppler_effect"
    },
    {
        "title": "도형의 이동",
        "path": "/docs/theory/geometric_transformation"
    },
    {
        "title": "동공반사",
        "path": "/docs/theory/pupillary_reflex"
    },
    {
        "title": "동력전달장치(전동용 기계요소)",
        "path": "/docs/theory/power_transmission_device"
    },
    {
        "title": "라이덴병",
        "path": "/docs/theory/leyden_jar"
    },
    {
        "title": "람사르 협약",
        "path": "/docs/theory/ramsar_convention"
    },
    {
        "title": "로드킬",
        "path": "/docs/theory/roadkill"
    },
    {
        "title": "로드킬 대책",
        "path": "/docs/theory/roadkill_prevention"
    },
    {
        "title": "매립 가스",
        "path": "/docs/theory/landfill_gas"
    },
    {
        "title": "멘델의 유전법칙",
        "path": "/docs/theory/mendels_laws_of_inheritance"
    },
    {
        "title": "멜라닌 색소",
        "path": "/docs/theory/melanin_pigment"
    },
    {
        "title": "면역",
        "path": "/docs/theory/immunity"
    },
    {
        "title": "내진설계",
        "path": "/docs/theory/base_isolation_structure"
    },
    {
        "title": "모즐리",
        "path": "/docs/theory/moseley"
    },
    {
        "title": "물의 전기분해",
        "path": "/docs/theory/electrolysis_of_water"
    },
    {
        "title": "물질의 상태변화",
        "path": "/docs/theory/changes_of_state_of_matter"
    },
    {
        "title": "물체의 색을 보는 원리",
        "path": "/docs/theory/how_we_see_object_colors"
    },
    {
        "title": "물체의 운동과 마찰",
        "path": "/docs/theory/motion_and_friction_of_objects"
    },
    {
        "title": "미생물",
        "path": "/docs/theory/microorganisms"
    },
    {
        "title": "미세먼지 입자의 구성요소",
        "path": "/docs/theory/components_of_particulate_matter"
    },
    {
        "title": "미세먼지가 건강에 미치는 영향",
        "path": "/docs/theory/health_effects_of_particulate_matter"
    },
    {
        "title": "미세먼지와 초미세먼지",
        "path": "/docs/theory/particulate_and_ultrafine_dust"
    },
    {
        "title": "바다쓰레기",
        "path": "/docs/theory/marine_debris"
    },
    {
        "title": "바이러스와 준바이러스성 병원체",
        "path": "/docs/theory/viruses_and_subviral_pathogens"
    },
    {
        "title": "반도체",
        "path": "/docs/theory/semiconductor"
    },
    {
        "title": "반사",
        "path": "/docs/theory/reflection"
    },
    {
        "title": "발전기의 원리",
        "path": "/docs/theory/principle_of_generator"
    },
    {
        "title": "밤섬",
        "path": "/docs/theory/bamseom"
    },
    {
        "title": "방사능과 방사선",
        "path": "/docs/theory/radioactivity_and_radiation"
    },
    {
        "title": "방사능의 단위",
        "path": "/docs/theory/radioactivity_units"
    },
    {
        "title": "방사선의 영향",
        "path": "/docs/theory/effects_of_radiation"
    },
    {
        "title": "방사선의 활용",
        "path": "/docs/theory/uses_of_radiation"
    },
    {
        "title": "방전",
        "path": "/docs/theory/electric_discharge"
    },
    {
        "title": "베르누이 정리",
        "path": "/docs/theory/bernoulli_theorem"
    },
    {
        "title": "별(항성)",
        "path": "/docs/theory/star"
    },
    {
        "title": "보색 및 보색잔상효과",
        "path": "/docs/theory/complementary_colors_and_afterimage"
    },
    {
        "title": "볼록렌즈와 오목렌즈",
        "path": "/docs/theory/convex_and_concave_lenses"
    },
    {
        "title": "부도체",
        "path": "/docs/theory/insulator"
    },
    {
        "title": "북한산개구리",
        "path": "/docs/theory/bukhansan_frogs"
    },
    {
        "title": "북한산에 사는 동식물",
        "path": "/docs/theory/animals_and_plants_of_bukhansan"
    },
    {
        "title": "분자",
        "path": "/docs/theory/molecule"
    },
    {
        "title": "빌딩풍의 영향",
        "path": "/docs/theory/effects_of_building_wind"
    },
    {
        "title": "빌딩풍의 정의와 발생원인",
        "path": "/docs/theory/definition_and_causes_of_building_wind"
    },
    {
        "title": "빌딩풍의 종류",
        "path": "/docs/theory/types_of_building_wind"
    },
    {
        "title": "빛",
        "path": "/docs/theory/light"
    },
    {
        "title": "빛의 이중성과 광자가 가진 에너지의 양",
        "path": "/docs/theory/wave_particle_duality_and_photon_energy"
    },
    {
        "title": "빛의 합성",
        "path": "/docs/theory/color_mixing_of_light"
    },
    {
        "title": "사람의 신경계",
        "path": "/docs/theory/human_nervous_system"
    },
    {
        "title": "사람의 염색체(핵형분석)",
        "path": "/docs/theory/human_chromosomes_and_karyotyping"
    },
    {
        "title": "삼중점",
        "path": "/docs/theory/triple_point"
    },
    {
        "title": "생애주기 기준",
        "path": "/docs/theory/life_cycle_standards"
    },
    {
        "title": "서울 지형별 암석 분포와 주요 암석의 특징",
        "path": "/docs/theory/seoul_rock_distribution_and_features"
    },
    {
        "title": "서울 지형의 형성과정",
        "path": "/docs/theory/formation_process_of_seoul_topography"
    },
    {
        "title": "서울의 지하철 정보",
        "path": "/docs/theory/seoul_subway_information"
    },
    {
        "title": "세계 대규모 지진 현황",
        "path": "/docs/theory/major_earthquakes_worldwide"
    },
    {
        "title": "세균",
        "path": "/docs/theory/bacteria"
    },
    {
        "title": "세포 종류에 따른 생물의 구분",
        "path": "/docs/theory/classification_of_life_by_cell_type"
    },
    {
        "title": "소리의 3요소",
        "path": "/docs/theory/three_elements_of_sound"
    },
    {
        "title": "소리의 전달",
        "path": "/docs/theory/sound_transmission"
    },
    {
        "title": "속력과 속도",
        "path": "/docs/theory/speed_and_velocity"
    },
    {
        "title": "수정과 출생(태내기)",
        "path": "/docs/theory/fertilization_and_birth_prenatal_period"
    },
    {
        "title": "숫자로 알아보는 버스 정보",
        "path": "/docs/theory/bus_information_by_numbers"
    },
    {
        "title": "시냅스와 신경신호의 전달",
        "path": "/docs/theory/synapse_and_neural_signal_transmission"
    },
    {
        "title": "식물의 멸종위기",
        "path": "/docs/theory/endangered_plants"
    },
    {
        "title": "신재생 에너지의 사용",
        "path": "/docs/theory/use_of_renewable_energy"
    },
    {
        "title": "아이작 뉴턴",
        "path": "/docs/theory/isaac_newton"
    },
    {
        "title": "야생동물의 실태",
        "path": "/docs/theory/wildlife_status"
    },
    {
        "title": "야생동물이 도심으로 내려오는 이유",
        "path": "/docs/theory/why_wild_animals_enter_cities"
    },
    {
        "title": "에너지",
        "path": "/docs/theory/energy"
    },
    {
        "title": "에너지원",
        "path": "/docs/theory/energy_sources"
    },
    {
        "title": "에라토스테네스의 지구 크기 측정",
        "path": "/docs/theory/eratosthenes_earth_size_measurement"
    },
    {
        "title": "역학적 에너지",
        "path": "/docs/theory/mechanical_energy"
    },
    {
        "title": "열병합발전",
        "path": "/docs/theory/combined_heat_and_power_generation"
    },
    {
        "title": "열섬현상",
        "path": "/docs/theory/urban_heat_island"
    },
    {
        "title": "열섬현상의 영향",
        "path": "/docs/theory/effects_of_urban_heat_island"
    },
    {
        "title": "소독용제 별 장점과 단점",
        "path": "/docs/theory/advantages_and_disadvantages_of_disinfection"
    },
    {
        "title": "오목거울",
        "path": "/docs/theory/concave_mirror"
    },
    {
        "title": "오목거울의 상 작도",
        "path": "/docs/theory/concave_mirror_image_construction"
    },
    {
        "title": "오비탈",
        "path": "/docs/theory/orbital"
    },
    {
        "title": "옴의 법칙",
        "path": "/docs/theory/ohms_law"
    },
    {
        "title": "우주 탐사 방법",
        "path": "/docs/theory/space_exploration_methods"
    },
    {
        "title": "우주복",
        "path": "/docs/theory/space_suit"
    },
    {
        "title": "우주왕복선 우주복",
        "path": "/docs/theory/space_shuttle_spacesuit"
    },
    {
        "title": "원뿔곡선",
        "path": "/docs/theory/conic_sections"
    },
    {
        "title": "원뿔곡선의 반사성질",
        "path": "/docs/theory/reflective_properties_of_conics"
    },
    {
        "title": "원소와 원자",
        "path": "/docs/theory/elements_and_atoms"
    },
    {
        "title": "원자가전자",
        "path": "/docs/theory/valence_electrons"
    },
    {
        "title": "원자력에너지의 문제점",
        "path": "/docs/theory/problems_of_nuclear_energy"
    },
    {
        "title": "원전 안전성을 위한 장비",
        "path": "/docs/theory/equipment_for_nuclear_power_plant_safety"
    },
    {
        "title": "원전의 내진설계",
        "path": "/docs/theory/seismic_design_of_nuclear_power_plants"
    },
    {
        "title": "위생곤충 및 동물매개 감염병",
        "path": "/docs/theory/vector_borne_and_animal_borne_infectious_diseases"
    },
    {
        "title": "위생곤충과 쥐로부터의 감염경로",
        "path": "/docs/theory/infection_routes_from_insects_and_rodents"
    },
    {
        "title": "유도단위",
        "path": "/docs/theory/derived_units"
    },
    {
        "title": "유성생식과 무성생식",
        "path": "/docs/theory/sexual_and_asexual_reproduction"
    },
    {
        "title": "응집",
        "path": "/docs/theory/coagulation"
    },
    {
        "title": "인간의 뇌와 동물의 뇌",
        "path": "/docs/theory/human_and_animal_brains"
    },
    {
        "title": "인류세",
        "path": "/docs/theory/anthropocene"
    },
    {
        "title": "인사이트",
        "path": "/docs/theory/insight_mars_lander"
    },
    {
        "title": "자극과 반응",
        "path": "/docs/theory/stimulus_and_response"
    },
    {
        "title": "잔상 디스플레이",
        "path": "/docs/theory/persistence_of_vision_display"
    },
    {
        "title": "잔상효과",
        "path": "/docs/theory/afterimage_effect"
    },
    {
        "title": "장기기억과 단기기억",
        "path": "/docs/theory/long_term_and_short_term_memory"
    },
    {
        "title": "장애극복을 위한 첨단기술",
        "path": "/docs/theory/advanced_technology_for_overcoming_disabilities"
    },
    {
        "title": "저항의 병렬연결",
        "path": "/docs/theory/parallel_connection_of_resistors"
    },
    {
        "title": "저항의 직렬연결",
        "path": "/docs/theory/series_connection_of_resistors"
    },
    {
        "title": "적외선",
        "path": "/docs/theory/infrared_rays"
    },
    {
        "title": "전기",
        "path": "/docs/theory/electricity"
    },
    {
        "title": "전기와 자기",
        "path": "/docs/theory/electricity_and_magnetism"
    },
    {
        "title": "전동기의 원리",
        "path": "/docs/theory/motor_principle"
    },
    {
        "title": "전자기 유도 법칙(패러데이의 법칙)",
        "path": "/docs/theory/faradays_law_of_electromagnetic_induction"
    },
    {
        "title": "전자기파",
        "path": "/docs/theory/electromagnetic_wave"
    },
    {
        "title": "전정기관",
        "path": "/docs/theory/vestibular_system"
    },
    {
        "title": "정전기 유도",
        "path": "/docs/theory/electrostatic_induction"
    },
    {
        "title": "제곱근",
        "path": "/docs/theory/square_root"
    },
    {
        "title": "제목 넣기",
        "path": "/docs/theory/zzz_incomplete"
    },
    {
        "title": "제트엔진",
        "path": "/docs/theory/jet_engine"
    },
    {
        "title": "조선시대 천문관측기구",
        "path": "/docs/theory/joseon_astronomical_instruments"
    },
    {
        "title": "주기율표",
        "path": "/docs/theory/periodic_table"
    },
    {
        "title": "주기율표에 따른 원소의 주기성",
        "path": "/docs/theory/periodic_trends_of_elements"
    },
    {
        "title": "증강현실(AR)",
        "path": "/docs/theory/augmented_reality_ar"
    },
    {
        "title": "지진 진행별 행동요령",
        "path": "/docs/theory/earthquake_action_guidelines"
    },
    {
        "title": "지진계의 원리",
        "path": "/docs/theory/principle_of_seismograph"
    },
    {
        "title": "지진의 기록",
        "path": "/docs/theory/earthquake_records"
    },
    {
        "title": "지질시대",
        "path": "/docs/theory/geologic_time"
    },
    {
        "title": "직류전기와 교류전기",
        "path": "/docs/theory/direct_current_and_alternating_current"
    },
    {
        "title": "진공",
        "path": "/docs/theory/vacuum"
    },
    {
        "title": "진도",
        "path": "/docs/theory/seismic_intensity"
    },
    {
        "title": "진자",
        "path": "/docs/theory/pendulum"
    },
    {
        "title": "착시",
        "path": "/docs/theory/optical_illusion"
    },
    {
        "title": "청소년 유해물질",
        "path": "/docs/theory/harmful_substances_for_adolescents"
    },
    {
        "title": "큐리오시티",
        "path": "/docs/theory/curiosity_rover"
    },
    {
        "title": "키블저울",
        "path": "/docs/theory/kibble_balance"
    },
    {
        "title": "탄소 동소체",
        "path": "/docs/theory/carbon_allotropes"
    },
    {
        "title": "탄소발자국",
        "path": "/docs/theory/carbon_footprint"
    },
    {
        "title": "탄소의 순환",
        "path": "/docs/theory/carbon_cycle"
    },
    {
        "title": "탄소의 특성",
        "path": "/docs/theory/properties_of_carbon"
    },
    {
        "title": "탄소화합물",
        "path": "/docs/theory/carbon_compounds"
    },
    {
        "title": "태풍의 발생",
        "path": "/docs/theory/formation_of_typhoons"
    },
    {
        "title": "태풍의 분류",
        "path": "/docs/theory/classification_of_typhoons"
    },
    {
        "title": "태풍의 영향",
        "path": "/docs/theory/effects_of_typhoons"
    },
    {
        "title": "포물선 운동",
        "path": "/docs/theory/projectile_motion"
    },
    {
        "title": "플레밍의 오른손·왼손 법칙",
        "path": "/docs/theory/flemings_right_and_left_hand_rules"
    },
    {
        "title": "피부 구조와 기능",
        "path": "/docs/theory/structure_and_function_of_skin"
    },
    {
        "title": "픽셀과 해상도",
        "path": "/docs/theory/pixel_and_resolution"
    },
    {
        "title": "하모노그래프",
        "path": "/docs/theory/harmonograph"
    },
    {
        "title": "하프미러(반거울)",
        "path": "/docs/theory/half_mirror"
    },
    {
        "title": "한강의 어류종",
        "path": "/docs/theory/fish_species_of_han_river"
    },
    {
        "title": "해양오염",
        "path": "/docs/theory/marine_pollution"
    },
    {
        "title": "헤르츠",
        "path": "/docs/theory/hertz"
    },
    {
        "title": "현미경",
        "path": "/docs/theory/microscope"
    },
    {
        "title": "혼성 오비탈",
        "path": "/docs/theory/hybrid_orbital"
    },
    {
        "title": "홀로그램",
        "path": "/docs/theory/hologram"
    },
    {
        "title": "홍채 인식 기술",
        "path": "/docs/theory/iris_recognition_technology"
    },
    {
        "title": "홍채의 구조와 색",
        "path": "/docs/theory/structure_and_color_of_iris"
    },
    {
        "title": "홍채의 기능",
        "path": "/docs/theory/function_of_iris"
    },
    {
        "title": "화석",
        "path": "/docs/theory/fossil"
    },
    {
        "title": "화학의 아버지 멘델레예프",
        "path": "/docs/theory/mendeleev_father_of_chemistry"
    }
];

  function normalizeTheoryTitle(title) {
    return String(title || "")
      .replace(/\s*\(확인요\)\s*$/g, "")
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
