import '../models/user.dart';
import '../models/course.dart';
import '../models/message.dart';
import '../models/calendar_event.dart';
import '../models/study_session.dart';
import '../models/document.dart';
import '../models/post.dart';

class MockData {
  // ─── Current User ───
  static const AppUser currentUser = AppUser(
    id: 'u1',
    name: 'Alex Rivera',
    email: 'arivera5@gmu.edu',
    major: 'Computer Science',
    year: 3,
    avatarUrl: 'AR',
    bio: 'CS Junior @ GMU | Love building apps & playing basketball 🏀',
    enrolledCourseIds: ['cs310', 'cs330', 'cs367', 'math214'],
  );

  // ─── Users ───
  static const List<AppUser> users = [
    currentUser,
    AppUser(id: 'u2', name: 'Priya Patel', email: 'ppatel12@gmu.edu', major: 'Computer Science', year: 3, avatarUrl: 'PP', bio: 'CS Major | Coffee addict ☕', enrolledCourseIds: ['cs310', 'cs330', 'cs367']),
    AppUser(id: 'u3', name: 'Jordan Kim', email: 'jkim45@gmu.edu', major: 'Information Technology', year: 2, avatarUrl: 'JK', bio: 'IT Sophomore | Gamer 🎮', enrolledCourseIds: ['cs310', 'math214']),
    AppUser(id: 'u4', name: 'Sarah Johnson', email: 'sjohns23@gmu.edu', major: 'Software Engineering', year: 4, avatarUrl: 'SJ', bio: 'SWE Senior | Interned at Google 🚀', enrolledCourseIds: ['cs310', 'cs330']),
    AppUser(id: 'u5', name: 'Marcus Thompson', email: 'mthomps8@gmu.edu', major: 'Computer Science', year: 3, avatarUrl: 'MT', bio: 'CS Junior | Cybersecurity Club President', enrolledCourseIds: ['cs330', 'cs367', 'math214']),
    AppUser(id: 'u6', name: 'Emily Chen', email: 'echen7@gmu.edu', major: 'Data Science', year: 2, avatarUrl: 'EC', bio: 'Data Science | Love ML & stats 📊', enrolledCourseIds: ['cs310', 'math214']),
    AppUser(id: 'u7', name: 'David Nguyen', email: 'dnguyen3@gmu.edu', major: 'Computer Science', year: 4, avatarUrl: 'DN', bio: 'Senior CS | Open source contributor', enrolledCourseIds: ['cs367', 'cs330']),
    AppUser(id: 'u8', name: 'Aisha Mohammed', email: 'amohamm2@gmu.edu', major: 'Computer Science', year: 3, avatarUrl: 'AM', bio: 'CS Junior | Women in Tech 💪', enrolledCourseIds: ['cs310', 'cs367', 'math214']),
    AppUser(id: 'u9', name: 'Tyler Brooks', email: 'tbrooks6@gmu.edu', major: 'Information Technology', year: 2, avatarUrl: 'TB', bio: 'IT Soph | Basketball team 🏀', enrolledCourseIds: ['cs310', 'math214']),
    AppUser(id: 'u10', name: 'Lisa Wang', email: 'lwang14@gmu.edu', major: 'Computer Science', year: 3, avatarUrl: 'LW', bio: 'CS | ACM Competition Team', enrolledCourseIds: ['cs310', 'cs330', 'math214']),
    AppUser(id: 'u11', name: 'Chris Martinez', email: 'cmarti9@gmu.edu', major: 'Software Engineering', year: 4, avatarUrl: 'CM', bio: 'SWE Senior | Startup founder', enrolledCourseIds: ['cs330', 'cs367']),
    AppUser(id: 'u12', name: 'Rachel Green', email: 'rgreen4@gmu.edu', major: 'Computer Science', year: 2, avatarUrl: 'RG', bio: 'CS Sophomore | Learning every day', enrolledCourseIds: ['cs310', 'math214']),
  ];

