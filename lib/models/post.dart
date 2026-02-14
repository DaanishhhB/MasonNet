class FeedPost {
  final String id;
  final String authorId;
  final String authorName;
  final String authorAvatar;
  final String authorMajor;
  final String content;
  final DateTime timestamp;
  final int likes;
  final int comments;
  final int reposts;
  final bool isLiked;

  const FeedPost({
    required this.id,
    required this.authorId,
    required this.authorName,
    required this.authorAvatar,
    required this.authorMajor,
    required this.content,
    required this.timestamp,
    this.likes = 0,
    this.comments = 0,
    this.reposts = 0,
    this.isLiked = false,
  });

  factory FeedPost.fromJson(Map<String, dynamic> json, {String? currentUserId}) {
    final likedBy = List<String>.from(json['likedBy'] ?? []);
    return FeedPost(
      id: json['id'] ?? json['_id'] ?? '',
      authorId: json['authorId'] ?? '',
      authorName: json['authorName'] ?? '',
      authorAvatar: json['authorAvatar'] ?? '',
      authorMajor: json['authorMajor'] ?? '',
      content: json['content'] ?? '',
      timestamp: DateTime.tryParse(json['timestamp'] ?? '') ?? DateTime.now(),
      likes: json['likes'] ?? likedBy.length,
      comments: json['comments'] ?? 0,
      reposts: json['reposts'] ?? 0,
      isLiked: currentUserId != null ? likedBy.contains(currentUserId) : (json['isLiked'] ?? false),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'authorId': authorId,
    'authorName': authorName,
    'authorAvatar': authorAvatar,
    'authorMajor': authorMajor,
    'content': content,
    'timestamp': timestamp.toIso8601String(),
    'likes': likes,
    'comments': comments,
    'reposts': reposts,
    'isLiked': isLiked,
  };
}
