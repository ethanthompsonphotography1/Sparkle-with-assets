
import 'package:flutter/material.dart';

class NeonTheme {
  // 2025 Neon-Pastel Palette
  static const Color neonMagenta = Color(0xFFFF00FF);
  static const Color neonTurquoise = Color(0xFF00FFFF);
  static const Color sunnyYellow = Color(0xFFFFFF00);
  static const Color deepSpace = Color(0xFF1A1A2E);
  static const Color glowPink = Color(0xFFFF69B4);

  static ThemeData get appTheme {
    return ThemeData(
      brightness: Brightness.dark,
      primaryColor: neonMagenta,
      scaffoldBackgroundColor: deepSpace,
      colorScheme: const ColorScheme.dark(
        primary: neonMagenta,
        secondary: neonTurquoise,
        tertiary: sunnyYellow,
      ),
      textTheme: const TextTheme(
        displayLarge: TextStyle(
          color: sunnyYellow,
          fontSize: 32,
          fontWeight: FontWeight.bold,
          shadows: [
            Shadow(color: neonMagenta, blurRadius: 10, offset: Offset(2, 2)),
          ],
        ),
        bodyLarge: TextStyle(color: Colors.white, fontSize: 18),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: neonMagenta,
          foregroundColor: Colors.white,
          minimumSize: const Size(80, 80), // Massive touch targets for preschool
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          elevation: 10,
          shadowColor: neonTurquoise,
        ),
      ),
    );
  }

  static BoxDecoration get glassBox => BoxDecoration(
    color: Colors.white.withOpacity(0.1),
    borderRadius: BorderRadius.circular(25),
    border: Border.all(color: Colors.white.withOpacity(0.2)),
  );
}
