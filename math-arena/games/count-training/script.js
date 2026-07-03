// ==========================================
// COUNT TRAINING
// ==========================================

const app = document.getElementById("app");

const state = {
    operators: ["+"],

    maxNumber: 20,

    totalQuestion: 20,

    duration: 60,

    score: 0,

    wrong: 0,

    current: 0,

    timer: null,

    timeLeft: 0,

    questions: []
};

// ==========================================
// START
// ==========================================

renderSettingScreen();

// ==========================================
// SETTING SCREEN
// ==========================================

function renderSettingScreen(){

    app.innerHTML = `

        <div class="card setting-card">

            <h2>Pengaturan</h2>

            <div class="setting">

                <label>Operasi</label>

                <div class="setting-group">

                    <label class="check-item">
                        <input type="checkbox" value="+" checked>
                        Penjumlahan
                    </label>

                    <label class="check-item">
                        <input type="checkbox" value="-">
                        Pengurangan
                    </label>

                    <label class="check-item">
                        <input type="checkbox" value="*">
                        Perkalian
                    </label>

                    <label class="check-item">
                        <input type="checkbox" value="/">
                        Pembagian
                    </label>

                </div>

            </div>

            <div class="setting">

                <label>Angka Maksimal</label>

                <select id="maxNumber" class="input">

                    <option value="10">10</option>

                    <option value="20" selected>20</option>

                    <option value="50">50</option>

                    <option value="100">100</option>

                </select>

            </div>

            <div class="setting">

                <label>Jumlah Soal</label>

                <select id="questionCount" class="input">

                    <option>10</option>

                    <option selected>20</option>

                    <option>30</option>

                    <option>50</option>

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

            <div class="action-group">

                <button
                    class="btn btn-primary"
                    id="btnStart">

                    MULAI

                </button>

            </div>

        </div>

    `;

    bindSetting();

}

// ==========================================
// EVENT
// ==========================================

function bindSetting(){

    document
        .querySelectorAll(".check-item input")
        .forEach(item=>{

            item.addEventListener("change",collectOperator);

        });

    document
        .getElementById("maxNumber")
        .addEventListener("change",e=>{

            state.maxNumber=parseInt(e.target.value);

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
        .getElementById("btnStart")
        .onclick=startGame;

}

// ==========================================
// OPERATOR
// ==========================================

function collectOperator(){

    state.operators=[];

    document
        .querySelectorAll(".check-item input:checked")
        .forEach(item=>{

            state.operators.push(item.value);

        });

    if(state.operators.length===0){

        alert("Pilih minimal satu operasi.");

        document
            .querySelector(".check-item input")
            .checked=true;

        collectOperator();

    }

}

// ==========================================
// START GAME
// ==========================================

function startGame(){

    state.score=0;

    state.wrong=0;

    state.current=0;

    state.questions=[];

    generateQuestions();

    renderGameScreen();

    startTimerGame();

    loadQuestion();

}

// ==========================================
// PART 2
// ==========================================

// ==========================================
// GAME SCREEN
// ==========================================

function renderGameScreen(){

    app.innerHTML=`

        <div class="game-header">

            <div class="info-box">
                <small>Skor</small>
                <strong id="score">0</strong>
            </div>

            <div class="info-box">
                <small>Soal</small>
                <strong id="progress">1/${state.totalQuestion}</strong>
            </div>

            <div class="info-box">
                <small>Waktu</small>
                <strong id="timer">${formatTime(state.duration)}</strong>
            </div>

        </div>

        <div class="question-card">

            <div
                class="question"
                id="question">
            </div>

        </div>

        <div
            id="answerGrid"
            class="answer-grid">
        </div>

    `;

}

// ==========================================
// TIMER
// ==========================================

function startTimerGame(){

    state.timeLeft=state.duration;

    clearInterval(state.timer);

    state.timer=setInterval(()=>{

        state.timeLeft--;

        $("#timer").textContent=formatTime(state.timeLeft);

        if(state.timeLeft<=0){

            clearInterval(state.timer);

            finishGame();

        }

    },1000);

}

// ==========================================
// GENERATE QUESTION
// ==========================================

function generateQuestions(){

    state.questions=[];

    for(let i=0;i<state.totalQuestion;i++){

        const operator=
            state.operators[
                random(0,state.operators.length-1)
            ];

        let a,b,answer;

        switch(operator){

            case "+":

                a=random(1,state.maxNumber);
                b=random(1,state.maxNumber);

                answer=a+b;

                break;

            case "-":

                a=random(1,state.maxNumber);
                b=random(1,a);

                answer=a-b;

                break;

            case "*":

                a=random(1,10);
                b=random(1,10);

                answer=a*b;

                break;

            case "/":

                b=random(1,10);

                answer=random(1,10);

                a=b*answer;

                break;

        }

        state.questions.push({

            a,
            b,
            operator,
            answer

        });

    }

}

// ==========================================
// LOAD QUESTION
// ==========================================

function loadQuestion(){

    if(state.current>=state.questions.length){

        finishGame();

        return;

    }

    const q=state.questions[state.current];

    $("#progress").textContent=
        `${state.current+1}/${state.totalQuestion}`;

    $("#question").textContent=
        `${q.a} ${q.operator} ${q.b} = ?`;

    createAnswers(q.answer);

}

// ==========================================
// CREATE ANSWERS
// ==========================================

function createAnswers(correct){

    const answers=[correct];

    while(answers.length<4){

        let fake=
            correct+
            random(-10,10);

        if(fake<0) continue;

        if(answers.includes(fake)) continue;

        answers.push(fake);

    }

    shuffle(answers);

    const grid=$("#answerGrid");

    grid.innerHTML="";

    answers.forEach(value=>{

        const button=document.createElement("button");

        button.className="answer-btn";

        button.textContent=value;

        button.onclick=()=>{

            checkAnswer(button,value,correct);

        };

        grid.appendChild(button);

    });

}

// ==========================================
// CHECK ANSWER
// ==========================================

function checkAnswer(button,value,correct){

    document
        .querySelectorAll(".answer-btn")
        .forEach(btn=>btn.disabled=true);

    if(value===correct){

        button.classList.add("correct");

        state.score++;

        $("#score").textContent=state.score;

    }else{

        button.classList.add("wrong");

        state.wrong++;

        document
            .querySelectorAll(".answer-btn")
            .forEach(btn=>{

                if(Number(btn.textContent)===correct){

                    btn.classList.add("correct");

                }

            });

    }

    setTimeout(()=>{

        state.current++;

        loadQuestion();

    },500);

}
// ==========================================
// FINISH GAME
// ==========================================

function finishGame(){

    clearInterval(state.timer);

    renderResultScreen();

}

// ==========================================
// RESULT SCREEN
// ==========================================

function renderResultScreen(){

    const percent=Math.round(
        (state.score/state.totalQuestion)*100
    );

    const usedTime=state.duration-state.timeLeft;

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

    bindResultEvent();

}

// ==========================================
// RESULT EVENT
// ==========================================

function bindResultEvent(){

    document
        .getElementById("btnReplay")
        .onclick=()=>{

            startGame();

        };

    document
        .getElementById("btnSetting")
        .onclick=()=>{

            renderSettingScreen();

        };

    document
        .getElementById("btnHome")
        .onclick=()=>{

            location.href="../../index.html";

        };

}