  // ─── Courses ───
  static const List<Course> allCourses = [
    Course(
      id: 'cs310',
      code: 'CS 310',
      name: 'Data Structures',
      instructor: 'Dr. Katherine Raven',
      schedule: 'MWF 10:30 AM - 11:20 AM',
      location: 'Innovation Hall 136',
      credits: 3,
      description: 'Study of fundamental data structures including lists, stacks, queues, trees, graphs, and hash tables.',
      enrolledStudentIds: ['u1', 'u2', 'u3', 'u4', 'u6', 'u8', 'u9', 'u10', 'u12'],
      channels: [
        Channel(id: 'cs310_general', name: 'General', icon: '💬'),
        Channel(id: 'cs310_homework', name: 'Homework', icon: '📝'),
        Channel(id: 'cs310_projects', name: 'Projects', icon: '🛠️'),
        Channel(id: 'cs310_exams', name: 'Exam Prep', icon: '📚'),
      ],
    ),
    Course(
      id: 'cs330',
      code: 'CS 330',
      name: 'Formal Methods & Models',
      instructor: 'Dr. James Mitchell',
      schedule: 'TR 1:30 PM - 2:45 PM',
      location: 'Engineering Building 1101',
      credits: 3,
      description: 'Introduction to formal methods including logic, automata theory, and formal languages.',
      enrolledStudentIds: ['u1', 'u2', 'u4', 'u5', 'u7', 'u10', 'u11'],
      channels: [
        Channel(id: 'cs330_general', name: 'General', icon: '💬'),
        Channel(id: 'cs330_homework', name: 'Homework', icon: '📝'),
        Channel(id: 'cs330_study', name: 'Study Group', icon: '🤓'),
      ],
    ),
    Course(
      id: 'cs367',
      code: 'CS 367',
      name: 'Computer Systems & Programming',
      instructor: 'Dr. Michael Torres',
      schedule: 'MWF 1:30 PM - 2:20 PM',
      location: 'Nguyen Engineering 1103',
      credits: 3,
      description: 'Introduction to low-level programming in C, memory management, and systems programming.',
      enrolledStudentIds: ['u1', 'u2', 'u5', 'u7', 'u8', 'u11'],
      channels: [
        Channel(id: 'cs367_general', name: 'General', icon: '💬'),
        Channel(id: 'cs367_homework', name: 'Homework', icon: '📝'),
        Channel(id: 'cs367_labs', name: 'Labs', icon: '🔬'),
        Channel(id: 'cs367_memes', name: 'C Memes', icon: '😂'),
      ],
    ),
    Course(
      id: 'math214',
      code: 'MATH 214',
      name: 'Linear Algebra',
      instructor: 'Dr. Anne Fischer',
      schedule: 'TR 10:30 AM - 11:45 AM',
      location: 'Exploratory Hall 4106',
      credits: 3,
      description: 'Systems of linear equations, matrices, vector spaces, linear transformations, eigenvalues.',
      enrolledStudentIds: ['u1', 'u3', 'u5', 'u6', 'u8', 'u9', 'u10', 'u12'],
      channels: [
        Channel(id: 'math214_general', name: 'General', icon: '💬'),
        Channel(id: 'math214_homework', name: 'Homework', icon: '📝'),
        Channel(id: 'math214_help', name: 'Help Desk', icon: '🆘'),
      ],
    ),
    Course(
      id: 'cs262',
      code: 'CS 262',
      name: 'Intro to Low-Level Programming',
      instructor: 'Dr. Paul Henderson',
      schedule: 'MWF 9:00 AM - 9:50 AM',
      location: 'Innovation Hall 204',
      credits: 3,
      description: 'Introduction to C programming and Unix/Linux environment.',
      enrolledStudentIds: [],
      channels: [
        Channel(id: 'cs262_general', name: 'General', icon: '💬'),
        Channel(id: 'cs262_homework', name: 'Homework', icon: '📝'),
      ],
    ),
    Course(
      id: 'cs471',
      code: 'CS 471',
      name: 'Operating Systems',
      instructor: 'Dr. Sandra Lee',
      schedule: 'TR 3:00 PM - 4:15 PM',
      location: 'Engineering Building 4457',
      credits: 3,
      description: 'Process management, memory management, file systems, and I/O systems.',
      enrolledStudentIds: [],
      channels: [
        Channel(id: 'cs471_general', name: 'General', icon: '💬'),
        Channel(id: 'cs471_homework', name: 'Homework', icon: '📝'),
      ],
    ),
    Course(
      id: 'cs483',
      code: 'CS 483',
      name: 'Analysis of Algorithms',
      instructor: 'Dr. Robert Chang',
      schedule: 'MWF 11:30 AM - 12:20 PM',
      location: 'Nguyen Engineering 1110',
      credits: 3,
      description: 'Techniques for design and analysis of algorithms: sorting, searching, graph algorithms.',
      enrolledStudentIds: [],
      channels: [
        Channel(id: 'cs483_general', name: 'General', icon: '💬'),
        Channel(id: 'cs483_homework', name: 'Homework', icon: '📝'),
      ],
    ),
    Course(
      id: 'swe432',
      code: 'SWE 432',
      name: 'Design of Software Systems',
      instructor: 'Dr. Linda Park',
      schedule: 'TR 12:00 PM - 1:15 PM',
      location: 'Innovation Hall 325',
      credits: 3,
      description: 'Design principles for web-based software including REST, MVC, and modern frameworks.',
      enrolledStudentIds: [],
      channels: [
        Channel(id: 'swe432_general', name: 'General', icon: '💬'),
        Channel(id: 'swe432_homework', name: 'Homework', icon: '📝'),
      ],
    ),
  ];

