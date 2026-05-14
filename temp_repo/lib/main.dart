
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sparkle_squad/features/creative/sparkle_closet_screen.dart';
import 'package:sparkle_squad/features/rhythm/dance_stage_screen.dart';
import 'package:sparkle_squad/features/stable/starlight_stable_screen.dart';
import 'package:sparkle_squad/core/theme/neon_theme.dart';

void main() {
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sparkle-Squad: Neon-Saur Adventures',
      theme: NeonTheme.appTheme,
      initialRoute: '/',
      routes: {
        '/': (context) => const SparkleClosetScreen(),
        '/dance': (context) => const DanceStageScreen(),
        '/stable': (context) => const StarlightStableScreen(),
      },
    );
  }
}
