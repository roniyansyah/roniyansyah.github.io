// ================= 1. PWA SERVICE WORKER REGISTRATION =================
// Ganti bagian paling atas game.js dengan ini:
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/bimbelss/sw.js', { scope: '/bimbelss/' })
        .then(() => console.log("PWA: Service Worker Active di /bimbelss/"))
        .catch((err) => console.error("PWA: Error", err));
}

// ================= 2. STATE MANAGEMENT =================
let gameConfig = { currentGame: 0, mode: '', selectedTable: 1, duration: 30, timeMode: 'countdown', g4BaseSize: 3, g5Op: '+', g5WinTarget: 5 };
let gameSession = { questions: [], currentIndex: 0, score: 0, timeRemaining: 0, timeElapsed: 0, endTime: 0, timerInterval: null };
let memorySession = { level: 1, gridSize: 3, tilesToFlash: 3, winningSequence: [], userSequence: [] };
let battleSession = { p1Score: 0, p2Score: 0, currentQuestionText: '', currentAnswer: 0, options: [] };
let selectedLeftCard = null, selectedRightCard = null;

// ================= 3. SPA NAVIGATION =================
function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) { target.classList.add('active'); window.scrollTo(0, 0); }
}
function backFromSettings() { if (gameConfig.currentGame === 1) navigateTo('screen-game1-materi'); else navigateTo('screen-home'); }

// Generate Game 1 Grid
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById('grid-perkalian');
    if (grid) {
        for (let i = 1; i <= 30; i++) {
            const btn = document.createElement('button');
            btn.className = 'btn-num'; btn.innerText = `x${i}`;
            btn.onclick = () => { gameConfig.selectedTable = i; showTableDetail(i); };
            grid.appendChild(btn);
        }
    }
});

function showTableDetail(num) {
    const list = document.getElementById('modal-list-angka');
    list.innerHTML = '';
    document.getElementById('modal-title').innerText = `Tabel Perkalian x${num}`;
    for (let i = 1; i <= 10; i++) list.innerHTML += `${i} x ${num} = <b>${i * num}</b><br>`;
    document.getElementById('modal-tabel-detail').classList.remove('hidden');
}
function closeModal() { document.getElementById('modal-tabel-detail').classList.add('hidden'); }
function startGame1Setup(mode) { closeModal(); gameConfig.currentGame = 1; gameConfig.mode = mode; openGameSettings(1); }

// ================= 4. DYNAMIC SETTINGS =================
function openGameSettings(gameId) {
    gameConfig.currentGame = gameId; navigateTo('screen-settings');
    const title = document.getElementById('settings-title');
    const container = document.getElementById('dynamic-settings-fields');
    container.innerHTML = ''; document.getElementById('setting-duration').value = 30;

    if (gameId === 1) {
        title.innerText = `Game 1 (${gameConfig.mode === 'multiply' ? 'Perkalian' : 'Pembagian'} x${gameConfig.selectedTable})`;
        container.innerHTML = `<div class="setting-group"><label>Cakupan Soal</label>
        <label><input type="radio" name="g1-range" value="single" checked> Hanya x${gameConfig.selectedTable}</label><br>
        <label><input type="radio" name="g1-range" value="mixed"> Acak x1 s/d x${gameConfig.selectedTable}</label></div><input type="hidden" id="setting-questions" value="10">`;
    } else if (gameId === 2) {
        title.innerText = "Game 2 (Count Training)";
        container.innerHTML = `<div class="setting-group"><label>Operasi (Bisa pilih > 1)</label>
        <input type="checkbox" class="g2-op" value="+" checked> +  <input type="checkbox" class="g2-op" value="-"> -  <input type="checkbox" class="g2-op" value="*"> ×  <input type="checkbox" class="g2-op" value="/"> ÷</div>
        <div class="setting-group"><label>Rentang Angka (1-1000)</label><div class="flex-row"><input type="number" id="g2-min" value="1"><span>s/d</span><input type="number" id="g2-max" value="30"></div></div>
        <div class="setting-group"><label>Tipe Game</label><select id="g2-type"><option value="input">Isian</option><option value="mcq">Pilihan Ganda</option><option value="tf">True/False</option></select></div>
        <div class="setting-group"><label>Mode Waktu</label><select id="g2-time-mode"><option value="countdown">Hitung Mundur</option><option value="stopwatch">Stopwatch</option></select></div>
        <div class="setting-group"><label>Jumlah Soal</label><input type="number" id="setting-questions" value="10"></div>`;
    } else if (gameId === 3) {
        title.innerText = "Game 3 (Squared Matching)";
        container.innerHTML = `<div class="setting-group"><label>Rentang Pangkat</label><div class="flex-row"><input type="number" id="g3-min" value="1"><span>s/d</span><input type="number" id="g3-max" value="12"></div></div>
        <div class="setting-group"><label>Jumlah Pasangan Kartu</label><select id="g3-pairs"><option value="4">4 Pasang</option><option value="5" selected>5 Pasang</option><option value="6">6 Pasang</option></select></div><input type="hidden" id="setting-questions" value="999">`;
    } else if (gameId === 4) {
        title.innerText = "Game 4 (Power Memories)";
        container.innerHTML = `<div class="setting-group"><label>Grid Awal</label><select id="g4-grid-size"><option value="3">3 x 3</option><option value="4">4 x 4</option></select></div><input type="hidden" id="setting-questions" value="999">`;
    } else if (gameId === 5) {
        title.innerText = "Game 5 (Arena Battle)";
        container.innerHTML = `<div class="setting-group"><label>Operasi Duel</label><select id="g5-op"><option value="+">+</option><option value="-">-</option><option value="*">×</option><option value="mixed">Campuran</option></select></div>
        <div class="setting-group"><label>Target Menang (Skor)</label><input type="number" id="setting-questions" value="5"></div>`;
    }
}

