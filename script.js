// ============================================================
//  FIREBASE CONFIGURATION
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import {
  getFirestore, collection, doc, getDoc, getDocs,
  setDoc, updateDoc, onSnapshot
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDvdqWjl5UkHEwdd0XBkhUXuyKCN4NpcfU",
  authDomain: "scius-camp-leaderboard.firebaseapp.com",
  projectId: "scius-camp-leaderboard",
  storageBucket: "scius-camp-leaderboard.firebasestorage.app",
  messagingSenderId: "641396962013",
  appId: "1:641396962013:web:6d040494639af2c8eb2134"
};
// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================
//  ADMIN PIN — change this to whatever you want
// ============================================================
const ADMIN_PIN = "3516";

// ============================================================
//  INITIAL DATA
//  On first load this seeds Firestore. After that, edits in
//  the admin panel are the source of truth — this block is
//  ignored if the documents already exist.
// ============================================================
const INITIAL_TEAMS = [
  { id: "1", name: "Team 1", colorLight: "#FAECE7", colorDark: "#712B13", colorText: "#993C1D", pts: 0 },
  { id: "2", name: "Team 2", colorLight: "#E6F1FB", colorDark: "#0C447C", colorText: "#185FA5", pts: 0 },
  { id: "3", name: "Team 3", colorLight: "#FEF9E7", colorDark: "#7A5C00", colorText: "#A07C00", pts: 0 },
]

const INITIAL_HOUSES = [
  { id: "1", name: "House 1", team: "1", colorLight: "#FAECE7", colorDark: "#712B13", colorText: "#993C1D", pts: 0 },
  { id: "2", name: "House 2", team: "1", colorLight: "#F5D5CC", colorDark: "#8F1F08", colorText: "#B5391C", pts: 0 },
  { id: "3", name: "House 3", team: "2", colorLight: "#E6F1FB", colorDark: "#0C447C", colorText: "#185FA5", pts: 0 },
  { id: "4", name: "House 4", team: "2", colorLight: "#C9E2F7", colorDark: "#083060", colorText: "#0D4A87", pts: 0 },
  { id: "5", name: "House 5", team: "3", colorLight: "#FEF9E7", colorDark: "#7A5C00", colorText: "#A07C00", pts: 0 },
  { id: "6", name: "House 6", team: "3", colorLight: "#FDF0C0", colorDark: "#5C4200", colorText: "#856000", pts: 0 },
];

