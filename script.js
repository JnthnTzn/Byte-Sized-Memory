const gameBoard = document.getElementById('memoryGrid');
const winModal = document.getElementById('winModal');
const reloadBtn = document.getElementById('restartBtn');
const modeRadios = document.querySelectorAll('input[name="gameMode"]');

const cardFaces = ['1', '2', '3', '4', '5', '6', '7', '8'];

let cardDeck = [...cardFaces, ...cardFaces];

let hasFlippedCard = false;
let lockBoard = false;
let firstCard = null;
let secondCard = null;
let matchCounter = 0;
let isHardMode = false;

modeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        isHardMode = e.target.value === 'hard';
        
        if (isHardMode) {
            document.body.classList.add('hard-mode-active');
        } else {
            document.body.classList.remove('hard-mode-active');
        }
        
        initGame();
    });
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function initGame() {
    gameBoard.innerHTML = '';
    matchCounter = 0;
    winModal.style.display = 'none';
    resetBoardState();

    cardDeck = shuffle(cardDeck);

    cardDeck.forEach(item => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = item;

        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="assets/${item}.png" alt="Card ${item}" class="card-img" />
                </div>
                <div class="card-back">
                    <img src="assets/9.png" alt="Card Back" class="card-img" />
                </div>
            </div>
        `;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    matchCounter++;
    
    if (matchCounter === 8) {
        setTimeout(() => {
            winModal.style.display = 'flex';
        }, 500); 
    }
    
    resetBoardState();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        
        if (isHardMode) {
            setTimeout(() => {
                shuffleBoardDOM();
            }, 500);
        } else {
            resetBoardState();
        }
    }, 600);
}

function shuffleBoardDOM() {
    const unmatchedCards = Array.from(gameBoard.children).filter(
        card => !card.classList.contains('matched')
    );

    unmatchedCards.forEach(card => card.classList.add('shuffling'));

    setTimeout(() => {
        for (let i = unmatchedCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            gameBoard.insertBefore(unmatchedCards[i], unmatchedCards[j]);
        }

        unmatchedCards.forEach(card => card.classList.remove('shuffling'));

        setTimeout(() => {
            resetBoardState();
        }, 250);
    }, 250);
}

function resetBoardState() {
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
}

reloadBtn.addEventListener('click', initGame);

initGame();