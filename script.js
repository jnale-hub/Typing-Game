// inside script.js
// all of our quotes
const quotes = [
    "When confronted with the enigma of a seemingly insurmountable problem, a task that demands your utmost intellectual rigor and unrelenting perseverance, and you, through painstaking analysis, have meticulously scrutinized and systematically discarded every conceivable hypothesis that, under the rigorous scrutiny of logic and empirical evidence, has proven to be manifestly implausible and irredeemably incompatible with the known laws of the universe, what, in the wake of this relentless process of elimination, remains as the sole, albeit improbable, solution is endowed with the inexorable status of undeniable truth—a truth that transcends the boundaries of possibility and ushers us into the realm of the extraordinary.",
    "In the realm of intellectual pursuits, few phenomena are as beguiling and, paradoxically, as treacherously deceptive as a fact that, on its surface, exudes an air of unwavering certainty and self-evident truth. Yet, beneath this veneer of clarity lies a rich and complex tapestry of subtleties and intricacies, a labyrinthine network of underlying factors and hidden variables, that defy our complacent acceptance of the apparent and beckon us toward a deeper, more profound exploration—a journey that challenges our preconceptions and demands the unrelenting scrutiny of a discerning mind.",
    "Over the course of my extensive and illustrious career as a relentless seeker of truth and a tireless devotee to the art of deduction, I have cultivated a discerning sensibility, an acute intuition that unfailingly alerts me to the presence of an intellectual crossroads. It is at these junctures, when an empirical statement, cast in the garb of incontrovertible fact, stands in obstinate contradiction to the intricate and painstakingly constructed scaffold of deductive reasoning, that the mind is presented with an intellectual conundrum of profound significance—a riddle that can only be unraveled by embracing the tantalizing possibility that the 'fact' in question possesses the remarkable versatility to accommodate an alternative and, at times, revelatory interpretation.",
    "My philosophy in matters of principles and standards has been one of unwavering steadfastness—an uncompromising commitment to the unassailable rigidity of absolutes. It is a creed that vehemently rejects the insidious allure of exceptions, recognizing them not as subtle nuances that fortify the rule but as insidious underminers of the very foundation upon which the rule is constructed. For in the presence of an exception, the rule, no matter how seemingly invulnerable, is laid bare, its vulnerability exposed, and its authority irreversibly compromised.",
    "The inventive potential of the human intellect, the boundless wellspring of creativity that lies dormant within each and every individual, is a testament to the astonishing capacity of our species to transcend the limits of the conceivable. The notion that what one ingenious mind can conceive and bring into existence can, in turn, be unravelled, discerned, and further expanded upon by another equally ingenious mind stands as a testament to the enduring legacy of human ingenuity—a legacy that reaffirms the indomitable spirit of exploration and discovery that defines the human condition.",
    "In the crucible of my extensive experience as a detective and an ardent pursuer of enigmatic mysteries, I have witnessed firsthand the transformative power of articulate communication. There exists, in the act of narrating, the potential to unravel even the most perplexing and inscrutable of riddles. When the details of a complex case are conveyed with precision and eloquence to another individual, an alchemical process unfolds—an alchemy that not only serves to elucidate the intricacies but also invites fresh perspectives and illuminating insights. It is a process through which the seemingly inscrutable becomes decipherable, the elusive attainable, and the arcane comprehensible.",
    "My deeply ingrained belief, nurtured over a lifetime of profound experiences and intellectual exploration, is rooted in the unshakable conviction that education is an inexhaustible odyssey—a ceaseless voyage of discovery that transcends the limitations of time and circumstance. It is a journey characterized not by finite destinations but by an unending succession of enlightening experiences and instructive lessons, each building upon the last in an ever-expanding continuum of growth and enlightenment. It is a journey in which the most profound and illuminating epiphanies often lie in wait, patiently unfolding in the latter stages of our lifelong quest for knowledge and wisdom—a quest that, in its infinite scope, reveals the boundless potential of the human mind and spirit.",
  ];  
// store the list of words and the index of the word the player is currently typing
let words = [];
let passedWords = [];
let wordIndex = 0;
// the starting time
let startTime = Date.now();
// page elements
const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const startElement = document.getElementById('start');

startElement.addEventListener('click', () => {
    // get a quote
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[quoteIndex];
    // Put the quote into an array of words
    words = quote.split(' ');
    // reset the word index for tracking
    wordIndex = 0;
    passedWords = [];
  
    // UI updates
    startElement.innerText = 'Restart';
    // Create an array of span elements so we can set a class
    const spanWords = words.map(function(word) { return `<span>${word} </span>`});
    // Convert into string and set as innerHTML on quote display
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
    startTime = new Date().getTime();
  });

  // at the end of script.js
typedValueElement.addEventListener('input', () => {
    // Get the current word
    const currentWord = words[wordIndex];
    // get the current value
    const typedValue = typedValueElement.value;

    if (typedValue === currentWord && wordIndex === words.length - 1) {
      // end of sentence
      // Display success
      const elapsedTime = new Date().getTime() - startTime;
      const message = `CONGRATULATIONS! You finished in ${elapsedTime / 1000} seconds.`;
      messageElement.classList.add('d-block');
      messageElement.classList.remove('d-none');
      messageElement.innerText = message;
    } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
      // end of word
      passedWords.push(currentWord);
      // clear the typedValueElement for the new word
      typedValueElement.value = '';
      // move to the next word
      wordIndex++;
      // reset the class name for all elements in quote
      for (const wordElement of quoteElement.childNodes) {
        wordElement.className = '';
      }
      // highlight the new word
      quoteElement.childNodes[wordIndex].className = 'highlight';
    } else if (currentWord.startsWith(typedValue)) {
      // currently correct
      // highlight the next word
      typedValueElement.className = '';
      quoteElement.childNodes[wordIndex].className = 'highlight';
    } else {
      // error state
      typedValueElement.className = 'error';
      quoteElement.childNodes[wordIndex].className = 'text-error';
    }

    for (let i = 0; i < passedWords.length; i++) {
        quoteElement.childNodes[i].className = 'passed';
    }
  });