// ================= 5. GAME LAUNCHER & GENERATOR =================
function launchGame() {
    let dur = parseInt(document.getElementById('setting-duration').value) || 30;
    gameConfig.duration = dur < 30 ? 30 : dur;
    let totalQ = parseInt(document.getElementById('setting-questions').value) || 10;
    
    gameSession.questions = []; gameSession.currentIndex = 0; gameSession.score = 0;

    if (gameConfig.currentGame === 1) {
        const range = document.querySelector('input[name="g1-range"]:checked').value;
        for (let i = 0; i < totalQ; i++) {
            let tNum = range === 'mixed' ? Math.floor(Math.random() * gameConfig.selectedTable) + 1 : gameConfig.selectedTable;
            let mult = Math.floor(Math.random() * 10) + 1;
            if (gameConfig.mode === 'multiply') gameSession.questions.push({ question: `${mult} × ${tNum} = ?`, answer: mult * tNum, type: 'input' });
            else gameSession.questions.push({ question: `${mult * tNum} ÷ ${tNum} = ?`, answer: mult, type: 'input' });
        }
        gameConfig.timeMode = 'countdown';
    } 
    else if (gameConfig.currentGame === 2) {
        let ops = Array.from(document.querySelectorAll('.g2-op:checked')).map(cb => cb.value); if (ops.length === 0) ops = ['+'];
        let min = parseInt(document.getElementById('g2-min').value) || 1, max = parseInt(document.getElementById('g2-max').value) || 30;
        let g2Type = document.getElementById('g2-type').value; gameConfig.timeMode = document.getElementById('g2-time-mode').value;

        for (let i = 0; i < totalQ; i++) {
            let op = ops[Math.floor(Math.random() * ops.length)], a = Math.floor(Math.random() * (max - min + 1)) + min, b = Math.floor(Math.random() * (max - min + 1)) + min;
            let txt = '', ans = 0;
            if (op === '+') { txt = `${a} + ${b} = ?`; ans = a + b; }
            else if (op === '-') { if (a < b) { let t = a; a = b; b = t; } txt = `${a} - ${b} = ?`; ans = a - b; }
            else if (op === '*') { txt = `${a} × ${b} = ?`; ans = a * b; }
            else if (op === '/') { txt = `${a * b} ÷ ${a} = ?`; ans = b; }

            let opts = [], dQ = txt;
            if (g2Type === 'mcq') opts = generateMCQOptions(ans);
            else if (g2Type === 'tf') { let isT = Math.random() >= 0.5, fAns = ans + (Math.random() >= 0.5 ? 2 : -2); if (fAns === ans) fAns++; dQ = `${txt.replace('=?','')} = ${isT ? ans : fAns}`; ans = isT ? 'B' : 'S'; }
            gameSession.questions.push({ question: dQ, answer: ans, type: g2Type, options: opts });
        }
    }
    else if (gameConfig.currentGame === 3) {
        gameConfig.timeMode = 'countdown';
        let min = parseInt(document.getElementById('g3-min').value) || 1, max = parseInt(document.getElementById('g3-max').value) || 12, pairs = parseInt(document.getElementById('g3-pairs').value) || 5;
        let set = new Set(); while(set.size < Math.min(pairs, max - min + 1)) set.add(Math.floor(Math.random() * (max - min + 1)) + min);
        gameSession.questions = Array.from(set).map(n => ({ base: n, squared: n * n }));
    }
    else if (gameConfig.currentGame === 4) {
        gameConfig.timeMode = 'countdown'; gameConfig.g4BaseSize = parseInt(document.getElementById('g4-grid-size').value) || 3;
        memorySession.level = 1; memorySession.gridSize = gameConfig.g4BaseSize; memorySession.tilesToFlash = gameConfig.g4BaseSize;
        gameSession.questions = [1];
    }
    else if (gameConfig.currentGame === 5) {
        gameConfig.timeMode = 'stopwatch'; gameConfig.g5Op = document.getElementById('g5-op').value; gameConfig.g5WinTarget = totalQ;
        battleSession.p1Score = 0; battleSession.p2Score = 0; generateBattleQuestion();
    }

    navigateTo('screen-gameplay'); initTimer();
    if (gameConfig.currentGame === 3) renderGame3(); else if (gameConfig.currentGame === 4) renderGame4(); else if (gameConfig.currentGame === 5) renderGame5(); else renderQuestion();
}

