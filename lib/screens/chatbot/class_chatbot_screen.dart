import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/course.dart';
import '../../services/api_service.dart';

class ClassChatbotScreen extends StatefulWidget {
  final Course course;
  const ClassChatbotScreen({super.key, required this.course});

  @override
  State<ClassChatbotScreen> createState() => _ClassChatbotScreenState();
}

class _ClassChatbotScreenState extends State<ClassChatbotScreen> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();
  final List<_ChatMessage> _messages = [];
  bool _isLoading = false;
  bool _historyLoading = true;

  @override
  void initState() {
    super.initState();
    _loadHistory();
  }

  Future<void> _loadHistory() async {
    try {
      final history = await ApiService.getChatHistory(courseId: widget.course.id);
      if (mounted) {
        setState(() {
          _messages.clear();
          for (final m in history) {
            _messages.add(_ChatMessage(role: m['role'] ?? '', content: m['content'] ?? ''));
          }
          _historyLoading = false;
        });
        if (_messages.isNotEmpty) _scrollToBottom();
      }
    } catch (e) {
      if (mounted) setState(() => _historyLoading = false);
    }
  }

  Future<void> _resetChat() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.cardDark,
        title: const Text('Reset Chat'),
        content: Text('This will clear all chat history for ${widget.course.code}. Continue?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Reset'),
          ),
        ],
      ),
    );
    if (confirm != true) return;
    try {
      await ApiService.resetChatHistory(courseId: widget.course.id);
      if (mounted) {
        setState(() => _messages.clear());
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Chat history cleared'), backgroundColor: AppTheme.gmuGreen),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to reset chat'), backgroundColor: Colors.red),
        );
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

  Future<void> _sendMessage() async {
    final text = _controller.text.trim();
    if (text.isEmpty || _isLoading) return;

    _controller.clear();
    setState(() {
      _messages.add(_ChatMessage(role: 'user', content: text));
      _isLoading = true;
    });
    _scrollToBottom();

    try {
      final history = _messages
          .sublist(0, _messages.length - 1)
          .map((m) => {'role': m.role, 'content': m.content})
          .toList();

      final reply = await ApiService.sendCourseChatbotMessage(
        widget.course.id,
        text,
        history,
      );
      if (mounted) {
        setState(() {
          _messages.add(_ChatMessage(role: 'bot', content: reply));
          _isLoading = false;
        });
        _scrollToBottom();
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _messages.add(_ChatMessage(role: 'bot', content: 'Sorry, I encountered an error. Please try again.'));
          _isLoading = false;
        });
        _scrollToBottom();
      }
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Icon(Icons.smart_toy, color: AppTheme.gmuGreen, size: 24),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('MasonBot', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                  Text(widget.course.code, style: TextStyle(fontSize: 11, color: Colors.grey[400])),
                ],
              ),
            ),
          ],
        ),
        actions: [
          if (_messages.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.refresh, color: Colors.redAccent),
              tooltip: 'Reset Chat',
              onPressed: _resetChat,
            ),
        ],
      ),
      body: _historyLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.gmuGreen))
          : Column(
        children: [
          Expanded(
            child: _messages.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.smart_toy_outlined, size: 64, color: AppTheme.gmuGreen.withValues(alpha: 0.5)),
                        const SizedBox(height: 16),
                        Text('MasonBot for ${widget.course.code}', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 8),
                        Text(
                          'Ask me anything about\n${widget.course.name}!',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.grey[400], fontSize: 14),
                        ),
                        const SizedBox(height: 24),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          alignment: WrapAlignment.center,
                          children: [
                            _SuggestionChip(
                              label: 'What topics does this course cover?',
                              onTap: () {
                                _controller.text = 'What topics does this course cover?';
                                _sendMessage();
                              },
                            ),
                            _SuggestionChip(
                              label: 'What documents are available?',
                              onTap: () {
                                _controller.text = 'What documents are available for this course?';
                                _sendMessage();
                              },
                            ),
                            _SuggestionChip(
                              label: 'Help me prepare for the exam',
                              onTap: () {
                                _controller.text = 'Can you help me prepare for the exam?';
                                _sendMessage();
                              },
                            ),
                          ],
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: _messages.length + (_isLoading ? 1 : 0),
                    itemBuilder: (context, i) {
                      if (i == _messages.length && _isLoading) {
                        return const _TypingIndicator();
                      }
                      final msg = _messages[i];
                      final isUser = msg.role == 'user';
                      return _MessageBubble(message: msg, isUser: isUser);
                    },
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
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(
                      hintText: 'Ask about ${widget.course.code}...',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(24)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      filled: true,
                      fillColor: AppTheme.cardDark,
                    ),
                    onSubmitted: (_) => _sendMessage(),
                    enabled: !_isLoading,
                  ),
                ),
                const SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: _isLoading ? Colors.grey : AppTheme.gmuGreen,
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.white, size: 18),
                    onPressed: _isLoading ? null : _sendMessage,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ChatMessage {
  final String role;
  final String content;
  _ChatMessage({required this.role, required this.content});
}

class _MessageBubble extends StatelessWidget {
  final _ChatMessage message;
  final bool isUser;
  const _MessageBubble({required this.message, required this.isUser});

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
        decoration: BoxDecoration(
          color: isUser ? AppTheme.gmuGreen : AppTheme.cardDark,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft: Radius.circular(isUser ? 16 : 4),
            bottomRight: Radius.circular(isUser ? 4 : 16),
          ),
        ),
        child: isUser
            ? Text(message.content, style: const TextStyle(fontSize: 14))
            : Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.smart_toy, size: 16, color: AppTheme.gmuGreen),
                  const SizedBox(width: 8),
                  Flexible(
                    child: SelectableText(
                      message.content,
                      style: const TextStyle(fontSize: 14, height: 1.4),
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}

class _TypingIndicator extends StatelessWidget {
  const _TypingIndicator();

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: AppTheme.cardDark,
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(16),
            topRight: Radius.circular(16),
            bottomLeft: Radius.circular(4),
            bottomRight: Radius.circular(16),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.smart_toy, size: 16, color: AppTheme.gmuGreen),
            const SizedBox(width: 8),
            SizedBox(
              width: 40,
              child: LinearProgressIndicator(
                color: AppTheme.gmuGreen,
                backgroundColor: AppTheme.gmuGreen.withValues(alpha: 0.2),
                minHeight: 3,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SuggestionChip extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  const _SuggestionChip({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          border: Border.all(color: AppTheme.gmuGreen.withValues(alpha: 0.5)),
          borderRadius: BorderRadius.circular(20),
          color: AppTheme.gmuGreen.withValues(alpha: 0.1),
        ),
        child: Text(label, style: const TextStyle(fontSize: 13, color: AppTheme.gmuGreen)),
      ),
    );
  }
}
