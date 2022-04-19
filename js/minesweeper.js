let board = document.querySelector('.game-board');
const newGame = document.getElementById('ms-new-game');
const numRows = 15;
const numCols = 15;
let gameArray = [];
let gameActive = false;

newGame.addEventListener("click", () => {
  gameInitialize();
});

function makeRows(rows, cols) {
  board.style.setProperty('--grid-rows', rows);
  board.style.setProperty('--grid-cols', cols);

  for(let r = 0; r < rows; r++){
    let tempArray = [];
    for(let cl = 0; cl < cols; cl++){
      let t = Math.floor(Math.random()*100);
      if(t < 85) {
        tempArray[cl] = '+';
      }else{
        tempArray[cl] = 'b'
      }
    }
    gameArray[r] = tempArray;
  }

  for (let c = 0; c < (rows * cols); c++) {
    let outerCell = document.createElement("div");
    let cell = document.createElement("div");
    cell.innerText = "+"
    outerCell.id = c.toString();
    cell.style.cursor = "pointer";
    outerCell.addEventListener("click", initialBombCheck);
    outerCell.addEventListener("contextmenu", toggleFlag, false);
    outerCell.appendChild(cell).className = "outer-cell";
    board.appendChild(outerCell).className = "grid-item";
    //outerCell.classList.remove("no-shadow");
  }
  console.log(gameArray);
}

function markCell(r, c, f) {
  let id = r * numRows + c; //convert id to grid coordinates
  let cell = document.getElementById(id.toString());
  cell.innerText = ' ';
  cell.style.backgroundColor = "#434b80";
  cell.style.border = "#434b80";
  cell.classList.add("no-shadow");
  if(f > 0){
    cell.innerText = f.toString();
  }
}

function toggleFlag (e){
  if(this.classList.contains("flag")){
    //remove flag and add back + or flag count if not a bomb
    this.classList.remove("flag");
    let c = this.id % numCols;
    let r = Math.floor(this.id / numRows);
    let contents = gameArray[r][c];
    if(contents !== 'b'){
      this.innerText = contents.toString();
    }
    console.log(contents);
  }else{
    this.classList.add("flag");
    this.innerText = "";
  }
  e.preventDefault();
}

function initialBombCheck() {
  if(!gameActive){
    return;
  }
  let c = this.id % numCols;
  let r = Math.floor(this.id / numRows);
  if (gameArray[r][c] === 'b') {
    //game over
    revealAllBombs();
  }else{
    this.style.backgroundColor = "#434b80";
    this.style.border = "#434b80";
    this.classList.add("no-shadow");
    //this.innerText = "";
    countSurroundingBombs(r, c);
    if(allMinesFound()){
      dialog.style.display = "block";
      dialogMessage.innerText = "Congratulations! you found all the mines."
      gameActive = false;
    }
  }
}

function countSurroundingBombs(r, c) {
  if (gameArray[r][c] !== 'b') {
    let flags = 0;
    for (let x = Math.max(0, r - 1); x < Math.min(numRows, r + 2); x++) {
      for (let y = Math.max(0, c - 1); y < Math.min(numCols, c + 2); y++) {
        if (gameArray[x][y] === 'b') {
          flags++;
        }
      }
    }
    //console.log("how many flags " + flags);
    if (flags === 0) {
      gameArray[r][c] = ' ';
      markCell(r, c, 0);
      // let id = r * numRows + c; //convert id to grid coordinates
      // let cell = document.getElementById(id.toString());
      // cell.innerText = ' ';
      // cell.style.backgroundColor = "#434b80";
      // cell.style.border = "#434b80";
      // cell.classList.add("no-shadow");
      // now check all the neighbors and their counts
      checkNeighbors(r, c);
    } else {
      gameArray[r][c] = flags.toString();
      //cell.innerText = flags.toString();
      markCell(r, c, flags);
      // let id = r * numRows + c; //convert id to grid coordinates
      // let cell = document.getElementById(id.toString());

      // cell.style.backgroundColor = "#434b80";
      // cell.style.border = "#434b80";
      // cell.classList.add("no-shadow");
    }
  }
}

function checkNeighbors(r, c) {
  for (let x = Math.max(0, r - 1); x < Math.min(numCols, r + 2); x++) {
    for (let y = Math.max(0, c - 1); y < Math.min(numCols, c + 2); y++) {
      // console.log("visiting neighbors " + x + " " + y);
      if (gameArray[x][y] === '+') {
        countSurroundingBombs(x, y);
        if (gameArray[x][y] === ' ') {
          // let id = r * numRows + c; //convert id to grid coordinates
          // let cell = document.getElementById(id.toString());
          // cell.style.backgroundColor = "#434b80";
          // cell.style.border = "#434b80";
          // cell.classList.add("no-shadow");
          markCell(r, c, 0);
          checkNeighbors(x, y);
        }
      }
    }
  }
}

function revealAllBombs(){
  for(let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      let id = r*numRows + c; //convert id to grid coordinates
      if(gameArray[r][c] === 'b'){
        let cell = document.getElementById(id.toString());
        cell.classList.add("mine");
        cell.innerText = "";
      }
    }
  }
  gameActive = false;
}

function allMinesFound() {
  let allFound = true;
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (gameArray[r][c] === '+') {
        return false; //short circuit check
      }
    }
  }
  return allFound;
}

function gameInitialize() {
  tearDownBoard();
  makeRows(numRows, numCols);
  gameActive = true;
}

function tearDownBoard(){
  while(board.firstChild){
    board.removeChild(board.firstChild);
  }
}

gameInitialize();