  // ─── Messages by Channel ───
  static Map<String, List<Message>> get channelMessages => {
    // CS 310 - General
    'cs310_general': [
      Message(id: 'm1', senderId: 'u2', senderName: 'Priya Patel', senderAvatar: 'PP', content: 'Did anyone else find today\'s lecture on AVL trees confusing?', timestamp: DateTime(2026, 2, 11, 9, 15), channelId: 'cs310_general'),
      Message(id: 'm2', senderId: 'u3', senderName: 'Jordan Kim', senderAvatar: 'JK', content: 'Yeah the rotations are tricky. I found a good YouTube video on it though', timestamp: DateTime(2026, 2, 11, 9, 18), channelId: 'cs310_general'),
      Message(id: 'm3', senderId: 'u1', senderName: 'Alex Rivera', senderAvatar: 'AR', content: 'Share the link! I need help with that too', timestamp: DateTime(2026, 2, 11, 9, 20), channelId: 'cs310_general'),
      Message(id: 'm4', senderId: 'u3', senderName: 'Jordan Kim', senderAvatar: 'JK', content: 'Just draw it out step by step. Left rotation, right rotation, left-right, right-left. Once you see the pattern it clicks', timestamp: DateTime(2026, 2, 11, 9, 22), channelId: 'cs310_general'),
      Message(id: 'm5', senderId: 'u6', senderName: 'Emily Chen', senderAvatar: 'EC', content: 'Dr. Raven said there will be office hours on Thursday specifically for AVL trees', timestamp: DateTime(2026, 2, 11, 9, 30), channelId: 'cs310_general'),
      Message(id: 'm6', senderId: 'u4', senderName: 'Sarah Johnson', senderAvatar: 'SJ', content: 'Pro tip: visualize using https://www.cs.usfca.edu/~galles/visualization/ it helped me a ton', timestamp: DateTime(2026, 2, 11, 9, 45), channelId: 'cs310_general'),
      Message(id: 'm7', senderId: 'u10', senderName: 'Lisa Wang', senderAvatar: 'LW', content: 'Thanks Sarah! That visualization tool is great', timestamp: DateTime(2026, 2, 11, 10, 0), channelId: 'cs310_general'),
      Message(id: 'm8', senderId: 'u8', senderName: 'Aisha Mohammed', senderAvatar: 'AM', content: 'Is lecture being recorded tomorrow? I have a doctor appointment', timestamp: DateTime(2026, 2, 11, 10, 15), channelId: 'cs310_general'),
      Message(id: 'm9', senderId: 'u12', senderName: 'Rachel Green', senderAvatar: 'RG', content: 'Yes she records all lectures and posts them on Blackboard usually by evening', timestamp: DateTime(2026, 2, 11, 10, 22), channelId: 'cs310_general'),
    ],
    // CS 310 - Homework
    'cs310_homework': [
      Message(id: 'm20', senderId: 'u9', senderName: 'Tyler Brooks', senderAvatar: 'TB', content: 'Has anyone started PA3 yet? The BST implementation is brutal', timestamp: DateTime(2026, 2, 10, 14, 0), channelId: 'cs310_homework'),
      Message(id: 'm21', senderId: 'u2', senderName: 'Priya Patel', senderAvatar: 'PP', content: 'I\'m stuck on the delete method. The case with two children is confusing', timestamp: DateTime(2026, 2, 10, 14, 15), channelId: 'cs310_homework'),
      Message(id: 'm22', senderId: 'u1', senderName: 'Alex Rivera', senderAvatar: 'AR', content: 'Remember you need to find the in-order successor or predecessor. I used successor and it worked', timestamp: DateTime(2026, 2, 10, 14, 30), channelId: 'cs310_homework'),
      Message(id: 'm23', senderId: 'u4', senderName: 'Sarah Johnson', senderAvatar: 'SJ', content: 'Make sure your JUnit tests pass locally before submitting. I lost points last time for edge cases', timestamp: DateTime(2026, 2, 10, 15, 0), channelId: 'cs310_homework'),
      Message(id: 'm24', senderId: 'u6', senderName: 'Emily Chen', senderAvatar: 'EC', content: 'When is it due again? Friday or Sunday?', timestamp: DateTime(2026, 2, 10, 16, 0), channelId: 'cs310_homework'),
      Message(id: 'm25', senderId: 'u10', senderName: 'Lisa Wang', senderAvatar: 'LW', content: 'Friday at 11:59 PM. No extensions per the syllabus', timestamp: DateTime(2026, 2, 10, 16, 10), channelId: 'cs310_homework'),
    ],
    // CS 310 - Projects
    'cs310_projects': [
      Message(id: 'm30', senderId: 'u4', senderName: 'Sarah Johnson', senderAvatar: 'SJ', content: 'The graph project looks intense. Anyone need a study buddy for it?', timestamp: DateTime(2026, 2, 9, 11, 0), channelId: 'cs310_projects'),
      Message(id: 'm31', senderId: 'u1', senderName: 'Alex Rivera', senderAvatar: 'AR', content: 'I\'m down! We could meet at Fenwick Library', timestamp: DateTime(2026, 2, 9, 11, 30), channelId: 'cs310_projects'),
      Message(id: 'm32', senderId: 'u8', senderName: 'Aisha Mohammed', senderAvatar: 'AM', content: 'Count me in. Tuesday afternoon works for me', timestamp: DateTime(2026, 2, 9, 12, 0), channelId: 'cs310_projects'),
    ],
    // CS 310 - Exams
    'cs310_exams': [
      Message(id: 'm40', senderId: 'u10', senderName: 'Lisa Wang', senderAvatar: 'LW', content: 'Midterm is March 5th right? What\'s the format?', timestamp: DateTime(2026, 2, 8, 20, 0), channelId: 'cs310_exams'),
      Message(id: 'm41', senderId: 'u2', senderName: 'Priya Patel', senderAvatar: 'PP', content: 'Dr. Raven said it\'s 40 multiple choice + 3 coding problems', timestamp: DateTime(2026, 2, 8, 20, 15), channelId: 'cs310_exams'),
      Message(id: 'm42', senderId: 'u12', senderName: 'Rachel Green', senderAvatar: 'RG', content: 'Covers everything through heaps right? Not graphs?', timestamp: DateTime(2026, 2, 8, 20, 30), channelId: 'cs310_exams'),
      Message(id: 'm43', senderId: 'u4', senderName: 'Sarah Johnson', senderAvatar: 'SJ', content: 'Correct. Chapters 1-8, everything up to and including heaps/priority queues', timestamp: DateTime(2026, 2, 8, 21, 0), channelId: 'cs310_exams'),
    ],
    // CS 330 - General
    'cs330_general': [
      Message(id: 'm50', senderId: 'u5', senderName: 'Marcus Thompson', senderAvatar: 'MT', content: 'NFAs to DFAs conversion is making my head spin 😵', timestamp: DateTime(2026, 2, 11, 8, 0), channelId: 'cs330_general'),
      Message(id: 'm51', senderId: 'u7', senderName: 'David Nguyen', senderAvatar: 'DN', content: 'Draw the state diagram first, then do the subset construction. Trust the process', timestamp: DateTime(2026, 2, 11, 8, 10), channelId: 'cs330_general'),
      Message(id: 'm52', senderId: 'u11', senderName: 'Chris Martinez', senderAvatar: 'CM', content: 'Mitchell\'s lecture notes are actually really clear on this topic. Check slide deck 7', timestamp: DateTime(2026, 2, 11, 8, 20), channelId: 'cs330_general'),
      Message(id: 'm53', senderId: 'u1', senderName: 'Alex Rivera', senderAvatar: 'AR', content: 'I made Anki flashcards for all the definitions. Happy to share', timestamp: DateTime(2026, 2, 11, 8, 45), channelId: 'cs330_general'),
      Message(id: 'm54', senderId: 'u2', senderName: 'Priya Patel', senderAvatar: 'PP', content: 'Yes please share! That would be so helpful', timestamp: DateTime(2026, 2, 11, 9, 0), channelId: 'cs330_general'),
    ],
    // CS 330 - Homework
    'cs330_homework': [
      Message(id: 'm60', senderId: 'u10', senderName: 'Lisa Wang', senderAvatar: 'LW', content: 'HW5 Problem 3 - is the language regular or context-free?', timestamp: DateTime(2026, 2, 10, 19, 0), channelId: 'cs330_homework'),
      Message(id: 'm61', senderId: 'u7', senderName: 'David Nguyen', senderAvatar: 'DN', content: 'Try pumping lemma. If you can find a contradiction, it\'s not regular', timestamp: DateTime(2026, 2, 10, 19, 15), channelId: 'cs330_homework'),
      Message(id: 'm62', senderId: 'u5', senderName: 'Marcus Thompson', senderAvatar: 'MT', content: 'It\'s context-free. You can build a PDA for it', timestamp: DateTime(2026, 2, 10, 19, 30), channelId: 'cs330_homework'),
    ],
    // CS 330 - Study
    'cs330_study': [
      Message(id: 'm65', senderId: 'u11', senderName: 'Chris Martinez', senderAvatar: 'CM', content: 'Study group at JC tonight at 7? Going over CFGs', timestamp: DateTime(2026, 2, 10, 15, 0), channelId: 'cs330_study'),
      Message(id: 'm66', senderId: 'u1', senderName: 'Alex Rivera', senderAvatar: 'AR', content: 'I\'ll be there! Bringing snacks', timestamp: DateTime(2026, 2, 10, 15, 10), channelId: 'cs330_study'),
      Message(id: 'm67', senderId: 'u4', senderName: 'Sarah Johnson', senderAvatar: 'SJ', content: 'Same! Can we also go over Turing machines?', timestamp: DateTime(2026, 2, 10, 15, 20), channelId: 'cs330_study'),
    ],
    // CS 367 - General
    'cs367_general': [
      Message(id: 'm70', senderId: 'u5', senderName: 'Marcus Thompson', senderAvatar: 'MT', content: 'Seg fault on line 42. Story of my life 💀', timestamp: DateTime(2026, 2, 11, 11, 0), channelId: 'cs367_general'),
      Message(id: 'm71', senderId: 'u7', senderName: 'David Nguyen', senderAvatar: 'DN', content: 'Use valgrind! It\'ll tell you exactly where the memory error is', timestamp: DateTime(2026, 2, 11, 11, 5), channelId: 'cs367_general'),
      Message(id: 'm72', senderId: 'u2', senderName: 'Priya Patel', senderAvatar: 'PP', content: 'GDB is your friend too. Break at the function and step through', timestamp: DateTime(2026, 2, 11, 11, 10), channelId: 'cs367_general'),
      Message(id: 'm73', senderId: 'u8', senderName: 'Aisha Mohammed', senderAvatar: 'AM', content: 'Dr. Torres said we can use the Zeus server for testing. ssh into it', timestamp: DateTime(2026, 2, 11, 11, 30), channelId: 'cs367_general'),
      Message(id: 'm74', senderId: 'u1', senderName: 'Alex Rivera', senderAvatar: 'AR', content: 'Make sure you free your malloc\'d memory or you\'ll lose points for memory leaks', timestamp: DateTime(2026, 2, 11, 11, 45), channelId: 'cs367_general'),
    ],
    // CS 367 - Homework
    'cs367_homework': [
      Message(id: 'm80', senderId: 'u11', senderName: 'Chris Martinez', senderAvatar: 'CM', content: 'Lab 4 - linked list in C. Anyone figured out the insert function?', timestamp: DateTime(2026, 2, 9, 20, 0), channelId: 'cs367_homework'),
      Message(id: 'm81', senderId: 'u8', senderName: 'Aisha Mohammed', senderAvatar: 'AM', content: 'Don\'t forget to handle the empty list case! That got me the first time', timestamp: DateTime(2026, 2, 9, 20, 20), channelId: 'cs367_homework'),
      Message(id: 'm82', senderId: 'u5', senderName: 'Marcus Thompson', senderAvatar: 'MT', content: 'Also check your pointer arithmetic. Off-by-one errors everywhere', timestamp: DateTime(2026, 2, 9, 20, 40), channelId: 'cs367_homework'),
    ],
    // CS 367 - Labs
    'cs367_labs': [
      Message(id: 'm85', senderId: 'u7', senderName: 'David Nguyen', senderAvatar: 'DN', content: 'Which TA is grading labs this week?', timestamp: DateTime(2026, 2, 10, 10, 0), channelId: 'cs367_labs'),
      Message(id: 'm86', senderId: 'u2', senderName: 'Priya Patel', senderAvatar: 'PP', content: 'I think it\'s Kevin. He\'s pretty chill about style points', timestamp: DateTime(2026, 2, 10, 10, 15), channelId: 'cs367_labs'),
    ],
    // CS 367 - Memes
    'cs367_memes': [
      Message(id: 'm90', senderId: 'u5', senderName: 'Marcus Thompson', senderAvatar: 'MT', content: 'C programming: where you spend 5 hours debugging only to find a missing semicolon', timestamp: DateTime(2026, 2, 10, 22, 0), channelId: 'cs367_memes'),
      Message(id: 'm91', senderId: 'u1', senderName: 'Alex Rivera', senderAvatar: 'AR', content: 'Java devs: "What\'s a pointer?" C devs: *cries in segfault*', timestamp: DateTime(2026, 2, 10, 22, 10), channelId: 'cs367_memes'),
      Message(id: 'm92', senderId: 'u11', senderName: 'Chris Martinez', senderAvatar: 'CM', content: 'malloc() at the beginning of the semester: scary. malloc() at the end: still scary.', timestamp: DateTime(2026, 2, 10, 22, 30), channelId: 'cs367_memes'),
      Message(id: 'm93', senderId: 'u7', senderName: 'David Nguyen', senderAvatar: 'DN', content: 'The real horror is when valgrind says "0 errors" but you still get wrong output', timestamp: DateTime(2026, 2, 10, 22, 45), channelId: 'cs367_memes'),
    ],
    // MATH 214 - General
    'math214_general': [
      Message(id: 'm100', senderId: 'u3', senderName: 'Jordan Kim', senderAvatar: 'JK', content: 'Eigenvalues are actually kinda cool once they click', timestamp: DateTime(2026, 2, 11, 12, 0), channelId: 'math214_general'),
      Message(id: 'm101', senderId: 'u6', senderName: 'Emily Chen', senderAvatar: 'EC', content: 'The 3Blue1Brown video on linear transformations changed my life', timestamp: DateTime(2026, 2, 11, 12, 15), channelId: 'math214_general'),
      Message(id: 'm102', senderId: 'u1', senderName: 'Alex Rivera', senderAvatar: 'AR', content: 'Is Dr. Fischer allowing a cheat sheet for the exam?', timestamp: DateTime(2026, 2, 11, 12, 30), channelId: 'math214_general'),
      Message(id: 'm103', senderId: 'u9', senderName: 'Tyler Brooks', senderAvatar: 'TB', content: 'Yes! One page front and back, handwritten only', timestamp: DateTime(2026, 2, 11, 12, 45), channelId: 'math214_general'),
    ],
    // MATH 214 - Homework
    'math214_homework': [
      Message(id: 'm110', senderId: 'u12', senderName: 'Rachel Green', senderAvatar: 'RG', content: 'WebAssign is due tonight and I can\'t figure out #7', timestamp: DateTime(2026, 2, 10, 17, 0), channelId: 'math214_homework'),
      Message(id: 'm111', senderId: 'u5', senderName: 'Marcus Thompson', senderAvatar: 'MT', content: 'Which one is that? The one about basis vectors?', timestamp: DateTime(2026, 2, 10, 17, 10), channelId: 'math214_homework'),
      Message(id: 'm112', senderId: 'u12', senderName: 'Rachel Green', senderAvatar: 'RG', content: 'Yeah, finding a basis for the null space. I keep getting the wrong dimension', timestamp: DateTime(2026, 2, 10, 17, 20), channelId: 'math214_homework'),
      Message(id: 'm113', senderId: 'u6', senderName: 'Emily Chen', senderAvatar: 'EC', content: 'Row reduce to RREF first, then read off the free variables. The number of free variables = dimension of null space', timestamp: DateTime(2026, 2, 10, 17, 30), channelId: 'math214_homework'),
    ],
    // MATH 214 - Help
    'math214_help': [
      Message(id: 'm120', senderId: 'u8', senderName: 'Aisha Mohammed', senderAvatar: 'AM', content: 'Can someone explain the difference between span and subspace?', timestamp: DateTime(2026, 2, 9, 14, 0), channelId: 'math214_help'),
      Message(id: 'm121', senderId: 'u10', senderName: 'Lisa Wang', senderAvatar: 'LW', content: 'Span of a set of vectors is all possible linear combinations. A subspace is a subset of a vector space that is itself a vector space (closed under addition and scalar multiplication)', timestamp: DateTime(2026, 2, 9, 14, 15), channelId: 'math214_help'),
      Message(id: 'm122', senderId: 'u8', senderName: 'Aisha Mohammed', senderAvatar: 'AM', content: 'So the span of vectors IS a subspace?', timestamp: DateTime(2026, 2, 9, 14, 20), channelId: 'math214_help'),
      Message(id: 'm123', senderId: 'u10', senderName: 'Lisa Wang', senderAvatar: 'LW', content: 'Exactly! The span of any set of vectors is always a subspace', timestamp: DateTime(2026, 2, 9, 14, 25), channelId: 'math214_help'),
    ],
  };

