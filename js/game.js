// Game variables and settings
const WORD_CATEGORIES = {
    'Toronto Life': {
        'spadina': '🏢 Our first real office was on this street, a hub for tech companies!',
        'kensington': '🥘 This market near Shopify is perfect for lunch adventures',
        'tiff': '🎬 Toronto\'s star-studded film festival, just steps from our office',
        'rogers': '🏟️ Where the Blue Jays play, visible from our office windows',
        'drake': '🦉 Toronto\'s global ambassador, started from the bottom now we here!',
        'ttc': '🚇 How many Shopifolk get to the office (when not remote!)',
        'cn tower': '🗼 Our office neighbor, piercing the sky since 1976',
        'graffiti': '🎨 Rush Lane\'s colorful art gallery, aka Graffiti Alley',
        'timmies': '☕ Canada\'s favorite coffee spot, found on every corner',
        'raptors': '🏀 We The North! Our championship basketball team'
    },
    'Shopify Slang': {
        'shipit': '🚀 Our rally cry when launching something awesome!',
        'tobi': '👨‍💼 The mastermind who started it all, rhymes with Moby',
        'shopifam': '👨‍👩‍👧‍👦 Our global family of employees and partners',
        'stackie': '📚 When we share our tech stack in a pretty diagram',
        'shopicon': '🎨 Our annual design conference, not just any icon!',
        'buildkit': '🛠️ Our favorite tool for app development',
        'oxygen': '💨 Not just for breathing, but for building too!',
        'polaris': '⭐ Our design system, guiding the way like the North Star'
    },
    'Core Terms': {
        'battery': '🔋 Keep going! Like this thing that keeps your devices running and running and running...',
        'unicorn': '🦄 Psst... I\'m worth a billion dollars, and I\'m not even real! What magical startup am I?',
        'shopifolk': '👥 We\'re the awesome crew of merchants and partners who make the Shopify world go round!',
        'merchants': '🛍️ These entrepreneurial heroes power their dreams with online stores. Who are they?',
        'townhall': '📢 When all Shopifolk gather to share big news, we call it a...?',
        'hacking': '👩‍💻 When we\'re solving problems with code and creativity, we call it...?',
        'owl': '🦉 I\'m wise, I\'m watchful, and I\'m Shopify\'s feathered friend. Who am I?'
    },
    'Tech Stack': {
        'ruby': '💎 The programming language that powers our core platform',
        'react': '⚛️ The JavaScript library we use for building user interfaces',
        'graphql': '📊 Our API query language that gives you exactly what you need',
        'liquid': '💧 Our template language that powers millions of storefronts',
        'redis': '🔄 The in-memory data store that keeps things lightning fast',
        'kubernetes': '🚢 Container orchestration that helps us scale globally',
        'typescript': '📝 JavaScript with superpowers - types make everything better!',
        'mysql': '🗄️ The database that stores our merchants\' precious data',
        'rails': '🛤️ The web framework that helped us grow from day one',
        'webpack': '📦 Bundling all our JavaScript into optimized packages'
    }
};

// Fun messages for correct answers
const SUCCESS_MESSAGES = [
    "🚀 You're scaling faster than a Shopify store on Black Friday!",
    "🦄 That's some unicorn-level word solving!",
    "🎯 Bullseye! Even our owl mascot is impressed!",
    "💫 You're shipping solutions faster than our deployment pipeline!",
    "🌟 You're as bright as a merchant's first sale notification!",
    "🎨 That's some Liquid template level perfection!",
    "⚡ Lightning fast! Are you using Shopify's CDN?",
    "🎪 You're running this game like a well-optimized storefront!",
    "🧠 Your brain's processing faster than our checkout system!",
    "🎯 Perfect shot! You'd make an excellent API endpoint!",
    // Add Toronto-themed messages
    "🍁 Beauty, eh! You're solving these faster than a Toronto winter!",
    "🏙️ You're towering over these words like the CN Tower!",
    "🏀 We The North! And you're the word game champion!",
    "🚇 Moving through these words faster than the TTC on a good day!",
    "☕ Time to celebrate with a double-double from Timmies!",
    "🦖 You're as fierce as a Raptor with these words!",
    "🎬 Your performance deserves a TIFF premiere!",
    "🍜 Sweet victory! Time for some Kensington Market treats!"
];

// Fun messages for game completion
const COMPLETION_MESSAGES = [
    "🏆 You've just achieved Shopify Plus status in word scrambling!",
    "🌟 From MVP to Enterprise: You've scaled this game perfectly!",
    "🚀 You've shipped all features successfully!",
    "🦄 You're officially a word-scramble unicorn!",
    "🎓 Graduate of the Shopify Word Academy!",
    "🌈 You've unlocked the rainbow theme! (not really, but great job!)",
    "🎪 Your performance deserves a merchant success story!",
    "🎯 Mission accomplished! Time to deploy to production!"
];

// Add at the top with other game state variables
const GAME_STATES = {
    IDLE: 'idle',
    PLAYING: 'playing',
    PAUSED: 'paused',
    COMPLETED: 'completed'
};

