const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const timeDisplay = document.getElementById('timeDisplay');

let playerX = 100;
let playerY = 250;
const playerSize = 20;

const obstacles = [];
let obstacleSize = 40;
let obstacleSpeed = 200; // Velocidad en píxeles por segundo
let obstacleSpawnRate = 0.01; // Probabilidad de generar un nuevo obstáculo

let survivalTime = 0;
let recordTime = 0;
let gameStartTime = 0;

let isGameOver = false; // Bandera para indicar si el juego ha terminado

function drawPlayer() {
  ctx.fillStyle = 'green';
  ctx.fillRect(playerX, playerY, playerSize, playerSize);
}

function drawObstacles() {
  ctx.fillStyle = 'red';
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacleSize, obstacleSize);
  });
}

canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  playerX = event.clientX - rect.left - playerSize / 2;
  playerY = event.clientY - rect.top - playerSize / 2;

  // Evitar que el jugador salga del canvas
  playerX = Math.max(0, Math.min(playerX, canvas.width - playerSize));
  playerY = Math.max(0, Math.min(playerY, canvas.height - playerSize));
});

function gameLoop(timestamp) {
  if (isGameOver) return; // Si el juego ha terminado, no hacer nada

  let deltaTime = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  survivalTime = Math.floor((timestamp - gameStartTime) / 1000);
  timeDisplay.textContent = `Tiempo: ${survivalTime}s | Récord: ${recordTime}s`;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawObstacles();

  obstacles.forEach((obstacle, index) => {
    obstacle.x -= obstacleSpeed * deltaTime / 1000;
    if (obstacle.x < -obstacleSize) {
      obstacles.splice(index, 1);
    }
    if (
      playerX < obstacle.x + obstacleSize &&
      playerX + playerSize > obstacle.x &&
      playerY < obstacle.y + obstacleSize &&
      playerY + playerSize > obstacle.y
    ) {
      // Colisión con el obstáculo
      resetGame();
    }
  });

  if (Math.random() < obstacleSpawnRate) {
    obstacles.push({
      x: canvas.width,
      y: Math.random() * (canvas.height - obstacleSize)
    });
  }

  // Aumentar la dificultad gradualmente
  if (survivalTime > 10 && survivalTime % 10 === 0) {
    obstacleSpeed += 1;
    obstacleSpawnRate += 0.001;
    obstacleSize += 0;
  }

  requestAnimationFrame(gameLoop);
}

function resetGame() {
  playerX = 100;
  playerY = 250;
  obstacles.length = 0;
  obstacleSize = 40;
  obstacleSpeed = 200;
  obstacleSpawnRate = 0.02;

  if (survivalTime > recordTime) {
    recordTime = survivalTime;
  }

  survivalTime = 0;
  gameStartTime = performance.now();
  isGameOver = false; // Reiniciar la bandera de juego terminado
}

let lastTimestamp = 0;
gameStartTime = performance.now();
isGameOver = false; // El juego no ha terminado al inicio
requestAnimationFrame(gameLoop);
