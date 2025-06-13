// Stock image URLs (Unsplash CDN, free to use)
const images = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
];

// Duplicate and shuffle images for pairs
let cardImages = [...images, ...images].sort(() => Math.random() - 0.5);

const memoryGame = document.getElementById('memory-game');
const movesSpan = document.getElementById('moves');
const timerSpan = document.getElementById('timer');
const restartBtn = document.getElementById('restart');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let timer = 0;
let timerInterval = null;

// Generate cards
function createBoard() {
  memoryGame.innerHTML = '';
  cardImages = [...images, ...images].sort(() => Math.random() - 0.5);
  matchedPairs = 0;
  moves = 0;
  movesSpan.textContent = "Moves: 0";
  timer = 0;
  timerSpan.textContent = "Time: 0s";
  clearInterval(timerInterval);
  timerInterval = null;
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  cardImages.forEach((img, idx) => {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.dataset.image = img;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"><img src="${img}" alt="Memory Card"></div>
        <div class="card-back">🪄</div>
      </div>
    `;
    card.addEventListener('click', flipCard);
    memoryGame.appendChild(card);
  });
}

// Flip card logic
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flipped');
  if (!timerInterval) startTimer();

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  movesSpan.textContent = `Moves: ${moves}`;
  checkForMatch();
}

// Check for match
function checkForMatch() {
  const isMatch = firstCard.dataset.image === secondCard.dataset.image;
  if (isMatch) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedPairs++;
    magicEffect(firstCard, secondCard);
    resetBoard();
    if (matchedPairs === images.length) {
      clearInterval(timerInterval);
      setTimeout(() => {
        alert(`🎉 You won in ${moves} moves and ${timer}s!`);
      }, 500);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetBoard();
    }, 900);
  }
}

// Reset board state
function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// Timer
function startTimer() {
  timerInterval = setInterval(() => {
    timer++;
    timerSpan.textContent = `Time: ${timer}s`;
  }, 1000);
}

// Restart
restartBtn.addEventListener('click', createBoard);

// Magical effect on match
function magicEffect(card1, card2) {
  const canvas = document.getElementById('magic-effect');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Get card positions
  [card1, card2].forEach(card => {
    const rect = card.getBoundingClientRect();
    for (let i = 0; i < 18; i++) {
      setTimeout(() => {
        drawMagic(rect.left + rect.width/2, rect.top + rect.height/2);
      }, i * 30);
    }
  });

  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 800);
}

function drawMagic(x, y) {
  const canvas = document.getElementById('magic-effect');
  const ctx = canvas.getContext('2d');
  const colors = ['#00eaff', '#7f53ac', '#fff', '#b3eaff'];
  for (let i = 0; i < 8; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const radius = 20 + Math.random() * 30;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.arc(px, py, 4 + Math.random() * 4, 0, 2 * Math.PI);
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.globalAlpha = 0.7;
    ctx.shadowBlur = 12;
    ctx.shadowColor = ctx.fillStyle;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
}

// Responsive canvas
window.addEventListener('resize', () => {
  const canvas = document.getElementById('magic-effect');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Start game
createBoard();