// Initialize game state
let gameState = {
    state: GAME_STATES.IDLE,
    currentCategory: null,
    currentWord: '',
    timeLeft: 60,
    savedTimeLeft: 0,
    currentScore: 0,
    wordsCompleted: 0,
    wrongGuesses: 0,
    hintsUsed: 0,
    currentWordHintUsed: false,
    usedWords: new Set()
};

// Timer variable
let timerInterval = null;

// Scoring constants
const SCORE_BASE = 1000;          // Base score for completing a word
const TIME_BONUS_FACTOR = 10;     // Points per second remaining
const WRONG_GUESS_PENALTY = 100;  // Points deducted per wrong guess
const HINT_PENALTY = 200;         // Points deducted for using a hint

// Update time constants
const TIME_WARNING = 10; // Show warning when 10 seconds remain
const TIME_EXTENSION = 30; // Seconds to add when continuing
const TIME_EXTENSION_PENALTY = 300; // Points deducted for time extension
const TIMEOUT_HINT_PENALTY = 400; // Points deducted for hint during timeout

// Game elements
let wordContainer;
let letterBank;
let submitButton;
let timerDisplay;
let celebrationOverlay;
let correctWordSpan;
let wrongOverlay;
let hintText;

// Create a reusable empty image for drag operations
const emptyImage = new Image();
emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

// Add welcome screen styles
const welcomeStyles = document.createElement('style');
welcomeStyles.textContent = `
    .welcome-screen {
        text-align: center;
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
    }

    .welcome-screen h1 {
        color: var(--shopify-green);
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    .welcome-screen p {
        color: var(--shopify-text);
        font-size: 1.2rem;
        margin-bottom: 2rem;
    }

    .category-selection h2 {
        color: var(--shopify-green);
        margin-bottom: 1.5rem;
    }

    .category-buttons {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(2, 1fr);
        max-width: 800px;
        margin: 0 auto;
    }

    .category-btn {
        background: white;
        border: 2px solid var(--shopify-light-green);
        border-radius: 12px;
        padding: 2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        text-align: center;
        min-height: 200px;
    }

    .category-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 76, 63, 0.1);
        border-color: var(--shopify-green);
    }

    .category-icon {
        font-size: 3.5rem;
        margin-bottom: 0.5rem;
    }

    .category-name {
        font-size: 1.4rem;
        font-weight: bold;
        color: var(--shopify-green);
    }

    .category-desc {
        font-size: 1rem;
        color: var(--shopify-text);
        opacity: 0.8;
        line-height: 1.4;
    }
`;
document.head.appendChild(welcomeStyles);

// Add timeout overlay styles
const timeoutStyles = document.createElement('style');
timeoutStyles.textContent = `
    .timeout-message {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .timeout-message h2 {
        color: var(--shopify-green);
        font-size: 1.8rem;
        margin-bottom: 1rem;
    }

    .timeout-options {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1.5rem;
    }

    .timeout-options button {
        padding: 1rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.3rem;
        font-size: 1rem;
    }

    .timeout-options .continue-btn {
        background: var(--shopify-green);
        color: white;
    }

    .timeout-options .hint-btn {
        background: var(--shopify-lighter-green);
        color: var(--shopify-green);
    }

    .timeout-options .restart-btn {
        background: #f1f1f1;
        color: var(--shopify-text);
    }

    .timeout-options button:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .timeout-options button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }

    .btn-main {
        font-weight: bold;
    }

    .btn-sub {
        font-size: 0.8rem;
        opacity: 0.8;
    }

    .timeout-hint {
        background: var(--shopify-lighter-green);
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        color: var(--shopify-green);
    }
`;
document.head.appendChild(timeoutStyles);

// Update letter space styles
const letterSpaceStyles = document.createElement('style');
letterSpaceStyles.textContent = `
    .letter-space {
        width: 40px;
        height: 40px;
        border: 2px solid var(--shopify-green);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
        background: white;
        transition: all 0.2s ease;
    }

    .letter-space.drag-over {
        background: var(--shopify-lighter-green);
        transform: scale(1.05);
        border-color: var(--shopify-green);
    }

    .letter-tile {
        width: 40px;
        height: 40px;
        background: var(--shopify-green);
        color: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;
        user-select: none;
        transition: all 0.2s ease;
        position: relative;
    }

    .letter-tile:hover {
        transform: translateY(-2px);
    }

    .letter-tile.dragging {
        cursor: grabbing;
    }
`;
document.head.appendChild(letterSpaceStyles);

// Add instruction styles
const instructionStyles = document.createElement('style');
instructionStyles.textContent = `
    .game-instructions {
        text-align: center;
        padding: 1rem;
        margin-bottom: 1rem;
        color: var(--shopify-green);
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .game-instructions .icon {
        font-size: 1.4rem;
        animation: bounce 1s infinite;
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
    }

    #game-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .instruction-arrow {
        color: var(--shopify-green);
        font-size: 1.5rem;
        margin: 0.5rem 0;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
    }
`;
document.head.appendChild(instructionStyles);