function generateMCQOptions(ans) {
    let opts = new Set([ans]); while(opts.size < 4) { let offset = Math.floor(Math.random() * 11) - 5; if (ans + offset >= 0) opts.add(ans + offset); }
    return Array.from(opts).sort(() => Math.random() - 0.5);
}

// ================= 6. CORE TIMER ENGINE =================
function initTimer() {
    clearInterval(gameSession.timerInterval);
    if (gameConfig.timeMode === 'countdown') {
        gameSession.timeRemaining = gameConfig.duration; gameSession.endTime = Date.now() + (gameConfig.duration * 1000);
        gameSession.timerInterval = setInterval(() => {
            let rem = Math.round((gameSession.endTime - Date.now()) / 1000);
            if (rem <= 0) { gameSession.timeRemaining = 0; endGame(); } else { gameSession.timeRemaining = rem; updateTimerUI(); }
        }, 200);
    } else {
        gameSession.timeElapsed = 0; let start = Date.now();
        gameSession.timerInterval = setInterval(() => { gameSession.timeElapsed = Math.floor((Date.now() - start) / 1000); if (gameSession.timeElapsed >= 3600) endGame(); updateTimerUI(); }, 1000);
    }
}
function updateTimerUI() {
    const badge = document.getElementById('timer-badge'); if (!badge) return;
    if (gameConfig.timeMode === 'countdown') { badge.innerText = `⏱️ ${gameSession.timeRemaining}s`; badge.style.color = gameSession.timeRemaining <= 5 ? '#e76f51' : 'inherit'; }
    else { let m = Math.floor(gameSession.timeElapsed / 60).toString().padStart(2, '0'), s = (gameSession.timeElapsed % 60).toString().padStart(2, '0'); badge.innerText = `⏱️ ${m}:${s}`; }
}

