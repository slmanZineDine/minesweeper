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
let minesCountArr = [12, 38, 72];
// let mineArr = [2, 6 ,7, 1, 9, 12, 14];
let state = "clear";

// Events Handler
startBtn.onclick = function () {
    startGame();
    createGameField();
    // for(let i = 0 ; i < gameField.children.length ; i++) {
    //     if(mineArr.includes(+gameField.children[i].id)) {
    //         gameField.children[i].style.backgroundColor = "red";
    //     }
    // }
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
    // squaresId(e.target);
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
    let colNum = 0;
    let rowNum = 0;
    for(let i = 0 ; i < squareCount[levelSelected] ; i++) {
        let span = document.createElement("span");
        if(colCount <= colNum) {
            colNum = 0;
            rowNum++;
        }
        span.dataset.id = `${rowNum}_${colNum++}`;
        gameField.append(span);
    }
    gameField.style.cssText = `
        grid-template-columns: repeat(${colRowCount[levelSelected][0]}, minmax(24px , 1fr));
        grid-template-rows: repeat(${colRowCount[levelSelected][1]}, minmax(24px, 1fr));
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

function squaresId(ele) {
    // check if ele is a mine
    // let clicked = ele.id;
    // let travNum = colRowCount[levelSelected][0];
    // let arr = [
    //     document.getElementById(`${clicked - travNum - 1}`),
    //     document.getElementById(`${clicked - travNum}`),
    //     document.getElementById(`${clicked - travNum + 1}`),
    //     document.getElementById(`${clicked - 1}`),
    //     document.getElementById(`${+clicked + 1}`),
    //     document.getElementById(`${+clicked + travNum - 1}`),
    //     document.getElementById(`${+clicked + travNum}`),
    //     document.getElementById(`${+clicked + travNum + 1}`)
    // ];
    // for(let i = 0 ; i < 8 ; i++) {
    //     checkfunc(arr[i], ele);
    // }

    // if(state === "clear") {
    //     for(let i = 0 ; i < 8 ; i++) {
    //         squaresId(arr[i], ele);
    //         if(state === "mine") return;
    //     }
    // } else if(state === "mine") return;
    // ele.style.backgroundColor = "white";
}

// function checkfunc(surrEle, clicked) {
//     if(surrEle === null) return;
//     if(mineArr.includes(+surrEle.id)) {
//         clicked.innerHTML = +clicked.innerHTML + 1;
//         state = "mine";
//         return;
//     } else {
//         surrEle.style.backgroundColor = "blue";
//     }
// }
// let topLeft = document.getElementById(`${clicked - travNum - 1}`);
// let topCenter = document.getElementById(`${clicked - travNum}`);
// let topRight = document.getElementById(`${clicked - travNum + 1}`);
// let centerLeft = document.getElementById(`${clicked - 1}`);
// let centerRight = document.getElementById(`${+clicked + 1}`);
// let bottomLeft = document.getElementById(`${+clicked + travNum - 1}`);
// let bottomCenter = document.getElementById(`${+clicked + travNum}`);
// let bottomRight = document.getElementById(`${+clicked + travNum + 1}`);