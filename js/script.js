// Select Elements
//--Elements
let interface = document.querySelector(".interface");
let gameMode = document.querySelector(".game-mode");
let levels = document.querySelectorAll(".level li");
let game = document.querySelector(".game");
let replay = document.querySelector(".fa-rotate-left");
//--button
let startBtn = document.querySelector(".start-btn");
let arrowL = document.querySelector(".fa-angle-left");
let arrowR = document.querySelector(".fa-angle-right");

// Global Variables
let levelSelected = 1;

// Events Handler
startBtn.onclick = function () {
    startGame();
}
gameMode.onclick = function (e) {
    if(e.target.classList.contains("fa-angle-left")) {
        if(levelSelected === 0) return;
        levelSelected -= 1;
        changeLevel();
    }
    else if(e.target.classList.contains("fa-angle-right")) {
        if(levelSelected === 2) return;
        levelSelected += 1;
        changeLevel();
    }
}
replay.onclick = function () {
    retry();
}
// Functions
function startGame() {
    interface.classList.add("hidden");
    game.classList.add("show");
}
function changeLevel() {
    levels.forEach(e => {
        e.classList.remove("active");
    });
    levels[levelSelected].classList.add("active");
    if(levelSelected === 0) {
        arrowL.style.color = "#7b7b7b";
    }
    else if(levelSelected === 2) {
        arrowR.style.color = "#7b7b7b";
    }
    else {
        arrowR.style.color = "#fff";
        arrowL.style.color = "#fff";
    }
}
function retry() {
    location.reload();
}