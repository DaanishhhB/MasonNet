import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:path_provider/path_provider.dart';
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
                        ...entry.value.map((d) => _DocCard(doc: d, onTap: () => _viewDocument(d))),
                      ],
                    );
                  }).toList(),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _docs.length,
                  itemBuilder: (context, i) => _DocCard(doc: _docs[i], onTap: () => _viewDocument(_docs[i])),
                ),
    );
  }

  Future<void> _viewDocument(CourseDocument doc) async {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const Center(child: CircularProgressIndicator(color: AppTheme.gmuGreen)),
    );

    try {
      final data = await ApiService.downloadDocument(doc.id);
      if (!mounted) return;
      Navigator.pop(context); // dismiss loading

      final fileData = data['fileData'] as String?;
      final mimeType = data['mimeType'] as String? ?? 'application/octet-stream';

      if (fileData == null || fileData.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No file data available for this document'), backgroundColor: Colors.orange),
        );
        return;
      }

      final bytes = base64Decode(fileData);

      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => _DocumentViewerScreen(
            title: doc.title,
            fileType: doc.fileType,
            mimeType: mimeType,
            bytes: bytes,
          ),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      Navigator.pop(context); // dismiss loading
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load document: $e'), backgroundColor: Colors.red),
      );
    }
  }

  void _showUploadDialog(BuildContext context) {
    final titleC = TextEditingController();
    final descC = TextEditingController();
    String? pickedFileName;
    String? pickedFileData; // base64
    String? pickedMimeType;
    String? pickedFileSize;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          backgroundColor: AppTheme.cardDark,
          title: const Text('Upload Document'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                GestureDetector(
                  onTap: () async {
                    final result = await FilePicker.platform.pickFiles(withData: true);
                    if (result == null || result.files.isEmpty) return;
                    final file = result.files.first;
                    if (file.bytes == null) return;
                    final b64 = base64Encode(file.bytes!);
                    final ext = (file.extension ?? '').toLowerCase();
                    String mime;
                    switch (ext) {
                      case 'pdf': mime = 'application/pdf'; break;
                      case 'doc': case 'docx': mime = 'application/msword'; break;
                      case 'png': mime = 'image/png'; break;
                      case 'jpg': case 'jpeg': mime = 'image/jpeg'; break;
                      case 'gif': mime = 'image/gif'; break;
                      case 'txt': mime = 'text/plain'; break;
                      case 'zip': mime = 'application/zip'; break;
                      default: mime = 'application/octet-stream';
                    }
                    final sizeBytes = file.size;
                    String sizeStr;
                    if (sizeBytes < 1024) {
                      sizeStr = '${sizeBytes}B';
                    } else if (sizeBytes < 1024 * 1024) {
                      sizeStr = '${(sizeBytes / 1024).toStringAsFixed(1)}KB';
                    } else {
                      sizeStr = '${(sizeBytes / (1024 * 1024)).toStringAsFixed(1)}MB';
                    }
                    setDialogState(() {
                      pickedFileName = file.name;
                      pickedFileData = b64;
                      pickedMimeType = mime;
                      pickedFileSize = sizeStr;
                      if (titleC.text.trim().isEmpty) {
                        titleC.text = file.name.split('.').first;
                      }
                    });
                  },
                  child: Container(
                    width: double.infinity,
                    height: 100,
                    decoration: BoxDecoration(
                      border: Border.all(
                        color: pickedFileName != null ? AppTheme.gmuGreen : AppTheme.dividerDark,
                        width: 2,
                      ),
                      borderRadius: BorderRadius.circular(12),
                      color: pickedFileName != null ? AppTheme.gmuGreen.withValues(alpha: 0.05) : null,
                    ),
                    child: pickedFileName != null
                        ? Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.check_circle, size: 28, color: AppTheme.gmuGreen),
                              const SizedBox(height: 6),
                              Text(pickedFileName!, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500), overflow: TextOverflow.ellipsis),
                              Text(pickedFileSize ?? '', style: TextStyle(color: Colors.grey[400], fontSize: 11)),
                            ],
                          )
                        : Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.cloud_upload_outlined, size: 36, color: Colors.grey[400]),
                              const SizedBox(height: 8),
                              Text('Tap to select file', style: TextStyle(color: Colors.grey[400])),
                            ],
                          ),
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
                  final doc = await ApiService.uploadDocumentWithFile(
                    courseId: widget.course.id,
                    title: titleC.text.trim(),
                    description: descC.text.trim(),
                    fileData: pickedFileData ?? '',
                    mimeType: pickedMimeType ?? 'application/octet-stream',
                    fileSize: pickedFileSize ?? '0B',
                    fileType: pickedFileName?.split('.').last.toUpperCase() ?? 'FILE',
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
      ),
    );
  }
}

