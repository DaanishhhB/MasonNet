import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/course.dart';
import '../../models/document.dart';
import '../../services/api_service.dart';

class DocumentsScreen extends StatefulWidget {
  final Course course;
  final bool isPrevious;

  const DocumentsScreen({super.key, required this.course, required this.isPrevious});

  @override
  State<DocumentsScreen> createState() => _DocumentsScreenState();
}

class _DocumentsScreenState extends State<DocumentsScreen> {
  List<CourseDocument> _docs = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadDocs();
  }

  Future<void> _loadDocs() async {
    try {
      final docs = await ApiService.getCourseDocuments(widget.course.id, previous: widget.isPrevious);
      if (!mounted) return;
      setState(() {
        _docs = docs;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    Map<String, List<CourseDocument>> grouped = {};
    if (widget.isPrevious) {
      for (final d in _docs) {
        grouped.putIfAbsent(d.semester, () => []).add(d);
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.course.code, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            Text(widget.isPrevious ? 'Previous Semester' : 'Documents', style: TextStyle(fontSize: 12, color: Colors.grey[400])),
          ],
        ),
      ),
      floatingActionButton: widget.isPrevious
          ? null
          : FloatingActionButton.extended(
              onPressed: () => _showUploadDialog(context),
              icon: const Icon(Icons.upload_file),
              label: const Text('Upload'),
            ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.gmuGreen))
          : _docs.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.folder_open, size: 64, color: Colors.grey[600]),
                  const SizedBox(height: 12),
                  Text('No documents yet', style: TextStyle(color: Colors.grey[500], fontSize: 16)),
                ],
              ),
            )
          : widget.isPrevious
              ? ListView(
                  padding: const EdgeInsets.all(16),
                  children: grouped.entries.map((entry) {
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.only(bottom: 8, top: 8),
                          child: Row(
                            children: [
                              const Icon(Icons.history, size: 18, color: AppTheme.gmuGold),
                              const SizedBox(width: 8),
                              Text(entry.key, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.gmuGold)),
                            ],
                          ),
                        ),
                        ...entry.value.map((d) => _DocCard(doc: d)),
                      ],
                    );
                  }).toList(),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _docs.length,
                  itemBuilder: (context, i) => _DocCard(doc: _docs[i]),
                ),
    );
  }

  void _showUploadDialog(BuildContext context) {
    final titleC = TextEditingController();
    final descC = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.cardDark,
        title: const Text('Upload Document'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: double.infinity,
                height: 100,
                decoration: BoxDecoration(
                  border: Border.all(color: AppTheme.dividerDark, width: 2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.cloud_upload_outlined, size: 36, color: Colors.grey[400]),
                    const SizedBox(height: 8),
                    Text('Tap to select file', style: TextStyle(color: Colors.grey[400])),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              TextField(controller: titleC, decoration: const InputDecoration(labelText: 'Title')),
              const SizedBox(height: 12),
              TextField(controller: descC, decoration: const InputDecoration(labelText: 'Description'), maxLines: 3),
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
                final doc = await ApiService.uploadDocument(
                  courseId: widget.course.id,
                  title: titleC.text.trim(),
                  description: descC.text.trim(),
                );
                if (mounted) {
                  setState(() => _docs.add(doc));
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Document uploaded!'), backgroundColor: AppTheme.gmuGreen),
                  );
                }
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Failed to upload'), backgroundColor: Colors.red),
                  );
                }
              }
            },
            child: const Text('Upload'),
          ),
        ],
      ),
    );
  }
}

class _DocCard extends StatelessWidget {
  final CourseDocument doc;
  const _DocCard({required this.doc});

  IconData get _fileIcon {
    switch (doc.fileType.toUpperCase()) {
      case 'PDF': return Icons.picture_as_pdf;
      case 'ZIP': return Icons.folder_zip;
      case 'PNG':
      case 'JPG': return Icons.image;
      case 'TXT': return Icons.text_snippet;
      default: return Icons.insert_drive_file;
    }
  }

  Color get _fileColor {
    switch (doc.fileType.toUpperCase()) {
      case 'PDF': return Colors.red;
      case 'ZIP': return Colors.amber;
      case 'PNG':
      case 'JPG': return Colors.blue;
      case 'TXT': return Colors.green;
      default: return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: _fileColor.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(_fileIcon, color: _fileColor),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(doc.title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  const SizedBox(height: 2),
                  Text(doc.description, style: TextStyle(color: Colors.grey[400], fontSize: 12), maxLines: 2, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Text('${doc.fileType} • ${doc.fileSize}', style: TextStyle(color: Colors.grey[600], fontSize: 11)),
                      const SizedBox(width: 8),
                      Icon(Icons.person_outline, size: 12, color: Colors.grey[600]),
                      Text(' ${doc.uploaderName}', style: TextStyle(color: Colors.grey[600], fontSize: 11)),
                      const Spacer(),
                      Icon(Icons.download, size: 12, color: Colors.grey[600]),
                      Text(' ${doc.downloads}', style: TextStyle(color: Colors.grey[600], fontSize: 11)),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
