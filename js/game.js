/**
 * CAPTCHA: Am I Human? - Core Game Logic
 */

// Game state
const gameState = {
    currentLevel: 0,
    selectedTiles: [],
    playerName: null,
    playerLocation: null,
    playerFear: null,
    humanProof: null,
    startTime: null,
    hasGlitched: false
};

// DOM Elements
let elements = {};

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
    cacheElements();
    showLoadingScreen();
    setupSoundToggle();
    
    // Start after fake loading
    setTimeout(() => {
        hideLoadingScreen();
        showCaptchaContainer();
        setupCheckboxClick();
    }, 2000);
});

function cacheElements() {
    elements = {
        loadingScreen: document.getElementById('loading-screen'),
        captchaContainer: document.getElementById('captcha-container'),
        captchaChallenge: document.getElementById('captcha-challenge'),
        challengeHeader: document.getElementById('challenge-header'),
        challengeInstruction: document.getElementById('challenge-instruction'),
        challengeTarget: document.getElementById('challenge-target'),
        challengeSubtext: document.getElementById('challenge-subtext'),
        imageGrid: document.getElementById('image-grid'),
        textChallenge: document.getElementById('text-challenge'),
        textInstruction: document.getElementById('text-instruction'),
        textInput: document.getElementById('text-input'),
        textSubmit: document.getElementById('text-submit'),
        verifyBtn: document.getElementById('verify-btn'),
        skipBtn: document.getElementById('skip-btn'),
        progressFill: document.getElementById('progress-fill'),
        checkbox: document.querySelector('.checkbox-container'),
        glitchOverlay: document.getElementById('glitch-overlay'),
        endScreen: document.getElementById('end-screen'),
        endMessage: document.getElementById('end-message'),
        overlay: document.getElementById('overlay')
    };
}

function showLoadingScreen() {
    elements.loadingScreen.classList.remove('hidden');
}

function hideLoadingScreen() {
    elements.loadingScreen.classList.add('hidden');
}

function showCaptchaContainer() {
    elements.captchaContainer.classList.remove('hidden');
}

function setupCheckboxClick() {
    elements.checkbox.addEventListener('click', function() {
        if (!this.classList.contains('checked')) {
            // Initialize audio on first interaction
            initAudio();
            playSound('click');
            
            // Start the actual game
            gameState.startTime = Date.now();
            startChallenge();
        }
    });
}

function startChallenge() {
    // Animate checkbox to loading state
    elements.checkbox.innerHTML = '<div class="loader" style="width: 20px; height: 20px; border-width: 2px;"></div>';
    
    setTimeout(() => {
        elements.captchaContainer.classList.add('expanded');
        elements.captchaChallenge.classList.remove('hidden');
        loadLevel(0);
    }, 1000);
}

function loadLevel(levelIndex) {
    if (levelIndex >= LEVELS.length) {
        showEnding();
        return;
    }

    gameState.currentLevel = levelIndex;
    gameState.selectedTiles = [];
    
    const level = LEVELS[levelIndex];
    
    // Update progress bar
    updateProgress(levelIndex);
    
    // Call onStart if exists
    if (level.onStart) {
        level.onStart();
    }
    
    // Update header styling
    elements.challengeHeader.className = '';
    if (level.headerClass) {
        elements.challengeHeader.classList.add(level.headerClass);
    }
    
    if (level.type === 'grid') {
        loadGridLevel(level);
    } else if (level.type === 'text') {
        loadTextLevel(level);
    }
}

