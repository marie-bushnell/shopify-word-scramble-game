// Game variables and settings
const SHOPIFY_WORDS = ['battery', 'unicorn', 'shopifolk', 'merchants', 'townhall', 'hacking', 'owl'];
let currentWord = '';
let timeLeft = 60;

// DOM Elements
const wordContainer = document.getElementById('word-container');
const letterBank = document.getElementById('letter-bank');
const submitButton = document.getElementById('submit-btn');
const timerDisplay = document.getElementById('time-left');

// Wait for the page to load before starting the game
document.addEventListener('DOMContentLoaded', function() {
    console.log('Game initialized!');
    // Game initialization code will go here
}); 