  // ─── DM Conversations ───
  static Map<String, List<Message>> get dmMessages => {
    'u2': [
      Message(id: 'dm1', senderId: 'u2', senderName: 'Priya Patel', senderAvatar: 'PP', content: 'Hey! Want to work on the CS 310 project together?', timestamp: DateTime(2026, 2, 10, 15, 0), dmPartnerId: 'u1'),
      Message(id: 'dm2', senderId: 'u1', senderName: 'Alex Rivera', senderAvatar: 'AR', content: 'Yeah for sure! When are you free?', timestamp: DateTime(2026, 2, 10, 15, 5), dmPartnerId: 'u2'),
      Message(id: 'dm3', senderId: 'u2', senderName: 'Priya Patel', senderAvatar: 'PP', content: 'How about tomorrow at 3pm in the JC study rooms?', timestamp: DateTime(2026, 2, 10, 15, 10), dmPartnerId: 'u1'),
      Message(id: 'dm4', senderId: 'u1', senderName: 'Alex Rivera', senderAvatar: 'AR', content: 'Perfect! I\'ll book room 302. See you there 👍', timestamp: DateTime(2026, 2, 10, 15, 12), dmPartnerId: 'u2'),
      Message(id: 'dm5', senderId: 'u2', senderName: 'Priya Patel', senderAvatar: 'PP', content: 'Awesome! I\'ll bring my laptop and some coffee', timestamp: DateTime(2026, 2, 10, 15, 15), dmPartnerId: 'u1'),
    ],
    'u4': [
      Message(id: 'dm10', senderId: 'u4', senderName: 'Sarah Johnson', senderAvatar: 'SJ', content: 'Alex! Did you submit the CS 330 homework?', timestamp: DateTime(2026, 2, 9, 22, 0), dmPartnerId: 'u1'),
      Message(id: 'dm11', senderId: 'u1', senderName: 'Alex Rivera', senderAvatar: 'AR', content: 'Just submitted!! That last problem was rough', timestamp: DateTime(2026, 2, 9, 22, 5), dmPartnerId: 'u4'),
      Message(id: 'dm12', senderId: 'u4', senderName: 'Sarah Johnson', senderAvatar: 'SJ', content: 'Tell me about it. I spent 3 hours on the Turing machine problem', timestamp: DateTime(2026, 2, 9, 22, 10), dmPartnerId: 'u1'),
    ],
    'u5': [
      Message(id: 'dm20', senderId: 'u5', senderName: 'Marcus Thompson', senderAvatar: 'MT', content: 'Yo are you going to the cybersecurity club meeting Friday?', timestamp: DateTime(2026, 2, 11, 8, 0), dmPartnerId: 'u1'),
      Message(id: 'dm21', senderId: 'u1', senderName: 'Alex Rivera', senderAvatar: 'AR', content: 'What time is it? I might have class', timestamp: DateTime(2026, 2, 11, 8, 15), dmPartnerId: 'u5'),
      Message(id: 'dm22', senderId: 'u5', senderName: 'Marcus Thompson', senderAvatar: 'MT', content: '4:30 PM in Innovation Hall 134. We\'re doing a CTF!', timestamp: DateTime(2026, 2, 11, 8, 20), dmPartnerId: 'u1'),
      Message(id: 'dm23', senderId: 'u1', senderName: 'Alex Rivera', senderAvatar: 'AR', content: 'Oh nice! I\'m free by then. Count me in! 🔐', timestamp: DateTime(2026, 2, 11, 8, 25), dmPartnerId: 'u5'),
    ],
    'u3': [
      Message(id: 'dm30', senderId: 'u3', senderName: 'Jordan Kim', senderAvatar: 'JK', content: 'Did you understand the MATH 214 lecture today?', timestamp: DateTime(2026, 2, 11, 13, 0), dmPartnerId: 'u1'),
      Message(id: 'dm31', senderId: 'u1', senderName: 'Alex Rivera', senderAvatar: 'AR', content: 'Kinda... the eigenvalue stuff is new but I think I got the basics', timestamp: DateTime(2026, 2, 11, 13, 5), dmPartnerId: 'u3'),
      Message(id: 'dm32', senderId: 'u3', senderName: 'Jordan Kim', senderAvatar: 'JK', content: 'Want to study together this weekend?', timestamp: DateTime(2026, 2, 11, 13, 10), dmPartnerId: 'u1'),
    ],
  };