// Update time warning styles
const timeWarningStyles = document.createElement('style');
timeWarningStyles.textContent = `
    .time-warning-banner {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #de3618;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-size: 1.2rem;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 4px 12px rgba(222, 54, 24, 0.3);
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }

    .time-warning-banner.show {
        opacity: 1;
    }

    .time-warning-banner .warning-icon {
        font-size: 1.4rem;
        animation: pulse 1s infinite;
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;
document.head.appendChild(timeWarningStyles);

// Update overlay styles
const overlayStyles = document.createElement('style');
overlayStyles.textContent = `
    .overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        justify-content: center;
        align-items: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .overlay.show {
        opacity: 1;
        display: flex;
    }
`;
document.head.appendChild(overlayStyles);

// Update game area styles
const gameAreaStyles = document.createElement('style');
gameAreaStyles.textContent = `
    #game-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 0.5rem;
        max-width: 500px;
        margin: 0 auto;
    }

    #word-container {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        min-height: 60px;
        width: 100%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .game-instructions {
        text-align: center;
        padding: 0.25rem;
        color: var(--shopify-green);
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin: 0;
    }

    .game-instructions .icon {
        font-size: 1.2rem;
    }

    #letter-bank {
        background: rgba(255, 255, 255, 0.5);
        padding: 1.5rem;
        border-radius: 12px;
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
        justify-content: center;
        min-height: 60px;
        width: 100%;
    }

    .letter-space {
        width: 35px;
        height: 35px;
        border: 2px solid var(--shopify-green);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        font-weight: bold;
        background: white;
        transition: all 0.2s ease;
    }

    .letter-tile {
        width: 35px;
        height: 35px;
        background: var(--shopify-green);
        color: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        font-weight: bold;
        cursor: pointer;
        user-select: none;
        transition: all 0.2s ease;
    }

    #submit-btn {
        padding: 0.6rem 1.5rem;
        font-size: 1.1rem;
        margin-top: 0.5rem;
    }

    header {
        padding: 0.8rem 1rem;
        margin-bottom: 0.5rem;
    }

    .score-info {
        font-size: 1.1rem;
    }

    #timer {
        font-size: 1.1rem;
    }

    /* Keep other styles the same */
`;
document.head.appendChild(gameAreaStyles);

// Update wrong answer overlay styles
const wrongOverlayStyles = document.createElement('style');
wrongOverlayStyles.textContent = `
    .wrong-message {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .wrong-message h3 {
        color: #de3618;
        font-size: 1.3rem;
        margin-bottom: 0.5rem;
    }

    .wrong-message p {
        color: var(--shopify-text);
        margin-bottom: 1rem;
    }

    .wrong-options {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        width: 100%;
    }

    .wrong-options button {
        width: 100%;
        min-height: 70px;
        padding: 1rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.3rem;
        font-size: 1rem;
    }

    .wrong-options .continue-btn {
        background: var(--shopify-green);
        color: white;
    }

    .wrong-options .hint-btn {
        background: var(--shopify-lighter-green);
        color: var(--shopify-green);
    }

    .wrong-options .restart-btn {
        background: #f1f1f1;
        color: var(--shopify-text);
    }

    .wrong-options button:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .wrong-options button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }

    .btn-main {
        font-weight: bold;
        font-size: 1rem;
        line-height: 1.2;
    }

    .btn-sub {
        font-size: 0.85rem;
        opacity: 0.8;
        line-height: 1.2;
    }

    .wrong-hint {
        background: var(--shopify-lighter-green);
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        color: var(--shopify-green);
    }
`;
document.head.appendChild(wrongOverlayStyles);

// Add drag feedback styles
const dragStyles = document.createElement('style');
dragStyles.textContent = `
    .letter-tile.dragging {
        opacity: 0.6;
        transform: scale(0.95);
        cursor: grabbing;
    }

    .drag-feedback {
        position: fixed;
        pointer-events: none;
        z-index: 1000;
        background: var(--shopify-green);
        color: white;
        width: 35px;
        height: 35px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: opacity 0.2s;
    }