const INITIAL_PLAYERS = [
  { id: "pcm-lookoon", name: "ลูกคุณ", house: "3", pts: 0, photo: "images/pcm-lookoon" },
  { id: "bcm-atta", name: "อัตตา", house: "1", pts: 0, photo: "images/bcm-atta" },
  { id: "bcm-pukan", name: "พู่กัน", house: "2", pts: 0, photo: "images/bcm-pukan" },
  { id: "ssk-top", name: "ท็อป", house: "1", pts: 0, photo: "images/ssk-top" },
  { id: "ssk-omsin", name: "ออมสิน", house: "3", pts: 0, photo: "images/ssk-omsin" },
  { id: "pcm-khaopluak", name: "ข้าวเปลือก", house: "6", pts: 0, photo: "images/pcm-khaopluak" },
  { id: "ysp-tonnam", name: "ต้นน้ำ", house: "6", pts: 0, photo: "images/ysp-tonnam" },
  { id: "ysp-plaeng", name: "เพลง", house: "6", pts: 0, photo: "images/ysp-plaeng" },
  { id: "pcm-din", name: "ดิน", house: "1", pts: 0, photo: "images/pcm-din" },
  { id: "pcm-popey", name: "ปอเป้ย", house: "2", pts: 0, photo: "images/pcm-popey" },
  { id: "bcm-tonnam", name: "ต้นน้ำ", house: "1", pts: 0, photo: "images/bcm-tonnam" },
  { id: "bcm-evan", name: "เอเว่น", house: "5", pts: 0, photo: "images/bcm-evan" },
  { id: "lkh-nu", name: "ณุ", house: "2", pts: 0, photo: "images/lkh-nu" },
  { id: "bcm-peem", name: "ภีม", house: "2", pts: 0, photo: "images/bcm-peem" },
  { id: "kkh-punpun", name: "ปันปัน", house: "5", pts: 0, photo: "images/kkh-punpun" },
  { id: "bcm-kimbab", name: "คิมบับ", house: "1", pts: 0, photo: "images/bcm-kimbab" },
  { id: "bcm-prae", name: "แพร", house: "6", pts: 0, photo: "images/bcm-prae" },
  { id: "skw-tangwai", name: "ตังหวาย", house: "5", pts: 0, photo: "images/skw-tangwai" },
  { id: "skw-jao", name: "จ้าว", house: "3", pts: 0, photo: "images/skw-jao" },
  { id: "ysp-ryu", name: "ริว", house: "3", pts: 0, photo: "images/ysp-ryu" },
  { id: "amn-kookkik", name: "กุ๊กกิ๊ก", house: "2", pts: 0, photo: "images/amn-kookkik" },
  { id: "amn-nampun", name: "น้ำพั้น", house: "4", pts: 0, photo: "images/amn-nampun" },
  { id: "ysp-punngen", name: "ปั้นเงิน", house: "4", pts: 0, photo: "images/ysp-punngen" },
  { id: "pcm-sen", name: "เซน", house: "5", pts: 0, photo: "images/pcm-sen" },
  { id: "bcm-music", name: "มิวสิค", house: "5", pts: 0, photo: "images/bcm-music" },
  { id: "ysp-tew", name: "ทิว", house: "4", pts: 0, photo: "images/ysp-tew" },
  { id: "ssk-bonus", name: "โบนัส", house: "4", pts: 0, photo: "images/ssk-bonus" },
  { id: "skw-tongjai", name: "ต้องใจ", house: "6", pts: 0, photo: "images/skw-tongjai" },
  { id: "lnt-kan", name: "กัญ", house: "3", pts: 0, photo: "images/lnt-kun" },
  { id: "bcm-august", name: "ออกัส", house: "4", pts: 0, photo: "images/bcm-august" },
];

// // ============================================================
// //  SEED (runs once per doc if it doesn't exist yet)
// // ============================================================
async function seedIfNeeded() {
  for (const t of INITIAL_TEAMS) {
    const ref = doc(db, "teams", t.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) await setDoc(ref, t);
  }
  for (const h of INITIAL_HOUSES) {
    const ref = doc(db, "houses", h.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) await setDoc(ref, h);
  }
  for (const p of INITIAL_PLAYERS) {
    const ref = doc(db, "players", p.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) await setDoc(ref, p);
  }
}

// ============================================================
//  STATE
// ============================================================
let teams = {};
let houses = {};
let players = {};
let currentTab = "team";
let adminOpen = false;
const teId = new Map();

// ============================================================
//  RENDER
// ============================================================
const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

function medal(r) {
  return r === 1 ? "🥇" : r === 2 ? "🥈" : r === 3 ? "🥉" : "";
}

const BASE_URL = "https://7qffza5d.github.io/scoreboard/";

function avatarHTML(player, house) {
  const bg = dark ? house.colorDark : house.colorLight;
  const color = house.colorText;
  if (player.photo) {
    const src = BASE_URL + player.photo + ".png";
    return `<div class="avatar"><img src="${src}" alt="${player.name}"></div>`;
  }
  return `<div class="avatar" style="background:${bg};color:${color}">${player.name}</div>`;
}

function renderBoard() {
  renderInd();
  renderHouse();
  renderTeam();
  renderAdmin();
  showTab(currentTab);
}

