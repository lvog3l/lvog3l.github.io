let navExpand = document.querySelector('.nav__expand');
let nav = document.querySelector('.nav');
let navListItem = document.querySelectorAll('.nav-list-item');
let main = document.querySelector('.main');
let content = document.querySelectorAll('.game');
let golContent = document.getElementById("game-of-life-game"); //need to special case for the GoL layout
const dialog = document.getElementById('end-dialog');
const dialogMessage = document.getElementById('dialog-message');
const span = document.getElementsByClassName("close-button")[0];



navExpand.addEventListener("click", () => {
  nav.classList.toggle("nav-closed");
  content.forEach((link) => link.classList.toggle("container-closed"))
});

navListItem.forEach((link) => link.addEventListener("click", listActive));

navListItem.forEach((link) => link.addEventListener("click", gameBoardActive));

document.getElementById('hangman-game').classList.add("game-active"); //make hangman default active

span.addEventListener("click", () => {
  dialog.style.display = "none";
})


function listActive() {
  navListItem.forEach((link) => link.classList.remove("nav-list-item-active"));
  this.classList.add("nav-list-item-active");
}

function gameBoardActive() {
  dialog.style.display = "none"; //in case user switches with dialog showing, close dialog
  content.forEach((link) => link.classList.remove("game-active"));
  golContent.classList.remove("game-active");
  switch (this.id) {
    case 'hm':
      document.getElementById('hangman-game').classList.add("game-active");
      break;
    case 'mm':
      document.getElementById('mastermind-game').classList.add("game-active");
      console.log("minesweeper");
      break;
    case 'ms':
      document.getElementById('minesweeper-game').classList.add("game-active");
      console.log("minesweeper");
      break;
    case 'gol':
      document.getElementById('game-of-life-game').classList.add("game-active");
      console.log("gaem of life");
      break;
    default:
      break;
  }
}

