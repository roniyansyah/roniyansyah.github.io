/* =========================================
   DOM
========================================= */

const $ = selector => document.querySelector(selector);

const $$ = selector => document.querySelectorAll(selector);

/* =========================================
   RANDOM
========================================= */

function random(min,max){

    return Math.floor(Math.random()*(max-min+1))+min;

}

/* =========================================
   SHUFFLE
========================================= */

function shuffle(array){

    for(let i=array.length-1;i>0;i--){

        const j=Math.floor(Math.random()*(i+1));

        [array[i],array[j]]=[array[j],array[i]];

    }

    return array;

}

/* =========================================
   STORAGE
========================================= */

function save(key,value){

    localStorage.setItem(key,JSON.stringify(value));

}

function load(key,defaultValue=null){

    const value=localStorage.getItem(key);

    return value?JSON.parse(value):defaultValue;

}

/* =========================================
   TIMER
========================================= */

function startTimer(seconds,onTick,onFinish){

    let time=seconds;

    onTick(time);

    const timer=setInterval(()=>{

        time--;

        onTick(time);

        if(time<=0){

            clearInterval(timer);

            onFinish();

        }

    },1000);

    return timer;

}

/* =========================================
   MODAL
========================================= */

function showModal(id){

    $(id).classList.remove("hidden");

}

function hideModal(id){

    $(id).classList.add("hidden");

}

/* =========================================
   SLEEP
========================================= */

function sleep(ms){

    return new Promise(resolve=>setTimeout(resolve,ms));

}

/* =========================================
   FORMAT
========================================= */

function formatTime(seconds){

    const m=Math.floor(seconds/60);

    const s=seconds%60;

    return `${m}:${String(s).padStart(2,"0")}`;

}

/* =========================================
   TOAST
========================================= */

function toast(message){

    alert(message);

}