  // ─── Calendar Events ───
  static List<CalendarEvent> get calendarEvents => [
    // CS 310
    CalendarEvent(id: 'e1', courseId: 'cs310', title: 'PA3: BST Implementation', description: 'Programming Assignment 3 - Binary Search Tree implementation with all operations', date: DateTime(2026, 2, 13), type: EventType.homework),
    CalendarEvent(id: 'e2', courseId: 'cs310', title: 'Quiz 4: Trees', description: 'Quiz covering binary trees, BST, and AVL trees', date: DateTime(2026, 2, 18), type: EventType.quiz),
    CalendarEvent(id: 'e3', courseId: 'cs310', title: 'Midterm Exam', description: 'Covers chapters 1-8: Lists, Stacks, Queues, Trees, Heaps', date: DateTime(2026, 3, 5), type: EventType.exam),
    CalendarEvent(id: 'e4', courseId: 'cs310', title: 'PA4: Graph Algorithms', description: 'Implement BFS, DFS, and Dijkstra\'s algorithm', date: DateTime(2026, 3, 20), type: EventType.homework),
    CalendarEvent(id: 'e5', courseId: 'cs310', title: 'Final Exam', description: 'Comprehensive final covering all course material', date: DateTime(2026, 5, 8), type: EventType.exam),
    // CS 330
    CalendarEvent(id: 'e10', courseId: 'cs330', title: 'HW5: Pumping Lemma', description: 'Homework on regular languages and pumping lemma proofs', date: DateTime(2026, 2, 14), type: EventType.homework),
    CalendarEvent(id: 'e11', courseId: 'cs330', title: 'HW6: Context-Free Grammars', description: 'CFG design and derivation trees', date: DateTime(2026, 2, 25), type: EventType.homework),
    CalendarEvent(id: 'e12', courseId: 'cs330', title: 'Midterm Exam', description: 'Covers: Logic, regular languages, DFA/NFA, pumping lemma', date: DateTime(2026, 3, 3), type: EventType.exam),
    CalendarEvent(id: 'e13', courseId: 'cs330', title: 'HW7: Turing Machines', description: 'Design Turing machines for given languages', date: DateTime(2026, 3, 25), type: EventType.homework),
    CalendarEvent(id: 'e14', courseId: 'cs330', title: 'Final Exam', description: 'Comprehensive final exam', date: DateTime(2026, 5, 12), type: EventType.exam),
    // CS 367
    CalendarEvent(id: 'e20', courseId: 'cs367', title: 'Lab 4: Linked Lists in C', description: 'Implement singly and doubly linked lists', date: DateTime(2026, 2, 12), type: EventType.homework),
    CalendarEvent(id: 'e21', courseId: 'cs367', title: 'Project 1: Shell', description: 'Build a simple Unix shell in C', date: DateTime(2026, 2, 28), type: EventType.project),
    CalendarEvent(id: 'e22', courseId: 'cs367', title: 'Midterm Exam', description: 'C programming, memory management, pointers', date: DateTime(2026, 3, 10), type: EventType.exam),
    CalendarEvent(id: 'e23', courseId: 'cs367', title: 'Project 2: Memory Allocator', description: 'Implement malloc/free', date: DateTime(2026, 4, 3), type: EventType.project),
    CalendarEvent(id: 'e24', courseId: 'cs367', title: 'Final Exam', description: 'Comprehensive systems programming exam', date: DateTime(2026, 5, 14), type: EventType.exam),
    // MATH 214
    CalendarEvent(id: 'e30', courseId: 'math214', title: 'WebAssign HW6', description: 'Vector spaces and subspaces problems', date: DateTime(2026, 2, 11), type: EventType.homework),
    CalendarEvent(id: 'e31', courseId: 'math214', title: 'Quiz 3: Determinants', description: 'Quiz on determinant computation and properties', date: DateTime(2026, 2, 17), type: EventType.quiz),
    CalendarEvent(id: 'e32', courseId: 'math214', title: 'Midterm Exam', description: 'Covers: Systems of equations, matrices, vector spaces, determinants', date: DateTime(2026, 3, 4), type: EventType.exam),
    CalendarEvent(id: 'e33', courseId: 'math214', title: 'WebAssign HW10', description: 'Eigenvalues and eigenvectors', date: DateTime(2026, 3, 30), type: EventType.homework),
    CalendarEvent(id: 'e34', courseId: 'math214', title: 'Final Exam', description: 'Comprehensive linear algebra final', date: DateTime(2026, 5, 10), type: EventType.exam),
  ];

