
const gameBoardBoxes = [...document.querySelectorAll(".game-board-box")];
const pickMarkContainer = document.querySelector(".pick-x-o-container");
const newGameContainer = document.querySelector(".new-game-container");
const gameContainer = document.querySelector(".game-container");
const gameTypeBtns = [...document.querySelectorAll(".btn-game-type")];
const turnImg = document.querySelector(".turn-img");
const resetBtn = document.querySelector(".reset-container");
const popUpContainer = document.querySelector(".popup-container");
const winnerTextContainer = document.querySelector(".winning-text-container");
const winnerPlayerText = document.querySelector(".winning-player-text");
const winnerMarkImg = document.querySelector(".winning-mark-img");
const winnerRoundText = document.querySelector(".winning-round-text");
const tiedContainer = document.querySelector(".tied-container");
const restartContainer = document.querySelector(".restart-container");
const quitBtn = [...document.querySelectorAll(".quit-btn")];
const roundBtn = [...document.querySelectorAll(".round-btn")];
const cancelBtn = document.querySelector(".cancel-btn");
const restartBtn = document.querySelector(".restart-btn");
const main = document.querySelector("main");
const player1ScoreText = document.querySelector(".player1-score-num");
const tieScoreText = document.querySelector(".ties-score-num");
const player2ScoreText = document.querySelector(".player2-score-num");
const p1ScoreName = document.querySelector(".you-score-text");
const p2ScoreName = document.querySelector(".others-score-text");
const logo = document.querySelector(".logo-game");
const pickXcontainer = document.querySelector(".pick-x-container");
const pickXimg = document.querySelector(".pick-x-img");
const pickOcontainer = document.querySelector(".pick-o-container");
const pickOimg = document.querySelector(".pick-o-img");

let currentPlayer;
let player1;
let player2;
let winningPlayer;
let winningPosition;
let player1Score = 0;
let player2Score = 0;
let tieScore = 0;
let gameType;
let isTied;

function checkTie() {
  // get all boxes that are marked
  const markedBoxes = gameBoardBoxes.filter((box) => {
    return box.dataset.mark === "x" || box.dataset.mark === "o";
  });

  if (markedBoxes.length === 9) {
    tieScore += 1;
    tieScoreText.textContent = tieScore;
    // show pop up
    main.classList.add("filter");
    popUpContainer.classList.remove("hide");
    winnerTextContainer.classList.add("hide");
    tiedContainer.classList.remove("hide");
    restartContainer.classList.add("hide");
    isTied = true;
  }
}

function getEmptyBoxes() {
  const emptyBoxNum = [];
  // get the box numbers of empty boxes
  gameBoardBoxes.map((box) => {
    if (!box.dataset.mark || box.dataset.mark === "null") {
      return emptyBoxNum.push(box.dataset.boxNum);
    }
  });
  return emptyBoxNum;
}

function cpuMark() {
  if (!gameType || gameType === null || gameType === "null") return;
  if (gameType === "human") return;
  if (winningPlayer) return;
  if (isTied) return;
  if (gameType === "cpu" && currentPlayer === player1) return;


  const availableBoxes = getEmptyBoxes();
  const randomBoxIndex = Math.floor(Math.random() * availableBoxes.length);
  const randomBoxNum = availableBoxes[randomBoxIndex];
  const randomBox = gameBoardBoxes.find((box) => {
    return (
      Number.parseInt(box.dataset.boxNum, 10) ===
      Number.parseInt(randomBoxNum, 10)
    );
  });

 
  // create img, size img, attach img
  const img = document.createElement("img");
  img.src = `assets/icon-${currentPlayer}-marker.svg`;
  const viewWidth = window.innerWidth;
  if (viewWidth < 800) {
    img.style.width = "40px";
    img.style.height = "40px";
  } else if (viewWidth > 800) {
    img.style.width = "64px";
    img.style.height = "64px";
  }
  storeData(randomBox);
  randomBox.appendChild(img);
  const win = checkWinner();
  if (!win) checkTie();
  // add click events back to boxes
  gameBoardBoxes.forEach((box) => (box.style.pointerEvents = "auto"));
  switchPlayers();
}

