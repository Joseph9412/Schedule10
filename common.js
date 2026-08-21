/* ============================================================
   common.js
   원어민 강사 출강 관리 System - 공통 데이터/유틸 레이어
   (localStorage 기반 간이 DB. 서버가 없으므로 브라우저 저장소를 사용합니다.)
   ============================================================ */

/* ---------- 기본 시드 데이터 ---------- */
const DEFAULT_USERS = [
  { id: "admin", pw: "admin1234", name: "관리자", role: "admin", createdAt: new Date().toISOString() }
];

const VISA_OPTIONS = ["E-2", "F-2", "F-4", "F-5", "F-6", "재외동포", "기타"];
const LEAVE_TYPES = ["휴가", "병가", "퇴사", "기타"];

const DEFAULT_TEACHERS = [
  { id: "t_" + Date.now() + "_1", name: "Miriam_미리암", location: "", phone: "", visa: "", photo: "", hireDate: "", resignDate: "", status: "재직" },
  { id: "t_" + Date.now() + "_2", name: "Dounia_두니아", location: "", phone: "", visa: "", photo: "", hireDate: "", resignDate: "", status: "재직" },
  { id: "t_" + Date.now() + "_3", name: "Ilia_일리야", location: "", phone: "", visa: "", photo: "", hireDate: "", resignDate: "", status: "재직" },
  { id: "t_" + Date.now() + "_4", name: "Ines_이네스", location: "", phone: "", visa: "", photo: "", hireDate: "", resignDate: "", status: "재직" },
  { id: "t_" + Date.now() + "_5", name: "Vlad_블라드", location: "", phone: "", visa: "", photo: "", hireDate: "", resignDate: "", status: "재직" },
  { id: "t_" + Date.now() + "_6", name: "Chiara_키아라", location: "", phone: "", visa: "", photo: "", hireDate: "", resignDate: "", status: "재직" },
  { id: "t_" + Date.now() + "_7", name: "Danny_대니", location: "", phone: "", visa: "", photo: "", hireDate: "", resignDate: "", status: "재직" }
];

const DEFAULT_MANAGERS = [
  { id: "m_" + Date.now() + "_1", name: "엄준우", phone: "", memo: "", createdAt: new Date().toISOString() },
  { id: "m_" + Date.now() + "_2", name: "권태호", phone: "", memo: "", createdAt: new Date().toISOString() },
  { id: "m_" + Date.now() + "_3", name: "박성범", phone: "", memo: "", createdAt: new Date().toISOString() },
  { id: "m_" + Date.now() + "_4", name: "이정근", phone: "", memo: "", createdAt: new Date().toISOString() },
  { id: "m_" + Date.now() + "_5", name: "대표님", phone: "", memo: "", createdAt: new Date().toISOString() }
];

const DEFAULT_DAYCARES = [
  { id: "d_" + Date.now() + "_1", name: "강남구_개포유치원", managerId: "", defaultSchedules: [] },
  { id: "d_" + Date.now() + "_2", name: "강남구_개현초 병설유치원", managerId: "", defaultSchedules: [] },
  { id: "d_" + Date.now() + "_3", name: "동대문구_그림유치원", managerId: "", defaultSchedules: [] },
  { id: "d_" + Date.now() + "_4", name: "서대문구_가좌제일어린이집", managerId: "", defaultSchedules: [] }
];

const DAYS = ["월요일", "화요일", "수요일", "목요일", "금요일"];
const DAY_SHORT = { "월요일": "Mon", "화요일": "Tue", "수요일": "Wed", "목요일": "Thu", "금요일": "Fri" };
/* "월,화,목" / "월 화 목" 등 다양한 구분자로 들어온 요일 문자열을 표준 요일 배열로 변환 */
const DAY_ALIASES = { "월": "월요일", "화": "화요일", "수": "수요일", "목": "목요일", "금": "금요일" };
function parseDayList(text) {
  return String(text || "")
    .split(/[,\/\s]+/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => DAYS.includes(s) ? s : (DAY_ALIASES[s] || null))
    .filter(Boolean);
}