function renderInd() {
  const sorted = Object.values(players)
    .sort((a, b) => b.pts - a.pts || a.name.localeCompare(b.name))
  const board = document.getElementById("board-ind");
  if (!board) return;
  const ranks = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) ranks.push(1);
    else if (sorted[i].pts === sorted[i - 1].pts) ranks.push(ranks[i - 1]);
    else ranks.push(i + 1);
  }
  const cutoffRank = ranks[Math.min(9, sorted.length - 1)];
  const display = sorted.filter((p, i) => ranks[i] <= cutoffRank);
  board.innerHTML = display.map((p, i) => {
    const t = houses[p.house] || {};
    const r = ranks[i];
    const bg = dark ? t.colorDark : t.colorLight;
    return `<div class="row" style="background:${bg}">
        <span class="rank-num" style="color:${t.colorText}">${medal(r) || r}</span>
        ${avatarHTML(p, t)}
        <div class="info">
          <div class="pname" style="color:${t.colorText}">${p.name}</div>
          <div class="psub">${t.name || ""}</div>
        </div>
        <div class="pts-wrap">
          <span class="pts-big" style="color:${t.colorText}">${precise(p.pts)}</span>
          <span class="pts-lbl">pts</span>
        </div>
      </div>`;
  }).join("");
}

function renderHouse() {
  const sorted = Object.values(houses).sort((a, b) => b.pts - a.pts || a.name.localeCompare(b.name));
  const board = document.getElementById("board-house");
  if (!board) return;
  const ranks = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) ranks.push(1);
    else if (sorted[i].pts === sorted[i - 1].pts) ranks.push(ranks[i - 1]);
    else ranks.push(i + 1);
  }
  board.innerHTML = sorted.map((t, i) => {
    const r = ranks[i];
    const bg = dark ? t.colorDark : t.colorLight;
    return `<div class="row" style="background:${bg}">
        <span class="rank-num" style="color:${t.colorText}">${medal(r) || r}</span>
        <div class="avatar" style="background:${bg};color:${t.colorText};font-size:1.3rem;border:2px solid ${t.colorText}">&#9733;</div>
        <div class="info">
          <div class="pname" style="color:${t.colorText};font-size:1.05rem">${t.name}</div>
          <div class="psub">House total</div>
        </div>
        <div class="pts-wrap">
          <span class="pts-big" style="color:${t.colorText}">${precise(t.pts)}</span>
          <span class="pts-lbl">pts</span>
        </div>
      </div>`;
  }).join("");
}

function renderTeam() {
  const sorted = Object.values(teams).sort((a, b) => b.pts - a.pts || a.name.localeCompare(b.name));
  const board = document.getElementById("board-team");
  if (!board) return;
  const ranks = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) ranks.push(1);
    else if (sorted[i].pts === sorted[i - 1].pts) ranks.push(ranks[i - 1]);
    else ranks.push(i + 1);
  }
  board.innerHTML = sorted.map((t, i) => {
    const r = ranks[i];
    const bg = dark ? t.colorDark : t.colorLight;
    return `<div class="row" style="background:${bg}">
        <span class="rank-num" style="color:${t.colorText}">${medal(r) || r}</span>
        <div class="avatar" style="background:${bg};color:${t.colorText};font-size:1.3rem;border:2px solid ${t.colorText}">&#9733;</div>
        <div class="info">
          <div class="pname" style="color:${t.colorText};font-size:1.05rem">${t.name}</div>
          <div class="psub">House total</div>
        </div>
        <div class="pts-wrap">
          <span class="pts-big" style="color:${t.colorText}">${precise(t.pts)}</span>
          <span class="pts-lbl">pts</span>
        </div>
      </div>`;
  }).join("");
}

