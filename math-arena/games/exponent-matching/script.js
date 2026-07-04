// ==========================================
// EXPONENT MATCHING
// Part 1
// ==========================================

const app = document.getElementById("app");

const state = {

    dataset: [],
    pairs: [],

    leftSelected: null,
    rightSelected: null,

    score: 0,
    wrong: 0,

    duration: 60,
    timeLeft: 60,

    totalQuestion: 10,

    timer: null,

    settings:{

        power:true,
        root:true,
        fraction:true,
        logarithm:true,

        bases:[2,3,4,5,6,7,8,9],

        exponents:[2,3,4,5]

    }

};

// ==========================================
// START
// ==========================================

renderSettingScreen();

// ==========================================
// SETTING
// ==========================================

function renderSettingScreen(){

    app.innerHTML=`

    <div class="card setting-card">

        <h2>Pengaturan</h2>

        <div class="setting">

            <label>Materi</label>

            <div class="checkbox-grid">

                <label class="checkbox-item">
                    <input type="checkbox" id="power" checked> Pangkat (x²)
                </label>

                <label class="checkbox-item">
                    <input type="checkbox" id="root" checked> Akar (√x)
                </label>

                <label class="checkbox-item">
                    <input type="checkbox" id="fraction" checked> Pangkat Pecahan
                </label>

                <label class="checkbox-item">
                    <input type="checkbox" id="logarithm" checked> Logaritma
                </label>

            </div>

        </div>

        <div class="setting">

            <label>Angka Basis yang Muncul</label>

            <div class="checkbox-grid">

                <label class="checkbox-item">
                    <input type="checkbox" class="base-checkbox" value="2" checked> Angka 2
                </label>

                <label class="checkbox-item">
                    <input type="checkbox" class="base-checkbox" value="3" checked> Angka 3
                </label>

                <label class="checkbox-item">
                    <input type="checkbox" class="base-checkbox" value="4" checked> Angka 4
                </label>

                <label class="checkbox-item">
                    <input type="checkbox" class="base-checkbox" value="5" checked> Angka 5
                </label>

                <label class="checkbox-item">
                    <input type="checkbox" class="base-checkbox" value="6" checked> Angka 6
                </label>

                <label class="checkbox-item">
                    <input type="checkbox" class="base-checkbox" value="7" checked> Angka 7
                </label>

                <label class="checkbox-item">
                    <input type="checkbox" class="base-checkbox" value="8" checked> Angka 8
                </label>

                <label class="checkbox-item">
                    <input type="checkbox" class="base-checkbox" value="9" checked> Angka 9
                </label>

            </div>

        </div>

        <div class="setting">
            <label>Jumlah Soal</label>
            <input type="number" id="questionCount" value="${state.totalQuestion}" min="5" max="30">
        </div>

        <div class="setting">
            <label>Durasi Permainan (Detik)</label>
            <input type="number" id="duration" value="${state.duration}" min="10" max="300">
        </div>

        <div class="action-group">
            <button id="btnStart" class="btn btn-primary">Mulai</button>
        </div>

    </div>

    `;

    bindSetting();

}
// ==========================================
// MATERIAL SCREEN
// ==========================================

function renderMaterialScreen(){
    app.innerHTML = `
    <div class="card setting-card">
        <h2>Rangkuman Materi</h2>
        
        <div class="materi-list">
            ${state.settings.power ? `
            <div class="materi-item">
                <h3>Pangkat</h3>
                <p>Bentuk perkalian berulang.<br>Contoh: <strong>2³ = 2 × 2 × 2 = 8</strong></p>
            </div>` : ''}

            ${state.settings.root ? `
            <div class="materi-item">
                <h3>Akar</h3>
                <p>Kebalikan dari pangkat.<br>Contoh: <strong>³√8 = 2</strong> (karena 2³ = 8)</p>
            </div>` : ''}

            ${state.settings.fraction ? `
            <div class="materi-item">
                <h3>Pangkat Pecahan</h3>
                <p>Bentuk penulisan lain dari akar.<br>Contoh: <strong>8<sup>1/3</sup> = ³√8 = 2</strong></p>
            </div>` : ''}

            ${state.settings.logarithm ? `
            <div class="materi-item">
                <h3>Logaritma</h3>
                <p>Mencari besar pangkat.<br>Contoh: <strong>log<sub>2</sub>8 = 3</strong> (karena 2³ = 8)</p>
            </div>` : ''}
        </div>

        <div class="action-group">
            <button id="btnPlay" class="btn btn-primary">
                LANJUT MAIN
            </button>
            <button id="btnBackSetting" class="btn btn-secondary">
                KEMBALI KE PENGATURAN
            </button>
        </div>
    </div>
    `;

    // Pasang event untuk tombol
    $("#btnPlay").onclick = startGame;
    $("#btnBackSetting").onclick = renderSettingScreen;
}
// ==========================================
// EVENT
// ==========================================

