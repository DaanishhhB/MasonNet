import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import '../../theme/app_theme.dart';
import '../../models/course.dart';
import '../../models/calendar_event.dart';
import '../../services/api_service.dart';

class CalendarScreen extends StatefulWidget {
  final Course course;

  const CalendarScreen({super.key, required this.course});

  @override
  State<CalendarScreen> createState() => _CalendarScreenState();
}

class _CalendarScreenState extends State<CalendarScreen> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  List<CalendarEvent> _courseEvents = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _selectedDay = _focusedDay;
    _loadEvents();
  }

  Future<void> _loadEvents() async {
    try {
      final events = await ApiService.getCourseEvents(widget.course.id);
      if (!mounted) return;
      setState(() {
        _courseEvents = events;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
    }
  }

  List<CalendarEvent> _getEventsForDay(DateTime day) {
    return _courseEvents.where((e) =>
      e.date.year == day.year && e.date.month == day.month && e.date.day == day.day
    ).toList();
  }

  @override
  Widget build(BuildContext context) {
    final selectedEvents = _selectedDay != null ? _getEventsForDay(_selectedDay!) : <CalendarEvent>[];

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.course.code, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            Text('Calendar', style: TextStyle(fontSize: 12, color: Colors.grey[400])),
          ],
        ),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.gmuGreen))
          : Column(
        children: [
          TableCalendar<CalendarEvent>(
            firstDay: DateTime(DateTime.now().year, 1, 1),
            lastDay: DateTime(DateTime.now().year + 1, 12, 31),
            focusedDay: _focusedDay,
            selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
            eventLoader: _getEventsForDay,
            onDaySelected: (selected, focused) {
              setState(() {
                _selectedDay = selected;
                _focusedDay = focused;
              });
            },
            calendarStyle: CalendarStyle(
              todayDecoration: BoxDecoration(
                color: AppTheme.gmuGreen.withValues(alpha: 0.5),
                shape: BoxShape.circle,
              ),
              selectedDecoration: const BoxDecoration(
                color: AppTheme.gmuGreen,
                shape: BoxShape.circle,
              ),
              markerDecoration: const BoxDecoration(
                color: AppTheme.gmuGold,
                shape: BoxShape.circle,
              ),
              markersMaxCount: 3,
              outsideDaysVisible: false,
              defaultTextStyle: const TextStyle(color: Colors.white),
              weekendTextStyle: const TextStyle(color: Colors.grey),
            ),
            headerStyle: HeaderStyle(
              formatButtonVisible: false,
              titleCentered: true,
              titleTextStyle: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
              leftChevronIcon: const Icon(Icons.chevron_left, color: AppTheme.gmuGold),
              rightChevronIcon: const Icon(Icons.chevron_right, color: AppTheme.gmuGold),
            ),
            daysOfWeekStyle: const DaysOfWeekStyle(
              weekdayStyle: TextStyle(color: Colors.grey),
              weekendStyle: TextStyle(color: Colors.grey),
            ),
          ),
          const Divider(color: AppTheme.dividerDark),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: [
                Text(
                  _selectedDay != null
                    ? 'Events on ${_selectedDay!.month}/${_selectedDay!.day}'
                    : 'Select a day',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const Spacer(),
                Text('${_courseEvents.length} total', style: TextStyle(color: Colors.grey[500], fontSize: 12)),
              ],
            ),
          ),
          Expanded(
            child: selectedEvents.isEmpty
                ? _courseEvents.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.event_available, size: 48, color: Colors.grey[600]),
                            const SizedBox(height: 8),
                            Text('No events for this course', style: TextStyle(color: Colors.grey[500])),
                          ],
                        ),
                      )
                    : Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 16),
                            child: Text('All Upcoming Events', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          ),
                          const SizedBox(height: 8),
                          Expanded(
                            child: ListView.builder(
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              itemCount: _courseEvents.length,
                              itemBuilder: (context, i) => _EventCard(event: _courseEvents[i]),
                            ),
                          ),
                        ],
                      )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: selectedEvents.length,
                    itemBuilder: (context, i) => _EventCard(event: selectedEvents[i]),
                  ),
          ),
        ],
      ),
    );
  }
}

class _EventCard extends StatelessWidget {
  final CalendarEvent event;
  const _EventCard({required this.event});

  Color get _typeColor {
    switch (event.type) {
      case EventType.homework: return Colors.blue;
      case EventType.quiz: return Colors.orange;
      case EventType.exam: return Colors.red;
      case EventType.project: return Colors.purple;
      case EventType.other: return Colors.grey;
    }
  }

  IconData get _typeIcon {
    switch (event.type) {
      case EventType.homework: return Icons.assignment;
      case EventType.quiz: return Icons.quiz;
      case EventType.exam: return Icons.school;
      case EventType.project: return Icons.build;
      case EventType.other: return Icons.event;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.cardDark,
        borderRadius: BorderRadius.circular(12),
        border: Border(left: BorderSide(color: _typeColor, width: 3)),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: _typeColor.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(_typeIcon, color: _typeColor, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(event.title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                const SizedBox(height: 2),
                Text(event.description, style: TextStyle(color: Colors.grey[400], fontSize: 12), maxLines: 2, overflow: TextOverflow.ellipsis),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text('${event.date.month}/${event.date.day}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              Container(
                margin: const EdgeInsets.only(top: 4),
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: _typeColor.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(event.type.name.toUpperCase(), style: TextStyle(color: _typeColor, fontSize: 9, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
