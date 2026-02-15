class MasonMeet {
  final String id;
  final String title;
  final String description;
  final String location;
  final DateTime dateTime;
  final int duration;
  final String organizerId;
  final String organizerName;
  final String category;
  final int maxAttendees;
  final List<String> attendingIds;
  final List<String> notAttendingIds;

  const MasonMeet({
    required this.id,
    required this.title,
    required this.description,
    required this.location,
    required this.dateTime,
    required this.duration,
    required this.organizerId,
    required this.organizerName,
    this.category = 'General',
    this.maxAttendees = 0,
    this.attendingIds = const [],
    this.notAttendingIds = const [],
  });

  factory MasonMeet.fromJson(Map<String, dynamic> json) {
    return MasonMeet(
      id: json['id'] ?? json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      location: json['location'] ?? '',
      dateTime: DateTime.tryParse(json['dateTime'] ?? '') ?? DateTime.now(),
      duration: json['duration'] ?? 60,
      organizerId: json['organizerId'] ?? '',
      organizerName: json['organizerName'] ?? '',
      category: json['category'] ?? 'General',
      maxAttendees: json['maxAttendees'] ?? 0,
      attendingIds: List<String>.from(json['attendingIds'] ?? []),
      notAttendingIds: List<String>.from(json['notAttendingIds'] ?? []),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'description': description,
    'location': location,
    'dateTime': dateTime.toIso8601String(),
    'duration': duration,
    'organizerId': organizerId,
    'organizerName': organizerName,
    'category': category,
    'maxAttendees': maxAttendees,
    'attendingIds': attendingIds,
    'notAttendingIds': notAttendingIds,
  };
}
