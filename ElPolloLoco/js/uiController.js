let control = false
let playMusic = true;
let gameStarted = false;
let gameMusic = new Audio('audio/background_music.mp3');
gameMusic.volume = 0.3;
let fullscreenMode = false;

window.SOUNDS_ENABLED = true;

document.addEventListener('DOMContentLoaded', function() {
    loadSoundPreference();
});

function loadSoundPreference() {
    const soundState = localStorage.getItem('soundsEnabled');
    
    if (soundState === 'false') {
        playMusic = false;
        window.SOUNDS_ENABLED = false;
        updateMuteButtonsDisplay(true);
    } else {
        playMusic = true;
        window.SOUNDS_ENABLED = true;
        updateMuteButtonsDisplay(false);
    }
}

function updateMuteButtonsDisplay(isMuted) {
    const mute = document.getElementById('mute');
    const unmute = document.getElementById('unmute');
    const muteInGame = document.getElementById('muteInGame');
    const unmuteInGame = document.getElementById('unmuteInGame');
    
    if (isMuted) {
        muteIcon(mute, unmute, muteInGame, unmuteInGame);
    } else {
        unmuteIcon(mute, unmute, muteInGame, unmuteInGame);
    }
}

function startGame() {
  showGame();
  gameStarted = true;
  checkPlayMusic();
  showResponsiveBtn();
  if (fullscreenMode && gameStarted) {
    showCanvasinFull();
  }
}

function fullscreenchanged () {
  if (document.fullscreenElement == null) {
    let fullscreenCont = document.getElementById('canvas-cont');
    closeFullCanvas();
    closeFullNav();
    fullscreenMode = false;
  }
}
document.addEventListener('fullscreenchange', fullscreenchanged);

function showGame() {
  let canvas = document.getElementById('canvas');
  let startScreen = document.getElementById('first-screen');
  let gameNav = document.getElementById('game-nav');
  canvas.classList.remove('d-none');
  startScreen.classList.add('d-none');
  gameNav.classList.remove('d-none');
}

function showResponsiveBtn() {
  if (window.innerHeight < 480 && gameStarted) {
    let mobileControl = document.getElementById('mobile-cont');
    mobileControl.classList.remove('d-none');
  }
}

function checkPlayMusic() {
  if (playMusic) {
    gameMusic.play();
  }
}

function toggleControlsInstructions() {
  let controlMenu = document.getElementById('game-controls-instructions');
  if (!control) {
    controlMenu.classList.remove('d-none');
    control = true;
  } else {
    controlMenu.classList.add('d-none');
    control = false;
  }
}

function muteSound() {
  let mute = document.getElementById('mute');
  let unmute = document.getElementById('unmute');
  let muteInGame = document.getElementById('muteInGame');
  let unmuteInGame = document.getElementById('unmuteInGame');

  if (playMusic) {
    gameMusic.pause();
    playMusic = false;
    window.SOUNDS_ENABLED = false;
    muteIcon(mute, unmute, muteInGame, unmuteInGame);
    localStorage.setItem('soundsEnabled', 'false');
  } else {
    if (gameStarted) {
      gameMusic.play();
    }
    playMusic = true;
    window.SOUNDS_ENABLED = true;
    unmuteIcon(mute, unmute, muteInGame, unmuteInGame);
    localStorage.setItem('soundsEnabled', 'true');
  }
}

function muteIcon(mute, unmute, muteInGame, unmuteInGame) {
  mute.classList.add('d-none');
  unmute.classList.remove('d-none');
  muteInGame.classList.add('d-none');
  unmuteInGame.classList.remove('d-none');
}

function playSound(sound) {
  if (window.SOUNDS_ENABLED) {
      sound.play();
  }
}

function unmuteIcon(mute, unmute, muteInGame, unmuteInGame) {
  mute.classList.remove('d-none');
  unmute.classList.add('d-none');
  muteInGame.classList.remove('d-none');
  unmuteInGame.classList.add('d-none');
}