  // ─── Study Sessions ───
  static List<StudySession> get studySessions => [
    StudySession(
      id: 'ss1', courseId: 'cs310', organizerId: 'u4', organizerName: 'Sarah Johnson',
      title: 'AVL Tree Practice', description: 'Going over AVL tree rotations and practice problems from the textbook',
      location: 'Fenwick Library, Room 2042', dateTime: DateTime(2026, 2, 13, 14, 0), duration: 120,
      attendingIds: ['u1', 'u2', 'u6', 'u10'], notAttendingIds: ['u3'],
    ),
    StudySession(
      id: 'ss2', courseId: 'cs310', organizerId: 'u1', organizerName: 'Alex Rivera',
      title: 'Midterm Review Session', description: 'Full review of all topics from chapters 1-8. Bring practice problems!',
      location: 'Johnson Center, Study Room 302', dateTime: DateTime(2026, 3, 3, 18, 0), duration: 180,
      attendingIds: ['u2', 'u3', 'u4', 'u6', 'u8', 'u9', 'u10', 'u12'], notAttendingIds: [],
    ),
    StudySession(
      id: 'ss3', courseId: 'cs330', organizerId: 'u11', organizerName: 'Chris Martinez',
      title: 'CFG & PDA Workshop', description: 'Working through context-free grammars and pushdown automata problems together',
      location: 'Innovation Hall 318', dateTime: DateTime(2026, 2, 15, 15, 0), duration: 90,
      attendingIds: ['u1', 'u5', 'u7'], notAttendingIds: ['u2'],
    ),
    StudySession(
      id: 'ss4', courseId: 'cs367', organizerId: 'u7', organizerName: 'David Nguyen',
      title: 'C Pointer Deep Dive', description: 'Let\'s go through pointer arithmetic, double pointers, and common pitfalls',
      location: 'Engineering Building 2217', dateTime: DateTime(2026, 2, 14, 16, 0), duration: 120,
      attendingIds: ['u2', 'u5', 'u8'], notAttendingIds: ['u11'],
    ),
    StudySession(
      id: 'ss5', courseId: 'math214', organizerId: 'u6', organizerName: 'Emily Chen',
      title: 'Eigenvalue Cram Session', description: 'Review eigenvalues, eigenvectors, and diagonalization before the quiz',
      location: 'Exploratory Hall 1004', dateTime: DateTime(2026, 2, 16, 11, 0), duration: 90,
      attendingIds: ['u1', 'u3', 'u9', 'u12'], notAttendingIds: ['u5'],
    ),
    StudySession(
      id: 'ss6', courseId: 'cs330', organizerId: 'u2', organizerName: 'Priya Patel',
      title: 'Midterm Study Marathon', description: 'All-day study session for CS 330 midterm. Covering logic through pumping lemma.',
      location: 'Fenwick Library, Group Study A', dateTime: DateTime(2026, 3, 1, 10, 0), duration: 360,
      attendingIds: ['u1', 'u4', 'u5', 'u7', 'u10', 'u11'], notAttendingIds: [],
    ),
  ];

