import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/course.dart';
import '../models/message.dart';
import '../models/post.dart';
import '../models/calendar_event.dart';
import '../models/study_session.dart';
import '../models/document.dart';
import '../models/user.dart';
import 'api_config.dart';
import 'auth_service.dart';

class ApiService {
  static Map<String, String> get _headers => AuthService.authHeaders;

  // ─── Courses ───
  static Future<List<Course>> getCourses() async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/courses'),
      headers: _headers,
    );
    if (response.statusCode == 200) {
      final List data = json.decode(response.body);
      return data.map((j) => Course.fromJson(j)).toList();
    }
    throw Exception('Failed to load courses');
  }

  static Future<Course> getCourse(String id) async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/courses/$id'),
      headers: _headers,
    );
    if (response.statusCode == 200) {
      return Course.fromJson(json.decode(response.body));
    }
    throw Exception('Failed to load course');
  }

  static Future<void> enrollCourse(String courseId) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/courses/$courseId/enroll'),
      headers: _headers,
    );
    if (response.statusCode == 200) {
      // Refresh current user data
      final data = json.decode(response.body);
      if (data['user'] != null) {
        // Update auth service with new user data
        await AuthService.fetchMe();
      }
    } else {
      throw Exception('Failed to enroll');
    }
  }

  static Future<void> unenrollCourse(String courseId) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/courses/$courseId/unenroll'),
      headers: _headers,
    );
    if (response.statusCode == 200) {
      await AuthService.fetchMe();
    } else {
      throw Exception('Failed to unenroll');
    }
  }

  static Future<List<AppUser>> getCourseStudents(String courseId) async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/courses/$courseId/students'),
      headers: _headers,
    );
    if (response.statusCode == 200) {
      final List data = json.decode(response.body);
      return data.map((j) => AppUser.fromJson(j)).toList();
    }
    throw Exception('Failed to load students');
  }

  // ─── Messages ───
  static Future<List<Message>> getChannelMessages(String channelId) async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/messages/channel/$channelId'),
      headers: _headers,
    );
    if (response.statusCode == 200) {
      final List data = json.decode(response.body);
      return data.map((j) => Message.fromJson(j)).toList();
    }
    throw Exception('Failed to load messages');
  }

  static Future<Message> sendChannelMessage(String channelId, String content, {String? fileUrl, String? fileName, String? fileType}) async {
    final body = <String, dynamic>{'content': content};
    if (fileUrl != null) body['fileUrl'] = fileUrl;
    if (fileName != null) body['fileName'] = fileName;
    if (fileType != null) body['fileType'] = fileType;
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/messages/channel/$channelId'),
      headers: _headers,
      body: json.encode(body),
    );
    if (response.statusCode == 201) {
      return Message.fromJson(json.decode(response.body));
    }
    throw Exception('Failed to send message');
  }

  static Future<List<Message>> getDmMessages(String partnerId) async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/messages/dm/$partnerId'),
      headers: _headers,
    );
    if (response.statusCode == 200) {
      final List data = json.decode(response.body);
      return data.map((j) => Message.fromJson(j)).toList();
    }
    throw Exception('Failed to load DMs');
  }

  static Future<Message> sendDm(String partnerId, String content, {String? fileUrl, String? fileName, String? fileType}) async {
    final body = <String, dynamic>{'content': content};
    if (fileUrl != null) body['fileUrl'] = fileUrl;
    if (fileName != null) body['fileName'] = fileName;
    if (fileType != null) body['fileType'] = fileType;
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/messages/dm/$partnerId'),
      headers: _headers,
      body: json.encode(body),
    );
    if (response.statusCode == 201) {
      return Message.fromJson(json.decode(response.body));
    }
    throw Exception('Failed to send DM');
  }

  static Future<List<DmConversation>> getDmConversations() async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/messages/dm-conversations'),
      headers: _headers,
    );
    if (response.statusCode == 200) {
      final List data = json.decode(response.body);
      return data.map((j) => DmConversation.fromJson(j)).toList();
    }
    throw Exception('Failed to load conversations');
  }

  // ─── Posts ───
  static Future<List<FeedPost>> getPosts() async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/posts'),
      headers: _headers,
    );
    if (response.statusCode == 200) {
      final List data = json.decode(response.body);
      final uid = AuthService.currentUser?.id;
      return data.map((j) => FeedPost.fromJson(j, currentUserId: uid)).toList();
    }
    throw Exception('Failed to load posts');
  }

  static Future<FeedPost> createPost(String content) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/posts'),
      headers: _headers,
      body: json.encode({'content': content}),
    );
    if (response.statusCode == 201) {
      final uid = AuthService.currentUser?.id;
      return FeedPost.fromJson(json.decode(response.body), currentUserId: uid);
    }
    throw Exception('Failed to create post');
  }

  static Future<FeedPost> toggleLike(String postId) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/posts/$postId/like'),
      headers: _headers,
    );
    if (response.statusCode == 200) {
      final uid = AuthService.currentUser?.id;
      return FeedPost.fromJson(json.decode(response.body), currentUserId: uid);
    }
    throw Exception('Failed to toggle like');
  }

  static Future<List<FeedPost>> getUserPosts(String userId) async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/posts/user/$userId'),
      headers: _headers,
    );
    if (response.statusCode == 200) {
      final List data = json.decode(response.body);
      final uid = AuthService.currentUser?.id;
      return data.map((j) => FeedPost.fromJson(j, currentUserId: uid)).toList();
    }
    throw Exception('Failed to load user posts');
  }

  // ─── Calendar Events ───
  static Future<List<CalendarEvent>> getCourseEvents(String courseId) async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/events/course/$courseId'),
      headers: _headers,
    );
    if (response.statusCode == 200) {
      final List data = json.decode(response.body);
      return data.map((j) => CalendarEvent.fromJson(j)).toList();
    }
    throw Exception('Failed to load events');
  }

  static Future<List<CalendarEvent>> getMyEvents() async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/events/my-events'),
      headers: _headers,
    );
    if (response.statusCode == 200) {
      final List data = json.decode(response.body);
      return data.map((j) => CalendarEvent.fromJson(j)).toList();
    }
    throw Exception('Failed to load events');
  }

  static Future<CalendarEvent> createEvent({
    required String courseId,
    required String title,
    required String description,
    required DateTime date,
    required String type,
  }) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/events'),
      headers: _headers,
      body: json.encode({
        'courseId': courseId,
        'title': title,
        'description': description,
        'date': date.toIso8601String(),
        'type': type,
      }),
    );
    if (response.statusCode == 201) {
      return CalendarEvent.fromJson(json.decode(response.body));
    }
    throw Exception('Failed to create event');
  }

  // ─── Study Sessions ───
  static Future<List<StudySession>> getCourseStudySessions(String courseId) async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/study-sessions/course/$courseId'),
      headers: _headers,
    );
    if (response.statusCode == 200) {
      final List data = json.decode(response.body);
      return data.map((j) => StudySession.fromJson(j)).toList();
    }
    throw Exception('Failed to load study sessions');
  }

  static Future<List<StudySession>> getMyStudySessions() async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/study-sessions/my-sessions'),
      headers: _headers,
    );
    if (response.statusCode == 200) {
      final List data = json.decode(response.body);
      return data.map((j) => StudySession.fromJson(j)).toList();
    }
    throw Exception('Failed to load study sessions');
  }

  static Future<StudySession> createStudySession({
    required String courseId,
    required String title,
    required String description,
    required String location,
    required DateTime dateTime,
    required int duration,
  }) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/study-sessions'),
      headers: _headers,
      body: json.encode({
        'courseId': courseId,
        'title': title,
        'description': description,
        'location': location,
        'dateTime': dateTime.toIso8601String(),
        'duration': duration,
      }),
    );
    if (response.statusCode == 201) {
      return StudySession.fromJson(json.decode(response.body));
    }
    throw Exception('Failed to create study session');
  }

  static Future<StudySession> rsvpStudySession(String sessionId, String status) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/study-sessions/$sessionId/rsvp'),
      headers: _headers,
      body: json.encode({'status': status}),
    );
    if (response.statusCode == 200) {
      return StudySession.fromJson(json.decode(response.body));
    }
    throw Exception('Failed to RSVP');
  }

  // ─── Documents ───
  static Future<List<CourseDocument>> getCourseDocuments(String courseId, {bool previous = false}) async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/documents/course/$courseId?previous=$previous'),
      headers: _headers,
    );
    if (response.statusCode == 200) {
      final List data = json.decode(response.body);
      return data.map((j) => CourseDocument.fromJson(j)).toList();
    }
    throw Exception('Failed to load documents');
  }

  static Future<CourseDocument> uploadDocument({
    required String courseId,
    required String title,
    required String description,
    String fileType = 'PDF',
    String fileSize = '0 KB',
    bool isPreviousSemester = false,
    String semester = 'Spring 2026',
  }) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/documents'),
      headers: _headers,
      body: json.encode({
        'courseId': courseId,
        'title': title,
        'description': description,
        'fileType': fileType,
        'fileSize': fileSize,
        'isPreviousSemester': isPreviousSemester,
        'semester': semester,
      }),
    );
    if (response.statusCode == 201) {
      return CourseDocument.fromJson(json.decode(response.body));
    }
    throw Exception('Failed to upload document');
  }

  // ─── Chatbot ───
  static Future<String> sendChatbotMessage(String message, List<Map<String, String>> history) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/chatbot'),
      headers: _headers,
      body: json.encode({'message': message, 'history': history}),
    );
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['reply'] ?? '';
    }
    throw Exception('Failed to get chatbot response');
  }

  // ─── Users ───
  static Future<AppUser> getUser(String userId) async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/auth/users/$userId'),
      headers: _headers,
    );
    if (response.statusCode == 200) {
      return AppUser.fromJson(json.decode(response.body));
    }
    throw Exception('Failed to load user');
  }
}

/// DM conversation summary for the list screen
class DmConversation {
  final String partnerId;
  final String partnerName;
  final String partnerAvatar;
  final String partnerMajor;
  final String lastMessage;
  final DateTime lastMessageTime;
  final String lastMessageSenderId;

  DmConversation({
    required this.partnerId,
    required this.partnerName,
    required this.partnerAvatar,
    required this.partnerMajor,
    required this.lastMessage,
    required this.lastMessageTime,
    required this.lastMessageSenderId,
  });

  factory DmConversation.fromJson(Map<String, dynamic> json) {
    return DmConversation(
      partnerId: json['partnerId'] ?? '',
      partnerName: json['partnerName'] ?? '',
      partnerAvatar: json['partnerAvatar'] ?? '',
      partnerMajor: json['partnerMajor'] ?? '',
      lastMessage: json['lastMessage'] ?? '',
      lastMessageTime: DateTime.parse(json['lastMessageTime']),
      lastMessageSenderId: json['lastMessageSenderId'] ?? '',
    );
  }
}
