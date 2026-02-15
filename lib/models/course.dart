class Course {
  final String id;
  final String code;
  final String name;
  final String instructor;
  final String schedule;
  final String location;
  final int credits;
  final String description;
  final List<String> enrolledStudentIds;
  final List<Channel> channels;

  const Course({
    required this.id,
    required this.code,
    required this.name,
    required this.instructor,
    required this.schedule,
    required this.location,
    required this.credits,
    required this.description,
    this.enrolledStudentIds = const [],
    this.channels = const [],
  });

  factory Course.fromJson(Map<String, dynamic> json) {
    return Course(
      id: json['id'] ?? json['_id'] ?? '',
      code: json['code'] ?? '',
      name: json['name'] ?? '',
      instructor: json['instructor'] ?? '',
      schedule: json['schedule'] ?? '',
      location: json['location'] ?? '',
      credits: json['credits'] ?? 3,
      description: json['description'] ?? '',
      enrolledStudentIds: List<String>.from(json['enrolledStudentIds'] ?? []),
      channels: (json['channels'] as List<dynamic>?)
              ?.map((c) => Channel.fromJson(c as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'code': code,
    'name': name,
    'instructor': instructor,
    'schedule': schedule,
    'location': location,
    'credits': credits,
    'description': description,
    'enrolledStudentIds': enrolledStudentIds,
    'channels': channels.map((c) => c.toJson()).toList(),
  };
}

class Channel {
  final String id;
  final String name;
  final String icon;
  final String? createdBy;

  const Channel({
    required this.id,
    required this.name,
    this.icon = '💬',
    this.createdBy,
  });

  factory Channel.fromJson(Map<String, dynamic> json) {
    return Channel(
      id: json['id'] ?? json['_id'] ?? '',
      name: json['name'] ?? '',
      icon: json['icon'] ?? '💬',
      createdBy: json['createdBy'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'icon': icon,
    'createdBy': createdBy,
  };
}
