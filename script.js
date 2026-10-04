// FIXED: Element IDs now perfectly match the HTML
const gameBoard = document.getElementById('memoryGrid');
const winModal = document.getElementById('winModal');
const reloadBtn = document.getElementById('restartBtn');

const techItems = [
    'HTML', 'CSS', 'JavaScript', 'React', 
    'Node.js', 'API', 'GitHub', 'Database'
];

let cardDeck = [...techItems, ...techItems];

let hasFlippedCard = false;
let lockBoard = false;
let firstCard = null;
let secondCard = null;
let matchCounter = 0;

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

        // FIXED: Put the tech item text on the front so it reveals on click.
        // Added a FontAwesome code icon as the uniform back of all cards.
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">${item}</div>
                <div class="card-back"><i class="fa-solid fa-code"></i></div>
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
    // FIXED: Adds matched class to trigger the green CSS border
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
        resetBoardState();
    }, 1000);
}

function resetBoardState() {
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
}

reloadBtn.addEventListener('click', initGame);

initGame();