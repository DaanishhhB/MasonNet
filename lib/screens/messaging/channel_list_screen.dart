import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/course.dart';
import 'chat_screen.dart';

class ChannelListScreen extends StatelessWidget {
  final Course course;

  const ChannelListScreen({super.key, required this.course});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(course.code, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            Text('Channels', style: TextStyle(fontSize: 12, color: Colors.grey[400])),
          ],
        ),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: course.channels.length,
        itemBuilder: (context, i) {
          final ch = course.channels[i];
          return Card(
            margin: const EdgeInsets.only(bottom: 8),
            child: ListTile(
              onTap: () => Navigator.push(context, MaterialPageRoute(
                builder: (_) => ChatScreen(channel: ch, courseCode: course.code),
              )),
              leading: Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppTheme.gmuGreen.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(child: Text(ch.icon, style: const TextStyle(fontSize: 20))),
              ),
              title: Text('# ${ch.name}', style: const TextStyle(fontWeight: FontWeight.w600)),
              subtitle: Text(_getSubtitle(ch.name), style: TextStyle(color: Colors.grey[500], fontSize: 12)),
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