function loadGridLevel(level) {
    // Hide text challenge, show grid
    elements.textChallenge.classList.add('hidden');
    elements.captchaChallenge.classList.remove('hidden');
    elements.imageGrid.parentElement.classList.remove('hidden');
    
    // Update instruction
    elements.challengeInstruction.innerHTML = level.instruction + ' <strong id="challenge-target">' + level.target + '</strong>';
    elements.challengeSubtext.textContent = level.subtext;
    
    // Generate grid
    elements.imageGrid.innerHTML = '';
    level.images.forEach((img, index) => {
        const tile = document.createElement('div');
        tile.className = 'grid-tile';
        tile.dataset.id = img.id;
        tile.dataset.correct = img.correct;
        tile.dataset.index = index;
        
        // Add glitch class if specified
        if (img.glitch) {
            tile.classList.add('glitchy');
        }
        
        // Use real images if src provided, otherwise fall back to emoji
        if (img.src) {
            const imgEl = document.createElement('img');
            imgEl.src = img.src;
            imgEl.alt = img.alt || '';
            imgEl.className = 'tile-image';
            imgEl.draggable = false;
            // Add loading effect
            imgEl.style.opacity = '0';
            imgEl.onload = () => {
                imgEl.style.transition = 'opacity 0.3s';
                imgEl.style.opacity = '1';
            };
            imgEl.onerror = () => {
                // Fallback to emoji if image fails to load
                tile.innerHTML = '';
                const placeholder = document.createElement('div');
                placeholder.className = 'placeholder-img';
                placeholder.textContent = img.emoji || '❓';
                tile.appendChild(placeholder);
            };
            tile.appendChild(imgEl);
        } else {
            // Use emoji placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'placeholder-img';
            placeholder.textContent = img.emoji || '❓';
            tile.appendChild(placeholder);
        }
        
        tile.addEventListener('click', () => handleTileClick(tile, level));
        
        elements.imageGrid.appendChild(tile);
    });
    
    // Setup buttons
    elements.verifyBtn.onclick = () => verifyGridSelection(level);
    elements.skipBtn.onclick = () => skipLevel();
    elements.verifyBtn.disabled = false;
    
    // Glitch effect for horror levels
    if (level.mood === 'horror') {
        randomGlitchTiles();
    }
}

function loadTextLevel(level) {
    // Hide grid, show text input
    elements.captchaChallenge.classList.add('hidden');
    elements.textChallenge.classList.remove('hidden');
    
    // Update instruction
    elements.textInstruction.innerHTML = level.instruction;
    if (level.subtext) {
        elements.textInstruction.innerHTML += '<br><small style="opacity: 0.7;">' + level.subtext + '</small>';
    }
    
    // Setup input
    elements.textInput.value = '';
    elements.textInput.placeholder = level.placeholder || 'Type here...';
    elements.textInput.className = '';
    
    if (level.mood === 'horror') {
        elements.textInput.classList.add('horror');
    }
    
    // Setup submit
    elements.textSubmit.onclick = () => submitTextInput(level);
    
    // Also submit on Enter
    elements.textInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            submitTextInput(level);
        }
    };
    
    elements.textInput.focus();
}

function handleTileClick(tile, level) {
    playSound('click');
    
    if (level.singleSelect) {
        // Remove selection from all tiles
        document.querySelectorAll('.grid-tile').forEach(t => {
            t.classList.remove('selected');
        });
        gameState.selectedTiles = [];
    }
    
    if (tile.classList.contains('selected')) {
        tile.classList.remove('selected');
        gameState.selectedTiles = gameState.selectedTiles.filter(id => id !== tile.dataset.id);
    } else {
        tile.classList.add('selected');
        gameState.selectedTiles.push(tile.dataset.id);
    }
    
    // Glitch sometimes on horror levels
    if (level.mood === 'horror' && Math.random() < 0.3) {
        triggerGlitch(100);
    }
}

