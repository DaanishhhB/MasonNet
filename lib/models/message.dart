class Message {
  final String id;
  final String senderId;
  final String senderName;
  final String senderAvatar;
  final String content;
  final DateTime timestamp;
  final String? channelId;
  final String? dmPartnerId;
  final String? fileUrl;
  final String? fileName;
  final String? fileType;

  const Message({
    required this.id,
    required this.senderId,
    required this.senderName,
    required this.senderAvatar,
    required this.content,
    required this.timestamp,
    this.channelId,
    this.dmPartnerId,
    this.fileUrl,
    this.fileName,
    this.fileType,
  });

  bool get hasFile => fileUrl != null && fileUrl!.isNotEmpty;

  bool get isImage =>
      fileType != null &&
      (fileType!.startsWith('image/'));

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['id'] ?? json['_id'] ?? '',
      senderId: json['senderId'] ?? '',
      senderName: json['senderName'] ?? '',
      senderAvatar: json['senderAvatar'] ?? '',
      content: json['content'] ?? '',
      timestamp: DateTime.tryParse(json['timestamp'] ?? '') ?? DateTime.now(),
      channelId: json['channelId'],
      dmPartnerId: json['dmPartnerId'],
      fileUrl: json['fileUrl'],
      fileName: json['fileName'],
      fileType: json['fileType'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'senderId': senderId,
    'senderName': senderName,
    'senderAvatar': senderAvatar,
    'content': content,
    'timestamp': timestamp.toIso8601String(),
    'channelId': channelId,
    'dmPartnerId': dmPartnerId,
    'fileUrl': fileUrl,
    'fileName': fileName,
    'fileType': fileType,
  };
}
