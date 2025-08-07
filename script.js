const passwordInput = document.getElementById('password');
const msg = document.getElementById('msg');
const prompt = document.getElementById('prompt');
const boot = document.getElementById('boot');
const video = document.getElementById('video');

const correctPassword = 'A$$ANGE';

const accessGrantedSequence = [
  'ACCESS GRANTED',
  'DECRYPTING PAYLOAD...',
  'LOADING VIDEO MODULE',
  'EXECUTION AUTHORIZED',
];

const accessDeniedMessages = [
  'ACCESS DENIED',
  'UNAUTHORIZED ATTEMPT LOGGED',
  'INVALID KEY SEQUENCE',
  'SECURITY PROTOCOL ENGAGED',
  'FINGERPRINT MISMATCH'
];

function scrambleText(element, finalText, callback) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let iteration = 0;
  const scrambled = finalText.split('');

  const interval = setInterval(() => {
    const display = scrambled.map((char, i) => {
      if (i < iteration) return finalText[i];
      return chars[Math.floor(Math.random() * chars.length)];
    });
    element.textContent = display.join('');

    if (iteration >= finalText.length) {
      clearInterval(interval);
      element.textContent = finalText;
      if (callback) callback();
    }

    iteration += 1 / 2;
  }, 30);
}

function runSequence(lines, element, delay = 500, done) {
  let i = 0;
  function next() {
    if (i < lines.length) {
      scrambleText(element, lines[i], () => {
        setTimeout(next, delay);
      });
      i++;
    } else {
      if (done) done();
    }
  }
  next();
}

// Handle password entry
passwordInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const attempt = passwordInput.value;

    if (attempt === correctPassword) {
      passwordInput.style.display = 'none';
      runSequence(accessGrantedSequence, msg, 700, () => {
        video.style.display = 'block';
        video.play();
      });
    } else {
      const denial = accessDeniedMessages[Math.floor(Math.random() * accessDeniedMessages.length)];
      scrambleText(msg, denial, () => {
        passwordInput.value = '';
      });
    }
  }
});

// Initial boot sequence
const bootSequence = [
  '[OK] BIOS checksum verified',
  '[OK] Bootloader decrypted',
  '[OK] Neural access bridge initialized',
  '[OK] Proxy tunnels established',
  '[OK] Identity hash resolved',
  '[WARN] Clearance level: REDACTED'
];

runSequence(bootSequence, boot, 400, () => {
  scrambleText(prompt, '> ENTER AUTHORIZATION PASSWORD:');
});
