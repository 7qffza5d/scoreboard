// ============================================================
//  FIREBASE CONFIGURATION
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

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
    { id: "red", name: "Red Hawks", colorLight: "#FAECE7", colorDark: "#712B13", colorText: "#993C1D", pts: 410 },
    { id: "blue", name: "Blue Dolphins", colorLight: "#E6F1FB", colorDark: "#0C447C", colorText: "#185FA5", pts: 390 },
    { id: "green", name: "Green Foxes", colorLight: "#EAF3DE", colorDark: "#27500A", colorText: "#3B6D11", pts: 375 },
    { id: "amber", name: "Gold Bears", colorLight: "#FAEEDA", colorDark: "#633806", colorText: "#854F0B", pts: 355 },
    { id: "purple", name: "Purple Owls", colorLight: "#EEEDFE", colorDark: "#3C3489", colorText: "#534AB7", pts: 340 },
    { id: "teal", name: "Teal Turtles", colorLight: "#E1F5EE", colorDark: "#085041", colorText: "#0F6E56", pts: 300 },
];

const INITIAL_PLAYERS = [
    { id: "aaliyah-m", name: "Aaliyah M.", team: "", pts: 0, photo: "" },
    { id: "jordan-k", name: "Jordan K.", team: "", pts: 0, photo: "" },
    { id: "sam-t", name: "Sam T.", team: "", pts: 0, photo: "" },
    { id: "morgan-b", name: "Morgan B.", team: "", pts: 0, photo: "" },
    { id: "casey-l", name: "Casey L.", team: "", pts: 0, photo: "" },
    { id: "riley-p", name: "Riley P.", team: "", pts: 0, photo: "" },
    { id: "avery-w", name: "Avery W.", team: "", pts: 0, photo: "" },
    { id: "quinn-s", name: "Quinn S.", team: "", pts: 0, photo: "" },
    { id: "taylor-n", name: "Taylor N.", team: "", pts: 0, photo: "" },
    { id: "drew-c", name: "Drew C.", team: "", pts: 0, photo: "" },
    { id: "skylar-j", name: "Skylar J.", team: "", pts: 0, photo: "" },
    { id: "finley-r", name: "Finley R.", team: "", pts: 0, photo: "" },
    { id: "rowan-a", name: "Rowan A.", team: "", pts: 0, photo: "" },
    { id: "blake-v", name: "Blake V.", team: "", pts: 0, photo: "" },
    { id: "emery-h", name: "Emery H.", team: "", pts: 0, photo: "" },
    { id: "cameron-d", name: "Cameron D.", team: "", pts: 0, photo: "" },
    { id: "logan-m", name: "Logan M.", team: "", pts: 0, photo: "" },
    { id: "parker-g", name: "Parker G.", team: "", pts: 0, photo: "" },
    { id: "peyton-f", name: "Peyton F.", team: "", pts: 0, photo: "" },
    { id: "reese-o", name: "Reese O.", team: "", pts: 0, photo: "" },
    { id: "harlow-z", name: "Harlow Z.", team: "", pts: 0, photo: "" },
    { id: "sage-x", name: "Sage X.", team: "", pts: 0, photo: "" },
    { id: "elliot-q", name: "Elliot Q.", team: "", pts: 0, photo: "" },
    { id: "phoenix-y", name: "Phoenix Y.", team: "", pts: 0, photo: "" },
    { id: "nova-i", name: "Nova I.", team: "", pts: 0, photo: "" },
    { id: "river-e", name: "River E.", team: "", pts: 0, photo: "" },
    { id: "sunny-u", name: "Sunny U.", team: "", pts: 0, photo: "" },
    { id: "indigo-p", name: "Indigo P.", team: "", pts: 0, photo: "" },
    { id: "wren-l", name: "Wren L.", team: "", pts: 0, photo: "" },
    { id: "zephyr-k", name: "Zephyr K.", team: "", pts: 0, photo: "" },
];

