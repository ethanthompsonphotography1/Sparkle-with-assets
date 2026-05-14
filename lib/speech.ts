'use client';

export function speak(text: string) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.rate = 0.9; // Slightly slower for kids
    utterance.pitch = 1.2; // Higher pitch for a friendlier voice

    // Try to find a friendly female voice
    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Female'));
    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
}