function bindSetting(){

    $("#btnStart").onclick = () => {

        // 1. Simpan pengaturan materi
        state.settings.power = $("#power").checked;
        state.settings.root = $("#root").checked;
        state.settings.fraction = $("#fraction").checked;
        state.settings.logarithm = $("#logarithm").checked;

        // 2. KODE BARU: Ambil semua angka basis yang dicentang oleh user
        const listBases Terpilih = [];
        // Kita gunakan $$ dari common.js untuk mengambil semua yang dicentang
        $$(".base-checkbox:checked").forEach(cb => {
            listBasesTerpilih.push(parseInt(cb.value));
        });

        // Validasi: Cegah user mengosongkan semua pilihan agar tidak error saat bikin soal
        if (listBasesTerpilih.length === 0) {
            alert("Pilih minimal satu angka basis untuk bermain!");
            return; 
        }

        // Masukkan ke dalam state
        state.settings.bases = listBasesTerpilih;

        // 3. Simpan jumlah soal dan durasi
        state.totalQuestion = parseInt($("#questionCount").value);
        state.duration = parseInt($("#duration").value);

        // 4. Lanjutkan ke pembuatan dataset (Layar Hafalan / Mulai Game)
        buildDataset(); 
        shuffle(state.dataset);
        state.pairs = state.dataset.slice(0, state.totalQuestion);

        // Panggil layar berikutnya (misal renderMemorizeScreen atau prepareGame)
        renderMemorizeScreen(); 
    };

}

// ==========================================
// START GAME
// ==========================================

function startGame(){
    // Nilai pengaturan sudah disimpan di bindSetting, 
    // jadi di sini kita tinggal mereset skor dan memulai game
    state.score = 0;
    state.wrong = 0;
    state.leftSelected = null;
    state.rightSelected = null;

    buildDataset();
    prepareGame();
}
// ==========================================
// DATASET
// ==========================================

function buildDataset(){

    state.dataset=[];

    if(state.settings.power){

        createPowerDataset();

    }

    if(state.settings.root){

        createRootDataset();

    }

    if(state.settings.fraction){

        createFractionDataset();

    }

    if(state.settings.logarithm){

        createLogDataset();

    }

}

// ==========================================
// POWER
// ==========================================

function createPowerDataset(){

    state.settings.bases.forEach(base=>{

        state.settings.exponents.forEach(exp=>{

            if(base>2 && exp>5){

                return;

            }

            state.dataset.push({

                type:"power",

                question:`${base}${toSup(exp)}`,

                answer:String(base**exp)

            });

        });

    });

}

// ==========================================
// ROOT
// ==========================================

function createRootDataset(){

    state.settings.bases.forEach(base=>{

        state.settings.exponents.forEach(exp=>{

            if(base>2 && exp>5){

                return;

            }

            const value=base**exp;

            const symbol=exp===2
                ? "√"
                : `${toSup(exp)}√`;

            state.dataset.push({

                type:"root",

                question:`${symbol}${value}`,

                answer:String(base)

            });

        });

    });

}

// ==========================================
// FRACTION POWER
// ==========================================

function createFractionDataset(){

    state.settings.bases.forEach(base=>{

        state.settings.exponents.forEach(exp=>{

            if(base>2 && exp>5){

                return;

            }

            const value=base**exp;

            state.dataset.push({

                type:"fraction",

                question:`${value}<sup>1/${exp}</sup>`,

                answer:String(base)

            });

        });

    });

}

// ==========================================
// LOGARITHM
// ==========================================

function createLogDataset(){

    state.settings.bases.forEach(base=>{

        state.settings.exponents.forEach(exp=>{

            if(base>2 && exp>5){

                return;

            }

            const value=base**exp;

            state.dataset.push({

                type:"log",

                question:`log<sub>${base}</sub>${value}`,

                answer:String(exp)

            });

        });

    });

}

// ==========================================
// PREPARE GAME
// ==========================================

// ==========================================
// PREPARE & GAME SCREEN
// ==========================================

function prepareGame(){
    
    // 1. Ambil soal dari dataset (Part 1)
    shuffle(state.dataset);
    state.pairs = state.dataset.slice(0, state.totalQuestion);
    
    // 2. Acak susunan soal untuk dirender (Part 2)
    shuffle(state.pairs);
    
    // 3. Atur timer dan mulai permainan
    state.timeLeft = state.duration;
    renderGameScreen();
    startTimer();

}

// ==========================================
// HELPER
// ==========================================

function toSup(number){

    const sup={
        "0":"⁰",
        "1":"¹",
        "2":"²",
        "3":"³",
        "4":"⁴",
        "5":"⁵",
        "6":"⁶",
        "7":"⁷",
        "8":"⁸",
        "9":"⁹"
    };

    return String(number)
        .split("")
        .map(n=>sup[n])
        .join("");

}
// ==========================================
// GAME SCREEN
// ==========================================


