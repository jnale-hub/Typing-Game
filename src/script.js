import { sherlockQuotes, strangerThingsQuotes, modernFamilyQuotes, gameOfThronesQuotes, moneyHeistQuotes } from "./quotes.js";

// store the list of words and the index of the word the player is currently typing
let words = [];
let passedWords = [];
let wordIndex = 0;
let wordsTyped = 0;

// the starting time
let startTime = Date.now();

// page elements
const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const startButton = document.getElementById('start');

let quotes = sherlockQuotes;

const dropdownbutton = document.querySelector('.dropdown label');
const dropdownItems = document.querySelectorAll('.dropdown-item');

dropdownItems.forEach(item => {
  item.addEventListener('click', () => {
    // Assign the quotes based on the clicked item's id
    switch (item.id) {
      case 'sherlock':
        quotes = sherlockQuotes;
        break;
      case 'strangerThings':
        quotes = strangerThingsQuotes;
        break;
      case 'modernFamily':
        quotes = modernFamilyQuotes;
        break;
      case 'gameOfThrones':
        quotes = gameOfThronesQuotes;
        break;
      case 'moneyHeist':
        quotes = moneyHeistQuotes;
        break;
      default:
        quotes = sherlockQuotes; 
    }
    dropdownbutton.innerText = item.innerText;
    startGame();
  });
});

startButton.addEventListener('click', startGame);
typedValueElement.addEventListener('input', handleInput);

function startGame() {
  const quoteIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[quoteIndex];

  // Put the quote into an array of words
  words = quote.split(' ');

  // reset the word index for tracking
  wordIndex = 0;
  passedWords = [];

  // UI updates
  startButton.innerText = 'Restart';
  // Create an array of span elements so we can set a class
  const spanWords = words.map(word => `<span>${word} </span>`);
  // Convert into a string and set as innerHTML on the quote display
  quoteElement.innerHTML = spanWords.join('');
  // Highlight the first word
  quoteElement.childNodes[0].className = 'highlight';
  // Clear any prior messages
  messageElement.innerText = '';
  messageElement.classList.add('d-none');

  // Setup the textbox
  // Clear the textbox
  typedValueElement.value = '';
  // set focus
  typedValueElement.focus();
  // set the event handler

  // Start the timer
  startTime = Date.now();
}

function handleInput() {
  // Get the current word
  const currentWord = words[wordIndex];
  // get the current value
  const typedValue = typedValueElement.value;

  if (typedValue === currentWord && wordIndex === words.length - 1) {
    // end of sentence

    // Count the last word
    wordsTyped++;

    // Calculate WPM
    const elapsedTime = Date.now() - startTime;
    const minutes = elapsedTime / 1000 / 60; // Convert milliseconds to minutes
    const wpm = Math.round(wordsTyped / minutes);

    // Display success
    const message = `CONGRATULATIONS! You finished in ${minutes.toFixed(2)} minutes. Your WPM: ${wpm}`;
    messageElement.classList.add('d-block');
    messageElement.classList.remove('d-none');
    messageElement.innerText = message;
    quoteElement.childNodes[wordIndex].classList.add = 'text-secondary';
  } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
    // end of word
    wordsTyped++;
    passedWords.push(currentWord);
    // clear the typedValueElement for the new word
    typedValueElement.value = 'text-neutral-content bg-neutral';
    // move to the next word
    wordIndex++;
    // // reset the class name for all elements in the quote
    // for (const wordElement of quoteElement.childNodes) {
    //   wordElement.className = '';
    // }
    // highlight the new word
    quoteElement.childNodes[wordIndex].className = 'text-accent-content bg-accent';
  } else if (currentWord.startsWith(typedValue)) {
    // currently correct
    typedValueElement.className = 'input input-accent w-full max-w-xs';
    startButton.className = 'mt-2 btn-accent px-5 py-2 text-accent-content';
    quoteElement.childNodes[wordIndex].className = 'text-accent-content bg-accent';
  } else {
    // error state
    
    startButton.className = 'mt-2 btn-primary px-5 py-2 text-primary-content';
    typedValueElement.className = 'input input-primary w-full max-w-xs';
    quoteElement.childNodes[wordIndex].className = 'text-primary-content bg-primary';
  }

  for (let i = 0; i < passedWords.length; i++) {
    // passed word
    quoteElement.childNodes[i].className = 'text-neutral-content bg-neutral';
  }
}
