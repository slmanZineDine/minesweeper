// Select Elements
//--Elements
let interface = document.querySelector(".interface");
let gameMode = document.querySelector(".game-mode");
let levels = document.querySelectorAll(".level li");
let game = document.querySelector(".game");
let gameField = document.querySelector(".game-field");
let minesCount = document.querySelector(".mines-count span");
let theTime = document.querySelector(".game .time span");
let popup = document.querySelector(".popup-box");
let spentTime = document.querySelector(".popup-box .time");
//--button
let startBtn = document.querySelector(".start-btn");
let arrowL = document.querySelector(".fa-angle-left");
let arrowR = document.querySelector(".fa-angle-right");
let icons = document.querySelector(".icons");
let replay = document.querySelector(".game .retry");
let tryAgain = document.querySelector(".popup-box .retry");

// Global Variables
let levelSelected = 1;
let iconName = "mine";
let squareCount = [81, 256, 480];
let colRowCount = [[9, 9], [16, 16], [16, 30]];
let minesCountArr = [12, 38, 72];
let minesSet = new Set();
let state = "clear";
let win = false;
let lose = false;
let setTheTime;

// Events Handler
startBtn.onclick = function () {
    startGame();
    createGameField();
    distributeMines();
    startTime();
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
    if(e.target === this) return;
    if(iconName === "flag") {
        flagIconFunc(e.target);
        return;
    };
    if(win || lose) return;
    if(minesSet.has(e.target.id)) {
        e.target.style.backgroundColor = "yellow";
        loseGame();
        return;
    }
    squaresId(e.target);
    winGame();
}
replay.addEventListener("click", retry);
tryAgain.addEventListener("click", retry);
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
    if(ele === icons.children[1]) {
        ele.previousElementSibling.classList.add("active");
        iconName = ele.previousElementSibling.classList[0];
    }
    else if(ele === icons.children[0]) {
        ele.nextElementSibling.classList.add("active");
        iconName = ele.nextElementSibling.classList[0];
    }
}
function flagIconFunc(ele) {
    if(ele.innerHTML.length > 2) {
        ele.innerHTML = "";
        minesCount.innerHTML = +minesCount.innerHTML + 1;
    }
    else if(ele.tagName != "SPAN") {
        ele.parentElement.innerHTML = "";
        minesCount.innerHTML = +minesCount.innerHTML + 1;
    }
    else if(ele.innerHTML === "" && !ele.classList.contains("opened")) {  
        ele.innerHTML = `
        <i class="flag fa-solid fa-flag"></i>
        `;
        minesCount.innerHTML = +minesCount.innerHTML - 1;
    }
    if(minesCount.innerHTML < 0) minesCount.innerHTML = 0;
}
function distributeMines() {
    let minesCount = minesCountArr[levelSelected];
    let max = squareCount[levelSelected];
    while(minesSet.size < minesCount) {
        let rand = Math.trunc((Math.random() * max));
        minesSet.add(gameField.children[rand].id)
    }
    minesSet.forEach(e =>
        document.getElementById(`${e}`)
    );
}
function startTime() {
    let sec = 0;
    let min = 0;
    setTheTime = setInterval(function() {
        sec += 1;
        if(sec < 10) theTime.innerHTML = `0${min}:0${sec}`;
        else theTime.innerHTML = `0${min}:${sec}`;
        if(sec > 59){
            min += 1;
            sec = 0
            theTime.innerHTML = `0${min}:0${sec}`;}
        if(min > 9)
            theTime.innerHTML = `${min}:0${sec}`;
    },1000);
}
function squaresId(ele) {
    if(ele.classList.contains("opened")) return;
    ele.classList.add("opened");
    // To Remove Flag Icon
    if(ele.innerHTML.length > 2)
        ele.innerHTML = "";
    
    let arrOfSurrounded = getSurroundedSquares(ele);

    for(let i = 0 ; i < arrOfSurrounded.length ; i++)
        checkfunc(arrOfSurrounded[i], ele);

    if(state === "clear") {
        for(let i = 0 ; i < arrOfSurrounded.length ; i++)
            squaresId(arrOfSurrounded[i]); 
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
        // Square Number Color
        if(clicked.innerHTML === "2")
            clicked.style.color = "green";
        else if(clicked.innerHTML === "3")
            clicked.style.color = "blue";
        else if(clicked.innerHTML > "3")
            clicked.style.color = "black";
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
function winGame() {
    for(let i = 0 ; i < gameField.children.length ; i++) {
        if(minesSet.has(gameField.children[i].id)) continue;
        if(gameField.children[i].classList.contains("opened")) {
            win = true;
        } else {
            win = false;
            break;
        }
    }
    if(win) {
        clearInterval(setTheTime);
        spentTime.innerHTML = theTime.innerHTML;
        popup.classList.add("show");
    }
}
function loseGame() {
    minesSet.forEach(e => {
        let square = document.getElementById(`${e}`);
        square.innerHTML = `
        <i style="color: red" class="mine fa-solid fa-land-mine-on active"></i>
        `;
    });
    clearInterval(setTheTime);
    lose = true;
}