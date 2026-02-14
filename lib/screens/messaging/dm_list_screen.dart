import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../services/api_service.dart';
import 'dm_chat_screen.dart';

class DmListScreen extends StatefulWidget {
  const DmListScreen({super.key});

  @override
  State<DmListScreen> createState() => _DmListScreenState();
}

class _DmListScreenState extends State<DmListScreen> {
  List<DmConversation> _conversations = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadConversations();
  }

  Future<void> _loadConversations() async {
    try {
      final convos = await ApiService.getDmConversations();
      if (!mounted) return;
      setState(() {
        _conversations = convos;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Direct Messages'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_square),
            onPressed: () {},
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.gmuGreen))
          : _conversations.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.chat_bubble_outline, size: 64, color: Colors.grey[600]),
                      const SizedBox(height: 12),
                      Text('No conversations yet', style: TextStyle(color: Colors.grey[500], fontSize: 16)),
                    ],
                  ),
                )
              : RefreshIndicator(
                  color: AppTheme.gmuGreen,
                  onRefresh: _loadConversations,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(8),
                    itemCount: _conversations.length,
                    itemBuilder: (context, i) {
                      final convo = _conversations[i];

                      return ListTile(
                        onTap: () => Navigator.push(context, MaterialPageRoute(
                          builder: (_) => DmChatScreen(partnerId: convo.partnerId),
                        )),
                        leading: CircleAvatar(
                          radius: 24,
                          backgroundColor: AppTheme.gmuGreen,
                          child: Text(convo.partnerAvatar, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        ),
                        title: Row(
                          children: [
                            Expanded(child: Text(convo.partnerName, style: const TextStyle(fontWeight: FontWeight.w600))),
                            Text(
                              _formatTimestamp(convo.lastMessageTime),
                              style: TextStyle(color: Colors.grey[500], fontSize: 12),
                            ),
                          ],
                        ),
                        subtitle: Text(
                          convo.lastMessage,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(color: Colors.grey[500], fontSize: 13),
                        ),
                      );
                    },
                  ),
                ),
    );
  }

  String _formatTimestamp(DateTime dt) {
    final now = DateTime.now();
    final diff = now.difference(dt);
    if (diff.inMinutes < 60) return '${diff.inMinutes}m';
    if (diff.inHours < 24) return '${diff.inHours}h';
    return '${diff.inDays}d';
  }
}
