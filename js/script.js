// Select Elements
//--Elements
let interface = document.querySelector(".interface");
let gameMode = document.querySelector(".game-mode");
let levels = document.querySelectorAll(".level li");
let game = document.querySelector(".game");
let gameField = document.querySelector(".game-field");
let replay = document.querySelector(".retry");
let minesCount = document.querySelector(".mines-count span");
//--button
let startBtn = document.querySelector(".start-btn");
let arrowL = document.querySelector(".fa-angle-left");
let arrowR = document.querySelector(".fa-angle-right");
let icons = document.querySelector(".icons");

// Global Variables
let levelSelected = 1;
let iconsStatus = "next";
let iconName = "mine";
let squareCount = [81, 256, 480];
let colRowCount = [[9, 9], [16, 16], [16, 30]];
let minesSet = new Set();
let minesCountArr = [12, 38, 72];
let state = "clear";

// Events Handler
startBtn.onclick = function () {
    startGame();
    createGameField();
    distributeMines();
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
gameField.onclick = function (e) {
    squaresId(e.target);
}
replay.onclick = function () {
    retry();
}
icons.onclick = function (e) {
    changeIcon(e.target);
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
function createGameField() {
    let colCount = colRowCount[levelSelected][0];
    let colNum = 0,
        rowNum = 0;
    for(let i = 0 ; i < squareCount[levelSelected] ; i++) {
        let span = document.createElement("span");
        if(colCount <= colNum) {
            colNum = 0;
            rowNum++;
        }
        span.id = `${colNum++}_${rowNum}`;
        gameField.append(span);
    }
    gameField.style.cssText = `
        grid-template-columns: repeat(${colRowCount[levelSelected][0]}, minmax(23px , 1fr));
        grid-template-rows: repeat(${colRowCount[levelSelected][1]}, minmax(23px, 1fr));
    `;
    minesCount.innerHTML = minesCountArr[levelSelected];
}
function retry() {
    location.reload();
}
function changeIcon(ele) {
    for(let i = 0 ; i < icons.children.length ; i++)
        icons.children[i].classList.remove("active");

    if(ele === icons.children[2]) iconsStatus = "prev";
    else if(ele === icons.children[0]) iconsStatus = "next";

    if(iconsStatus === "next") {
        ele.nextElementSibling.classList.add("active");
        iconName = ele.nextElementSibling.classList[2];
    }
    else if(iconsStatus === "prev") {
        ele.previousElementSibling.classList.add("active");
        iconName = ele.previousElementSibling.classList[2];
    }
}
function distributeMines() {
    let minesCount = minesCountArr[levelSelected];
    let max = squareCount[levelSelected];
    while(minesSet.size < minesCount) {
        let rand = Math.trunc((Math.random() * max));
        minesSet.add(gameField.children[rand].id)
    }
    minesSet.forEach(e => {
        document.getElementById(`${e}`).style.backgroundColor = "red";
    });
}
function squaresId(ele) {
    // check if ele is a mine
    if(ele.classList.contains("opened")) return;
    ele.classList.add("opened");
    let arrOfSurrounded = getSurroundedSquares(ele);

    for(let i = 0 ; i < arrOfSurrounded.length ; i++)
        checkfunc(arrOfSurrounded[i], ele);

    if(state === "clear") {
        for(let i = 0 ; i < arrOfSurrounded.length ; i++) {
            arrOfSurrounded[i].style.backgroundColor = "blue";
            squaresId(arrOfSurrounded[i]);
        }     
    }
    else if(state === "mine") {
        state = "clear";
        return;
    }
}
function checkfunc(surrEle, clicked) {
    if(minesSet.has(surrEle.id)) {
        clicked.innerHTML = +clicked.innerHTML + 1;
        state = "mine";
    }
}
function getSurroundedSquares(ele) {
    let col = ele.id.split("_")[0];
    let row = ele.id.split("_")[1];
    let arr = [
        document.getElementById(`${col - 1}_${row - 1}`),
        document.getElementById(`${col}_${row - 1}`),
        document.getElementById(`${+col + 1}_${row - 1}`),
        document.getElementById(`${col - 1}_${row}`),
        document.getElementById(`${+col + 1}_${row}`),
        document.getElementById(`${col - 1}_${+row + 1}`),
        document.getElementById(`${col}_${+row + 1}`),
        document.getElementById(`${+col + 1}_${+row + 1}`)
    ].filter(e => e != null);
    return arr;
}