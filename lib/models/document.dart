class CourseDocument {
  final String id;
  final String courseId;
  final String uploaderId;
  final String uploaderName;
  final String title;
  final String description;
  final String fileType;
  final String fileSize;
  final DateTime uploadDate;
  final bool isPreviousSemester;
  final String semester;
  final int downloads;

  const CourseDocument({
    required this.id,
    required this.courseId,
    required this.uploaderId,
    required this.uploaderName,
    required this.title,
    required this.description,
    required this.fileType,
    required this.fileSize,
    required this.uploadDate,
    this.isPreviousSemester = false,
    this.semester = 'Spring 2026',
    this.downloads = 0,
  });

  factory CourseDocument.fromJson(Map<String, dynamic> json) {
    return CourseDocument(
      id: json['id'] ?? json['_id'] ?? '',
      courseId: json['courseId'] ?? '',
      uploaderId: json['uploaderId'] ?? '',
      uploaderName: json['uploaderName'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      fileType: json['fileType'] ?? '',
      fileSize: json['fileSize'] ?? '',
      uploadDate: DateTime.tryParse(json['uploadDate'] ?? '') ?? DateTime.now(),
      isPreviousSemester: json['isPreviousSemester'] ?? false,
      semester: json['semester'] ?? 'Spring 2026',
      downloads: json['downloads'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'courseId': courseId,
    'uploaderId': uploaderId,
    'uploaderName': uploaderName,
    'title': title,
    'description': description,
    'fileType': fileType,
    'fileSize': fileSize,
    'uploadDate': uploadDate.toIso8601String(),
    'isPreviousSemester': isPreviousSemester,
    'semester': semester,
    'downloads': downloads,
  };
}
