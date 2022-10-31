//Declare variables
const helloModal = document.querySelector('#helloModal')
const chooseRoman = document.querySelector('.chooseRoman');
const chooseGreek = document.querySelector('.chooseGreek')
const cardDeck = document.querySelector('.card-deck');
const pairs = document.querySelector('.card-pair')
const movesCount = document.querySelector('.movesCount');
const timeCount = document.querySelector('.timer');
const description = document.querySelector('.description');
const descriptionTitle = document.querySelector('.description-title');
const descriptionText = document.querySelector('.description-text');
const romanDeck = document.querySelector('.chooseRomanDeck');
const greekDeck = document.querySelector('.chooseGreekDeck');
const playAgain = document.querySelector('#playAgain');


let getData = [];
let moves = 0;
let time = '';
let timer = { seconds: 0, minutes: 0, clearTime: -1 };
let winModal = document.querySelector('#winModal');
let congratulations = document.querySelector('.congratulations');
let textCount = document.querySelector('.textCount')

movesCount.textContent = moves;


//User chooses wich deck 

const loadRomanData = () => {
  loadData('./data/romanEmperors.json');
  helloModal.style.display = "none";
  greekDeck.classList.toggle('hideDeck');
}

const loadGreekData = () => {
  loadData('./data/greekGods.json');
  helloModal.style.display = "none";
  romanDeck.classList.toggle('hideDeck');
}


chooseRoman.addEventListener('click', loadRomanData);
chooseGreek.addEventListener('click', loadGreekData);

//Load data from json.file

const loadData = (url) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', url);
  xhr.addEventListener('load', processData);
  xhr.send();
}

const processData = evt => {
  const xhr = evt.target;
  //console.log(xhr);

  // Wenn der Status "OK" ist, Daten verarbeiten, sonst Fehlermeldung
  if (xhr.status == 200) {
    // Geladenen JSON-String in ein Array konvertieren
    getData = JSON.parse(xhr.responseText);
    cardGenerator(getData);
    console.log(getData);


    // Funktion, um die Daten in der Webseite darzustellen
    // renderContent(content);
  } else {
    console.log(xhr.status, 'Datei konnte nicht geladen werden');
  }
}


//Randomize the cards

const randomize = () => {
  const cardData = getData;
  cardData.sort(() => Math.random() - 0.5);

  return cardData;
}

//Card Generator Function
const cardGenerator = (content) => {
  const cardData = randomize(content);

  //Generate the HTML
  cardData.forEach((item) => {
    const card = document.createElement('div');
    const face = document.createElement('img');
    const back = document.createElement('img');
    card.classList = 'card';
    face.classList = 'face';
    back.classList = 'back';

    //Attach Source to the Cards
    face.src = item.imgSrc;
    back.src = './imgs/back2.png';
    card.setAttribute('name', item.name);

    //Attach Cards to Section
    cardDeck.appendChild(card);
    card.appendChild(face);
    card.appendChild(back);

    //Run the game when card is clicked
    card.addEventListener('click', (e) => {
      card.classList.toggle('toggleCard');
      checkCards(e);
      if (timer.seconds == 0 && timer.minutes == 0) {
        resetTimer();
      }
    })

  })

  //Load roman Deck on click on image on side

  romanDeck.addEventListener('click', (e) => {
    cardDeck.innerHTML = "";
    moves = 0;
    movesCount.textContent = moves;
    resetTimer();
    
    if (!cardDeck.classList.contains('chosenRoman')){
    loadData('./data/romanEmperors.json');
    cardDeck.classList.add('chosenRoman');
    cardDeck.classList.remove('chosenGreek');
    romanDeck.classList.toggle('hideDeck');
    greekDeck.classList.toggle('hideDeck');
    }
  })

 //Load greek Deck on click on image on side
  greekDeck.addEventListener('click', (e) => {
    cardDeck.innerHTML = "";
    moves = 0;
    movesCount.textContent = moves;
    resetTimer();
    if (!cardDeck.classList.contains('chosenGreek')){
      loadData('./data/greekGods.json');
      cardDeck.classList.add('chosenGreek'); 
      cardDeck.classList.remove('chosenRoman');
      romanDeck.classList.toggle('hideDeck');
      greekDeck.classList.toggle('hideDeck');
    }
  })
}

  
//****Action when cards are clicked******//


