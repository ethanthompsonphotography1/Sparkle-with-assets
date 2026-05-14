
import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:audioplayers/audioplayers.dart';

// Unicorn State Model
class UnicornState {
  final double hunger;
  final double energy;
  final double happiness;
  final String? currentUnicornId;

  UnicornState({
    this.hunger = 1.0,
    this.energy = 1.0,
    this.happiness = 1.0,
    this.currentUnicornId,
  });

  UnicornState copyWith({
    double? hunger,
    double? energy,
    double? happiness,
    String? currentUnicornId,
  }) {
    return UnicornState(
      hunger: hunger ?? this.hunger,
      energy: energy ?? this.energy,
      happiness: happiness ?? this.happiness,
      currentUnicornId: currentUnicornId ?? this.currentUnicornId,
    );
  }

  // Convert to/from JSON for persistence
  Map<String, dynamic> toJson() => {
        'hunger': hunger,
        'energy': energy,
        'happiness': happiness,
        'currentUnicornId': currentUnicornId,
      };

  factory UnicornState.fromJson(Map<String, dynamic> json) => UnicornState(
        hunger: (json['hunger'] as num).toDouble(),
        energy: (json['energy'] as num).toDouble(),
        happiness: (json['happiness'] as num).toDouble(),
        currentUnicornId: json['currentUnicornId'] as String?,
      );
}

// StateNotifier for StableController
final stableControllerProvider = StateNotifierProvider<StableController, UnicornState>((ref) {
  return StableController(ref);
});

class StableController extends StateNotifier<UnicornState> {
  final Ref _ref;
  final AudioPlayer _audioPlayer = AudioPlayer();

  StableController(this._ref) : super(UnicornState()) {
    _loadState();
  }

  Future<void> _loadState() async {
    final prefs = await SharedPreferences.getInstance();
    final savedState = prefs.getString('unicornState');
    if (savedState != null) {
      state = UnicornState.fromJson(jsonDecode(savedState));
    }
  }

  Future<void> _saveState() async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setString('unicornState', jsonEncode(state.toJson()));
  }

  void feed() {
    state = state.copyWith(hunger: (state.hunger + 0.2).clamp(0.0, 1.0));
    _saveState();
    print('Unicorn fed! Hunger: ${state.hunger}');
    if (state.hunger == 1.0) {
      _playVoicePrompt('Mmm, that snack was tasty!');
    }
  }

  void sleep() {
    state = state.copyWith(energy: (state.energy + 0.3).clamp(0.0, 1.0));
    _saveState();
    print('Unicorn sleeping! Energy: ${state.energy}');
    if (state.energy == 1.0) {
      _playVoicePrompt('Time for some rest!');
    }
  }

  void wash() {
    state = state.copyWith(happiness: (state.happiness + 0.25).clamp(0.0, 1.0));
    _saveState();
    print('Unicorn washed! Happiness: ${state.happiness}');
    if (state.happiness == 1.0) {
      _playVoicePrompt('Sparkly clean!');
    }
  }

  void hatchUnicorn(String unicornId) {
    state = state.copyWith(currentUnicornId: unicornId);
    _saveState();
    print('Unicorn $unicornId hatched!');
  }

  Future<void> _playVoicePrompt(String text) async {
    // Placeholder for actual audio playback
    // await _audioPlayer.play(AssetSource('audio/luna_rex_voiceover.mp3'));
    print('Luna-Rex says: $text');
  }
}