  // ─── Documents ───
  static List<CourseDocument> get documents => [
    // CS 310 Current Semester
    CourseDocument(id: 'd1', courseId: 'cs310', uploaderId: 'u4', uploaderName: 'Sarah Johnson', title: 'AVL Trees Cheat Sheet', description: 'Summary of all AVL rotation cases with diagrams and step-by-step examples', fileType: 'PDF', fileSize: '2.3 MB', uploadDate: DateTime(2026, 2, 9), downloads: 47),
    CourseDocument(id: 'd2', courseId: 'cs310', uploaderId: 'u10', uploaderName: 'Lisa Wang', title: 'Lecture 12 Notes - Heaps', description: 'Detailed notes from the heap/priority queue lecture with code examples', fileType: 'PDF', fileSize: '1.8 MB', uploadDate: DateTime(2026, 2, 7), downloads: 35),
    CourseDocument(id: 'd3', courseId: 'cs310', uploaderId: 'u1', uploaderName: 'Alex Rivera', title: 'Big-O Complexity Chart', description: 'Quick reference chart for time complexity of all data structures we covered', fileType: 'PNG', fileSize: '450 KB', uploadDate: DateTime(2026, 2, 5), downloads: 62),
    CourseDocument(id: 'd4', courseId: 'cs310', uploaderId: 'u2', uploaderName: 'Priya Patel', title: 'PA2 Test Cases', description: 'Additional JUnit test cases I wrote for PA2 (Stack/Queue implementation)', fileType: 'ZIP', fileSize: '156 KB', uploadDate: DateTime(2026, 2, 3), downloads: 28),
    // CS 310 Previous Semester
    CourseDocument(id: 'd5', courseId: 'cs310', uploaderId: 'u7', uploaderName: 'David Nguyen', title: 'Fall 2025 Midterm Solutions', description: 'Complete solutions for last semester\'s midterm with Dr. Raven', fileType: 'PDF', fileSize: '3.1 MB', uploadDate: DateTime(2025, 10, 15), isPreviousSemester: true, semester: 'Fall 2025', downloads: 89),
    CourseDocument(id: 'd6', courseId: 'cs310', uploaderId: 'u11', uploaderName: 'Chris Martinez', title: 'Fall 2025 Final Study Guide', description: 'Comprehensive study guide covering all topics for the final exam', fileType: 'PDF', fileSize: '4.5 MB', uploadDate: DateTime(2025, 12, 3), isPreviousSemester: true, semester: 'Fall 2025', downloads: 72),
    CourseDocument(id: 'd7', courseId: 'cs310', uploaderId: 'u4', uploaderName: 'Sarah Johnson', title: 'Spring 2025 Complete Notes', description: 'All lecture notes from Spring 2025 with Dr. Henderson', fileType: 'PDF', fileSize: '12.4 MB', uploadDate: DateTime(2025, 5, 10), isPreviousSemester: true, semester: 'Spring 2025', downloads: 104),
    // CS 330
    CourseDocument(id: 'd10', courseId: 'cs330', uploaderId: 'u7', uploaderName: 'David Nguyen', title: 'NFA to DFA Conversion Guide', description: 'Step-by-step guide with examples for subset construction algorithm', fileType: 'PDF', fileSize: '1.5 MB', uploadDate: DateTime(2026, 2, 8), downloads: 31),
    CourseDocument(id: 'd11', courseId: 'cs330', uploaderId: 'u5', uploaderName: 'Marcus Thompson', title: 'Logic Formulas Cheat Sheet', description: 'All propositional and predicate logic formulas and equivalences', fileType: 'PDF', fileSize: '890 KB', uploadDate: DateTime(2026, 1, 28), downloads: 55),
    CourseDocument(id: 'd12', courseId: 'cs330', uploaderId: 'u11', uploaderName: 'Chris Martinez', title: 'Fall 2025 Practice Midterm', description: 'Practice midterm from last semester with solutions', fileType: 'PDF', fileSize: '2.8 MB', uploadDate: DateTime(2025, 10, 20), isPreviousSemester: true, semester: 'Fall 2025', downloads: 67),
    // CS 367
    CourseDocument(id: 'd20', courseId: 'cs367', uploaderId: 'u8', uploaderName: 'Aisha Mohammed', title: 'C Pointers Visual Guide', description: 'Visual diagrams explaining how pointers work in C with memory layout', fileType: 'PDF', fileSize: '3.2 MB', uploadDate: DateTime(2026, 2, 6), downloads: 43),
    CourseDocument(id: 'd21', courseId: 'cs367', uploaderId: 'u2', uploaderName: 'Priya Patel', title: 'Makefile Template', description: 'Template Makefile for CS 367 projects with common compilation flags', fileType: 'TXT', fileSize: '2 KB', uploadDate: DateTime(2026, 2, 1), downloads: 38),
    CourseDocument(id: 'd22', courseId: 'cs367', uploaderId: 'u7', uploaderName: 'David Nguyen', title: 'Fall 2025 Midterm + Solutions', description: 'Last semester midterm with detailed solutions', fileType: 'PDF', fileSize: '2.1 MB', uploadDate: DateTime(2025, 10, 25), isPreviousSemester: true, semester: 'Fall 2025', downloads: 58),
    // MATH 214
    CourseDocument(id: 'd30', courseId: 'math214', uploaderId: 'u6', uploaderName: 'Emily Chen', title: 'Matrix Operations Summary', description: 'Quick reference for matrix multiplication, inverse, transpose, determinant', fileType: 'PDF', fileSize: '1.2 MB', uploadDate: DateTime(2026, 2, 4), downloads: 41),
    CourseDocument(id: 'd31', courseId: 'math214', uploaderId: 'u3', uploaderName: 'Jordan Kim', title: 'Vector Spaces Study Notes', description: 'My personal notes on vector spaces, subspaces, span, and linear independence', fileType: 'PDF', fileSize: '2.6 MB', uploadDate: DateTime(2026, 2, 10), downloads: 22),
    CourseDocument(id: 'd32', courseId: 'math214', uploaderId: 'u10', uploaderName: 'Lisa Wang', title: 'Fall 2025 Formula Sheet', description: 'All the formulas allowed on Dr. Fischer\'s exam', fileType: 'PDF', fileSize: '560 KB', uploadDate: DateTime(2025, 12, 8), isPreviousSemester: true, semester: 'Fall 2025', downloads: 83),
  ];