function renderAdmin() {
  const panel = document.getElementById("admin-panel");
  if (!panel) return;

  const playersSorted = Object.values(players).sort((a, b) => a.name.localeCompare(b.name));
  const housesSorted = Object.values(houses).sort((a, b) => a.name.localeCompare(b.name));
  const teamsSorted = Object.values(teams).sort((a, b) => a.name.localeCompare(b.name));

  panel.innerHTML = `
      <div class="admin-section">
        <div class="admin-heading">Individual scores</div>
        ${playersSorted.map(p => {
    const t = houses[p.house] || {};
    return `<div class="admin-row">
            <span class="admin-name">${p.name}</span>
            <span class="admin-house" style="color:${t.colorText}">${t.name || ""}</span>
            <div class="admin-controls">
              <span class="admin-pts">${precise(p.pts)}</span>
              <input type="number" placeholder="set"
                style="width:64px;padding:3px 6px;border-radius:6px;border:1px solid #ddd;font-family:'Courier Prime', 'Courier New', monospace;font-size:0.9rem;"
                onchange="setIndScore('${p.id}', this.value); this.value='';">
            </div>
          </div>`;
  }).join("")}
      </div>
      <div class="admin-section" style="margin-top:1.5rem">
        <div class="admin-heading">House scores</div>
        ${housesSorted.map(h => `<div class="admin-row">
          <span class="admin-name" style="color:${h.colorLight}">${h.name}</span>
          <div class="admin-controls">
            <span class="admin-pts">${precise(h.pts)}</span>
            <input type="number" placeholder="set"
              style="width:64px;padding:3px 6px;border-radius:6px;border:1px solid #ddd;font-family:'Courier Prime', 'Courier New', monospace;font-size:0.9rem;"
              onchange="setHouseScore('${h.id}', this.value); this.value='';">
          </div>
        </div>`).join("")}
        </div>
      <div class="admin-section" style="margin-top:1.5rem">
        <div class="admin-heading">Team scores</div>
        ${teamsSorted.map(t => `<div class="admin-row">
          <span class="admin-name" style="color:${t.colorLight}">${t.name}</span>
          <div class="admin-controls">
            <span class="admin-pts">${precise(t.pts)}</span>
            <input type="number" placeholder="set"
              style="width:64px;padding:3px 6px;border-radius:6px;border:1px solid #ddd;font-family:'Courier Prime', 'Courier New', monospace;font-size:0.9rem;"
              onchange="setTeamScore('${t.id}', this.value); this.value='';">
          </div>
        </div>`).join("")}
      </div>
    </div>`;
}

// ============================================================
//  SCORE UPDATES
// ============================================================
window.precise = function (pts) {
  if (pts === 0) return "0.00";
  const digits = Math.floor(Math.log10(Math.abs(pts)) + 1);
  return pts.toPrecision(digits + 2);
};

window.setTeamScore = async function (id, value) {
  const parsed = parseFloat(parseFloat(value).toFixed(2));
  if (isNaN(parsed) || parsed < 0) return;
  const currentTotal = teams[id].pts;
  await adjustTeam(id, parsed - currentTotal);
};

window.setHouseScore = async function (id, value) {
  const parsed = parseFloat(parseFloat(value).toFixed(2));
  if (isNaN(parsed) || parsed < 0) return;
  const currentTotal = houses[id].pts;
  await adjustHouse(id, parsed - currentTotal);
};

window.setIndScore = async function (id, value) {
  const parsed = parseFloat(parseFloat(value).toFixed(2));
  if (isNaN(parsed) || parsed < 0) return;
  const currentTotal = players[id].pts;
  await adjustPlayer(id, parsed - currentTotal);
};

async function syncTeamScores() {
  if (Object.keys(houses).length === 0) return;
  const totals = {};
  Object.values(houses).forEach(h => {
    if (!h.team) return;
    totals[h.team] = (totals[h.team] || 0) + h.pts;
  })
  for (const [team, total] of Object.entries(totals)) {
    await updateDoc(doc(db, "teams", team), { pts: total });
  }
}

