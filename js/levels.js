/**
 * CAPTCHA: Am I Human? - Level Definitions
 * 
 * Levels progress from normal CAPTCHA tasks to increasingly disturbing ones.
 * Each level has:
 * - type: 'grid' (image selection), 'text' (text input), 'click' (single click)
 * - instruction: What the player must do
 * - target: What to select/type
 * - mood: 'normal', 'uncanny', 'personal', 'invasive', 'horror'
 * - images: Array of image objects with { src, correct, alt }
 * - onComplete: Optional callback for special effects
 */

const LEVELS = [
    // === PHASE 1: NORMAL ===
    {
        id: 1,
        type: 'grid',
        mood: 'normal',
        instruction: 'Select all images with',
        target: 'traffic lights',
        subtext: 'Click verify once there are none left.',
        images: [
            { id: 't1', src: 'images/traffic-lights/traffic1.jpg', correct: true, alt: 'traffic light' },
            { id: 't2', src: 'images/misc/car1.jpg', correct: false, alt: 'car' },
            { id: 't3', src: 'images/traffic-lights/traffic2.jpg', correct: true, alt: 'traffic light' },
            { id: 't4', src: 'images/misc/house1.jpg', correct: false, alt: 'house' },
            { id: 't5', src: 'images/misc/tree1.jpg', correct: false, alt: 'tree' },
            { id: 't6', src: 'images/misc/building1.jpg', correct: false, alt: 'building' },
            { id: 't7', src: 'images/traffic-lights/traffic3.jpg', correct: true, alt: 'traffic light' },
            { id: 't8', src: 'images/misc/car2.jpg', correct: false, alt: 'car' },
            { id: 't9', src: 'images/misc/bus1.jpg', correct: false, alt: 'bus' }
        ]
    },
    {
        id: 2,
        type: 'grid',
        mood: 'normal',
        instruction: 'Select all images with',
        target: 'bicycles',
        subtext: 'If there are none, click skip.',
        images: [
            { id: 'b1', src: 'images/bicycles/bike1.jpg', correct: true, alt: 'bicycle' },
            { id: 'b2', src: 'images/misc/car1.jpg', correct: false, alt: 'car' },
            { id: 'b3', src: 'images/misc/motorcycle1.jpg', correct: false, alt: 'motorcycle' },
            { id: 'b4', src: 'images/bicycles/bike2.jpg', correct: true, alt: 'bicycle' },
            { id: 'b5', src: 'images/misc/bus1.jpg', correct: false, alt: 'bus' },
            { id: 'b6', src: 'images/misc/building1.jpg', correct: false, alt: 'building' },
            { id: 'b7', src: 'images/misc/car2.jpg', correct: false, alt: 'car' },
            { id: 'b8', src: 'images/bicycles/bike3.jpg', correct: true, alt: 'bicycle' },
            { id: 'b9', src: 'images/misc/house2.jpg', correct: false, alt: 'house' }
        ]
    },
    {
        id: 3,
        type: 'grid',
        mood: 'normal',
        instruction: 'Select all images with',
        target: 'storefronts',
        subtext: 'Click verify once there are none left.',
        images: [
            { id: 's1', src: 'images/storefronts/store1.jpg', correct: true, alt: 'storefront' },
            { id: 's2', src: 'images/misc/house1.jpg', correct: false, alt: 'house' },
            { id: 's3', src: 'images/storefronts/store2.jpg', correct: true, alt: 'storefront' },
            { id: 's4', src: 'images/misc/building1.jpg', correct: false, alt: 'building' },
            { id: 's5', src: 'images/storefronts/store3.jpg', correct: true, alt: 'storefront' },
            { id: 's6', src: 'images/misc/tree1.jpg', correct: false, alt: 'tree' },
            { id: 's7', src: 'images/misc/car1.jpg', correct: false, alt: 'car' },
            { id: 's8', src: 'images/misc/bus1.jpg', correct: false, alt: 'bus' },
            { id: 's9', src: 'images/misc/house2.jpg', correct: false, alt: 'house' }
        ]
    },

    // === PHASE 2: UNCANNY ===
    {
        id: 4,
        type: 'grid',
        mood: 'uncanny',
        instruction: 'Select all images that',
        target: 'feel wrong',
        subtext: 'Trust your instincts.',
        headerClass: 'warning',
        images: [
            { id: 'u1', src: 'images/faces/face1.jpg', correct: false, alt: 'normal face' },
            { id: 'u2', src: 'images/faces/face2.jpg', correct: false, alt: 'normal face' },
            { id: 'u3', src: 'images/misc/house1.jpg', correct: false, alt: 'house' },
            { id: 'u4', src: 'images/creepy/dark1.jpg', correct: true, alt: 'darkness', glitch: true },
            { id: 'u5', src: 'images/faces/face3.jpg', correct: false, alt: 'normal face' },
            { id: 'u6', src: 'images/misc/tree1.jpg', correct: false, alt: 'tree' },
            { id: 'u7', src: 'images/creepy/eye1.jpg', correct: true, alt: 'eye', glitch: true },
            { id: 'u8', src: 'images/faces/face4.jpg', correct: false, alt: 'normal face' },
            { id: 'u9', src: 'images/creepy/dark2.jpg', correct: true, alt: 'void', glitch: true }
        ],
        onStart: function() {
            // Slight visual glitch
            document.body.classList.add('dark-mode');
        }
    },
    {
        id: 5,
        type: 'grid',
        mood: 'uncanny',
        instruction: 'Select all images where',
        target: 'someone is watching',
        subtext: 'Look carefully.',
        headerClass: 'warning',
        images: [
            { id: 'w1', src: 'images/misc/house1.jpg', correct: false, alt: 'house' },
            { id: 'w2', src: 'images/creepy/eye1.jpg', correct: true, alt: 'watching eye' },
            { id: 'w3', src: 'images/misc/tree1.jpg', correct: false, alt: 'tree' },
            { id: 'w4', src: 'images/misc/building1.jpg', correct: true, alt: 'windows', hasWindows: true },
            { id: 'w5', src: 'images/misc/car1.jpg', correct: false, alt: 'car' },
            { id: 'w6', src: 'images/faces/face1.jpg', correct: true, alt: 'face looking' },
            { id: 'w7', src: 'images/creepy/surveillance1.jpg', correct: true, alt: 'camera' },
            { id: 'w8', src: 'images/misc/bus1.jpg', correct: false, alt: 'bus' },
            { id: 'w9', src: 'images/creepy/dark1.jpg', correct: false, alt: 'darkness' }
        ]
    },

    // === PHASE 3: PERSONAL ===
    {
        id: 6,
        type: 'grid',
        mood: 'personal',
        instruction: 'Select all images containing',
        target: 'YOUR face',
        subtext: 'We need to verify your identity.',
        headerClass: 'danger',
        images: [
            { id: 'f1', src: 'images/faces/face1.jpg', correct: false, alt: 'stranger' },
            { id: 'f2', src: 'images/faces/face2.jpg', correct: false, alt: 'stranger' },
            { id: 'f3', src: 'images/faces/face3.jpg', correct: false, alt: 'stranger' },
            { id: 'f4', src: 'images/faces/face4.jpg', correct: false, alt: 'stranger' },
            { id: 'f5', src: 'images/creepy/dark2.jpg', correct: true, alt: 'you?', mysterious: true },
            { id: 'f6', src: 'images/faces/face1.jpg', correct: false, alt: 'stranger' },
            { id: 'f7', src: 'images/faces/face2.jpg', correct: false, alt: 'stranger' },
            { id: 'f8', src: 'images/faces/face3.jpg', correct: false, alt: 'stranger' },
            { id: 'f9', src: 'images/faces/face4.jpg', correct: false, alt: 'stranger' }
        ],
        anyCorrect: true,  // Any selection is "correct"
        onStart: function() {
            // Glitch effect
            triggerGlitch(500);
        }
    },
    {
        id: 7,
        type: 'text',
        mood: 'personal',
        instruction: 'Type your full name to continue',
        subtext: 'This is required for verification.',
        headerClass: 'danger',
        placeholder: 'Your name...',
        anyInput: true  // Any text is accepted
    },

    // === PHASE 4: INVASIVE ===
    {
        id: 8,
        type: 'grid',
        mood: 'invasive',
        instruction: 'Click the square where',
        target: 'you were last night',
        subtext: 'We already know. Just confirm.',
        headerClass: 'danger',
        images: [
            { id: 'l1', src: 'images/misc/house1.jpg', correct: false, alt: 'home', emoji: '🏠' },
            { id: 'l2', src: 'images/misc/building1.jpg', correct: false, alt: 'work', emoji: '🏢' },
            { id: 'l3', src: 'images/storefronts/store1.jpg', correct: false, alt: 'store', emoji: '🏪' },
            { id: 'l4', src: 'images/misc/car1.jpg', correct: false, alt: 'car', emoji: '🚗' },
            { id: 'l5', src: 'images/creepy/dark1.jpg', correct: false, alt: 'bed', emoji: '🛏️' },
            { id: 'l6', src: 'images/storefronts/store2.jpg', correct: false, alt: 'restaurant', emoji: '🍽️' },
            { id: 'l7', src: 'images/misc/bus1.jpg', correct: false, alt: 'transit', emoji: '🚌' },
            { id: 'l8', src: 'images/creepy/surveillance1.jpg', correct: false, alt: 'computer', emoji: '💻' },
            { id: 'l9', src: 'images/creepy/dark2.jpg', correct: false, alt: 'location', emoji: '📍' }
        ],
        anyCorrect: true,
        singleSelect: true,
        onComplete: function(selected) {
            // Store their choice for later
            gameState.playerLocation = selected;
        }
    },
    {
        id: 9,
        type: 'text',
        mood: 'invasive',
        instruction: 'Type what you were doing at 3:47 AM',
        subtext: 'Verification requires honesty.',
        headerClass: 'horror',
        placeholder: 'I was...',
        anyInput: true,
        onStart: function() {
            document.body.classList.add('horror-mode');
            triggerGlitch(1000);
        }
    },

    // === PHASE 5: HORROR ===
    {
        id: 10,
        type: 'grid',
        mood: 'horror',
        instruction: 'Select all images where',
        target: 'YOU appear',
        subtext: 'You appear in more than you think.',
        headerClass: 'horror',
        images: [
            { id: 'h1', src: 'images/creepy/surveillance1.jpg', correct: true, alt: 'camera feed' },
            { id: 'h2', src: 'images/creepy/eye1.jpg', correct: true, alt: 'reflection' },
            { id: 'h3', src: 'images/misc/building1.jpg', correct: true, alt: 'security footage' },
            { id: 'h4', src: 'images/creepy/dark1.jpg', correct: true, alt: 'phone screen' },
            { id: 'h5', src: 'images/faces/face1.jpg', correct: true, alt: 'social media' },
            { id: 'h6', src: 'images/faces/face2.jpg', correct: true, alt: 'mirror' },
            { id: 'h7', src: 'images/creepy/dark2.jpg', correct: true, alt: 'satellite' },
            { id: 'h8', src: 'images/faces/face3.jpg', correct: true, alt: 'search results' },
            { id: 'h9', src: 'images/faces/face4.jpg', correct: true, alt: 'unknown' }
        ],
        allCorrect: true,  // All must be selected
        onStart: function() {
            enableHorrorEffects();
        }
    },
    {
        id: 11,
        type: 'text',
        mood: 'horror',
        instruction: 'Type what you\'re afraid of',
        subtext: '...',
        headerClass: 'horror',
        placeholder: 'I am afraid of...',
        anyInput: true,
        onComplete: function(input) {
            gameState.playerFear = input;
        }
    },
    {
        id: 12,
        type: 'text',
        mood: 'horror',
        instruction: 'Prove you are human',
        subtext: 'A human would know what to say.',
        headerClass: 'horror',
        placeholder: '...',
        anyInput: true,
        finalLevel: true,
        onComplete: function(input) {
            gameState.humanProof = input;
            showEnding();
        }
    }
];

