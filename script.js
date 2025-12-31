const screenHeight = window.innerHeight;
const screenWidth = window.innerWidth;

const scoreElement = document.querySelector("#score");
const highscoreElement = document.querySelector("#highScore");
const player = document.querySelector("#player");
const sound = new Audio("sound.mp3");

const fallSpeed = 3;
const playerSpeed = 3;

let interval = 1000;
let direction = 0;
let playerLeft = parseInt(player.style.left) || 0;
let currentscore = 0;
let highscore = parseInt(localStorage.getItem("highscore")) || 0;
let playerRect = player.getBoundingClientRect();
let currentTime = 0;
let isPaused = false;

scoreElement.textContent = `${currentscore}`;
highscoreElement.textContent = `${highscore}`;

player.style.position = "absolute";
player.style.left = "0px";
player.style.top = screenHeight - playerRect.bottom - 20 + "px";

sound.loop = true;
sound.play();

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") {
    if (direction > 0) direction = 0;
    direction--;
  } else if (e.code === "ArrowRight") {
    if (direction < 0) direction = 0;
    direction++;
  }
});

function playerMove() {
  playerRect = player.getBoundingClientRect();
  let move = playerSpeed * direction;

  if (direction < 0) {
    if (playerLeft + move >= 0) {
      playerLeft += move;
    } else {
      playerLeft = 0;
    }
  } else {
    if (playerLeft + playerRect.width + move <= screenWidth) {
      playerLeft += move;
    } else {
      playerLeft = screenWidth - playerRect.width;
    }
  }

  player.style.left = playerLeft + "px";

  const dir = direction > 0 ? -1 : 1;
  player.style.setProperty("transform", `scaleX(${dir})`);
}

function spawn(type) {
  const element = document.createElement("img");
  const specificHeight = type === "Taco" ? "6%" : "7%";

  Object.assign(element.style, {
    position: "absolute",
    top: "0px",
    width: "5%",
    height: specificHeight,
  });

  element.src = type === "Taco" ? "pictures/taco.png" : "pictures/bomb.png";
  element.className = type;
  document.body.append(element);

  element.style.left =
    Math.random() * (window.innerWidth - element.offsetWidth) + "px";
}

function fall(className) {
  document.querySelectorAll("." + className).forEach((element) => {
    const top = parseInt(element.style.top) || 0;
    element.style.top = top + fallSpeed + "px";

    if (element.getBoundingClientRect().bottom >= screenHeight) {
      element.remove();

      if (className === "Taco") die();
    }
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
      scoreElement.textContent = `${currentscore}`;
      if (currentscore > highscore) {
        highscore = currentscore;
      }
      highscoreElement.textContent = `${highscore}`;
      img.remove();
    }
  });
}

function tick() {
  if (isPaused) return;

  currentTime += 10;
  if (currentTime > interval) {
    currentTime = 0;
    interval *= 0.99;
    Math.random() < 0.8 ? spawn("Taco") : spawn("Bomb");
  }

  playerMove();

  fall("Bomb");

  fall("Taco");

  bombDetection();

  tacoDetection();
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
    interval = 1000;
    direction = 0;
  });
}

setInterval(tick, 10);
