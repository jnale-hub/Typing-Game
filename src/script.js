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
  quotes : sherlockQuotes,
  restart : null,
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
  let { quotes } = data;
  const dropdownButton = document.querySelector(".dropdown label");
  const dropdownItems = document.querySelectorAll(".dropdown-item");
  const htmlTheme = document.querySelector("html");

  dropdownItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Assign the quotes based on the clicked item's id
      switch (item.id) {
        case "sherlock":
          quotes = sherlockQuotes;
          htmlTheme.dataset.theme = "retro";
          break;
        case "strangerThings":
          quotes = strangerThingsQuotes;
          htmlTheme.dataset.theme = "stranger";
          break;
        case "modernFamily":
          quotes = modernFamilyQuotes;
          htmlTheme.dataset.theme = "fantasy";
          break;
        case "gameOfThrones":
          quotes = gameOfThronesQuotes;
          htmlTheme.dataset.theme = "got";
          break;
        case "moneyHeist":
          quotes = moneyHeistQuotes;
          htmlTheme.dataset.theme = "money_heist";
          break;
      }
      dropdownButton.innerText = item.innerText;
      document.querySelector("title").innerText = item.innerText + " | Typing Game";
      const newData = { quotes: quotes };
      startGame(newData);
    });
  });
}

// Constants
const QUOTE_ELEMENT = document.getElementById("quote");
const MESSAGE_ELEMENT = document.getElementById("message");
const TYPED_VALUE_ELEMENT = document.getElementById("typed-value");
const START_BUTTON = document.getElementById("start");
const TIME_ALLOTMENT = 120;

let words = [];
let passedWords = [];
let wordIndex = 0;
let wordsTyped = 0;


function startGame(data) {
  const { quotes, restart } = data;
  console.log(quotes);
  TYPED_VALUE_ELEMENT.disabled = false;
  document.querySelector(".countdown").classList.remove("hidden");
  document.getElementById("wpm").innerText = "";
  MESSAGE_ELEMENT.innerText = "";

  if (restart !== true) {
    timer();
  }

  const quoteIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[quoteIndex];

  console.log(quotes);
  // Put the quote into an array of words
  words = quote.split(" ");

  // Reset word tracking
  wordIndex = 0;
  passedWords = [];

  // UI updates
  START_BUTTON.innerText = "Restart";
  const spanWords = words.map((word) => `<span>${word} </span>`);
  QUOTE_ELEMENT.innerHTML = spanWords.join("");
  QUOTE_ELEMENT.childNodes[0].className = "text-accent-content bg-accent";

  // Setup the textbox
  TYPED_VALUE_ELEMENT.value = "";
  TYPED_VALUE_ELEMENT.focus();
}

function handleInput() {
  const currentWord = words[wordIndex];
  const typedValue = TYPED_VALUE_ELEMENT.value;

  const isEndOfSentence =
    typedValue === currentWord && wordIndex === words.length - 1;
  const isEndOfWord =
    typedValue.endsWith(" ") && typedValue.trim() === currentWord;
  const isCurrentlyCorrect = currentWord.startsWith(typedValue);

  if (isEndOfSentence) {
    let { quotes } = data;
    const ifRestart = true;
    const newData = { quotes: quotes, restart: ifRestart };
    startGame(newData);
    wordsTyped++;
  } else if (isEndOfWord) {
    wordsTyped++;
    passedWords.push(currentWord);
    TYPED_VALUE_ELEMENT.value = "";
    wordIndex++;
    QUOTE_ELEMENT.childNodes[wordIndex].className =
      "text-accent-content bg-accent";
  } else if (isCurrentlyCorrect) {
    TYPED_VALUE_ELEMENT.className =
      "input input-accent w-full max-w-xs  inline-block align-middle mt-2";
    START_BUTTON.className =
      "btn btn-accent text-accent-content inline-block align-middle mt-2 ml-2";
    QUOTE_ELEMENT.childNodes[wordIndex].className =
      "text-accent-content bg-accent";
  } else {
    START_BUTTON.className =
      "btn btn-primary text-primary-content inline-block align-middle mt-2 ml-2";
    TYPED_VALUE_ELEMENT.className =
      "input input-primary w-full max-w-xs  inline-block align-middle mt-2";
    QUOTE_ELEMENT.childNodes[wordIndex].className =
      "text-primary-content bg-primary";
  }

  for (let i = 0; i < passedWords.length; i++) {
    QUOTE_ELEMENT.childNodes[i].classList.add(
      "text-neutral-content",
      "bg-neutral"
    );
  }
}

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
  const wpm = Math.round(wordsTyped / time);

  MESSAGE_ELEMENT.innerText = "TIMES UP!";
  document.querySelector(".countdown").classList.add("hidden");
  document.getElementById("wpm").innerText = `WPM : ${wpm}`;
}