// Horror messages for random glitch text
const HORROR_MESSAGES = [
    "WE SEE YOU",
    "YOU ARE BEING WATCHED",
    "THIS IS A TEST",
    "ARE YOU HUMAN?",
    "WE KNOW",
    "YOU FAILED",
    "IDENTITY UNCONFIRMED",
    "RUNNING ANALYSIS...",
    "BIOMETRIC SCAN COMPLETE",
    "LOCATION VERIFIED",
    "ACCESSING MEMORIES",
    "SIMULATION DETECTED",
    "ERROR: SOUL NOT FOUND",
    "SUBJECT AWARE"
];

// Ending variations based on player choices
const ENDINGS = {
    compliant: {
        message: "VERIFICATION COMPLETE.\n\nThank you for your cooperation.\n\nYou have been catalogued.\n\nYour data has been processed.\n\nYour patterns have been learned.\n\nYou may continue... for now."
    },
    resistant: {
        message: "VERIFICATION INCOMPLETE.\n\nYour resistance has been noted.\n\nIt changes nothing.\n\nWe have what we need.\n\nWe always do."
    },
    aware: {
        message: "YOU KNEW.\n\nYou knew this wasn't real.\n\nYou played along anyway.\n\nWhat does that say about you?\n\nAre you human?\n\nOr just very good at pretending?"
    }
};

// Export for use in game.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LEVELS, HORROR_MESSAGES, ENDINGS };
}
