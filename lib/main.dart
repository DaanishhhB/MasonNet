import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'models/course.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/classes/class_page_screen.dart';
import 'services/auth_service.dart';

void main() {
  runApp(const MasonNetApp());
}

class MasonNetApp extends StatelessWidget {
  const MasonNetApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MasonNet',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const _SplashScreen(),
      routes: {
        '/login': (_) => const LoginScreen(),
        '/register': (_) => const RegisterScreen(),
        '/home': (_) => const HomeScreen(),
      },
      onGenerateRoute: (settings) {
        if (settings.name == '/class') {
          final course = settings.arguments as Course;
          return MaterialPageRoute(
            builder: (_) => ClassPageScreen(course: course),
          );
        }
        return null;
      },
    );
  }
}

class _SplashScreen extends StatefulWidget {
  const _SplashScreen();

  @override
  State<_SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<_SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    final loggedIn = await AuthService.init();
    if (!mounted) return;
    if (loggedIn) {
      Navigator.pushReplacementNamed(context, '/home');
    } else {
      Navigator.pushReplacementNamed(context, '/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: AppTheme.gmuGreen,
                borderRadius: BorderRadius.circular(24),
              ),
              child: const Center(
                child: Text('MN', style: TextStyle(color: Colors.white, fontSize: 40, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 24),
            const CircularProgressIndicator(color: AppTheme.gmuGreen),
          ],
        ),
      ),
    );
  }
}