function verifyGridSelection(level) {
    const tiles = document.querySelectorAll('.grid-tile');
    let correct = true;
    
    if (level.anyCorrect) {
        // Any selection is fine (personal questions)
        correct = gameState.selectedTiles.length > 0;
        if (correct && level.singleSelect && level.onComplete) {
            level.onComplete(gameState.selectedTiles[0]);
        }
    } else if (level.allCorrect) {
        // All must be selected
        correct = gameState.selectedTiles.length === level.images.length;
    } else {
        // Normal verification
        tiles.forEach(tile => {
            const isSelected = tile.classList.contains('selected');
            const shouldBeSelected = tile.dataset.correct === 'true';
            
            if (isSelected !== shouldBeSelected) {
                correct = false;
            }
        });
    }
    
    if (correct) {
        playSound('success');
        showCorrectAnimation(tiles);
        
        setTimeout(() => {
            if (level.onComplete) {
                level.onComplete(gameState.selectedTiles);
            }
            loadLevel(gameState.currentLevel + 1);
        }, 800);
    } else {
        playSound('error');
        showErrorAnimation(tiles);
        
        // Shake and retry (or proceed for horror levels)
        if (level.mood === 'horror' || level.mood === 'invasive') {
            // Horror levels - accept wrong answers ominously
            setTimeout(() => {
                triggerGlitch(300);
                flashText(elements.challengeSubtext, "ANSWER RECORDED", 1000);
                setTimeout(() => {
                    loadLevel(gameState.currentLevel + 1);
                }, 1200);
            }, 500);
        } else {
            // Normal levels - reset selection
            setTimeout(() => {
                gameState.selectedTiles = [];
                tiles.forEach(t => t.classList.remove('selected', 'correct', 'incorrect'));
            }, 1000);
        }
    }
}

function submitTextInput(level) {
    const input = elements.textInput.value.trim();
    
    if (input.length === 0) {
        elements.textInput.style.borderColor = '#d93025';
        return;
    }
    
    playSound('success');
    
    // Store input based on level
    if (level.instruction.includes('name')) {
        gameState.playerName = input;
    }
    
    if (level.onComplete) {
        level.onComplete(input);
    }
    
    if (level.finalLevel) {
        return; // Ending handled by onComplete
    }
    
    // Proceed to next level
    setTimeout(() => {
        loadLevel(gameState.currentLevel + 1);
    }, 500);
}

function skipLevel() {
    loadLevel(gameState.currentLevel + 1);
}

function updateProgress(levelIndex) {
    const progress = ((levelIndex + 1) / LEVELS.length) * 100;
    elements.progressFill.style.width = progress + '%';
    
    // Color change based on progress
    if (progress > 70) {
        elements.progressFill.className = 'danger';
    } else if (progress > 40) {
        elements.progressFill.className = 'warning';
    } else {
        elements.progressFill.className = '';
    }
}

function showCorrectAnimation(tiles) {
    tiles.forEach(tile => {
        if (tile.classList.contains('selected')) {
            tile.classList.add('correct');
        }
    });
}

function showErrorAnimation(tiles) {
    tiles.forEach(tile => {
        const isSelected = tile.classList.contains('selected');
        const shouldBeSelected = tile.dataset.correct === 'true';
        
        if (isSelected && !shouldBeSelected) {
            tile.classList.add('incorrect');
        }
    });
    
    // Shake container
    elements.captchaContainer.style.animation = 'none';
    elements.captchaContainer.offsetHeight; // Trigger reflow
    elements.captchaContainer.style.animation = 'glitchBox 0.1s ease 3';
}

// === HORROR EFFECTS ===

function triggerGlitch(duration) {
    elements.glitchOverlay.classList.add('active');
    elements.glitchOverlay.classList.remove('hidden');
    
    // Play glitch sound
    playSound('glitch');
    
    setTimeout(() => {
        elements.glitchOverlay.classList.remove('active');
    }, duration);
}

function randomGlitchTiles() {
    setInterval(() => {
        const tiles = document.querySelectorAll('.grid-tile');
        if (tiles.length === 0) return;
        
        const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
        randomTile.classList.add('glitch');
        
        setTimeout(() => {
            randomTile.classList.remove('glitch');
        }, 150);
    }, 2000);
}

