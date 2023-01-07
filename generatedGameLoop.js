// Get the canvas element and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Get the start screen and start button elements
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

// Get the score and lives div elements
const scoreDiv = document.getElementById("score");
const livesDiv = document.getElementById("lives");
const speedDiv = document.getElementById("speed");

// Set up the countdown timer
let countdown = 4;

// Score
let score = 0;

// Attach a click event listener to the start button
startButton.addEventListener("click", () => {
  // Hide the start screen
  startScreen.style.display = "none";

  countdownTimer();
});

// Create an array to store the green squares in
let greenSquares = [];

// Set up game variables
let lives = 3; // Number of lives the player has remaining
let gameOver = false; // Flag to track if the game is over

// Set up a timer to create a new green square every 3 seconds
setInterval(createGreenSquare, 3000);

// Set up a timer to spawn a new asteroid every second
setInterval(spawnAsteroids, 250);

// Set up a flag to track whether the speed boost is active
let speedBoostActive = false;

// Set up the initial position of the square
let x = 400;
let y = 400;
const size = 10;

// Set up the movement speed
let speed = 0.5;

// Set up a flag to track whether a key is currently pressed
let keyPressed = {
  w: false,
  a: false,
  s: false,
  d: false,
};

// Set up event listeners to update the keyPressed flag when a key is pressed or released
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "w":
      keyPressed.w = true;
      break;
    case "a":
      keyPressed.a = true;
      break;
    case "s":
      keyPressed.s = true;
      break;
    case "d":
      keyPressed.d = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "w":
      keyPressed.w = false;
      break;
    case "a":
      keyPressed.a = false;
      break;
    case "s":
      keyPressed.s = false;
      break;
    case "d":
      keyPressed.d = false;
      break;
  }
});

// Set up a function to update the position of the square based on the keyPressed flag
function updatePosition() {
  if (keyPressed.w) {
    y -= speed;
  }
  if (keyPressed.a) {
    x -= speed;
  }
  if (keyPressed.s) {
    y += speed;
  }
  if (keyPressed.d) {
    x += speed;
  }

  // Check if the square is outside the canvas and adjust its position if necessary
  if (x < 0) {
    x = 0;
  } else if (x + size > canvas.width) {
    x = canvas.width - size;
  }
  if (y < 0) {
    y = 0;
  } else if (y + size > canvas.height) {
    y = canvas.height - size;
  }

  // Asteroid positions
  for (let asteroid of asteroids) {
    asteroid.x += asteroid.xSpeed;
    asteroid.y += asteroid.ySpeed;
  }

  // Check if the square is colliding with a green square
  let asteroidCollision = checkAsteroidCollision(x, y, asteroids);
  if (asteroidCollision) {
    // If an asteroid collison is detected end the game
    lives -= 1;
    livesDiv.innerHTML = "Lives: " + parseInt(lives);
  }

  // Check if the square is colliding with a green square
  let collision = checkCollision(x, y, greenSquares);
  if (collision) {
    // If a collision is detected, activate the speed boost
    speedBoostActive = true;
    speed += 0.5;
    speedDiv.innerHTML = "Speed: " + parseInt(speed);
    score += 1;
    scoreDiv.innerHTML = "Score: " + parseInt(score);

    // Set a timer to deactivate the speed boost after 3 seconds
    setTimeout(deactivateSpeedBoost, 5000);
  }
}

function deactivateSpeedBoost() {
  speedBoostActive = false;
  speed -= 0.5;
  speedDiv.innerHTML = "Speed: " + speed.toString();
}

class GreenSquare {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 8;
  }
}

function countdownTimer() {
  // Decrement the countdown timer
  countdown--;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the countdown timer on the canvas
  ctx.font = "100px sans-serif ";
  ctx.fillStyle = "orange";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);

  // If the countdown timer is not yet finished, request another frame in 1 second
  if (countdown > 0) {
    setTimeout(countdownTimer, 1000);
  } else {
    // If the countdown timer is finished, start the game loop
    requestAnimationFrame(draw);
  }
}