class _DocCard extends StatelessWidget {
  final CourseDocument doc;
  final VoidCallback? onTap;
  const _DocCard({required this.doc, this.onTap});

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
    return GestureDetector(
      onTap: onTap,
      child: Card(
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
              const SizedBox(width: 8),
              Icon(Icons.chevron_right, color: Colors.grey[600], size: 20),
            ],
          ),
        ),
      ),
    );
  }
}

class _DocumentViewerScreen extends StatelessWidget {
  final String title;
  final String fileType;
  final String mimeType;
  final List<int> bytes;

  const _DocumentViewerScreen({
    required this.title,
    required this.fileType,
    required this.mimeType,
    required this.bytes,
  });

  bool get _isImage =>
      mimeType.startsWith('image/') ||
      ['PNG', 'JPG', 'JPEG', 'GIF', 'BMP', 'WEBP'].contains(fileType.toUpperCase());

  bool get _isText =>
      mimeType.startsWith('text/') || fileType.toUpperCase() == 'TXT';

  Future<void> _saveToDevice(BuildContext context) async {
    try {
      final dir = await getApplicationDocumentsDirectory();
      final ext = fileType.toLowerCase();
      final safeName = title.replaceAll(RegExp(r'[^\w\s-]'), '');
      final file = File('${dir.path}/$safeName.$ext');
      await file.writeAsBytes(bytes);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Saved to ${file.path}'), backgroundColor: AppTheme.gmuGreen),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to save: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontSize: 16)),
        actions: [
          IconButton(
            icon: const Icon(Icons.download),
            tooltip: 'Save to device',
            onPressed: () => _saveToDevice(context),
          ),
        ],
      ),
      body: _buildBody(context),
    );
  }

  Widget _buildBody(BuildContext context) {
    if (_isImage) {
      return InteractiveViewer(
        minScale: 0.5,
        maxScale: 4.0,
        child: Center(
          child: Image.memory(
            Uint8List.fromList(bytes),
            fit: BoxFit.contain,
          ),
        ),
      );
    }

    if (_isText) {
      final text = utf8.decode(bytes, allowMalformed: true);
      return SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: SelectableText(
          text,
          style: const TextStyle(fontSize: 14, height: 1.5, fontFamily: 'monospace'),
        ),
      );
    }

    // For PDF and other file types, show info + download option
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              _getIcon(),
              size: 80,
              color: AppTheme.gmuGreen,
            ),
            const SizedBox(height: 24),
            Text(
              title,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              '${fileType.toUpperCase()} document',
              style: TextStyle(color: Colors.grey[400], fontSize: 14),
            ),
            const SizedBox(height: 8),
            Text(
              _formatSize(bytes.length),
              style: TextStyle(color: Colors.grey[500], fontSize: 13),
            ),
            const SizedBox(height: 32),
            ElevatedButton.icon(
              onPressed: () => _saveToDevice(context),
              icon: const Icon(Icons.download),
              label: const Text('Save to Device'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.gmuGreen,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  IconData _getIcon() {
    switch (fileType.toUpperCase()) {
      case 'PDF': return Icons.picture_as_pdf;
      case 'ZIP': return Icons.folder_zip;
      case 'DOC':
      case 'DOCX': return Icons.description;
      default: return Icons.insert_drive_file;
    }
  }

  String _formatSize(int bytes) {
    if (bytes < 1024) return '$bytes B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)} KB';
    return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
  }
}