function flashText(element, text, duration) {
    const original = element.textContent;
    element.textContent = text;
    element.classList.add('creepy-text');
    
    setTimeout(() => {
        element.textContent = original;
        element.classList.remove('creepy-text');
    }, duration);
}

function enableHorrorEffects() {
    document.body.classList.add('horror-mode');
    
    // Start creepy ambient audio
    startAmbientAudio();
    
    // Play initial drone
    playSound('drone');
    
    // Random message flashes with sounds
    setInterval(() => {
        if (Math.random() < 0.2) {
            const msg = HORROR_MESSAGES[Math.floor(Math.random() * HORROR_MESSAGES.length)];
            flashText(elements.challengeSubtext, msg, 500);
            triggerGlitch(100);
            
            // Random horror sound
            if (Math.random() < 0.5) {
                playSound('whisper');
            }
        }
    }, 3000);
    
    // Occasional heartbeat
    setInterval(() => {
        if (Math.random() < 0.3) {
            playSound('heartbeat');
        }
    }, 5000);
}

// === ENDING ===

function showEnding() {
    elements.overlay.classList.add('fade');
    
    // Stop ambient and play final sounds
    stopAmbientAudio();
    playSound('static');
    
    setTimeout(() => {
        elements.captchaContainer.classList.add('hidden');
        elements.endScreen.classList.remove('hidden');
        
        // Play final drone
        playSound('drone');
        
        // Determine ending based on player behavior
        let ending = ENDINGS.compliant;
        
        // Could add logic here based on:
        // - How long they took
        // - What they typed
        // - How they answered personal questions
        
        typeWriter(elements.endMessage, ending.message, 50);
        
        // Add final credit after message
        setTimeout(() => {
            const credit = document.createElement('p');
            credit.style.marginTop = '40px';
            credit.style.fontSize = '12px';
            credit.style.opacity = '0.5';
            credit.innerHTML = 'CAPTCHA: Am I Human?<br><br>A game about identity.<br><br>[Refresh to play again]';
            elements.endMessage.parentElement.appendChild(credit);
        }, ending.message.length * 50 + 2000);
        
    }, 1000);
}

function typeWriter(element, text, speed) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// === AUDIO ===

// Initialize audio on first user interaction
let audioInitialized = false;

function initAudio() {
    if (!audioInitialized && window.AudioSystem) {
        AudioSystem.init();
        audioInitialized = true;
    }
}

function playSound(type) {
    if (!window.AudioSystem) return;
    
    initAudio();
    
    switch(type) {
        case 'click':
            AudioSystem.playClick();
            break;
        case 'success':
            AudioSystem.playSuccess();
            break;
        case 'error':
            AudioSystem.playError();
            break;
        case 'glitch':
            AudioSystem.playGlitch();
            break;
        case 'heartbeat':
            AudioSystem.playHeartbeat();
            break;
        case 'whisper':
            AudioSystem.playWhisper();
            break;
        case 'static':
            AudioSystem.playStatic();
            break;
        case 'drone':
            AudioSystem.playDrone();
            break;
    }
}

function startAmbientAudio() {
    if (window.AudioSystem) {
        initAudio();
        AudioSystem.startAmbient();
    }
}

function stopAmbientAudio() {
    if (window.AudioSystem) {
        AudioSystem.stopAmbient();
    }
}

// Sound toggle button
function setupSoundToggle() {
    const toggleBtn = document.getElementById('sound-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            if (window.AudioSystem) {
                initAudio();
                const isOn = AudioSystem.toggleMute();
                this.textContent = isOn ? '🔊' : '🔇';
                this.title = isOn ? 'Mute Sound' : 'Unmute Sound';
            }
        });
    }
}

// Make functions available globally for levels.js callbacks
window.triggerGlitch = triggerGlitch;
window.enableHorrorEffects = enableHorrorEffects;
window.showEnding = showEnding;
window.gameState = gameState;
