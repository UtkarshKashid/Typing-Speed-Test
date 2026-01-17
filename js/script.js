const typingText = document.querySelector(".typing-text p");
const inpField = document.querySelector(".input-field");
const timeTag = document.querySelector(".time b");
const mistakeTag = document.querySelector(".mistake span:last-child");
const wpmTag = document.querySelector(".wpm span:last-child");
const cpmTag = document.querySelector(".cpm span:last-child");
const tryAgainBtn = document.querySelector(".try-again");

let timer = null;
let maxTime = 60;
let timeLeft = maxTime;
let charIndex = 0;
let mistakes = 0;
let isTyping = false;

function randomParagraph() {
  const randIndex = Math.floor(Math.random() * paragraphs.length);
  typingText.innerHTML = "";

  paragraphs[randIndex].split("").forEach((char) => {
    const span = `<span>${char}</span>`;
    typingText.innerHTML += span;
  });

  typingText.querySelectorAll("span")[0].classList.add("active");
}

function initTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeTag.textContent = timeLeft;
  } else {
    clearInterval(timer);
    inpField.disabled = true;
  }
}

function initTyping() {
  const characters = typingText.querySelectorAll("span");
  const typedChar = inpField.value[charIndex];

  if (charIndex < characters.length && timeLeft > 0) {
    if (!isTyping) {
      timer = setInterval(initTimer, 1000);
      isTyping = true;
    }

    if (typedChar === undefined || typedChar === "") {
      if (charIndex > 0) {
        charIndex--;
        const prevChar = characters[charIndex];

        if (prevChar.classList.contains("incorrect")) {
          mistakes--;
        }
        prevChar.classList.remove("correct", "incorrect", "active");
        prevChar.classList.add("active");

        if (charIndex + 1 < characters.length) {
          characters[charIndex + 1].classList.remove("active");
        }
      }
    } else {
      const currentChar = characters[charIndex];

      if (currentChar.textContent === typedChar) {
        currentChar.classList.add("correct");
      } else {
        currentChar.classList.add("incorrect");
        mistakes++;
      }

      currentChar.classList.remove("active");
      charIndex++;

      if (charIndex < characters.length) {
        characters[charIndex].classList.add("active");
      }
    }

    const timeElapsed = maxTime - timeLeft;
    const wpm =
      Math.round(((charIndex - mistakes) / 5 / (timeElapsed || 1)) * 60) || 0;

    mistakeTag.textContent = mistakes;
    wpmTag.textContent = wpm;
    cpmTag.textContent = charIndex - mistakes;
  }
}

function resetTest() {
  clearInterval(timer);
  inpField.disabled = false;
  inpField.value = "";

  timeLeft = maxTime;
  charIndex = 0;
  mistakes = 0;
  isTyping = false;

  timeTag.textContent = timeLeft;
  mistakeTag.textContent = "0";
  wpmTag.textContent = "0";
  cpmTag.textContent = "0";

  randomParagraph();
  inpField.focus();
}

randomParagraph();
document.addEventListener("keydown", () => inpField.focus());
typingText.addEventListener("click", () => inpField.focus());
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetTest);
