import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:image_picker/image_picker.dart';
import '../../theme/app_theme.dart';
import '../../models/course.dart';
import '../../models/message.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';
import '../../services/socket_service.dart';

class ChatScreen extends StatefulWidget {
  final Channel channel;
  final String courseCode;

  const ChatScreen({super.key, required this.channel, required this.courseCode});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();
  List<Message> _messages = [];
  bool _loading = true;

  // Pending file attachment
  String? _pendingFileUrl;
  String? _pendingFileName;
  String? _pendingFileType;

  @override
  void initState() {
    super.initState();
    _loadMessages();
    SocketService.joinChannel(widget.channel.id);
    SocketService.onChannelMessage(_onNewMessage);
  }

  void _onNewMessage(dynamic data) {
    final msg = Message.fromJson(Map<String, dynamic>.from(data));
    if (msg.channelId == widget.channel.id &&
        msg.senderId != (AuthService.currentUser?.id ?? '')) {
      if (mounted) {
        setState(() => _messages.add(msg));
        _scrollToBottom();
      }
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _loadMessages() async {
    try {
      final msgs = await ApiService.getChannelMessages(widget.channel.id);
      if (!mounted) return;
      setState(() {
        _messages = msgs;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
    SocketService.offChannelMessage(_onNewMessage);
    SocketService.leaveChannel(widget.channel.id);
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _showAttachmentOptions() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.cardDark,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.photo, color: AppTheme.gmuGreen),
                title: const Text('Photo'),
                subtitle: const Text('Pick from gallery'),
                onTap: () {
                  Navigator.pop(context);
                  _pickImage();
                },
              ),
              ListTile(
                leading: const Icon(Icons.camera_alt, color: AppTheme.gmuGreen),
                title: const Text('Camera'),
                subtitle: const Text('Take a photo'),
                onTap: () {
                  Navigator.pop(context);
                  _takePhoto();
                },
              ),
              ListTile(
                leading: const Icon(Icons.attach_file, color: AppTheme.gmuGreen),
                title: const Text('File'),
                subtitle: const Text('Pick a document'),
                onTap: () {
                  Navigator.pop(context);
                  _pickFile();
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: ImageSource.gallery, imageQuality: 70);
    if (picked == null) return;
    await _attachFile(File(picked.path), picked.name, 'image/${picked.path.split('.').last}');
  }

  Future<void> _takePhoto() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: ImageSource.camera, imageQuality: 70);
    if (picked == null) return;
    await _attachFile(File(picked.path), picked.name, 'image/${picked.path.split('.').last}');
  }

  Future<void> _pickFile() async {
    final result = await FilePicker.platform.pickFiles();
    if (result == null || result.files.isEmpty) return;
    final file = result.files.first;
    if (file.path == null) return;
    final ext = file.extension ?? '';
    String mimeType;
    switch (ext.toLowerCase()) {
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'doc':
      case 'docx':
        mimeType = 'application/msword';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      case 'jpg':
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'gif':
        mimeType = 'image/gif';
        break;
      default:
        mimeType = 'application/octet-stream';
    }
    await _attachFile(File(file.path!), file.name, mimeType);
  }

  Future<void> _attachFile(File file, String name, String mimeType) async {
    final bytes = await file.readAsBytes();
    final base64Data = base64Encode(bytes);
    final dataUri = 'data:$mimeType;base64,$base64Data';
    setState(() {
      _pendingFileUrl = dataUri;
      _pendingFileName = name;
      _pendingFileType = mimeType;
    });
  }

  void _clearAttachment() {
    setState(() {
      _pendingFileUrl = null;
      _pendingFileName = null;
      _pendingFileType = null;
    });
  }

  Future<void> _sendMessage() async {
    final content = _controller.text.trim();
    if (content.isEmpty && _pendingFileUrl == null) return;

    final fileUrl = _pendingFileUrl;
    final fileName = _pendingFileName;
    final fileType = _pendingFileType;

    _controller.clear();
    _clearAttachment();

    try {
      final msg = await ApiService.sendChannelMessage(
        widget.channel.id,
        content,
        fileUrl: fileUrl,
        fileName: fileName,
        fileType: fileType,
      );
      if (mounted) {
        setState(() => _messages.add(msg));
        _scrollToBottom();
      }
    } catch (e) {
      // Ignore errors
    }
  }

  Widget _buildFileAttachment(Message msg) {
    if (!msg.hasFile) return const SizedBox.shrink();

    if (msg.isImage) {
      try {
        final dataUri = msg.fileUrl!;
        final base64Str = dataUri.split(',').last;
        final bytes = base64Decode(base64Str);
        return Padding(
          padding: const EdgeInsets.only(top: 4, bottom: 4),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 250, maxHeight: 250),
              child: Image.memory(bytes, fit: BoxFit.cover),
            ),
          ),
        );
      } catch (_) {
        return const Text('Failed to load image');
      }
    }

