let surface = document.querySelector(".surface");
let boardGoL = document.getElementById("game-of-life-board");
let allCells = document.getElementsByClassName("cell");
const startSimulation = document.getElementById("start");
const stopSimulation = document.getElementById("stop");
const initialize = document.getElementById("initialize");
const resetView = document.getElementById("resetView");

let x = 0;
let y = 0;
let curx = 0;
let cury = 0;
let zooming = false;
let dragged = false;
let gridMoved = false;
let gridSize = 50;
let request; //animation frame request to stop animation

startSimulation.addEventListener("click", () => {
  runSimulation();
});

stopSimulation.addEventListener("click", () => {
  window.cancelAnimationFrame(request);
});

initialize.addEventListener("click", initializeGrid);

resetView.addEventListener("click", resetGridView);

function createGrid(size){
  surface.style.setProperty('--grid-rows', size);
  surface.style.setProperty('--grid-cols', size);

  for(let i = 0; i<size*size; i++ ){
    let cell = document.createElement("div",);
    cell.id = i.toString();
    cell.addEventListener('click', addLife, false);
    cell.classList.add("cell");
    surface.appendChild(cell);
  }

  seedGame();
}

function seedGame(seed){ //allow for a library of staring seeds
  let cellsArray = Array.from(allCells);
  cellsArray[1275].classList.add("life");
  cellsArray[1276].classList.add("life");
  cellsArray[1325].classList.add("life");
  cellsArray[1226].classList.add("life");
  cellsArray[1224].classList.add("life");
}

function initializeGrid(){
  let cellsArray = Array.from(allCells);
  cellsArray.map(e => {
    e.classList.remove("life");
  });
  seedGame();
}


/*
  Any live cell with two or three live neighbours survives.
  Any dead cell with three live neighbours becomes a live cell.
  All other live cells die in the next generation. Similarly, all other dead cells stay dead.
 */

function runSimulation() {
  request = window.requestAnimationFrame(runSimulation);
  let cellsArray = Array.from(allCells);
  let live = [];
  let die = [];
  for (let i = 0; i < cellsArray.length; i++) {
    let e = cellsArray[i];
    let count = checkCellNeighbors(e);
    if (e.classList.contains("life")) {
      if (count < 2 || count > 3) {
        die.push(e.id);
      }
    } else {
      if (count === 3) {
        live.push(e.id);
      }
    }
  }
  die.map(e => {
    cellsArray[e].classList.remove("life");
  });
  live.map(e => {
    cellsArray[e].classList.add("life");
  });
  if (live.length === 0) {
    window.cancelAnimationFrame(request);
  }
}

function checkCellNeighbors(e) {
  let cellsArray = Array.from(allCells);
  let count = 0;
  let c = e.id % gridSize;
  let r = Math.floor(e.id / gridSize);
  for (let x = Math.max(0, c - 1); x < Math.min(gridSize, c + 2); x++) {
    for (let y = Math.max(0, r - 1); y < Math.min(gridSize, r + 2); y++) {
      if (cellsArray[y*gridSize + x%gridSize].classList.contains("life")) {
        console.log("contains life?")
        if (x === c && y === r) {
          //don't count the center cell
        } else {
          console.log("counting neighbors cell " + x + " " + y + " " + count);
          count++;
        }
      }
    }
  }
  return count;
}

/*diagnostic test to check the throughput of the ui thread*/
async function blink(time, size) {
  for (let i = 0; i < time; i++) {
    let t1 = Math.floor(Math.random() * size);
    let elem1 = surface.children.item(t1 % size);
    elem1.style.backgroundColor = "black";
    await new Promise(r => {
      setTimeout(r, 10);
    });
    elem1.style.backgroundColor = "white";
  }
}

boardGoL.addEventListener('mouseenter', e=>{
  boardGoL.style.cursor = "pointer";
});

boardGoL.addEventListener('mousedown', e=> {
  console.log("mousedown");
  gridMoved = false;
  zooming = true;
  dragged = true;
  x = e.clientX;
  y = e.clientY;
  let curposx = getComputedStyle(surface).getPropertyValue('--x-offset');
  let curposy = getComputedStyle(surface).getPropertyValue('--y-offset');
  setCurrentPosition(curposx, curposy);
  // console.log("mousedown offsets " + curposx +" "+ curposy);
  console.log(dragged);
  //console.log("down " + x +" "+ y);
  e.preventDefault();
}, true);

boardGoL.addEventListener('mousemove', e=>{
  // console.log("mousemove");
  e.preventDefault();
  // console.log("mousemove offsets " + curx +" "+ cury);
  if(zooming === true) {
    //console.log("offset " + e.clientX + " " + e.clientY);
    let xNew = (curx + e.clientX - x).toString() + "px";
    let yNew = (cury + e.clientY - y).toString() + "px";
    // console.log("new " + xNew +" "+ yNew);
    surface.style.setProperty('--x-offset', xNew);
    surface.style.setProperty('--y-offset', yNew);
    if(xNew != 0 || yNew != 0){
      gridMoved = true;
    }
  }
});

boardGoL.addEventListener('click', e => {
  console.log("board click listener");
  if (gridMoved == true) {
    e.preventDefault();
    e.cancelBubble = true;
  }
  e.cancelBubble = false;
}, true);

function setCurrentPosition(x, y){
  curx = parseInt(x);
  cury = parseInt(y);
}

boardGoL.addEventListener('mouseup', e=>{
  e.preventDefault();
  zooming = false;
  // dragged = false;
  console.log("mouseup");
  console.log("dragged = false");
});

function addLife(){
  console.log("add neighbor");
    this.classList.toggle("life");
    console.log("i live");
}

function resetGridView(){
  surface.style.setProperty('--cell-size', 9 + "px");
  surface.style.setProperty('--x-offset', 0 + "px");
  surface.style.setProperty('--y-offset', 0 + "px");
}

boardGoL.addEventListener('wheel', e=>{
  let factor = e.deltaY * 0.00005;
  // if(e.deltaY < 0){
  //   factor = e.deltaY * 0.00005;
  // }
  console.log(e);
  let curScale = parseFloat(getComputedStyle(surface).getPropertyValue('--cell-size'));
  let offsetX = parseFloat(getComputedStyle(surface).getPropertyValue('--x-offset'));
  let offsetY = parseFloat(getComputedStyle(surface).getPropertyValue('--y-offset'));
  console.log("factor " + factor);
  console.log("curScale " + curScale);
  let newSize = Math.min(49, Math.max(curScale += curScale * factor, 4));
  let xNew;
  let yNew;
  if (e.deltaY < 0) {
    xNew = Math.min(250, offsetX + curScale);
    yNew = Math.min(250, offsetY + curScale);
  } else {
    xNew = Math.max(-2000, offsetX - curScale);
    yNew = Math.max(-2000, offsetY - curScale);
  }

  console.log("xNew " + xNew);
  console.log("yNew " + yNew);
  console.log("curScale " + curScale);
  console.log("newSize " + newSize);
  surface.style.setProperty('--cell-size', newSize.toString() + "px");
  surface.style.setProperty('--x-offset', xNew.toString() + "px");
  surface.style.setProperty('--y-offset', yNew.toString() + "px");

})


//generate the grid and seed it with a "glider"
createGrid(gridSize);
