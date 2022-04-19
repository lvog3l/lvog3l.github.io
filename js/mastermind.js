const tray = document.getElementById("tray");
const pegs = tray.children;
const slots = document.querySelectorAll(".nested");
const scorePegs = document.querySelectorAll(".peg");
const colors = ["blue", "yellow", "green", "white", "red"];
const allRows = document.getElementsByClassName("row");
const codeDisplay = document.getElementsByClassName("code");
const newGameMM = document.querySelector(".new-game-button");
//const dialog = document.getElementById('end-dialog');
//const dialogMessage = document.getElementById('dialog-message');
//const span = document.getElementsByClassName("close-button")[0];
let submitButton = document.querySelector(".submit-button");
let numTurns = 10; // this ia magic number based on a fixed number of row and turns
let currentTurn = 1;
let secretCode = [];
let won = false;

// button.addEventListener("mousedown", ()=> {button.classList.toggle("submit-button-highlight");}, false);
// button.addEventListener("mouseup", ()=> {button.classList.toggle("submit-button-highlight");}, false);

submitButton.addEventListener("click", submit);
newGameMM.addEventListener("click", initializeMastermind);
span.addEventListener("click", () => { dialog.style.display = "none"; } );

function initializeMastermind() {
  currentTurn = 1;
  won = false;
  removeAllPegs();
  for (let i = 0; i < slots.length; i++) {

    slots.item(i).addEventListener("dragleave", function (e) {
      e.preventDefault();
      this.style.border = "none";
    }, false);

    slots.item(i).addEventListener("dragover", function (e) {
      e.preventDefault();
      //this.style.border = "1px solid black";
    }, false);

    slots.item(i).addEventListener("drop", function (event) {
      this.style.border = "none";
      let elem = document.getElementById(event.dataTransfer.getData("text"));
      let color = elem.style.getPropertyValue("background-color");
      this.style.backgroundColor = color;
      event.preventDefault();
    }, false);
  }


  initPegs();
  disableAllRows();
  generateCode();
  allRows[9].classList.remove("disabled"); //enable first row for playing
}

function initPegs() {
  for (let i = 0; i < pegs.length; i++) {
    pegs.item(i).style.backgroundColor = colors[i];
    pegs.item(i).style.opacity = "100";
    pegs.item(i).addEventListener("dragstart", pegDrag, false);
    pegs.item(i).addEventListener("dragend", pegDragExit, false);
    pegs.item(i).addEventListener("dragend", pegDragEnd, false);
  }
}

function generateCode(){
  for(let i = 0; i < 4; i++){
    secretCode[i] = colors[Math.floor(Math.random()*5)]; // select one of the 6 colors
  }
  console.log("secret code: " + secretCode);
}

function pegDrag(e){
  this.style.opacity = "0.999";
  this.style.boxShadow = "inset 2px 2px 6px var(--color-gray3), inset -2px -2px 6px var(--color-gray6)";
  console.log("pegDrag" + this.getAttribute("id"));
  e.dataTransfer.setData("text/plain", this.getAttribute("id"));
  console.log("id" + this.style.getPropertyValue( "id"));
  console.log(e);
}

function pegDragExit(e) {
    this.style.opacity = "100";
}

function pegDragEnd(e) {
  e.preventDefault();
  let data = e.dataTransfer.getData("text");
  let target = e.target;
  target.style.boxShadow = "inset 2px 2px 6px var(--color-gray6), inset -2px -2px 6px var(--color-gray3)";
  let elem = target.parentNode
  console.log("target id " + target.id);
  switch (target.id) {
    case "peg1":
      elem.removeChild(target);
      elem.prepend(target);
      break;
    case "peg2":
      elem.removeChild(target);
      elem.insertBefore(target, elem.children.item(1));
      break;
    case "peg3":
      elem.removeChild(target);
      elem.insertBefore(target, elem.children.item(2));
      break;
    case "peg4":
      elem.removeChild(target);
      elem.insertBefore(target, elem.children.item(3));
      break;
    case "peg5":
      elem.removeChild(target);
      elem.append(target);
      break;
  }
}



function gameWon(){
  return false;
}



function disableAllRows(){
  let rows = Array.from(allRows);
  rows.forEach(e => {e.classList.add("disabled")});
}

function enableAllRows(){
 let rows = Array.from(allRows);
 rows.forEach(e => {e.classList.remove("disabled")});
}

function removeAllPegs(){
  let slotArray = Array.from(slots);
  let pegArray = Array.from(scorePegs);
  let codeArray = Array.from(codeDisplay);
  slotArray.map(e => e.style.backgroundColor = "");
  pegArray.map(e => e.style.backgroundColor = "rgba(0, 0, 0, 25%)");
  codeArray.map(e => e.style.backgroundColor = "");
}

function submit() {
  evaluateGuess();
  if(won){
    exit(won);
  }else if(currentTurn == numTurns){
    exit(won);
  }else{
    incrementTurn();
  }

}

function incrementTurn() {
  let activeRow = numTurns - currentTurn;
  allRows[activeRow].classList.add("disabled");
  allRows[activeRow -1].classList.remove("disabled");
  currentTurn++;
}

function evaluateGuess(){
  let activeRow = numTurns - currentTurn;
  // allRows[activeRow].classList.add("disabled");
  // allRows[activeRow -1].classList.remove("disabled");
  let pegRow = allRows[activeRow].querySelector(".guess");
  let pegs = pegRow.querySelectorAll(".nested");
  let pegArray = Array.from(pegs);
  let tempCode = secretCode.map(e => e);
  let numColors = 0;
  let numPositions = 0;

  //test to see if all pegs have been used
  if (pegArray.some(e => e.style.backgroundColor !== "")) {
    let position = 0;
    let guess = pegArray.map(e => e.style.backgroundColor); //get array of colors
    guess.forEach(e => {
      if (tempCode.some(f => f === e)) {
        numColors++
        tempCode[tempCode.indexOf(e)] = " ";
        if (e === secretCode[position]) {
          numPositions++;
        }
      }
      position++;
      console.log(tempCode);
    });
    console.log("guess " + guess);
  } else {
    //prompt user to submit a proper guess
  }
  console.log("number of colors: " + numColors);
  console.log("number of positions: " + numPositions);
  computeScore(activeRow, numColors, numPositions);
  if(numPositions === 4){
    won = true;
  }
}

function computeScore(row, colors, position) {
  let pegRow = allRows[row].querySelector(".score");
  let scorePegs = pegRow.querySelectorAll(".peg");
  for(let i = 0; i < position; i++){
    scorePegs[i].style.backgroundColor = "white"
  }
  for(let i = position; i < colors; i++){
    scorePegs[i].style.backgroundColor = "black";
  }
}

function revealCode(){
  let codeArray = Array.from(codeDisplay);
  for(let i = 0; i < secretCode.length; i++){
    codeArray[i].style.backgroundColor = secretCode[i];
  }
}

function exit(won) {
  //disable all rows, reveal code, display dialog
  disableAllRows()
  revealCode();
  if (won) {
    dialog.style.display = "block";
    dialogMessage.innerText = "Congratulations! You cracked the code."
  } else {
    dialog.style.display = "block";
    dialogMessage.innerText = "Sorry! You lost."
  }
}

initializeMastermind();
