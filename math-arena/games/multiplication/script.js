// ======================================================
// MULTIPLICATION TABLE
// Part 1
// ======================================================

const app = document.getElementById("app");

const state = {
    table: 1,
    mode: "multiply",
    totalQuestion: 20,
    duration: 60,
    random: true,

    questions: [],
    current: 0,
    score: 0,
    wrong: 0,
    timer: null,
    timeLeft: 0
};

// ======================================================
// START
// ======================================================

renderSelectScreen();

// ======================================================
// ROUTER
// ======================================================

function renderSelectScreen() {

    app.innerHTML = `
        <h2>Pilih Tabel</h2>

        <div class="table-grid" id="tableGrid"></div>
    `;

    createTableGrid();

}

function renderSettingScreen() {

    app.innerHTML = `

        <div class="card">

            <h2>Tabel ${state.table}</h2>

            <div class="setting">

                <label>Mode</label>

                <div class="radio-group">

                    <label>
                        <input
                            type="radio"
                            name="mode"
                            value="multiply"
                            ${state.mode==="multiply"?"checked":""}
                        >

                        Multiply
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="mode"
                            value="division"
                            ${state.mode==="division"?"checked":""}
                        >

                        Division
                    </label>

                </div>

            </div>


            <div class="setting">

                <label>Jumlah Soal</label>

                <select id="questionCount" class="input">

                    <option value="10">10</option>

                    <option value="20" selected>20</option>

                    <option value="30">30</option>

                    <option value="50">50</option>

                </select>

            </div>


            <div class="setting">

                <label>Waktu</label>

                <select id="duration" class="input">

                    <option value="30">30 Detik</option>

                    <option value="60" selected>60 Detik</option>

                    <option value="90">90 Detik</option>

                    <option value="120">120 Detik</option>

                </select>

            </div>


            <div class="setting">

                <label>

                    <input
                        type="checkbox"
                        id="randomQuestion"
                        checked>

                    Acak Soal

                </label>

            </div>

            <div class="action-group">

                <button
                    class="btn btn-primary"
                    id="btnStart">

                    Mulai Bermain

                </button>

                <button
                    class="btn btn-secondary"
                    id="btnBack">

                    Pilih Tabel

                </button>

            </div>

        </div>

    `;

    bindSettingEvent();

}

// ======================================================
// TABLE
// ======================================================

function createTableGrid() {

    const grid = document.getElementById("tableGrid");

    for(let i=1;i<=30;i++){

        const button=document.createElement("button");

        button.className="table-btn";

        button.textContent=i;

        button.onclick=()=>{

            state.table=i;

            renderSettingScreen();

        };

        grid.appendChild(button);

    }

}

// ======================================================
// EVENT
// ======================================================

function bindSettingEvent(){

    document
        .querySelectorAll("input[name=mode]")
        .forEach(item=>{

            item.addEventListener("change",()=>{

                state.mode=item.value;

            });

        });

    document
        .getElementById("questionCount")
        .addEventListener("change",e=>{

            state.totalQuestion=parseInt(e.target.value);

        });

    document
        .getElementById("duration")
        .addEventListener("change",e=>{

            state.duration=parseInt(e.target.value);

        });

    document
        .getElementById("randomQuestion")
        .addEventListener("change",e=>{

            state.random=e.target.checked;

        });

    document
        .getElementById("btnBack")
        .onclick=()=>{

            renderSelectScreen();

        };

    document
        .getElementById("btnStart")
        .onclick=()=>{

            state.score=0;
            state.wrong=0;
            state.current=0;
            state.questions=[];

            startGame();

        };

}

// ======================================================
// GAME
// ======================================================

function startGame(){

    // Part 2

}
// ======================================================
// GAME
// ======================================================

function startGame(){

    generateQuestions();

    state.timeLeft = state.duration;

    renderGameScreen();

    startGameTimer();

    loadQuestion();

}

// ======================================================
// GAME SCREEN
// ======================================================

function renderGameScreen(){

    app.innerHTML = `

        <div class="game-header">

            <div class="card score-box">
                <small>Skor</small>
                <h2 id="score">${state.score}</h2>
            </div>

            <div class="card score-box">
                <small>Soal</small>
                <h2 id="progress">1 / ${state.totalQuestion}</h2>
            </div>

            <div class="card score-box">
                <small>Waktu</small>
                <h2 id="timer">${formatTime(state.timeLeft)}</h2>
            </div>

        </div>

        <div class="question-card">

            <div id="question" class="question"></div>

        </div>

        <div id="answerGrid" class="answer-grid"></div>

    `;

}

