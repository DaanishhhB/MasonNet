import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/post.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';
import '../../services/socket_service.dart';

class GlobalFeedScreen extends StatefulWidget {
  const GlobalFeedScreen({super.key});

  @override
  State<GlobalFeedScreen> createState() => _GlobalFeedScreenState();
}

class _GlobalFeedScreenState extends State<GlobalFeedScreen> {
  List<FeedPost> _posts = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadPosts();
    SocketService.onNewPost(_onNewPost);
    SocketService.onPostUpdated(_onPostUpdated);
  }

  @override
  void dispose() {
    SocketService.offNewPost(_onNewPost);
    SocketService.offPostUpdated(_onPostUpdated);
    super.dispose();
  }

  void _onNewPost(dynamic data) {
    final uid = AuthService.currentUser?.id;
    final post = FeedPost.fromJson(Map<String, dynamic>.from(data), currentUserId: uid);
    // Don't duplicate if we already have this post (e.g. from our own creation)
    if (mounted && !_posts.any((p) => p.id == post.id)) {
      setState(() => _posts.insert(0, post));
    }
  }

  void _onPostUpdated(dynamic data) {
    final uid = AuthService.currentUser?.id;
    final updated = FeedPost.fromJson(Map<String, dynamic>.from(data), currentUserId: uid);
    if (mounted) {
      final idx = _posts.indexWhere((p) => p.id == updated.id);
      if (idx != -1) {
        setState(() => _posts[idx] = updated);
      }
    }
  }

  Future<void> _loadPosts() async {
    try {
      final posts = await ApiService.getPosts();
      if (!mounted) return;
      setState(() {
        _posts = posts;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
    }
  }

  void _createPost() {
    final user = AuthService.currentUser;
    if (user == null) return;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.cardDark,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        final controller = TextEditingController();
        return Padding(
          padding: EdgeInsets.only(
            left: 16, right: 16, top: 16,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 16,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    backgroundColor: AppTheme.gmuGreen,
                    child: Text(user.avatarUrl, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(width: 12),
                  Text(user.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                ],
              ),
              const SizedBox(height: 12),
              TextField(
                controller: controller,
                maxLines: 4,
                autofocus: true,
                decoration: const InputDecoration(
                  hintText: "What's happening at Mason?",
                  border: InputBorder.none,
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  IconButton(icon: const Icon(Icons.image_outlined, color: Colors.grey), onPressed: () {}),
                  IconButton(icon: const Icon(Icons.poll_outlined, color: Colors.grey), onPressed: () {}),
                  const Spacer(),
                  ElevatedButton(
                    onPressed: () async {
                      if (controller.text.trim().isNotEmpty) {
                        Navigator.pop(ctx);
                        try {
                          final post = await ApiService.createPost(controller.text.trim());
                          if (mounted) {
                            setState(() => _posts.insert(0, post));
                          }
                        } catch (e) {
                          // Ignore errors
                        }
                      }
                    },
                    child: const Text('Post'),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mason Feed', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(icon: const Icon(Icons.search), onPressed: () {}),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _createPost,
        child: const Icon(Icons.edit),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.gmuGreen))
          : RefreshIndicator(
        color: AppTheme.gmuGreen,
        onRefresh: _loadPosts,
        child: ListView.separated(
          itemCount: _posts.length,
          separatorBuilder: (_, __) => const Divider(height: 1, color: AppTheme.dividerDark),
          itemBuilder: (context, i) => _PostCard(
            post: _posts[i],
            onLike: () async {
              try {
                final updated = await ApiService.toggleLike(_posts[i].id);
                if (mounted) setState(() => _posts[i] = updated);
              } catch (e) {
                // Ignore errors
              }
            },
          ),
        ),
      ),
    );
  }
}

class _PostCard extends StatelessWidget {
  final FeedPost post;
  final VoidCallback onLike;

  const _PostCard({required this.post, required this.onLike});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            radius: 22,
            backgroundColor: AppTheme.gmuGreen,
            child: Text(post.authorAvatar, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(post.authorName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    const SizedBox(width: 6),
                    Text('• ${post.authorMajor}', style: TextStyle(color: Colors.grey[500], fontSize: 12)),
                  ],
                ),
                Text(_formatTimestamp(post.timestamp), style: TextStyle(color: Colors.grey[600], fontSize: 11)),
                const SizedBox(height: 8),
                Text(post.content, style: const TextStyle(fontSize: 14, height: 1.4)),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _ActionButton(
                      icon: post.isLiked ? Icons.favorite : Icons.favorite_border,
                      label: '${post.likes}',
                      color: post.isLiked ? Colors.red : Colors.grey,
                      onTap: onLike,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatTimestamp(DateTime dt) {
    final now = DateTime.now();
    final diff = now.difference(dt);
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    return '${diff.inDays}d ago';
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ActionButton({required this.icon, required this.label, required this.color, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Row(
        children: [
          Icon(icon, size: 18, color: color),
          if (label.isNotEmpty) ...[
            const SizedBox(width: 4),
            Text(label, style: TextStyle(color: color, fontSize: 12)),
          ],
        ],
      ),
    );
  }
}
