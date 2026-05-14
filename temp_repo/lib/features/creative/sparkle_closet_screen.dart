
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:rive/rive.dart';
import 'package:sparkle_squad/core/theme/neon_theme.dart';

// Riverpod 3.0 style (simplified for current SDK)
final wardrobeProvider = StateNotifierProvider<WardrobeNotifier, Set<String>>((ref) {
  return WardrobeNotifier();
});

class WardrobeNotifier extends StateNotifier<Set<String>> {
  WardrobeNotifier() : super({});

  void toggleItem(String itemId) {
    if (state.contains(itemId)) {
      state = {...state}..remove(itemId);
    } else {
      state = {...state, itemId};
    }
  }
}

class SparkleClosetScreen extends ConsumerWidget {
  const SparkleClosetScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final activeItems = ref.watch(wardrobeProvider);

    return Scaffold(
      body: Stack(
        children: [
          // Background Gradient
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [NeonTheme.deepSpace, NeonTheme.neonMagenta],
              ),
            ),
          ),

          // Central Dino Display (Rive Placeholder)
          Center(
            child: RepaintBoundary(
              child: SizedBox(
                width: 300,
                height: 300,
                child: Stack(
                  children: [
                    // Base Dino (Placeholder)
                    const Center(
                      child: Icon(
                        Icons.pets,
                        size: 200,
                        color: NeonTheme.neonTurquoise,
                      ),
                    ),
                    
                    // Rive Animation would go here:
                    // RiveAnimation.asset('assets/rive/luna_rex.riv', stateMachines: ['MainState']),

                    // Sticker-style Overlays
                    if (activeItems.contains('kpop_jacket'))
                      const Positioned(
                        top: 50,
                        left: 50,
                        child: Icon(Icons.dry_cleaning, size: 100, color: NeonTheme.glowPink),
                      ),
                    if (activeItems.contains('unicorn_horn'))
                      const Positioned(
                        top: 20,
                        right: 100,
                        child: Icon(Icons.auto_awesome, size: 60, color: NeonTheme.sunnyYellow),
                      ),
                  ],
                ),
              ),
            ),
          ),

          // Massive Navigation Buttons (Preschool Standard)
          Positioned(
            bottom: 40,
            left: 20,
            right: 20,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _ClosetButton(
                  icon: Icons.dry_cleaning,
                  onTap: () => ref.read(wardrobeProvider.notifier).toggleItem(\'kpop_jacket\'),
                  isActive: activeItems.contains(\'kpop_jacket\'),
                ),
                _ClosetButton(
                  icon: Icons.auto_awesome,
                  onTap: () => ref.read(wardrobeProvider.notifier).toggleItem(\'unicorn_horn\'),
                  isActive: activeItems.contains(\'unicorn_horn\'),
                ),
                _ClosetButton(
                  icon: Icons.music_note, // Dance Stage navigation
                  onTap: () => Navigator.pushNamed(context, \'/dance\'),
                  isActive: false,
                ),
                _ClosetButton(
                  icon: Icons.star, // Starlight Stable navigation
                  onTap: () => Navigator.pushNamed(context, \'/stable\'),
                  isActive: false,
                ),
                _ClosetButton(
                  icon: Icons.archive, // Toy box icon for "save"
                  onTap: () {
                    // Save Logic
                  },
                  isActive: false,
                ),
              ],
            ),
          ),

          // VUI Mentor Label (Luna-Rex placeholder)
          const Positioned(
            top: 60,
            left: 20,
            child: Text(
              "Luna-Rex: Let's Sparkle!",
              style: TextStyle(
                color: NeonTheme.sunnyYellow,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ClosetButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  final bool isActive;

  const _ClosetButton({
    required this.icon,
    required this.onTap,
    required this.isActive,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 80, // 80pt touch target
        height: 80,
        margin: const EdgeInsets.all(10), // 20pt buffer (10pt on each side)
        decoration: BoxDecoration(
          color: isActive ? NeonTheme.neonTurquoise : NeonTheme.neonMagenta.withOpacity(0.7),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: NeonTheme.neonTurquoise.withOpacity(0.5),
              blurRadius: 10,
              spreadRadius: 2,
            )
          ],
        ),
        child: Icon(icon, size: 40, color: Colors.white),
      ),
    );
  }
}
