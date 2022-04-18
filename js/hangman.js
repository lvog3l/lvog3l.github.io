let keys = document.querySelectorAll('.keys');
let newWord = document.querySelector('.new-word');
let puzzleWord = document.querySelector('.puzzle-word');
let imagePanel = document.querySelector('.top-panel');
let word = '';
let guess = [];
const start=0; const head=1; const body=2; const leg1=3; const leg2=4; const arm1=5; const end=6;
let state = 0;


keys.forEach((link) => link.addEventListener("click", setSelected));
newWord.addEventListener("click", resetGame);


function advanceGame() {
  state++;
  switch (state) {
    case start:
      //set classes
      break;
    case head:
      //set classes
      removeGameClasses();
      imagePanel.classList.add("head");
      break;
    case body:
      //set classes
      removeGameClasses();
      imagePanel.classList.add("body");
      break;
    case leg1:
      //set classes
      removeGameClasses();
      imagePanel.classList.add("leg1");
      break;
    case leg2:
      //set classes
      removeGameClasses();
      imagePanel.classList.add("leg2");
      break;
    case arm1:
      //set classes
      removeGameClasses();
      imagePanel.classList.add("arm1");
      break;
    case end:
      //set classes
      removeGameClasses();
      imagePanel.classList.add("end");
      console.log("game over");
      endGame(false);
      break;
    default:
      break;
  }
}

function removeGameClasses(){
  imagePanel.classList.remove("start");
  imagePanel.classList.remove("head");
  imagePanel.classList.remove("body");
  imagePanel.classList.remove("leg1");
  imagePanel.classList.remove("leg2");
  imagePanel.classList.remove("arm1");
  imagePanel.classList.remove("end");
}

function setSelected() {
  console.log("added selected");
  if (this.classList.contains("key-selected")) {
    // do nothing
  } else {
    this.classList.add("key-selected");
    console.log(this.id.toString().charAt(0));
    guessLetter(this.id.toString().charAt(0));
  }
}


function resetGame() {
  keys.forEach((key) => key.classList.remove("key-selected"));
  state = 0;
  removeGameClasses();
  imagePanel.classList.add("start");
  console.log("resetting and fetching word");
  getWord().then(r => {
    word = r.toString().toUpperCase();
    //printWord(word);
    fillDashes(word);
    console.log(word);
  });
}

function endGame(playerWon) {
  keys.forEach((key) => key.classList.add("key-selected"));
  dialog.style.display = "block";
  if (playerWon) {
    dialogMessage.innerText = "Congratulations! You guessed the word."
  } else {
    printWord(word);
    dialogMessage.innerText = "Sorry! You lost."
  }
}

async function getWord() {
  let wordLength = Math.floor(Math.random() * 6) + 5;
  let address = 'https://random-word-api.herokuapp.com/word?length=' + wordLength.toString();
  console.log(address);
  console.log("random " + wordLength);
  let response = await fetch(address);
  return response.json();
}

function fillDashes(w){
    guess = [];
  for(let i = 0; i < w.length; i++){
    guess.push('_');
  }
  printWord(guess.join(' '));
}

function printWord(w){
  puzzleWord.innerHTML = w;
}

function guessLetter(l){
  let indices = [];
  for(let i = 0; i < word.length; i++){
    if(word.charAt(i) === l) {
      indices.push(i);
    }
  }
  console.log("indices after checking for letter e" + indices);
  if(indices.length === 0){
    // advance hangman image
    advanceGame();
  }else {
    for (let i = 0; i < indices.length; i++) {
      guess[indices[i]] = l;
    }
    console.log(indices);
    printWord(guess.join(" ").toUpperCase());
    if(!guess.includes("_")){
      endGame(true);
    }
  }
}


resetGame();





