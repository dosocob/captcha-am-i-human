/**
 * CAPTCHA: Am I Human? - Procedural Audio System
 * 
 * Uses Web Audio API to generate all sounds programmatically.
 * No external files needed - perfect for horror ambiance.
 */

const AudioSystem = (function() {
    let audioContext = null;
    let masterGain = null;
    let ambientNode = null;
    let isInitialized = false;
    let isMuted = false;
    
    // Initialize audio context (must be called on user interaction)
    function init() {
        if (isInitialized) return true;
        
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = audioContext.createGain();
            masterGain.connect(audioContext.destination);
            masterGain.gain.value = 0.5;
            isInitialized = true;
            return true;
        } catch (e) {
            console.warn('Web Audio API not supported');
            return false;
        }
    }
    
    // Resume audio context if suspended (autoplay policy)
    function resume() {
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }
    
    // === BASIC SOUNDS ===
    
    // Click sound - short tick
    function playClick() {
        if (!init()) return;
        resume();
        
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(masterGain);
        
        osc.frequency.setValueAtTime(800, audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.05);
        
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        
        osc.start();
        osc.stop(audioContext.currentTime + 0.05);
    }
    
    // Success sound - pleasant ding
    function playSuccess() {
        if (!init()) return;
        resume();
        
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 chord
        
        frequencies.forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(masterGain);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioContext.currentTime);
            
            const startTime = audioContext.currentTime + (i * 0.05);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
            
            osc.start(startTime);
            osc.stop(startTime + 0.4);
        });
    }
    
    // Error sound - harsh buzz
    function playError() {
        if (!init()) return;
        resume();
        
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(masterGain);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioContext.currentTime);
        
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        osc.start();
        osc.stop(audioContext.currentTime + 0.3);
    }
    
    // === HORROR SOUNDS ===
    
    // Glitch sound - digital distortion
    function playGlitch() {
        if (!init()) return;
        resume();
        
        const bufferSize = audioContext.sampleRate * 0.15;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Generate glitchy noise
        for (let i = 0; i < bufferSize; i++) {
            if (Math.random() < 0.1) {
                data[i] = (Math.random() * 2 - 1) * 0.8;
            } else {
                data[i] = Math.sin(i * 0.1) * Math.random() * 0.3;
            }
        }
        
        const source = audioContext.createBufferSource();
        const gain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        source.buffer = buffer;
        filter.type = 'bandpass';
        filter.frequency.value = 2000;
        filter.Q.value = 5;
        
        source.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        
        gain.gain.setValueAtTime(0.4, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        source.start();
    }
    
    // Heartbeat sound
    function playHeartbeat() {
        if (!init()) return;
        resume();
        
        const playBeat = (time, volume) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(masterGain);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(60, time);
            osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);
            
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(volume, time + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
            
            osc.start(time);
            osc.stop(time + 0.15);
        };
        
        // Double beat pattern
        playBeat(audioContext.currentTime, 0.4);
        playBeat(audioContext.currentTime + 0.15, 0.25);
    }
    
    // Whisper sound (white noise with filter modulation)
    function playWhisper() {
        if (!init()) return;
        resume();
        
        const duration = 1.5;
        const bufferSize = audioContext.sampleRate * duration;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Generate breathy noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.1;
        }
        
        const source = audioContext.createBufferSource();
        const gain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        source.buffer = buffer;
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, audioContext.currentTime);
        filter.frequency.linearRampToValueAtTime(2000, audioContext.currentTime + 0.5);
        filter.frequency.linearRampToValueAtTime(600, audioContext.currentTime + duration);
        filter.Q.value = 2;
        
        source.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        
        gain.gain.setValueAtTime(0, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.3);
        gain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + duration - 0.3);
        gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
        
        source.start();
        source.stop(audioContext.currentTime + duration);
    }
    
    // Static noise
    function playStatic(duration = 0.3) {
        if (!init()) return;
        resume();
        
        const bufferSize = audioContext.sampleRate * duration;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const source = audioContext.createBufferSource();
        const gain = audioContext.createGain();
        
        source.buffer = buffer;
        source.connect(gain);
        gain.connect(masterGain);
        
        gain.gain.setValueAtTime(0.15, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        source.start();
        source.stop(audioContext.currentTime + duration);
    }
    
    // Low drone sound
    function playDrone() {
        if (!init()) return;
        resume();
        
        const osc1 = audioContext.createOscillator();
        const osc2 = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.value = 55; // Low A
        osc2.frequency.value = 57; // Slight detune for unease
        
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        
        gain.gain.setValueAtTime(0, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 1);
        gain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 3);
        gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 4);
        
        osc1.start();
        osc2.start();
        osc1.stop(audioContext.currentTime + 4);
        osc2.stop(audioContext.currentTime + 4);
    }
    
    // === AMBIENT SYSTEMS ===
    
    // Start creepy ambient loop
    function startAmbient() {
        if (!init()) return;
        resume();
        
        if (ambientNode) return; // Already playing
        
        // Create ambient drone
        const osc = audioContext.createOscillator();
        const lfo = audioContext.createOscillator();
        const lfoGain = audioContext.createGain();
        const gain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        // LFO for creepy modulation
        lfo.type = 'sine';
        lfo.frequency.value = 0.1;
        lfoGain.gain.value = 20;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        
        osc.type = 'sine';
        osc.frequency.value = 80;
        
        filter.type = 'lowpass';
        filter.frequency.value = 150;
        filter.Q.value = 5;
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        
        gain.gain.value = 0.08;
        
        lfo.start();
        osc.start();
        
        ambientNode = { osc, lfo, gain };
        
        // Random glitch sounds
        scheduleRandomSounds();
    }
    
    function stopAmbient() {
        if (ambientNode) {
            try {
                ambientNode.gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
                setTimeout(() => {
                    ambientNode.osc.stop();
                    ambientNode.lfo.stop();
                    ambientNode = null;
                }, 600);
            } catch (e) {
                ambientNode = null;
            }
        }
    }
    
    // Schedule random horror sounds
    let randomSoundInterval = null;
    
    function scheduleRandomSounds() {
        if (randomSoundInterval) return;
        
        randomSoundInterval = setInterval(() => {
            if (!ambientNode || isMuted) return;
            
            const rand = Math.random();
            if (rand < 0.15) {
                playWhisper();
            } else if (rand < 0.25) {
                playGlitch();
            } else if (rand < 0.35) {
                playHeartbeat();
            } else if (rand < 0.40) {
                playStatic(0.1);
            }
        }, 4000);
    }
    
    function stopRandomSounds() {
        if (randomSoundInterval) {
            clearInterval(randomSoundInterval);
            randomSoundInterval = null;
        }
    }
    
    // === CONTROLS ===
    
    function setVolume(value) {
        if (masterGain) {
            masterGain.gain.value = Math.max(0, Math.min(1, value));
        }
    }
    
    function mute() {
        isMuted = true;
        if (masterGain) {
            masterGain.gain.value = 0;
        }
    }
    
    function unmute() {
        isMuted = false;
        if (masterGain) {
            masterGain.gain.value = 0.5;
        }
    }
    
    function toggleMute() {
        if (isMuted) {
            unmute();
        } else {
            mute();
        }
        return !isMuted;
    }
    
    // Public API
    return {
        init,
        resume,
        
        // Basic sounds
        playClick,
        playSuccess,
        playError,
        
        // Horror sounds
        playGlitch,
        playHeartbeat,
        playWhisper,
        playStatic,
        playDrone,
        
        // Ambient
        startAmbient,
        stopAmbient,
        
        // Controls
        setVolume,
        mute,
        unmute,
        toggleMute,
        
        // State
        get isInitialized() { return isInitialized; },
        get isMuted() { return isMuted; }
    };
})();

// Export for use
window.AudioSystem = AudioSystem;
