var wordList = ["none"];
let randomWord;
let guessedWord;
let lettersUsed = [];
let failedAttempts = 0;
let maxAttempts = 15;
let gameFinished = false;

async function initializeGame() {
  await loadWordList('https://raw.githubusercontent.com/JorgeDuenasLerin/diccionario-espanol-txt/master/0_palabras_todas_no_conjugaciones.txt');
  randomWord = getRandomWord();
  guessedWord = Array(randomWord.length).fill('_');
  displayWord();
  failedAttempts = 0;
  lettersUsed = [];
  updateAttempts();
  document.getElementById('result').innerHTML = '';
  setupLetterButtons();
  gameFinished = false;
}

function loadWordList(url) {
  // fetch url (txt) and each line will be a word, skip the word is have some letter isn't on the abecedary
  return fetch(url)
    .then(response => response.text())
    .then(data => {
      wordList = data.split('\n').filter(word => {
        return word.split('').every(letter => {
          return 'abcdefghijklmnñopqrstuvwxyz'.includes(letter);
        }) && word.length > 3;
      });
    }).catch(err => {
      console.error(err);
    });
}

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex];
}

function displayWord() {
  document.getElementById('word-display').innerHTML = guessedWord.join(' ');
}

function setupLetterButtons() {
  const letterTable = document.getElementById('letter-table');
  letterTable.innerHTML = ''; // Limpiar la tabla

  const alphabet = 'abcdefghijklmnñopqrstuvwxyz';

  for (let i = 0; i < alphabet.length; i++) {
    const letter = alphabet[i];
    const button = document.createElement('button');
    button.textContent = letter.toUpperCase();
    button.onclick = function () {
      checkGuess(letter);
    };
    button.id = `btn-${letter}`;
    letterTable.appendChild(button);
  }
}

// listen to keypress event
document.addEventListener('keypress', function (event) {
  const letter = event.key.toLowerCase();
  if ('abcdefghijklmnñopqrstuvwxyz'.includes(letter)) {
    checkGuess(letter);
  }
});

function checkGuess(guess) {
  if (gameFinished || lettersUsed.includes(guess)) return;
  lettersUsed.push(guess);

  const button = document.getElementById(`btn-${guess}`);
  button.disabled = true;

  if (randomWord.includes(guess)) {
    for (let i = 0; i < randomWord.length; i++) {
      if (randomWord[i] === guess) {
        guessedWord[i] = guess;
      }
    }
    displayWord();
    button.style.backgroundColor = "#2ecc71"; // Verde pastel
  } else {
    failedAttempts++;
    updateAttempts();
    button.style.backgroundColor = "#e74c3c"; // Rojo
  }

  if (guessedWord.join('') === randomWord) {
    document.getElementById('result').innerHTML = '¡Felicidades! ¡Adivinaste la palabra!';
    endGame(true);
  } else if (failedAttempts === maxAttempts) {
    document.getElementById('result').innerHTML = `¡Agotaste tus intentos! La palabra era "${randomWord}". ¡Mejor suerte la próxima vez!`;
    endGame(false);
  }
}

function updateAttempts() {
  document.getElementById('attempts').innerHTML = `Fallos restantes: ${maxAttempts - failedAttempts}`;
}

function endGame(hasWon) {
  // cambiar fondo body dependiendo si gano o perdio el juego (alternar entre verde o rojo y fondo original)
  const bgColor = hasWon ? "#2ecc71" : "#e74c3c";
  const originalColor = "#f0f0f0";
  toggleColor();
  setTimeout(toggleColor, 1000);
  setTimeout(toggleColor, 2000);

  function toggleColor() {
    document.body.style.backgroundColor = bgColor;
    setTimeout(() => {
      document.body.style.backgroundColor = originalColor;
    }, 500);
  }

  // reset game after 4 seconds
  setTimeout(() => {
    resetGame();
    console.log('Juego reiniciado');
  }, 4000);

  gameFinished = true;
  const letterButtons = document.querySelectorAll('button[id^="btn-"]');
  letterButtons.forEach(button => {
    button.disabled = true;
  });
}

function resetGame() {
  initializeGame();
}

// Inicializar el juego al cargar la página
initializeGame();