// ================= 7. RENDER GAMEPLAY & SUBMIT =================
function renderQuestion() {
    const arena = document.getElementById('gameplay-arena'); const q = gameSession.questions[gameSession.currentIndex];
    let tHTML = `<div style="display:flex; justify-content:space-between; margin-bottom:20px; font-weight:bold;"><span>Soal: ${gameSession.currentIndex + 1}/${gameSession.questions.length}</span><span id="timer-badge">⏱️ --</span></div>`;
    let qHTML = `<h2 style="font-size:2.5rem; text-align:center; margin:40px 0;">${q.question}</h2>`, iHTML = '';

    if (q.type === 'input') {
        iHTML = `<input type="number" id="user-answer" class="game-input" inputmode="numeric" style="width:100%; padding:15px; font-size:1.5rem; text-align:center; border:3px solid #2a9d8f; border-radius:12px; margin-bottom:20px;" autofocus>
        <button class="btn btn-primary" onclick="submitAnswer()">KIRIM JAWABAN</button>`;
    } else if (q.type === 'mcq') {
        iHTML = `<div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">`;
        q.options.forEach(opt => { iHTML += `<button class="btn btn-secondary" onclick="submitAnswer(${opt})" style="font-size:1.3rem; padding:15px; margin:0;">${opt}</button>`; });
        iHTML += `</div>`;
    } else if (q.type === 'tf') {
        iHTML = `<div style="display:flex; gap:15px;"><button class="btn btn-primary" onclick="submitAnswer('B')" style="font-size:1.5rem; padding:15px;">BENAR</button><button class="btn btn-danger" onclick="submitAnswer('S')" style="font-size:1.5rem; padding:15px;">SALAH</button></div>`;
    }
    arena.innerHTML = tHTML + qHTML + iHTML; updateTimerUI();
    if (q.type === 'input') { setTimeout(() => document.getElementById('user-answer').focus(), 50); document.getElementById('user-answer').addEventListener('keypress', (e) => { if (e.key === 'Enter') submitAnswer(); }); }
}

function submitAnswer(chosen = null) {
    const q = gameSession.questions[gameSession.currentIndex];
    let userAns = q.type === 'input' ? parseInt(document.getElementById('user-answer').value) : chosen;
    if (userAns === q.answer) gameSession.score++;
    gameSession.currentIndex++; if (gameSession.currentIndex < gameSession.questions.length) renderQuestion(); else endGame();
}

// --- GAME 3 RUNTIME ---
function renderGame3() {
    const arena = document.getElementById('gameplay-arena');
    let tHTML = `<div style="display:flex; justify-content:space-between; margin-bottom:20px; font-weight:bold;"><span>Squared Matching</span><span id="timer-badge">⏱️ --</span></div>`;
    let left = gameSession.questions.map(q => ({ val: q.base, matchId: q.base })).sort(() => Math.random() - 0.5);
    let right = gameSession.questions.map(q => ({ val: q.squared, matchId: q.base })).sort(() => Math.random() - 0.5);
    let lHTML = `<div class="match-column"><h3>Bilangan</h3>`, rHTML = `<div class="match-column"><h3>Hasil</h3>`;
    left.forEach(i => lHTML += `<div class="match-card" id="left-${i.matchId}" onclick="selectLeft(${i.matchId})">${i.val}²</div>`);
    right.forEach(i => rHTML += `<div class="match-card" id="right-${i.matchId}" onclick="selectRight(${i.matchId})">${i.val}</div>`);
    arena.innerHTML = tHTML + `<div class="matching-container">${lHTML + '</div>' + rHTML + '</div>'}</div>`;
    updateTimerUI(); selectedLeftCard = null; selectedRightCard = null;
}
function selectLeft(id) { if (selectedLeftCard) document.getElementById(`left-${selectedLeftCard}`).classList.remove('selected'); selectedLeftCard = id; document.getElementById(`left-${id}`).classList.add('selected'); checkMatch(); }
function selectRight(id) { if (selectedRightCard) document.getElementById(`right-${selectedRightCard}`).classList.remove('selected'); selectedRightCard = id; document.getElementById(`right-${id}`).classList.add('selected'); checkMatch(); }
function checkMatch() {
    if (selectedLeftCard !== null && selectedRightCard !== null) {
        let lEl = document.getElementById(`left-${selectedLeftCard}`), rEl = document.getElementById(`right-${selectedRightCard}`);
        if (selectedLeftCard === selectedRightCard) { lEl.className = 'match-card correct'; rEl.className = 'match-card correct'; gameSession.score++; if (document.querySelectorAll('.match-card.correct').length === gameSession.questions.length * 2) setTimeout(endGame, 400); }
        else { lEl.classList.add('wrong'); rEl.classList.add('wrong'); let cl = selectedLeftCard, cr = selectedRightCard; setTimeout(() => { let l = document.getElementById(`left-${cl}`), r = document.getElementById(`right-${cr}`); if(l&&l.classList.contains('wrong')) l.className='match-card'; if(r&&r.classList.contains('wrong')) r.className='match-card'; }, 500); }
        selectedLeftCard = null; selectedRightCard = null;
    }
}

