
# Sparkle-Squad: Neon-Saur Adventures

Sparkle-Squad is a "vibe-coded" preschool edutainment app (Ages 4–6) that blends the biology of dinosaurs with the high-energy visual and musical language of K-pop.

## Core Features

- **The Fact Jungle**: A discovery engine where users feed "Fact-Snacks" to dinosaurs to hear biological "superpowers."
- **The Sparkle Closet**: A creative "Avatar Creator" loop where users apply sticker-style neon-pastel outfits to dinosaurs.
- **The Dance Stage**: A 128-BPM rhythm game where "Beat-Bugs" trigger synchronized Rive animations.
- **The Starlight Stable**: A nurturing zone for unicorns with vitals management (hunger, energy, happiness) and "Myth vs. Reality" educational content.

## Technical Architecture

- **Framework**: Flutter 3.22.0
- **State Management**: Riverpod 2.6.1 (Architecture ready for Riverpod 3.0 Mutations)
- **Animation**: Rive (State-machine driven logic)
- **UI/UX**: Preschool standards (60-80pt touch targets, immediate feedback, non-literate navigation)

## Folder Structure

```text
lib/
├── core/
│   └── theme/          # Neon-pastel color palette & Glowing text styles
├── features/
│   ├── creative/       # Sparkle Closet logic & DressingRoomState
│   ├── discovery/      # Fact Jungle logic & FactController (Dino Superpowers)
│   ├── rhythm/         # Dance Stage logic & BeatBug classes
│   └── stable/         # Starlight Stable (Unicorn Vitals & Myth vs. Reality)
└── main.dart           # App entry point & navigation
```

## Development Standards

1. **Touch Targets**: Massive 80pt targets for motor skill development.
2. **Immediate Feedback**: Multisensory responses for every action.
3. **Vibe-Coding**: 2025 motion graphics trends with neon-pastel palettes.
4. **Performance**: RepaintBoundary used to isolate Rive repaints for 60 FPS.
