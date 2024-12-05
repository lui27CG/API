const API_URL = "https://digimon-api.vercel.app/api/digimon";
const digimonList = document.getElementById("digimon-list");
const team1Container = document.getElementById("team-1-container");
const team2Container = document.getElementById("team-2-container");
const team1Power = document.getElementById("team-1-power");
const team2Power = document.getElementById("team-2-power");
const resultDiv = document.getElementById("result");
const battleEffectDiv = document.getElementById("battle-effect");

const clearTeam1Button = document.getElementById("clear-team-1");
const clearTeam2Button = document.getElementById("clear-team-2");
const battleButton = document.getElementById("battle-button");

let team1 = [];
let team2 = [];

async function loadDigimon() {
    const response = await fetch(API_URL);
    const digimons = await response.json();
    displayDigimons(digimons);
}

function displayDigimons(digimons) {
    digimons.forEach(digimon => {
        const digimonCard = document.createElement("div");
        digimonCard.className = "grid-item";
        digimonCard.innerHTML = `
            <div class="grid-item-inner">
                <!-- Parte frontal -->
                <div class="grid-item-front">
                    <img src="${digimon.img}" alt="${digimon.name}" />
                </div>
                <!-- Parte trasera -->
                <div class="grid-item-back">
                    <p>${digimon.name}</p>
                    <p>Nivel: ${digimon.level}</p>
                </div>
            </div>
            <div class="selected-check hidden">✔</div>
        `;
        digimonCard.addEventListener("click", () => addToTeam(digimon, digimonCard));
        digimonList.appendChild(digimonCard);
    });
}

function addToTeam(digimon, digimonCard) {
    const checkMark = digimonCard.querySelector(".selected-check");

    if (team1.length < 6) {
        if (team1.some(d => d.name === digimon.name)) {
            alert("Este Digimon ya está en el Equipo 1.");
            return;
        }
        team1.push(digimon);
        digimonCard.classList.add("selected-team1");
        checkMark.classList.remove("hidden");
        updateTeamDisplay(team1, team1Container, team1Power);
    } else if (team2.length < 6) {
        if (team2.some(d => d.name === digimon.name)) {
            alert("Este Digimon ya está en el Equipo 2.");
            return;
        }
        team2.push(digimon);
        digimonCard.classList.add("selected-team2");
        checkMark.classList.remove("hidden");
        updateTeamDisplay(team2, team2Container, team2Power);
    } else {
        alert("Ambos equipos están llenos. No puedes agregar más Digimones.");
    }
}

function updateTeamDisplay(team, container, powerElement) {
    container.innerHTML = "";
    let totalPower = 0;

    team.forEach(digimon => {
        const img = document.createElement("img");
        img.src = digimon.img;
        img.alt = digimon.name;

        img.style.animation = "zoomIn 0.5s ease-out";

        container.appendChild(img);

        totalPower += parseLevel(digimon.level);
    });

    powerElement.textContent = totalPower;
}

function parseLevel(level) {
    const levels = {
        "In Training": 1,
        "Rookie": 2,
        "Champion": 3,
        "Ultimate": 4,
        "Mega": 5
    };
    return levels[level] || 0;
}

clearTeam1Button.addEventListener("click", () => {
    team1 = [];
    resetTeamDisplay(team1Container, team1Power, "selected-team1");
});

clearTeam2Button.addEventListener("click", () => {
    team2 = [];
    resetTeamDisplay(team2Container, team2Power, "selected-team2");
});

function resetTeamDisplay(container, powerElement, teamClass) {
    container.innerHTML = "";
    powerElement.textContent = 0;
    document.querySelectorAll(`.${teamClass}`).forEach(card => {
        card.classList.remove(teamClass);
        const checkMark = card.querySelector(".selected-check");
        checkMark.classList.add("hidden");
    });
}

battleButton.addEventListener("click", () => {
    const team1TotalPower = team1.reduce((sum, digimon) => sum + parseLevel(digimon.level), 0);
    const team2TotalPower = team2.reduce((sum, digimon) => sum + parseLevel(digimon.level), 0);

    if (team1TotalPower > team2TotalPower) {
        resultDiv.textContent = "¡Victoria para el Equipo 1!";
        fireConfetti("team1");
    } else if (team2TotalPower > team1TotalPower) {
        resultDiv.textContent = "¡Victoria para el Equipo 2!";
        fireConfetti("team2");
    } else {
        resultDiv.textContent = "¡Empate!";
    }

    battleEffectDiv.classList.remove("hidden");
});

function fireConfetti(winner) {
    const colors = winner === "team1" ? ["#ff6f00", "#00a1b3", "#007bff"] : ["#00a1b3", "#ff6f00", "#007bff"];

    const confettiSettings = {
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 },
        colors: colors,
        shapes: ['square', 'circle']
    };
    confetti(confettiSettings);
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        team1Container.style.opacity = '1';
        team2Container.style.opacity = '1';
    }, 500);
});

loadDigimon();
