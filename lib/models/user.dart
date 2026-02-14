class AppUser {
  final String id;
  final String name;
  final String email;
  final String major;
  final int year;
  final String avatarUrl;
  final String bio;
  final List<String> enrolledCourseIds;

  const AppUser({
    required this.id,
    required this.name,
    required this.email,
    required this.major,
    required this.year,
    required this.avatarUrl,
    this.bio = '',
    this.enrolledCourseIds = const [],
  });

  factory AppUser.fromJson(Map<String, dynamic> json) {
    return AppUser(
      id: json['id'] ?? json['_id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      major: json['major'] ?? '',
      year: json['year'] ?? 1,
      avatarUrl: json['avatarUrl'] ?? '',
      bio: json['bio'] ?? '',
      enrolledCourseIds: List<String>.from(json['enrolledCourseIds'] ?? []),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'email': email,
    'major': major,
    'year': year,
    'avatarUrl': avatarUrl,
    'bio': bio,
    'enrolledCourseIds': enrolledCourseIds,
  };
}
