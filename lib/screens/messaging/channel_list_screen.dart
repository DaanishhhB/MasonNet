import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/course.dart';
import '../../services/api_service.dart';
import 'chat_screen.dart';

class ChannelListScreen extends StatefulWidget {
  final Course course;

  const ChannelListScreen({super.key, required this.course});

  @override
  State<ChannelListScreen> createState() => _ChannelListScreenState();
}

class _ChannelListScreenState extends State<ChannelListScreen> {
  late Course _course;

  @override
  void initState() {
    super.initState();
    _course = widget.course;
  }

  List<Channel> get _sortedChannels {
    final channels = List<Channel>.from(_course.channels);
    channels.sort((a, b) {
      final aMain = a.createdBy == null ? 0 : 1;
      final bMain = b.createdBy == null ? 0 : 1;
      return aMain.compareTo(bMain);
    });
    return channels;
  }

  void _showCreateChannelDialog() {
    final nameC = TextEditingController();
    final iconC = TextEditingController(text: '💬');
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.cardDark,
        title: const Text('Create Channel'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameC,
              decoration: const InputDecoration(labelText: 'Channel Name'),
              autofocus: true,
            ),
            const SizedBox(height: 12),
            TextField(
              controller: iconC,
              decoration: const InputDecoration(labelText: 'Icon (emoji)'),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () async {
              final name = nameC.text.trim();
              if (name.isEmpty) return;
              Navigator.pop(ctx);
              try {
                final updatedCourse = await ApiService.createChannel(
                  _course.id,
                  name,
                  icon: iconC.text.trim().isEmpty ? '💬' : iconC.text.trim(),
                );
                if (mounted) {
                  setState(() => _course = updatedCourse);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Channel created!'), backgroundColor: AppTheme.gmuGreen),
                  );
                }
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Failed: $e'), backgroundColor: Colors.red),
                  );
                }
              }
            },
            child: const Text('Create'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final channels = _sortedChannels;

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(_course.code, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            Text('Channels', style: TextStyle(fontSize: 12, color: Colors.grey[400])),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showCreateChannelDialog,
        backgroundColor: AppTheme.gmuGreen,
        child: const Icon(Icons.add, color: Colors.white),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: channels.length,
        itemBuilder: (context, i) {
          final ch = channels[i];
          final isUserCreated = ch.createdBy != null;
          return Card(
            margin: const EdgeInsets.only(bottom: 8),
            child: ListTile(
              onTap: () => Navigator.push(context, MaterialPageRoute(
                builder: (_) => ChatScreen(channel: ch, courseCode: _course.code),
              )),
              leading: Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: isUserCreated
                      ? Colors.deepPurple.withValues(alpha: 0.15)
                      : AppTheme.gmuGreen.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(child: Text(ch.icon, style: const TextStyle(fontSize: 20))),
              ),
              title: Text('# ${ch.name}', style: const TextStyle(fontWeight: FontWeight.w600)),
              subtitle: isUserCreated
                  ? Row(
                      children: [
                        Icon(Icons.person, size: 12, color: Colors.deepPurple[200]),
                        const SizedBox(width: 4),
                        Text('Created by ${ch.createdBy}', style: TextStyle(color: Colors.deepPurple[200], fontSize: 12)),
                      ],
                    )
                  : Text(_getSubtitle(ch.name), style: TextStyle(color: Colors.grey[500], fontSize: 12)),
              trailing: const Icon(Icons.chevron_right, color: Colors.grey),
            ),
          );
        },
      ),
    );
  }

  String _getSubtitle(String name) {
    switch (name.toLowerCase()) {
      case 'general': return 'General discussion and announcements';
      case 'homework': return 'Homework help and questions';
      case 'projects': return 'Project collaboration';
      case 'exam prep': return 'Exam preparation and study tips';
      case 'study group': return 'Organize study groups';
      case 'labs': return 'Lab help and discussion';
      case 'c memes': return 'Programming humor 😄';
      case 'help desk': return 'Get help with course material';
      default: return 'Channel discussion';
    }
  }
}
