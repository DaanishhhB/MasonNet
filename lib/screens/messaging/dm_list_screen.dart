import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/user.dart';
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

  void _showNewDmDialog() {
    final searchC = TextEditingController();
    List<AppUser> results = [];
    bool searching = false;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          backgroundColor: AppTheme.cardDark,
          title: const Text('New Conversation'),
          content: SizedBox(
            width: double.maxFinite,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: searchC,
                  decoration: InputDecoration(
                    hintText: 'Search by name or email...',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: searching
                        ? const SizedBox(width: 20, height: 20, child: Padding(padding: EdgeInsets.all(12), child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.gmuGreen)))
                        : null,
                  ),
                  autofocus: true,
                  onChanged: (val) async {
                    if (val.trim().length < 2) {
                      setDialogState(() => results = []);
                      return;
                    }
                    setDialogState(() => searching = true);
                    try {
                      final users = await ApiService.searchUsers(val.trim());
                      setDialogState(() {
                        results = users;
                        searching = false;
                      });
                    } catch (_) {
                      setDialogState(() => searching = false);
                    }
                  },
                ),
                const SizedBox(height: 12),
                if (results.isEmpty && searchC.text.trim().length >= 2 && !searching)
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Text('No users found', style: TextStyle(color: Colors.grey[500])),
                  ),
                if (results.isNotEmpty)
                  SizedBox(
                    height: 250,
                    child: ListView.builder(
                      shrinkWrap: true,
                      itemCount: results.length,
                      itemBuilder: (_, i) {
                        final user = results[i];
                        return ListTile(
                          leading: CircleAvatar(
                            backgroundColor: AppTheme.gmuGreen,
                            child: Text(user.avatarUrl, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                          ),
                          title: Text(user.name),
                          subtitle: Text(user.email, style: TextStyle(color: Colors.grey[500], fontSize: 12)),
                          onTap: () {
                            Navigator.pop(ctx);
                            Navigator.push(context, MaterialPageRoute(
                              builder: (_) => DmChatScreen(partnerId: user.id),
                            )).then((_) => _loadConversations());
                          },
                        );
                      },
                    ),
                  ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Direct Messages'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_square),
            onPressed: _showNewDmDialog,
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
