class StudySession {
  final String id;
  final String courseId;
  final String organizerId;
  final String organizerName;
  final String title;
  final String description;
  final String location;
  final DateTime dateTime;
  final int duration; // in minutes
  final List<String> attendingIds;
  final List<String> notAttendingIds;

  const StudySession({
    required this.id,
    required this.courseId,
    required this.organizerId,
    required this.organizerName,
    required this.title,
    required this.description,
    required this.location,
    required this.dateTime,
    required this.duration,
    this.attendingIds = const [],
    this.notAttendingIds = const [],
  });

  factory StudySession.fromJson(Map<String, dynamic> json) {
    return StudySession(
      id: json['id'] ?? json['_id'] ?? '',
      courseId: json['courseId'] ?? '',
      organizerId: json['organizerId'] ?? '',
      organizerName: json['organizerName'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      location: json['location'] ?? '',
      dateTime: DateTime.tryParse(json['dateTime'] ?? '') ?? DateTime.now(),
      duration: json['duration'] ?? 60,
      attendingIds: List<String>.from(json['attendingIds'] ?? []),
      notAttendingIds: List<String>.from(json['notAttendingIds'] ?? []),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'courseId': courseId,
    'organizerId': organizerId,
    'organizerName': organizerName,
    'title': title,
    'description': description,
    'location': location,
    'dateTime': dateTime.toIso8601String(),
    'duration': duration,
    'attendingIds': attendingIds,
    'notAttendingIds': notAttendingIds,
  };
}