// ======================================================
// TIMER
// ======================================================

function startGameTimer(){

    if(state.timer){

        clearInterval(state.timer);

    }

    state.timer = setInterval(()=>{

        state.timeLeft--;

        document.getElementById("timer").textContent =
            formatTime(state.timeLeft);

        if(state.timeLeft<=0){

            clearInterval(state.timer);

            finishGame();

        }

    },1000);

}

// ======================================================
// GENERATE QUESTION
// ======================================================

function generateQuestions(){

    let list=[];

    for(let i=1;i<=10;i++){

        list.push(i);

    }

    while(list.length<state.totalQuestion){

        list.push(random(1,10));

    }

    if(state.random){

        shuffle(list);

    }

    state.questions=list.slice(0,state.totalQuestion);

}

// ======================================================
// LOAD QUESTION
// ======================================================

function loadQuestion(){

    if(state.current>=state.totalQuestion){

        finishGame();

        return;

    }

    document.getElementById("progress").textContent =
        `${state.current+1} / ${state.totalQuestion}`;

    const value=state.questions[state.current];

    let questionText="";
    let correctAnswer=0;

    if(state.mode==="multiply"){

        questionText=`${state.table} × ${value}`;

        correctAnswer=state.table*value;

    }else{

        questionText=`${state.table*value} ÷ ${state.table}`;

        correctAnswer=value;

    }

    document.getElementById("question").textContent=questionText;

    createAnswer(correctAnswer);

}

// ======================================================
// ANSWER
// ======================================================

function createAnswer(correct){

    const grid=document.getElementById("answerGrid");

    grid.innerHTML="";

    const answers=[correct];

    while(answers.length<4){

        let fake=correct+random(-10,10);

        if(fake<1) continue;

        if(answers.includes(fake)) continue;

        answers.push(fake);

    }

    shuffle(answers);

    answers.forEach(answer=>{

        const button=document.createElement("button");

        button.className="answer-btn";

        button.textContent=answer;

        button.onclick=()=>checkAnswer(answer,correct);

        grid.appendChild(button);

    });

}

// ======================================================
// CHECK ANSWER
// ======================================================

function checkAnswer(answer,correct){

    const buttons=document.querySelectorAll(".answer-btn");

    buttons.forEach(btn=>{

        btn.disabled=true;

        if(Number(btn.textContent)===correct){

            btn.style.background="#28a745";

        }

        if(Number(btn.textContent)===answer &&
           answer!==correct){

            btn.style.background="#dc3545";

        }

    });

    if(answer===correct){

        state.score++;

        document.getElementById("score").textContent=state.score;

    }else{

        state.wrong++;

    }

    setTimeout(()=>{

        state.current++;

        loadQuestion();

    },500);

}
// ======================================================
// FINISH GAME
// ======================================================

function finishGame(){

    if(state.timer){

        clearInterval(state.timer);
        state.timer = null;

    }

    renderResultScreen();

}

// ======================================================
// RESULT SCREEN
// ======================================================

function renderResultScreen(){

    const percent = Math.round(
        (state.score / state.totalQuestion) * 100
    );

    app.innerHTML = `

        <div class="card result-card">

            <h2>Permainan Selesai</h2>

            <div class="result-score">

                ${state.score}

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
                    <span>Nilai</span>
                    <strong>${percent}%</strong>
                </div>

                <div class="result-item">
                    <span>Waktu Tersisa</span>
                    <strong>${formatTime(state.timeLeft)}</strong>
                </div>

            </div>

            <div class="action-group mt-3">

                <button
                    id="btnReplay"
                    class="btn btn-primary">

                    Main Lagi

                </button>

                <button
                    id="btnChooseTable"
                    class="btn btn-secondary">

                    Pilih Tabel

                </button>

                <button
                    id="btnHome"
                    class="btn btn-secondary">

                    Home

                </button>

            </div>

        </div>

    `;

    document
        .getElementById("btnReplay")
        .onclick = () => {

            state.score = 0;
            state.wrong = 0;
            state.current = 0;
            state.questions = [];

            startGame();

        };

    document
        .getElementById("btnChooseTable")
        .onclick = () => {

            renderSelectScreen();

        };

    document
        .getElementById("btnHome")
        .onclick = () => {

            location.href="../../index.html";

        };

}