/* ---------- 사이트 설정 (관리자가 문구를 직접 수정 가능) ---------- */
const DEFAULT_SITE_SETTINGS = {
  siteTitle: "원어민 강사 출강 스케줄 관리 System",
  tabs: {
    registration: "수업 요청",
    approved: "승인 현황",
    teachers: "강사 리스트",
    daycares: "어린이집 리스트",
    managers: "담당자",
    availability: "보강/대체",
    calendar: "강사 일정관리",
    users: "가입 회원 확인",
    settings: "환경설정",
    portal: "내 스케줄 · 휴가 신청",
    bulkimport: "통합 데이터 등록"
  },
  headings: {
    registration_form: "수업 요청",
    registration_list: "수업 요청 현황 (대기 중 · 담당자별)",
    approved_grid: "주간 출강 스케줄 (승인 완료 기준)",
    approved_list: "승인 완료 현황 (담당자별)",
    teachers_list: "강사 리스트",
    daycares_list: "어린이집 / 유치원 리스트",
    managers_list: "담당자 리스트",
    availability_title: "보강 / 대체 배정 — 요일별 강사 공백시간 확인",
    calendar_title: "강사 일정관리 — 휴가 · 병가 · 입/퇴사 캘린더",
    portal_title: "내 스케줄 · 휴가 신청",
    bulkimport_title: "통합 데이터 일괄 등록"
  },
  login: {
    title: "원어민 강사 출강 관리 System",
    subtitle: "수업 요청 및 스케줄 관리 시스템",
    hint: "테스트 관리자 계정 이름: 관리자 / 비밀번호: admin1234"
  },
  signup: {
    title: "회원가입",
    subtitle: "수업 요청 및 관리를 위한 계정 등록"
  }
};

/* ---------- 시간 관련 (자유 시간 입력 지원: 10분 단위까지 가능) ---------- */
const OPERATING_START = "09:00";   // 운영 시작
const OPERATING_END   = "19:00";   // 운영 마감 (이 시각까지 수업 종료 가능)
const GRID_STEP_MIN   = 30;        // 주간 스케줄 표 표시 간격(분) - 시각화용

