import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import 'api_config.dart';
import 'socket_service.dart';

class AuthService {
  static String? _token;
  static AppUser? _currentUser;

  static String? get token => _token;
  static AppUser? get currentUser => _currentUser;
  static bool get isLoggedIn => _token != null && _currentUser != null;

  /// Initialize from stored token on app startup
  static Future<bool> init() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token');
    final userData = prefs.getString('user_data');
    if (_token != null && userData != null) {
      try {
        _currentUser = AppUser.fromJson(json.decode(userData));
        // Verify token is still valid
        final refreshed = await fetchMe();
        if (refreshed && _token != null) {
          SocketService.connect(_token!);
        }
        return refreshed;
      } catch (e) {
        await logout();
        return false;
      }
    }
    return false;
  }

  /// Register a new account
  static Future<String?> register({
    required String name,
    required String email,
    required String password,
    required String major,
    required int year,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'name': name,
          'email': email,
          'password': password,
          'major': major,
          'year': year,
        }),
      );

      final data = json.decode(response.body);
      if (response.statusCode == 201) {
        _token = data['token'];
        _currentUser = AppUser.fromJson(data['user']);
        await _persist();
        SocketService.connect(_token!);
        return null; // success
      } else {
        return data['error'] ?? 'Registration failed';
      }
    } catch (e) {
      return 'Network error: $e';
    }
  }

  /// Login
  static Future<String?> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email, 'password': password}),
      );

      final data = json.decode(response.body);
      if (response.statusCode == 200) {
        _token = data['token'];
        _currentUser = AppUser.fromJson(data['user']);
        await _persist();
        SocketService.connect(_token!);
        return null; // success
      } else {
        return data['error'] ?? 'Login failed';
      }
    } catch (e) {
      return 'Network error: $e';
    }
  }

  /// Fetch current user from server
  static Future<bool> fetchMe() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/auth/me'),
        headers: _authHeaders(),
      );

      if (response.statusCode == 200) {
        _currentUser = AppUser.fromJson(json.decode(response.body));
        await _persist();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  /// Update profile
  static Future<String?> updateProfile({
    String? name,
    String? bio,
    String? major,
    int? year,
  }) async {
    try {
      final body = <String, dynamic>{};
      if (name != null) body['name'] = name;
      if (bio != null) body['bio'] = bio;
      if (major != null) body['major'] = major;
      if (year != null) body['year'] = year;

      final response = await http.put(
        Uri.parse('${ApiConfig.baseUrl}/auth/profile'),
        headers: _authHeaders(),
        body: json.encode(body),
      );

      if (response.statusCode == 200) {
        _currentUser = AppUser.fromJson(json.decode(response.body));
        await _persist();
        return null;
      }
      final data = json.decode(response.body);
      return data['error'] ?? 'Update failed';
    } catch (e) {
      return 'Network error: $e';
    }
  }

  /// Logout
  static Future<void> logout() async {
    SocketService.disconnect();
    _token = null;
    _currentUser = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('user_data');
  }

  /// Get auth headers
  static Map<String, String> _authHeaders() {
    return {
      'Content-Type': 'application/json',
      if (_token != null) 'Authorization': 'Bearer $_token',
    };
  }

  /// Public auth headers for use by ApiService
  static Map<String, String> get authHeaders => _authHeaders();

  /// Persist to shared preferences
  static Future<void> _persist() async {
    final prefs = await SharedPreferences.getInstance();
    if (_token != null) await prefs.setString('auth_token', _token!);
    if (_currentUser != null) {
      await prefs.setString('user_data', json.encode(_currentUser!.toJson()));
    }
  }
}
