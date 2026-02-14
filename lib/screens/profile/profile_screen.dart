import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/course.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  List<Course> _enrolled = [];
  int _studyGroupCount = 0;
  int _postCount = 0;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final user = AuthService.currentUser;
      if (user == null) return;

      final courses = await ApiService.getCourses();
      final enrolled = courses.where((c) => user.enrolledCourseIds.contains(c.id)).toList();
      final sessions = await ApiService.getMyStudySessions();
      final posts = await ApiService.getUserPosts(user.id);

      if (!mounted) return;
      setState(() {
        _enrolled = enrolled;
        _studyGroupCount = sessions.length;
        _postCount = posts.length;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
    }
  }

  void _editProfile() {
    final user = AuthService.currentUser;
    if (user == null) return;
    final nameC = TextEditingController(text: user.name);
    final bioC = TextEditingController(text: user.bio);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.cardDark,
        title: const Text('Edit Profile'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: nameC, decoration: const InputDecoration(labelText: 'Name')),
              const SizedBox(height: 12),
              TextField(controller: bioC, decoration: const InputDecoration(labelText: 'Bio'), maxLines: 3),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(ctx);
              final err = await AuthService.updateProfile(
                name: nameC.text.trim(),
                bio: bioC.text.trim(),
              );
              if (!mounted) return;
              if (err == null) {
                setState(() {});
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Profile updated!'), backgroundColor: AppTheme.gmuGreen),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(err), backgroundColor: Colors.red),
                );
              }
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = AuthService.currentUser;
    if (user == null) return const SizedBox();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(icon: const Icon(Icons.settings_outlined), onPressed: () {}),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.gmuGreen))
          : SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            CircleAvatar(
              radius: 48,
              backgroundColor: AppTheme.gmuGreen,
              child: Text(user.avatarUrl, style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(height: 12),
            Text(user.name, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            Text(user.email, style: TextStyle(color: Colors.grey[400], fontSize: 13)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: AppTheme.gmuGreen.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Text(
                '${user.major} \u2022 ${_yearLabel(user.year)}',
                style: const TextStyle(color: AppTheme.gmuGreen, fontSize: 13),
              ),
            ),
            const SizedBox(height: 8),
            if (user.bio.isNotEmpty)
              Text(user.bio, style: TextStyle(color: Colors.grey[300], fontSize: 14), textAlign: TextAlign.center),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _ProfileStat(value: '${_enrolled.length}', label: 'Classes'),
                _ProfileStat(value: '$_studyGroupCount', label: 'Study Groups'),
                _ProfileStat(value: '$_postCount', label: 'Posts'),
              ],
            ),
            const SizedBox(height: 24),
            _SectionHeader(title: 'Enrolled Classes'),
            ..._enrolled.map((c) => Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: ListTile(
                onTap: () => Navigator.pushNamed(context, '/class', arguments: c),
                leading: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: AppTheme.gmuGreen.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Center(child: Text(c.code.split(' ').last, style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.gmuGreen, fontSize: 13))),
                ),
                title: Text(c.code, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                subtitle: Text(c.name, style: TextStyle(color: Colors.grey[500], fontSize: 12)),
                trailing: const Icon(Icons.chevron_right, color: Colors.grey),
              ),
            )),
            const SizedBox(height: 16),
            _SectionHeader(title: 'Settings'),
            _MenuItem(icon: Icons.edit, title: 'Edit Profile', onTap: _editProfile),
            _MenuItem(icon: Icons.notifications_outlined, title: 'Notifications', onTap: () {}),
            _MenuItem(icon: Icons.color_lens_outlined, title: 'Appearance', onTap: () {}),
            _MenuItem(icon: Icons.privacy_tip_outlined, title: 'Privacy', onTap: () {}),
            _MenuItem(icon: Icons.help_outline, title: 'Help & Support', onTap: () {}),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () async {
                  await AuthService.logout();
                  if (!mounted) return;
                  Navigator.pushReplacementNamed(context, '/login');
                },
                icon: const Icon(Icons.logout, color: Colors.red),
                label: const Text('Sign Out', style: TextStyle(color: Colors.red)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.red),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}

class _ProfileStat extends StatelessWidget {
  final String value;
  final String label;
  const _ProfileStat({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.gmuGold)),
        Text(label, style: TextStyle(color: Colors.grey[500], fontSize: 12)),
      ],
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
      ),
    );
  }
}

class _MenuItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;
  const _MenuItem({required this.icon, required this.title, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 4),
      child: ListTile(
        onTap: onTap,
        leading: Icon(icon, color: Colors.grey),
        title: Text(title, style: const TextStyle(fontSize: 14)),
        trailing: const Icon(Icons.chevron_right, color: Colors.grey, size: 20),
      ),
    );
  }
}

String _yearLabel(int year) {
  const labels = ['Freshman', 'Sophomore', 'Junior', 'Senior'];
  if (year >= 1 && year <= labels.length) return labels[year - 1];
  return 'Year $year';
}
