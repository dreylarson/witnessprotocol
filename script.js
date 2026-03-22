const petitionInput = document.getElementById('petition');
const questionInput = document.getElementById('question');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const responseBox = document.getElementById('responseBox');
const questionEcho = document.getElementById('questionEcho');
const answerText = document.getElementById('answerText');

const visiblePhrase = 'Witness, reveal the truth with your wisdom.';
const triggerKey = '.';

let secretMode = false;
let secretAnswer = '';
let disguisedLength = 0;
let isTypingAnimationRunning = false;

function resetAll() {
  secretMode = false;
  secretAnswer = '';
  disguisedLength = 0;
  petitionInput.value = '';
  questionInput.value = '';
  answerText.textContent = '';
  questionEcho.textContent = '';
  responseBox.classList.remove('show');
  petitionInput.focus();
}

function typeAnswer(text) {
  if (isTypingAnimationRunning) return;

  isTypingAnimationRunning = true;
  answerText.textContent = '';

  let index = 0;

  const timer = setInterval(() => {
    answerText.textContent += text.charAt(index);
    index += 1;

    if (index >= text.length) {
      clearInterval(timer);
      isTypingAnimationRunning = false;
    }
  }, 28);
}

function appendVisiblePhraseCharacter() {
  if (petitionInput.value.length < visiblePhrase.length) {
    petitionInput.value += visiblePhrase.charAt(petitionInput.value.length);
    return true;
  }

  return false;
}

petitionInput.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') return;

  if (event.key === 'Backspace') {
    event.preventDefault();

    if (petitionInput.value.length === 0) return;

    const deletingDisguisedCharacter = petitionInput.value.length <= disguisedLength;

    petitionInput.value = petitionInput.value.slice(0, -1);

    if (deletingDisguisedCharacter) {
      disguisedLength = petitionInput.value.length;
      secretAnswer = secretAnswer.slice(0, disguisedLength);
    }

    return;
  }

  if (event.key.length !== 1) return;

  if (event.key === triggerKey) {
    event.preventDefault();

    if (!secretMode) {
      secretMode = true;
      appendVisiblePhraseCharacter();
      disguisedLength = petitionInput.value.length;
    } else {
      appendVisiblePhraseCharacter();
      disguisedLength = petitionInput.value.length;
      secretMode = false;
    }

    return;
  }

  event.preventDefault();

  if (secretMode) {
    secretAnswer += event.key;

    const addedCharacter = appendVisiblePhraseCharacter();

    if (addedCharacter) {
      disguisedLength = petitionInput.value.length;
    } else {
      secretAnswer = secretAnswer.slice(0, disguisedLength);
    }

    return;
  }

  petitionInput.value += event.key;
});

petitionInput.addEventListener('paste', (event) => {
  event.preventDefault();
});

submitBtn.addEventListener('click', () => {
  const question = questionInput.value.trim();
  const visibleInvocation = petitionInput.value.trim();

  if (!visibleInvocation) {
    petitionInput.focus();
    return;
  }

  if (!question) {
    questionInput.focus();
    return;
  }

  const finalAnswer = secretAnswer.trim() || 'The witness offers no testimony.';

  questionEcho.textContent = `Inquiry logged: ${question}`;
  responseBox.classList.add('show');
  typeAnswer(finalAnswer);
});

resetBtn.addEventListener('click', resetAll);

questionInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitBtn.click();
  }
});

resetAll();