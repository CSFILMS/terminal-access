<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Unscramble Demo</title>
  <style>
    body {
      background: black;
      color: #D4D4D4;
      font-family: monospace;
      padding: 20px;
      max-width: 700px;
      margin: auto;
      white-space: pre-wrap;
      line-height: 1.4;
      user-select: none;
    }
    #unscramble {
      cursor: default;
      min-height: 20em; /* prevent jumping */
    }
    #prompt {
      margin-top: 2em;
      color: #D4D4D4;
      font-weight: bold;
      visibility: hidden;
      white-space: pre-wrap;
      font-family: monospace;
      line-height: 1.4;
      user-select: none;
    }
  </style>
</head>
<body>

<pre id="unscramble"></pre>
<pre id="prompt">
PRESS SPACEBAR TO CONTINUE</pre>

<script>
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,\'"?!-—:;\n';
const el = document.getElementById('unscramble');
const prompt = document.getElementById('prompt');

let fullTextRaw = '';
let pages = [];
let currentPage = 0;
let isAnimating = false;

function scrambleFastChunks(element, text, onComplete) {
  let index = 0;
  const chunkSize = 15; 
  const scrambled = text.split('');
  const length = text.length;

  isAnimating = true;
  prompt.style.visibility = 'hidden';

  const interval = setInterval(() => {
    let display = scrambled.slice();

    for (let i = 0; i < index; i++) {
      let start = i * chunkSize;
      let end = start + chunkSize;
      if (end > length) end = length;
      for (let j = start; j < end; j++) {
        display[j] = text[j];
      }
    }

    for (let k = index * chunkSize; k < length; k++) {
      if (/\s/.test(text[k])) {
        display[k] = text[k];
      } else {
        display[k] = chars[Math.floor(Math.random() * chars.length)];
      }
    }

    element.textContent = display.join('');
    index++;

    if ((index * chunkSize) >= length) {
      clearInterval(interval);
      element.textContent = text;
      isAnimating = false;
      prompt.style.visibility = 'visible';
      if (onComplete) onComplete();
    }
  }, 80);
}

function startPage(pageIndex) {
  if (pageIndex >= pages.length) {
    pageIndex = 0; // loop to start
  }
  currentPage = pageIndex;
  el.textContent = '';
  scrambleFastChunks(el, pages[pageIndex]);
}

// Load external text file
fetch('PitchText.txt')
  .then(res => res.text())
  .then(text => {
    fullTextRaw = text.toUpperCase();
    pages = fullTextRaw.split('\n\n\n\n'); // 4 consecutive newlines = page break
    startPage(0); // start after text loads
  });

window.addEventListener('keydown', e => {
  if (e.key === ' ' && !isAnimating) {
    e.preventDefault();
    startPage(currentPage + 1);
  }
});
</script>
</body>
</html>
