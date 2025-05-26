// Datos de los destinos europeos
const destinations = [
    { id: 1, name: 'París', image: 'assets/paris.jpg' },
    { id: 2, name: 'Roma', image: 'assets/rome.jpg' },
    { id: 3, name: 'Barcelona', image: 'assets/barcelona.jpg' },
    { id: 4, name: 'Amsterdam', image: 'assets/amsterdam.jpg' },
    { id: 5, name: 'Viena', image: 'assets/vienna.jpg' },
    { id: 6, name: 'Praga', image: 'assets/prague.jpg' },
    { id: 7, name: 'Venecia', image: 'assets/venice.jpg' },
    { id: 8, name: 'Santorini', image: 'assets/santorini.jpg' }
];

// Variables del juego
let gameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    opportunities: 10,
    startTime: null,
    gameInterval: null
};

// Elementos del DOM
const screens = {
    welcome: document.getElementById('welcome-screen'),
    game: document.getElementById('game-screen'),
    result: document.getElementById('result-screen')
};

const elements = {
    startButton: document.getElementById('start-game'),
    playAgainButton: document.getElementById('play-again'),
    gameBoard: document.getElementById('game-board'),
    movesCounter: document.getElementById('moves'),
    pairsCounter: document.getElementById('pairs'),
    opportunitiesCounter: document.getElementById('opportunities'),
    totalMoves: document.getElementById('total-moves'),
    totalTime: document.getElementById('total-time')
};

// Funciones de navegación entre pantallas
function showScreen(screenId) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenId].classList.add('active');
}

// Inicialización del juego
function initGame() {
    gameState = {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        moves: 0,
        opportunities: 10,
        startTime: null,
        gameInterval: null
    };

    // Crear pares de cartas
    const cardPairs = [...destinations, ...destinations];
    gameState.cards = shuffleArray(cardPairs);

    // Limpiar y crear el tablero
    elements.gameBoard.innerHTML = '';
    gameState.cards.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        elements.gameBoard.appendChild(cardElement);
    });

    // Actualizar contadores
    updateCounters();
}

// Crear elemento de carta
function createCardElement(card, index) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.dataset.cardId = card.id;
    cardElement.dataset.index = index;
    
    cardElement.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <img src="assets/card-back.jpg" alt="Card Back">
            </div>
            <div class="card-back">
                <img src="${card.image}" alt="${card.name}">
                <h3>${card.name}</h3>
            </div>
        </div>
    `;

    cardElement.addEventListener('click', () => handleCardClick(cardElement));
    return cardElement;
}

// Manejar clic en carta
function handleCardClick(cardElement) {
    if (gameState.flippedCards.length === 2) return;
    if (cardElement.classList.contains('flipped')) return;
    if (gameState.opportunities <= 0) return;

    cardElement.classList.add('flipped');
    gameState.flippedCards.push(cardElement);

    if (gameState.flippedCards.length === 2) {
        gameState.moves++;
        gameState.opportunities--;
        updateCounters();
        checkMatch();
    }
}

// Verificar coincidencia
function checkMatch() {
    const [card1, card2] = gameState.flippedCards;
    const match = card1.dataset.cardId === card2.dataset.cardId;

    if (match) {
        gameState.matchedPairs++;
        gameState.flippedCards = [];
        
        if (gameState.matchedPairs >= 4) {
            endGame();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            gameState.flippedCards = [];
            
            // Verificar si se agotaron las oportunidades después de voltear las cartas
            if (gameState.opportunities <= 0) {
                endGame();
            }
        }, 1000);
    }
}

// Actualizar contadores
function updateCounters() {
    elements.movesCounter.textContent = `Movimientos: ${gameState.moves}`;
    elements.pairsCounter.textContent = `Parejas: ${gameState.matchedPairs}/8`;
    elements.opportunitiesCounter.textContent = `Oportunidades: ${gameState.opportunities}`;
}

// Finalizar juego
function endGame() {
    clearInterval(gameState.gameInterval);
    const endTime = new Date();
    const timeSpent = Math.floor((endTime - gameState.startTime) / 1000);
    
    elements.totalMoves.textContent = gameState.moves;
    elements.totalTime.textContent = formatTime(timeSpent);
    
    // Actualizar mensaje según resultado
    const resultTitle = document.querySelector('#result-screen h2');
    const resultMessage = document.querySelector('#result-screen p');
    const discountMessage = document.querySelector('.discount-message');
    
    if (gameState.matchedPairs >= 4) {
        resultTitle.textContent = '¡Felicitaciones!';
        resultMessage.textContent = 'Has completado el Memotest de KIWI Viajes';
        discountMessage.style.display = 'block';
    } else {
        resultTitle.textContent = '¡Juego terminado!';
        resultMessage.textContent = `No has encontrado suficientes parejas para ganar el premio. Encontraste ${gameState.matchedPairs} parejas.`;
        discountMessage.style.display = 'none';
    }
    
    showScreen('result');
}

// Utilidades
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Event Listeners
elements.startButton.addEventListener('click', () => {
    showScreen('game');
    initGame();
    gameState.startTime = new Date();
});

elements.playAgainButton.addEventListener('click', () => {
    showScreen('welcome');
}); 