function renderGameScreen(){

    const left=[...state.pairs];

    const right=[...state.pairs];

    shuffle(left);
    shuffle(right);

    app.innerHTML=`

        <div class="game-header">

            <div class="info-box">
                <small>Benar</small>
                <strong id="score">${state.score}</strong>
            </div>

            <div class="info-box">
                <small>Sisa</small>
                <strong id="remain">${state.pairs.length}</strong>
            </div>

            <div class="info-box">
                <small>Waktu</small>
                <strong id="timer">${formatTime(state.timeLeft)}</strong>
            </div>

        </div>

        <div class="matching-container">

            <div
                class="match-column"
                id="leftColumn">

            </div>

            <div
                class="match-column"
                id="rightColumn">

            </div>

        </div>

    `;

    renderLeft(left);

    renderRight(right);

}

// ==========================================
// LEFT COLUMN
// ==========================================

function renderLeft(data){

    const column=$("#leftColumn");

    column.innerHTML="";

    data.forEach(item=>{

        const card=document.createElement("div");

        card.className="match-card";

        card.innerHTML=item.question;

        card.dataset.answer=item.answer;

        card.dataset.question=item.question;

        card.onclick=()=>selectLeft(card);

        column.appendChild(card);

    });

}

// ==========================================
// RIGHT COLUMN
// ==========================================

function renderRight(data){

    const column=$("#rightColumn");

    column.innerHTML="";

    data.forEach(item=>{

        const card=document.createElement("div");

        card.className="match-card";

        card.textContent=item.answer;

        card.dataset.answer=item.answer;

        card.onclick=()=>selectRight(card);

        column.appendChild(card);

    });

}

// ==========================================
// SELECT
// ==========================================

function selectLeft(card){

    if(card.classList.contains("correct")) return;

    document
        .querySelectorAll("#leftColumn .match-card")
        .forEach(item=>item.classList.remove("selected"));

    card.classList.add("selected");

    state.leftSelected=card;

    checkPair();

}

function selectRight(card){

    if(card.classList.contains("correct")) return;

    document
        .querySelectorAll("#rightColumn .match-card")
        .forEach(item=>item.classList.remove("selected"));

    card.classList.add("selected");

    state.rightSelected=card;

    checkPair();

}

// ==========================================
// CHECK
// ==========================================

function checkPair(){

    if(
        !state.leftSelected ||
        !state.rightSelected
    ){

        return;

    }

    const left=state.leftSelected;

    const right=state.rightSelected;

    if(left.dataset.answer===right.dataset.answer){

        left.classList.remove("selected");
        right.classList.remove("selected");

        left.classList.add("correct");
        right.classList.add("correct");

        state.score++;

        $("#score").textContent=state.score;

        $("#remain").textContent=
            state.totalQuestion-state.score;

        state.leftSelected=null;
        state.rightSelected=null;

        if(state.score===state.totalQuestion){

            clearInterval(state.timer);

            finishGame();

        }

    }else{

        left.classList.add("wrong");
        right.classList.add("wrong");

        state.wrong++;

        setTimeout(()=>{

            left.classList.remove(
                "wrong",
                "selected"
            );

            right.classList.remove(
                "wrong",
                "selected"
            );

            state.leftSelected=null;
            state.rightSelected=null;

        },400);

    }

}

// ==========================================
// TIMER
// ==========================================

function startTimer(){

    clearInterval(state.timer);

    state.timer=setInterval(()=>{

        state.timeLeft--;

        $("#timer").textContent=
            formatTime(state.timeLeft);

        if(state.timeLeft<=0){

            clearInterval(state.timer);

            finishGame();

        }

    },1000);

}
// ==========================================
// FINISH GAME
// ==========================================

function finishGame(){

    clearInterval(state.timer);

    renderResultScreen();

}

// ==========================================
// RESULT
// ==========================================

function renderResultScreen(){

    const percent=Math.round(
        (state.score/state.totalQuestion)*100
    );

    const usedTime=
        state.duration-state.timeLeft;

    app.innerHTML=`

        <div class="card result-card">

            <h2>Permainan Selesai</h2>

            <div class="result-score">

                ${percent}%

            </div>

            <div class="result-list">

                <div class="result-item">

                    <span>Benar</span>

                    <strong>${state.score}</strong>

                </div>

                <div class="result-item">

                    <span>Salah</span>

                    <strong>${state.wrong}</strong>

                </div>

                <div class="result-item">

                    <span>Total Soal</span>

                    <strong>${state.totalQuestion}</strong>

                </div>

                <div class="result-item">

                    <span>Waktu</span>

                    <strong>${formatTime(usedTime)}</strong>

                </div>

            </div>

            <div class="action-group">

                <button
                    id="btnReplay"
                    class="btn btn-primary">

                    Main Lagi

                </button>

                <button
                    id="btnSetting"
                    class="btn btn-secondary">

                    Pengaturan

                </button>

                <button
                    id="btnHome"
                    class="btn btn-secondary">

                    Home

                </button>

            </div>

        </div>

    `;

    bindResult();

}

// ==========================================
// RESULT EVENT
// ==========================================

function bindResult(){

    $("#btnReplay").onclick=()=>{

        state.score=0;
        state.wrong=0;
        state.leftSelected=null;
        state.rightSelected=null;

        prepareGame();

    };

    $("#btnSetting").onclick=()=>{

        renderSettingScreen();

    };

    $("#btnHome").onclick=()=>{

        location.href="../../index.html";

    };

}