//Start timer
let startTimer = function () {

  if (timer.seconds === 59) {
    timer.minutes++;
    timer.seconds = 0;
  } else {
    timer.seconds++;
  }

  // Ensure that single digit seconds are preceded with a 0
  let formattedSec = "0";
  if (timer.seconds < 10) {
    formattedSec += timer.seconds;
  } else {
    formattedSec = String(timer.seconds);
  }

  time = `${timer.minutes}:${formattedSec}`;
  timeCount.innerText = time;
};
// Resets timer state and restarts timer

function resetTimer() {
  clearInterval(timer.clearTime);
  timer.seconds = 0;
  timer.minutes = 0;
  timeCount.innerText = `${"0:00"}`;

  timer.clearTime = setInterval(startTimer, 1000);
}


//Flip cards

const checkCards = (e) => {
  const clickedCard = e.target;
  clickedCard.classList.add('flipped');
  const flippedCards = document.querySelectorAll('.flipped');
  const toggleCard = document.querySelectorAll('.toggleCard');

  //check if cards are a match

  if (flippedCards.length == 2) {
    //when cards are a match
    if (flippedCards[0].getAttribute('name') == flippedCards[1].getAttribute('name')) {
      console.log('match');
      let match = getData.find(god => god.name == flippedCards[0].getAttribute('name'));
      let matchSrc = '';

      //make them not clickable, disappear and link them to aside
      flippedCards.forEach(card => {
        card.classList.remove('flipped');
        card.style.pointerEvents = 'none';
        matchSrc = card.querySelector('.face').src
        setTimeout(() => card.classList.add('hide'), 500);
      })

      //and let image and text appear on the side
      const matchImg = document.createElement('img');
      matchImg.src = matchSrc;
      pairs.appendChild(matchImg);
      descriptionTitle.innerText = match.title;
      descriptionText.innerText = match.text;


      // if no match
    } else {
      console.log('wrong');
      flippedCards.forEach(card => {
        card.classList.remove('flipped');
        setTimeout(() => card.classList.remove('toggleCard'), 1500);
      });

    }
    moves++;
    movesCount.textContent = moves;
  }


  

  //Event when Game is won/completed
  function showPopUp() {
    setTimeout(() => winModal.style.display = "block"), 2000;
    congratulations.innerText = "Congratulations!"
    textCount.innerText = `You solved the game in ${time} minutes and ${moves} moves.`;
    localStorage.setItem('Highscore', moves);
    localStorage.setItem('Time', time);  
    clearInterval(timer.clearTime);
    moves = 0;
    movesCount.textContent = moves;
    playAgain.addEventListener('click', restart);
  }

  if (toggleCard.length === 24) {
    showPopUp();
  }
};



//Restart
const restart = () => {
  pairs.innerHTML = "";
  descriptionTitle.innerHTML = "";
  descriptionText.innerHTML = "";
  let cardData = randomize();
  let faces = document.querySelectorAll(".face");
  let cards = document.querySelectorAll('.card');
  let section = document.querySelector('.card-deck');
  // section.style.pointerEvents = "none";
  cardData.forEach((item, index) => {
    cards[index].classList.remove('toggleCard');
    cards[index].classList.remove('hide');
    //Randomize
    setTimeout(() => {
      cards[index].style.pointerEvents = "all";
      faces[index].src = item.imgSrc;
      cards[index].setAttribute('name', item.name);
      // section.style.pointerEvents = "none";
    }, 1000);
    resetTimer();  
  });
  
  winModal.style.display = "none"
}


const init = () => {
  // loadData('./data/greekGods.json');
    

}

init();