function setScoreNames() {
  if (gameType === "cpu" && player1 === "x") {
    p1ScoreName.textContent = "X (YOU)";
    p2ScoreName.textContent = "O (CPU)";
  } else if (gameType === "cpu" && player1 === "o") {
    p1ScoreName.textContent = "X (CPU)";
    p2ScoreName.textContent = "O (YOU)";
  } else if (gameType === "human" && player1 === "o") {
    p1ScoreName.textContent = "X (P2)";
    p2ScoreName.textContent = "O (P1)";
  } else if (gameType === "human" && player1 === "x") {
    p1ScoreName.textContent = "X (P1)";
    p2ScoreName.textContent = "O (P2)";
  }
}

function setGameType(e) {
  // if player 1 isn't selected default to "o"
  if (!player1) {
    player1 = "o";
    player2 = "x";
    currentPlayer = player2;
  } 

  gameType = e.target.dataset.gameType;

  turnImg.src = `assets/icon-${currentPlayer}-gray.svg`;

  if (gameType === "cpu" && player1 === "o") {
    cpuMark();
  } else {
    // add click events back on boxes
    gameBoardBoxes.forEach((box) => (box.style.pointerEvents = "auto"));
  }

  // show board 
  newGameContainer.classList.add("hide");
  gameContainer.classList.remove("hide");

  setScoreNames();
}

gameTypeBtns.forEach((btn) => btn.addEventListener("click", setGameType));

function setPlayers(e) {
  // get either x or o img dataset mark 
  const img = e.target.querySelector("img") ?? e.target;
  player1 = img.dataset.mark;
  player2 = player1 === "x" ? "o" : "x";
  currentPlayer =  "x";
}

pickMarkContainer.addEventListener("click", setPlayers);

function switchPlayers() {
  currentPlayer = currentPlayer === "x" ? "o" : "x";
  turnImg.src = `assets/icon-${currentPlayer}-gray.svg`;
}

function storeData(currBox) {
  currBox.dataset.mark = currentPlayer;
}

function checkWinner() {
  // all possible wins - box nums
  const allWins = {
    top: [0, 1, 2],
    middleRow: [3, 4, 5],
    bottom: [6, 7, 8],
    left: [0, 3, 6],
    middleColumn: [1, 4, 7],
    right: [2, 5, 8],
    back: [0, 4, 8],
    forward: [2, 4, 6],
  };

  // get all box nums that are marked 
  let markArr = [];
  gameBoardBoxes.map((box) => {
    if (box.dataset.mark === currentPlayer) {
      markArr.push(Number(box.dataset.boxNum));
    }
  });

  // check for winner
  for (const key in allWins) {
    // check if markArr contains a win
    const win = allWins[key].every((el) => {
      return markArr.includes(el);
    });

    if (win) {
      winningPosition = key;
      winningPlayer = player1 === currentPlayer ? "PLAYER 1" : "PLAYER 2";
      console.log(`WINNER! ${winningPlayer} at ${winningPosition}`);

      const winningColor = currentPlayer === "x" ? "#31C3BD" : "#F2B137";

      // change winning box colors
      allWins[key].forEach((box) => {
        const imgMark = gameBoardBoxes[box].querySelector("img");
        imgMark.src = `assets/icon-${currentPlayer}-outline.svg`;
        gameBoardBoxes[box].style.backgroundColor = winningColor;
      });

      // pop up set text/colors for winner
      main.classList.add("filter");
      popUpContainer.classList.remove("hide");

      if (gameType === "cpu" && currentPlayer === player1) {
        winnerPlayerText.textContent = "YOU WON!";
      } else if (gameType === "cpu" && currentPlayer === player2) {
        winnerPlayerText.textContent = "OH NO YOU LOST...";
      } else if (gameType === "human") {
        winnerPlayerText.textContent = winningPlayer + " WINS!";
      }

      winnerMarkImg.src = `assets/icon-${currentPlayer}-marker.svg`;
      winnerRoundText.style.color = winningColor;
      tiedContainer.classList.add("hide");
      restartContainer.classList.add("hide");
      winnerTextContainer.classList.remove("hide");

      // add score
      if (winningPlayer === "PLAYER 1") {
        player1Score += 1;
      } else {
        player2Score += 1;
      }
      // show score
      if (player1 === "o") {
        player1ScoreText.textContent = player2Score;
        player2ScoreText.textContent = player1Score;
      } else {
        player1ScoreText.textContent = player1Score;
        player2ScoreText.textContent = player2Score;
      }

      return true;
    }
  }
}


