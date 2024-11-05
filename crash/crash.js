let balance = 100.0;
let betAmount = 0;
let multiplier = 1.0;
let isRunning = false;
let interval;
let history = [];

const maxMultiplier = 1000;
let crashPoint;

function updateBalance() {
    document.getElementById("balance").innerText = balance.toFixed(2);
}

function startGame() {
    betAmount = parseFloat(document.getElementById("bet-amount").value);
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
        alert("Por favor, insira um valor de aposta válido e menor ou igual ao saldo.");
        return;
    }

    balance -= betAmount;
    updateBalance();

    document.getElementById("start-button").classList.add("hidden");
    document.getElementById("cashout-button").classList.remove("hidden");

    isRunning = true;
    multiplier = 1.0;

    crashPoint = getCrashPoint();

    interval = setInterval(runCrash, 100);
}

function getCrashPoint() {
    let random = Math.random();
    if (random < 0.8) {
        return (Math.random() * 1.0) + 1.0; 
    } else if (random < 0.95) {
        return (Math.random() * (10 - 2)) + 2; 
    } else if (random < 0.99) {
        return (Math.random() * (50 - 10)) + 10; 
    } else if (random < 0.999) {
        return (Math.random() * (100 - 50)) + 50; 
    } else {
        return (Math.random() * (maxMultiplier - 100)) + 100; 
    }
}

function runCrash() {
    if (!isRunning) return;

    if (multiplier < 2) {
        multiplier += 0.03; 
    } else {
        multiplier += 0.05; 
    }

    document.getElementById("multiplier").innerText = multiplier.toFixed(2) + "x";

    if (multiplier >= crashPoint) {
        endGame(false);
    }
}

function cashOut() {
    if (isRunning) {
        balance += betAmount * multiplier;
        updateBalance();
        addToHistory(multiplier);
        endGame(true);
    }
}

function endGame(won) {
    clearInterval(interval);
    isRunning = false;
    document.getElementById("start-button").classList.remove("hidden");
    document.getElementById("cashout-button").classList.add("hidden");

    const statusMessage = document.getElementById("status-message");
    statusMessage.innerText = won ? "Você ganhou!" : "Você perdeu!";

    if (!won) {
        statusMessage.className = "result-lost"; 
    } else {
        if (crashPoint < 2) {
            statusMessage.className = "result-won-green"; 
        } else if (crashPoint < 10) {
            statusMessage.className = "result-won-yellow"; 
        } else {
            statusMessage.className = ""; 
        }
    }

    if (!won) {
        addToHistory(crashPoint); 
    }
}

function addToHistory(multiplier) {
    history.unshift(multiplier.toFixed(2) + "x");
    if (history.length > 10) history.pop(); 
    const roundHistory = document.getElementById("round-history");
    roundHistory.innerHTML = history.map(mult => `<div class="round">${mult}</div>`).join('');
}

document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("cashout-button").addEventListener("click", cashOut);
