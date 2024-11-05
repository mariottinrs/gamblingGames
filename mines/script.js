let balance = 100;
let betAmount = 0;
let mineCount = 0;
let cells = [];
let mines = [];
let gameOver = false;
let currentWinnings = 0;


function updateBalance() {
  document.getElementById("balance").innerText = balance.toFixed(2);
}


function startGame() {
  betAmount = parseFloat(document.getElementById("bet-amount").value);
  mineCount = parseInt(document.getElementById("mine-count").value);

  if (betAmount > balance) {
    alert("Saldo insuficiente para essa aposta!");
    return;
  }

  balance -= betAmount;
  updateBalance();

  resetGame();
  initializeGrid();
  placeMines();

  document.getElementById("cashout-button").style.display = "block";
  document.getElementById("start-button").style.display = "none";
}

function initializeGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  cells = [];

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => handleCellClick(i));
    cells.push(cell);
    grid.appendChild(cell);
  }
}

function placeMines() {
  mines = [];
  while (mines.length < mineCount) {
    const minePosition = Math.floor(Math.random() * 25);
    if (!mines.includes(minePosition)) {
      mines.push(minePosition);
    }
  }
}


function handleCellClick(index) {
  if (gameOver || cells[index].classList.contains("revealed")) return;

  if (mines.includes(index)) {

    cells[index].classList.add("revealed");
    cells[index].innerHTML = `<img src="../images/bomba.png" alt="Bomba">`;
    document.getElementById("status-message").innerText = "Você perdeu!";
    gameOver = true;


    revealAllMines();


    document.getElementById("cashout-button").style.display = "none";
    document.getElementById("start-button").style.display = "block";
  } else {

    cells[index].classList.add("revealed");
    cells[index].innerHTML = `<img src="../images/gema.png" alt="Gema">`;


    currentWinnings = calculateWinnings();
    document.getElementById("status-message").innerText = `Ganhos atuais: R$${currentWinnings.toFixed(2)}`;
  }
}


function calculateWinnings() {
  let revealedMines = cells.filter(cell => cell.classList.contains("revealed")).length;
  

  let baseWinnings = betAmount;


  if (revealedMines === 1) {
    baseWinnings += 3.03; 
  } else if (revealedMines === 2) {
    baseWinnings += 10.61; 
  } else if (revealedMines === 3) {
    baseWinnings += 17.16; 
  } else if (revealedMines >= 4) {
    baseWinnings += 25 + (revealedMines - 3) * 5;
  }

  return baseWinnings;
}


function revealAllMines() {
  mines.forEach((mineIndex) => {
    if (!cells[mineIndex].classList.contains("revealed")) {
      cells[mineIndex].classList.add("revealed");
      cells[mineIndex].innerHTML = `<img src="../images/bomba.png" alt="Bomba">`;
    }
  });
}


function cashOut() {
  if (currentWinnings > 0) {
    balance += currentWinnings;
    currentWinnings = 0;
    updateBalance();
    document.getElementById("status-message").innerText = "Você sacou seus ganhos!";


    document.getElementById("cashout-button").style.display = "none";
    document.getElementById("start-button").style.display = "block";
    resetGame();
  } else {
    alert("Não há ganhos para sacar!");
  }
}


function resetGame() {
  gameOver = false;
  document.getElementById("status-message").innerText = "";
  cells.forEach(cell => {
    cell.classList.remove("revealed");
    cell.innerHTML = "";
  });
}