function resetHelper() {
  main.classList.remove("filter");
  popUpContainer.classList.add("hide");
  winningPlayer = null;
  winningPosition = null;
  currentPlayer = "x";
  turnImg.src = `assets/icon-${currentPlayer}-gray.svg`;
  // reset boxes 
  gameBoardBoxes.forEach((box) => {
    box.innerHTML = "";
    box.style.backgroundColor = "#1f3641";
    box.dataset.mark = null;
  });
  player1Score = 0;
  player2Score = 0;
  tieScore = 0;
  isTied = null;
  player1ScoreText.textContent = 0;
  player2ScoreText.textContent = 0;
  tieScoreText.textContent = 0;
}


function resetPopUp() {
  main.classList.add("filter");
  popUpContainer.classList.remove("hide");
  winnerTextContainer.classList.add("hide");
  tiedContainer.classList.add("hide");
  restartContainer.classList.remove("hide");
}

function cancelReset() {
  main.classList.remove("filter");
  popUpContainer.classList.add("hide");
}

function nextRound() {
  main.classList.remove("filter");
  popUpContainer.classList.add("hide");
  winningPlayer = null;
  winningPosition = null;
  currentPlayer = "x";
  turnImg.src = `assets/icon-${currentPlayer}-gray.svg`;
  // empty boxes
  gameBoardBoxes.forEach((box) => {
    box.innerHTML = "";
    box.style.backgroundColor = "#1f3641";
    box.dataset.mark = null;
  });
  isTied = null;
  checkCpuTurn();
}

resetBtn.addEventListener("click", resetPopUp);
cancelBtn.addEventListener("click", cancelReset);
roundBtn.forEach((el) => el.addEventListener("click", nextRound));


function goToHome() {
  newGameContainer.classList.remove("hide");
  gameContainer.classList.add("hide");
  gameType = null;
  player1 = null;
  player2 = null;
  resetHelper();
  resetToggle();
}

logo.addEventListener("click", goToHome);
quitBtn.forEach((el) => el.addEventListener("click", goToHome));
restartBtn.addEventListener("click", goToHome);


function togglePickMark(e) {
  //remove hover/active state
  deactivatePickMark(e);
  // get either x or o img dataset mark
  const target = e.target.querySelector("img") ?? e.target;
  const mark = target.dataset.mark;
  // add light gray background to selected marker & change img color
  if (mark === "x") {
    pickXcontainer.classList.add("selected-mark");
    pickOcontainer.classList.remove("selected-mark");
    pickXimg.classList.add("pick-x-img-active")
    pickOimg.classList.remove("pick-o-img-active")
  } else {
    pickXcontainer.classList.remove("selected-mark");
    pickOcontainer.classList.add("selected-mark");
    pickXimg.classList.remove("pick-x-img-active")
    pickOimg.classList.add("pick-o-img-active")
  }
}

function resetToggle() {
  // default to o selected 
  pickXcontainer.classList.remove("selected-mark");
  pickOcontainer.classList.add("selected-mark");
  pickXimg.classList.remove("pick-x-img-active")
  pickOimg.classList.add("pick-o-img-active")
}

