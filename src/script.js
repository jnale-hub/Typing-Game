// main.js
import {
  sherlockQuotes,
  strangerThingsQuotes,
  modernFamilyQuotes,
  gameOfThronesQuotes,
  moneyHeistQuotes,
} from "./quotes.js";

// Encapsulate the data
const data = {
  quotes: sherlockQuotes,
  restart: null,
};

// Call the initializeDropdown function when your page loads
document.addEventListener("DOMContentLoaded", () => {
  START_BUTTON.addEventListener("click", () => {
    startGame(data);
  });

  TYPED_VALUE_ELEMENT.addEventListener("input", handleInput);

  handleDropdown(data);
});

function handleDropdown(data) {
  const dropdownButton = document.querySelector(".dropdown label");
  const dropdownItems = document.querySelectorAll(".dropdown-item");
  const htmlTheme = document.querySelector("html");

  dropdownItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Assign the quotes based on the clicked item's id
      switch (item.id) {
        case "sherlock":
          data.quotes = sherlockQuotes;
          htmlTheme.dataset.theme = "retro";
          break;
        case "strangerThings":
          data.quotes = strangerThingsQuotes;
          htmlTheme.dataset.theme = "stranger";
          break;
        case "modernFamily":
          data.quotes = modernFamilyQuotes;
          htmlTheme.dataset.theme = "fantasy";
          break;
        case "gameOfThrones":
          data.quotes = gameOfThronesQuotes;
          htmlTheme.dataset.theme = "got";
          break;
        case "moneyHeist":
          data.quotes = moneyHeistQuotes;
          htmlTheme.dataset.theme = "money_heist";
          break;
      }
      dropdownButton.innerText = item.innerText;
      document.querySelector("title").innerText =
        item.innerText + " | Typing Game";
      startGame(data);
    });
  });
}

const QUOTE_ELEMENT = document.getElementById("quote");
const MESSAGE_ELEMENT = document.getElementById("message");
const TYPED_VALUE_ELEMENT = document.getElementById("typed-value");
const START_BUTTON = document.getElementById("start");

// Encapsulate game-related data and functions
const gameData = {
  words: [],
  passedWords: [],
  wordIndex: 0,
  wordsTyped: 0,
};

function startGame(data) {
  // Reset the gameData
  gameData.words = [];
  gameData.passedWords = [];
  gameData.wordIndex = 0;
  gameData.wordsTyped = 0;

  const quotes = data.quotes;
  TYPED_VALUE_ELEMENT.disabled = false;
  document.querySelector(".countdown").classList.remove("hidden");
  document.getElementById("wpm").innerText = "";
  MESSAGE_ELEMENT.innerText = "";

  if (data.restart !== true) {
    timer();
  }

  const quoteIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[quoteIndex];

  // Put the quote into an array of words
  gameData.words = quote.split(" ");

  // UI updates
  START_BUTTON.innerText = "Restart";
  const spanWords = gameData.words.map((word) => `<span>${word} </span>`);
  QUOTE_ELEMENT.innerHTML = spanWords.join("");
  QUOTE_ELEMENT.childNodes[0].className = "text-accent-content bg-accent";

  // Setup the textbox
  TYPED_VALUE_ELEMENT.value = "";
  TYPED_VALUE_ELEMENT.focus();
}

function handleInput() {
  const currentWord = gameData.words[gameData.wordIndex];
  const typedValue = TYPED_VALUE_ELEMENT.value;

  if (isEndOfSentence(currentWord, typedValue)) {
    handleEndOfSentence();
  } else if (isEndOfWord(currentWord, typedValue)) {
    handleEndOfWord();
  } else {
    handleTypingStatus(currentWord, typedValue);
  }

  updatePassedWordsStyles();
}

function isEndOfSentence(currentWord, typedValue) {
  return (
    typedValue === currentWord &&
    gameData.wordIndex === gameData.words.length - 1
  );
}

function isEndOfWord(currentWord, typedValue) {
  return typedValue.endsWith(" ") && typedValue.trim() === currentWord;
}

function handleEndOfSentence() {
  data.restart = true;
  startGame(data);
  gameData.wordsTyped++;
}

function handleEndOfWord() {
  gameData.wordsTyped++;
  gameData.passedWords.push(gameData.words[gameData.wordIndex]);
  TYPED_VALUE_ELEMENT.value = "";
  gameData.wordIndex++;
  QUOTE_ELEMENT.childNodes[gameData.wordIndex].className =
    "text-accent-content bg-accent";
}

function handleTypingStatus(currentWord, typedValue) {
  if (currentWord.startsWith(typedValue)) {
    TYPED_VALUE_ELEMENT.className =
      "input input-accent w-full max-w-xs  inline-block align-middle mt-2";
    START_BUTTON.className =
      "btn btn-accent text-accent-content inline-block align-middle mt-2 ml-2";
    QUOTE_ELEMENT.childNodes[gameData.wordIndex].className =
      "text-accent-content bg-accent";
  } else {
    START_BUTTON.className =
      "btn btn-primary text-primary-content inline-block align-middle mt-2 ml-2";
    TYPED_VALUE_ELEMENT.className =
      "input input-primary w-full max-w-xs  inline-block align-middle mt-2";
    QUOTE_ELEMENT.childNodes[gameData.wordIndex].className =
      "text-primary-content bg-primary";
  }
}

function updatePassedWordsStyles() {
  for (let i = 0; i < gameData.passedWords.length; i++) {
    QUOTE_ELEMENT.childNodes[i].classList.add(
      "text-neutral-content",
      "bg-neutral"
    );
  }
}

// Timer
const TIME_ALLOTMENT = 120;
let timerInterval;
function timer() {

  let remainingTime = TIME_ALLOTMENT;

  const minutesSpan = document.getElementById("minutes");
  const secondsSpan = document.getElementById("seconds");

  function updateDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    // Update the displayed values using CSS custom properties
    minutesSpan.style.setProperty("--value", String(minutes).padStart(2, "0"));
    secondsSpan.style.setProperty("--value", String(seconds).padStart(2, "0"));

    if (remainingTime < 0) {
      clearInterval(timerInterval);
      handleGameOver();
    }

    remainingTime--;
  }

  // Clear any previous timer intervals
  clearInterval(timerInterval);

  // Call the updateDisplay function initially
  updateDisplay();

  // Set an interval to update the display every second
  timerInterval = setInterval(updateDisplay, 1000);
}

function handleGameOver() {
  TYPED_VALUE_ELEMENT.value = "";
  TYPED_VALUE_ELEMENT.disabled = true;

  // Calculate elapsed time in minutes
  const time = TIME_ALLOTMENT / 60;
  const wpm = Math.round(gameData.wordsTyped / time);

  MESSAGE_ELEMENT.innerText = "TIMES UP!";
  document.querySelector(".countdown").classList.add("hidden");
  document.getElementById("wpm").innerText = `WPM : ${wpm}`;
}
