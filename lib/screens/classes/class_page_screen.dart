import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/course.dart';
import '../../models/user.dart';
import '../../models/calendar_event.dart';
import '../../models/study_session.dart';
import '../../models/document.dart';
import '../../services/api_service.dart';
import '../messaging/channel_list_screen.dart';
import '../calendar/calendar_screen.dart';
import '../study_sessions/study_sessions_screen.dart';
import '../documents/documents_screen.dart';

class ClassPageScreen extends StatefulWidget {
  final Course course;

  const ClassPageScreen({super.key, required this.course});

  @override
  State<ClassPageScreen> createState() => _ClassPageScreenState();
}

class _ClassPageScreenState extends State<ClassPageScreen> {
  List<CalendarEvent> _events = [];
  List<StudySession> _sessions = [];
  List<CourseDocument> _docs = [];
  List<CourseDocument> _prevDocs = [];
  List<AppUser> _students = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final results = await Future.wait([
        ApiService.getCourseEvents(widget.course.id),
        ApiService.getCourseStudySessions(widget.course.id),
        ApiService.getCourseDocuments(widget.course.id),
        ApiService.getCourseDocuments(widget.course.id, previous: true),
        ApiService.getCourseStudents(widget.course.id),
      ]);
      if (!mounted) return;
      setState(() {
        _events = results[0] as List<CalendarEvent>;
        _sessions = results[1] as List<StudySession>;
        _docs = results[2] as List<CourseDocument>;
        _prevDocs = results[3] as List<CourseDocument>;
        _students = results[4] as List<AppUser>;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final course = widget.course;

    return Scaffold(
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.gmuGreen))
          : CustomScrollView(
        slivers: [
          // Header
          SliverAppBar(
            expandedHeight: 180,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AppTheme.gmuGreen, AppTheme.gmuGreen.withValues(alpha: 0.6), AppTheme.darkBg],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(16, 60, 16, 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Text(course.code, style: const TextStyle(color: AppTheme.gmuGold, fontWeight: FontWeight.bold, fontSize: 22)),
                        Text(course.name, style: const TextStyle(color: Colors.white, fontSize: 16)),
                        const SizedBox(height: 4),
                        Text('${course.instructor} • ${course.location}', style: TextStyle(color: Colors.white.withValues(alpha: 0.7), fontSize: 12)),
                        Text('${_students.length} students enrolled', style: TextStyle(color: Colors.white.withValues(alpha: 0.6), fontSize: 12)),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
          // Body
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Info Card
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.cardDark,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('About', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        const SizedBox(height: 8),
                        Text(course.description, style: TextStyle(color: Colors.grey[300], fontSize: 13)),
                        const SizedBox(height: 12),
                        _InfoRow(icon: Icons.schedule, text: course.schedule),
                        _InfoRow(icon: Icons.location_on, text: course.location),
                        _InfoRow(icon: Icons.credit_card, text: '${course.credits} Credits'),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Sections
                  const Text('Class Sections', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                  const SizedBox(height: 12),

                  // Messaging
                  _SectionCard(
                    icon: Icons.forum,
                    title: 'Messaging',
                    subtitle: '${course.channels.length} channels',
                    color: Colors.blue,
                    onTap: () => Navigator.push(context, MaterialPageRoute(
                      builder: (_) => ChannelListScreen(course: course),
                    )),
                  ),

                  // Calendar
                  _SectionCard(
                    icon: Icons.calendar_month,
                    title: 'Calendar',
                    subtitle: '${_events.length} upcoming events',
                    color: Colors.orange,
                    onTap: () => Navigator.push(context, MaterialPageRoute(
                      builder: (_) => CalendarScreen(course: course),
                    )),
                  ),

                  // Study Sessions
                  _SectionCard(
                    icon: Icons.groups,
                    title: 'Study Sessions',
                    subtitle: '${_sessions.length} sessions organized',
                    color: Colors.purple,
                    onTap: () => Navigator.push(context, MaterialPageRoute(
                      builder: (_) => StudySessionsScreen(course: course),
                    )),
                  ),

                  // Documents
                  _SectionCard(
                    icon: Icons.folder_outlined,
                    title: 'Documents',
                    subtitle: '${_docs.length} files shared',
                    color: AppTheme.gmuGreen,
                    onTap: () => Navigator.push(context, MaterialPageRoute(
                      builder: (_) => DocumentsScreen(course: course, isPrevious: false),
                    )),
                  ),

                  // Previous Semester
                  _SectionCard(
                    icon: Icons.history,
                    title: 'Previous Semester Material',
                    subtitle: '${_prevDocs.length} files from past semesters',
                    color: AppTheme.gmuGold,
                    onTap: () => Navigator.push(context, MaterialPageRoute(
                      builder: (_) => DocumentsScreen(course: course, isPrevious: true),
                    )),
                  ),
                  const SizedBox(height: 24),

                  // Students
                  const Text('Students', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _students.map((user) {
                      return Chip(
                        avatar: CircleAvatar(
                          backgroundColor: AppTheme.gmuGreen,
                          child: Text(user.avatarUrl, style: const TextStyle(fontSize: 10, color: Colors.white)),
                        ),
                        label: Text(user.name, style: const TextStyle(fontSize: 12)),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String text;
  const _InfoRow({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        children: [
          Icon(icon, size: 16, color: AppTheme.gmuGold),
          const SizedBox(width: 8),
          Text(text, style: TextStyle(color: Colors.grey[300], fontSize: 13)),
        ],
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _SectionCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        onTap: onTap,
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: color),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: Text(subtitle, style: TextStyle(color: Colors.grey[500], fontSize: 12)),
        trailing: const Icon(Icons.chevron_right, color: Colors.grey),
      ),
    );
  }
}
