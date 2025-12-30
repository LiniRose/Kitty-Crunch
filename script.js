const screeHeight = window.innerHeight;
const screenWidth = window.innerWidth;
const score = document.querySelector("#score");
const highscoretxt = document.querySelector("#highScore");
const player = document.querySelector("#player");
const sound = new Audio("sound.mp3");

let space = 1500;
let direction = 0;
let playerLeft = parseInt(player.style.left) || 0;
let currentscore = 0;
let highscore = parseInt(localStorage.getItem("highscore")) || 0;
let playerRect = player.getBoundingClientRect();
let currentTime = 0;
let isPaused = false;

score.textContent = `${currentscore}`;
highscoretxt.textContent = `${highscore}`;
player.style.position = "absolute";
player.style.left = "0px";
player.style.top = screeHeight - playerRect.bottom - 20 + "px";
sound.loop = true;
sound.play();

//Check for player movement
document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
    if (direction > 0) direction = 0;
    direction--;
  } else if (event.code === "ArrowRight") {
    if (direction < 0) direction = 0;
    direction++;
  }
});

setInterval(tick, 10);

function tick() {
  if (isPaused) return;

  let random = Math.random();
  currentTime += 10;
  if (currentTime > space) {
    currentTime = 0;
    space *= 0.99;
    if (random < 0.8) tacoPlace();
    else bombPlacement();
  }
  playerMovement();

  bombMovement();

  tacoMovement();

  bombDetection();

  tacoDetection();
}

function playerMovement() {
  playerRect = player.getBoundingClientRect();
  let step = 3 * direction;
  //Checks if player collides with screen
  if (direction < 0) {
    if (playerLeft + step >= 0) {
      playerLeft += step;
    } else {
      playerLeft = 0;
    }
  } else {
    if (playerLeft + playerRect.width + step <= screenWidth) {
      playerLeft += step;
    } else {
      playerLeft = screenWidth - playerRect.width;
    }
  }

  player.style.left = playerLeft + "px";
  const dir = direction > 0 ? -1 : 1;
  player.style.setProperty("transform", `scaleX(${dir})`);
}

function bombMovement() {
  document.querySelectorAll(".Bomb").forEach((img) => {
    let top = parseInt(img.style.top) || 0;

    img.style.top = top + 3 + "px";
  });
}

function tacoMovement() {
  document.querySelectorAll(".Taco").forEach((img) => {
    let top = parseInt(img.style.top) || 0;

    img.style.top = top + 3 + "px";
  });
}

function bombDetection() {
  document.querySelectorAll(".Bomb").forEach((img) => {
    const bombRect = img.getBoundingClientRect();
    playerRect = player.getBoundingClientRect();
    if (
      bombRect.right > playerRect.left &&
      bombRect.left < playerRect.right &&
      bombRect.bottom > playerRect.top &&
      bombRect.top < playerRect.bottom
    ) {
      die();
    }

    if (bombRect.bottom >= screeHeight) {
      img.remove();
    }
  });
}

function tacoDetection() {
  document.querySelectorAll(".Taco").forEach((img) => {
    const tacoRect = img.getBoundingClientRect();
    playerRect = player.getBoundingClientRect();
    if (
      tacoRect.right > playerRect.left &&
      tacoRect.left < playerRect.right &&
      tacoRect.bottom > playerRect.top &&
      tacoRect.top < playerRect.bottom
    ) {
      currentscore++;
      score.textContent = `${currentscore}`;
      if (currentscore > highscore) {
        highscore = currentscore;
      }
      highscoretxt.textContent = `${highscore}`;
      img.remove();
    }

    if (tacoRect.bottom >= screeHeight) {
      img.remove();
      die();
    }
  });
}

function bombPlacement() {
  const bomb = document.createElement("img");
  Object.assign(bomb.style, {
    position: "absolute",
    top: 0 + "px",
    height: 6 + "%",
    width: 5 + "%",
  });
  bomb.src = "pictures/bomb.png";
  bomb.className = "Bomb";

  document.body.append(bomb);

  bomb.style.left =
    Math.random() * (window.innerWidth - bomb.offsetWidth) + "px";
}

function tacoPlace() {
  const taco = document.createElement("img");
  Object.assign(taco.style, {
    position: "absolute",
    top: 0 + "px",
    height: 6 + "%",
    width: 5 + "%",
  });
  taco.src = "pictures/taco.png";
  taco.className = "Taco";

  document.body.append(taco);

  taco.style.left =
    Math.random() * (window.innerWidth - taco.offsetWidth) + "px";
}

function die() {
  if (currentscore > highscore) {
    highscore = currentscore;
  }

  sound.pause();
  sound.currentTime = 0;

  document.querySelectorAll(".Bomb, .Taco").forEach((img) => {
    img.remove();
  });

  const overlay = document.createElement("div");
  overlay.className = "end-overlay";

  const modal = document.createElement("div");
  modal.className = "end-modal";

  const yourScore = document.createElement("h1");
  yourScore.textContent =
    "Kitty is sad you only gave it " + currentscore + " tacos, try harder!";
  if (currentscore === highscore) {
    yourScore.textContent =
      "Kitty ate " + currentscore + " tacos, still not enough!";
  }
  
  const button = document.createElement("button");
  button.textContent = "Give it more tacos!";
  button.id = "restart";

  modal.appendChild(yourScore);
  modal.appendChild(button);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  isPaused = true;

   button.addEventListener("click", () => {
    overlay.remove();
    isPaused = false;
    currentscore = 0;
    localStorage.setItem("highscore", highscore);
    score.textContent = `${currentscore}`;
    sound.play();
    space = 1000;
    direction = 0;
  });
}