`;
document.head.appendChild(dragStyles);

// Add overlay management system
const overlayManager = {
    show: function(overlayId, content = null) {
        const overlay = document.getElementById(overlayId);
        if (!overlay) return;
        
        // Hide all other overlays first
        document.querySelectorAll('.overlay').forEach(other => {
            if (other.id !== overlayId) {
                this.hide(other.id);
            }
        });
        
        // Update content if provided
        if (content) {
            const contentContainer = overlay.querySelector('.overlay-content');
            if (contentContainer) {
                contentContainer.innerHTML = content;
            }
        }
        
        // Show overlay with animation
        overlay.style.display = 'flex';
        requestAnimationFrame(() => {
            overlay.classList.add('show');
        });
        
        // Pause game if it's running
        if (gameState.state === GAME_STATES.PLAYING) {
            this.pauseGame();
        }
    },
    
    hide: function(overlayId) {
        const overlay = document.getElementById(overlayId);
        if (!overlay) return;
        
        overlay.classList.remove('show');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300); // Match transition duration
    },
    
    pauseGame: function() {
        if (gameState.state !== GAME_STATES.PLAYING) return;
        
        gameState.state = GAME_STATES.PAUSED;
        gameState.savedTimeLeft = gameState.timeLeft;
        clearInterval(timerInterval);
    },
    
    resumeGame: function() {
        if (gameState.state !== GAME_STATES.PAUSED) return;
        
        gameState.state = GAME_STATES.PLAYING;
        gameState.timeLeft = gameState.savedTimeLeft;
        startTimer();
    }
};

function initializeGameElements() {
    wordContainer = document.getElementById('word-container');
    letterBank = document.getElementById('letter-bank');
    submitButton = document.getElementById('submit-btn');
    timerDisplay = document.getElementById('time-left');
    celebrationOverlay = document.getElementById('celebration-overlay');
    correctWordSpan = document.getElementById('correct-word');
    wrongOverlay = document.getElementById('wrong-overlay');
    hintText = document.getElementById('hint-text');
}

function getRandomWord() {
    if (!gameState.currentCategory || !WORD_CATEGORIES[gameState.currentCategory]) {
        console.error('Invalid category:', gameState.currentCategory);
        return null;
    }
    
    const categoryWords = WORD_CATEGORIES[gameState.currentCategory];
    const availableWords = Object.keys(categoryWords).filter(word => !gameState.usedWords.has(word));
    
    if (availableWords.length === 0) {
        gameState.usedWords.clear();
        return Object.keys(categoryWords)[Math.floor(Math.random() * Object.keys(categoryWords).length)];
    }
    
    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    gameState.usedWords.add(randomWord);
    return randomWord;
}

function setupNewWord() {
    // Clear previous word
    wordContainer.innerHTML = '';
    letterBank.innerHTML = '';
    
    // Reset hint state for new word
    gameState.currentWordHintUsed = false;
    
    // Get new word
    gameState.currentWord = getRandomWord();
    console.log('New word:', gameState.currentWord);
    
    if (!gameState.currentWord) {
        console.error('Failed to get word');
        return false;
    }
    
    // Create letter spaces
    const letters = gameState.currentWord.split('');
    letters.forEach(letter => {
        if (letter === ' ') {
            const spacer = document.createElement('div');
            spacer.className = 'word-spacer';
            spacer.setAttribute('aria-hidden', 'true');
            wordContainer.appendChild(spacer);
        } else {
            const space = createLetterSpace();
            wordContainer.appendChild(space);
        }
    });
    
    // Create and shuffle letter tiles
    const lettersNoSpaces = gameState.currentWord.replace(/\s/g, '').split('');
    const extraLetters = generateExtraLetters(lettersNoSpaces.join(''));
    const allLetters = [...lettersNoSpaces, ...extraLetters];
    shuffleArray(allLetters);
    
    // Add letter tiles to letter bank
    allLetters.forEach(letter => {
        const tile = createLetterTile(letter);
        letterBank.appendChild(tile);
    });
    
    return true;
}

function handleCategoryClick(category) {
    console.log('Selected category:', category);
    gameState.currentCategory = category;
    
    // Hide welcome screen, show game
    document.querySelector('.welcome-screen').style.display = 'none';
    document.getElementById('game-content').style.display = 'block';
    
    // Initialize game elements
    initializeGameElements();
    initializeSubmitButton();
    
    // Start new game
    startNewGame();
}

function startNewGame() {
    // Reset game state
    gameState = {
        state: GAME_STATES.PLAYING,
        currentCategory: gameState.currentCategory, // Keep the category
        currentWord: '',
        timeLeft: 60,
        savedTimeLeft: 0,
        currentScore: 0,
        wordsCompleted: 0,
        wrongGuesses: 0,
        hintsUsed: 0,
        currentWordHintUsed: false,
        usedWords: new Set()
    };
    
    // Clear any existing timer
    if (typeof timerInterval !== 'undefined' && timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Hide all overlays
    document.querySelectorAll('.overlay').forEach(overlay => {
        overlayManager.hide(overlay.id);
    });
    
    // Reset UI
    updateScoreDisplay();
    
    // Set up new word and start timer
    if (setupNewWord()) {
        startTimer();
    }
}

function calculateScore() {
    let wordScore = SCORE_BASE;
    // Add time bonus
    wordScore += gameState.timeLeft * TIME_BONUS_FACTOR;
    // Subtract penalties
    wordScore -= gameState.wrongGuesses * WRONG_GUESS_PENALTY;
    wordScore -= gameState.hintsUsed * HINT_PENALTY;
    // Remove minimum score restriction
    return wordScore;
}

function updateScoreDisplay() {
    const currentScoreElement = document.getElementById('current-score');
    const wordsCompletedElement = document.getElementById('words-completed');
    
    if (currentScoreElement && wordsCompletedElement) {
        currentScoreElement.textContent = gameState.currentScore;
        wordsCompletedElement.textContent = gameState.wordsCompleted;
    }
}

function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    if (gameState.state !== GAME_STATES.PLAYING) {
        gameState.state = GAME_STATES.PLAYING;
    }
    
    timerDisplay = document.getElementById('time-left');
    if (!timerDisplay) {
        console.error('Timer display element not found');
        return;
    }
    
    timerDisplay.textContent = gameState.timeLeft;
    
    timerInterval = setInterval(() => {
        gameState.timeLeft--;
        timerDisplay.textContent = gameState.timeLeft;
        
        if (gameState.timeLeft === TIME_WARNING) {
            showTimeWarning();
        }
        
        if (gameState.timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function getRandomMessage(messageArray) {
    return messageArray[Math.floor(Math.random() * messageArray.length)];
}

function handleWin() {
    clearInterval(timerInterval);
    gameState.wordsCompleted++;
    const wordScore = calculateScore();
    gameState.currentScore += wordScore;
    updateScoreDisplay();

    if (gameState.wordsCompleted >= 3) {
        gameState.state = GAME_STATES.COMPLETED;
        showGameComplete();
    } else {
        const successMessage = getRandomMessage(SUCCESS_MESSAGES);
        overlayManager.show('celebration-overlay', `
            <div class="success-message">
                <div class="word-reveal">${gameState.currentWord}</div>
                <div class="quirky-message">${successMessage}</div>
                <div class="points-earned">+${wordScore} points!</div>
                <button class="game-btn primary-btn continue-btn">Ready for Next Word!</button>
            </div>
        `);
        createConfetti();
        
        // Add event listener for the continue button
        const continueBtn = document.querySelector('.continue-btn');
        continueBtn.addEventListener('click', () => {
            overlayManager.hide('celebration-overlay');
            setupNewWord();
            startTimer();
        });
    }
}

function showGameComplete() {
    clearInterval(timerInterval);
    overlayManager.show('celebration-overlay', `
        <div class="success-message">
            <div class="completion-message">${getRandomMessage(COMPLETION_MESSAGES)}</div>
            <div class="final-score">Final Score: ${gameState.currentScore}</div>
            <div class="stats">
                🎯 Words Solved: 3
                ⭐ Average Score: ${Math.round(gameState.currentScore / 3)}
            </div>
            <button class="game-btn primary-btn play-again-btn">Start New Adventure</button>
        </div>
    `);
    createConfetti();
    const playAgainBtn = document.querySelector('.play-again-btn');
    playAgainBtn.onclick = startNewGame;
}

function showHint() {
    if (gameState.currentWordHintUsed) return;
    
    overlayManager.show('hint-overlay', `
        <div class="hint-message">
            <h2>💡 Here's a Hint!</h2>
            <div class="hint-content">${WORD_CATEGORIES[gameState.currentCategory][gameState.currentWord]}</div>
            <button class="game-btn primary-btn continue-btn" onclick="continueAfterHint()">
                <span class="btn-main">Continue Playing</span>
            </button>
        </div>
    `);
    
    gameState.currentWordHintUsed = true;
    gameState.hintsUsed++;
    gameState.currentScore -= HINT_PENALTY;
    updateScoreDisplay();
}

function continueAfterHint() {
    overlayManager.hide('hint-overlay');
    resetGuess();
    gameState.timeLeft = gameState.savedTimeLeft + TIME_EXTENSION;
    gameState.savedTimeLeft = 0;
    startTimer();
}

function handleWrong() {
    overlayManager.show('wrong-overlay', `
        <div class="wrong-message">
            <h3>Not quite right!</h3>
            <p>Current Score: ${gameState.currentScore}</p>
            <div class="wrong-options">
                <button class="game-btn primary-btn" onclick="addMoreTime()">
                    <span class="btn-main">Add ${TIME_EXTENSION} Seconds</span>
                    <span class="btn-sub">(-${TIME_EXTENSION_PENALTY} points)</span>
                </button>
                ${!gameState.currentWordHintUsed ? `
                    <button class="game-btn secondary-btn" onclick="showHint()">
                        <span class="btn-main">Get a Hint</span>
                        <span class="btn-sub">(-${HINT_PENALTY} points)</span>
                    </button>
                ` : `
                    <button class="game-btn secondary-btn" disabled>
                        <span class="btn-main">Hint Already Used</span>
                        <span class="btn-sub">One hint per word</span>
                    </button>
                `}
                <button class="game-btn danger-btn" onclick="startNewGame()">
                    <span class="btn-main">Start New Game</span>
                    <span class="btn-sub">Reset score and start fresh</span>
                </button>
            </div>
        </div>
    `);
    
    // Add shake animation to word container
    wordContainer.classList.add('shake');
    setTimeout(() => {
        wordContainer.classList.remove('shake');
    }, 400);
    
    gameState.wrongGuesses++;
}

function resetGuess() {
    // Hide the wrong overlay
    const wrongOverlay = document.getElementById('wrong-overlay');
    wrongOverlay.classList.remove('show');
    wrongOverlay.style.display = 'none';
    
    // Reset letter spaces
    const filledSpaces = wordContainer.querySelectorAll('.letter-space.filled');
    filledSpaces.forEach(space => {
        space.textContent = '';
        space.className = 'letter-space';
    });
    
    // Show all letter tiles again
    const letterTiles = letterBank.querySelectorAll('.letter-tile');
    letterTiles.forEach(tile => {
        tile.classList.remove('used');
        tile.style.visibility = 'visible';
    });
    
    // Disable submit button
    submitButton.disabled = true;
    submitButton.classList.remove('ready');
}

function resetGame() {
    wrongOverlay.classList.remove('show');
    hintText.classList.remove('show');
    
    const filledSpaces = wordContainer.querySelectorAll('.letter-space.filled');
    filledSpaces.forEach(space => {
        space.textContent = '';
        space.className = 'letter-space';
    });
    
    const letterTiles = letterBank.querySelectorAll('.letter-tile');
    letterTiles.forEach(tile => {
        tile.style.visibility = 'visible';
    });
    
    submitButton.disabled = true;
}

function checkWord() {
    const filledSpaces = wordContainer.querySelectorAll('.letter-space.filled');
    const guessedLetters = Array.from(filledSpaces)
        .map(space => space.textContent)
        .join('')
        .toLowerCase(); // Convert to lowercase only for comparison
    
    const targetLength = gameState.currentWord.replace(/\s/g, '').length;
    const currentLength = guessedLetters.length;
    
    console.log('Checking word completion:', {
        guessedLetters,
        currentLength,
        targetLength,
        currentWord: gameState.currentWord
    });

    // Enable submit button when all spaces are filled
    if (submitButton) {
        submitButton.disabled = currentLength !== targetLength;
        
        // Add visual feedback for submit button state
        if (!submitButton.disabled) {
            submitButton.classList.add('ready');
        } else {
            submitButton.classList.remove('ready');
        }
    }
}

function createLetterSpace() {
    const space = document.createElement('div');
    space.className = 'letter-space';
    space.setAttribute('role', 'textbox');
    space.setAttribute('aria-label', 'Empty letter space');
    
    // Add click handler to remove letter
    space.addEventListener('click', function() {
        if (this.classList.contains('filled')) {
            returnLetterToBank(this.textContent);
            this.textContent = '';
            this.classList.remove('filled');
            checkWord();
        }
    });
    
    // Make filled spaces draggable
    space.addEventListener('dragstart', function(e) {
        if (!this.classList.contains('filled')) return;
        
        cleanupDragFeedback(); // Cleanup any existing feedback
        
        e.dataTransfer.setData('text/plain', this.textContent);
        e.dataTransfer.setData('application/x-letter-source', 'solution');
        this.classList.add('dragging');
        
        // Create drag feedback
        const dragFeedback = document.createElement('div');
        dragFeedback.className = 'drag-feedback';
        dragFeedback.textContent = this.textContent;
        document.body.appendChild(dragFeedback);
        
        // Update drag feedback position
        function updateDragPosition(e) {
            dragFeedback.style.left = (e.clientX - 17.5) + 'px';
            dragFeedback.style.top = (e.clientY - 17.5) + 'px';
        }
        
        document.addEventListener('dragover', updateDragPosition);
        space.updateDragPosition = updateDragPosition;
        
        // Use empty image for default drag ghost
        e.dataTransfer.setDragImage(emptyImage, 0, 0);
    });
    
    space.addEventListener('dragend', function(e) {
        this.classList.remove('dragging');
        cleanupDragFeedback(); // Cleanup feedback
        
        // Remove drag move listener
        if (space.updateDragPosition) {
            document.removeEventListener('dragover', space.updateDragPosition);
            space.updateDragPosition = null;
        }
        
        // If dropped outside valid drop zones, return letter to bank
        if (!e.dataTransfer.dropEffect || e.dataTransfer.dropEffect === 'none') {
            returnLetterToBank(this.textContent);
            this.textContent = '';
            this.classList.remove('filled');
            checkWord();
        }
    });
    
    // Add drop events
    space.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });
    
    space.addEventListener('dragleave', function() {
        this.classList.remove('drag-over');
    });
    
    space.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        const letter = e.dataTransfer.getData('text/plain').toUpperCase();
        const source = e.dataTransfer.getData('application/x-letter-source');
        
        // If this space is filled, store its letter
        let previousLetter = null;
        if (this.classList.contains('filled')) {
            previousLetter = this.textContent;
        }
        
        // Place the new letter
        this.textContent = letter;
        this.classList.add('filled');
        
        // Handle the previous letter based on the source of the new letter
        if (source === 'solution') {
            // If dragging between solution spaces, swap the letters
            const dragSource = document.querySelector('.letter-space.dragging');
            if (dragSource && previousLetter) {
                dragSource.textContent = previousLetter;
                dragSource.classList.remove('dragging');
            } else if (dragSource) {
                dragSource.textContent = '';
                dragSource.classList.remove('filled', 'dragging');
            }
        } else {
            // If dragging from letter bank
            if (previousLetter) {
                returnLetterToBank(previousLetter);
            }
            
            // Find and hide the dragged tile from bank
            const tiles = document.querySelectorAll('.letter-tile');
            for (const tile of tiles) {
                if (tile.textContent === letter && !tile.classList.contains('used')) {
                    tile.classList.add('used');
                    tile.style.visibility = 'hidden';
                    break;
                }
            }
        }
        
        // Check if word is complete
        checkWord();
    });
    
    return space;
}

// Helper function to return a letter to the bank
function returnLetterToBank(letter) {
    const tiles = document.querySelectorAll('.letter-tile');
    for (const tile of tiles) {
        if (tile.textContent === letter && tile.classList.contains('used')) {
            tile.classList.remove('used');
            tile.style.visibility = 'visible';
            break;
        }
    }
}

function createLetterTile(letter) {
    const tile = document.createElement('div');
    tile.className = 'letter-tile';
    tile.textContent = letter.toUpperCase();
    tile.draggable = true;
    tile.setAttribute('role', 'button');
    tile.setAttribute('aria-label', `Letter ${letter}`);
    
    let dragFeedback = null;
    
    // Add drag events
    tile.addEventListener('dragstart', function(e) {
        if (this.classList.contains('used')) {
            e.preventDefault();
            return;
        }
        
        cleanupDragFeedback(); // Cleanup any existing feedback
        
        // Prevent default drag ghost/shadow
        e.dataTransfer.setDragImage(emptyImage, 0, 0);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', letter);
        e.dataTransfer.setData('application/x-letter-source', 'bank');
        
        this.classList.add('dragging');
        
        // Create drag feedback element
        dragFeedback = document.createElement('div');
        dragFeedback.className = 'drag-feedback';
        dragFeedback.textContent = letter.toUpperCase();
        document.body.appendChild(dragFeedback);
        
        // Update drag feedback position
        function updateDragPosition(e) {
            if (dragFeedback) {
                dragFeedback.style.left = (e.clientX - 17.5) + 'px';
                dragFeedback.style.top = (e.clientY - 17.5) + 'px';
            }
        }
        
        // Add drag move listener
        document.addEventListener('dragover', updateDragPosition);
        
        // Store the listener so we can remove it later
        tile.updateDragPosition = updateDragPosition;
    });
    
    tile.addEventListener('dragend', function(e) {
        this.classList.remove('dragging');
        cleanupDragFeedback(); // Cleanup feedback
        
        // Remove drag move listener
        if (tile.updateDragPosition) {
            document.removeEventListener('dragover', tile.updateDragPosition);
            tile.updateDragPosition = null;
        }
    });

    // Add click/touch events
    tile.addEventListener('click', function() {
        if (this.classList.contains('used')) {
            return;
        }
        
        // Find first empty space or first filled space
        const emptySpace = document.querySelector('.letter-space:not(.filled)');
        const firstFilledSpace = document.querySelector('.letter-space.filled');
        
        // If there's an empty space, fill it
        if (emptySpace) {
            emptySpace.textContent = letter.toUpperCase();
            emptySpace.classList.add('filled');
            this.classList.add('used');
            this.style.visibility = 'hidden';
            checkWord();
        }
        // If no empty spaces but there are filled spaces, replace the first one
        else if (firstFilledSpace) {
            const oldLetter = firstFilledSpace.textContent;
            // Return old letter to bank
            const tiles = document.querySelectorAll('.letter-tile');
            for (const tile of tiles) {
                if (tile.textContent === oldLetter && tile.classList.contains('used')) {
                    tile.classList.remove('used');
                    tile.style.visibility = 'visible';
                    break;
                }
            }
            // Place new letter
            firstFilledSpace.textContent = letter.toUpperCase();
            this.classList.add('used');
            this.style.visibility = 'hidden';
            checkWord();
        }
    });
    
    return tile;
}

function generateExtraLetters(word, extraCount = 4) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const wordLetters = new Set(word.toLowerCase());
    const extraLetters = [];
    
    while (extraLetters.length < extraCount) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (!wordLetters.has(randomLetter)) {
            extraLetters.push(randomLetter);
            wordLetters.add(randomLetter); // Prevent duplicates
        }
    }
    
    return extraLetters;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 1 + 1) + 's';
        confetti.style.backgroundColor = `hsl(${Math.random() * 60 + 120}, 70%, 60%)`; // Green shades
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 2000);
    }
}

// Initialize submit button listener
function initializeSubmitButton() {
    const submitButton = document.getElementById('submit-btn');
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            const filledSpaces = wordContainer.querySelectorAll('.letter-space.filled');
            const guessedLetters = Array.from(filledSpaces)
                .map(space => space.textContent)
                .join('')
                .toLowerCase();
            
            if (guessedLetters === gameState.currentWord.replace(/\s/g, '').toLowerCase()) {
                handleWin();
            } else {
                handleWrong();
            }
        });
    }
}

function showTimeWarning() {
    const existingWarning = document.querySelector('.time-warning-banner');
    if (existingWarning) {
        existingWarning.remove();
    }

    const warningBanner = document.createElement('div');
    warningBanner.className = 'time-warning-banner';
    warningBanner.innerHTML = `
        <span class="warning-icon">⚠️</span>
        Hurry! ${TIME_WARNING} seconds remaining!
    `;
    document.body.appendChild(warningBanner);

    // Show the banner with animation
    requestAnimationFrame(() => {
        warningBanner.classList.add('show');
    });

    // Remove the banner after 3 seconds with fade out animation
    setTimeout(() => {
        warningBanner.classList.remove('show');
        warningBanner.addEventListener('transitionend', () => {
            warningBanner.remove();
        });
    }, 3000);

    // Add warning vibration if enabled
    if (window.navigator.vibrate) {
        window.navigator.vibrate(200);
    }
}

function handleTimeout() {
    overlayManager.show('timeout-overlay', `
        <div class="timeout-message">
            <h2>⏰ Time's Up!</h2>
            <p>Current Score: ${gameState.currentScore}</p>
            <div class="timeout-options">
                <button class="game-btn primary-btn" onclick="addMoreTime()">
                    <span class="btn-main">Add ${TIME_EXTENSION} Seconds</span>
                    <span class="btn-sub">(-${TIME_EXTENSION_PENALTY} points)</span>
                </button>
                ${!gameState.currentWordHintUsed ? `
                    <button class="game-btn secondary-btn" onclick="showHint()">
                        <span class="btn-main">Get a Hint</span>
                        <span class="btn-sub">(-${HINT_PENALTY} points)</span>
                    </button>
                ` : `
                    <button class="game-btn secondary-btn" disabled>
                        <span class="btn-main">Hint Already Used</span>
                        <span class="btn-sub">One hint per word</span>
                    </button>
                `}
                <button class="game-btn danger-btn" onclick="startNewGame()">
                    <span class="btn-main">Start New Game</span>
                    <span class="btn-sub">Reset score and start fresh</span>
                </button>
            </div>
        </div>
    `);
}

function addMoreTime() {
    overlayManager.hide('wrong-overlay');
    overlayManager.hide('timeout-overlay');
    
    gameState.currentScore -= TIME_EXTENSION_PENALTY;
    updateScoreDisplay();
    
    gameState.timeLeft = TIME_EXTENSION;
    startTimer();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing game...');
    
    // Create base game structure
    const container = document.getElementById('game-container') || document.createElement('div');
    container.id = 'game-container';
    
    // Set up HTML structure
    container.innerHTML = `
        <div class="welcome-screen">
            <h1>🎮 Shopify Word Scramble</h1>
            <p>Test your knowledge of Shopify terms, slang, and Toronto culture!</p>
            
            <div class="category-selection">
                <h2>Choose Your Category:</h2>
                <div class="category-buttons">
                    ${Object.keys(WORD_CATEGORIES).map(category => `
                        <button class="category-btn" onclick="handleCategoryClick('${category}')">
                            <span class="category-icon">${getCategoryEmoji(category)}</span>
                            <span class="category-name">${category}</span>
                            <span class="category-desc">${getCategoryDescription(category)}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div id="game-content" style="display: none;">
            <header>
                <div id="timer">Time: <span id="time-left">60</span>s</div>
                <div id="score-display">
                    <div class="score-info">
                        <span>Score: <span id="current-score">0</span></span>
                        <span>Words: <span id="words-completed">0</span>/3</span>
                    </div>
                </div>
            </header>
            <main id="game-area">
                <div id="word-container"></div>
                <div class="game-instructions">
                    <span class="icon">👆</span>
                    Click or drag letters from below to fill in the word
                </div>
                <div id="letter-bank"></div>
                <button id="submit-btn" disabled>Submit</button>
                <div id="hint-text" class="hint"></div>
            </main>
            <div id="celebration-overlay" class="overlay">
                <div class="overlay-content"></div>
            </div>
            <div id="wrong-overlay" class="overlay">
                <div class="overlay-content"></div>
            </div>
            <div id="timeout-overlay" class="overlay">
                <div class="overlay-content"></div>
            </div>
            <div id="hint-overlay" class="overlay">
                <div class="overlay-content"></div>
            </div>
        </div>
    `;
    
    // Add container to document if not already present
    if (!container.parentElement) {
        document.body.appendChild(container);
    }
    
    console.log('Game initialized, waiting for category selection...');
});

