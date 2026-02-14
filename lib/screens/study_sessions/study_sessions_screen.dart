import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/course.dart';
import '../../models/study_session.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';

class StudySessionsScreen extends StatefulWidget {
  final Course course;

  const StudySessionsScreen({super.key, required this.course});

  @override
  State<StudySessionsScreen> createState() => _StudySessionsScreenState();
}

class _StudySessionsScreenState extends State<StudySessionsScreen> {
  List<StudySession> _sessions = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadSessions();
  }

  Future<void> _loadSessions() async {
    try {
      final sessions = await ApiService.getCourseStudySessions(widget.course.id);
      if (!mounted) return;
      setState(() {
        _sessions = sessions;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
    }
  }

  Future<void> _attend(int index) async {
    final s = _sessions[index];
    final uid = AuthService.currentUser?.id ?? '';
    // If already attending, remove; otherwise attend
    final status = s.attendingIds.contains(uid) ? 'remove' : 'attending';
    try {
      final updated = await ApiService.rsvpStudySession(s.id, status);
      if (mounted) setState(() => _sessions[index] = updated);
    } catch (e) {
      // Ignore errors
    }
  }

  Future<void> _decline(int index) async {
    final s = _sessions[index];
    final uid = AuthService.currentUser?.id ?? '';
    // If already not-attending, remove; otherwise decline
    final status = s.notAttendingIds.contains(uid) ? 'remove' : 'not-attending';
    try {
      final updated = await ApiService.rsvpStudySession(s.id, status);
      if (mounted) setState(() => _sessions[index] = updated);
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
            Text(widget.course.code, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            Text('Study Sessions', style: TextStyle(fontSize: 12, color: Colors.grey[400])),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showCreateDialog(),
        icon: const Icon(Icons.add),
        label: const Text('New Session'),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.gmuGreen))
          : _sessions.isEmpty
          ? const Center(child: Text('No study sessions yet. Create one!'))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _sessions.length,
              itemBuilder: (context, i) => _SessionCard(
                session: _sessions[i],
                onAttend: () => _attend(i),
                onDecline: () => _decline(i),
              ),
            ),
    );
  }

  void _showCreateDialog() {
    final titleC = TextEditingController();
    final descC = TextEditingController();
    final locationC = TextEditingController();
    final durationC = TextEditingController(text: '60');
    DateTime selectedDateTime = DateTime.now().add(const Duration(days: 1));

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) {
          final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          final h = selectedDateTime.hour > 12 ? selectedDateTime.hour - 12 : (selectedDateTime.hour == 0 ? 12 : selectedDateTime.hour);
          final ampm = selectedDateTime.hour >= 12 ? 'PM' : 'AM';
          final dateLabel = '${months[selectedDateTime.month - 1]} ${selectedDateTime.day}, ${selectedDateTime.year} at $h:${selectedDateTime.minute.toString().padLeft(2, '0')} $ampm';

          return AlertDialog(
            backgroundColor: AppTheme.cardDark,
            title: const Text('Create Study Session'),
            content: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(controller: titleC, decoration: const InputDecoration(labelText: 'Title')),
                  const SizedBox(height: 12),
                  TextField(controller: descC, decoration: const InputDecoration(labelText: 'Description'), maxLines: 2),
                  const SizedBox(height: 12),
                  TextField(controller: locationC, decoration: const InputDecoration(labelText: 'Location')),
                  const SizedBox(height: 12),
                  TextField(controller: durationC, decoration: const InputDecoration(labelText: 'Duration (minutes)'), keyboardType: TextInputType.number),
                  const SizedBox(height: 12),
                  InkWell(
                    onTap: () async {
                      final date = await showDatePicker(
                        context: ctx,
                        initialDate: selectedDateTime,
                        firstDate: DateTime.now(),
                        lastDate: DateTime.now().add(const Duration(days: 365)),
                      );
                      if (date == null) return;
                      final time = await showTimePicker(
                        context: ctx,
                        initialTime: TimeOfDay.fromDateTime(selectedDateTime),
                      );
                      if (time == null) return;
                      setDialogState(() {
                        selectedDateTime = DateTime(date.year, date.month, date.day, time.hour, time.minute);
                      });
                    },
                    child: InputDecorator(
                      decoration: const InputDecoration(labelText: 'Date & Time', suffixIcon: Icon(Icons.calendar_today, size: 18)),
                      child: Text(dateLabel, style: const TextStyle(fontSize: 14)),
                    ),
                  ),
                ],
              ),
            ),
            actions: [
              TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
              ElevatedButton(
                onPressed: () async {
                  if (titleC.text.trim().isEmpty) return;
                  Navigator.pop(ctx);
                  try {
                    final session = await ApiService.createStudySession(
                      courseId: widget.course.id,
                      title: titleC.text.trim(),
                      description: descC.text.trim(),
                      location: locationC.text.trim(),
                      dateTime: selectedDateTime,
                      duration: int.tryParse(durationC.text) ?? 60,
                    );
                    if (mounted) {
                      setState(() => _sessions.add(session));
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Study session created!'), backgroundColor: AppTheme.gmuGreen),
                      );
                    }
                  } catch (e) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Failed to create session'), backgroundColor: Colors.red),
                      );
                    }
                  }
                },
                child: const Text('Create'),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _SessionCard extends StatelessWidget {
  final StudySession session;
  final VoidCallback onAttend;
  final VoidCallback onDecline;

  const _SessionCard({required this.session, required this.onAttend, required this.onDecline});

  @override
  Widget build(BuildContext context) {
    final isAttending = session.attendingIds.contains(AuthService.currentUser?.id ?? '');
    final isNotAttending = session.notAttendingIds.contains(AuthService.currentUser?.id ?? '');
    final isOrganizer = session.organizerId == (AuthService.currentUser?.id ?? '');

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: Colors.purple.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.groups, color: Colors.purple),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(session.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('by ${session.organizerName}${isOrganizer ? ' (You)' : ''}', style: TextStyle(color: Colors.grey[400], fontSize: 12)),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(session.description, style: TextStyle(color: Colors.grey[300], fontSize: 13)),
            const SizedBox(height: 12),

            // Details
            _DetailRow(icon: Icons.location_on, text: session.location),
            _DetailRow(icon: Icons.schedule, text: '${_formatDate(session.dateTime)} • ${session.duration} min'),
            const SizedBox(height: 12),

            // Attendance
            Row(
              children: [
                _AttendanceBadge(count: session.attendingIds.length, label: 'Going', color: Colors.green),
                const SizedBox(width: 8),
                _AttendanceBadge(count: session.notAttendingIds.length, label: 'Not Going', color: Colors.red),
              ],
            ),
            const SizedBox(height: 8),

            // Attending users
            if (session.attendingIds.isNotEmpty)
              Wrap(
                spacing: 4,
                children: session.attendingIds.map((id) {
                  return Chip(
                    materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    label: Text(id.substring(0, id.length > 6 ? 6 : id.length), style: const TextStyle(fontSize: 11)),
                    visualDensity: VisualDensity.compact,
                  );
                }).toList(),
              ),
            const SizedBox(height: 12),

            // RSVP Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: onAttend,
                    icon: Icon(isAttending ? Icons.check_circle : Icons.check_circle_outline, size: 18),
                    label: Text(isAttending ? 'Attending' : 'Attend'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: isAttending ? Colors.green : Colors.grey,
                      side: BorderSide(color: isAttending ? Colors.green : Colors.grey),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: onDecline,
                    icon: Icon(isNotAttending ? Icons.cancel : Icons.cancel_outlined, size: 18),
                    label: Text(isNotAttending ? 'Not Going' : 'Decline'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: isNotAttending ? Colors.red : Colors.grey,
                      side: BorderSide(color: isNotAttending ? Colors.red : Colors.grey),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime dt) {
    final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    final h = dt.hour > 12 ? dt.hour - 12 : (dt.hour == 0 ? 12 : dt.hour);
    final ampm = dt.hour >= 12 ? 'PM' : 'AM';
    return '${months[dt.month - 1]} ${dt.day} at $h:${dt.minute.toString().padLeft(2, '0')} $ampm';
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String text;
  const _DetailRow({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        children: [
          Icon(icon, size: 15, color: AppTheme.gmuGold),
          const SizedBox(width: 6),
          Text(text, style: TextStyle(color: Colors.grey[300], fontSize: 12)),
        ],
      ),
    );
  }
}

class _AttendanceBadge extends StatelessWidget {
  final int count;
  final String label;
  final Color color;
  const _AttendanceBadge({required this.count, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('$count', style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(width: 4),
          Text(label, style: TextStyle(color: color, fontSize: 11)),
        ],
      ),
    );
  }
}