function activePickMark(e) {
  // add active background
  const img = e.target.querySelector("img") ?? e.target;
  const div = img.closest("div");
  // if box is already selected return 
  if (div.classList.contains("selected-mark")) {
    return;
  } else {
    // change background 
    div.classList.add("pick-mark-active");
  }
}

function deactivatePickMark(e) {
  // remove active background
  const img = e.target.querySelector("img") ?? e.target;
  const div = img.closest("div");
  div.classList.remove("pick-mark-active");

}

pickXcontainer.addEventListener("click", togglePickMark);
pickOcontainer.addEventListener("click", togglePickMark);
pickXcontainer.addEventListener("mouseover", activePickMark);
pickOcontainer.addEventListener("mouseover", activePickMark);
pickXcontainer.addEventListener("mouseout", deactivatePickMark);
pickOcontainer.addEventListener("mouseout", deactivatePickMark);


function outlineMarkActive(e) {
  const currBox = e.currentTarget;
  if (main.classList.contains("filter")) return;
    // if box is ready marked return
  const checkData =
    currBox.dataset.mark === "x" || currBox.dataset.mark === "o";
  if (checkData) return;
  if(currBox.querySelector("img")) return;
  if (gameType === "cpu" && currentPlayer !== player1) return;
  const viewWidth = window.innerWidth;
  const size = viewWidth < 800 ? "small" : "large";
  currBox.classList.add(`${currentPlayer}-active-${size}`);
}

function removeMarkActive(e) {  
  if(e.currentTarget.querySelector("img")) return;
  const viewWidth = window.innerWidth;
  const size = viewWidth < 800 ? "small" : "large";
  const img = e.target.closest("div") ?? e.target;
  img.classList.remove(`${currentPlayer}-active-${size}`);
}

function markBox(e) {
  const currBox = e.currentTarget;
  if (main.classList.contains("filter")) return;
    // if box is ready marked return
  const checkData =
    currBox.dataset.mark === "x" || currBox.dataset.mark === "o";
  if (checkData) return;
  if(currBox.querySelector("img")) return;
  if (gameType === "cpu" && currentPlayer !== player1) return;

  // create img, size, and append
  const img = document.createElement("img");
  const viewWidth = window.innerWidth;
  if (viewWidth < 800) {
    img.style.width = "40px";
    img.style.height = "40px";
  } else if (viewWidth > 800) {
    img.style.width = "64px";
    img.style.height = "64px";
  }

  img.src = `assets/icon-${currentPlayer}-marker.svg`;
  currBox.appendChild(img);
  storeData(currBox);
  const win = checkWinner();
  if (!win) checkTie();
  switchPlayers();
  checkCpuTurn();

}


gameBoardBoxes.forEach((box) => box.addEventListener("mouseover", outlineMarkActive));
gameBoardBoxes.forEach((box) => box.addEventListener("mouseout", removeMarkActive));
gameBoardBoxes.forEach((box) => box.addEventListener("mouseup", removeMarkActive));
gameBoardBoxes.forEach((box) => box.addEventListener("click", markBox));

function checkCpuTurn() {
  if (gameType === "human") return;
  if (winningPlayer) return;
  if (isTied) return;
  if (gameType === "cpu" && currentPlayer !== player1) {
    // disables click events for the boxes while cpu marks
    gameBoardBoxes.forEach((box) => (box.style.pointerEvents = "none"));
    setTimeout(cpuMark, 500);
  }
}


// change marker sizes when window is resized
function changeMarkerSize() {
  const viewWidth = window.innerWidth;
  if (viewWidth < 800) {
    gameBoardBoxes.forEach(box => {
      if(!box.dataset.mark || box.dataset.mark === "null") return;
      const img = box.querySelector("img");
      img.style.width = "40px";
      img.style.height = "40px";
    })

  } else if (viewWidth > 800) {
    gameBoardBoxes.forEach(box => {
      if(!box.dataset.mark || box.dataset.mark === "null") return;
      const img = box.querySelector("img");
      img.style.width = "64px";
      img.style.height = "64px";
    })
  }
}


window.addEventListener("resize", changeMarkerSize);



