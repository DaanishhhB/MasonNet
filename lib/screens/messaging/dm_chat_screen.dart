import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:image_picker/image_picker.dart';
import '../../theme/app_theme.dart';
import '../../models/message.dart';
import '../../models/user.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';
import '../../services/socket_service.dart';

class DmChatScreen extends StatefulWidget {
  final String partnerId;

  const DmChatScreen({super.key, required this.partnerId});

  @override
  State<DmChatScreen> createState() => _DmChatScreenState();
}

class _DmChatScreenState extends State<DmChatScreen> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();
  List<Message> _messages = [];
  AppUser? _partner;
  bool _loading = true;

  // Pending file attachment
  String? _pendingFileUrl;
  String? _pendingFileName;
  String? _pendingFileType;

  @override
  void initState() {
    super.initState();
    _loadData();
    SocketService.onDm(_onNewDm);
  }

  void _onNewDm(dynamic data) {
    final msg = Message.fromJson(Map<String, dynamic>.from(data));
    if (msg.senderId == widget.partnerId) {
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

  Future<void> _loadData() async {
    try {
      final results = await Future.wait([
        ApiService.getUser(widget.partnerId),
        ApiService.getDmMessages(widget.partnerId),
      ]);
      if (!mounted) return;
      setState(() {
        _partner = results[0] as AppUser;
        _messages = results[1] as List<Message>;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
    SocketService.offDm(_onNewDm);
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

  Future<void> _send() async {
    final content = _controller.text.trim();
    if (content.isEmpty && _pendingFileUrl == null) return;

    final fileUrl = _pendingFileUrl;
    final fileName = _pendingFileName;
    final fileType = _pendingFileType;

    _controller.clear();
    _clearAttachment();

    try {
      final msg = await ApiService.sendDm(
        widget.partnerId,
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

  Widget _buildFileAttachment(Message msg, bool isMe) {
    if (!msg.hasFile) return const SizedBox.shrink();

    if (msg.isImage) {
      try {
        final dataUri = msg.fileUrl!;
        final base64Str = dataUri.split(',').last;
        final bytes = base64Decode(base64Str);
        return Padding(
          padding: const EdgeInsets.only(bottom: 4),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 220, maxHeight: 220),
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
      padding: const EdgeInsets.only(bottom: 4),
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: isMe ? Colors.white.withValues(alpha: 0.15) : AppTheme.surfaceDark,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              _getFileIcon(msg.fileType ?? ''),
              color: isMe ? Colors.white : AppTheme.gmuGreen,
              size: 24,
            ),
            const SizedBox(width: 8),
            Flexible(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    msg.fileName ?? 'File',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    msg.fileType ?? '',
                    style: TextStyle(fontSize: 10, color: Colors.white.withValues(alpha: 0.5)),
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
    if (_loading) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: CircularProgressIndicator(color: AppTheme.gmuGreen)),
      );
    }
    final partner = _partner;
    if (partner == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('User not found')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            CircleAvatar(
              radius: 18,
              backgroundColor: AppTheme.gmuGreen,
              child: Text(partner.avatarUrl, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(partner.name, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                Text(partner.major, style: TextStyle(fontSize: 11, color: Colors.grey[400])),
              ],
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, i) {
                final msg = _messages[i];
                final isMe = msg.senderId == (AuthService.currentUser?.id ?? '');

                return Align(
                  alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
                    decoration: BoxDecoration(
                      color: isMe ? AppTheme.gmuGreen : AppTheme.cardDark,
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(16),
                        topRight: const Radius.circular(16),
                        bottomLeft: Radius.circular(isMe ? 16 : 4),
                        bottomRight: Radius.circular(isMe ? 4 : 16),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        if (msg.hasFile) _buildFileAttachment(msg, isMe),
                        if (msg.content.isNotEmpty)
                          Text(msg.content, style: const TextStyle(fontSize: 14)),
                        const SizedBox(height: 4),
                        Text(
                          _formatTime(msg.timestamp),
                          style: TextStyle(fontSize: 10, color: Colors.white.withValues(alpha: 0.5)),
                        ),
                      ],
                    ),
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
                      hintText: 'Message ${partner.name.split(' ').first}...',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(24)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      filled: true,
                      fillColor: AppTheme.cardDark,
                    ),
                    onSubmitted: (_) => _send(),
                  ),
                ),
                const SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: AppTheme.gmuGreen,
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.white, size: 18),
                    onPressed: _send,
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
