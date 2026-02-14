enum EventType { homework, quiz, exam, project, other }

EventType _parseEventType(String? type) {
  switch (type) {
    case 'homework':
      return EventType.homework;
    case 'quiz':
      return EventType.quiz;
    case 'exam':
      return EventType.exam;
    case 'project':
      return EventType.project;
    default:
      return EventType.other;
  }
}

class CalendarEvent {
  final String id;
  final String courseId;
  final String title;
  final String description;
  final DateTime date;
  final EventType type;

  const CalendarEvent({
    required this.id,
    required this.courseId,
    required this.title,
    required this.description,
    required this.date,
    required this.type,
  });

  factory CalendarEvent.fromJson(Map<String, dynamic> json) {
    return CalendarEvent(
      id: json['id'] ?? json['_id'] ?? '',
      courseId: json['courseId'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      date: DateTime.tryParse(json['date'] ?? '') ?? DateTime.now(),
      type: _parseEventType(json['type']),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'courseId': courseId,
    'title': title,
    'description': description,
    'date': date.toIso8601String(),
    'type': type.name,
  };
}