function timeToMinutes(t) {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function minutesToTime(min) {
  const h = Math.floor(min / 60), m = min % 60;
  const pad = n => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}`;
}
function fmtDuration(startMin, endMin) {
  const total = endMin - startMin;
  const h = Math.floor(total / 60), m = total % 60;
  if (h && m) return `${h}시간 ${m}분`;
  if (h) return `${h}시간`;
  return `${m}분`;
}
/* 1타임 = 30분 기준. 정기 수업시간(defaultSchedules)은 {day, start, sessions}로 저장하고
   종료시간은 필요할 때 이 함수로 계산합니다. */
const MIN_PER_SESSION = 30;
function sessionsToEnd(start, sessions) {
  return minutesToTime(timeToMinutes(start) + (Number(sessions) || 1) * MIN_PER_SESSION);
}
function defaultSchedLabel(s) {
  return `${s.day} ${s.start}~${sessionsToEnd(s.start, s.sessions)} (${s.sessions}타임)`;
}
/* 스케줄 표에 쓰일 30분 간격 행 시작 시각(분) 목록 */
function buildGridRows() {
  const rows = [];
  let cur = timeToMinutes(OPERATING_START);
  const end = timeToMinutes(OPERATING_END);
  while (cur < end) { rows.push(cur); cur += GRID_STEP_MIN; }
  return rows;
}
/* 주어진 분(min)이 속하는 그리드 행 인덱스 */
function rowIndexForMinute(rows, min) {
  for (let i = 0; i < rows.length; i++) {
    if (min < rows[i] + GRID_STEP_MIN) return i;
  }
  return rows.length - 1;
}

/* 강사 또는 어린이집 기준 시간 충돌 확인 (요일 + 분단위 겹침)
   teacherIds는 하위 호환을 위해 배열로 받되, 실제로는 강사 1명(teacherId)만 사용합니다. */
function findScheduleConflict(schedules, teacherIds, daycareId, day, startMin, endMin, ignoreId) {
  const ids = Array.isArray(teacherIds) ? teacherIds.filter(Boolean) : [teacherIds].filter(Boolean);
  const list = schedules.filter(s => s.status !== "취소" && s.id !== ignoreId && s.day === day);
  for (const s of list) {
    const sStart = timeToMinutes(s.start), sEnd = timeToMinutes(s.end);
    const overlap = startMin < sEnd && sStart < endMin;
    if (!overlap) continue;
    if (ids.includes(s.teacherId)) return { type: "teacher", entry: s };
    if (s.daycareId === daycareId) return { type: "daycare", entry: s };
  }
  return null;
}

/* 어린이집의 담당자(managerId) 기준으로 스케줄들을 그룹화 -> { 담당자명: [schedule,...] } */
function groupSchedulesByManager(schedules) {
  const daycareMap = {};
  getDaycares().forEach(d => { daycareMap[d.id] = getManagerName(d.managerId); });
  const groups = {};
  schedules.forEach(s => {
    const mgr = daycareMap[s.daycareId] || "미지정";
    if (!groups[mgr]) groups[mgr] = [];
    groups[mgr].push(s);
  });
  return groups;
}

/* 어린이집 이름의 앞부분(지역명_기관명)에서 지역명 추출 */
function parseRegion(daycareName) {
  const name = String(daycareName || "");
  const idx = name.indexOf("_");
  return idx > 0 ? name.slice(0, idx) : "기타지역";
}

/* ---------- 공통 유틸 ---------- */
function uid(prefix) {
  return (prefix || "id") + "_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
}
function fmtDate(iso) {
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
/* 어린이집/기관명 기반 고정 색상 (스케줄 표 색칠용) */
const PALETTE = ["#fde68a","#a7f3d0","#93c5fd","#fca5a5","#c4b5fd","#f9a8d4","#67e8f9","#fdba74","#bef264","#d1d5db"];
function colorFor(key) {
  let h = 0;
  const s = String(key);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}
/* 검색: 여러 필드 중 하나라도 검색어를 포함하면 true (검색어 없으면 항상 true) */
function matchesQuery(fields, query) {
  if (!query || !query.trim()) return true;
  const q = query.trim().toLowerCase();
  return fields.some(f => String(f == null ? "" : f).toLowerCase().includes(q));
}
/* 엑셀 등에서 복사한 표를 붙여넣었을 때 행/열로 분리 (탭 우선, 없으면 쉼표) */
function parseBulkRows(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map(l => l.replace(/\r$/, ""))
    .filter(l => l.trim().length > 0)
    .map(line => {
      let cols = line.split("\t");
      if (cols.length === 1) cols = line.split(",");
      return cols.map(c => c.trim());
    });
}

/* 이름을 기반으로 중복되지 않는 내부 로그인 ID를 생성 (사용자에게는 노출하지 않음) */
function makeUniqueId(name, excludeId) {
  const base = String(name || "user").trim().replace(/\s+/g, "") || "user";
  const users = getUsers().filter(u => u.id !== excludeId);
  let candidate = base, n = 1;
  while (users.some(u => u.id === candidate)) { n++; candidate = base + n; }
  return candidate;
}

/* 오늘 기준 "가장 먼저 다가올 일정" 순서로 정렬하기 위한 비교 함수.
   오늘 이후(미래) 일정은 가까운 순으로 먼저, 지난 일정은 최근 지난 순으로 그 다음에 배치 */
function todayStr() {
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function sortByUpcoming(list, dateField) {
  const today = todayStr();
  return [...list].sort((a, b) => {
    const av = a[dateField] || "", bv = b[dateField] || "";
    const aFuture = av >= today, bFuture = bv >= today;
    if (aFuture !== bFuture) return aFuture ? -1 : 1;
    return aFuture ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
  });
}

/* ---------- localStorage 접근 ---------- */
function _get(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}
function _set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function getUsers() { return _get("app_users", DEFAULT_USERS); }
function saveUsers(list) { _set("app_users", list); }

function getTeachers() { return _get("app_teachers", DEFAULT_TEACHERS); }
function saveTeachers(list) { _set("app_teachers", list); }

function getManagers() { return _get("app_managers", DEFAULT_MANAGERS); }
function saveManagers(list) { _set("app_managers", list); }
function getManagerName(id) {
  if (!id) return "미지정";
  const m = getManagers().find(x => x.id === id);
  return m ? m.name : "미지정";
}

function getDaycares() { return _get("app_daycares", DEFAULT_DAYCARES); }
function saveDaycares(list) { _set("app_daycares", list); }

function getSchedules() { return _get("app_schedules", []); }
function saveSchedules(list) { _set("app_schedules", list); }

function getNotes() { return _get("app_notes", {}); } // { daycareId: [{author,text,date}] }
function saveNotes(obj) { _set("app_notes", obj); }

function getLeaves() { return _get("app_leaves", []); } // [{id,teacherId,teacherName,type,startDate,endDate,reason,status,createdAt,requestedBy}]
function saveLeaves(list) { _set("app_leaves", list); }

function getSiteSettings() {
  const saved = _get("app_site_settings", null);
  if (!saved) return JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS));
  // 기본값과 병합 (새 필드가 추가되어도 누락되지 않도록)
  return {
    siteTitle: saved.siteTitle || DEFAULT_SITE_SETTINGS.siteTitle,
    tabs: Object.assign({}, DEFAULT_SITE_SETTINGS.tabs, saved.tabs || {}),
    headings: Object.assign({}, DEFAULT_SITE_SETTINGS.headings, saved.headings || {}),
    login: Object.assign({}, DEFAULT_SITE_SETTINGS.login, saved.login || {}),
    signup: Object.assign({}, DEFAULT_SITE_SETTINGS.signup, saved.signup || {})
  };
}
function saveSiteSettings(obj) { _set("app_site_settings", obj); }
/* siteLabel("tabs.registration", "수업 요청") 형태로 사용 */
function siteLabel(path, fallback) {
  const s = getSiteSettings();
  const parts = path.split(".");
  let v = s;
  for (const p of parts) { v = v && v[p]; }
  return v || fallback;
}

/* 최초 1회 시드 보장 (기존 로컬스토리지가 비어있을 때만) */
function ensureSeed() {
  if (!localStorage.getItem("app_users")) saveUsers(DEFAULT_USERS);
  if (!localStorage.getItem("app_teachers")) saveTeachers(DEFAULT_TEACHERS);
  if (!localStorage.getItem("app_managers")) saveManagers(DEFAULT_MANAGERS);
  if (!localStorage.getItem("app_daycares")) saveDaycares(DEFAULT_DAYCARES);
  if (!localStorage.getItem("app_schedules")) saveSchedules([]);
  if (!localStorage.getItem("app_notes")) saveNotes({});
  if (!localStorage.getItem("app_site_settings")) saveSiteSettings(DEFAULT_SITE_SETTINGS);
}
ensureSeed();

/* 구버전(고정 30분 슬롯 + duration 개수) 스케줄 데이터를 새 포맷(start/end)으로 1회 변환 */
function migrateSchedules() {
  const list = getSchedules();
  let changed = false;
  list.forEach(s => {
    if (!s.end && s.start && s.duration) {
      const startMin = timeToMinutes(s.start);
      s.end = minutesToTime(startMin + s.duration * 30);
      changed = true;
    }
  });
  if (changed) saveSchedules(list);
}
/* 구버전 어린이집 데이터(manager 문자열)를 담당자(managerId) 참조로 1회 변환 */
function migrateManagerRefs() {
  const managers = getManagers();
  const daycares = getDaycares();
  let managersChanged = false, daycaresChanged = false;
  daycares.forEach(d => {
    if (d.managerId === undefined) {
      const name = (d.manager || "").trim();
      if (!name) {
        d.managerId = "";
      } else {
        let m = managers.find(mm => mm.name === name);
        if (!m) {
          m = { id: uid("m"), name, phone: "", memo: "", createdAt: new Date().toISOString() };
          managers.push(m);
          managersChanged = true;
        }
        d.managerId = m.id;
      }
      delete d.manager;
      daycaresChanged = true;
    }
    if (d.defaultSchedules === undefined) { d.defaultSchedules = []; daycaresChanged = true; }
  });
  if (managersChanged) saveManagers(managers);
  if (daycaresChanged) saveDaycares(daycares);
}
/* 정기 수업시간을 {day,start,end} -> {day,start,sessions}(1타임=30분) 포맷으로 1회 변환 */
function migrateDefaultSchedSessions() {
  const daycares = getDaycares();
  let changed = false;
  daycares.forEach(d => {
    (d.defaultSchedules || []).forEach(s => {
      if (s.sessions === undefined) {
        if (s.end) {
          s.sessions = Math.max(1, Math.round((timeToMinutes(s.end) - timeToMinutes(s.start)) / MIN_PER_SESSION));
          delete s.end;
        } else {
          s.sessions = 1;
        }
        changed = true;
      }
    });
  });
  if (changed) saveDaycares(daycares);
}
/* 구버전 강사 데이터에 비자 필드 보강 */
function migrateTeacherVisa() {
  const list = getTeachers();
  let changed = false;
  list.forEach(t => {
    if (t.visa === undefined) { t.visa = ""; changed = true; }
    if (t.status === undefined) { t.status = "재직"; changed = true; }
    if (t.hireDate === undefined) { t.hireDate = ""; changed = true; }
    if (t.resignDate === undefined) { t.resignDate = ""; changed = true; }
  });
  if (changed) saveTeachers(list);
}
migrateSchedules();
migrateManagerRefs();
migrateTeacherVisa();
migrateDefaultSchedSessions();

/* ---------- 세션 / 접근 제어 ---------- */
function currentUser() {
  const id = sessionStorage.getItem("userId");
  if (!id) return null;
  return getUsers().find(u => u.id === id) || null;
}
function requireLogin() {
  const u = currentUser();
  if (!u || u.deleted) { sessionStorage.clear(); location.href = "index.html"; return null; }
  return u;
}
function requireAdmin() {
  const u = requireLogin();
  if (!u) return null;
  if (u.role !== "admin") {
    alert("관리자만 접근할 수 있는 페이지입니다.");
    location.href = "registration.html";
    return null;
  }
  return u;
}
/* 사원/관리자 전용 페이지 진입 가드 (Teacher 계정은 Teacher 포털로 리다이렉트) */
function requireStaff() {
  const u = requireLogin();
  if (!u) return null;
  if (u.role === "teacher") {
    location.href = "teacher_portal.html";
    return null;
  }
  return u;
}
/* 강사 전용 페이지 진입 가드 */
function requireTeacherRole() {
  const u = requireLogin();
  if (!u) return null;
  if (u.role !== "teacher") {
    location.href = "registration.html";
    return null;
  }
  return u;
}
function logout() {
  sessionStorage.clear();
  location.href = "index.html";
}

/* ---------- 강사 로그인 계정 연결 (관리자가 강사 리스트에서 설정) ---------- */
function findUserByTeacherId(teacherId) {
  return getUsers().find(u => u.role === "teacher" && u.teacherId === teacherId) || null;
}
/* 로그인 계정 생성/변경. 성공 시 true, 아이디 중복이면 false 반환 */
function setTeacherLogin(teacherId, loginId, pw, teacherName) {
  const users = getUsers();
  const dup = users.find(u => u.id === loginId && !(u.role === "teacher" && u.teacherId === teacherId));
  if (dup) return false;
  let existing = findUserByTeacherId(teacherId);
  if (existing) {
    existing.id = loginId;
    if (pw) existing.pw = pw;
    existing.name = teacherName;
  } else {
    users.push({ id: loginId, pw: pw || "1234", name: teacherName, role: "teacher", teacherId, createdAt: new Date().toISOString() });
  }
  saveUsers(users);
  return true;
}
function removeTeacherLogin(teacherId) {
  saveUsers(getUsers().filter(u => !(u.role === "teacher" && u.teacherId === teacherId)));
}

/* ---------- 활성 강사 (퇴사자 제외) ---------- */
function getActiveTeachers() { return getTeachers().filter(t => t.status !== "퇴사"); }

/* ---------- 요일별 강사 공백시간(빈 시간) 계산 - 보강/대체 배정용 ---------- */
/* 반환: [{ teacher, busySlots: [{start,end,daycareName}], freeRatio }] */
function computeTeacherAvailability(day) {
  const approved = getSchedules().filter(s => s.status === "승인" && s.day === day);
  return getActiveTeachers().map(t => {
    const busy = approved
      .filter(s => s.teacherId === t.id)
      .map(s => ({ start: s.start, end: s.end, daycareName: s.daycareName }))
      .sort((a, b) => a.start.localeCompare(b.start));
    return { teacher: t, busy };
  });
}

/* ---------- 헤더 바 공통 렌더 (모든 내부 페이지에서 사용) ---------- */
function renderHeadBar(activeTab) {
  const u = currentUser();
  if (!u) return;
  const isAdmin = u.role === "admin";
  const isTeacher = u.role === "teacher";

  let tabs, roleLabel;
  if (isTeacher) {
    tabs = [
      { key: "portal", label: siteLabel("tabs.portal", "내 스케줄 · 휴가 신청"), href: "teacher_portal.html", show: true }
    ];
    roleLabel = "Teacher";
  } else {
    const pendingCount = getSchedules().filter(s => s.status === "대기").length;
    const pendingLeaveCount = getLeaves().filter(l => l.status === "대기").length;
    tabs = [
      { key: "registration", label: siteLabel("tabs.registration", "수업 요청"), href: "registration.html", show: true, badge: isAdmin && pendingCount > 0 ? pendingCount : 0 },
      { key: "approved", label: siteLabel("tabs.approved", "승인 현황"), href: "approved.html", show: true },
      { key: "availability", label: siteLabel("tabs.availability", "보강/대체"), href: "teacher_availability.html", show: true },
      { key: "teachers", label: siteLabel("tabs.teachers", "강사 리스트"), href: "teachers.html", show: true },
      { key: "calendar", label: siteLabel("tabs.calendar", "강사 일정관리"), href: "teacher_calendar.html", show: true, badge: isAdmin && pendingLeaveCount > 0 ? pendingLeaveCount : 0 },
      { key: "daycares", label: siteLabel("tabs.daycares", "어린이집 리스트"), href: "daycares.html", show: true },
      { key: "managers", label: siteLabel("tabs.managers", "담당자"), href: "managers.html", show: true },
      { key: "users", label: siteLabel("tabs.users", "가입 회원 확인"), href: "admin_users.html", show: isAdmin },
      { key: "bulkimport", label: siteLabel("tabs.bulkimport", "통합 데이터 등록"), href: "bulk_import.html", show: isAdmin },
      { key: "settings", label: siteLabel("tabs.settings", "환경설정"), href: "admin_settings.html", show: isAdmin }
    ];
    roleLabel = isAdmin ? "관리자" : "사원";
  }

  const tabHtml = tabs.filter(t => t.show).map(t => {
    const activeCls = t.key === activeTab ? "tab-active" : "";
    const badge = t.badge ? ` <span class="badge">${t.badge}</span>` : "";
    return `<a href="${t.href}" class="tab ${activeCls}">${t.label}${badge}</a>`;
  }).join("");

  const el = document.getElementById("head_bar_root");
  if (!el) return;
  el.innerHTML = `
    <div id="head_bar">
      <div class="hb-top">
        <h2>${escapeHtml(siteLabel("siteTitle", DEFAULT_SITE_SETTINGS.siteTitle))}</h2>
        <div class="hb-user">
          <span class="role_tag ${isAdmin ? "" : "user"}">${roleLabel} · ${escapeHtml(u.name)}</span>
          <button onclick="logout()" class="btn btn-ghost">로그아웃</button>
        </div>
      </div>
      <nav class="hb-tabs">${tabHtml}</nav>
    </div>
  `;
}

/* ---------- 강사 주간 스케줄 그리드 (승인 완료 기준) - 여러 페이지에서 공유 ---------- */
function renderTeacherGrid(teacherId, gridHolderEl, chipEl) {
  if (!teacherId) {
    gridHolderEl.innerHTML = `<p class="small-muted" style="padding:16px;">스케줄을 확인할 강사를 선택해주세요.</p>`;
    if (chipEl) chipEl.style.display = "none";
    return;
  }
  const teacher = getTeachers().find(t => t.id === teacherId);
  if (!teacher) { gridHolderEl.innerHTML = `<p class="small-muted">강사를 찾을 수 없습니다.</p>`; return; }

  const approved = getSchedules().filter(s => s.teacherId === teacherId && s.status === "승인");
  const rows = buildGridRows();
  const occupied = DAYS.map(() => Array(rows.length).fill(null));
  approved.forEach(s => {
    const dIdx = DAYS.indexOf(s.day);
    if (dIdx === -1) return;
    const startMin = timeToMinutes(s.start), endMin = timeToMinutes(s.end);
    const startIdx = rowIndexForMinute(rows, startMin);
    const endIdxExclusive = rowIndexForMinute(rows, endMin - 1) + 1;
    for (let i = startIdx; i < endIdxExclusive && i < rows.length; i++) {
      occupied[dIdx][i] = (i === startIdx) ? { entry: s, span: endIdxExclusive - startIdx } : "skip";
    }
  });

  const totalMinutes = approved.reduce((sum, s) => sum + (timeToMinutes(s.end) - timeToMinutes(s.start)), 0);
  const totalHoursLabel = (totalMinutes / 60).toFixed(1).replace(/\.0$/, "");
  if (chipEl) { chipEl.style.display = "inline-block"; chipEl.textContent = `총 ${totalHoursLabel}시간 / 주`; }

  let html = `<table class="sched-grid">
    <tr class="grid-title-row"><th colspan="${DAYS.length + 1}">${escapeHtml(teacher.name)}${teacher.location ? " (" + escapeHtml(teacher.location) + ")" : ""} — ${totalHoursLabel}h</th></tr>
    <tr class="grid-day-row"><th class="grid-time-col">Time</th>${DAYS.map(d => `<th>${d}</th>`).join("")}</tr>`;

  rows.forEach((rowStart, rIdx) => {
    const rowLabel = `${minutesToTime(rowStart)} ~ ${minutesToTime(rowStart + GRID_STEP_MIN)}`;
    html += `<tr><td class="grid-time-col">${rowLabel}</td>`;
    DAYS.forEach((d, dIdx) => {
      const cell = occupied[dIdx][rIdx];
      if (cell === "skip") return;
      if (cell === null) {
        html += `<td class="slot-empty"></td>`;
      } else {
        const s = cell.entry;
        html += `<td class="slot-filled" rowspan="${cell.span}" style="background:${colorFor(s.daycareId)}">
          <div>${escapeHtml(s.daycareName)}</div>
          <div style="font-weight:400; font-size:11px; margin-top:2px;">${s.start}~${s.end}</div>
        </td>`;
      }
    });
    html += `</tr>`;
  });
  html += `</table>`;
  gridHolderEl.innerHTML = html;
}