// --- GAME 4 RUNTIME ---
function renderGame4() {
    const arena = document.getElementById('gameplay-arena');
    let tHTML = `<div style="display:flex; justify-content:space-between; margin-bottom:15px; font-weight:bold;"><span>Level: ${memorySession.level} (Skor: ${gameSession.score})</span><span id="timer-badge">⏱️ --</span></div><p id="memory-instruction" style="text-align:center; font-weight:bold; margin-bottom:10px;">Perhatikan Kotak Menyala! 👀</p>`;
    let gHTML = `<div id="m-grid" class="memory-grid grid-locked" style="grid-template-columns: repeat(${memorySession.gridSize}, 1fr);">`, total = memorySession.gridSize * memorySession.gridSize;
    for (let i = 0; i < total; i++) gHTML += `<div class="memory-tile" id="tile-${i}" onclick="clickMemoryTile(${i})"></div>`;
    arena.innerHTML = tHTML + gHTML + `</div>`; updateTimerUI();
    memorySession.winningSequence = []; memorySession.userSequence = [];
    while (memorySession.winningSequence.length < memorySession.tilesToFlash) { let r = Math.floor(Math.random() * total); if (!memorySession.winningSequence.includes(r)) memorySession.winningSequence.push(r); }
    setTimeout(() => {
        memorySession.winningSequence.forEach(idx => document.getElementById(`tile-${idx}`).classList.add('flash'));
        setTimeout(() => {
            memorySession.winningSequence.forEach(idx => { const el = document.getElementById(`tile-${idx}`); if(el) el.classList.remove('flash'); });
            const g = document.getElementById('m-grid'); if (g) { g.classList.remove('grid-locked'); document.getElementById('memory-instruction').innerText = "Ketuk Kotak Tadi! 🧠"; }
        }, 1500);
    }, 500);
}
function clickMemoryTile(idx) {
    if (memorySession.userSequence.includes(idx)) return;
    const el = document.getElementById(`tile-${idx}`);
    if (memorySession.winningSequence.includes(idx)) {
        el.classList.add('correct'); memorySession.userSequence.push(idx); gameSession.score++;
        if (memorySession.userSequence.length === memorySession.winningSequence.length) {
            document.getElementById('m-grid').classList.add('grid-locked'); document.getElementById('memory-instruction').innerText = "Benar Semua! 🎉";
            memorySession.level++; memorySession.tilesToFlash++;
            if (memorySession.tilesToFlash > Math.floor((memorySession.gridSize * memorySession.gridSize) * 0.6) && memorySession.gridSize < 5) { memorySession.gridSize++; memorySession.tilesToFlash = memorySession.gridSize; }
            setTimeout(renderGame4, 1200);
        }
    } else {
        el.classList.add('wrong'); document.getElementById('m-grid').classList.add('grid-locked'); document.getElementById('memory-instruction').innerText = "Gagal! Mengulang... ❌";
        memorySession.winningSequence.forEach(i => document.getElementById(`tile-${i}`).classList.add('correct'));
        setTimeout(renderGame4, 1800);
    }
}

// --- GAME 5 RUNTIME ---
function generateBattleQuestion() {
    let ops = ['+', '-', '*'], op = gameConfig.g5Op === 'mixed' ? ops[Math.floor(Math.random() * ops.length)] : gameConfig.g5Op;
    let a = Math.floor(Math.random() * 15) + 2, b = Math.floor(Math.random() * 15) + 2;
    if (op === '+') { battleSession.currentQuestionText = `${a} + ${b}`; battleSession.currentAnswer = a + b; }
    else if (op === '-') { if (a < b) { let t = a; a = b; b = t; } battleSession.currentQuestionText = `${a} - ${b}`; battleSession.currentAnswer = a - b; }
    else if (op === '*') { battleSession.currentQuestionText = `${a} × ${b}`; battleSession.currentAnswer = a * b; }
    battleSession.options = generateMCQOptions(battleSession.currentAnswer);
}
function renderGame5() {
    const arena = document.getElementById('gameplay-arena'); let isL = window.innerWidth > window.innerHeight; let rClass = isL ? "" : "mode-portrait";
    let tHTML = `<div 