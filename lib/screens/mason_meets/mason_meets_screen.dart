import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/mason_meet.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';

class MasonMeetsScreen extends StatefulWidget {
  const MasonMeetsScreen({super.key});

  @override
  State<MasonMeetsScreen> createState() => _MasonMeetsScreenState();
}

class _MasonMeetsScreenState extends State<MasonMeetsScreen> {
  List<MasonMeet> _meets = [];
  bool _loading = true;
  String _filterCategory = 'All';

  final _categories = ['All', 'General', 'Sports', 'Study', 'Social', 'Club', 'Other'];

  @override
  void initState() {
    super.initState();
    _loadMeets();
  }

  Future<void> _loadMeets() async {
    try {
      final meets = await ApiService.getMasonMeets();
      if (!mounted) return;
      setState(() {
        _meets = meets;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
    }
  }

  List<MasonMeet> get _filteredMeets {
    if (_filterCategory == 'All') return _meets;
    return _meets.where((m) => m.category == _filterCategory).toList();
  }

  Future<void> _rsvp(int index, String status) async {
    final meet = _filteredMeets[index];
    final origIndex = _meets.indexOf(meet);
    try {
      final updated = await ApiService.rsvpMasonMeet(meet.id, status);
      if (mounted) setState(() => _meets[origIndex] = updated);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: Colors.red),
        );
      }
    }
  }

  void _showCreateDialog() {
    final titleC = TextEditingController();
    final descC = TextEditingController();
    final locationC = TextEditingController();
    final durationC = TextEditingController(text: '60');
    final maxC = TextEditingController(text: '0');
    String category = 'General';
    DateTime selectedDateTime = DateTime.now().add(const Duration(days: 1));

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) {
          final months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          final h = selectedDateTime.hour > 12 ? selectedDateTime.hour - 12 : (selectedDateTime.hour == 0 ? 12 : selectedDateTime.hour);
          final ampm = selectedDateTime.hour >= 12 ? 'PM' : 'AM';
          final dateLabel = '${months[selectedDateTime.month - 1]} ${selectedDateTime.day}, ${selectedDateTime.year} at $h:${selectedDateTime.minute.toString().padLeft(2, '0')} $ampm';

          return AlertDialog(
            backgroundColor: AppTheme.cardDark,
            title: const Text('Create Meetup'),
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
                  DropdownButtonFormField<String>(
                    value: category,
                    decoration: const InputDecoration(labelText: 'Category'),
                    items: _categories.where((c) => c != 'All').map((c) =>
                      DropdownMenuItem(value: c, child: Text(c)),
                    ).toList(),
                    onChanged: (v) => setDialogState(() => category = v ?? 'General'),
                  ),
                  const SizedBox(height: 12),
                  TextField(controller: durationC, decoration: const InputDecoration(labelText: 'Duration (minutes)'), keyboardType: TextInputType.number),
                  const SizedBox(height: 12),
                  TextField(controller: maxC, decoration: const InputDecoration(labelText: 'Max attendees (0 = unlimited)'), keyboardType: TextInputType.number),
                  const SizedBox(height: 12),
                  InkWell(
                    onTap: () async {
                      final date = await showDatePicker(context: ctx, initialDate: selectedDateTime, firstDate: DateTime.now(), lastDate: DateTime.now().add(const Duration(days: 365)));
                      if (date == null) return;
                      if (!ctx.mounted) return;
                      final time = await showTimePicker(context: ctx, initialTime: TimeOfDay.fromDateTime(selectedDateTime));
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
                  if (titleC.text.trim().isEmpty || locationC.text.trim().isEmpty) return;
                  Navigator.pop(ctx);
                  try {
                    final meet = await ApiService.createMasonMeet(
                      title: titleC.text.trim(),
                      description: descC.text.trim(),
                      location: locationC.text.trim(),
                      dateTime: selectedDateTime,
                      duration: int.tryParse(durationC.text) ?? 60,
                      category: category,
                      maxAttendees: int.tryParse(maxC.text) ?? 0,
                    );
                    if (mounted) {
                      setState(() => _meets.insert(0, meet));
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Meetup created!'), backgroundColor: AppTheme.gmuGreen),
                      );
                    }
                  } catch (e) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Failed to create meetup'), backgroundColor: Colors.red),
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

  @override
  Widget build(BuildContext context) {
    final filtered = _filteredMeets;

    return Scaffold(
      appBar: AppBar(
        title: const Text('MasonMeets', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showCreateDialog,
        icon: const Icon(Icons.add),
        label: const Text('New Meetup'),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.startFloat,
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.gmuGreen))
          : Column(
              children: [
                // Category filter chips
                SizedBox(
                  height: 50,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    children: _categories.map((cat) {
                      final selected = _filterCategory == cat;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ChoiceChip(
                          label: Text(cat),
                          selected: selected,
                          selectedColor: AppTheme.gmuGreen,
                          onSelected: (_) => setState(() => _filterCategory = cat),
                          labelStyle: TextStyle(
                            color: selected ? Colors.white : Colors.grey[400],
                            fontWeight: selected ? FontWeight.bold : FontWeight.normal,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
                // Meetups list
                Expanded(
                  child: filtered.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.groups_outlined, size: 64, color: Colors.grey[600]),
                              const SizedBox(height: 12),
                              Text('No meetups yet', style: TextStyle(color: Colors.grey[500], fontSize: 16)),
                              const SizedBox(height: 4),
                              Text('Create one to get started!', style: TextStyle(color: Colors.grey[600], fontSize: 13)),
                            ],
                          ),
                        )
                      : RefreshIndicator(
                          color: AppTheme.gmuGreen,
                          onRefresh: _loadMeets,
                          child: ListView.builder(
                            padding: const EdgeInsets.all(16),
                            itemCount: filtered.length,
                            itemBuilder: (context, i) => _MeetCard(
                              meet: filtered[i],
                              onAttend: () => _rsvp(i, filtered[i].attendingIds.contains(AuthService.currentUser?.id ?? '') ? 'remove' : 'attending'),
                              onDecline: () => _rsvp(i, filtered[i].notAttendingIds.contains(AuthService.currentUser?.id ?? '') ? 'remove' : 'not-attending'),
                            ),
                          ),
                        ),
                ),
              ],
            ),
    );
  }
}

class _MeetCard extends StatelessWidget {
  final MasonMeet meet;
  final VoidCallback onAttend;
  final VoidCallback onDecline;

  const _MeetCard({required this.meet, required this.onAttend, required this.onDecline});

  Color get _categoryColor {
    switch (meet.category) {
      case 'Sports': return Colors.orange;
      case 'Study': return Colors.blue;
      case 'Social': return Colors.purple;
      case 'Club': return Colors.teal;
      case 'Other': return Colors.grey;
      default: return AppTheme.gmuGreen;
    }
  }

  IconData get _categoryIcon {
    switch (meet.category) {
      case 'Sports': return Icons.sports_basketball;
      case 'Study': return Icons.menu_book;
      case 'Social': return Icons.celebration;
      case 'Club': return Icons.groups;
      case 'Other': return Icons.event;
      default: return Icons.event;
    }
  }

  @override
  Widget build(BuildContext context) {
    final uid = AuthService.currentUser?.id ?? '';
    final isAttending = meet.attendingIds.contains(uid);
    final isDeclined = meet.notAttendingIds.contains(uid);
    final isOrganizer = meet.organizerId == uid;
    final isFull = meet.maxAttendees > 0 && meet.attendingIds.length >= meet.maxAttendees;

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
                    color: _categoryColor.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(_categoryIcon, color: _categoryColor),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(meet.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      Text(
                        'by ${meet.organizerName}${isOrganizer ? ' (You)' : ''}',
                        style: TextStyle(color: Colors.grey[400], fontSize: 12),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _categoryColor.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    meet.category,
                    style: TextStyle(color: _categoryColor, fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            if (meet.description.isNotEmpty) ...[
              const SizedBox(height: 10),
              Text(meet.description, style: TextStyle(color: Colors.grey[300], fontSize: 13)),
            ],
            const SizedBox(height: 12),
            _DetailRow(icon: Icons.location_on, text: meet.location),
            _DetailRow(icon: Icons.schedule, text: '${_formatDate(meet.dateTime)} \u2022 ${meet.duration} min'),
            if (meet.maxAttendees > 0)
              _DetailRow(
                icon: Icons.people,
                text: '${meet.attendingIds.length}/${meet.maxAttendees} spots filled${isFull ? ' (FULL)' : ''}',
              ),
            const SizedBox(height: 12),
            Row(
              children: [
                _AttendanceBadge(count: meet.attendingIds.length, label: 'Going', color: Colors.green),
                const SizedBox(width: 8),
                _AttendanceBadge(count: meet.notAttendingIds.length, label: 'Not Going', color: Colors.red),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: (isFull && !isAttending) ? null : onAttend,
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
                    icon: Icon(isDeclined ? Icons.cancel : Icons.cancel_outlined, size: 18),
                    label: Text(isDeclined ? 'Not Going' : 'Decline'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: isDeclined ? Colors.red : Colors.grey,
                      side: BorderSide(color: isDeclined ? Colors.red : Colors.grey),
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
    final months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
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
      decoration: BoxDecoration(color: color.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(12)),
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