function createGreenSquare() {
  // Generate random x and y coordinates for the green square
  let x = Math.floor(Math.random() * canvas.width);
  let y = Math.floor(Math.random() * canvas.height);

  greenSquares.push({ x, y });
}

function checkAsteroidCollision(redX, redY, ast) {
  // Loop through the green squares array
  for (let a of ast) {
    // Check if any border of square1 is touching any border of square2
    if (redX < a.x + 10 && redX + 10 > a.x && redY < a.y + 10 && 10 + redY > a.y) {
      // Collision detected!
      // Remove the asteroid from the asteroids array
      asteroids = asteroids.filter((obj) => obj.x !== a.x);
      return true;
    }
  }
  // No collision detected
  return false;
}

function checkCollision(redX, redY, speedupds) {
  // Loop through the green squares array
  for (let speedup of speedupds) {
    // Check if any border of square1 is touching any border of square2
    if (
      redX < speedup.x + 10 &&
      redX + 10 > speedup.x &&
      redY < speedup.y + 10 &&
      10 + redY > speedup.y
    ) {
      // Collision detected!
      // Remove speedup from the array
      greenSquares = greenSquares.filter((obj) => obj.x !== speedup.x);
      return true;
    }
  }

  // No collision detected
  return false;
}

// Set up an array to store the asteroids
let asteroids = [];

// Set up a function to spawn asteroids from the edges of the canvas
function spawnAsteroids() {
  // Generate a random number between 0 and 3 to determine which edge the asteroid will spawn from
  let edge = Math.floor(Math.random() * 4);

  // Create a new asteroid object
  let asteroid = {
    x: 0, // Set the initial x position of the asteroid
    xSpeed: 0, // Set the initial x speed of the asteroid
    y: 0, // Set the initial y position of the asteroid
    ySpeed: 0, // Set the initial y speed of the asteroid
  };

  // Set the initial position of the square based on the edge it will spawn from
  if (edge === 0) {
    // Spawn from the top edge
    asteroid.x = Math.random() * canvas.width;
    asteroid.ySpeed = Math.random() * 2;
    asteroid.xSpeed = Math.random();
  } else if (edge === 1) {
    // Spawn from the right edge
    asteroid.x = canvas.width;
    asteroid.y = Math.random() * canvas.height;
    asteroid.ySpeed = Math.random();
    asteroid.xSpeed = -Math.random() * 2;
  } else if (edge === 2) {
    // Spawn from the bottom edge
    asteroid.x = Math.random() * canvas.width;
    asteroid.ySpeed = -Math.random() * 2;
    asteroid.xSpeed = Math.random();
    asteroid.y = canvas.height;
  } else {
    // Spawn from the left edge
    asteroid.y = Math.random() * canvas.height;
    asteroid.ySpeed = Math.random();
    asteroid.xSpeed = Math.random() * 2;
  }

  // Add the asteroid to the array
  asteroids.push(asteroid);
}

// Set up a function to show the end screen
function showEndScreen() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the end screen
  ctx.fillStyle = "orange";
  ctx.font = "40px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
  ctx.font = "30px sans-serif";
  ctx.fillText(`Score: ${score} `, canvas.width / 2, canvas.height / 2 + 40);
}

// Function to draw updates to canvas
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update the position of the player
  updatePosition();

  // Draw the player
  ctx.fillStyle = "red";
  ctx.fillRect(x, y, size, size);

  // Draw the green speedups
  ctx.fillStyle = "green";
  for (let speedup of greenSquares) {
    ctx.fillRect(speedup.x, speedup.y, 10, 10);
  }

  // Draw the asteroids
  ctx.fillStyle = "gray";
  for (let asteroid of asteroids) {
    ctx.fillRect(asteroid.x, asteroid.y, 10, 10);
  }
  // Check if the player has run out of lives
  if (lives === 0) {
    gameOver = true; // Set the game over flag
    showEndScreen(); // Show the end screen
    score = 0;
    // startScreen.style.display = "flex";
    return; // Stop the rest of the function from running
  }

  // Request another frame to be drawn
  requestAnimationFrame(draw);
}
