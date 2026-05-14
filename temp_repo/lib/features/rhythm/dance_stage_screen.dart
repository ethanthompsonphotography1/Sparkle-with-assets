
import 'package:flutter/material.dart';
import 'package:sparkle_squad/core/theme/neon_theme.dart';

class BeatBug {
  final String id;
  final double timestamp; // Time in seconds when the bug should be tapped
  bool isTapped;

  BeatBug({required this.id, required this.timestamp, this.isTapped = false});
}

class DanceStageScreen extends StatefulWidget {
  const DanceStageScreen({super.key});

  @override
  State<DanceStageScreen> createState() => _DanceStageScreenState();
}

class _DanceStageScreenState extends State<DanceStageScreen> with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    // 128 BPM = ~0.468 seconds per beat
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 468),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  void _handleTap() {
    // Logic for successful tap (within rhythm window)
    // Trigger confetti/visual feedback
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("Sparkle Power!"),
        duration: Duration(milliseconds: 500),
        backgroundColor: NeonTheme.neonTurquoise,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background pulsing with BPM
          AnimatedBuilder(
            animation: _pulseController,
            builder: (context, child) {
              return Container(
                decoration: BoxDecoration(
                  gradient: RadialGradient(
                    colors: [
                      NeonTheme.neonMagenta.withOpacity(0.3 + (_pulseController.value * 0.2)),
                      NeonTheme.deepSpace,
                    ],
                    radius: 1.0 + (_pulseController.value * 0.2),
                  ),
                ),
              );
            },
          ),

          // Dance Floor
          const Center(
            child: Text(
              "DANCE STAGE",
              style: TextStyle(
                color: NeonTheme.sunnyYellow,
                fontSize: 40,
                fontWeight: FontWeight.bold,
                letterSpacing: 8,
              ),
            ),
          ),

          // Beat-Bug (Interactive Element)
          Center(
            child: GestureDetector(
              onTap: _handleTap,
              child: Container(
                width: 120,
                height: 120,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: NeonTheme.neonTurquoise,
                  boxShadow: [
                    BoxShadow(color: NeonTheme.neonTurquoise, blurRadius: 20),
                  ],
                ),
                child: const Icon(Icons.bug_report, size: 60, color: Colors.white),
              ),
            ),
          ),

          // Back to Closet (Navigation)
          Positioned(
            top: 40,
            left: 20,
            child: IconButton(
              icon: const Icon(Icons.arrow_back_ios, color: Colors.white, size: 40),
              onPressed: () => Navigator.pop(context),
            ),
          ),
        ],
      ),
    );
  }
}
