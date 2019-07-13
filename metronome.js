require([
  './3rdparty/audio.js',
], function(AudioManager) {
  const sounds = {
    ichi:              { filename: "resources/audio/ichi.mp3", },
    ni:                { filename: "resources/audio/ni.mp3", },
    san:               { filename: "resources/audio/san.mp3", },
    shi:               { filename: "resources/audio/shi.mp3", },
    swingup:           { jsfx: ["square",0.0000,0.4000,0.0000,0.0120,0.4560,0.4600,20.0000,1176.0000,2400.0000,0.0000,1.0000,0.0000,0.0100,0.0003,0.0000,0.4740,0.2480,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000], },
    coinishAxe:        { jsfx: ["square",0.0000,0.4000,0.0000,0.0200,0.4080,0.3400,20.0000,692.0000,2400.0000,0.0000,0.0000,0.0000,0.0100,0.0003,0.0000,0.4740,0.1110,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000] , },
  };

  const langs = {
    'en': {
      start: 'start',
      stop: 'stop',
      bpm: 'bpm',
    },
    'ja': {
      start: 'スタート',
      stop: 'ストップ',
      bpm: 'テンポ',
    },
  };
  const query = new URLSearchParams(window.location.search);
  const lang = langs[query.get('lang')] || langs[navigator.language] || langs[navigator.language.substr(0, 2)] || langs.en;

  const bpmLabelElem = document.querySelector('#bpm-label');
  const bpmDisplayElem = document.querySelector('#bpm-display');
  const bpmInputElem = document.querySelector('#bpm');
  const startElem = document.querySelector('#start');
  const mainElem = document.querySelector('#main>div');

  bpmLabelElem.textContent = lang.bpm;
  startElem.textContent = lang.start;

  const keys = Object.keys(sounds);
  const audioManager = new AudioManager(sounds);
  let ndx = 0;

  const beats = [
    { name: 'ichi', delay: 0.25, },
    { name: 'ni',   delay: 0.15, },
    { name: 'san',  delay: 0, },
    { name: 'shi',  delay: 0.05, },
  ];

  let bpm = 60;
  let timeElapsed = 0;
  let then = 0;
  let beat = 0;
  let timeMult = 0;
  function render(now) {
    now *= 0.001;
    const deltaTime = (now - then) * timeMult;
    then = now;
    
    const timePerBeat = 60 / bpm;
    timeElapsed += deltaTime;
    if (timeElapsed >= timePerBeat) {
      const sound = beats[beat];
      beat = (beat + 1) % beats.length;
      audioManager.playSound(sound.name, audioManager.getTime() + sound.delay, false);
      timeElapsed = timeElapsed % timePerBeat;
      mainElem.className = mainElem.className === 'flash0' ?  'flash1' : 'flash0';
    }
    requestAnimationFrame(render);
  }

  function updateBPMDisplay() {
    bpmDisplayElem.textContent = bpm;
  }
  updateBPMDisplay();

  bpmInputElem.addEventListener('input', () => {
    bpm = parseInt(bpmInputElem.value);
    updateBPMDisplay();
  });

  let started = false;
  startElem.addEventListener('click', () => {
    if (!started) {
      started = true;
      requestAnimationFrame(render);
    }
    beat = 0;
    timeMult = 1 - timeMult;
    timeElapsed = 0;

    startElem.textContent = timeMult ? lang.stop : lang.start;
  });
});