// ============================================================
//  SEED (runs once per doc if it doesn't exist yet)
// ============================================================
async function seedIfNeeded() {
    for (const t of INITIAL_TEAMS) {
        const ref = doc(db, "teams", t.id);
        const snap = await getDoc(ref);
        if (!snap.exists()) await setDoc(ref, t);
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
let players = {};
let currentTab = "ind";
let adminOpen = false;

// ============================================================
//  RENDER
// ============================================================
const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

function initials(name) {
    return name.split(" ").map(w => w[0]).join("");
}

function medal(r) {
    return r === 1 ? "🥇" : r === 2 ? "🥈" : r === 3 ? "🥉" : "";
}

function avatarHTML(player, team) {
    const bg = dark ? team.colorDark : team.colorLight;
    const color = team.colorText;
    if (player.photo) {
        return `<div class="avatar"><img src="${player.photo}" alt="${player.name}"></div>`;
    }
    return `<div class="avatar" style="background:${bg};color:${color}">${initials(player.name)}</div>`;
}

function renderBoard() {
    renderInd();
    renderTeam();
    renderAdmin();
}

function renderInd() {
    const sorted = Object.values(players).sort((a, b) => b.pts - a.pts);
    const board = document.getElementById("board-ind");
    if (!board) return;
    board.innerHTML = sorted.map((p, i) => {
        const t = teams[p.team] || {};
        const r = i + 1;
        const bg = dark ? t.colorDark : t.colorLight;
        return `<div class="row" style="background:${bg}">
        <span class="rank-num" style="color:${t.colorText}">${medal(r) || r}</span>
        ${avatarHTML(p, t)}
        <div class="info">
          <div class="pname" style="color:${t.colorText}">${p.name}</div>
          <div class="psub">${t.name || ""}</div>
        </div>
        <div class="pts-wrap">
          <span class="pts-big" style="color:${t.colorText}">${p.pts}</span>
          <span class="pts-lbl">pts</span>
        </div>
      </div>`;
    }).join("");
}

function renderTeam() {
    const sorted = Object.values(teams).sort((a, b) => b.pts - a.pts);
    const board = document.getElementById("board-team");
    if (!board) return;
    board.innerHTML = sorted.map((t, i) => {
        const r = i + 1;
        const bg = dark ? t.colorDark : t.colorLight;
        return `<div class="row" style="background:${bg}">
        <span class="rank-num" style="color:${t.colorText}">${medal(r) || r}</span>
        <div class="avatar" style="background:${bg};color:${t.colorText};font-size:1.3rem;border:2px solid ${t.colorText}">&#9733;</div>
        <div class="info">
          <div class="pname" style="color:${t.colorText};font-size:1.05rem">${t.name}</div>
          <div class="psub">Team total</div>
        </div>
        <div class="pts-wrap">
          <span class="pts-big" style="color:${t.colorText}">${t.pts}</span>
          <span class="pts-lbl">pts</span>
        </div>
      </div>`;
    }).join("");
}

function renderAdmin() {
    const panel = document.getElementById("admin-panel");
    if (!panel || !adminOpen) return;

    const playersSorted = Object.values(players).sort((a, b) => a.name.localeCompare(b.name));
    const teamsSorted = Object.values(teams).sort((a, b) => a.name.localeCompare(b.name));

    panel.innerHTML = `
      <div class="admin-section">
        <div class="admin-heading">Individual scores</div>
        ${playersSorted.map(p => {
        const t = teams[p.team] || {};
        return `<div class="admin-row">
            <span class="admin-name">${p.name}</span>
            <span class="admin-team" style="color:${t.colorText}">${t.name || ""}</span>
            <div class="admin-controls">
              <button class="adj-btn" onclick="adjustPlayer('${p.id}',-5)">−5</button>
              <button class="adj-btn" onclick="adjustPlayer('${p.id}',-1)">−1</button>
              <span class="admin-pts">${p.pts}</span>
              <button class="adj-btn" onclick="adjustPlayer('${p.id}',1)">+1</button>
              <button class="adj-btn" onclick="adjustPlayer('${p.id}',5)">+5</button>
            </div>
          </div>`;
    }).join("")}
      </div>
      <div class="admin-section" style="margin-top:1.5rem">
        <div class="admin-heading">Team scores</div>
        ${teamsSorted.map(t => `<div class="admin-row">
          <span class="admin-name" style="color:${t.colorText}">${t.name}</span>
          <div class="admin-controls">
            <button class="adj-btn" onclick="adjustTeam('${t.id}',-10)">−10</button>
            <button class="adj-btn" onclick="adjustTeam('${t.id}',-5)">−5</button>
            <span class="admin-pts">${t.pts}</span>
            <button class="adj-btn" onclick="adjustTeam('${t.id}',5)">+5</button>
            <button class="adj-btn" onclick="adjustTeam('${t.id}',10)">+10</button>
          </div>
        </div>`).join("")}
      </div>`;
}

// ============================================================
//  SCORE UPDATES
// ============================================================
window.adjustPlayer = async function (id, delta) {
    const current = players[id].pts;
    const next = Math.max(0, current + delta);
    await updateDoc(doc(db, "players", id), { pts: next });
};

window.adjustTeam = async function (id, delta) {
    const current = teams[id].pts;
    const next = Math.max(0, current + delta);
    await updateDoc(doc(db, "teams", id), { pts: next });
};

// ============================================================
//  TAB SWITCHING
// ============================================================
window.showTab = function (tab) {
    currentTab = tab;
    document.getElementById("board-ind").style.display = tab === "ind" ? "flex" : "none";
    document.getElementById("board-team").style.display = tab === "team" ? "flex" : "none";
    document.getElementById("tab-ind").className = "tab" + (tab === "ind" ? " active-ind" : "");
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
    await seedIfNeeded();
    listenTeams();
    listenPlayers();
    document.getElementById("loading").style.display = "none";
}

init();