    // Non-image file card
    return Padding(
      padding: const EdgeInsets.only(top: 4, bottom: 4),
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: AppTheme.surfaceDark,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: AppTheme.dividerDark),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              _getFileIcon(msg.fileType ?? ''),
              color: AppTheme.gmuGreen,
              size: 28,
            ),
            const SizedBox(width: 8),
            Flexible(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    msg.fileName ?? 'File',
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    msg.fileType ?? '',
                    style: TextStyle(fontSize: 11, color: Colors.grey[500]),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  IconData _getFileIcon(String mimeType) {
    if (mimeType.contains('pdf')) return Icons.picture_as_pdf;
    if (mimeType.contains('word') || mimeType.contains('doc')) return Icons.description;
    if (mimeType.contains('sheet') || mimeType.contains('excel')) return Icons.table_chart;
    if (mimeType.contains('presentation') || mimeType.contains('powerpoint')) return Icons.slideshow;
    return Icons.insert_drive_file;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('# ${widget.channel.name}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            Text(widget.courseCode, style: TextStyle(fontSize: 12, color: Colors.grey[400])),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator(color: AppTheme.gmuGreen))
                : _messages.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(widget.channel.icon, style: const TextStyle(fontSize: 48)),
                        const SizedBox(height: 12),
                        Text('Welcome to #${widget.channel.name}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 4),
                        Text('Start the conversation!', style: TextStyle(color: Colors.grey[400])),
                      ],
                    ),
                  )
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: _messages.length,
                    itemBuilder: (context, i) {
                      final msg = _messages[i];
                      final isMe = msg.senderId == (AuthService.currentUser?.id ?? '');
                      final isBot = msg.senderId == 'masonbot';
                      final showAvatar = i == 0 || _messages[i - 1].senderId != msg.senderId;

                      return Padding(
                        padding: EdgeInsets.only(top: showAvatar ? 12 : 2),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (showAvatar)
                              CircleAvatar(
                                radius: 18,
                                backgroundColor: isBot
                                    ? Colors.teal
                                    : isMe
                                        ? AppTheme.gmuGreen
                                        : AppTheme.gmuGold.withValues(alpha: 0.3),
                                child: isBot
                                    ? const Text('🤖', style: TextStyle(fontSize: 16))
                                    : Text(msg.senderAvatar, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: isMe ? Colors.white : AppTheme.gmuGold)),
                              )
                            else
                              const SizedBox(width: 36),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  if (showAvatar)
                                    Row(
                                      children: [
                                        Text(
                                          msg.senderName,
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 13,
                                            color: isBot ? Colors.teal : null,
                                          ),
                                        ),
                                        if (isBot) ...[                                          const SizedBox(width: 4),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                                            decoration: BoxDecoration(
                                              color: Colors.teal.withValues(alpha: 0.2),
                                              borderRadius: BorderRadius.circular(6),
                                            ),
                                            child: const Text('BOT', style: TextStyle(color: Colors.teal, fontSize: 9, fontWeight: FontWeight.bold)),
                                          ),
                                        ],
                                        const SizedBox(width: 8),
                                        Text(
                                          _formatTime(msg.timestamp),
                                          style: TextStyle(color: Colors.grey[600], fontSize: 11),
                                        ),
                                      ],
                                    ),
                                  if (msg.hasFile) _buildFileAttachment(msg),
                                  if (msg.content.isNotEmpty)
                                    Text(msg.content, style: const TextStyle(fontSize: 14, height: 1.3)),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),
          // Pending attachment preview
          if (_pendingFileName != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: AppTheme.surfaceDark,
                border: Border(top: BorderSide(color: AppTheme.dividerDark)),
              ),
              child: Row(
                children: [
                  Icon(
                    _pendingFileType != null && _pendingFileType!.startsWith('image/')
                        ? Icons.image
                        : Icons.attach_file,
                    color: AppTheme.gmuGreen,
                    size: 20,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _pendingFileName!,
                      style: const TextStyle(fontSize: 13),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, size: 18, color: Colors.grey),
                    onPressed: _clearAttachment,
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                ],
              ),
            ),
          // Input
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.surfaceDark,
              border: Border(top: BorderSide(color: AppTheme.dividerDark)),
            ),
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.add_circle_outline, color: Colors.grey),
                  onPressed: _showAttachmentOptions,
                ),
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(
                      hintText: 'Message #${widget.channel.name} (use @MasonBot)',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(24)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      filled: true,
                      fillColor: AppTheme.cardDark,
                    ),
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                const SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: AppTheme.gmuGreen,
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.white, size: 18),
                    onPressed: _sendMessage,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatTime(DateTime dt) {
    final h = dt.hour > 12 ? dt.hour - 12 : (dt.hour == 0 ? 12 : dt.hour);
    final ampm = dt.hour >= 12 ? 'PM' : 'AM';
    return '$h:${dt.minute.toString().padLeft(2, '0')} $ampm';
  }
}
