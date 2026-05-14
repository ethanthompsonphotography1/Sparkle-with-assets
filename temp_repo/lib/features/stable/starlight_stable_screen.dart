
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:rive/rive.dart';
import 'package:sparkle_squad/core/theme/neon_theme.dart';
import 'package:sparkle_squad/features/stable/stable_controller.dart';
import 'package:sparkle_squad/features/discovery/fact_controller.dart';

class StarlightStableScreen extends ConsumerStatefulWidget {
  const StarlightStableScreen({super.key});

  @override
  ConsumerState<StarlightStableScreen> createState() => _StarlightStableScreenState();
}

class _StarlightStableScreenState extends ConsumerState<StarlightStableScreen> {
  // Rive animation controller placeholders
  StateMachineController? _riveController;
  SMIInput<bool>? _isEatingInput;
  SMIInput<bool>? _isSleepingInput;
  SMIInput<void>? _washTriggerInput;

  void _onRiveInit(Artboard artboard) {
    _riveController = StateMachineController.fromArtboard(artboard, 'UnicornStateMachine');
    if (_riveController != null) {
      artboard.addController(_riveController!);
      _isEatingInput = _riveController!.findInput<bool>('is_eating');
      _isSleepingInput = _riveController!.findInput<bool>('is_sleeping');
      _washTriggerInput = _riveController!.findInput<void>('wash_trigger');
    }
  }

  @override
  Widget build(BuildContext context) {
    final unicornState = ref.watch(stableControllerProvider);
    final stableController = ref.read(stableControllerProvider.notifier);
    final factController = ref.read(factControllerProvider.notifier);

    return Scaffold(
      body: Stack(
        children: [
          // Background Gradient
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [NeonTheme.deepSpace, NeonTheme.neonTurquoise],
              ),
            ),
          ),

          // Unicorn Display (Rive Placeholder)
          Center(
            child: RepaintBoundary(
              child: SizedBox(
                width: 300,
                height: 300,
                child: Stack(
                  children: [
                    // Base Unicorn (Placeholder)
                    const Center(
                      child: Icon(
                        Icons.ac_unit, // Placeholder for unicorn
                        size: 200,
                        color: NeonTheme.glowPink,
                      ),
                    ),
                    // Rive Animation would go here:
                    // RiveAnimation.asset(
                    //   'assets/rive/unicorn.riv',
                    //   fit: BoxFit.contain,
                    //   onInit: _onRiveInit,
                    // ),
                  ],
                ),
              ),
            ),
          ),

          // Vitals Display
          Positioned(
            top: 60,
            left: 20,
            right: 20,
            child: Column(
              children: [
                _buildVitalBar('Hunger', unicornState.hunger, NeonTheme.neonMagenta),
                _buildVitalBar('Energy', unicornState.energy, NeonTheme.sunnyYellow),
                _buildVitalBar('Happiness', unicornState.happiness, NeonTheme.neonTurquoise),
              ],
            ),
          ),

          // Action Buttons (Massive Touch Targets)
          Positioned(
            bottom: 40,
            left: 20,
            right: 20,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _StableButton(
                  icon: Icons.restaurant_menu,
                  label: 'Feed',
                  onTap: () {
                    stableController.feed();
                    _isEatingInput?.value = true; // Trigger Rive animation
                    Future.delayed(const Duration(seconds: 1), () => _isEatingInput?.value = false);
                  },
                ),
                _StableButton(
                  icon: Icons.king_bed,
                  label: 'Sleep',
                  onTap: () {
                    stableController.sleep();
                    _isSleepingInput?.value = true; // Trigger Rive animation
                    // Dim screen logic would go here
                    Future.delayed(const Duration(seconds: 2), () => _isSleepingInput?.value = false);
                  },
                ),
                _StableButton(
                  icon: Icons.wash,
                  label: 'Wash',
                  onTap: () {
                    stableController.wash();
                    _washTriggerInput?.fire(); // Trigger Rive animation
                  },
                ),
              ],
            ),
          ),

          // History Hub Buttons
          Positioned(
            top: 180,
            right: 20,
            child: Column(
              children: [
                _StableButton(
                  icon: Icons.menu_book, // The Legend
                  label: 'Legend',
                  onTap: () => factController.playMythFact('qilin'),
                ),
                const SizedBox(height: 10),
                _StableButton(
                  icon: Icons.science, // The Reality
                  label: 'Reality',
                  onTap: () => factController.playMythFact('elasmotherium'),
                ),
              ],
            ),
          ),

          // Back Button (Home Icon)
          Positioned(
            top: 40,
            left: 20,
            child: _StableButton(
              icon: Icons.home, // Home icon for navigation
              label: 'Home',
              onTap: () => Navigator.pop(context),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVitalBar(String label, double value, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          SizedBox(
            width: 80,
            child: Text(label, style: const TextStyle(color: Colors.white, fontSize: 16)),
          ),
          Expanded(
            child: LinearProgressIndicator(
              value: value,
              backgroundColor: Colors.grey[800],
              color: color,
              minHeight: 10,
            ),
          ),
        ],
      ),
    );
  }
}

class _StableButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _StableButton({
    required this.icon,
    required this.label,
    required this.onTap,
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
          color: NeonTheme.neonMagenta.withOpacity(0.7),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: NeonTheme.neonMagenta.withOpacity(0.5),
              blurRadius: 10,
              spreadRadius: 2,
            )
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 40, color: Colors.white),
            Text(label, style: const TextStyle(color: Colors.white, fontSize: 12)),
          ],
        ),
      ),
    );
  }
}