  // ─── Feed Posts ───
  static List<FeedPost> get feedPosts => [
    FeedPost(id: 'p1', authorId: 'u5', authorName: 'Marcus Thompson', authorAvatar: 'MT', authorMajor: 'Computer Science', content: 'Just got accepted to the GMU Cybersecurity competition team! 🔐🎉 All those late nights practicing CTFs paid off', timestamp: DateTime(2026, 2, 11, 10, 30), likes: 47, comments: 12, reposts: 5),
    FeedPost(id: 'p2', authorId: 'u4', authorName: 'Sarah Johnson', authorAvatar: 'SJ', authorMajor: 'Software Engineering', content: 'Survived my Google final round interview. Whatever happens, I\'m proud of getting this far. GMU prepared me well 💚💛', timestamp: DateTime(2026, 2, 11, 9, 0), likes: 134, comments: 28, reposts: 15),
    FeedPost(id: 'p3', authorId: 'u6', authorName: 'Emily Chen', authorAvatar: 'EC', authorMajor: 'Data Science', content: 'The JC Chick-fil-A line at noon is a war zone. Showed up at 11:45 thinking I was early... I was wrong 😭', timestamp: DateTime(2026, 2, 11, 12, 15), likes: 89, comments: 23, reposts: 8),
    FeedPost(id: 'p4', authorId: 'u1', authorName: 'Alex Rivera', authorAvatar: 'AR', authorMajor: 'Computer Science', content: 'Hot take: CS 367 is actually the most useful class in the CS curriculum. Fight me.', timestamp: DateTime(2026, 2, 11, 8, 45), likes: 23, comments: 31, reposts: 2),
    FeedPost(id: 'p5', authorId: 'u9', authorName: 'Tyler Brooks', authorAvatar: 'TB', authorMajor: 'Information Technology', content: 'GMU basketball going crazy this season!! 🏀 Who\'s going to the game Saturday?', timestamp: DateTime(2026, 2, 10, 21, 0), likes: 67, comments: 18, reposts: 4),
    FeedPost(id: 'p6', authorId: 'u3', authorName: 'Jordan Kim', authorAvatar: 'JK', authorMajor: 'Information Technology', content: 'Found a quiet study spot on the 4th floor of Fenwick that literally nobody knows about. Not telling where exactly tho 👀', timestamp: DateTime(2026, 2, 10, 18, 30), likes: 52, comments: 15, reposts: 3),
    FeedPost(id: 'p7', authorId: 'u11', authorName: 'Chris Martinez', authorAvatar: 'CM', authorMajor: 'Software Engineering', content: 'My startup just got accepted into GMU\'s Mason Enterprise accelerator program!! Building the future one line of code at a time 🚀', timestamp: DateTime(2026, 2, 10, 16, 0), likes: 98, comments: 21, reposts: 12),
    FeedPost(id: 'p8', authorId: 'u7', authorName: 'David Nguyen', authorAvatar: 'DN', authorMajor: 'Computer Science', content: 'Contributed my first PR to the Linux kernel today 🐧 Small fix in the memory management subsystem but still feels unreal', timestamp: DateTime(2026, 2, 10, 14, 0), likes: 156, comments: 32, reposts: 18),
    FeedPost(id: 'p9', authorId: 'u8', authorName: 'Aisha Mohammed', authorAvatar: 'AM', authorMajor: 'Computer Science', content: 'Women in Tech meetup this Thursday at 5 PM in Innovation Hall! Guest speaker from Microsoft. All are welcome 💪', timestamp: DateTime(2026, 2, 10, 11, 0), likes: 73, comments: 9, reposts: 14),
    FeedPost(id: 'p10', authorId: 'u2', authorName: 'Priya Patel', authorAvatar: 'PP', authorMajor: 'Computer Science', content: 'Spent 4 hours debugging a seg fault in CS 367. The issue? I forgot to allocate memory for the null terminator. One byte. ONE BYTE. 💀', timestamp: DateTime(2026, 2, 10, 23, 30), likes: 112, comments: 25, reposts: 9),
    FeedPost(id: 'p11', authorId: 'u12', authorName: 'Rachel Green', authorAvatar: 'RG', authorMajor: 'Computer Science', content: 'Can we talk about how good the new cafe in the Engineering building is? That matcha latte is elite ☕', timestamp: DateTime(2026, 2, 9, 15, 0), likes: 45, comments: 8, reposts: 2),
    FeedPost(id: 'p12', authorId: 'u10', authorName: 'Lisa Wang', authorAvatar: 'LW', authorMajor: 'Computer Science', content: 'ACM Programming Competition results: GMU placed 3rd in the regional! So proud of our team 🏆', timestamp: DateTime(2026, 2, 9, 20, 0), likes: 187, comments: 35, reposts: 22),
  ];

  // Helper methods
  static AppUser getUserById(String id) {
    return users.firstWhere((u) => u.id == id, orElse: () => currentUser);
  }

  static Course getCourseById(String id) {
    return allCourses.firstWhere((c) => c.id == id);
  }

  static List<Course> getEnrolledCourses() {
    return allCourses.where((c) => currentUser.enrolledCourseIds.contains(c.id)).toList();
  }

  static List<CalendarEvent> getEventsForCourse(String courseId) {
    return calendarEvents.where((e) => e.courseId == courseId).toList();
  }

  static List<CalendarEvent> getEventsForDate(DateTime date) {
    return calendarEvents.where((e) => 
      e.date.year == date.year && e.date.month == date.month && e.date.day == date.day
    ).toList();
  }

  static List<StudySession> getSessionsForCourse(String courseId) {
    return studySessions.where((s) => s.courseId == courseId).toList();
  }

  static List<CourseDocument> getDocumentsForCourse(String courseId, {bool previousSemester = false}) {
    return documents.where((d) => d.courseId == courseId && d.isPreviousSemester == previousSemester).toList();
  }
}
