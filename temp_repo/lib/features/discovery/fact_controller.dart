
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:audioplayers/audioplayers.dart';

class Fact {
  final String id;
  final String name;
  final String superpower;
  final String voiceoverPath;

  Fact({
    required this.id,
    required this.name,
    required this.superpower,
    required this.voiceoverPath,
  });
}

final factControllerProvider = StateNotifierProvider<FactController, Fact?>((ref) {
  return FactController();
});

class FactController extends StateNotifier<Fact?> {
  final AudioPlayer _audioPlayer = AudioPlayer();

  final Map<String, Fact> _seedFacts = {
    'luna_rex': Fact(
      id: 'luna_rex',
      name: 'Luna-Rex',
      superpower: 'Luna-Rex has a super scent radar! (Detects friends from miles away using massive olfactory bulbs).',
      voiceoverPath: 'audio/luna_rex_fact.mp3',
    ),
    'ankylosaurus': Fact(
      id: 'ankylosaurus',
      name: 'Armor-Ace (Ankylosaurus)',
      superpower: 'Armor-Ace has a tail like a hammer! (Tail club made of fused bone for high-speed protection).',
      voiceoverPath: 'audio/ankylosaurus_fact.mp3',
    ),
    'brachiosaurus': Fact(
      id: 'brachiosaurus',
      name: 'Bixie-Brachio',
      superpower: 'Bixie-Brachio has a long neck to munch leaves 80 feet high that others can\'t touch! (Gentle Crane).',
      voiceoverPath: 'audio/brachiosaurus_fact.mp3',
    ),
  };

  final Map<String, Fact> _mythFacts = {
    'qilin': Fact(
      id: 'qilin',
      name: 'Qilin',
      superpower: 'Ancient stories from China (Qilin) describe multi-colored scales and dragon-like heads.',
      voiceoverPath: 'audio/qilin_myth.mp3',
    ),
    'elasmotherium': Fact(
      id: 'elasmotherium',
      name: 'Elasmotherium',
      superpower: 'Unicorns were likely inspired by real animals like the Elasmotherium (a giant shaggy rhino with one massive horn).',
      voiceoverPath: 'audio/elasmotherium_reality.mp3',
    ),
  };

  FactController() : super(null);

  Future<void> playFact(String factId) async {
    final fact = _seedFacts[factId];
    if (fact != null) {
      state = fact;
      // Placeholder for actual audio playback
      // await _audioPlayer.play(AssetSource(fact.voiceoverPath));
      print('Playing fact for ${fact.name}: ${fact.superpower}');
    }
  }

  Future<void> playMythFact(String mythId) async {
    final fact = _mythFacts[mythId];
    if (fact != null) {
      state = fact;
      // Placeholder for actual audio playback
      // await _audioPlayer.play(AssetSource(fact.voiceoverPath));
      print('Playing myth fact for ${fact.name}: ${fact.superpower}');
    }
  }

  void clearFact() {
    state = null;
  }

  void hatchUnicornFromCrystal(String crystalId) {
    // This would likely interact with the StableController to hatch a unicorn
    print('Attempting to hatch unicorn with crystal ID: $crystalId');
  }
}