async function syncHouseScores() {
  if (Object.keys(players).length === 0) return;
  const totals = {};
  Object.values(players).forEach(p => {
    if (!p.house) return;
    totals[p.house] = (totals[p.house] || 0) + p.pts;
  });
  for (const [house, total] of Object.entries(totals)) {
    await updateDoc(doc(db, "houses", house), { pts: total });
  }
}

window.adjustPlayer = async function (id, delta) {
  const current = players[id].pts;
  const next = current + delta;
  await updateDoc(doc(db, "players", id), { pts: next });
  await syncHouseScores();
  await syncTeamScores();
};

window.adjustHouse = async function (id, delta) {
  const current = houses[id].pts;
  const members = Object.values(players).filter(p => p.house === id);
  const perMember = Math.round(delta / members.length);
  for (const p of members) {
    const next = p.pts + perMember;
    await updateDoc(doc(db, "players", p.id), { pts: next });
  }
  await updateDoc(doc(db, "houses", id), { pts: (current + delta) });
  await syncTeamScores();
};

window.adjustTeam = async function (id, delta) {
  const current = teams[id].pts;
  const members = Object.values(houses).filter(h => h.team === id);
  const perMember = delta / members.length;
  for (const h of members) {
    await adjustHouse(h.id, perMember);
  }
  // await updateDoc(doc(db, "teams", id), { pts: (current + delta) });
};

// ============================================================
//  TAB SWITCHING
// ============================================================
window.showTab = function (tab) {
  currentTab = tab;
  document.getElementById("board-ind").style.display = tab === "ind" ? "flex" : "none";
  document.getElementById("board-house").style.display = tab === "house" ? "flex" : "none";
  document.getElementById("board-team").style.display = tab === "team" ? "flex" : "none";
  document.getElementById("tab-ind").className = "tab" + (tab === "ind" ? " active-ind" : "");
  document.getElementById("tab-house").className = "tab" + (tab === "house" ? " active-house" : "");
  document.getElementById("tab-team").className = "tab" + (tab === "team" ? " active-team" : "");
};

// ============================================================
//  ADMIN PANEL
// ============================================================
window.openAdmin = function () {
  const pin = document.getElementById("pin-input").value;
  if (pin !== ADMIN_PIN) {
    document.getElementById("pin-error").style.display = "block";
    return;
  }
  document.getElementById("pin-error").style.display = "none";
  document.getElementById("pin-gate").style.display = "none";
  adminOpen = true;
  document.getElementById("admin-panel").style.display = "block";
  renderAdmin();
};

window.closeAdmin = function () {
  adminOpen = false;
  document.getElementById("admin-panel").style.display = "none";
  document.getElementById("pin-gate").style.display = "flex";
  document.getElementById("pin-input").value = "";
};

window.toggleAdminDrawer = function () {
  const drawer = document.getElementById("admin-drawer");
  drawer.style.display = drawer.style.display === "none" ? "block" : "none";
  if (drawer.style.display === "none") closeAdmin();
};

// ============================================================
//  LIVE LISTENERS
// ============================================================
function listenTeams() {
  onSnapshot(collection(db, "teams"), snap => {
    snap.forEach(d => { teams[d.id] = { id: d.id, ...d.data() }; });
    renderBoard();
  })
}

function listenHouses() {
  onSnapshot(collection(db, "houses"), snap => {
    snap.forEach(d => { houses[d.id] = { id: d.id, ...d.data() }; });
    renderBoard();
  });
}

function listenPlayers() {
  onSnapshot(collection(db, "players"), snap => {
    snap.forEach(d => { players[d.id] = { id: d.id, ...d.data() }; });
    renderBoard();
  });
}

// ============================================================
//  INIT
// ============================================================
async function init() {
  document.getElementById("loading").style.display = "flex";
  // await seedIfNeeded();
  listenTeams();
  listenHouses();
  listenPlayers();
  document.getElementById("loading").style.display = "none";
}

init();