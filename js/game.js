function showInstructions() {
  document.getElementById("home").style.display = "none";
  document.getElementById("instructions").classList.remove("hidden");
}

// begin game by loading front.html
function beginGame() {
  window.location.href = "front.html";
}

function openObject(imageSrc) {
  const overlay = document.getElementById("objectView");
  overlay.classList.remove("hidden");

  const img = document.getElementById("objectImage");
  img.src = imageSrc;

  const keypad = document.getElementById("keypad");
  const clickKeys = document.getElementById("keys");
  const textOverlay = document.getElementById("textOverlay");

  // Default: hide everything
  keypad.classList.add("hidden");
  clickKeys.classList.add("hidden");
  textOverlay.classList.add("hidden");

  // Show keypad if safe open
  if (imageSrc.includes("safe.PNG")) {
    keypad.classList.remove("hidden");
    clickKeys.classList.remove("hidden");
  }

  // Show text input if code open
  if (imageSrc.includes("code.PNG")) {
    textOverlay.classList.remove("hidden");
  }
}

function closeObject() {
  document.getElementById("objectView").classList.add("hidden");
}

// list of backgrounds to rotate through
const backgrounds = [
  "images/front.PNG",
  "images/left.PNG",
  "images/right.PNG",
  "images/back.PNG"
];

let currentBackground = 0;

function changeBackground(direction) {
  currentBackground += direction;

  // change backgrounds based on arrow
  if (currentBackground < 0) {
    currentBackground = backgrounds.length - 1;
  }
  //loops back to 0
  if (currentBackground >= backgrounds.length) {
    currentBackground = 0;
  }

  document.getElementById("room").style.backgroundImage =
    `url('${backgrounds[currentBackground]}')`;

  updateRoomObjects();
}

function updateRoomObjects() {
  // hide everything first
  document.getElementById("safeSpot").style.display = "none";
  document.getElementById("folderSpot").style.display = "none";
  document.getElementById("codeSpot").style.display = "none";

  // show objects based on room
  if (currentBackground === 0) {
    // front room
    document.getElementById("safeSpot").style.display = "block";
    document.getElementById("folderSpot").style.display = "block";
  }

  if (currentBackground === 1) {
    // left room
    document.getElementById("codeSpot").style.display = "block";
  }
}

//safe code
let input = "";
const correct = "1333";

function press(btn) {
  if (input.length < 4) {
    input += btn.dataset.num;
    document.getElementById("typed").innerText = input;
  }
}

//check safe code
function checkCode() {
  if (input === correct) {
    alert("Unlocked!");
    // change front room background if code is correct
    updateRoomData();
  } else {
    alert("Wrong code");
    input = "";
    document.getElementById("typed").innerText = "----";
  }
}

function updateRoomData() {
    // change front room background image
    backgrounds[0] = "images/front_opensafe.PNG";
    
    const safeSpot = document.getElementById("safeSpot");
    if (safeSpot) {
      safeSpot.onclick = () => openObject('images/paper.PNG');
    }
    
    // Refresh the current background
    renderView(); 
}

function renderView() {
  const room = document.getElementById("room");
    
  // backgrounds is an array of image paths
  room.style.backgroundImage = `url('${backgrounds[currentBackground]}')`;

  // Make sure buttons/clickable spots update
  updateRoomObjects();
}

//check typed text code
function checkTextCode() {
  const input = document.getElementById("codeInput").value.toUpperCase();
  const correctCode = "DUB";

  if (input === correctCode) {
    localStorage.setItem("timeLeft", totalTime);
    const page = document.getElementById("page");
    page.classList.add("fade-out"); // start fade if code is right --> goes to escaped page

    // wait for the fade to finish before navigating to escaped page
    setTimeout(() => {
      window.location.href = "escaped.html";
    }, 3000); //3 sec
  } 
  else {
    alert("Wrong code!");
    document.getElementById("codeInput").value = "";
  }
}

//timer
let totalTime = 30 * 60; // 30 minutes

function startTimer() {
  const counter = document.getElementById("counter");

  const timerInterval = setInterval(() => {
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;

    counter.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    if (totalTime <= 0) {
      clearInterval(timerInterval);
      const page = document.getElementById("page");
      page.classList.add("fade-out"); // start fade if time runs out

      // wait for the fade to finish before navigating to lost page
      setTimeout(() => {
        window.location.href = "lost.html";
      }, 3000); //3 sec
    }

    totalTime--; // subtract 1 second
  }, 1000);
}

// load objects + timer
window.onload = function() {
  updateRoomObjects();
  startTimer();
};

//audio
let isMuted = false;

function toggleMute() {
  const music = document.getElementById("bgMusic");
  if (!music) return;

  isMuted = !isMuted;
  music.muted = isMuted;

  document.getElementById("muteBtn").innerText = isMuted ? "🔇" : "🔊";
}