// Helper functions for welcome screen
function getCategoryEmoji(category) {
    const emojis = {
        'Core Terms': '🏢',
        'Shopify Slang': '🗣️',
        'Toronto Life': '🍁',
        'Tech Stack': '💻'
    };
    return emojis[category] || '📝';
}

function getCategoryDescription(category) {
    const descriptions = {
        'Core Terms': 'Essential Shopify terminology',
        'Shopify Slang': 'Internal lingo and fun phrases',
        'Toronto Life': 'Our hometown culture and spots',
        'Tech Stack': 'Tools and technologies that power Shopify'
    };
    return descriptions[category] || '';
}

// Add submit button styles
const submitButtonStyles = document.createElement('style');
submitButtonStyles.textContent = `
    #submit-btn {
        padding: 10px 30px;
        font-size: 1.2rem;
        background: var(--shopify-green);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        opacity: 0.5;
    }

    #submit-btn:disabled {
        cursor: not-allowed;
    }

    #submit-btn.ready {
        opacity: 1;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 128, 96, 0.2);
    }

    #submit-btn.ready:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 14px rgba(0, 128, 96, 0.3);
    }
`;
document.head.appendChild(submitButtonStyles);

// Add a cleanup function for drag feedback
function cleanupDragFeedback() {
    const dragFeedback = document.querySelector('.drag-feedback');
    if (dragFeedback) {
        dragFeedback.remove();
    }
} 