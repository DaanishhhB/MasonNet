import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/course.dart';
import '../../models/message.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';

class ChatScreen extends StatefulWidget {
  final Channel channel;
  final String courseCode;

  const ChatScreen({super.key, required this.channel, required this.courseCode});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _controller = TextEditingController();
  List<Message> _messages = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadMessages();
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
    _controller.dispose();
    super.dispose();
  }

  Future<void> _sendMessage() async {
    if (_controller.text.trim().isEmpty) return;
    final content = _controller.text.trim();
    _controller.clear();
    try {
      final msg = await ApiService.sendChannelMessage(widget.channel.id, content);
      if (mounted) setState(() => _messages.add(msg));
    } catch (e) {
      // Ignore errors
    }
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
                    padding: const EdgeInsets.all(16),
                    itemCount: _messages.length,
                    itemBuilder: (context, i) {
                      final msg = _messages[i];
                      final isMe = msg.senderId == (AuthService.currentUser?.id ?? '');
                      final showAvatar = i == 0 || _messages[i - 1].senderId != msg.senderId;

                      return Padding(
                        padding: EdgeInsets.only(top: showAvatar ? 12 : 2),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (showAvatar)
                              CircleAvatar(
                                radius: 18,
                                backgroundColor: isMe ? AppTheme.gmuGreen : AppTheme.gmuGold.withValues(alpha: 0.3),
                                child: Text(msg.senderAvatar, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: isMe ? Colors.white : AppTheme.gmuGold)),
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
                                        Text(msg.senderName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                        const SizedBox(width: 8),
                                        Text(
                                          _formatTime(msg.timestamp),
                                          style: TextStyle(color: Colors.grey[600], fontSize: 11),
                                        ),
                                      ],
                                    ),
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
                  onPressed: () {},
                ),
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(
                      hintText: 'Message #${widget.channel.name}',
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