function setFullscreen() {
  let fullscreenCont = document.getElementById('canvas-cont');
  if (!fullscreenMode) {
    enterFullscreen(fullscreenCont);
    showCanvasinFull();
    showNavinFull();
    fullscreenMode = true;
  } else {
    exitFullscreen(fullscreenCont);
    closeFullCanvas();
    closeFullNav();
    fullscreenMode = false;
  }
}

function closeFullCanvas() {
  let canvas = document.getElementById('canvas');
  let canvasCont = document.getElementById('canvas-cont');
  let headline = document.getElementById('headline');

  if (screen.height < 480) {
    canvasCont.style.maxWidth = '560px';
    canvasCont.style.maxHeight = '400px';
  }else{
    canvasCont.style.maxWidth = '720px';
    canvasCont.style.maxHeight = '480px';
  }
  canvas.style.height = '480px';

  headline.classList.remove('d-none');
}

function showNavinFull() {
  let gameNav = document.getElementById('game-nav');
  gameNav.style.position = 'absolute';
  gameNav.style.top = '10px';
  gameNav.style.left = '10px';
  gameNav.style.right = '10px';
}

function closeFullNav() {
  let gameNav = document.getElementById('game-nav');
  gameNav.style.position = 'unset';
  gameNav.style.top = 'unset';
  gameNav.style.left = 'unset';
  gameNav.style.right = 'unset';
}

function showCanvasinFull() {
  let canvas = document.getElementById('canvas');
  let canvasCont = document.getElementById('canvas-cont');
  let headline = document.getElementById('headline');

  canvasCont.style.maxWidth = 'none';
  canvasCont.style.maxHeight = 'none';
  canvas.style.width = '100%';
  canvas.style.height = '100vh';
  headline.classList.add('d-none');
}

function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function showControl() {
  let controlInstructions = document.getElementById('controller-exp');
  if (!control) {
    controlInstructions.classList.remove('d-none');
    control = true;
  } else {
    controlInstructions.classList.add('d-none');
    control = false;
  }
}

function restartGame() {
  document.getElementById('gameOverScreenLost').style.display = "none";
  document.getElementById('gameOverScreenWin').style.display = "none";
  
  gameStarted = false;
  
  for (let i = 1; i < 9999; i++) {
    window.clearInterval(i);
  }
  
  if (window.world) {
    window.world.character.coins = 0;
    window.world.character.bottles = 0;
    
    window.world.statusBarHealth.setPercentageHealth(100);
    window.world.statusBarBottle.setPercentageBottle(0);
    window.world.statusBarCoin.setPercentageCoin(0);
    window.world.statusBarEndboss.setPercentageEndboss(100);
    window.world.statusBarEndboss.visible = false;
    
    window.world.ctx.clearRect(0, 0, window.world.canvas.width, window.world.canvas.height);
  }
  
  if (gameMusic && !gameMusic.paused) {
    gameMusic.pause();
    gameMusic.currentTime = 0;
  }
  
  initLevel();
  init();
  startGame();
}

function backToMainMenu() {
  document.getElementById('canvas').classList.add('d-none');
  document.getElementById('gameOverScreenLost').style.display = "none";
  document.getElementById('gameOverScreenWin').style.display = "none";
  document.getElementById('game-nav').classList.add('d-none');
  
  document.getElementById('first-screen').classList.remove('d-none');
  
  gameStarted = false;
  
  for (let i = 1; i < 9999; i++) {
    window.clearInterval(i);
  }
  
  if (window.world) {
    window.world.character.coins = 0;
    window.world.character.bottles = 0;
    
    window.world.statusBarHealth.setPercentageHealth(100);
    window.world.statusBarBottle.setPercentageBottle(0);
    window.world.statusBarCoin.setPercentageCoin(0);
    window.world.statusBarEndboss.setPercentageEndboss(100);
    window.world.statusBarEndboss.visible = false;
    
    window.world.ctx.clearRect(0, 0, window.world.canvas.width, window.world.canvas.height);
  }
  
  if (gameMusic && !gameMusic.paused) {
    gameMusic.pause();
    gameMusic.currentTime = 0;
  }
}