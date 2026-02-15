import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/course.dart';
import '../../models/calendar_event.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';
import '../classes/class_selection_screen.dart';
import '../feed/global_feed_screen.dart';
import '../messaging/dm_list_screen.dart';
import '../profile/profile_screen.dart';
import '../chatbot/chatbot_screen.dart';
import '../mason_meets/mason_meets_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final _pages = const [
    _DashboardPage(),
    MasonMeetsScreen(),
    GlobalFeedScreen(),
    DmListScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_currentIndex],
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ChatbotScreen())),
        backgroundColor: AppTheme.gmuGreen,
        child: const Icon(Icons.smart_toy, color: Colors.white),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (i) => setState(() => _currentIndex = i),
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.groups_outlined), activeIcon: Icon(Icons.groups), label: 'Meets'),
          BottomNavigationBarItem(icon: Icon(Icons.public_outlined), activeIcon: Icon(Icons.public), label: 'Feed'),
          BottomNavigationBarItem(icon: Icon(Icons.chat_outlined), activeIcon: Icon(Icons.chat), label: 'DMs'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outlined), activeIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}

class _DashboardPage extends StatefulWidget {
  const _DashboardPage();

  @override
  State<_DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<_DashboardPage> {
  List<Course> _allCourses = [];
  List<Course> _enrolled = [];
  List<CalendarEvent> _upcomingEvents = [];
  int _studyGroupCount = 0;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final courses = await ApiService.getCourses();
      final user = AuthService.currentUser;
      if (user == null) return;
      final enrolled = courses.where((c) => user.enrolledCourseIds.contains(c.id)).toList();

      final events = await ApiService.getMyEvents();
      events.sort((a, b) => a.date.compareTo(b.date));
      final upcoming = events.where((e) => e.date.isAfter(DateTime.now())).take(5).toList();

      final sessions = await ApiService.getMyStudySessions();

      if (!mounted) return;
      setState(() {
        _allCourses = courses;
        _enrolled = enrolled;
        _upcomingEvents = upcoming;
        _studyGroupCount = sessions.length;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = AuthService.currentUser;
    if (user == null) return const SizedBox();

    return SafeArea(
      child: _loading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.gmuGreen))
          : RefreshIndicator(
              color: AppTheme.gmuGreen,
              onRefresh: _loadData,
              child: CustomScrollView(
                slivers: [
                  SliverAppBar(
                    floating: true,
                    title: Row(
                      children: [
                        Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: AppTheme.gmuGreen,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Center(child: Text('MN', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14))),
                        ),
                        const SizedBox(width: 10),
                        const Text('MasonNet', style: TextStyle(fontWeight: FontWeight.bold)),
                      ],
                    ),
                    actions: [
                      IconButton(
                        icon: const Icon(Icons.notifications_outlined),
                        onPressed: () {},
                      ),
                    ],
                  ),
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Welcome back, ${user.name.split(' ').first}! \u{1F44B}',
                            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${user.major} \u2022 ${_yearLabel(user.year)}',
                            style: TextStyle(color: Colors.grey[400], fontSize: 14),
                          ),
                          const SizedBox(height: 24),
                          Row(
                            children: [
                              _StatCard(icon: Icons.class_, label: 'Classes', value: '${_enrolled.length}', color: AppTheme.gmuGreen),
                              const SizedBox(width: 12),
                              _StatCard(icon: Icons.event, label: 'Upcoming', value: '${_upcomingEvents.length}', color: AppTheme.gmuGold),
                              const SizedBox(width: 12),
                              _StatCard(icon: Icons.group, label: 'Study Groups', value: '$_studyGroupCount', color: Colors.purple),
                            ],
                          ),
                          const SizedBox(height: 24),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('My Classes', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                              ElevatedButton.icon(
                                onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ClassSelectionScreen())),
                                icon: const Icon(Icons.add, size: 18),
                                label: const Text('Add Classes', style: TextStyle(fontWeight: FontWeight.bold)),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppTheme.gmuGreen,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                        ],
                      ),
                    ),
                  ),
                  SliverToBoxAdapter(
                    child: _enrolled.isEmpty
                        ? const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 16),
                            child: Text('No classes enrolled yet. Go to Classes tab to enroll!', style: TextStyle(color: Colors.grey)),
                          )
                        : SizedBox(
                            height: 140,
                            child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              itemCount: _enrolled.length,
                              itemBuilder: (context, i) {
                                final c = _enrolled[i];
                                return GestureDetector(
                                  onTap: () => Navigator.pushNamed(context, '/class', arguments: c),
                                  child: Container(
                                    width: 200,
                                    margin: const EdgeInsets.only(right: 12),
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [AppTheme.gmuGreen, AppTheme.gmuGreen.withValues(alpha: 0.7)],
                                        begin: Alignment.topLeft,
                                        end: Alignment.bottomRight,
                                      ),
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(c.code, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
                                        Text(c.name, style: TextStyle(color: Colors.white.withValues(alpha: 0.9), fontSize: 13), maxLines: 2, overflow: TextOverflow.ellipsis),
                                        Text(c.schedule, style: TextStyle(color: Colors.white.withValues(alpha: 0.7), fontSize: 11)),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                  ),
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 16),
                          const Text('Upcoming Deadlines', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 12),
                          if (_upcomingEvents.isEmpty)
                            const Text('No upcoming deadlines!', style: TextStyle(color: Colors.grey)),
                          ..._upcomingEvents.map((e) {
                            final typeColors = {
                              'homework': Colors.blue,
                              'quiz': Colors.orange,
                              'exam': Colors.red,
                              'project': Colors.purple,
                              'other': Colors.grey,
                            };
                            return Container(
                              margin: const EdgeInsets.only(bottom: 8),
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: AppTheme.cardDark,
                                borderRadius: BorderRadius.circular(12),
                                border: Border(
                                  left: BorderSide(
                                    color: typeColors[e.type.name] ?? Colors.grey,
                                    width: 3,
                                  ),
                                ),
                              ),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(e.title, style: const TextStyle(fontWeight: FontWeight.w600)),
                                        const SizedBox(height: 2),
                                        Text(
                                          _allCourses.where((c) => c.id == e.courseId).firstOrNull?.code ?? e.courseId,
                                          style: TextStyle(color: Colors.grey[400], fontSize: 12),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      Text(
                                        '${e.date.month}/${e.date.day}',
                                        style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: (typeColors[e.type.name] ?? Colors.grey).withValues(alpha: 0.2),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: Text(
                                          e.type.name.toUpperCase(),
                                          style: TextStyle(color: typeColors[e.type.name] ?? Colors.grey, fontSize: 10, fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            );
                          }),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _StatCard({required this.icon, required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withValues(alpha: 0.3)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 8),
            Text(value, style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: color)),
            Text(label, style: TextStyle(color: Colors.grey[400], fontSize: 12)),
          ],
        ),
      ),
    );
  }
}

String _yearLabel(int year) {
  const labels = ['Freshman', 'Sophomore', 'Junior', 'Senior'];
  if (year >= 1 && year <= labels.length) return labels[year - 1];
  return 'Year $year';
}
