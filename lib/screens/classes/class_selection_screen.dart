import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/course.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';

class ClassSelectionScreen extends StatefulWidget {
  const ClassSelectionScreen({super.key});

  @override
  State<ClassSelectionScreen> createState() => _ClassSelectionScreenState();
}

class _ClassSelectionScreenState extends State<ClassSelectionScreen> {
  List<Course> _allCourses = [];
  Set<String> _enrolledIds = {};
  String _searchQuery = '';
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadCourses();
  }

  Future<void> _loadCourses() async {
    try {
      final courses = await ApiService.getCourses();
      if (!mounted) return;
      setState(() {
        _allCourses = courses;
        _enrolledIds = Set.from(AuthService.currentUser?.enrolledCourseIds ?? []);
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
    }
  }

  Future<void> _toggleEnroll(Course course) async {
    final enrolled = _enrolledIds.contains(course.id);
    setState(() {
      if (enrolled) {
        _enrolledIds.remove(course.id);
      } else {
        _enrolledIds.add(course.id);
      }
    });
    try {
      if (enrolled) {
        await ApiService.unenrollCourse(course.id);
      } else {
        await ApiService.enrollCourse(course.id);
      }
    } catch (e) {
      // Revert on error
      if (!mounted) return;
      setState(() {
        if (enrolled) {
          _enrolledIds.add(course.id);
        } else {
          _enrolledIds.remove(course.id);
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final filteredCourses = _allCourses.where((c) {
      final q = _searchQuery.toLowerCase();
      return c.code.toLowerCase().contains(q) || c.name.toLowerCase().contains(q) || c.instructor.toLowerCase().contains(q);
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Classes'),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.gmuGreen))
          : Column(
        children: [
          // Search
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              onChanged: (v) => setState(() => _searchQuery = v),
              decoration: InputDecoration(
                hintText: 'Search courses...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),

          // Enrolled Section
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                const Text('Enrolled', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppTheme.gmuGreen.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text('${_enrolledIds.length}', style: const TextStyle(color: AppTheme.gmuGreen, fontWeight: FontWeight.bold, fontSize: 12)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),

          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: filteredCourses.length,
              itemBuilder: (context, i) {
                final c = filteredCourses[i];
                final enrolled = _enrolledIds.contains(c.id);
                return _CourseCard(
                  course: c,
                  enrolled: enrolled,
                  onTap: () {
                    if (enrolled) {
                      Navigator.pushNamed(context, '/class', arguments: c);
                    }
                  },
                  onToggle: () => _toggleEnroll(c),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _CourseCard extends StatelessWidget {
  final Course course;
  final bool enrolled;
  final VoidCallback onTap;
  final VoidCallback onToggle;

  const _CourseCard({
    required this.course,
    required this.enrolled,
    required this.onTap,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: enrolled ? AppTheme.gmuGreen.withValues(alpha: 0.2) : AppTheme.dividerDark,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Text(
                    course.code.split(' ').last,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: enrolled ? AppTheme.gmuGreen : Colors.grey,
                      fontSize: 16,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(course.code, style: TextStyle(fontWeight: FontWeight.bold, color: enrolled ? AppTheme.gmuGold : Colors.white)),
                    Text(course.name, style: const TextStyle(fontSize: 13)),
                    const SizedBox(height: 4),
                    Text('${course.instructor} • ${course.schedule}', style: TextStyle(color: Colors.grey[500], fontSize: 11)),
                  ],
                ),
              ),
              IconButton(
                onPressed: onToggle,
                icon: Icon(
                  enrolled ? Icons.check_circle : Icons.add_circle_outline,
                  color: enrolled ? AppTheme.gmuGreen : Colors.grey,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
