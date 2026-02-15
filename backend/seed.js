require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const Message = require('./models/Message');
const Post = require('./models/Post');
const CalendarEvent = require('./models/CalendarEvent');
const StudySession = require('./models/StudySession');
const Document = require('./models/Document');
const MasonMeet = require('./models/MasonMeet');
const ChatHistory = require('./models/ChatHistory');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear all collections
  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Message.deleteMany({}),
    Post.deleteMany({}),
    CalendarEvent.deleteMany({}),
    StudySession.deleteMany({}),
    Document.deleteMany({}),
    MasonMeet.deleteMany({}),
    ChatHistory.deleteMany({}),
  ]);
  console.log('Cleared all collections');

  // ═══════════════════════════════════════════
  // USERS (30 students)
  // ═══════════════════════════════════════════
  const usersData = [
    { name: 'Alex Johnson', email: 'ajohnson@gmu.edu', password: 'password123', major: 'Computer Science', year: 3, bio: 'Full-stack developer and open source contributor. Love hackathons!' },
    { name: 'Maria Garcia', email: 'mgarcia@gmu.edu', password: 'password123', major: 'Information Technology', year: 2, bio: 'Cybersecurity enthusiast. CTF player.' },
    { name: 'David Kim', email: 'dkim@gmu.edu', password: 'password123', major: 'Computer Science', year: 4, bio: 'ML researcher. Working on NLP projects.' },
    { name: 'Sarah Chen', email: 'schen@gmu.edu', password: 'password123', major: 'Software Engineering', year: 3, bio: 'Mobile dev passionate about Flutter and SwiftUI.' },
    { name: 'James Wilson', email: 'jwilson@gmu.edu', password: 'password123', major: 'Computer Science', year: 2, bio: 'Aspiring game developer. Unity and Unreal Engine.' },
    { name: 'Emily Brown', email: 'ebrown@gmu.edu', password: 'password123', major: 'Data Science', year: 4, bio: 'Data analyst intern at Capital One. Python lover.' },
    { name: 'Michael Lee', email: 'mlee@gmu.edu', password: 'password123', major: 'Computer Science', year: 1, bio: 'Freshman excited to learn everything about CS!' },
    { name: 'Jessica Taylor', email: 'jtaylor@gmu.edu', password: 'password123', major: 'Information Systems', year: 3, bio: 'UX designer and front-end developer.' },
    { name: 'Ryan Martinez', email: 'rmartinez@gmu.edu', password: 'password123', major: 'Computer Science', year: 2, bio: 'Systems programming and OS development nerd.' },
    { name: 'Ashley Davis', email: 'adavis@gmu.edu', password: 'password123', major: 'Cybersecurity', year: 4, bio: 'SOC analyst intern. OSCP certified.' },
    { name: 'Chris Anderson', email: 'canderson@gmu.edu', password: 'password123', major: 'Computer Science', year: 3, bio: 'Cloud computing enthusiast. AWS certified.' },
    { name: 'Olivia Thomas', email: 'othomas@gmu.edu', password: 'password123', major: 'Software Engineering', year: 2, bio: 'Backend developer. Love Go and Rust.' },
    { name: 'Daniel Jackson', email: 'djackson@gmu.edu', password: 'password123', major: 'Computer Science', year: 4, bio: 'Teaching assistant for CS 310. Algorithms lover.' },
    { name: 'Sophia White', email: 'swhite@gmu.edu', password: 'password123', major: 'Data Science', year: 1, bio: 'Passionate about statistics and visualization.' },
    { name: 'Ethan Harris', email: 'eharris@gmu.edu', password: 'password123', major: 'Computer Science', year: 3, bio: 'Competitive programmer. LeetCode grinder.' },
    { name: 'Isabella Clark', email: 'iclark@gmu.edu', password: 'password123', major: 'Information Technology', year: 2, bio: 'Networking and infrastructure specialist.' },
    { name: 'Noah Robinson', email: 'nrobinson@gmu.edu', password: 'password123', major: 'Computer Science', year: 4, bio: 'DevOps engineer intern at Amazon.' },
    { name: 'Mia Lewis', email: 'mlewis@gmu.edu', password: 'password123', major: 'Computer Science', year: 1, bio: 'First-gen college student. Excited about tech!' },
    { name: 'Liam Walker', email: 'lwalker@gmu.edu', password: 'password123', major: 'Software Engineering', year: 3, bio: 'Full-stack JS dev. React and Node expert.' },
    { name: 'Ava Hall', email: 'ahall@gmu.edu', password: 'password123', major: 'Computer Science', year: 2, bio: 'AI and robotics researcher.' },
    { name: 'Lucas Young', email: 'lyoung@gmu.edu', password: 'password123', major: 'Cybersecurity', year: 3, bio: 'Penetration testing and ethical hacking.' },
    { name: 'Charlotte King', email: 'cking@gmu.edu', password: 'password123', major: 'Data Science', year: 4, bio: 'Working on my senior thesis in deep learning.' },
    { name: 'Mason Wright', email: 'mwright@gmu.edu', password: 'password123', major: 'Computer Science', year: 2, bio: 'Love building mobile apps and side projects.' },
    { name: 'Amelia Scott', email: 'ascott@gmu.edu', password: 'password123', major: 'Information Systems', year: 1, bio: 'Interested in project management and Agile.' },
    { name: 'Benjamin Adams', email: 'badams@gmu.edu', password: 'password123', major: 'Computer Science', year: 4, bio: 'Blockchain developer and Web3 enthusiast.' },
    { name: 'Harper Nelson', email: 'hnelson@gmu.edu', password: 'password123', major: 'Software Engineering', year: 3, bio: 'QA engineer and testing automation specialist.' },
    { name: 'Jack Carter', email: 'jcarter@gmu.edu', password: 'password123', major: 'Computer Science', year: 2, bio: 'Linux sysadmin. Arch btw.' },
    { name: 'Ella Mitchell', email: 'emitchell@gmu.edu', password: 'password123', major: 'Data Science', year: 3, bio: 'R and Python for data analysis. Kaggle competitor.' },
    { name: 'Alexander Perez', email: 'aperez@gmu.edu', password: 'password123', major: 'Computer Science', year: 1, bio: 'Just starting my CS journey. Love problem-solving.' },
    { name: 'Grace Roberts', email: 'groberts@gmu.edu', password: 'password123', major: 'Information Technology', year: 4, bio: 'IT consultant intern. Cloud certifications.' },
  ];

  const users = [];
  for (const ud of usersData) {
    const user = new User(ud);
    await user.save();
    users.push(user);
  }
  console.log(`Created ${users.length} users`);

  // Helper to get random users
  const uid = (i) => users[i]._id.toString();
  const uname = (i) => users[i].name;
  const uavatar = (i) => users[i].avatarUrl;
  const umajor = (i) => users[i].major;
  const randUsers = (count, exclude = []) => {
    const pool = users.filter((_, i) => !exclude.includes(i));
    const shuffled = pool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  // ═══════════════════════════════════════════
  // COURSES (14 courses)
  // ═══════════════════════════════════════════
  const coursesData = [
    {
      code: 'CS 110', name: 'Essentials of Computer Science', instructor: 'Dr. Jane Smith',
      schedule: 'MWF 9:00-9:50 AM', location: 'Innovation Hall 204', credits: 3,
      description: 'An introduction to the essentials of computer science with an emphasis on computational thinking and problem solving.',
      channels: [{ name: 'general', icon: '💬' }, { name: 'homework-help', icon: '📝' }, { name: 'study-group', icon: '📚' }],
    },
    {
      code: 'CS 211', name: 'Object-Oriented Programming', instructor: 'Dr. Robert Miller',
      schedule: 'TR 10:30-11:45 AM', location: 'Engineering 4457', credits: 3,
      description: 'Introduction to object-oriented programming using Java. Covers classes, inheritance, polymorphism, and exception handling.',
      channels: [{ name: 'general', icon: '💬' }, { name: 'labs', icon: '🔬' }, { name: 'projects', icon: '🛠️' }, { name: 'exam-prep', icon: '📖' }],
    },
    {
      code: 'CS 262', name: 'Introduction to Low-Level Programming', instructor: 'Dr. Alice Wang',
      schedule: 'MWF 11:00-11:50 AM', location: 'Nguyen Engineering 1103', credits: 3,
      description: 'Introduction to C programming, pointers, memory management, and system-level programming concepts.',
      channels: [{ name: 'general', icon: '💬' }, { name: 'c-help', icon: '🔧' }, { name: 'debugging', icon: '🐛' }],
    },
    {
      code: 'CS 310', name: 'Data Structures', instructor: 'Dr. Michael Zhang',
      schedule: 'TR 1:30-2:45 PM', location: 'Research Hall 163', credits: 3,
      description: 'Study of fundamental data structures including lists, stacks, queues, trees, hash tables, and graphs.',
      channels: [{ name: 'general', icon: '💬' }, { name: 'homework-help', icon: '📝' }, { name: 'coding-problems', icon: '💻' }, { name: 'exam-review', icon: '📋' }],
    },
    {
      code: 'CS 330', name: 'Formal Methods and Models', instructor: 'Dr. Lisa Park',
      schedule: 'MWF 1:00-1:50 PM', location: 'Planetary Hall 122', credits: 3,
      description: 'Formal languages, automata theory, computability, and computational complexity.',
      channels: [{ name: 'general', icon: '💬' }, { name: 'proofs', icon: '🧮' }, { name: 'homework', icon: '📝' }],
    },
    {
      code: 'CS 367', name: 'Computer Systems and Programming', instructor: 'Dr. Tom Brown',
      schedule: 'TR 3:00-4:15 PM', location: 'Innovation Hall 105', credits: 3,
      description: 'Introduction to computer systems from a programmer\'s perspective. Assembly language, memory hierarchy, and system I/O.',
      channels: [{ name: 'general', icon: '💬' }, { name: 'assembly', icon: '⚡' }, { name: 'labs', icon: '🔬' }],
    },
    {
      code: 'CS 471', name: 'Operating Systems', instructor: 'Dr. Kevin Chen',
      schedule: 'MWF 2:00-2:50 PM', location: 'Research Hall 209', credits: 3,
      description: 'Principles of operating systems: process management, memory management, file systems, and concurrency.',
      channels: [{ name: 'general', icon: '💬' }, { name: 'projects', icon: '🛠️' }, { name: 'linux-help', icon: '🐧' }],
    },
    {
      code: 'CS 484', name: 'Data Mining', instructor: 'Dr. Priya Sharma',
      schedule: 'TR 10:30-11:45 AM', location: 'Art and Design Building 2026', credits: 3,
      description: 'Introduction to data mining concepts, algorithms, and techniques for knowledge discovery in databases.',
      channels: [{ name: 'general', icon: '💬' }, { name: 'python-help', icon: '🐍' }, { name: 'projects', icon: '📊' }],
    },
    {
      code: 'SWE 432', name: 'Design and Implementation of Software for the Web', instructor: 'Dr. Sandra Lopez',
      schedule: 'MWF 10:00-10:50 AM', location: 'Nguyen Engineering 1505', credits: 3,
      description: 'Modern web application development: front-end frameworks, RESTful APIs, databases, and deployment.',
      channels: [{ name: 'general', icon: '💬' }, { name: 'frontend', icon: '🎨' }, { name: 'backend', icon: '⚙️' }, { name: 'deployment', icon: '🚀' }],
    },
    {
      code: 'SWE 443', name: 'Software Architecture', instructor: 'Dr. Eric Foster',
      schedule: 'TR 4:30-5:45 PM', location: 'Exploratory Hall 1004', credits: 3,
      description: 'Software architecture styles, patterns, quality attributes, and architectural evaluation.',
      channels: [{ name: 'general', icon: '💬' }, { name: 'design-patterns', icon: '🏗️' }, { name: 'assignments', icon: '📄' }],
    },
    {
      code: 'MATH 203', name: 'Linear Algebra', instructor: 'Dr. Amanda Rivera',
      schedule: 'MWF 9:00-9:50 AM', location: 'Exploratory Hall 2004', credits: 3,
      description: 'Systems of linear equations, matrices, determinants, vector spaces, eigenvalues and eigenvectors.',
      channels: [{ name: 'general', icon: '💬' }, { name: 'homework', icon: '📝' }, { name: 'study-tips', icon: '💡' }],
    },
    {
      code: 'STAT 344', name: 'Probability and Statistics for Engineers', instructor: 'Dr. James Nguyen',
      schedule: 'TR 12:00-1:15 PM', location: 'Planetary Hall 206', credits: 3,
      description: 'Probability theory, random variables, distributions, hypothesis testing, and regression analysis.',
      channels: [{ name: 'general', icon: '💬' }, { name: 'problem-sets', icon: '📊' }],
    },
    {
      code: 'CS 425', name: 'Game Programming', instructor: 'Dr. Nathan Gray',
      schedule: 'MW 4:30-5:45 PM', location: 'Art and Design Building 1020', credits: 3,
      description: 'Game development fundamentals: graphics, physics, AI, input, audio, and game engines.',
      channels: [{ name: 'general', icon: '💬' }, { name: 'unity-help', icon: '🎮' }, { name: 'showcase', icon: '🏆' }],
    },
    {
      code: 'CS 450', name: 'Database Concepts', instructor: 'Dr. Rachel Kim',
      schedule: 'TR 1:30-2:45 PM', location: 'Innovation Hall 308', credits: 3,
      description: 'Relational database design, SQL, normalization, transaction processing, and NoSQL databases.',
      channels: [{ name: 'general', icon: '💬' }, { name: 'sql-help', icon: '🗄️' }, { name: 'projects', icon: '🛠️' }],
    },
  ];

  const courses = [];
  for (const cd of coursesData) {
    const course = new Course(cd);
    await course.save();
    courses.push(course);
  }
  console.log(`Created ${courses.length} courses`);

  const cid = (i) => courses[i]._id.toString();
  const ccode = (i) => courses[i].code;
  const channelId = (courseIdx, channelIdx) => courses[courseIdx].channels[channelIdx]._id.toString();

  // ═══════════════════════════════════════════
  // ENROLLMENTS
  // ═══════════════════════════════════════════
  // Each student enrolled in 3-6 courses; each course has 8-18 students
  // Course indices: 0-13 (14 courses total)
  const enrollments = [
    // user 0 (Alex) - CS major, junior
    [0, 3, 6, 8, 13],
    // user 1 (Maria) - IT, sophomore
    [1, 0, 5, 11, 13],
    // user 2 (David) - CS, senior
    [2, 6, 7, 9, 13],
    // user 3 (Sarah) - SWE, junior
    [3, 8, 9, 3, 12],
    // user 4 (James) - CS, sophomore
    [4, 1, 2, 4, 12],
    // user 5 (Emily) - Data Science, senior
    [5, 7, 11, 3, 13],
    // user 6 (Michael) - CS, freshman
    [6, 0, 1, 10],
    // user 7 (Jessica) - IS, junior
    [7, 8, 9, 11],
    // user 8 (Ryan) - CS, sophomore
    [8, 1, 2, 5, 6],
    // user 9 (Ashley) - Cyber, senior
    [9, 5, 6, 7],
    // user 10 (Chris) - CS, junior
    [10, 3, 6, 8, 9],
    // user 11 (Olivia) - SWE, sophomore
    [11, 1, 2, 8],
    // user 12 (Daniel) - CS, senior
    [12, 3, 6, 7, 13],
    // user 13 (Sophia) - DS, freshman
    [13, 0, 10, 11],
    // user 14 (Ethan) - CS, junior
    [14, 3, 4, 6, 12],
    // user 15 (Isabella) - IT, sophomore
    [15, 0, 2, 5, 11],
    // user 16 (Noah) - CS, senior
    [16, 6, 7, 9, 13],
    // user 17 (Mia) - CS, freshman
    [17, 0, 1, 10],
    // user 18 (Liam) - SWE, junior
    [18, 8, 9, 3, 4],
    // user 19 (Ava) - CS, sophomore
    [19, 1, 2, 4, 12],
    // user 20 (Lucas) - Cyber, junior
    [20, 5, 6, 9],
    // user 21 (Charlotte) - DS, senior
    [21, 7, 11, 13],
    // user 22 (Mason) - CS, sophomore
    [22, 1, 2, 4, 10],
    // user 23 (Amelia) - IS, freshman
    [23, 0, 8, 11],
    // user 24 (Benjamin) - CS, senior
    [24, 6, 7, 9, 13],
    // user 25 (Harper) - SWE, junior
    [25, 8, 9, 3],
    // user 26 (Jack) - CS, sophomore
    [26, 1, 2, 5, 6],
    // user 27 (Ella) - DS, junior
    [27, 7, 11, 3, 13],
    // user 28 (Alexander) - CS, freshman
    [28, 0, 1, 10],
    // user 29 (Grace) - IT, senior
    [29, 5, 9, 11, 13],
  ];

  for (const [userIdx, ...courseIdxs] of enrollments) {
    const user = users[userIdx];
    user.enrolledCourseIds = courseIdxs.map(ci => cid(ci));
    await user.save();
    for (const ci of courseIdxs) {
      if (!courses[ci].enrolledStudentIds.includes(uid(userIdx))) {
        courses[ci].enrolledStudentIds.push(uid(userIdx));
      }
    }
  }
  for (const c of courses) await c.save();
  console.log('Enrollments saved');

  // ═══════════════════════════════════════════
  // CALENDAR EVENTS (60+ events)
  // ═══════════════════════════════════════════
  const now = new Date();
  const day = (d) => new Date(now.getTime() + d * 86400000);

  const eventsData = [
    // CS 110
    { courseId: cid(0), title: 'HW 1: Computational Thinking', description: 'Problem set on algorithms and pseudocode', date: day(3), type: 'homework', createdBy: uid(0) },
    { courseId: cid(0), title: 'Quiz 1: Binary & Logic', description: 'Short quiz on binary numbers and logic gates', date: day(7), type: 'quiz', createdBy: uid(0) },
    { courseId: cid(0), title: 'HW 2: Python Basics', description: 'Write simple Python programs', date: day(14), type: 'homework', createdBy: uid(6) },
    { courseId: cid(0), title: 'Midterm Exam', description: 'Covers weeks 1-7 material', date: day(28), type: 'exam', createdBy: uid(0) },
    { courseId: cid(0), title: 'Final Project: Build an App', description: 'Build a simple application using Python', date: day(56), type: 'project', createdBy: uid(6) },
    // CS 211
    { courseId: cid(1), title: 'Lab 1: Java Basics', description: 'Variables, loops, and conditionals in Java', date: day(2), type: 'homework', createdBy: uid(4) },
    { courseId: cid(1), title: 'HW 1: Classes and Objects', description: 'Create a Student class with methods', date: day(5), type: 'homework', createdBy: uid(4) },
    { courseId: cid(1), title: 'Quiz 1: OOP Concepts', description: 'Inheritance, polymorphism questions', date: day(10), type: 'quiz', createdBy: uid(4) },
    { courseId: cid(1), title: 'Project 1: Library System', description: 'Build a library management system', date: day(21), type: 'project', createdBy: uid(6) },
    { courseId: cid(1), title: 'Midterm Exam', description: 'OOP concepts through week 7', date: day(30), type: 'exam', createdBy: uid(4) },
    { courseId: cid(1), title: 'HW 3: Exception Handling', description: 'Try-catch and custom exceptions', date: day(35), type: 'homework', createdBy: uid(4) },
    // CS 262
    { courseId: cid(2), title: 'HW 1: Pointers', description: 'Pointer arithmetic and dereferencing exercises', date: day(4), type: 'homework', createdBy: uid(8) },
    { courseId: cid(2), title: 'Lab 2: Dynamic Memory', description: 'malloc, calloc, realloc, free', date: day(8), type: 'homework', createdBy: uid(8) },
    { courseId: cid(2), title: 'Quiz 1: C Fundamentals', description: 'Structs, pointers, and arrays', date: day(12), type: 'quiz', createdBy: uid(8) },
    { courseId: cid(2), title: 'Midterm Exam', description: 'C programming through week 7', date: day(29), type: 'exam', createdBy: uid(8) },
    { courseId: cid(2), title: 'Project: Linked List Library', description: 'Implement a complete linked list in C', date: day(42), type: 'project', createdBy: uid(8) },
    // CS 310
    { courseId: cid(3), title: 'HW 1: ArrayList Implementation', description: 'Implement a dynamic array from scratch', date: day(3), type: 'homework', createdBy: uid(0) },
    { courseId: cid(3), title: 'HW 2: Linked List Operations', description: 'Insert, delete, reverse operations', date: day(8), type: 'homework', createdBy: uid(0) },
    { courseId: cid(3), title: 'Quiz 1: Stacks and Queues', description: 'Stack/queue operations and applications', date: day(13), type: 'quiz', createdBy: uid(12) },
    { courseId: cid(3), title: 'HW 3: Binary Search Trees', description: 'BST insert, delete, traversals', date: day(18), type: 'homework', createdBy: uid(14) },
    { courseId: cid(3), title: 'Midterm Exam', description: 'Lists through trees', date: day(25), type: 'exam', createdBy: uid(12) },
    { courseId: cid(3), title: 'HW 4: Hash Tables', description: 'Implement open-addressing hash table', date: day(33), type: 'homework', createdBy: uid(0) },
    { courseId: cid(3), title: 'Project: Graph Algorithms', description: 'Implement BFS, DFS, Dijkstra on a graph', date: day(49), type: 'project', createdBy: uid(14) },
    { courseId: cid(3), title: 'Final Exam', description: 'Comprehensive final exam', date: day(63), type: 'exam', createdBy: uid(12) },
    // CS 330
    { courseId: cid(4), title: 'HW 1: Regular Expressions', description: 'Write regexes for various languages', date: day(5), type: 'homework', createdBy: uid(14) },
    { courseId: cid(4), title: 'HW 2: DFA Construction', description: 'Build DFAs for given languages', date: day(11), type: 'homework', createdBy: uid(14) },
    { courseId: cid(4), title: 'Quiz 1: Automata', description: 'NFA to DFA conversion', date: day(15), type: 'quiz', createdBy: uid(14) },
    { courseId: cid(4), title: 'Midterm Exam', description: 'Regular languages and CFGs', date: day(30), type: 'exam', createdBy: uid(14) },
    // CS 367
    { courseId: cid(5), title: 'Lab 1: x86 Assembly', description: 'Write basic x86 assembly programs', date: day(3), type: 'homework', createdBy: uid(1) },
    { courseId: cid(5), title: 'HW 1: Data Representation', description: 'Two\'s complement and IEEE 754', date: day(7), type: 'homework', createdBy: uid(8) },
    { courseId: cid(5), title: 'Quiz 1: Assembly', description: 'x86 instructions and registers', date: day(14), type: 'quiz', createdBy: uid(1) },
    { courseId: cid(5), title: 'Midterm Exam', description: 'Assembly and memory hierarchy', date: day(28), type: 'exam', createdBy: uid(8) },
    { courseId: cid(5), title: 'Lab 4: Cache Simulator', description: 'Build a cache simulator in C', date: day(35), type: 'project', createdBy: uid(8) },
    // CS 471
    { courseId: cid(6), title: 'HW 1: Process Management', description: 'Fork, exec, and process scheduling', date: day(4), type: 'homework', createdBy: uid(0) },
    { courseId: cid(6), title: 'Project 1: Shell', description: 'Build a Unix shell from scratch', date: day(14), type: 'project', createdBy: uid(0) },
    { courseId: cid(6), title: 'Quiz 1: Scheduling', description: 'CPU scheduling algorithms', date: day(18), type: 'quiz', createdBy: uid(10) },
    { courseId: cid(6), title: 'Midterm Exam', description: 'Processes through memory management', date: day(30), type: 'exam', createdBy: uid(0) },
    { courseId: cid(6), title: 'Project 2: Virtual Memory', description: 'Implement page replacement algorithms', date: day(42), type: 'project', createdBy: uid(10) },
    { courseId: cid(6), title: 'Final Exam', description: 'Comprehensive', date: day(60), type: 'exam', createdBy: uid(0) },
    // CS 484
    { courseId: cid(7), title: 'HW 1: Data Preprocessing', description: 'Clean and transform datasets', date: day(5), type: 'homework', createdBy: uid(5) },
    { courseId: cid(7), title: 'Quiz 1: Classification', description: 'Decision trees and k-NN', date: day(12), type: 'quiz', createdBy: uid(2) },
    { courseId: cid(7), title: 'Project 1: Clustering', description: 'K-means on real-world dataset', date: day(28), type: 'project', createdBy: uid(5) },
    { courseId: cid(7), title: 'Midterm Exam', description: 'Classification and clustering', date: day(32), type: 'exam', createdBy: uid(2) },
    // SWE 432
    { courseId: cid(8), title: 'HW 1: HTML & CSS', description: 'Build a responsive webpage', date: day(3), type: 'homework', createdBy: uid(3) },
    { courseId: cid(8), title: 'HW 2: JavaScript Basics', description: 'DOM manipulation exercises', date: day(8), type: 'homework', createdBy: uid(0) },
    { courseId: cid(8), title: 'Project 1: React App', description: 'Build a single-page application with React', date: day(21), type: 'project', createdBy: uid(3) },
    { courseId: cid(8), title: 'Quiz 1: REST APIs', description: 'HTTP methods and status codes', date: day(15), type: 'quiz', createdBy: uid(0) },
    { courseId: cid(8), title: 'Midterm Exam', description: 'Frontend through REST APIs', date: day(28), type: 'exam', createdBy: uid(3) },
    { courseId: cid(8), title: 'Final Project: Full Stack', description: 'Build a complete web application', date: day(56), type: 'project', createdBy: uid(0) },
    // SWE 443
    { courseId: cid(9), title: 'HW 1: Architecture Styles', description: 'Compare MVC, microservices, and monolith', date: day(6), type: 'homework', createdBy: uid(3) },
    { courseId: cid(9), title: 'Quiz 1: Design Patterns', description: 'Singleton, factory, observer patterns', date: day(14), type: 'quiz', createdBy: uid(10) },
    { courseId: cid(9), title: 'Midterm Exam', description: 'Architecture styles and patterns', date: day(30), type: 'exam', createdBy: uid(3) },
    // MATH 203
    { courseId: cid(10), title: 'HW 1: Systems of Equations', description: 'Gaussian elimination problems', date: day(4), type: 'homework', createdBy: uid(6) },
    { courseId: cid(10), title: 'Quiz 1: Matrix Operations', description: 'Matrix multiplication and inverses', date: day(10), type: 'quiz', createdBy: uid(17) },
    { courseId: cid(10), title: 'HW 2: Vector Spaces', description: 'Span, basis, and dimension', date: day(18), type: 'homework', createdBy: uid(6) },
    { courseId: cid(10), title: 'Midterm Exam', description: 'Chapters 1-4', date: day(28), type: 'exam', createdBy: uid(6) },
    // STAT 344
    { courseId: cid(11), title: 'HW 1: Probability Basics', description: 'Combinatorics and probability rules', date: day(5), type: 'homework', createdBy: uid(1) },
    { courseId: cid(11), title: 'Quiz 1: Random Variables', description: 'Discrete and continuous distributions', date: day(12), type: 'quiz', createdBy: uid(13) },
    { courseId: cid(11), title: 'HW 2: Distributions', description: 'Normal, Poisson, binomial problems', date: day(19), type: 'homework', createdBy: uid(1) },
    { courseId: cid(11), title: 'Midterm Exam', description: 'Probability through distributions', date: day(30), type: 'exam', createdBy: uid(13) },
    // CS 425
    { courseId: cid(12), title: 'Lab 1: Unity Setup', description: 'Create your first Unity project', date: day(2), type: 'homework', createdBy: uid(4) },
    { courseId: cid(12), title: 'Project 1: 2D Game', description: 'Build a 2D platformer game', date: day(21), type: 'project', createdBy: uid(4) },
    { courseId: cid(12), title: 'Quiz 1: Game Physics', description: 'Physics engines and collision detection', date: day(15), type: 'quiz', createdBy: uid(19) },
    { courseId: cid(12), title: 'Project 2: 3D Game', description: 'Build a 3D game with AI enemies', date: day(49), type: 'project', createdBy: uid(4) },
    // CS 450
    { courseId: cid(13), title: 'HW 1: ER Diagrams', description: 'Design ER diagrams for given scenarios', date: day(4), type: 'homework', createdBy: uid(2) },
    { courseId: cid(13), title: 'HW 2: SQL Queries', description: 'Write complex SQL queries', date: day(10), type: 'homework', createdBy: uid(5) },
    { courseId: cid(13), title: 'Quiz 1: Normalization', description: '1NF through BCNF', date: day(16), type: 'quiz', createdBy: uid(2) },
    { courseId: cid(13), title: 'Project: Database App', description: 'Build a full database-backed application', date: day(42), type: 'project', createdBy: uid(5) },
    { courseId: cid(13), title: 'Midterm Exam', description: 'ER diagrams through normalization', date: day(28), type: 'exam', createdBy: uid(2) },
    { courseId: cid(13), title: 'Final Exam', description: 'Comprehensive final with NoSQL topics', date: day(60), type: 'exam', createdBy: uid(2) },
  ];

  await CalendarEvent.insertMany(eventsData);
  console.log(`Created ${eventsData.length} calendar events`);

  // ═══════════════════════════════════════════
  // CHANNEL MESSAGES (150+ messages across courses)
  // ═══════════════════════════════════════════
  const channelMsgs = [];
  const ts = (minutesAgo) => new Date(now.getTime() - minutesAgo * 60000);

  // CS 110 #general
  const cs110gen = channelId(0, 0);
  channelMsgs.push(
    { senderId: uid(6), senderName: uname(6), senderAvatar: uavatar(6), content: 'Hey everyone! Just joined this class. Excited to learn CS!', channelId: cs110gen, createdAt: ts(4320) },
    { senderId: uid(17), senderName: uname(17), senderAvatar: uavatar(17), content: 'Same here! Any tips for the first homework?', channelId: cs110gen, createdAt: ts(4310) },
    { senderId: uid(1), senderName: uname(1), senderAvatar: uavatar(1), content: 'The slides on Canvas are really helpful. Start early!', channelId: cs110gen, createdAt: ts(4300) },
    { senderId: uid(13), senderName: uname(13), senderAvatar: uavatar(13), content: 'Does anyone have Dr. Smith\'s office hours?', channelId: cs110gen, createdAt: ts(4290) },
    { senderId: uid(15), senderName: uname(15), senderAvatar: uavatar(15), content: 'Office hours are MW 3-4 PM in Innovation Hall 220', channelId: cs110gen, createdAt: ts(4280) },
    { senderId: uid(28), senderName: uname(28), senderAvatar: uavatar(28), content: 'Thanks Isabella! That\'s super helpful.', channelId: cs110gen, createdAt: ts(4270) },
    { senderId: uid(23), senderName: uname(23), senderAvatar: uavatar(23), content: 'Is the textbook required or optional?', channelId: cs110gen, createdAt: ts(4200) },
    { senderId: uid(6), senderName: uname(6), senderAvatar: uavatar(6), content: 'Dr. Smith said it\'s optional but recommended for extra practice', channelId: cs110gen, createdAt: ts(4190) },
  );

  // CS 110 #homework-help
  const cs110hw = channelId(0, 1);
  channelMsgs.push(
    { senderId: uid(17), senderName: uname(17), senderAvatar: uavatar(17), content: 'Can someone explain what pseudocode is? I\'m confused about HW1.', channelId: cs110hw, createdAt: ts(3000) },
    { senderId: uid(1), senderName: uname(1), senderAvatar: uavatar(1), content: 'Pseudocode is like writing out your algorithm in plain English, structured like code but not real code', channelId: cs110hw, createdAt: ts(2990) },
    { senderId: uid(15), senderName: uname(15), senderAvatar: uavatar(15), content: 'Think of it as step-by-step instructions a human can follow', channelId: cs110hw, createdAt: ts(2985) },
    { senderId: uid(17), senderName: uname(17), senderAvatar: uavatar(17), content: 'Makes sense now! Thanks both of you!', channelId: cs110hw, createdAt: ts(2980) },
  );

  // CS 211 #general
  const cs211gen = channelId(1, 0);
  channelMsgs.push(
    { senderId: uid(4), senderName: uname(4), senderAvatar: uavatar(4), content: 'Dr. Miller\'s lectures are amazing. Really clear explanations.', channelId: cs211gen, createdAt: ts(5000) },
    { senderId: uid(8), senderName: uname(8), senderAvatar: uavatar(8), content: 'Agreed! His examples really help with understanding OOP.', channelId: cs211gen, createdAt: ts(4990) },
    { senderId: uid(11), senderName: uname(11), senderAvatar: uavatar(11), content: 'Anyone forming a study group for the midterm?', channelId: cs211gen, createdAt: ts(4500) },
    { senderId: uid(22), senderName: uname(22), senderAvatar: uavatar(22), content: 'I\'m in! We could meet at Fenwick Library', channelId: cs211gen, createdAt: ts(4490) },
    { senderId: uid(6), senderName: uname(6), senderAvatar: uavatar(6), content: 'Count me in too!', channelId: cs211gen, createdAt: ts(4480) },
    { senderId: uid(19), senderName: uname(19), senderAvatar: uavatar(19), content: 'Would Thursday at 6pm work for everyone?', channelId: cs211gen, createdAt: ts(4470) },
    { senderId: uid(17), senderName: uname(17), senderAvatar: uavatar(17), content: 'Thursday works for me!', channelId: cs211gen, createdAt: ts(4460) },
    { senderId: uid(28), senderName: uname(28), senderAvatar: uavatar(28), content: 'Same here. See you all then!', channelId: cs211gen, createdAt: ts(4450) },
  );

  // CS 211 #labs
  const cs211labs = channelId(1, 1);
  channelMsgs.push(
    { senderId: uid(4), senderName: uname(4), senderAvatar: uavatar(4), content: 'Lab 1 is due tonight! Has everyone started?', channelId: cs211labs, createdAt: ts(3500) },
    { senderId: uid(11), senderName: uname(11), senderAvatar: uavatar(11), content: 'Finished it! The tricky part was the constructor overloading', channelId: cs211labs, createdAt: ts(3490) },
    { senderId: uid(22), senderName: uname(22), senderAvatar: uavatar(22), content: 'I\'m stuck on the toString method. Any hints?', channelId: cs211labs, createdAt: ts(3480) },
    { senderId: uid(8), senderName: uname(8), senderAvatar: uavatar(8), content: 'Use String.format() — much cleaner than concatenation', channelId: cs211labs, createdAt: ts(3470) },
    { senderId: uid(22), senderName: uname(22), senderAvatar: uavatar(22), content: 'Got it working! Thanks Ryan!', channelId: cs211labs, createdAt: ts(3460) },
  );

  // CS 310 #general
  const cs310gen = channelId(3, 0);
  channelMsgs.push(
    { senderId: uid(0), senderName: uname(0), senderAvatar: uavatar(0), content: 'Data structures is easily my favorite class this semester', channelId: cs310gen, createdAt: ts(6000) },
    { senderId: uid(14), senderName: uname(14), senderAvatar: uavatar(14), content: 'Same! Dr. Zhang makes it so interesting', channelId: cs310gen, createdAt: ts(5990) },
    { senderId: uid(12), senderName: uname(12), senderAvatar: uavatar(12), content: 'As the TA, I can say you\'re all doing great so far!', channelId: cs310gen, createdAt: ts(5980) },
    { senderId: uid(3), senderName: uname(3), senderAvatar: uavatar(3), content: 'Daniel you\'re the best TA! Your review sessions are so helpful', channelId: cs310gen, createdAt: ts(5970) },
    { senderId: uid(5), senderName: uname(5), senderAvatar: uavatar(5), content: 'Anyone else obsessed with the red-black tree visualization tool Dr. Zhang shared?', channelId: cs310gen, createdAt: ts(5500) },
    { senderId: uid(18), senderName: uname(18), senderAvatar: uavatar(18), content: 'Yes! It makes rotations so much easier to understand', channelId: cs310gen, createdAt: ts(5490) },
    { senderId: uid(27), senderName: uname(27), senderAvatar: uavatar(27), content: 'Link please? I missed that lecture', channelId: cs310gen, createdAt: ts(5480) },
    { senderId: uid(25), senderName: uname(25), senderAvatar: uavatar(25), content: 'https://www.cs.usfca.edu/~galles/visualization/RedBlack.html', channelId: cs310gen, createdAt: ts(5470) },
  );

  // CS 310 #coding-problems
  const cs310code = channelId(3, 2);
  channelMsgs.push(
    { senderId: uid(14), senderName: uname(14), senderAvatar: uavatar(14), content: 'LeetCode problem of the day: Two Sum. Easy but a classic!', channelId: cs310code, createdAt: ts(2800) },
    { senderId: uid(0), senderName: uname(0), senderAvatar: uavatar(0), content: 'Solved it in O(n) with a hash map! 🎉', channelId: cs310code, createdAt: ts(2790) },
    { senderId: uid(18), senderName: uname(18), senderAvatar: uavatar(18), content: 'Nice! I forgot about using a map and did O(n²) brute force first', channelId: cs310code, createdAt: ts(2780) },
    { senderId: uid(5), senderName: uname(5), senderAvatar: uavatar(5), content: 'Pro tip: always think about hash maps when you need O(1) lookups', channelId: cs310code, createdAt: ts(2770) },
    { senderId: uid(12), senderName: uname(12), senderAvatar: uavatar(12), content: 'Great practice! This is exactly the kind of thinking that helps in interviews too', channelId: cs310code, createdAt: ts(2760) },
  );

  // CS 471 #general
  const cs471gen = channelId(6, 0);
  channelMsgs.push(
    { senderId: uid(0), senderName: uname(0), senderAvatar: uavatar(0), content: 'The shell project is really fun but so challenging!', channelId: cs471gen, createdAt: ts(4000) },
    { senderId: uid(10), senderName: uname(10), senderAvatar: uavatar(10), content: 'I spent 6 hours debugging pipe handling. Finally works!', channelId: cs471gen, createdAt: ts(3990) },
    { senderId: uid(2), senderName: uname(2), senderAvatar: uavatar(2), content: 'The trick is getting fork/exec right before worrying about pipes', channelId: cs471gen, createdAt: ts(3980) },
    { senderId: uid(16), senderName: uname(16), senderAvatar: uavatar(16), content: 'Don\'t forget to close unused file descriptors! That was my bug for 3 hours', channelId: cs471gen, createdAt: ts(3970) },
    { senderId: uid(14), senderName: uname(14), senderAvatar: uavatar(14), content: 'Valgrind is your best friend for memory leaks in this project', channelId: cs471gen, createdAt: ts(3960) },
    { senderId: uid(24), senderName: uname(24), senderAvatar: uavatar(24), content: 'Has anyone started the signal handling part yet?', channelId: cs471gen, createdAt: ts(3500) },
    { senderId: uid(8), senderName: uname(8), senderAvatar: uavatar(8), content: 'Yes! sigaction is way better than signal() for this', channelId: cs471gen, createdAt: ts(3490) },
    { senderId: uid(20), senderName: uname(20), senderAvatar: uavatar(20), content: 'Make sure to handle SIGINT and SIGTSTP properly', channelId: cs471gen, createdAt: ts(3480) },
    { senderId: uid(26), senderName: uname(26), senderAvatar: uavatar(26), content: 'Just finished the whole project! Feels amazing 🎉', channelId: cs471gen, createdAt: ts(2000) },
  );

  // CS 471 #linux-help
  const cs471linux = channelId(6, 2);
  channelMsgs.push(
    { senderId: uid(26), senderName: uname(26), senderAvatar: uavatar(26), content: 'Setting up WSL for this class was the best decision I\'ve made', channelId: cs471linux, createdAt: ts(5500) },
    { senderId: uid(8), senderName: uname(8), senderAvatar: uavatar(8), content: 'Highly recommend Ubuntu on WSL2. Works perfectly for all our assignments', channelId: cs471linux, createdAt: ts(5490) },
    { senderId: uid(0), senderName: uname(0), senderAvatar: uavatar(0), content: 'I use a VM but WSL is definitely faster', channelId: cs471linux, createdAt: ts(5480) },
    { senderId: uid(16), senderName: uname(16), senderAvatar: uavatar(16), content: 'Docker is another option if you want isolated environments', channelId: cs471linux, createdAt: ts(5470) },
  );

  // SWE 432 #general
  const swe432gen = channelId(8, 0);
  channelMsgs.push(
    { senderId: uid(3), senderName: uname(3), senderAvatar: uavatar(3), content: 'Web development is so rewarding. Built my first React app!', channelId: swe432gen, createdAt: ts(4800) },
    { senderId: uid(0), senderName: uname(0), senderAvatar: uavatar(0), content: 'React hooks changed the game. So much cleaner than class components', channelId: swe432gen, createdAt: ts(4790) },
    { senderId: uid(7), senderName: uname(7), senderAvatar: uavatar(7), content: 'If you need help with CSS, I\'m your person 🎨', channelId: swe432gen, createdAt: ts(4780) },
    { senderId: uid(18), senderName: uname(18), senderAvatar: uavatar(18), content: 'Anyone interested in forming a team for the final project?', channelId: swe432gen, createdAt: ts(4000) },
    { senderId: uid(23), senderName: uname(23), senderAvatar: uavatar(23), content: 'I\'m in! I can handle the backend with Express', channelId: swe432gen, createdAt: ts(3990) },
    { senderId: uid(11), senderName: uname(11), senderAvatar: uavatar(11), content: 'I\'ll join too! I love working on APIs', channelId: swe432gen, createdAt: ts(3980) },
    { senderId: uid(10), senderName: uname(10), senderAvatar: uavatar(10), content: 'I can do deployment and DevOps stuff!', channelId: swe432gen, createdAt: ts(3970) },
  );

  // SWE 432 #frontend
  const swe432fe = channelId(8, 1);
  channelMsgs.push(
    { senderId: uid(7), senderName: uname(7), senderAvatar: uavatar(7), content: 'Pro tip: use CSS Grid for layout instead of flexbox for 2D layouts', channelId: swe432fe, createdAt: ts(3600) },
    { senderId: uid(3), senderName: uname(3), senderAvatar: uavatar(3), content: 'Also, Tailwind CSS saves SO much time', channelId: swe432fe, createdAt: ts(3590) },
    { senderId: uid(18), senderName: uname(18), senderAvatar: uavatar(18), content: 'How do you handle state management in larger React apps?', channelId: swe432fe, createdAt: ts(3300) },
    { senderId: uid(0), senderName: uname(0), senderAvatar: uavatar(0), content: 'Context API for medium apps, Redux or Zustand for large ones', channelId: swe432fe, createdAt: ts(3290) },
    { senderId: uid(23), senderName: uname(23), senderAvatar: uavatar(23), content: 'I just discovered React Query for server state. Amazing!', channelId: swe432fe, createdAt: ts(3280) },
  );

  // CS 484 #general
  const cs484gen = channelId(7, 0);
  channelMsgs.push(
    { senderId: uid(2), senderName: uname(2), senderAvatar: uavatar(2), content: 'The Kaggle dataset for our project is really interesting', channelId: cs484gen, createdAt: ts(3000) },
    { senderId: uid(5), senderName: uname(5), senderAvatar: uavatar(5), content: 'I love how Dr. Sharma explains the math behind the algorithms', channelId: cs484gen, createdAt: ts(2990) },
    { senderId: uid(9), senderName: uname(9), senderAvatar: uavatar(9), content: 'Anyone else struggling with the preprocessing homework?', channelId: cs484gen, createdAt: ts(2800) },
    { senderId: uid(21), senderName: uname(21), senderAvatar: uavatar(21), content: 'Check out pandas .fillna() and .dropna() for missing values', channelId: cs484gen, createdAt: ts(2790) },
    { senderId: uid(16), senderName: uname(16), senderAvatar: uavatar(16), content: 'Also sklearn.preprocessing has great tools for normalization', channelId: cs484gen, createdAt: ts(2780) },
  );

  // CS 450 #general
  const cs450gen = channelId(13, 0);
  channelMsgs.push(
    { senderId: uid(2), senderName: uname(2), senderAvatar: uavatar(2), content: 'SQL is so satisfying when you get a complex query right', channelId: cs450gen, createdAt: ts(4200) },
    { senderId: uid(5), senderName: uname(5), senderAvatar: uavatar(5), content: 'JOINs were confusing at first but now I love them', channelId: cs450gen, createdAt: ts(4190) },
    { senderId: uid(12), senderName: uname(12), senderAvatar: uavatar(12), content: 'Wait until we get to window functions. Those are powerful!', channelId: cs450gen, createdAt: ts(4180) },
    { senderId: uid(27), senderName: uname(27), senderAvatar: uavatar(27), content: 'Anyone want to practice SQL together? I found a great site: sqlzoo.net', channelId: cs450gen, createdAt: ts(3800) },
    { senderId: uid(24), senderName: uname(24), senderAvatar: uavatar(24), content: 'Great find! Also check out LeetCode SQL problems', channelId: cs450gen, createdAt: ts(3790) },
    { senderId: uid(21), senderName: uname(21), senderAvatar: uavatar(21), content: 'Does anyone know if we can use PostgreSQL instead of MySQL for the project?', channelId: cs450gen, createdAt: ts(3200) },
    { senderId: uid(29), senderName: uname(29), senderAvatar: uavatar(29), content: 'Dr. Kim said any RDBMS is fine. I\'m using PostgreSQL', channelId: cs450gen, createdAt: ts(3190) },
  );

  // CS 425 #general
  const cs425gen = channelId(12, 0);
  channelMsgs.push(
    { senderId: uid(4), senderName: uname(4), senderAvatar: uavatar(4), content: 'Game programming is literally my dream class', channelId: cs425gen, createdAt: ts(5200) },
    { senderId: uid(19), senderName: uname(19), senderAvatar: uavatar(19), content: 'Unity is so powerful. I already have a prototype running!', channelId: cs425gen, createdAt: ts(5190) },
    { senderId: uid(3), senderName: uname(3), senderAvatar: uavatar(3), content: 'Anyone tried Godot? It\'s a great alternative to Unity', channelId: cs425gen, createdAt: ts(5180) },
    { senderId: uid(14), senderName: uname(14), senderAvatar: uavatar(14), content: 'Unreal Engine 5 is insane but the learning curve is steep', channelId: cs425gen, createdAt: ts(5170) },
    { senderId: uid(22), senderName: uname(22), senderAvatar: uavatar(22), content: 'Dr. Gray\'s demo of physics simulations was mind-blowing', channelId: cs425gen, createdAt: ts(4800) },
  );

  // MATH 203 #general
  const math203gen = channelId(10, 0);
  channelMsgs.push(
    { senderId: uid(6), senderName: uname(6), senderAvatar: uavatar(6), content: 'Linear algebra is surprisingly useful for CS. Lots of ML applications!', channelId: math203gen, createdAt: ts(4500) },
    { senderId: uid(22), senderName: uname(22), senderAvatar: uavatar(22), content: 'Professor Rivera makes the material accessible even for non-math people', channelId: math203gen, createdAt: ts(4490) },
    { senderId: uid(17), senderName: uname(17), senderAvatar: uavatar(17), content: '3Blue1Brown\'s Essence of Linear Algebra is an amazing supplement', channelId: math203gen, createdAt: ts(4480) },
    { senderId: uid(28), senderName: uname(28), senderAvatar: uavatar(28), content: 'Just watched it! Made eigenvalues click for me', channelId: math203gen, createdAt: ts(4470) },
  );

  // STAT 344 #general
  const stat344gen = channelId(11, 0);
  channelMsgs.push(
    { senderId: uid(1), senderName: uname(1), senderAvatar: uavatar(1), content: 'Statistics is way more interesting than I expected', channelId: stat344gen, createdAt: ts(4100) },
    { senderId: uid(13), senderName: uname(13), senderAvatar: uavatar(13), content: 'The normal distribution problems are fun!', channelId: stat344gen, createdAt: ts(4090) },
    { senderId: uid(7), senderName: uname(7), senderAvatar: uavatar(7), content: 'Hypothesis testing is tricky though. Keep mixing up Type I and Type II errors', channelId: stat344gen, createdAt: ts(3800) },
    { senderId: uid(29), senderName: uname(29), senderAvatar: uavatar(29), content: 'Type I = false positive (reject when true), Type II = false negative (fail to reject when false)', channelId: stat344gen, createdAt: ts(3790) },
    { senderId: uid(15), senderName: uname(15), senderAvatar: uavatar(15), content: 'Thanks Grace! That mnemonic helps', channelId: stat344gen, createdAt: ts(3780) },
  );

  // CS 262 #general
  const cs262gen = channelId(2, 0);
  channelMsgs.push(
    { senderId: uid(8), senderName: uname(8), senderAvatar: uavatar(8), content: 'C is so different from Java. No garbage collector means you actually have to think about memory!', channelId: cs262gen, createdAt: ts(5000) },
    { senderId: uid(4), senderName: uname(4), senderAvatar: uavatar(4), content: 'Segfaults are my new best frenemy', channelId: cs262gen, createdAt: ts(4990) },
    { senderId: uid(15), senderName: uname(15), senderAvatar: uavatar(15), content: 'GDB is really helpful for debugging. Learn it early!', channelId: cs262gen, createdAt: ts(4980) },
    { senderId: uid(11), senderName: uname(11), senderAvatar: uavatar(11), content: 'Pointer arithmetic messed me up for a whole weekend 😅', channelId: cs262gen, createdAt: ts(4700) },
    { senderId: uid(22), senderName: uname(22), senderAvatar: uavatar(22), content: 'Draw memory diagrams! They save so much time', channelId: cs262gen, createdAt: ts(4690) },
    { senderId: uid(19), senderName: uname(19), senderAvatar: uavatar(19), content: 'Dr. Wang\'s pointer visualization in class was the best explanation I\'ve seen', channelId: cs262gen, createdAt: ts(4680) },
    { senderId: uid(26), senderName: uname(26), senderAvatar: uavatar(26), content: 'Anyone having trouble with structs and pointers to structs?', channelId: cs262gen, createdAt: ts(4000) },
    { senderId: uid(8), senderName: uname(8), senderAvatar: uavatar(8), content: 'Use -> operator for pointer to struct members: ptr->field instead of (*ptr).field', channelId: cs262gen, createdAt: ts(3990) },
  );

  // CS 330 #general
  const cs330gen = channelId(4, 0);
  channelMsgs.push(
    { senderId: uid(14), senderName: uname(14), senderAvatar: uavatar(14), content: 'Formal methods is abstract but really elegant once you get it', channelId: cs330gen, createdAt: ts(4600) },
    { senderId: uid(4), senderName: uname(4), senderAvatar: uavatar(4), content: 'NFA to DFA conversion is like solving a puzzle', channelId: cs330gen, createdAt: ts(4590) },
    { senderId: uid(18), senderName: uname(18), senderAvatar: uavatar(18), content: 'The pumping lemma proofs are killing me though 😭', channelId: cs330gen, createdAt: ts(4100) },
    { senderId: uid(22), senderName: uname(22), senderAvatar: uavatar(22), content: 'Same. There\'s a good video by Neso Academy that explains it well', channelId: cs330gen, createdAt: ts(4090) },
    { senderId: uid(19), senderName: uname(19), senderAvatar: uavatar(19), content: 'The key is to find the right string to pump. Practice helps!', channelId: cs330gen, createdAt: ts(4080) },
  );

  // CS 367 #general
  const cs367gen = channelId(5, 0);
  channelMsgs.push(
    { senderId: uid(1), senderName: uname(1), senderAvatar: uavatar(1), content: 'x86 assembly is like learning a new language. Literally.', channelId: cs367gen, createdAt: ts(4400) },
    { senderId: uid(8), senderName: uname(8), senderAvatar: uavatar(8), content: 'MOV, ADD, SUB, CMP, JMP... it\'s actually very logical', channelId: cs367gen, createdAt: ts(4390) },
    { senderId: uid(15), senderName: uname(15), senderAvatar: uavatar(15), content: 'The cache lab is going to be interesting', channelId: cs367gen, createdAt: ts(4200) },
    { senderId: uid(20), senderName: uname(20), senderAvatar: uavatar(20), content: 'Understanding cache lines and associativity really helps with optimization', channelId: cs367gen, createdAt: ts(4190) },
    { senderId: uid(26), senderName: uname(26), senderAvatar: uavatar(26), content: 'The binary bomb lab was actually fun once I got GDB working', channelId: cs367gen, createdAt: ts(3500) },
  );

  // SWE 443 #general
  const swe443gen = channelId(9, 0);
  channelMsgs.push(
    { senderId: uid(3), senderName: uname(3), senderAvatar: uavatar(3), content: 'Microservices vs monolith debate is fascinating', channelId: swe443gen, createdAt: ts(4000) },
    { senderId: uid(10), senderName: uname(10), senderAvatar: uavatar(10), content: 'In production, we use microservices at my internship. It\'s complex but scalable', channelId: swe443gen, createdAt: ts(3990) },
    { senderId: uid(2), senderName: uname(2), senderAvatar: uavatar(2), content: 'Quality attributes tradeoffs are what make architecture interesting', channelId: swe443gen, createdAt: ts(3800) },
    { senderId: uid(7), senderName: uname(7), senderAvatar: uavatar(7), content: 'The ATAM evaluation method is actually used in industry!', channelId: swe443gen, createdAt: ts(3790) },
    { senderId: uid(29), senderName: uname(29), senderAvatar: uavatar(29), content: 'Dr. Foster\'s case studies are really insightful', channelId: swe443gen, createdAt: ts(3600) },
  );

  // More CS 110 #general conversations
  channelMsgs.push(
    { senderId: uid(28), senderName: uname(28), senderAvatar: uavatar(28), content: 'Can someone explain list comprehensions? I don\'t get the syntax', channelId: cs110gen, createdAt: ts(9100) },
    { senderId: uid(17), senderName: uname(17), senderAvatar: uavatar(17), content: '[x**2 for x in range(10)] creates a list of squares. Read it like "for each x in range, compute x squared"', channelId: cs110gen, createdAt: ts(9090) },
    { senderId: uid(6), senderName: uname(6), senderAvatar: uavatar(6), content: 'You can also add conditions: [x for x in range(10) if x % 2 == 0] gives even numbers', channelId: cs110gen, createdAt: ts(9080) },
    { senderId: uid(28), senderName: uname(28), senderAvatar: uavatar(28), content: 'Ohh that makes sense! Thanks!', channelId: cs110gen, createdAt: ts(9070) },
    { senderId: uid(13), senderName: uname(13), senderAvatar: uavatar(13), content: 'The homework 3 turtle graphics problem is so fun!', channelId: cs110gen, createdAt: ts(8500) },
    { senderId: uid(22), senderName: uname(22), senderAvatar: uavatar(22), content: 'I made mine draw the Mason logo lol', channelId: cs110gen, createdAt: ts(8490) },
    { senderId: uid(11), senderName: uname(11), senderAvatar: uavatar(11), content: 'Anyone know good Python resources beyond class? I want to practice more', channelId: cs110gen, createdAt: ts(7200) },
    { senderId: uid(23), senderName: uname(23), senderAvatar: uavatar(23), content: 'Python.org tutorial is great. Also Codecademy for interactive practice', channelId: cs110gen, createdAt: ts(7190) },
  );

  // More CS 211 #general conversations  
  channelMsgs.push(
    { senderId: uid(13), senderName: uname(13), senderAvatar: uavatar(13), content: 'OOP finally clicked for me after the lab on inheritance', channelId: cs211gen, createdAt: ts(8200) },
    { senderId: uid(1), senderName: uname(1), senderAvatar: uavatar(1), content: 'Same! Objects as blueprints makes so much sense now', channelId: cs211gen, createdAt: ts(8190) },
    { senderId: uid(17), senderName: uname(17), senderAvatar: uavatar(17), content: 'The project 2 deadline is Friday. Anyone want to form a study group?', channelId: cs211gen, createdAt: ts(7800) },
    { senderId: uid(6), senderName: uname(6), senderAvatar: uavatar(6), content: 'I\'m in! Let\'s meet Thursday evening', channelId: cs211gen, createdAt: ts(7790) },
    { senderId: uid(11), senderName: uname(11), senderAvatar: uavatar(11), content: 'Count me in too', channelId: cs211gen, createdAt: ts(7780) },
    { senderId: uid(28), senderName: uname(28), senderAvatar: uavatar(28), content: 'Quick Q: When should I use abstract class vs interface?', channelId: cs211gen, createdAt: ts(6900) },
    { senderId: uid(22), senderName: uname(22), senderAvatar: uavatar(22), content: 'Use abstract class when you have common implementation. Use interface when you just define behavior', channelId: cs211gen, createdAt: ts(6890) },
    { senderId: uid(17), senderName: uname(17), senderAvatar: uavatar(17), content: 'Also Java only allows single inheritance but multiple interfaces', channelId: cs211gen, createdAt: ts(6880) },
  );

  // More CS 310 #general conversations
  channelMsgs.push(
    { senderId: uid(0), senderName: uname(0), senderAvatar: uavatar(0), content: 'AVL trees are beautiful but rebalancing is tricky', channelId: cs310gen, createdAt: ts(7500) },
    { senderId: uid(2), senderName: uname(2), senderAvatar: uavatar(2), content: 'Remember the four rotation cases: LL, RR, LR, RL', channelId: cs310gen, createdAt: ts(7490) },
    { senderId: uid(8), senderName: uname(8), senderAvatar: uavatar(8), content: 'I use the balance factor to determine which rotation. BF = height(left) - height(right)', channelId: cs310gen, createdAt: ts(7480) },
    { senderId: uid(14), senderName: uname(14), senderAvatar: uavatar(14), content: 'Practice drawing the trees by hand. That helped me visualize better', channelId: cs310gen, createdAt: ts(7470) },
    { senderId: uid(22), senderName: uname(22), senderAvatar: uavatar(22), content: 'Graph algorithms are killing me. DFS vs BFS when?', channelId: cs310gen, createdAt: ts(6500) },
    { senderId: uid(12), senderName: uname(12), senderAvatar: uavatar(12), content: 'BFS for shortest path, DFS for topological sort. BFS is queue, DFS is stack', channelId: cs310gen, createdAt: ts(6490) },
    { senderId: uid(4), senderName: uname(4), senderAvatar: uavatar(4), content: 'The graph project is due next week. Anyone started?', channelId: cs310gen, createdAt: ts(5800) },
    { senderId: uid(0), senderName: uname(0), senderAvatar: uavatar(0), content: 'I\'m implementing Dijkstra\'s with a priority queue. It\'s complex', channelId: cs310gen, createdAt: ts(5790) },
    { senderId: uid(18), senderName: uname(18), senderAvatar: uavatar(18), content: 'Make sure to test with different graph shapes - dense, sparse, cyclic', channelId: cs310gen, createdAt: ts(5780) },
  );

  // More CS 471 #general conversations
  channelMsgs.push(
    { senderId: uid(10), senderName: uname(10), senderAvatar: uavatar(10), content: 'The shell project is massive but super rewarding', channelId: cs471gen, createdAt: ts(6800) },
    { senderId: uid(18), senderName: uname(18), senderAvatar: uavatar(18), content: 'Implementing pipes was the hardest part for me', channelId: cs471gen, createdAt: ts(6790) },
    { senderId: uid(12), senderName: uname(12), senderAvatar: uavatar(12), content: 'fork() and exec() took me a while to understand. Draw the process tree!', channelId: cs471gen, createdAt: ts(6780) },
    { senderId: uid(0), senderName: uname(0), senderAvatar: uavatar(0), content: 'My shell can run background processes now! So cool', channelId: cs471gen, createdAt: ts(6770) },
    { senderId: uid(4), senderName: uname(4), senderAvatar: uavatar(4), content: 'Producer-consumer problem with semaphores is elegant once you get it', channelId: cs471gen, createdAt: ts(6100) },
    { senderId: uid(8), senderName: uname(8), senderAvatar: uavatar(8), content: 'Deadlock prevention vs avoidance vs detection - which is best?', channelId: cs471gen, createdAt: ts(5900) },
    { senderId: uid(10), senderName: uname(10), senderAvatar: uavatar(10), content: 'Depends on system. Banking algorithm (avoidance) is common in practice', channelId: cs471gen, createdAt: ts(5890) },
  );

  // More SWE 432 #general conversations
  channelMsgs.push(
    { senderId: uid(16), senderName: uname(16), senderAvatar: uavatar(16), content: 'React hooks changed my life. No more class components!', channelId: swe432gen, createdAt: ts(6700) },
    { senderId: uid(24), senderName: uname(24), senderAvatar: uavatar(24), content: 'useState and useEffect cover 90% of what you need', channelId: swe432gen, createdAt: ts(6690) },
    { senderId: uid(18), senderName: uname(18), senderAvatar: uavatar(18), content: 'Don\'t forget useContext for global state without prop drilling', channelId: swe432gen, createdAt: ts(6680) },
    { senderId: uid(2), senderName: uname(2), senderAvatar: uavatar(2), content: 'Our team project API is almost done. 15 endpoints so far', channelId: swe432gen, createdAt: ts(6300) },
    { senderId: uid(5), senderName: uname(5), senderAvatar: uavatar(5), content: 'Make sure to document with Swagger/OpenAPI!', channelId: swe432gen, createdAt: ts(6290) },
    { senderId: uid(12), senderName: uname(12), senderAvatar: uavatar(12), content: 'CSS Grid vs Flexbox - when to use which?', channelId: swe432gen, createdAt: ts(5700) },
    { senderId: uid(24), senderName: uname(24), senderAvatar: uavatar(24), content: 'Grid for 2D layouts (rows AND columns), Flexbox for 1D (either rows OR columns)', channelId: swe432gen, createdAt: ts(5690) },
    { senderId: uid(0), senderName: uname(0), senderAvatar: uavatar(0), content: 'The web security lecture on XSS was scary. We need to sanitize everything!', channelId: swe432gen, createdAt: ts(5200) },
  );

  // More CS 484 #general conversations
  channelMsgs.push(
    { senderId: uid(21), senderName: uname(21), senderAvatar: uavatar(21), content: 'K-means clustering is so cool. Watching the centroids converge is mesmerizing', channelId: cs484gen, createdAt: ts(5600) },
    { senderId: uid(27), senderName: uname(27), senderAvatar: uavatar(27), content: 'How do you choose the right k value?', channelId: cs484gen, createdAt: ts(5590) },
    { senderId: uid(19), senderName: uname(19), senderAvatar: uavatar(19), content: 'Use the elbow method - plot inertia vs k and look for the "elbow" point', channelId: cs484gen, createdAt: ts(5580) },
    { senderId: uid(5), senderName: uname(5), senderAvatar: uavatar(5), content: 'Decision trees are intuitive but they overfit easily', channelId: cs484gen, createdAt: ts(5100) },
    { senderId: uid(13), senderName: uname(13), senderAvatar: uavatar(13), content: 'That\'s why we use random forests! Ensemble methods FTW', channelId: cs484gen, createdAt: ts(5090) },
    { senderId: uid(29), senderName: uname(29), senderAvatar: uavatar(29), content: 'The Kaggle competition project is fun. My accuracy is only 72% though 😅', channelId: cs484gen, createdAt: ts(4600) },
    { senderId: uid(21), senderName: uname(21), senderAvatar: uavatar(21), content: 'Try feature scaling and cross-validation. Got me to 84%!', channelId: cs484gen, createdAt: ts(4590) },
  );

  // More CS 450 #general conversations
  channelMsgs.push(
    { senderId: uid(2), senderName: uname(2), senderAvatar: uavatar(2), content: 'I wrote a 5-table JOIN query today and it worked first try. I feel like a wizard 🧙', channelId: cs450gen, createdAt: ts(5400) },
    { senderId: uid(24), senderName: uname(24), senderAvatar: uavatar(24), content: 'That\'s rare lol. Usually there\'s a missing ON clause somewhere', channelId: cs450gen, createdAt: ts(5390) },
    { senderId: uid(18), senderName: uname(18), senderAvatar: uavatar(18), content: 'Database normalization is tedious but prevents so many headaches later', channelId: cs450gen, createdAt: ts(4900) },
    { senderId: uid(5), senderName: uname(5), senderAvatar: uavatar(5), content: '3NF is usually good enough. BCNF is overkill for most apps', channelId: cs450gen, createdAt: ts(4890) },
    { senderId: uid(10), senderName: uname(10), senderAvatar: uavatar(10), content: 'Indexes are magic for query performance. Added one index, query went from 2s to 20ms!', channelId: cs450gen, createdAt: ts(4300) },
    { senderId: uid(29), senderName: uname(29), senderAvatar: uavatar(29), content: 'But too many indexes slow down writes. It\'s always a tradeoff', channelId: cs450gen, createdAt: ts(4290) },
  );

  // More CS 425 #general conversations
  channelMsgs.push(
    { senderId: uid(4), senderName: uname(4), senderAvatar: uavatar(4), content: 'Rigidbody physics in Unity is so much fun to play with', channelId: cs425gen, createdAt: ts(4800) },
    { senderId: uid(12), senderName: uname(12), senderAvatar: uavatar(12), content: 'My character keeps falling through the floor. Any tips?', channelId: cs425gen, createdAt: ts(4790) },
    { senderId: uid(19), senderName: uname(19), senderAvatar: uavatar(19), content: 'Check collision detection mode. Use Continuous for fast objects', channelId: cs425gen, createdAt: ts(4780) },
    { senderId: uid(8), senderName: uname(8), senderAvatar: uavatar(8), content: 'Also make sure your floor collider is thick enough', channelId: cs425gen, createdAt: ts(4770) },
    { senderId: uid(21), senderName: uname(21), senderAvatar: uavatar(21), content: 'The particle systems in Unity are gorgeous. Making explosions is too fun', channelId: cs425gen, createdAt: ts(4200) },
  );

  // More MATH 203 #general conversations
  channelMsgs.push(
    { senderId: uid(6), senderName: uname(6), senderAvatar: uavatar(6), content: 'Computing eigenvalues by hand is tedious. Determinants everywhere!', channelId: math203gen, createdAt: ts(5300) },
    { senderId: uid(22), senderName: uname(22), senderAvatar: uavatar(22), content: 'At least we can use calculators for 3x3 and larger matrices', channelId: math203gen, createdAt: ts(5290) },
    { senderId: uid(17), senderName: uname(17), senderAvatar: uavatar(17), content: 'Matrix multiplication order matters! AB ≠ BA in general', channelId: math203gen, createdAt: ts(4700) },
    { senderId: uid(28), senderName: uname(28), senderAvatar: uavatar(28), content: 'The exam is next week. Study group anyone?', channelId: math203gen, createdAt: ts(4100) },
    { senderId: uid(7), senderName: uname(7), senderAvatar: uavatar(7), content: 'I\'m down! Thursday 5pm at library?', channelId: math203gen, createdAt: ts(4090) },
  );

  // More STAT 344 #general conversations
  channelMsgs.push(
    { senderId: uid(23), senderName: uname(23), senderAvatar: uavatar(23), content: 'Confidence intervals are starting to make sense!', channelId: stat344gen, createdAt: ts(4600) },
    { senderId: uid(11), senderName: uname(11), senderAvatar: uavatar(11), content: 'Remember: wider interval = higher confidence or smaller sample size', channelId: stat344gen, createdAt: ts(4590) },
    { senderId: uid(29), senderName: uname(29), senderAvatar: uavatar(29), content: 'The R programming is actually fun once you learn the syntax', channelId: stat344gen, createdAt: ts(4200) },
    { senderId: uid(15), senderName: uname(15), senderAvatar: uavatar(15), content: 'dplyr makes data manipulation so much easier than base R', channelId: stat344gen, createdAt: ts(4190) },
  );

  // More CS 262 #general conversations
  channelMsgs.push(
    { senderId: uid(26), senderName: uname(26), senderAvatar: uavatar(26), content: 'Malloc/free pairing is crucial. Use Valgrind to catch leaks!', channelId: cs262gen, createdAt: ts(5500) },
    { senderId: uid(22), senderName: uname(22), senderAvatar: uavatar(22), content: 'Every malloc needs a corresponding free. Draw your memory!', channelId: cs262gen, createdAt: ts(5490) },
    { senderId: uid(11), senderName: uname(11), senderAvatar: uavatar(11), content: 'String handling in C is so different from Java. Null terminators are important!', channelId: cs262gen, createdAt: ts(4800) },
    { senderId: uid(8), senderName: uname(8), senderAvatar: uavatar(8), content: 'Always allocate strlen(s) + 1 for the null character', channelId: cs262gen, createdAt: ts(4790) },
  );

  // More CS 330 #general conversations
  channelMsgs.push(
    { senderId: uid(14), senderName: uname(14), senderAvatar: uavatar(14), content: 'Automata theory is surprisingly applicable to real CS problems', channelId: cs330gen, createdAt: ts(5200) },
    { senderId: uid(18), senderName: uname(18), senderAvatar: uavatar(18), content: 'Regex engines use finite automata under the hood!', channelId: cs330gen, createdAt: ts(5190) },
    { senderId: uid(4), senderName: uname(4), senderAvatar: uavatar(4), content: 'The Turing machine tape model is mind-bending but cool', channelId: cs330gen, createdAt: ts(4600) },
  );

  // More CS 367 #general conversations  
  channelMsgs.push(
    { senderId: uid(8), senderName: uname(8), senderAvatar: uavatar(8), content: 'Cache optimization literally made my code 10x faster. This class is eye-opening', channelId: cs367gen, createdAt: ts(5100) },
    { senderId: uid(20), senderName: uname(20), senderAvatar: uavatar(20), content: 'Spatial locality and temporal locality - keep data together and reuse it', channelId: cs367gen, createdAt: ts(5090) },
    { senderId: uid(26), senderName: uname(26), senderAvatar: uavatar(26), content: 'The malloc lab is brutal. Dynamic memory allocator from scratch!', channelId: cs367gen, createdAt: ts(4500) },
  );

  // More SWE 443 #general conversations
  channelMsgs.push(
    { senderId: uid(10), senderName: uname(10), senderAvatar: uavatar(10), content: 'Learned about the C4 model for architecture diagrams today. Super useful!', channelId: swe443gen, createdAt: ts(4500) },
    { senderId: uid(16), senderName: uname(16), senderAvatar: uavatar(16), content: 'Context, Container, Component, Code - different levels of abstraction', channelId: swe443gen, createdAt: ts(4490) },
    { senderId: uid(3), senderName: uname(3), senderAvatar: uavatar(3), content: 'Architecture tradeoffs are everywhere. Performance vs maintainability, etc', channelId: swe443gen, createdAt: ts(4200) },
  );

  for (const m of channelMsgs) {
    await Message.create(m);
  }
  console.log(`Created ${channelMsgs.length} channel messages`);

  // ═══════════════════════════════════════════
  // DM MESSAGES (90+ DMs between various users)
  // ═══════════════════════════════════════════
  const dmMsgs = [];
  const dm = (from, to, content, minutesAgo) => {
    const participants = [uid(from), uid(to)].sort();
    return {
      senderId: uid(from), senderName: uname(from), senderAvatar: uavatar(from),
      content, dmPartnerId: uid(to), dmParticipants: participants,
      createdAt: ts(minutesAgo),
    };
  };

  // Alex <-> Maria
  dmMsgs.push(
    dm(0, 1, 'Hey Maria! Want to study for CS 367 together?', 10000),
    dm(1, 0, 'Sure! When are you free?', 9990),
    dm(0, 1, 'How about tomorrow at 3pm in Johnson Center?', 9980),
    dm(1, 0, 'Perfect! I\'ll bring my notes', 9970),
    dm(0, 1, 'Great! See you then 👍', 9960),
    dm(1, 0, 'Just got here! I\'m on the second floor near the windows', 8500),
    dm(0, 1, 'On my way! Be there in 5', 8490),
  );

  // David <-> Emily
  dmMsgs.push(
    dm(2, 5, 'Emily, I was looking at your data mining presentation. Really impressive!', 8000),
    dm(5, 2, 'Thanks David! Your NLP research is super cool too', 7990),
    dm(2, 5, 'Want to collaborate on the CS 484 project? I think our skills complement each other', 7980),
    dm(5, 2, 'Absolutely! I was hoping someone would ask. Let\'s talk details', 7970),
    dm(2, 5, 'Are you free this Thursday after class?', 7960),
    dm(5, 2, 'Yes! Let\'s meet at the data science lab', 7950),
  );

  // Sarah <-> Jessica
  dmMsgs.push(
    dm(3, 7, 'Hey Jessica! Love your UI designs in the SWE 432 showcase', 7500),
    dm(7, 3, 'Thanks Sarah! Your Flutter projects are amazing', 7490),
    dm(3, 7, 'We should team up for the SWE 443 architecture project', 7480),
    dm(7, 3, 'I\'d love that! I was thinking about doing a food delivery app architecture', 7470),
    dm(3, 7, 'Ooh that\'s a great idea! We can model different quality attributes', 7460),
    dm(7, 3, 'Perfect. Let me sketch some diagrams and I\'ll share them', 7450),
    dm(3, 7, 'Can\'t wait! Let me know when they\'re ready', 7440),
  );

  // James <-> Mason
  dmMsgs.push(
    dm(4, 22, 'Hey Mason! How\'s CS 211 going?', 6500),
    dm(22, 4, 'Good! The inheritance lab was tricky but I figured it out', 6490),
    dm(4, 22, 'Nice! I\'m working on the game programming project. Want to see it?', 6480),
    dm(22, 4, 'Definitely! Is it Unity?', 6470),
    dm(4, 22, 'Yes! A 2D space shooter. The physics are fun', 6460),
    dm(22, 4, 'That sounds awesome! Can I try it?', 6450),
  );

  // Michael <-> Mia
  dmMsgs.push(
    dm(6, 17, 'Hey Mia! How are you liking Mason so far?', 9000),
    dm(17, 6, 'It\'s great! CS 110 is really interesting. How about you?', 8990),
    dm(6, 17, 'Same! I\'m also taking Math 203 which is challenging but useful', 8980),
    dm(17, 6, 'Oh I heard linear algebra is important for CS. Good choice!', 8970),
    dm(6, 17, 'Want to form a study group with some other freshmen?', 8960),
    dm(17, 6, 'Yes! Let\'s include Alexander too, he\'s in our CS 110 class', 8950),
  );

  // Daniel <-> Ethan
  dmMsgs.push(
    dm(12, 14, 'Ethan, office hours feedback: a lot of students are confused about BSTs', 5000),
    dm(14, 12, 'Thanks for the heads up! I\'ll prepare extra examples', 4990),
    dm(12, 14, 'Also, can you help me with my OS project? I\'m stuck on page replacement', 4980),
    dm(14, 12, 'Sure! FIFO or LRU?', 4970),
    dm(12, 14, 'LRU. The clock algorithm implementation is tricky', 4960),
    dm(14, 12, 'Let me look at your code after class today', 4950),
  );

  // Chris <-> Noah
  dmMsgs.push(
    dm(10, 16, 'Noah, how\'s Amazon? Any tips for someone applying?', 6000),
    dm(16, 10, 'It\'s great! Focus on system design and behavioral questions', 5990),
    dm(10, 16, 'Did your OS and architecture classes help?', 5980),
    dm(16, 10, 'Absolutely! The OS concepts come up a lot in distributed systems interviews', 5970),
    dm(10, 16, 'I\'ll focus on those. Thanks for the advice!', 5960),
    dm(16, 10, 'Anytime! Let me know if you want to do mock interviews', 5950),
  );

  // Olivia <-> Liam
  dmMsgs.push(
    dm(11, 18, 'Hey Liam! Your React component library is on GitHub right?', 5500),
    dm(18, 11, 'Yes! github.com/liam-walker/react-mason-ui. Feel free to contribute!', 5490),
    dm(11, 18, 'I\'d love to add some backend integration features', 5480),
    dm(18, 11, 'That would be amazing! Create a PR anytime', 5470),
    dm(11, 18, 'Will do! I have some ideas for API hooks', 5460),
  );

  // Ashley <-> Lucas
  dmMsgs.push(
    dm(9, 20, 'Lucas! Want to work on the CTF challenge together?', 7000),
    dm(20, 9, 'Absolutely! Which category: web or crypto?', 6990),
    dm(9, 20, 'Let\'s try the web one first. I found an SQL injection vector', 6980),
    dm(20, 9, 'Nice! I\'ll handle the XSS part. Meet in the cyber lab?', 6970),
    dm(9, 20, 'Perfect. See you in 30 minutes', 6960),
    dm(20, 9, 'We got second place! 🏆', 5000),
    dm(9, 20, 'Amazing teamwork! Let\'s go for first next time', 4990),
  );

  // Sophia <-> Ella
  dmMsgs.push(
    dm(13, 27, 'Hey Ella! I\'m thinking of switching to Data Science. Any advice?', 6200),
    dm(27, 13, 'It\'s a great major! The stats and programming combo is really marketable', 6190),
    dm(13, 27, 'What tools do you use most?', 6180),
    dm(27, 13, 'Python, R, pandas, scikit-learn, and Jupyter notebooks mostly', 6170),
    dm(13, 27, 'I already love Python from STAT 344. Sounds perfect!', 6160),
    dm(27, 13, 'You\'ll love it! Let me know if you need help with anything', 6150),
  );

  // Benjamin <-> Grace
  dmMsgs.push(
    dm(24, 29, 'Grace, your cloud architecture presentation was excellent', 4500),
    dm(29, 24, 'Thanks Benjamin! Your blockchain demo was mind-blowing', 4490),
    dm(24, 29, 'Want to combine ideas? Blockchain on cloud infrastructure?', 4480),
    dm(29, 24, 'That could be a cool senior project idea!', 4470),
    dm(24, 29, 'Let\'s propose it to Dr. Foster', 4460),
    dm(29, 24, 'Great idea! I\'ll draft an outline this weekend', 4450),
  );

  // Harper <-> Jack
  dmMsgs.push(
    dm(25, 26, 'Jack, I found a bug in the SWE 432 project. Can you take a look?', 3500),
    dm(26, 25, 'Sure! Is it the authentication middleware?', 3490),
    dm(25, 26, 'Yes! The JWT expiration check is off by one hour', 3480),
    dm(26, 25, 'Found it! The timezone conversion was wrong. Fixed and pushed.', 3470),
    dm(25, 26, 'You\'re the best! QA approved ✅', 3460),
  );

  // Ava <-> Alexander
  dmMsgs.push(
    dm(19, 28, 'Alexander, welcome to CS! If you need help with 211 labs let me know', 8200),
    dm(28, 19, 'Thanks Ava! Actually, I\'m stuck on the inheritance exercise', 8190),
    dm(19, 28, 'Think of it like a family tree. The child class inherits everything from the parent', 8180),
    dm(28, 19, 'Oh! That makes sense. So I need to call super() in the constructor?', 8170),
    dm(19, 28, 'Exactly! You\'re getting it 😄', 8160),
    dm(28, 19, 'Got it working! Thank you so much!', 8150),
  );

  // Chris <-> Emma
  dmMsgs.push(
    dm(10, 14, 'Emma, want to partner up for the OS project?', 7000),
    dm(14, 10, 'Yes! I\'ve been meaning to ask you. Your shell implementation was impressive', 6990),
    dm(10, 14, 'Thanks! Let\'s start with the design doc this weekend', 6980),
    dm(14, 10, 'Perfect. Saturday afternoon works for me', 6970),
  );

  // Olivia <-> Owen
  dmMsgs.push(
    dm(3, 9, 'Owen, the cybersecurity CTF was amazing! Want to do another one?', 5500),
    dm(9, 3, 'Definitely! Check out PicoCTF - it has permanent challenges', 5490),
    dm(3, 9, 'Nice! Let\'s team up and try some this week', 5480),
    dm(9, 3, 'I\'m free Tuesday and Thursday evenings', 5470),
    dm(3, 9, 'Thursday works! See you then', 5460),
  );

  // Sophia <-> Lucas
  dmMsgs.push(
    dm(2, 24, 'Lucas, your blockchain workshop was fascinating', 6200),
    dm(24, 2, 'Glad you enjoyed it! Smart contracts are the future', 6190),
    dm(2, 24, 'Can you recommend resources to dive deeper?', 6180),
    dm(24, 2, 'CryptoZombies is great for learning Solidity. Also Ethereum docs', 6170),
    dm(2, 24, 'Bookmarked! Thanks Lucas', 6160),
  );

  // David <-> Charlotte
  dmMsgs.push(
    dm(4, 23, 'Charlotte, photography walk was fun! Want to do one at sunset sometime?', 4900),
    dm(23, 4, 'Yes! Golden hour photos would be beautiful', 4890),
    dm(4, 23, 'How about Friday evening? Weather should be nice', 4880),
    dm(23, 4, 'Perfect! Meet at Mason Pond at 6:30pm?', 4870),
    dm(4, 23, 'See you there 📸', 4860),
  );

  // Isabella <-> Ethan
  dmMsgs.push(
    dm(5, 22, 'Ethan, I heard you interned at Amazon. Any interview tips?', 7500),
    dm(22, 5, 'Practice LeetCode medium problems. Amazon loves their algorithms', 7490),
    dm(5, 22, 'Did you use any specific study plan?', 7480),
    dm(22, 5, 'I did Blind 75 plus system design primer on GitHub', 7470),
    dm(5, 22, 'That\'s perfect! Thank you so much', 7460),
    dm(22, 5, 'Anytime! Let me know if you want to do mock interviews', 7450),
    dm(5, 22, 'That would be amazing! Next week?', 7440),
  );

  // William <-> Mia
  dmMsgs.push(
    dm(18, 11, 'Mia, coffee & code tmrw? Need to finish the React project', 3900),
    dm(11, 18, 'Sure! Starbucks at 2pm?', 3890),
    dm(18, 11, 'Perfect. Bringing my laptop', 3880),
    dm(11, 18, 'Same. See you there ☕', 3870),
  );

  // Lily <-> Mason
  dmMsgs.push(
    dm(21, 16, 'Mason, your resume review session was super helpful', 5100),
    dm(16, 21, 'Happy to help! Your project descriptions are strong now', 5090),
    dm(21, 16, 'I have an interview next week thanks to your suggestions', 5080),
    dm(16, 21, 'That\'s awesome! Which company?', 5070),
    dm(21, 16, 'Google internship! Wish me luck', 5060),
    dm(16, 21, 'You got this! 🎉', 5050),
  );

  // James <-> Amelia
  dmMsgs.push(
    dm(8, 25, 'Amelia, trivia night was a blast! We should recruit more for next time', 4400),
    dm(25, 8, 'Agreed! IT category was harder than I thought lol', 4390),
    dm(8, 25, '2nd place is still good! They asked some obscure networking questions', 4380),
    dm(25, 8, 'There\'s another one next month. Let\'s form a bigger team', 4370),
    dm(8, 25, 'I\'m in! Already thinking of team name ideas', 4360),
  );

  // Liam <-> Ella
  dmMsgs.push(
    dm(15, 27, 'Ella, can you explain gradient descent? I don\'t get it from the slides', 5800),
    dm(27, 15, 'Think of it like hiking down a mountain. You take steps in the direction that goes most downhill', 5790),
    dm(15, 27, 'And the learning rate is how big the steps are?', 5780),
    dm(27, 15, 'Exactly! Too big and you overshoot, too small and it takes forever', 5770),
    dm(15, 27, 'Ahh that makes way more sense! Thanks Ella', 5760),
  );

  // Noah <-> Evelyn
  dmMsgs.push(
    dm(20, 13, 'Evelyn, D&D session was epic! That dragon fight was intense', 4080),
    dm(13, 20, 'Right?! I can\'t believe we survived with only 3 HP left', 4070),
    dm(20, 13, 'Your healing spell saved us at the last second', 4060),
    dm(13, 20, 'Team work! Next session is in two weeks', 4050),
    dm(20, 13, 'Can\'t wait. I\'m leveling up my character tonight', 4040),
  );

  // Michael <-> Harper
  dmMsgs.push(
    dm(12, 25, 'Harper, your Unity game demo was impressive!', 5300),
    dm(25, 12, 'Thanks! Still lots of bugs to fix though', 5290),
    dm(12, 25, 'Want help with the physics? I implemented ragdoll in mine', 5280),
    dm(25, 12, 'That would be awesome! Tomorrow afternoon?', 5270),
    dm(12, 25, 'Works for me. Innovation Hall lab?', 5260),
    dm(25, 12, 'See you there!', 5250),
  );

  // Daniel <-> Abigail
  dmMsgs.push(
    dm(7, 1, 'Abigail, stats homework is killing me. Study together?', 4700),
    dm(1, 7, 'Same! Hypothesis testing is confusing', 4690),
    dm(7, 1, 'Library tonight at 7?', 4680),
    dm(1, 7, 'Perfect. I\'ll bring snacks', 4670),
  );

  // Henry <-> Emily
  dmMsgs.push(
    dm(26, 29, 'Emily, Linux install fest was great! My dual boot works perfectly now', 3800),
    dm(29, 26, 'Nice! Which distro did you choose?', 3790),
    dm(26, 29, 'Ubuntu 22.04. It\'s fast and stable', 3780),
    dm(29, 26, 'Good choice for beginners. Let me know if you have questions', 3770),
    dm(26, 29, 'Will do! Loving the terminal so far', 3760),
  );

  // Samuel <-> Aria
  dmMsgs.push(
    dm(12, 17, 'Aria, your poster for the hackathon is incredible!', 6500),
    dm(17, 12, 'Thank you! Used Figma for the design', 6490),
    dm(12, 17, 'Can you teach me Figma sometime? My designs are terrible', 6480),
    dm(17, 12, 'Haha sure! It\'s easier than it looks. This weekend?', 6470),
    dm(12, 17, 'Sam works! I\'ll bring coffee', 6460),
  );

  // Jackson <-> Scarlett
  dmMsgs.push(
    dm(0, 13, 'Scarlett, MasonHacks was insane! 24 hours of pure coding', 2900),
    dm(13, 0, 'Best hackathon ever! Did your team finish the project?', 2890),
    dm(0, 13, 'Barely! Submitted at 11:59am with 1 minute to spare', 2880),
    dm(13, 0, 'Classic hackathon timing lol. What did you build?', 2870),
    dm(0, 13, 'AI-powered study scheduler. Uses GPT to optimize study time', 2860),
    dm(13, 0, 'That\'s so cool! Did you win anything?', 2850),
    dm(0, 13, 'Best use of AI category! Won $500 and swag', 2840),
    dm(13, 0, 'Congrats!! 🎊', 2830),
  );

  // Aiden <-> Chloe
  dmMsgs.push(
    dm(6, 7, 'Chloe, got my internship offer from Microsoft!', 6900),
    dm(7, 6, 'AIDEN THAT\'S AMAZING! I knew you\'d get it!', 6890),
    dm(6, 7, 'Your help with system design questions was invaluable', 6880),
    dm(7, 6, 'We should celebrate! Dinner this weekend?', 6870),
    dm(6, 7, 'Absolutely! My treat since you helped so much', 6860),
  );

  // Logan <-> Zoey
  dmMsgs.push(
    dm(17, 19, 'Zoey, rock climbing was so fun! I\'m definitely sore today though', 3600),
    dm(19, 17, 'Haha same! But that\'s how you know it was a good workout', 3590),
    dm(17, 19, 'Want to make it a weekly thing?', 3580),
    dm(19, 17, 'I\'m down! Every Saturday morning?', 3570),
    dm(17, 19, 'Perfect! I\'ll look for group deals', 3560),
  );

  // Elijah <-> Nora
  dmMsgs.push(
    dm(16, 27, 'Nora, your data science project results are impressive', 5400),
    dm(27, 16, '89% accuracy! Feature engineering made the difference', 5390),
    dm(16, 27, 'Can I see your code? Want to learn your approach', 5380),
    dm(27, 16, 'Sure! Pushed to GitHub. Link: github.com/noraml/kaggle-project', 5370),
    dm(16, 27, 'Awesome, checking it out now. Thanks!', 5360),
  );

  // Benjamin <-> Stella
  dmMsgs.push(
    dm(24, 23, 'Stella, movie night recommendation: watch Hackers (1995) next!', 3300),
    dm(23, 24, 'Classic hacker movie! I\'ll add it to the list', 3290),
    dm(24, 23, 'Cheesy but fun. Also WarGames if you haven\'t seen it', 3280),
    dm(23, 24, 'Building a whole CS movie series! Love it', 3270),
  );

  // Theodore <-> Luna
  dmMsgs.push(
    dm(9, 21, 'Luna, your ML paper presentation was excellent', 6100),
    dm(21, 9, 'Thanks! Transformers are fascinating', 6090),
    dm(9, 21, 'The attention mechanism diagram really helped', 6080),
    dm(21, 9, 'Want to collaborate on a project using transformers?', 6070),
    dm(9, 21, 'Definitely! NLP or vision?', 6060),
    dm(21, 9, 'Let\'s do NLP - sentiment analysis on social media', 6050),
    dm(9, 21, 'Great idea! I\'ll set up a repo this week', 6040),
  );

  // Matthew <-> Violet
  dmMsgs.push(
    dm(1, 25, 'Violet, karaoke was hilarious! Your Bohemian Rhapsody was legendary', 3100),
    dm(25, 1, 'Haha thanks! You did great on Journey', 3090),
    dm(1, 25, 'Don\'t Stop Believin\' is my go-to. We should do it monthly', 3080),
    dm(25, 1, 'Agreed! Already planning the next one', 3070),
  );

  // Carter <-> Penelope
  dmMsgs.push(
    dm(8, 11, 'Penelope, your notes from data structures are awesome! Can I borrow them?', 7200),
    dm(11, 8, 'Sure! I\'ll share my OneNote link', 7190),
    dm(8, 11, 'You\'re a lifesaver! Exam is in 3 days and I\'m behind', 7180),
    dm(11, 8, 'Happy to help! LMK if you want to quiz each other', 7170),
    dm(8, 11, 'Yes please! Tomorrow morning?', 7160),
  );

  for (const m of dmMsgs) {
    await Message.create(m);
  }
  console.log(`Created ${dmMsgs.length} DM messages`);

  // ═══════════════════════════════════════════
  // FEED POSTS (50+ posts)
  // ═══════════════════════════════════════════
  const postsData = [];
  const post = (userIdx, content, minutesAgo, likes = 0, likedByIdxs = []) => ({
    authorId: uid(userIdx), authorName: uname(userIdx), authorAvatar: uavatar(userIdx),
    authorMajor: umajor(userIdx), content, likes, likedBy: likedByIdxs.map(i => uid(i)),
    createdAt: ts(minutesAgo),
  });

  postsData.push(
    post(0, 'Just aced my Data Structures midterm! All those late nights studying paid off 🎉', 100, 18, [1,2,3,4,5,6,7,8,10,12,14,18,25,27,3,5,12,14]),
    post(1, 'Cybersecurity tip of the day: Always use 2FA on your accounts! 🔒', 200, 12, [0,2,9,15,20,21,24,29,3,5,7,8]),
    post(2, 'My NLP model finally achieved 95% accuracy on sentiment analysis. Months of work!', 300, 22, [0,1,3,5,6,7,9,10,12,14,16,18,21,24,27,29,4,8,11,13,17,19]),
    post(3, 'Flutter 4.0 is out and it\'s amazing! Who else is upgrading their projects? 📱', 400, 15, [0,4,7,8,11,18,22,23,25,2,5,10,14,16,19]),
    post(4, 'My 2D platformer game is coming along nicely! Added enemy AI today 🎮', 500, 14, [0,3,12,19,22,28,14,1,5,8,6,17,2,9]),
    post(5, 'Capital One internship update: Working on a fraud detection model. Data science is amazing!', 600, 20, [0,1,2,3,7,9,12,13,16,21,24,27,29,6,10,14,18,22,25,28]),
    post(6, 'First semester at Mason and I already love it here! Great people, great professors 💚💛', 700, 25, [0,1,2,3,4,5,7,8,9,10,11,12,13,14,15,16,17,18,19,20,22,23,28,27,25]),
    post(7, 'UX design workshop this Friday! Open to all majors. Johnson Center Room 327 at 3pm', 800, 9, [0,3,8,11,18,23,25,29,7]),
    post(8, 'Finally got my kernel module to compile without segfaulting. It\'s the small victories 😅', 900, 11, [0,2,10,14,16,20,24,26,4,1,8]),
    post(9, 'Just passed my OSCP certification! 3 months of intense studying. So worth it! 🏆', 1000, 28, [0,1,2,3,4,5,6,7,8,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]),
    post(10, 'Cloud deployment tip: Use GitHub Actions for CI/CD. It integrates perfectly with AWS', 1100, 8, [0,2,7,11,16,18,26,29]),
    post(11, 'Written my first Go program today. The concurrency model is beautiful!', 1200, 7, [0,8,10,18,25,26,3]),
    post(12, 'Reminder: CS 310 office hours moved to Thursday 4-5pm this week only', 1300, 5, [0,3,5,14,27]),
    post(13, 'Statistics final prep: the normal distribution is your best friend for estimation problems!', 1400, 6, [1,5,7,15,27,29]),
    post(14, 'LeetCode streak: 150 days! Consistency is key for interview prep 💪', 1500, 16, [0,2,3,4,5,8,10,12,18,22,24,19,26,27,25,1]),
    post(15, 'Networking fundamentals: Understanding TCP/IP will make you a better developer', 1600, 7, [1,9,20,29,8,26,11]),
    post(16, 'Amazon SDE internship tip: Practice leadership principles and system design', 1700, 14, [0,2,5,8,10,12,14,18,24,26,29,3,7,22]),
    post(17, 'Met the coolest people at the MasonHacks hackathon this weekend! 🚀', 1800, 19, [0,1,4,6,7,8,13,17,19,22,23,28,2,3,5,9,10,11,12]),
    post(18, 'Node.js tip: Use PM2 for production process management. It handles restarts and logging', 1900, 8, [0,3,11,23,25,7,10,26]),
    post(19, 'Robotics club meeting tomorrow! We\'re building an autonomous rover 🤖', 2000, 10, [0,2,4,6,8,14,22,28,3,5]),
    post(20, 'Bug bounty update: Found an XSS vulnerability on a major platform. Report submitted!', 2100, 13, [1,9,15,24,29,0,2,5,8,10,16,20,26]),
    post(21, 'Deep learning thesis update: GANs are generating realistic images now! Check my portfolio', 2200, 11, [2,5,13,27,0,3,7,12,14,16,24]),
    post(22, 'Just built my first iOS app with SwiftUI! The learning curve is real but worth it', 2300, 9, [0,3,4,11,18,19,23,28,7]),
    post(23, 'Agile methodology: Daily standups actually work when done right', 2400, 6, [3,7,8,11,25,29]),
    post(24, 'Blockchain development: Smart contracts on Solana are SO fast compared to Ethereum', 2500, 10, [2,5,12,16,21,24,27,29,0,10]),
    post(25, 'Testing tip: Write tests BEFORE code. TDD changed my life as a developer', 2600, 8, [0,3,10,11,18,26,7,25]),
    post(26, 'Just set up my Arch Linux rice. The customization is endless! 🐧', 2700, 12, [0,8,10,14,16,20,24,26,2,4,18,22]),
    post(27, 'Kaggle competition update: Our team is in the top 5%! Data preprocessing was key', 2800, 14, [2,5,13,21,0,3,7,9,12,14,16,24,27,29]),
    post(28, 'First programming assignment done! It\'s just Hello World but I\'m proud 😄', 2900, 23, [0,1,2,3,4,5,6,7,8,9,10,11,12,14,17,19,22,23,24,25,26,27,28]),
    post(29, 'AWS Solutions Architect certified! Cloud is the future ☁️', 3000, 15, [0,1,2,5,7,10,11,15,16,18,20,24,26,29,3]),
    post(0, 'Study tip: Teach concepts to others. If you can explain it simply, you understand it well', 3200, 12, [1,3,5,6,12,14,17,18,22,27,28,25]),
    post(2, 'Transformer architectures are revolutionizing NLP. Attention really is all you need!', 3400, 9, [0,5,9,12,16,21,24,27,14]),
    post(4, 'Game jam this weekend! 48 hours to make a game from scratch. Who\'s in?', 3600, 11, [0,3,12,14,19,22,28,6,17,8,4]),
    post(5, 'Pro tip: Learn SQL even if you\'re not a data scientist. It\'s used everywhere', 3800, 10, [0,2,7,12,13,21,24,27,29,3]),
    post(8, 'Assembly language is painful but understanding it makes you appreciate high-level languages so much more', 4000, 7, [0,1,4,14,20,26,15]),
    post(10, 'Deployed my first Kubernetes cluster! Container orchestration is 🔥', 4200, 9, [0,2,11,16,18,24,26,29,7]),
    post(12, 'To all CS 310 students: Don\'t forget the hash table implementation is due Friday!', 4400, 4, [0,3,14,25]),
    post(14, 'Solved a hard LeetCode problem in 15 minutes today. Growth is real!', 4600, 13, [0,2,4,5,8,10,12,18,22,24,26,27,3]),
    post(16, 'System design interview at Amazon went well! Thanks to everyone who helped me practice', 4800, 17, [0,2,5,7,8,10,12,14,16,18,24,26,29,3,11,22,25]),
    post(18, 'React 20 new features are incredible. Server Components change everything', 5000, 8, [0,3,7,11,23,25,8,10]),
    post(20, 'Cybersecurity career fair next Tuesday in Johnson Center! Don\'t miss it', 5200, 11, [1,9,15,20,24,29,0,5,10,16,26]),
    post(22, 'OOP tip: Favor composition over inheritance in most cases', 5400, 6, [0,4,8,11,18,19]),
    post(24, 'Web3 meetup at Mason tomorrow! We\'re covering DeFi protocols and smart contract audit', 5600, 8, [0,2,5,12,16,21,24,29]),
    post(26, 'My dotfiles are on GitHub! Perfect Neovim setup for coding', 5800, 7, [0,8,10,14,20,24,26]),
    post(28, 'CS at Mason is great but the parking situation... not so much 😂', 6000, 27, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,27]),
    post(1, 'Set up a home lab with Raspberry Pi for practicing network security. Best $50 investment!', 6200, 8, [0,9,15,20,26,29,8,2]),
    post(3, 'Mobile development is the future. 6 billion smartphone users and growing!', 6400, 7, [0,4,7,11,18,22,23]),
    post(7, 'Free Figma pro for students! Sign up with your @gmu.edu email', 6600, 14, [0,3,4,7,8,11,17,18,22,23,25,28,29,1]),
    post(9, 'CyberPatriot mentoring at local high school today. Giving back feels great! 🎓', 6800, 12, [0,1,5,9,15,20,24,29,2,10,16,26]),
    post(11, 'Rust vs Go: Both great for systems programming but Go has better ergonomics IMO', 7000, 5, [0,8,18,25,26]),
    
    // Additional posts
    post(13, 'Made a Chrome extension that blocks distracting sites during study time! Check it out on my GitHub', 7200, 16, [0,2,4,5,6,8,12,14,17,18,22,25,27,29,11,23]),
    post(15, 'Docker tip: Use .dockerignore to keep image sizes small. My app went from 800MB to 200MB!', 7400, 9, [0,2,10,11,16,18,24,26,29]),
    post(17, 'Who else is going to the Grace Hopper Conference this year? Let\'s meet up!', 7600, 12, [1,3,5,7,11,13,21,23,25,27,29,19]),
    post(19, 'Finished my Arduino weather station project! Temperature, humidity, and pressure on LCD display 🌤️', 7800, 14, [0,2,4,6,8,12,14,22,28,1,5,9,11,16]),
    post(21, 'Graph Neural Networks are absolutely fascinating. The future of deep learning on non-Euclidean data', 8000, 8, [2,5,13,16,21,27,29,12]),
    post(23, 'Portfolio website feedback needed! Link in bio. Be brutally honest please 💼', 8200, 19, [0,1,2,3,4,5,7,8,10,11,12,14,18,22,24,25,27,28,29]),
    post(25, 'VSCode extensions you NEED: GitLens, Prettier, ESLint, Live Share, Thunder Client', 8400, 23, [0,2,3,4,5,7,8,10,11,12,14,16,18,19,22,23,24,25,26,27,28,29,1]),
    post(27, 'Successfully deployed machine learning model to production! Flask + Docker + AWS EC2', 8600, 11, [0,2,5,10,13,16,21,24,29,19,3]),
    post(0, 'Imposter syndrome is real but remember: Everyone started as a beginner. Keep grinding! 💪', 8800, 26, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18,19,22,23,25,27,28,29,16,24]),
    post(2, 'NLP project showcase: Built a chatbot that answers CS questions using RAG architecture', 9000, 15, [0,1,5,9,12,14,16,21,24,27,29,3,7,10,18]),
    post(4, 'Raytracing in Unity is a game-changer. My scenes look photorealistic now! 🎨', 9200, 10, [0,3,12,14,19,22,28,6,8,17]),
    post(6, 'Learning path for backend: Node.js → Express → PostgreSQL → Docker → AWS. You got this!', 9400, 18, [0,2,3,5,7,8,10,11,12,16,18,23,24,25,26,29,1,4]),
    post(8, 'Memory optimization reduced my C program from 50MB to 5MB. Valgrind is your best friend!', 9600, 7, [0,4,11,14,20,22,26]),
    post(10, 'Microservices architecture lesson learned: Start with monolith, split when you need to scale', 9800, 9, [0,2,3,7,11,16,18,25,29]),
    post(12, 'Data structures interview prep: Master arrays, linked lists, trees, graphs, stacks, queues first', 10000, 12, [0,2,4,5,8,14,18,22,24,26,27,29]),
    post(14, 'Side project Saturday! Working on a meal planning app with recipe recommendations', 10200, 11, [0,3,5,7,11,13,17,23,25,28,19]),
    post(16, 'Behavioral interview tip: Use STAR method (Situation, Task, Action, Result) for every question', 10400, 20, [0,2,3,5,7,8,10,12,14,18,21,22,24,25,26,27,29,1,6,28]),
    post(18, 'TypeScript changed my JavaScript development life. Type safety prevents so many bugs!', 10600, 14, [0,2,3,5,7,10,11,16,18,23,24,25,26,29]),
    post(20, 'Passed 3 rounds at Meta! Final round next week. Send good vibes! 🤞', 10800, 24, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,17,18,19,22,23,24,25,26]),
    post(22, 'Code review tip: Comment on WHY not WHAT. The code shows what, comments explain why', 11000, 8, [0,2,8,11,18,24,25,4]),
    post(24, 'DeFi protocol audit found 2 critical vulnerabilities. Always get smart contracts reviewed!', 11200, 10, [2,5,9,12,16,20,21,24,29,26]),
    post(26, 'My Linux rice won the r/unixporn challenge! i3 + polybar + pywal combo 🐧', 11400, 13, [0,8,10,14,16,20,24,25,26,2,4,18,22]),
    post(1, 'Penetration testing certification complete! 6 months of hard work paid off', 11600, 17, [0,2,5,9,10,15,16,20,24,26,29,3,7,8,11,18,22]),
    post(3, 'Flutter 3.16 hot reload is INSTANT. Mobile development has never been this smooth', 11800, 11, [0,4,5,7,11,18,22,23,25,28,19]),
    post(5, 'Database optimization: Added indexes, queries 100x faster. From 5 seconds to 50ms!', 12000, 12, [0,2,10,12,14,16,18,21,24,27,29,8]),
    post(7, 'Design principle: Mobile-first responsive design. Easier to scale up than down!', 12200, 9, [0,3,11,18,23,25,7,17,28]),
    post(9, 'Ethical hacking competition next month! Prizes include internship interviews at top security firms', 12400, 15, [0,1,2,9,15,16,20,24,26,29,5,8,10,3,12]),
    post(11, 'Concurrency in Go is beautiful. Goroutines make parallel programming feel natural', 12600, 6, [0,8,10,18,25,26]),
    post(13, 'First pull request merged into a major open source project! Contributing feels amazing 🎉', 12800, 21, [0,1,2,3,4,5,7,8,10,11,12,14,16,18,22,24,25,26,27,29,6]),
    post(15, 'Time management hack: Pomodoro technique (25 min work, 5 min break). Increased my productivity 2x', 13000, 17, [0,1,2,3,4,5,6,7,8,11,12,14,17,22,25,28,29]),
    post(17, 'Women in Tech chapter at Mason is growing! 50+ members now. Next event: Resume workshop Friday', 13200, 19, [0,1,3,5,7,11,13,17,19,21,23,25,27,29,2,6,10,14,24]),
    post(19, 'IoT project complete! Automated my dorm room lights, temperature, and music with ESP32', 13400, 16, [0,2,4,6,8,12,14,16,20,22,26,28,1,5,9,11]),
    post(21, 'Computer vision project: Real-time object detection with YOLO v8. 60 FPS on webcam!', 13600, 13, [0,2,5,9,12,16,19,21,24,27,29,4,13]),
    post(23, 'Soft skills matter! Practice presentations, writing docs, and communication. Invaluable in industry', 13800, 15, [0,1,2,3,5,7,10,11,12,16,18,24,25,27,29]),
    post(25, 'Git workflow: feature branches, squash commits, meaningful messages. Keep history clean! 🌿', 14000, 10, [0,2,3,7,10,11,18,25,26,29]),
    post(27, 'Research paper accepted to  conference! My first publication. Dreams do come true! 📚', 14200, 20, [0,1,2,3,5,9,12,13,16,19,21,24,27,29,6,7,10,14,18,22]),
    post(29, 'Cloud architecture diagram for my capstone project. Scalable, secure, cost-optimized ☁️', 14400, 12, [0,2,5,7,10,11,16,18,24,26,29,8]),
    post(0, 'Mentorship changed my career trajectory. Be a mentor AND find mentors. Grow together! 🌱', 14600, 18, [1,2,3,5,6,7,10,11,12,14,16,18,21,24,25,27,28,29]),
    post(2, 'NLP trends 2026: Multimodal models, smaller efficient LLMs, better reasoning. Exciting times!', 14800, 11, [0,5,9,12,16,21,24,27,29,13,19]),
  );

  for (const p of postsData) {
    await Post.create(p);
  }
  console.log(`Created ${postsData.length} feed posts`);

  // ═══════════════════════════════════════════
  // STUDY SESSIONS (25+ sessions)
  // ═══════════════════════════════════════════
  const studySessionsData = [
    // CS 310
    { courseId: cid(3), organizerId: uid(0), organizerName: uname(0), title: 'CS 310 Midterm Review', description: 'Comprehensive review of lists, trees, and hash tables', location: 'Fenwick Library 3rd Floor', dateTime: day(2), duration: 120, attendingIds: [uid(3),uid(5),uid(14),uid(18),uid(25),uid(27)], notAttendingIds: [uid(12)] },
    { courseId: cid(3), organizerId: uid(14), organizerName: uname(14), title: 'LeetCode Practice Session', description: 'Solve data structure problems together', location: 'Engineering Building 1101', dateTime: day(5), duration: 90, attendingIds: [uid(0),uid(5),uid(12),uid(18)], notAttendingIds: [] },
    { courseId: cid(3), organizerId: uid(12), organizerName: uname(12), title: 'Graph Algorithms Workshop', description: 'BFS, DFS, and Dijkstra implementations', location: 'Innovation Hall 208', dateTime: day(10), duration: 120, attendingIds: [uid(0),uid(3),uid(14),uid(25),uid(27)], notAttendingIds: [uid(18)] },
    { courseId: cid(3), organizerId: uid(27), organizerName: uname(27), title: 'Final Exam Cram Session', description: 'Last-minute review of all topics', location: 'JC Meeting Room 4', dateTime: day(60), duration: 180, attendingIds: [uid(0),uid(5),uid(14),uid(18),uid(25)], notAttendingIds: [] },

    // CS 211
    { courseId: cid(1), organizerId: uid(4), organizerName: uname(4), title: 'Java OOP Review', description: 'Review inheritance, polymorphism, and interfaces', location: 'Fenwick Library 2nd Floor', dateTime: day(3), duration: 90, attendingIds: [uid(6),uid(8),uid(11),uid(22),uid(17)], notAttendingIds: [uid(19)] },
    { courseId: cid(1), organizerId: uid(22), organizerName: uname(22), title: 'Lab 3 Help Session', description: 'Work through Lab 3 together', location: 'Engineering 4457', dateTime: day(7), duration: 60, attendingIds: [uid(4),uid(6),uid(11),uid(28)], notAttendingIds: [] },
    { courseId: cid(1), organizerId: uid(11), organizerName: uname(11), title: 'Project Brainstorming', description: 'Discuss project ideas and form teams', location: 'JC Meeting Room 2', dateTime: day(12), duration: 60, attendingIds: [uid(4),uid(8),uid(17),uid(19),uid(22)], notAttendingIds: [uid(6)] },

    // CS 262
    { courseId: cid(2), organizerId: uid(8), organizerName: uname(8), title: 'C Pointers Deep Dive', description: 'Master pointers, arrays, and dynamic memory', location: 'Nguyen Engineering 1103', dateTime: day(4), duration: 90, attendingIds: [uid(4),uid(11),uid(15),uid(19),uid(22),uid(26)], notAttendingIds: [] },
    { courseId: cid(2), organizerId: uid(26), organizerName: uname(26), title: 'GDB Debugging Workshop', description: 'Learn to use GDB like a pro', location: 'CS Lab Room 103', dateTime: day(9), duration: 60, attendingIds: [uid(4),uid(8),uid(11),uid(15),uid(22)], notAttendingIds: [uid(19)] },

    // CS 471
    { courseId: cid(6), organizerId: uid(10), organizerName: uname(10), title: 'OS Shell Project Workshop', description: 'Work through shell implementation together', location: 'Research Hall 209', dateTime: day(6), duration: 120, attendingIds: [uid(0),uid(2),uid(8),uid(14),uid(16),uid(20),uid(24),uid(26)], notAttendingIds: [] },
    { courseId: cid(6), organizerId: uid(0), organizerName: uname(0), title: 'Virtual Memory Concepts', description: 'Study page tables and TLBs', location: 'Fenwick Library 4th Floor', dateTime: day(15), duration: 90, attendingIds: [uid(8),uid(10),uid(14),uid(16),uid(24)], notAttendingIds: [uid(20)] },
    { courseId: cid(6), organizerId: uid(16), organizerName: uname(16), title: 'Concurrency & Synchronization', description: 'Mutexes, semaphores, and deadlock prevention', location: 'Engineering 4457', dateTime: day(22), duration: 120, attendingIds: [uid(0),uid(2),uid(8),uid(10),uid(14),uid(20),uid(24),uid(26)], notAttendingIds: [] },

    // SWE 432
    { courseId: cid(8), organizerId: uid(3), organizerName: uname(3), title: 'React Workshop', description: 'Build a React app from scratch together', location: 'Innovation Hall 105', dateTime: day(4), duration: 120, attendingIds: [uid(0),uid(7),uid(10),uid(11),uid(18),uid(23)], notAttendingIds: [] },
    { courseId: cid(8), organizerId: uid(18), organizerName: uname(18), title: 'REST API Design', description: 'Best practices for designing RESTful APIs', location: 'JC Meeting Room 1', dateTime: day(11), duration: 90, attendingIds: [uid(0),uid(3),uid(7),uid(11),uid(23)], notAttendingIds: [uid(10)] },
    { courseId: cid(8), organizerId: uid(7), organizerName: uname(7), title: 'CSS Flexbox & Grid Masterclass', description: 'Master modern CSS layout techniques', location: 'Art and Design 2026', dateTime: day(8), duration: 60, attendingIds: [uid(0),uid(3),uid(11),uid(18),uid(23),uid(25)], notAttendingIds: [] },

    // CS 484
    { courseId: cid(7), organizerId: uid(5), organizerName: uname(5), title: 'Python Data Science Workshop', description: 'pandas, numpy, and matplotlib basics', location: 'Data Science Lab', dateTime: day(5), duration: 120, attendingIds: [uid(2),uid(9),uid(16),uid(21),uid(27)], notAttendingIds: [] },
    { courseId: cid(7), organizerId: uid(21), organizerName: uname(21), title: 'Machine Learning Review', description: 'Classification and clustering algorithms', location: 'Fenwick Library 3rd Floor', dateTime: day(14), duration: 90, attendingIds: [uid(2),uid(5),uid(9),uid(16),uid(27)], notAttendingIds: [] },

    // CS 450
    { courseId: cid(13), organizerId: uid(2), organizerName: uname(2), title: 'SQL Practice Session', description: 'Work through complex queries together', location: 'Innovation Hall 308', dateTime: day(6), duration: 90, attendingIds: [uid(5),uid(12),uid(16),uid(21),uid(24),uid(27),uid(29)], notAttendingIds: [] },
    { courseId: cid(13), organizerId: uid(27), organizerName: uname(27), title: 'ER Diagram Workshop', description: 'Practice designing ER diagrams for real scenarios', location: 'Engineering 4457', dateTime: day(13), duration: 60, attendingIds: [uid(2),uid(5),uid(12),uid(24),uid(29)], notAttendingIds: [uid(21)] },
    { courseId: cid(13), organizerId: uid(5), organizerName: uname(5), title: 'Normalization Practice', description: '1NF to BCNF with examples', location: 'Fenwick Library 2nd Floor', dateTime: day(20), duration: 90, attendingIds: [uid(0),uid(2),uid(12),uid(21),uid(24),uid(27),uid(29)], notAttendingIds: [] },

    // MATH 203
    { courseId: cid(10), organizerId: uid(6), organizerName: uname(6), title: 'Linear Algebra Study Group', description: 'Matrix operations and vector spaces', location: 'Exploratory Hall 2004', dateTime: day(3), duration: 90, attendingIds: [uid(17),uid(22),uid(28)], notAttendingIds: [] },
    { courseId: cid(10), organizerId: uid(22), organizerName: uname(22), title: 'Eigenvalue Problem Session', description: 'Practice finding eigenvalues and eigenvectors', location: 'Fenwick Library 3rd Floor', dateTime: day(18), duration: 60, attendingIds: [uid(6),uid(17),uid(28)], notAttendingIds: [] },

    // CS 425
    { courseId: cid(12), organizerId: uid(4), organizerName: uname(4), title: 'Unity Game Jam Prep', description: 'Practice rapid prototyping in Unity', location: 'Art and Design Building 1020', dateTime: day(7), duration: 180, attendingIds: [uid(3),uid(14),uid(19),uid(22)], notAttendingIds: [] },
    { courseId: cid(12), organizerId: uid(19), organizerName: uname(19), title: 'Game Physics Workshop', description: 'Rigidbody, colliders, and raycasting', location: 'Innovation Hall 204', dateTime: day(16), duration: 90, attendingIds: [uid(3),uid(4),uid(14),uid(22)], notAttendingIds: [] },

    // STAT 344
    { courseId: cid(11), organizerId: uid(13), organizerName: uname(13), title: 'Probability Study Group', description: 'Work through probability problem sets', location: 'Planetary Hall 206', dateTime: day(5), duration: 90, attendingIds: [uid(1),uid(7),uid(15),uid(23),uid(27),uid(29)], notAttendingIds: [] },
    { courseId: cid(11), organizerId: uid(29), organizerName: uname(29), title: 'Hypothesis Testing Review', description: 'Type I/II errors and p-values', location: 'Fenwick Library 2nd Floor', dateTime: day(19), duration: 60, attendingIds: [uid(1),uid(7),uid(13),uid(15),uid(23),uid(27)], notAttendingIds: [] },
    
    // Additional Study Sessions
    // CS 110
    { courseId: cid(0), organizerId: uid(17), organizerName: uname(17), title: 'Python Functions Practice', description: 'Writing and debugging Python functions', location: 'Fenwick Library 1st Floor', dateTime: day(25), duration: 60, attendingIds: [uid(6),uid(13),uid(23),uid(28)], notAttendingIds: [] },
    
    // CS 211  
    { courseId: cid(1), organizerId: uid(4), organizerName: uname(4), title: 'Polymorphism Workshop', description: 'Method overloading and overriding practice', location: 'Engineering 4457', dateTime: day(24), duration: 90, attendingIds: [uid(6),uid(11),uid(17),uid(22),uid(28)], notAttendingIds: [uid(13)] },
    { courseId: cid(1), organizerId: uid(28), organizerName: uname(28), title: 'Midterm Cram Session', description: 'Last minute review before midterm', location: 'Johnson Center Study Room', dateTime: day(30), duration: 180, attendingIds: [uid(4),uid(6),uid(11),uid(13),uid(17),uid(22)], notAttendingIds: [] },
    
    // CS 262
    { courseId: cid(2), organizerId: uid(15), organizerName: uname(15), title: 'Memory Management Deep Dive', description: 'malloc, free, and debugging memory leaks', location: 'CS Lab 103', dateTime: day(27), duration: 120, attendingIds: [uid(8),uid(11),uid(19),uid(22),uid(26)], notAttendingIds: [uid(4)] },
    
    // CS 310
    { courseId: cid(3), organizerId: uid(18), organizerName: uname(18), title: 'Sorting Algorithms Comparison', description: 'Bubble, merge, quick, heap sort analysis', location: 'Nguyen Engineering 1505', dateTime: day(26), duration: 90, attendingIds: [uid(0),uid(4),uid(8),uid(12),uid(14),uid(22)], notAttendingIds: [] },
    { courseId: cid(3), organizerId: uid(4), organizerName: uname(4), title: 'Final Exam Mega Review', description: 'All topics: trees, graphs, DP, complexity', location: 'Innovation Hall Auditorium', dateTime: day(35), duration: 240, attendingIds: [uid(0),uid(2),uid(8),uid(10),uid(12),uid(14),uid(18),uid(22),uid(24),uid(26)], notAttendingIds: [] },
    
    // CS 330
    { courseId: cid(4), organizerId: uid(22), organizerName: uname(22), title: 'Regular Expressions Workshop', description: 'Practice building and simplifying regex', location: 'Planetary Hall 131', dateTime: day(21), duration: 60, attendingIds: [uid(4),uid(14),uid(18),uid(19)], notAttendingIds: [] },
    
    // CS 367
    { courseId: cid(5), organizerId: uid(1), organizerName: uname(1), title: 'Cache Lab Help Session', description: 'Optimizing for cache performance', location: 'Engineering Building 2002', dateTime: day(28), duration: 120, attendingIds: [uid(8),uid(15),uid(20),uid(26)], notAttendingIds: [uid(1)] },
    
    // CS 471
    { courseId: cid(6), organizerId: uid(14), organizerName: uname(14), title: 'Deadlock Prevention Strategies', description: 'Banker\'s algorithm and resource allocation', location: 'Fenwick Library Group Study', dateTime: day(31), duration: 90, attendingIds: [uid(0),uid(4),uid(8),uid(10),uid(16),uid(18),uid(24)], notAttendingIds: [uid(20)] },
    { courseId: cid(6), organizerId: uid(24), organizerName: uname(24), title: 'Scheduling Algorithm Practice', description: 'FCFS, SJF, RR, Priority - work problems', location: 'JC Room 229', dateTime: day(37), duration: 90, attendingIds: [uid(0),uid(8),uid(10),uid(14),uid(16),uid(18)], notAttendingIds: [] },
    
    // CS 484
    { courseId: cid(7), organizerId: uid(13), organizerName: uname(13), title: 'Feature Engineering Workshop', description: 'Preprocessing and scaling techniques', location: 'Data Science Lab', dateTime: day(32), duration: 120, attendingIds: [uid(2),uid(5),uid(9),uid(16),uid(21),uid(27)], notAttendingIds: [] },
    { courseId: cid(7), organizerId: uid(19), organizerName: uname(19), title: 'Neural Networks Study Group', description: 'Backpropagation and gradient descent', location: 'Research Hall 163', dateTime: day(40), duration: 90, attendingIds: [uid(2),uid(5),uid(13),uid(21),uid(27)], notAttendingIds: [uid(16)] },
    
    // SWE 432
    { courseId: cid(8), organizerId: uid(24), organizerName: uname(24), title: 'JavaScript ES6 Deep Dive', description: 'Arrow functions, promises, async/await', location: 'Innovation Hall 134', dateTime: day(29), duration: 90, attendingIds: [uid(0),uid(2),uid(3),uid(7),uid(11),uid(16),uid(18)], notAttendingIds: [] },
    { courseId: cid(8), organizerId: uid(11), organizerName: uname(11), title: 'Final Project Showcase Prep', description: 'Practice presentations and demos', location: 'Art and Design Theater', dateTime: day(42), duration: 120, attendingIds: [uid(0),uid(3),uid(7),uid(18),uid(23),uid(25)], notAttendingIds: [uid(11)] },
    
    // SWE 443
    { courseId: cid(9), organizerId: uid(2), organizerName: uname(2), title: 'Architecture Patterns Study', description: 'MVC, microservices, event-driven review', location: 'Mason Hall 3003', dateTime: day(33), duration: 90, attendingIds: [uid(3),uid(7),uid(10),uid(16),uid(29)], notAttendingIds: [] },
    
    // CS 425
    { courseId: cid(12), organizerId: uid(14), organizerName: uname(14), title: 'Unity Animation System', description: 'Animator controller and blend trees', location: 'Art Building Lab', dateTime: day(34), duration: 120, attendingIds: [uid(3),uid(4),uid(12),uid(19),uid(22)], notAttendingIds: [] },
    
    // CS 450
    { courseId: cid(13), organizerId: uid(10), organizerName: uname(10), title: 'Advanced SQL Queries', description: 'Window functions, CTEs, and subqueries', location: 'Engineering 4457', dateTime: day(36), duration: 90, attendingIds: [uid(0),uid(2),uid(5),uid(12),uid(18),uid(21),uid(24),uid(27)], notAttendingIds: [uid(29)] },
    { courseId: cid(13), organizerId: uid(29), organizerName: uname(29), title: 'Database Project Workshop', description: 'Work on final database project together', location: 'Fenwick Library 4th Floor', dateTime: day(45), duration: 180, attendingIds: [uid(2),uid(5),uid(10),uid(12),uid(21),uid(24),uid(27)], notAttendingIds: [] },
    
    // MATH 203
    { courseId: cid(10), organizerId: uid(17), organizerName: uname(17), title: 'Matrix Inverse Methods', description: 'Practice Gauss-Jordan elimination', location: 'Exploratory Hall 2004', dateTime: day(38), duration: 60, attendingIds: [uid(6),uid(22),uid(28),uid(7)], notAttendingIds: [] },
    
    // STAT 344
    { courseId: cid(11), organizerId: uid(7), organizerName: uname(7), title: 'R Programming Workshop', description: 'dplyr and ggplot2 for data visualization', location: 'Planetary Hall 212', dateTime: day(41), duration: 120, attendingIds: [uid(1),uid(11),uid(13),uid(15),uid(23),uid(27),uid(29)], notAttendingIds: [] },
    { courseId: cid(11), organizerId: uid(23), organizerName: uname(23), title: 'ANOVA and Regression Review', description: 'Final exam focus session', location: 'Fenwick Library Presentation Room', dateTime: day(47), duration: 150, attendingIds: [uid(1),uid(7),uid(11),uid(13),uid(15),uid(27),uid(29)], notAttendingIds: [] },
  ];

  await StudySession.insertMany(studySessionsData);
  console.log(`Created ${studySessionsData.length} study sessions`);

  // ═══════════════════════════════════════════
  // DOCUMENTS (60+ documents with full extracted text)
  // ═══════════════════════════════════════════
  const docsData = [
    // CS 110
    { courseId: cid(0), uploaderId: uid(1), uploaderName: uname(1), title: 'CS 110 Lecture Notes Week 1-4', description: 'Computational thinking and Python basics', fileType: 'PDF', fileSize: '2.4 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 45, 
      extractedText: 'COMPUTATIONAL THINKING: Breaking problems into parts. Decomposition, Pattern Recognition, Abstraction, Algorithm Design. PYTHON BASICS: Variables (int, float, str, bool), print(), input(), operators (+,-,*,/,//,%,**). CONTROL FLOW: if/elif/else statements, while loops, for loops, range(). FUNCTIONS: def name(params): return value. LISTS: [items], append(), remove(), len(), indexing, slicing. String methods: upper(), lower(), split(), join(). Practice: prime checker, palindrome, factorial, list operations.' },
    
    { courseId: cid(0), uploaderId: uid(15), uploaderName: uname(15), title: 'Python Cheat Sheet', description: 'Quick reference for Python syntax and built-in functions', fileType: 'PDF', fileSize: '856 KB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 72,
      extractedText: 'PYTHON REFERENCE: Data types (int, float, str, bool, list, tuple, dict, set). String methods: upper(), lower(), strip(), split(), join(), replace(), find(). List methods: append(), extend(), insert(), remove(), pop(), sort(), reverse(). Built-ins: len(), max(), min(), sum(), range(), enumerate(), zip(), map(), filter(). File I/O: open(file, mode), read(), write(), readlines(). Exception handling: try/except/finally. List comprehension: [x for x in items]. Dictionary: {key:value}, get(), keys(), values(), items().' },
    
    { courseId: cid(0), uploaderId: uid(6), uploaderName: uname(6), title: 'HW1 Practice Problems', description: 'Extra practice problems for homework 1', fileType: 'PDF', fileSize: '1.1 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 33,
      extractedText: 'PRACTICE PROBLEMS: 1) Temperature converter C to F: F=(C*9/5)+32. 2) Factorial: n! = n*(n-1)*...*1. 3) Palindrome checker: string == string[::-1]. 4) List statistics: mean, median, mode, range. 5) FizzBuzz: multiples of 3="Fizz", 5="Buzz", both="FizzBuzz". 6) Password validator: 8+ chars, upper+lower, digit, special char. 7) Number guessing game with hints.' },

    // CS 211
    { courseId: cid(1), uploaderId: uid(4), uploaderName: uname(4), title: 'Java OOP Summary', description: 'Comprehensive guide to OOP concepts in Java', fileType: 'PDF', fileSize: '3.2 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 89,
      extractedText: 'JAVA OOP CONCEPTS: Classes are blueprints, objects are instances. Encapsulation: private fields, public getters/setters. Inheritance: extends keyword, super() calls parent. Polymorphism: method overloading (same name, different params), method overriding (@Override annotation). Abstract classes: cannot instantiate, may have abstract methods. Interfaces: contract with methods classes must implement. Example: public class Student { private String name; private int id; public Student(String name, int id) { this.name=name; this.id=id; } public String getName() { return name; } }. Exception handling: try/catch/finally blocks.' },
    
    { courseId: cid(1), uploaderId: uid(8), uploaderName: uname(8), title: 'Lab 1 Solution Guide', description: 'Step-by-step walkthrough for Lab 1', fileType: 'PDF', fileSize: '1.5 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 56,
      extractedText: 'LAB 1 SOLUTION: Create Student class with fields (name, id, major, gpa). Constructor initializes all fields. Validate GPA 0.0-4.0 in setter. Override toString() for display. Course class manages ArrayList<Student>. Methods: enrollStudent(Student s), listStudents(), calculateAverageGpa(). Common mistakes: forgetting ArrayList initialization, not validating input, using == for strings instead of .equals(), not overriding toString().' },
    { courseId: cid(1), uploaderId: uid(11), uploaderName: uname(11), title: 'Design Patterns in Java', description: 'Common patterns with code examples', fileType: 'PDF', fileSize: '4.1 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 41,
      extractedText: 'DESIGN PATTERNS: Singleton (single instance, private constructor, static getInstance()), Factory (create objects without specifying exact class), Observer (one-to-many dependency, notify all dependents), Strategy (family of algorithms, makes them interchangeable), Decorator (add responsibilities dynamically), Adapter (convert interface to another interface). Code examples: Singleton: private static instance, public static getInstance() { if(instance==null) instance=new Singleton(); return instance; }. Factory: interface Product, class Factory { Product createProduct(type) }.' },
    { courseId: cid(1), uploaderId: uid(4), uploaderName: uname(4), title: 'Midterm Review Sheet', description: 'Key topics and practice questions', fileType: 'PDF', fileSize: '980 KB', mimeType: 'application/pdf', isPreviousSemester: true, semester: 'Fall 2025', downloads: 67,
      extractedText: 'MIDTERM TOPICS: OOP principles (encapsulation, inheritance, polymorphism, abstraction), class vs object, constructor types, method overloading vs overriding, access modifiers (public, private, protected, default), static vs instance, final keyword, abstract classes vs interfaces, ArrayList vs LinkedList, exception handling. Practice: create class hierarchy, implement interface, use generics, handle exceptions.' },

    // CS 262
    { courseId: cid(2), uploaderId: uid(8), uploaderName: uname(8), title: 'C Language Quick Reference', description: 'Syntax, pointers, and memory management', fileType: 'PDF', fileSize: '1.8 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 54,
      extractedText: 'C PROGRAMMING: Pointers: int *ptr; ptr=&var; *ptr accesses value. Arrays: int arr[10]; pointer to first element. Strings: char str[]="hello"; null-terminated. Memory: malloc(size) allocates, free(ptr) deallocates, calloc(n,size) zeros memory, realloc(ptr,newsize). Structs: struct Point { int x,y; }; struct Point p; p.x=5; Arrow operator: ptr->x same as (*ptr).x. File I/O: fopen(), fclose(), fprintf(), fscanf(), fread(), fwrite(). Header files: #include declarations. Common bugs: memory leaks, dangling pointers, buffer overflow, segmentation faults.' },
    { courseId: cid(2), uploaderId: uid(26), uploaderName: uname(26), title: 'GDB Tutorial', description: 'Complete guide to debugging with GDB', fileType: 'PDF', fileSize: '2.1 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 63,
      extractedText: 'GDB COMMANDS: Compile with -g flag: gcc -g program.c -o program. Start: gdb ./program. Run: run [args]. Breakpoints: break line_number, break function_name, list breakpoints: info break, delete: delete 1. Stepping: next (step over), step (step into), finish (step out), continue. Print: print variable, print *pointer, print array[0]@10 (array). Backtrace: bt shows call stack. Watch: watch variable breaks when value changes. Core dumps: gdb program core. Useful: set print pretty on, set listsize 20.' },
    { courseId: cid(2), uploaderId: uid(15), uploaderName: uname(15), title: 'Pointer Diagrams', description: 'Visual guide to pointer arithmetic', fileType: 'PNG', fileSize: '3.4 MB', mimeType: 'image/png', semester: 'Spring 2026', downloads: 48,
      extractedText: 'POINTER ARITHMETIC: int arr[5]={10,20,30,40,50}; int *ptr=arr; ptr points to arr[0]. ptr+1 points to arr[1]. *(ptr+2) accesses arr[2]=30. Array name is constant pointer. Pointer difference: ptr2-ptr1 gives number of elements. sizeof(int) often 4 bytes. char *str="hello"; str[0]=\'h\', str+1 points to \'e\'. Double pointers: int **pp; *pp is pointer, **pp is value. Function pointers: int (*func_ptr)(int,int); func_ptr=&function; result=(*func_ptr)(5,3);' },

    // CS 310
    { courseId: cid(3), uploaderId: uid(12), uploaderName: uname(12), title: 'Data Structures Cheat Sheet', description: 'Big-O complexities and key operations', fileType: 'PDF', fileSize: '1.2 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 134,
      extractedText: 'BIG-O COMPLEXITIES: ArrayList: get O(1), add O(1) amortized, remove O(n), search O(n). LinkedList: get O(n), addFirst O(1), removeFirst O(1), search O(n). Stack: push O(1), pop O(1), peek O(1). Queue: enqueue O(1), dequeue O(1). Binary Search Tree: search/insert/delete O(log n) average, O(n) worst. AVL Tree: all operations O(log n). Hash Table: insert/delete/search O(1) average, O(n) worst. Heap: insert O(log n), deleteMin O(log n), getMin O(1). Graph BFS/DFS: O(V+E). Dijkstra: O((V+E)log V) with heap. Sorting: QuickSort O(n log n) average, MergeSort O(n log n), HeapSort O(n log n), BubbleSort O(n²).' },
    { courseId: cid(3), uploaderId: uid(0), uploaderName: uname(0), title: 'Binary Tree Visualizations', description: 'BST, AVL, and Red-Black tree diagrams', fileType: 'PDF', fileSize: '5.6 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 78,
      extractedText: 'BINARY SEARCH TREE: Left subtree < root < right subtree. Insert: recursively compare and go left/right. Delete cases: (1) leaf-remove, (2) one child-replace, (3) two children-find inorder successor. AVL TREE: Self-balancing BST, |height(left)-height(right)|≤1. Rotations: LL rotation (right rotate), RR rotation (left rotate), LR rotation (left-right), RL rotation (right-left). RED-BLACK TREE: Properties: root black, NIL leaves black, red nodes have black children, black-height equal  paths. Insert: color red, fix violations with rotations and recoloring. Balancing maintains O(log n) height.' },
    { courseId: cid(3), uploaderId: uid(14), uploaderName: uname(14), title: 'Graph Algorithms Notes', description: 'BFS, DFS, Dijkstra, and Kruskal with examples', fileType: 'PDF', fileSize: '3.3 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 91,
      extractedText: 'GRAPH ALGORITHMS: BFS (Breadth-First Search): uses queue, explores level by level, finds shortest path in unweighted graph. DFS (Depth-First Search): uses stack/recursion, explores deeply, detects cycles. Dijkstra\'s: finds shortest path in weighted graph with non-negative weights, uses priority queue, greedy approach. Bellman-Ford: handles negative weights, O(VE). Prim\'s MST: grows MST from starting vertex, O(E log V). Kruskal\'s MST: sorts edges, uses union-find, O(E log E). Topological Sort: DFS-based, works on DAGs. Floyd-Warshall: all-pairs shortest path, O(V³). Example: BFS pseudocode: enqueue start, mark visited; while queue not empty: dequeue vertex, process, enqueue unvisited neighbors.' },
    { courseId: cid(3), uploaderId: uid(12), uploaderName: uname(12), title: 'Fall 2025 Midterm', description: 'Previous semester midterm with solutions', fileType: 'PDF', fileSize: '2.8 MB', mimeType: 'application/pdf', isPreviousSemester: true, semester: 'Fall 2025', downloads: 112,
      extractedText: 'MIDTERM QUESTIONS: Q1) Implement LinkedList reverse in O(n) time O(1) space. Solution: three pointers (prev, current, next), iterate and reverse links. Q2) Given array, find duplicates using hash set in O(n) time. Q3) Implement binary search tree insert and delete. Q4) Write BFS to find shortest path length. Q5) Analyze time complexity: nested loops, recursive calls. Q6) Implement stack using two queues. Q7) Convert infix to postfix expression. Q8) Detect cycle in linked list using Floyd\'s algorithm (slow/fast pointers). Q9) Find kth largest element in array using heap. Q10) Implement LRU cache using HashMap and DoublyLinkedList.' },
    { courseId: cid(3), uploaderId: uid(5), uploaderName: uname(5), title: 'Hash Table Implementation Guide', description: 'Open addressing vs chaining with Java code', fileType: 'PDF', fileSize: '1.9 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 55,
      extractedText: 'HASH TABLES: Hash function: index = hash(key) % tableSize. Collision resolution: (1) Chaining-linked list at each bucket, (2) Open addressing-probe for next empty slot. Probing methods: Linear probing (index+1, index+2,...), Quadratic probing (index+1², index+2²,...), Double hashing (use second hash function). Load factor λ = n/m (n=elements, m=table size). Rehashing: when λ > threshold, double table size, rehash all elements. Java implementation: class HashTable<K,V> { LinkedList<Entry>[] table; put(K key, V value) { int idx = hash(key); if(table[idx]==null) table[idx]=new LinkedList(); /check if exists, else add new Entry }. Performance: average O( 1), worst O(n).' },

    // CS 471
    { courseId: cid(6), uploaderId: uid(0), uploaderName: uname(0), title: 'OS Concepts Summary', description: 'Process scheduling, memory management, and file systems', fileType: 'PDF', fileSize: '4.7 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 88,
      extractedText: 'OPERATING SYSTEMS: Process vs Thread: process has separate memory, thread shares memory. Process states: new, ready, running, waiting, terminated. CPU Scheduling: FCFS (first come first serve), SJF (shortest job first), Priority, Round Robin, Multilevel queue. Context switch: save/restore PCB. Memory Management: Paging (divide into fixed pages), Segmentation (logical divisions), Virtual memory (illusion of large memory). Page replacement: FIFO, LRU (least recently used), Optimal. Deadlock: mutual exclusion, hold and wait, no preemption, circular wait. Banker\'s algorithm for avoidance. File systems: FAT, NTFS, ext4. Inode stores metadata.' },
    { courseId: cid(6), uploaderId: uid(16), uploaderName: uname(16), title: 'Shell Project Guide', description: 'Hints and tips for the shell implementation', fileType: 'PDF', fileSize: '2.3 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 76,
      extractedText: 'SHELL PROJECT: Use fork() to create child process, exec() family to run commands. Parse input: strtok() with space delimiter. Built-ins (cd, exit) handled by parent. External commands: fork, child calls execvp(), parent waits. Pipe implementation: pipe() creates file descriptors, dup2() redirects stdin/stdout, close unused ends. I/O redirection: open file, dup2 to stdin(0) or stdout(1). Signal handling: sigaction() for SIGINT, SIGTSTP. Tips: check return values, close all file descriptors, avoid zombie processes with wait(), handle Ctrl+C without exiting shell.' },
    { courseId: cid(6), uploaderId: uid(10), uploaderName: uname(10), title: 'Concurrency Cheat Sheet', description: 'Mutexes, semaphores, condition variables', fileType: 'PDF', fileSize: '1.4 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 64,
      extractedText: 'CONCURRENCY: Race condition: multiple threads access shared data. Critical section: code modifying shared variables. Mutex: pthread_mutex_t lock; pthread_mutex_lock(&lock); critical section; pthread_mutex_unlock(&lock). Semaphore: counting semaphore (int value), wait/down decrements, signal/up increments. Binary semaphore like mutex. Condition variable: wait releases mutex and sleeps, signal wakes one thread, broadcast wakes all. Producer-Consumer: semaphore empty, full, mutex. Reader-Writer: prefer readers or writers. Deadlock prevention: lock ordering, timeout, banker\'s algorithm.' },
    { courseId: cid(6), uploaderId: uid(8), uploaderName: uname(8), title: 'Previous Midterm Exam', description: 'Fall 2025 midterm with solutions', fileType: 'PDF', fileSize: '3.1 MB', mimeType: 'application/pdf', isPreviousSemester: true, semester: 'Fall 2025', downloads: 95,
      extractedText: 'OS MIDTERM: Q1) Compare preemptive vs non-preemptive scheduling. Q2) Calculate turnaround and waiting time for FCFS, SJF, RR. Q3) Given page reference string, show FIFO, LRU page faults. Q4) Explain deadlock conditions, give prevention method for each. Q5) Implement producer-consumer with semaphores pseudocode. Q6) Virtual memory: calculate page number and offset from logical address. Q7) Describe TLB and how it speeds up paging. Q8) Compare internal vs external fragmentation. Q9) File allocation: contiguous, linked, indexed comparison. Q10) Explain copy-on-write fork optimization.' },

    // CS 484
    { courseId: cid(7), uploaderId: uid(5), uploaderName: uname(5), title: 'Data Mining Lecture Slides', description: 'Weeks 1-5 slides with annotations', fileType: 'PDF', fileSize: '8.2 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 42,
      extractedText: 'DATA MINING: Classification: decision trees (ID3, C4.5, CART), k-NN (classify based on k nearest neighbors), Naive Bayes (probabilistic), SVM (support vector machines). Clustering: k-means (minimize within-cluster variance), hierarchical (agglomerative/divisive dendrograms), DBSCAN (density-based). Association rules: Apriori algorithm (frequent itemsets), support = freq(A)/n, confidence = freq(A&B)/freq(A), lift = conf/P(B). Preprocessing: handle missing values (mean/median imputation, deletion), normalization (min-max, z-score), feature selection, dimensionality reduction (PCA). Evaluation: accuracy, precision, recall, F1-score, ROC curve, cross-validation.' },
    { courseId: cid(7), uploaderId: uid(21), uploaderName: uname(21), title: 'Python ML Cookbook', description: 'Common scikit-learn patterns for data mining', fileType: 'PDF', fileSize: '3.5 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 58,
      extractedText: 'SCIKIT-LEARN PATTERNS: from sklearn.model_selection import train_test_split; X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2). Classification: from sklearn.tree import DecisionTreeClassifier; clf = DecisionTreeClassifier(); clf.fit(X_train, y_train); predictions = clf.predict(X_test). Clustering: from sklearn.cluster import KMeans; kmeans = KMeans(n_clusters=3); kmeans.fit(X); labels = kmeans.labels_. Preprocessing: from sklearn.preprocessing import StandardScaler; scaler = StandardScaler(); X_scaled = scaler.fit_transform(X). Metrics: from sklearn.metrics import accuracy_score, confusion_matrix, classification_report. Cross-validation: from sklearn.model_selection import cross_val_score; scores = cross_val_score(clf, X, y, cv=5).' },
    { courseId: cid(7), uploaderId: uid(2), uploaderName: uname(2), title: 'K-Means Clustering Demo', description: 'Jupyter notebook with K-means implementation', fileType: 'TXT', fileSize: '245 KB', mimeType: 'text/plain', semester: 'Spring 2026', downloads: 37,
      extractedText: 'K-MEANS ALGORITHM DEMO: Initialize k centroids randomly. Repeat: (1) Assign each point to nearest centroid (Euclidean distance), (2) Recalculate centroids as mean of assigned points. Stop when centroids don\'t change. Code: import numpy as np; def kmeans(X, k): centroids = X[np.random.choice(X.shape[0], k)]; for _ in range(100): distances = [[np.linalg.norm(x-c) for c in centroids] for x in X]; labels = [np.argmin(d) for d in distances]; new_centroids = [X[labels==i].mean(axis=0) for i in range(k)]; if np.all(centroids == new_centroids): break; centroids = new_centroids; return labels, centroids. Elbow method to choose k: plot sum of squared distances vs k, look for elbow.' },

    // SWE 432
    { courseId: cid(8), uploaderId: uid(3), uploaderName: uname(3), title: 'React Quick Start Guide', description: 'Getting started with React hooks and components', fileType: 'PDF', fileSize: '2.6 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 93,
      extractedText: 'REACT FUNDAMENTALS: Components: function MyComponent() { return <div>Hello</div>; }. JSX: JavaScript XML syntax. Props: pass data to components, function Greeting({name}) { return <h1>Hello {name}</h1>; }. State: useState hook, const [count, setCount] = useState(0); onClick={() => setCount(count+1)}. Effects: useEffect(() => { //code }, [dependencies]). Lists: {items.map(item => <li key={item.id}>{item.name}</li>)}. Forms: controlled components, onChange update state. Event handling: onClick, onChange, onSubmit. Conditional rendering: {isLoggedIn && <Dashboard />}. React Router: <Route path="/" component={Home} />. Context API: createContext, useContext for global state.' },
    { courseId: cid(8), uploaderId: uid(18), uploaderName: uname(18), title: 'REST API Best Practices', description: 'Design patterns for RESTful APIs', fileType: 'PDF', fileSize: '1.7 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 67,
      extractedText: 'REST API DESIGN: HTTP Methods: GET (retrieve), POST (create), PUT (update/replace), PATCH (partial update), DELETE (remove). Status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error. URL patterns: /api/users (collection), /api/users/123 (specific). Filtering: /api/products?category=electronics&sort=price. Pagination: /api/users?page=2&limit=20. Versioning: /api/v1/users. Authentication: JWT tokens, OAuth 2.0. CORS: Access-Control-Allow-Origin. Best practices: use nouns not verbs, stateless, cacheable, HATEOAS (links), proper error messages with details.' },
    { courseId: cid(8), uploaderId: uid(7), uploaderName: uname(7), title: 'CSS Layout Patterns', description: 'Flexbox and Grid layout examples', fileType: 'PDF', fileSize: '4.2 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 51,
      extractedText: 'CSS FLEXBOX: display: flex on container. Properties: flex-direction (row, column), justify-content (flex-start, center, space-between, space-around), align-items (stretch, center, flex-start), flex-wrap (nowrap, wrap). Flex items: flex-grow, flex-shrink, flex-basis, flex shorthand. CSS GRID: display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: 100px auto; gap: 10px. Place items: grid-column: 1 / 3, grid-row: 1 / 2. Areas: grid-template-areas. Responsive: @media (max-width: 768px) { grid-template-columns: 1fr; }. Modern layouts: Holy Grail (header, nav, main, aside, footer), card grid, sidebar layouts.' },
    { courseId: cid(8), uploaderId: uid(0), uploaderName: uname(0), title: 'Web Security Basics', description: 'XSS, CSRF, and SQL injection prevention', fileType: 'PDF', fileSize: '2.9 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 44,
      extractedText: 'WEB SECURITY: XSS (Cross-Site Scripting): attacker injects malicious script. Prevention: sanitize input, escape output, Content Security Policy header. Types: stored XSS, reflected XSS, DOM-based. CSRF (Cross-Site Request Forgery): force user to execute unwanted actions. Prevention: CSRF tokens, SameSite cookies, check Referer header. SQL Injection: attacker manipulates SQL queries. Prevention: parameterized queries/prepared statements, input validation, ORM. Example: vulnerable: "SELECT * FROM users WHERE id=" + userId; safe: cursor.execute("SELECT * FROM users WHERE id=?", (userId,)). Other: HTTPS everywhere, secure password storage (bcrypt), rate limiting, validate all inputs, principle of least privilege.' },

    // SWE 443
    { courseId: cid(9), uploaderId: uid(3), uploaderName: uname(3), title: 'Software Architecture Patterns', description: 'MVC, microservices, event-driven, and layered', fileType: 'PDF', fileSize: '5.1 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 38,
      extractedText: 'ARCHITECTURE PATTERNS: Layered: presentation, business logic, persistence, database. Separation of concerns. MVC (Model-View-Controller): Model (data), View (UI), Controller (logic). Microservices: decompose app into small independent services, each with own database. Pros: scalability, technology diversity. Cons: complexity, distributed system challenges. Event-Driven: producers emit events, consumers react. Pub-sub pattern. Asynchronous communication. Monolithic: single deployable unit, shared database. Simple but hard to scale. Serverless: Function-as-a-Service, event-triggered, auto-scaling. Repository pattern: centralize data access. CQRS: separate read/write models. Hexagonal/Ports-Adapters: isolate core logic.' },
    { courseId: cid(9), uploaderId: uid(10), uploaderName: uname(10), title: 'Quality Attributes Guide', description: 'Performance, scalability, security tradeoffs', fileType: 'PDF', fileSize: '2.2 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 29,
      extractedText: 'QUALITY ATTRIBUTES: Performance: response time, throughput, resource utilization. Tactics: caching, load balancing, async processing. Scalability: vertical (bigger machine), horizontal (more machines). Stateless services. Security: authentication, authorization, encryption, input validation. CIA triad (confidentiality, integrity, availability). Reliability: MTBF (mean time between failures), redundancy, failover. Maintainability: modularity, documentation, code quality, testability. Usability: learnability, efficiency, user satisfaction. Modifiability: coupling, cohesion, information hiding. Testability: controllability, observability, isolability. Tradeoffs: security vs performance, scalability vs consistency, modularity vs performance. Architecture tactics address specific quality attributes.' },

    // MATH 203
    { courseId: cid(10), uploaderId: uid(6), uploaderName: uname(6), title: 'Linear Algebra Formula Sheet', description: 'All formulas and theorems in one page', fileType: 'PDF', fileSize: '650 KB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 82,
      extractedText: 'LINEAR ALGEBRA FORMULAS: Matrix multiplication: (AB)ij = Σ Aik*Bkj. Transpose: (AT)ij = Aji, (AB)T = BT*AT. Inverse: AA-1 = I, (AB)-1 = B-1*A-1. Determinant: 2x2: ad-bc, 3x3: cofactor expansion. Properties: det(AB)=det(A)det(B), det(AT)=det(A). Eigenvalues: det(A-λI)=0. Eigenvectors: (A-λI)v=0. Diagonalization: A = PDP-1 where P columns are eigenvectors. Vector spaces: closure under addition and scalar multiplication. Basis: linearly independent spanning set. Dimension: number of basis vectors. Dot product: u·v = Σ uivi = |u||v|cosθ. Orthogonal: u·v=0. Projection: projv(u) = (u·v)/(v·v) * v. Gram-Schmidt: orthogonalize basis.' },
    { courseId: cid(10), uploaderId: uid(22), uploaderName: uname(22), title: 'Eigenvalue Practice Problems', description: '50 practice problems with solutions', fileType: 'PDF', fileSize: '1.8 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 61,
      extractedText: 'EIGENVALUE PROBLEMS: Find eigenvalues and eigenvectors for: P1) [[3,1],[0,2]]. Solution: det(A-λI)=0, (3-λ)(2-λ)=0, λ=3,2. For λ=3: (A-3I)v=0, eigenvector [1,0]. For λ=2: eigenvector can be [1,-1]. P2) [[4,2],[1,3]]. Characteristic polynomial: λ²-7λ+10=0, λ=5,2. P3) Diagonalize [[1,2],[2,1]]. Eigenvalues 3,-1. P=[[1,1],[1,-1]], D=[[3,0],[0,-1]]. P4) Given matrix with λ=2 (multiplicity 2), find geometric multiplicity. P5) Prove similar matrices have same eigenvalues. P6-P50: Various matrices including symmetric, triangular, and 3x3 matrices. Key steps: (1) solve characteristic equation, (2) find null space of A-λI for each eigenvalue, (3) check if diagonalizable (n linearly independent eigenvectors).' },

    // STAT 344
    { courseId: cid(11), uploaderId: uid(13), uploaderName: uname(13), title: 'Probability Distributions Cheat Sheet', description: 'All distributions with formulas and graphs', fileType: 'PDF', fileSize: '1.3 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 74,
      extractedText: 'PROBABILITY DISTRIBUTIONS: Discrete: Binomial B(n,p): P(X=k) = C(n,k)*p^k*(1-p)^(n-k), mean=np, var=np(1-p). Poisson P(λ): P(X=k) = e^-λ * λ^k / k!, mean=λ, var=λ. Geometric: P(X=k) = (1-p)^(k-1)*p, first success. Continuous: Normal N(μ,σ²): f(x) = (1/σ√(2π)) * e^(-(x-μ)²/(2σ²)), 68-95-99.7 rule. Standard normal Z: μ=0, σ=1, Z = (X-μ)/σ. Uniform U(a,b): f(x) = 1/(b-a), mean=(a+b)/2. Exponential Exp(λ): f(x) = λ*e^(-λx), memoryless. Central Limit Theorem: sample means approach normal for large n. Law of Large Numbers: sample mean converges to population mean.' },
    { courseId: cid(11), uploaderId: uid(29), uploaderName: uname(29), title: 'Hypothesis Testing Guide', description: 'Step-by-step guide with examples', fileType: 'PDF', fileSize: '2.1 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 53,
      extractedText: 'HYPOTHESIS TESTING STEPS: 1) State hypotheses: H0 (null), Ha (alternative). 2) Choose significance level α (usually 0.05). 3) Select test statistic: z-test (known σ, large n), t-test (unknown σ, small n), chi-square, F-test. 4) Calculate test statistic: t = (x̄-μ)/(s/√n). 5) Find p-value or critical value. 6) Decision: reject H0 if p-value < α or |test stat| > critical value. 7) Conclusion in context. Type I error: reject true H0 (false positive), probability = α. Type II error: fail to reject false H0 (false negative), probability = β. Power = 1-β. Confidence interval: point estimate ± margin of error. For mean: x̄ ± t*s/√n. One-tailed vs two-tailed tests. Examples: testing if μ = 50, proportion p = 0.5, difference of means.' },
    { courseId: cid(11), uploaderId: uid(27), uploaderName: uname(27), title: 'R Statistics Reference', description: 'Common R functions for statistical analysis', fileType: 'PDF', fileSize: '1.6 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 36,
      extractedText: 'R FUNCTIONS: Data: c(1,2,3) vector, data.frame(x,y), read.csv("file.csv"). Summary statistics: mean(), median(), sd(), var(), quantile(), summary(). Visualization: plot(x,y), hist(x), boxplot(x), barplot(x). Distributions: rnorm(n, mean, sd) random, dnorm(x) density, pnorm(x) cumulative, qnorm(p) quantile. Similar for binom, pois, exp, unif. Hypothesis tests: t.test(x, mu=0), t.test(x, y), prop.test(x, n), chi sq.test(table). Regression: lm(y ~ x), summary(fit), predict(fit). Correlation: cor(x,y), cor.test(x,y). dplyr: filter(), select(), mutate(), summarize(), group_by(). ggplot2: ggplot(data, aes(x,y)) + geom_point() + geom_line().' },

    // CS 425
    { courseId: cid(12), uploaderId: uid(4), uploaderName: uname(4), title: 'Unity Scripting Guide', description: 'C# scripting fundamentals for Unity', fileType: 'PDF', fileSize: '3.8 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 47,
      extractedText: 'UNITY C# SCRIPTING: MonoBehaviour lifecycle: Awake(), Start(), Update(), FixedUpdate(), LateUpdate(), OnDestroy(). Getting components: GetComponent<Rigidbody>(), GetComponentInChildren(), FindObjectOfType(). Transform: transform.position, transform.rotation, transform.Translate(), transform.Rotate(). Input: Input.GetKey(KeyCode.Space), Input.GetMouseButton(0), Input.GetAxis("Horizontal"). Physics: Rigidbody.AddForce(), OnCollisionEnter(Collision col), OnTriggerEnter(Collider other). Instantiate: Instantiate(prefab, position, rotation), Destroy(gameObject, delay). Coroutines: IEnumerator, yield return new WaitForSeconds(1f), StartCoroutine(). GameObject: SetActive(), tag, layer. Scene management: SceneManager.LoadScene(). PlayerPrefs: PlayerPrefs.SetInt("score", 100).' },
    { courseId: cid(12), uploaderId: uid(19), uploaderName: uname(19), title: 'Game Physics Notes', description: 'Rigidbody dynamics and collision detection', fileType: 'PDF', fileSize: '2.5 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 32,
      extractedText: 'GAME PHYSICS: Rigidbody: mass, drag, gravity, velocity, angularVelocity. Forces: AddForce(force, ForceMode.Impulse/Force/VelocityChange). Collision detection: discrete (fast, may tunnel), continuous (slower, accurate). Colliders: BoxCollider, SphereCollider, MeshCollider. Triggers vs Collisions: trigger is sensor (OnTriggerEnter), collision is physical (OnCollisionEnter). Layers and collision matrix. Raycasting: Physics.Raycast(origin, direction, out hit, maxDistance), useful for shooting, detection. Physics materials: friction, bounciness. Joints: HingeJoint, SpringJoint, FixedJoint. Character controller for player movement. Kinematic: rigidbody not affected by physics, control directly. 2D physics: Rigidbody2D, Collider2D, Physics2D.Raycast().' },

    // CS 450
    { courseId: cid(13), uploaderId: uid(2), uploaderName: uname(2), title: 'SQL Quick Reference', description: 'SELECT, JOIN, GROUP BY, and subqueries', fileType: 'PDF', fileSize: '1.1 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 96,
      extractedText: 'SQL REFERENCE: SELECT: SELECT column1, column2 FROM table WHERE condition ORDER BY column ASC/DESC LIMIT n. Aggregates: COUNT(), SUM(), AVG(), MAX(), MIN(). GROUP BY: SELECT dept, COUNT(*) FROM employees GROUP BY dept HAVING COUNT(*) > 5. JOINS: INNER JOIN (matching rows), LEFT JOIN (all from left), RIGHT JOIN (all from right), FULL OUTER JOIN (all from both). Example: SELECT * FROM orders o INNER JOIN customers c ON o.customer_id = c.id. Subqueries: SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees). INSERT: INSERT INTO table (col1, col2) VALUES (val1, val2). UPDATE: UPDATE table SET col1=val1 WHERE condition. DELETE: DELETE FROM table WHERE condition. CREATE TABLE: CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE).' },
    { courseId: cid(13), uploaderId: uid(5), uploaderName: uname(5), title: 'Normalization Examples', description: '1NF through BCNF with worked examples', fileType: 'PDF', fileSize: '2.4 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 68,
      extractedText: 'DATABASE NORMALIZATION: 1NF (First Normal Form): eliminate repeating groups, atomic values, each column single value. Example: split "phone1, phone2" into separate rows. 2NF: must be in 1NF, no partial dependencies (non-key attributes depend on whole primary key). Example: if key is (StudentID, CourseID), student name depends only on StudentID, so separate table. 3NF: must be in 2NF, no transitive dependencies (non-key depends on non-key). Example: StudentID -> ZipCode -> City, so separate City into ZipCodes table. BCNF (Boyce-Codd): for every dependency X -> Y, X must be superkey. Decomposition: split table while preserving data and dependencies. Benefits: reduce redundancy, prevent anomalies (insert, update, delete). Denormalization: sometimes violate NF for performance (read-heavy systems).' },
    { courseId: cid(13), uploaderId: uid(24), uploaderName: uname(24), title: 'NoSQL Comparison', description: 'MongoDB vs Cassandra vs Redis use cases', fileType: 'PDF', fileSize: '1.9 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 42,
      extractedText: 'NOSQL DATABASES: MongoDB (document store): JSON-like documents, flexible schema, good for hierarchical data, aggregation pipeline. Example: db.users.find({age: {$gt: 25}}). Use cases: content management, real-time analytics. Cassandra (wide-column store): distributed, high availability, write-optimized, eventual consistency. CQL query language similar to SQL. Use cases: time-series data, IoT, messaging. Redis (key-value store): in-memory, very fast, supports strings, lists, sets, hashes. Pub/sub messaging. Example: SET key value, GET key, LPUSH mylist value. Use cases: caching, session storage, leaderboards, real-time analytics. CAP theorem: Consistency, Availability, Partition tolerance (choose 2). MongoDB: CP, Cassandra: AP. Choose based on: data model, scalability needs, consistency requirements, query patterns.' },
    
    // Additional CS 110 Documents
    { courseId: cid(0), uploaderId: uid(17), uploaderName: uname(17), title: 'Python Cheat Sheet', description: 'Quick reference for Python syntax and built-ins', fileType: 'PDF', fileSize: '0.8 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 128,
      extractedText: 'PYTHON CHEAT SHEET: Variables: x = 5, name = "John". Types: int, float, str, bool, list, tuple, dict, set. Operators: +, -, *, /, //, %, **. Comparison: ==, !=, <, >, <=, >=. Logical: and, or, not. Strings: s.upper(), s.lower(), s.strip(), s.split(), s.replace(old, new), f-strings f"Hello {name}". Lists: append(), extend(), insert(), remove(), pop(), sort(), reverse(), len(), slicing [start:end:step]. Dictionaries: d[key], d.get(key, default), d.keys(), d.values(), d.items(). Loops: for item in list:, for i in range(n):, while condition:. Functions: def func(param1, param2=default): return value. Comprehensions: [x**2 for x in range(10)], {x: x**2 for x in range(5)}. File I/O: with open("file.txt", "r") as f: content = f.read(). Import: import math, from module import function.' },
    { courseId: cid(0), uploaderId: uid(28), uploaderName: uname(28), title: 'Debugging Tips for Beginners', description: 'Common errors and how to fix them', fileType: 'PDF', fileSize: '1.2 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 87,
      extractedText: 'DEBUGGING PYTHON: Common Errors: IndentationError - fix indentation consistency (4 spaces), NameError - variable not defined or typo, TypeError - wrong type (e.g., int + str), IndexError - list index out of range, KeyError - dictionary key doesn\'t exist. Debug Strategies: Print statements - print(f"x = {x}") at key points, Python debugger - import pdb; pdb.set_trace(), Read error messages - last line shows error type, traceback shows where. Check: spelling, indentation, parentheses matching, data types. Use help(function) or dir(object) to explore. Test edge cases: empty lists, zero, negative numbers, None. Divide and conquer: comment out code blocks to isolate issue. Rubber duck debugging: explain code line-by-line.' },
    
    // Additional CS 211 Documents  
    { courseId: cid(1), uploaderId: uid(6), uploaderName: uname(6), title: 'Java Collections Framework Guide', description: 'ArrayList, HashMap, HashSet, LinkedList usage', fileType: 'PDF', fileSize: '2.7 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 92,
      extractedText: 'JAVA COLLECTIONS: List interface: ArrayList (dynamic array, fast random access, O(1) get, O(n) insert/delete), LinkedList (doubly-linked, O(1) insert/delete at ends, O(n) random access). Methods: add(), get(index), remove(), size(), contains(), clear(). Set interface: HashSet (no duplicates, unordered, O(1) operations), TreeSet (sorted, O(log n)). Map interface: HashMap (key-value pairs, O(1) put/get), TreeMap (sorted keys). Methods: put(key, value), get(key), containsKey(), keySet(), values(), entrySet(). Iteration: for (Type item : collection), Iterator<Type> it = collection.iterator(). Collections utility: Collections.sort(list), Collections.reverse(), Collections.shuffle(), Collections.max(). Comparable vs Comparator: implement Comparable for natural ordering, use Comparator for custom ordering.' },
    { courseId: cid(1), uploaderId: uid(13), uploaderName: uname(13), title: 'Exception Handling Best Practices', description: 'Try-catch, custom exceptions, error recovery', fileType: 'PDF', fileSize: '1.6 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 74,
      extractedText: 'JAVA EXCEPTIONS: Try-catch: try { risky code } catch (ExceptionType e) { handle } finally { cleanup }. Multiple catch blocks: order from most specific to most general. Throw: throw new IllegalArgumentException("message"). Throws: method signature declares: public void method() throws IOException. Checked vs Unchecked: Checked (IOException, SQLException) must be caught or declared, Unchecked (NullPointerException, ArrayIndexOutOfBounds) are runtime errors. Custom exceptions: class MyException extends Exception { public MyException(String msg) { super(msg); } }. Best practices: catch specific exceptions, don\'t catch Throwable, log errors, provide meaningful messages, clean up resources in finally or use try-with-resources. Try-with-resources: try (BufferedReader br = new BufferedReader(new FileReader("file"))) { } automatically closes resource.' },
    { courseId: cid(1), uploaderId: uid(17), uploaderName: uname(17), title: 'Final Exam Practice Problems', description: '50 problems covering all topics with solutions', fileType: 'PDF', fileSize: '4.2 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 156,
      extractedText: 'CS 211 FINAL EXAM PRACTICE: OOP Concepts: write class with inheritance, override methods, implement interfaces. Code tracing: given code, determine output. Debugging: identify and fix errors in code snippets. Collections: choose appropriate data structure, implement using ArrayList/HashMap. Recursion: write recursive method (factorial, Fibonacci, binary search). File I/O: read from file, parse data, write results. Exception handling: add try-catch blocks appropriately. Polymorphism: demonstrate method overriding and dynamic binding. Abstract classes vs interfaces: explain differences and when to use each. Comparable/Comparator: implement custom sorting. Time complexity: analyze O(n) performance. Topics: Classes, Inheritance, Polymorphism, Abstract classes, Interfaces, Generics, Collections, Exception handling, File I/O, Recursion.' },
    
    // Additional CS 262 Documents
    { courseId: cid(2), uploaderId: uid(22), uploaderName: uname(22), title: 'C Programming Style Guide', description: 'Coding conventions and best practices', fileType: 'PDF', fileSize: '1.1 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 58,
      extractedText: 'C STYLE GUIDE: Naming: variables lowercase with underscores (student_count), constants UPPERCASE (MAX_SIZE), functions descriptive verbs (calculate_average). Indentation: 4 spaces, consistent bracing style. Comments: explain why not what, document functions with parameters and return values. Pointers: check for NULL before dereferencing, avoid dangling pointers, use const for read-only data. Memory: free every malloc, avoid memory leaks with valgrind. Functions: keep small (< 50 lines), single responsibility, declare prototypes in header. Error handling: check return values (malloc, file operations), use errno for system calls. Avoid: global variables, magic numbers (use #define), goto statements. Include guards: #ifndef HEADER_H #define HEADER_H ... #endif. Compilation: gcc -Wall -Wextra -std=c99 -pedantic.' },
    { courseId: cid(2), uploaderId: uid(26), uploaderName: uname(26), title: 'Makefile Tutorial', description: 'Automating C compilation with make', fileType: 'PDF', fileSize: '0.9 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 63,
      extractedText: 'MAKEFILE BASICS: Structure: target: dependencies\\n\\tcommand. Example: program: main.o utils.o\\n\\tgcc -o program main.o utils.o\\nmain.o: main.c\\n\\tgcc -c main.c. Variables: CC = gcc, CFLAGS = -Wall -g, $(CC) $(CFLAGS). Automatic variables: $@ (target), $< (first dependency), $^ (all dependencies). Pattern rules: %.o: %.c\\n\\t$(CC) $(CFLAGS) -c $<. Phony targets: .PHONY: clean\\nclean:\\n\\trm -f *.o program. Common targets: all (default build), clean (remove generated files), install (copy to system). Dependencies: use gcc -MM to generate. Complete example: CC=gcc\\nCFLAGS=-Wall -g\\nOBJS=main.o utils.o\\nprogram: $(OBJS)\\n\\t$(CC) -o $@ $^\\nclean:\\n\\trm -f $(OBJS) program.' },
    
    // Additional CS 310 Documents
    { courseId: cid(3), uploaderId: uid(0), uploaderName: uname(0), title: 'Graph Algorithms Cheat Sheet', description: 'BFS, DFS, Dijkstra, Prim, Kruskal', fileType: 'PDF', fileSize: '2.1 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 143,
      extractedText: 'GRAPH ALGORITHMS: Representation: adjacency matrix (V x V array, O(1) edge check, O(V²) space), adjacency list (array of lists, O(V+E) space). BFS (Breadth-First Search): queue-based, shortest path in unweighted graph, O(V+E). Use for: level-order traversal, shortest path. DFS (Depth-First Search): stack/recursion-based, O(V+E). Use for: cycle detection, topological sort, connected components. Dijkstra\'s: single-source shortest path for non-negative weights, priority queue, O((V+E) log V). Bellman-Ford: handles negative weights, O(VE). Floyd-Warshall: all-pairs shortest paths, O(V³). Prim\'s MST: grow tree from single vertex, O(E log V) with heap. Kruskal\'s MST: sort edges, union-find, O(E log E). Topological sort: DFS-based, only for DAGs (directed acyclic graphs).' },
    { courseId: cid(3), uploaderId: uid(8), uploaderName: uname(8), title: 'Heap Implementation Guide', description: 'Min-heap and max-heap with code examples', fileType: 'PDF', fileSize: '1.7 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 87,
      extractedText: 'HEAP DATA STRUCTURE: Binary heap: complete binary tree, array-based. Max-heap: parent ≥ children. Min-heap: parent ≤ children. Array indexing: parent at i/2, left child at 2i, right child at 2i+1 (1-indexed) or parent (i-1)/2, left 2i+1, right 2i+2 (0-indexed). Insert: add at end, bubble up (heapify up), O(log n). DeleteMax/Min: replace root with last element, bubble down (heapify down), O(log n). BuildHeap: heapify all non-leaf nodes bottom-up, O(n). Heap sort: build heap, repeatedly deleteMax, O(n log n), in-place, not stable. Priority queue: implemented with heap, insert O(log n), getMax/Min O(1), deleteMax/Min O(log n). Use cases: Dijkstra\'s algorithm, Prim\'s MST, median maintenance, top-k elements.' },
    { courseId: cid(3), uploaderId: uid(14), uploaderName: uname(14), title: 'Dynamic Programming Patterns', description: 'Common DP problems and solution templates', fileType: 'PDF', fileSize: '3.5 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 168,
      extractedText: 'DYNAMIC PROGRAMMING: Approach: 1) identify overlapping subproblems, 2) define state (DP array), 3) find recurrence relation, 4) base cases, 5) iterative or memoized solution. Fibonacci: dp[i] = dp[i-1] + dp[i-2], O(n) time/space. Coin change: dp[amount] = min(dp[amount - coin] + 1 for each coin). Longest common subsequence: dp[i][j] = dp[i-1][j-1] + 1 if s1[i]==s2[j] else max(dp[i-1][j], dp[i][j-1]). Knapsack 0/1: dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i]). Edit distance: insert/delete/replace operations. Longest increasing subsequence: O(n log n) with binary search. Matrix chain multiplication. DP vs Greedy: DP for optimal substructure + overlapping subproblems, Greedy for greedy choice property. Memoization (top-down) vs Tabulation (bottom-up).' },
    
    // Additional CS 471 Documents
    { courseId: cid(4), uploaderId: uid(18), uploaderName: uname(18), title: 'Process Scheduling Algorithms', description: 'FCFS, SJF, Round Robin, Priority comparison', fileType: 'PDF', fileSize: '2.3 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 91,
      extractedText: 'CPU SCHEDULING: FCFS (First-Come-First-Serve): simple queue, non-preemptive, convoy effect (short behind long). SJF (Shortest Job First): minimize average waiting time, can\'t predict burst time, starvation of long jobs. SRTF (Shortest Remaining Time First): preemptive SJF, optimal average waiting time. Round Robin: time quantum q, preemptive, fair, context switch overhead if q too small, degrades to FCFS if q too large. Priority scheduling: each process has priority, starvation solution: aging (increase priority over time). Multilevel queue: separate queues for different priority classes. Multilevel feedback queue: processes move between queues based on behavior. Metrics: CPU utilization, throughput, turnaround time (completion - arrival), waiting time, response time. Real-time: hard (must meet deadline), soft (prefer to meet deadline). Rate monotonic, earliest deadline first.' },
    { courseId: cid(4), uploaderId: uid(10), uploaderName: uname(10), title: 'Virtual Memory Deep Dive', description: 'Paging, TLB, page replacement algorithms', fileType: 'PDF', fileSize: '3.1 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 78,
      extractedText: 'VIRTUAL MEMORY: Paging: divide memory into fixed-size frames, divide logical addresses into pages. Page table: maps page number to frame number. Address translation: virtual address = (page number, offset), physical address = (frame number, offset). TLB (Translation Lookaside Buffer): cache for page table, fast parallel search, hit ratio critical for performance. Page faults: page not in memory, trigger interrupt, load from disk (millions of cycles). Page replacement: needed when no free frames. FIFO: simple, Belady\'s anomaly. Optimal: replace page not used for longest time (theoretical). LRU (Least Recently Used): approximate optimal, implementation: counter or stack. Clock/Second chance: circular list, reference bit, approximate LRU. Thrashing: system spends more time paging than executing. Working set model: locality of reference. Demand paging: load pages only when needed.' },
    
    // Additional CS 484 Documents
    { courseId: cid(5), uploaderId: uid(21), uploaderName: uname(21), title: 'Neural Networks Fundamentals', description: 'Perceptron, backpropagation, activation functions', fileType: 'PDF', fileSize: '3.9 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 102,
      extractedText: 'NEURAL NETWORKS: Perceptron: linear classifier, y = activation(w·x + b), weights w, bias b. Activation functions: sigmoid σ(x) = 1/(1+e^-x) (0 to 1), tanh (- 1 to 1), ReLU max(0,x) (faster, avoids vanishing gradient), Leaky ReLU, softmax (multi-class output). Multilayer perceptron (MLP): input layer, hidden layers, output layer, fully connected. Forward propagation: compute outputs layer by layer. Backpropagation: calculate gradients using chain rule, update weights: w = w - α * ∂L/∂w (α = learning rate). Loss functions: MSE (regression), cross-entropy (classification). Gradient descent: batch (entire dataset), mini-batch (subset), stochastic (single example). Optimization: momentum, Adam, RMSprop. Overfitting solutions: regularization (L1, L2), dropout, early stopping. Deep learning: many hidden layers, convolutional layers (CNNs for images), recurrent layers (RNNs for sequences).' },
    { courseId: cid(5), uploaderId: uid(27), uploaderName: uname(27), title: 'Feature Engineering Guide', description: 'Preprocessing, scaling, encoding, feature selection', fileType: 'PDF', fileSize: '2.4 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 84,
      extractedText: 'FEATURE ENGINEERING: Preprocessing: handle missing values (mean imputation, median, drop, forward fill), remove outliers (z-score > 3, IQR method). Scaling: normalization (0 to 1): x_new = (x - min)/(max - min), standardization (z-score): x_new = (x - μ)/σ. Important for distance-based algorithms (k-NN, SVM, k-means). Encoding categorical: One-hot encoding (binary columns for each category), label encoding (ordinal numbers), target encoding (mean of target per category). Feature creation: polynomial features (x, x², x³), interaction terms (x1*x2), domain-specific (age from birthdate). Feature selection: filter methods (correlation, chi-square), wrapper methods (forward/backward selection), embedded methods (Lasso). Dimensionality reduction: PCA (principal component analysis), t-SNE (visualization). Text features: TF-IDF, bag of words, word embeddings. Time series: lag features, rolling statistics.' },
    
    // Additional SWE 432 Documents
    { courseId: cid(6), uploaderId: uid(16), uploaderName: uname(16), title: 'Express.js API Design Patterns', description: 'Middleware, error handling, validation', fileType: 'PDF', fileSize: '2.2 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 89,
      extractedText: 'EXPRESS.JS PATTERNS: Middleware: functions with (req, res, next), execute in order, app.use() for all routes, router.use() for specific router. Example: app.use(express.json()), logging middleware, authentication. Error handling middleware: 4 parameters (err, req, res, next), must be last. Validation: express-validator, Joi. Router organization: separate files, const router = express.Router(), module.exports = router. Request object: req.params (route params), req.query (query string), req.body (POST data), req.headers. Response methods: res.json(), res.status(), res.send(), res.redirect(). Async error handling: try-catch in async routes or use express-async-handler. Environment variables: process.env, use dotenv. CORS: cors middleware. Security: helmet (HTTP headers), rate limiting, input sanitization. Testing: Jest, Supertest for integration testing. File uploads: multer middleware.' },
    { courseId: cid(6), uploaderId: uid(24), uploaderName: uname(24), title: 'JavaScript ES6+ Features', description: 'Arrow functions, destructuring, async/await, modules', fileType: 'PDF', fileSize: '1.8 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 107,
      extractedText: 'JAVASCRIPT ES6+: Arrow functions: const add = (a, b) => a + b, implicit return, lexical this. Destructuring: const {name, age} = user, const [first, second] = array. Spread operator: [...array], {...object}, copy and merge. Template literals: `Hello ${name}`. Default parameters: function greet(name = "World"). Rest parameters: function sum(...numbers). Modules: export const func, import { func } from "./module". Classes: class Person { constructor(name) { this.name = name; } }. Promises: new Promise((resolve, reject)), .then(), .catch(), .finally(). Async/await: async function fetchData() { const data = await api.get(); }. Enhanced object literals: shorthand properties { name, age }. Map and Set: new Map(), map.set(key, value), new Set(). Optional chaining: user?.address?.city. Nullish coalescing: value ?? default.' },
    
    // Additional SWE 443 Documents
    { courseId: cid(7), uploaderId: uid(12), uploaderName: uname(12), title: 'Design Patterns Catalog', description: 'Singleton, Factory, Observer, Strategy, Decorator', fileType: 'PDF', fileSize: '4.5 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 124,
      extractedText: 'DESIGN PATTERNS: Creational: Singleton (one instance, global access, lazy initialization), Factory (create objects without specifying exact class), Abstract Factory (families of related objects), Builder (construct complex objects step by step), Prototype (clone objects). Structural: Adapter (incompatible interfaces), Decorator (add behavior dynamically), Facade (simplified interface), Proxy (control access), Composite (tree structure). Behavioral: Observer (subscribe/notify, pub-sub), Strategy (interchangeable algorithms), Command (encapsulate requests), State (behavior changes with state), Template Method (algorithm skeleton), Iterator (sequential access). Use cases: Singleton for DB connection, Factory for object creation based on input, Observer for event systems, Strategy for sorting algorithms, Decorator for extending functionality. Anti-patterns: God object, spaghetti code, golden hammer.' },
    { courseId: cid(7), uploaderId: uid(16), uploaderName: uname(16), title: 'UML Diagram Guide', description: 'Class diagrams, sequence diagrams, use case diagrams', fileType: 'PDF', fileSize: '3.2 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 96,
      extractedText: 'UML DIAGRAMS: Class diagram: boxes with class name, attributes, methods. Relationships: association (line), aggregation (hollow diamond), composition (filled diamond), inheritance (hollow arrow), dependency (dashed arrow), multiplicity (0..1, 1..*, *). Sequence diagram: objects across top, time flows down, arrows for messages, activation boxes for execution. Use case diagram: actors (stick figures), use cases (ovals), system boundary, relationships (includes, extends). Activity diagram: flowchart-like, actions, decisions (diamond), fork/join (parallel), swimlanes for responsibilities. State diagram: states (rounded rectangles), transitions (arrows with events/conditions), initial state (filled circle), final state (bullseye). Component diagram: high-level components and dependencies. Deployment diagram: hardware nodes, software artifacts, physical deployment. Tools: PlantUML, Lucidchart, draw.io. Best practices: keep simple, consistent notation, appropriate detail level.' },
    
    // Additional MATH 203 Documents
    { courseId: cid(8), uploaderId: uid(7), uploaderName: uname(7), title: 'Matrix Inverse Methods', description: 'Gaussian elimination, adjugate method, LU decomposition', fileType: 'PDF', fileSize: '1.9 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 81,
      extractedText: 'MATRIX INVERSE: Definition: AA⁻¹ = A⁻¹A = I. Invertible iff det(A) ≠ 0. Gauss-Jordan elimination: augment [A | I], row reduce to [I | A⁻¹]. Row operations: swap rows, multiply row by scalar, add multiple of row to another. 2×2 inverse: A = [a b; c d], A⁻¹ = (1/det) [d -b; -c a] where det = ad - bc. Adjugate method: A⁻¹ = (1/det(A)) adj(A), where adj(A) = C^T (transpose of cofactor matrix). Cofactor C_ij = (-1)^(i+j) M_ij (M_ij is minor). LU decomposition: A = LU where L is lower triangular, U is upper triangular. Solve Ax = b: LUx = b, first solve Ly = b, then Ux = y. Properties: (AB)⁻¹ = B⁻¹A⁻¹, (A^T)⁻¹ = (A⁻¹)^T, (kA)⁻¹ = (1/k)A⁻¹. Applications: solving systems, finding equation of plane through points.' },
    
    // Additional STAT 344 Documents
    { courseId: cid(9), uploaderId: uid(11), uploaderName: uname(11), title: 'Confidence Intervals Guide', description: 'Mean, proportion, difference of means', fileType: 'PDF', fileSize: '1.5 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 93,
      extractedText: 'CONFIDENCE INTERVALS: General form: estimate ± (critical value) × (standard error). Confidence level: 90% → α=0.10, z=1.645; 95% → α=0.05, z=1.96; 99% → α=0.01, z=2.576. Mean (σ known): x̄ ± z(σ/√n). Mean (σ unknown): x̄ ± t(s/√n), use t-distribution with df=n-1. Proportion: p̂ ± z√(p̂(1-p̂)/n), need np≥10 and n(1-p)≥10. Difference of means (independent): (x̄₁ - x̄₂) ± t√(s₁²/n₁ + s₂²/n₂). Difference of means (paired): d̄ ± t(s_d/√n) where d is differences. Sample size for mean: n = (z×σ/E)² for margin of error E. Sample size for proportion: n = p̂(1-p̂)(z/E)², use p̂=0.5 if no estimate. Interpretation: "We are 95% confident that the true parameter is between __ and __". Wider CI: higher confidence, larger σ, smaller n.' },
    { courseId: cid(9), uploaderId: uid(23), uploaderName: uname(23), title: 'ANOVA Explained', description: 'One-way ANOVA, assumptions, post-hoc tests', fileType: 'PDF', fileSize: '2.6 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 67,
      extractedText: 'ANOVA (Analysis of Variance): Purpose: compare means of 3+ groups. H₀: μ₁ = μ₂ = ... = μₖ (all means equal). Hₐ: at least one mean differs. Test statistic: F = (between-group variability) / (within-group variability) = MST/MSE. SST (total sum of squares) = SSB (between groups) + SSE (within groups). MST = SSB/(k-1), MSE = SSE/(n-k). F-distribution with df₁=k-1, df₂=n-k. Assumptions: independence, normality of residuals (check with Q-Q plot), equal variances (Levene test). Decision: reject H₀ if F > F_critical or p-value < α. Post-hoc tests: Tukey HSD (honestly significant difference) for pairwise comparisons when ANOVA significant, controls family-wise error rate. Two-way ANOVA: two factors, can test interaction. R code: aov(y ~ group), summary(fit), TukeyHSD(fit). Effect size: η² = SSB/SST.' },
    
    // Additional CS 425 Documents
    { courseId: cid(12), uploaderId: uid(8), uploaderName: uname(8), title: 'Unity Animation System', description: 'Animator controller, animation clips, blend trees', fileType: 'PDF', fileSize: '3.3 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 59,
      extractedText: 'UNITY ANIMATION: Animator component: attach to GameObject with animation. Animator Controller: state machine, states (animation clips), transitions (conditions). Parameters: bool, float, int, trigger. Transitions: Has Exit Time (play full animation), Transition Duration, conditions based on parameters. Script control: animator.SetBool("isRunning", true), animator.SetTrigger("Jump"). Blend Trees: blend multiple animations (walk-run based on speed parameter), 1D or 2D blending. Animation Events: call functions at specific frame. Mecanim humanoid rig: retargeting animations between characters. Root Motion: movement driven by animation vs script. Animation Curves: animate properties over time, AnimationCurve in scripts. Legacy Animation: Animation component, animation.Play("clipName"), deprecated but simpler. Inverse Kinematics (IK): OnAnimatorIK(), SetIKPosition/Rotation for hand placement.' },
    
    // Additional CS 450 Documents
    { courseId: cid(13), uploaderId: uid(18), uploaderName: uname(18), title: 'Database Indexing Strategies', description: 'B-trees, hash indexes, performance tuning', fileType: 'PDF', fileSize: '2.8 MB', mimeType: 'application/pdf', semester: 'Spring 2026', downloads: 73,
      extractedText: 'DATABASE INDEXING: Purpose: speed up queries, trade-off with insert/update performance. B-tree index: balanced tree, O(log n) search, default in most RDBMS, good for range queries. Hash index: O(1) lookup for equality, no range queries. Clustered index: table data stored in index order, one per table, primary key usually clustered. Non-clustered: separate structure, multiple per table. Composite index: multiple columns, index on (lastName, firstName), order matters, use leftmost prefix. Covering index: includes all columns needed for query, avoid table access. CREATE INDEX idx_name ON table(column); DROP INDEX idx_name; Query planner: EXPLAIN SELECT to see index usage. When to index: columns in WHERE, JOIN, ORDER BY. When not: small tables, frequently updated columns, low cardinality (few distinct values). Maintain: REINDEX, VACUUM. Full-text index: for text search. Spatial index: for geographic data.' },
  ];

  await Document.insertMany(docsData);
  console.log(`Created ${docsData.length} documents`);

  // ═══════════════════════════════════════════
  // MASON MEETS (20+ meetups)
  // ═══════════════════════════════════════════
  const meetsData = [
    { title: 'Pickup Basketball Game', description: 'Casual 5v5 at the RAC. All skill levels welcome!', location: 'RAC Basketball Courts', dateTime: day(1), duration: 90, organizerId: uid(4), organizerName: uname(4), category: 'Sports', maxAttendees: 10, attendingIds: [uid(0),uid(8),uid(14),uid(22),uid(26)], notAttendingIds: [uid(6)] },
    { title: 'Soccer at the Fields', description: 'Weekend soccer game. Bring cleats if you have them!', location: 'Patriot Field', dateTime: day(3), duration: 90, organizerId: uid(22), organizerName: uname(22), category: 'Sports', maxAttendees: 22, attendingIds: [uid(0),uid(4),uid(6),uid(8),uid(14),uid(17),uid(19),uid(28)], notAttendingIds: [] },
    { title: 'Frisbee on the Quad', description: 'Let\'s play ultimate frisbee!', location: 'North Plaza', dateTime: day(5), duration: 60, organizerId: uid(6), organizerName: uname(6), category: 'Sports', maxAttendees: 0, attendingIds: [uid(4),uid(17),uid(22),uid(28)], notAttendingIds: [] },
    { title: 'MasonHacks Planning Committee', description: 'Planning meeting for the upcoming hackathon', location: 'Johnson Center Room 329', dateTime: day(2), duration: 60, organizerId: uid(0), organizerName: uname(0), category: 'Club', maxAttendees: 15, attendingIds: [uid(2),uid(3),uid(10),uid(14),uid(18),uid(24)], notAttendingIds: [uid(16)] },
    { title: 'ACM Chapter Meeting', description: 'Monthly ACM meeting. Guest speaker on AI!', location: 'Innovation Hall 105', dateTime: day(4), duration: 90, organizerId: uid(2), organizerName: uname(2), category: 'Club', maxAttendees: 50, attendingIds: [uid(0),uid(3),uid(5),uid(10),uid(12),uid(14),uid(16),uid(18),uid(21),uid(24),uid(27)], notAttendingIds: [] },
    { title: 'Cybersecurity Club CTF Night', description: 'Practice CTF challenges together. Beginners welcome!', location: 'Nguyen Engineering 1103', dateTime: day(6), duration: 180, organizerId: uid(9), organizerName: uname(9), category: 'Club', maxAttendees: 30, attendingIds: [uid(1),uid(15),uid(20),uid(24),uid(26),uid(29)], notAttendingIds: [] },
    { title: 'Women in Tech Networking', description: 'Networking event for WIT members and allies', location: 'Mason Square Room 102', dateTime: day(8), duration: 120, organizerId: uid(3), organizerName: uname(3), category: 'Social', maxAttendees: 40, attendingIds: [uid(1),uid(5),uid(7),uid(11),uid(13),uid(17),uid(21),uid(23),uid(25),uid(27),uid(29)], notAttendingIds: [] },
    { title: 'Algorithm Study Marathon', description: '6-hour LeetCode grinding session. Snacks provided!', location: 'Fenwick Library 3rd Floor', dateTime: day(3), duration: 360, organizerId: uid(14), organizerName: uname(14), category: 'Study', maxAttendees: 20, attendingIds: [uid(0),uid(2),uid(4),uid(8),uid(10),uid(12),uid(18),uid(22),uid(24),uid(26)], notAttendingIds: [uid(5)] },
    { title: 'Machine Learning Reading Group', description: 'Discussing "Attention Is All You Need" paper', location: 'Research Hall 163', dateTime: day(5), duration: 90, organizerId: uid(21), organizerName: uname(21), category: 'Study', maxAttendees: 15, attendingIds: [uid(2),uid(5),uid(13),uid(19),uid(27)], notAttendingIds: [] },
    { title: 'Coffee & Code', description: 'Casual coding meetup at Starbucks. Bring your laptop!', location: 'Starbucks @ Johnson Center', dateTime: day(1), duration: 120, organizerId: uid(18), organizerName: uname(18), category: 'Social', maxAttendees: 0, attendingIds: [uid(0),uid(3),uid(7),uid(11),uid(23),uid(25)], notAttendingIds: [] },
    { title: 'Tech Talk: Cloud Architecture', description: 'Chris shares his AWS experience and best practices', location: 'Innovation Hall 208', dateTime: day(7), duration: 60, organizerId: uid(10), organizerName: uname(10), category: 'Study', maxAttendees: 30, attendingIds: [uid(0),uid(2),uid(7),uid(11),uid(16),uid(18),uid(24),uid(26),uid(29)], notAttendingIds: [uid(3)] },
    { title: 'Board Game Night', description: 'Settlers of Catan, Ticket to Ride, and more!', location: 'Southside Dining Hall', dateTime: day(2), duration: 180, organizerId: uid(17), organizerName: uname(17), category: 'Social', maxAttendees: 16, attendingIds: [uid(6),uid(13),uid(23),uid(28),uid(4),uid(22)], notAttendingIds: [] },
    { title: 'Mock Interview Practice', description: 'Practice technical interviews with peers', location: 'Career Services Room 204', dateTime: day(4), duration: 120, organizerId: uid(16), organizerName: uname(16), category: 'Study', maxAttendees: 12, attendingIds: [uid(0),uid(2),uid(5),uid(10),uid(12),uid(14)], notAttendingIds: [uid(24)] },
    { title: 'Open Source Contribution Day', description: 'Find and contribute to open source projects together', location: 'Innovation Hall 105', dateTime: day(9), duration: 240, organizerId: uid(0), organizerName: uname(0), category: 'Club', maxAttendees: 25, attendingIds: [uid(2),uid(3),uid(10),uid(11),uid(14),uid(16),uid(18),uid(24),uid(25),uid(26)], notAttendingIds: [] },
    { title: 'Running Club: Campus Loop', description: '3-mile run around campus at sunset', location: 'Patriot Circle Start', dateTime: day(1), duration: 45, organizerId: uid(8), organizerName: uname(8), category: 'Sports', maxAttendees: 0, attendingIds: [uid(0),uid(4),uid(14),uid(22),uid(26)], notAttendingIds: [] },
    { title: 'Movie Night: The Social Network', description: 'Watching the classic tech movie together', location: 'Cinema Room, JC', dateTime: day(6), duration: 150, organizerId: uid(23), organizerName: uname(23), category: 'Social', maxAttendees: 30, attendingIds: [uid(6),uid(7),uid(13),uid(17),uid(22),uid(28),uid(3),uid(11)], notAttendingIds: [] },
    { title: 'Blockchain Workshop', description: 'Build your first smart contract on Ethereum testnet', location: 'Nguyen Engineering 1505', dateTime: day(10), duration: 120, organizerId: uid(24), organizerName: uname(24), category: 'Study', maxAttendees: 20, attendingIds: [uid(0),uid(2),uid(5),uid(10),uid(12),uid(16),uid(21),uid(29)], notAttendingIds: [] },
    { title: 'Volleyball at Sandy Creek', description: 'Beach volleyball! Beginners welcome', location: 'Sandy Creek Park', dateTime: day(8), duration: 90, organizerId: uid(19), organizerName: uname(19), category: 'Sports', maxAttendees: 12, attendingIds: [uid(0),uid(3),uid(4),uid(6),uid(8),uid(17)], notAttendingIds: [uid(22)] },
    { title: 'Resume Review Workshop', description: 'Get your resume reviewed by seniors and industry professionals', location: 'Career Services Room 101', dateTime: day(3), duration: 120, organizerId: uid(5), organizerName: uname(5), category: 'General', maxAttendees: 20, attendingIds: [uid(1),uid(6),uid(7),uid(13),uid(17),uid(22),uid(23),uid(28)], notAttendingIds: [] },
    { title: 'Photography Walk on Campus', description: 'Capture the beauty of Mason! Bring your camera or phone', location: 'Mason Pond', dateTime: day(4), duration: 90, organizerId: uid(7), organizerName: uname(7), category: 'Social', maxAttendees: 0, attendingIds: [uid(3),uid(13),uid(17),uid(23),uid(25)], notAttendingIds: [] },
    { title: 'Linux Install Fest', description: 'Help setting up Linux dual boot or VM. All distros!', location: 'Innovation Hall 204', dateTime: day(11), duration: 180, organizerId: uid(26), organizerName: uname(26), category: 'Club', maxAttendees: 15, attendingIds: [uid(0),uid(8),uid(10),uid(14),uid(16),uid(20),uid(24)], notAttendingIds: [] },
    
    // Week 2 Events
    { title: 'Tennis at Mason Courts', description: 'Doubles tennis tournament. Rackets available to borrow', location: 'RAC Tennis Courts', dateTime: day(14), duration: 120, organizerId: uid(15), organizerName: uname(15), category: 'Sports', maxAttendees: 8, attendingIds: [uid(1),uid(7),uid(13),uid(19)], notAttendingIds: [] },
    { title: 'Game Dev Unity Workshop', description: 'Build a 2D platformer from scratch', location: 'Nguyen Engineering 2608', dateTime: day(15), duration: 180, organizerId: uid(12), organizerName: uname(12), category: 'Study', maxAttendees: 25, attendingIds: [uid(0),uid(4),uid(8),uid(16),uid(21),uid(24),uid(27)], notAttendingIds: [] },
    { title: 'Trivia Night at Brion\'s', description: 'Test your knowledge! IT and pop culture categories', location: 'Brion\'s Grille', dateTime: day(16), duration: 120, organizerId: uid(25), organizerName: uname(25), category: 'Social', maxAttendees: 30, attendingIds: [uid(3),uid(6),uid(11),uid(17),uid(23),uid(28),uid(4),uid(14)], notAttendingIds: [] },
    { title: 'iOS Development Workshop', description: 'SwiftUI basics and building your first app', location: 'Innovation Hall 134', dateTime: day(17), duration: 150, organizerId: uid(5), organizerName: uname(5), category: 'Study', maxAttendees: 20, attendingIds: [uid(0),uid(2),uid(7),uid(12),uid(18),uid(21)], notAttendingIds: [uid(10)] },
    { title: 'Rock Climbing @ Sport Rock', description: 'Carpool to Alexandria climbing gym. Newbies welcome!', location: 'Sport Rock Alexandria', dateTime: day(17), duration: 180, organizerId: uid(8), organizerName: uname(8), category: 'Sports', maxAttendees: 12, attendingIds: [uid(0),uid(4),uid(14),uid(19),uid(22),uid(26)], notAttendingIds: [] },
    { title: 'Poker Night', description: '$5 buy-in Texas hold\'em tournament', location: 'Student Apartments Lounge', dateTime: day(18), duration: 240, organizerId: uid(20), organizerName: uname(20), category: 'Social', maxAttendees: 10, attendingIds: [uid(1),uid(9),uid(15),uid(24),uid(29)], notAttendingIds: [uid(6)] },
    { title: 'Data Structures Final Review', description: 'Going through past exams and problem sets', location: 'Fenwick Library Study Room B', dateTime: day(19), duration: 180, organizerId: uid(10), organizerName: uname(10), category: 'Study', maxAttendees: 15, attendingIds: [uid(0),uid(2),uid(4),uid(8),uid(12),uid(14),uid(18),uid(22),uid(26)], notAttendingIds: [] },
    { title: 'Karaoke Night', description: 'Sing your heart out! Private room reserved', location: 'Coin Karaoke Fairfax', dateTime: day(20), duration: 150, organizerId: uid(11), organizerName: uname(11), category: 'Social', maxAttendees: 20, attendingIds: [uid(3),uid(6),uid(7),uid(13),uid(17),uid(23),uid(25),uid(28)], notAttendingIds: [] },
    { title: 'Hackathon Kick-off', description: 'MasonHacks 2026 begins! 24 hours of coding', location: 'Johnson Center Atrium', dateTime: day(21), duration: 1440, organizerId: uid(0), organizerName: uname(0), category: 'Club', maxAttendees: 100, attendingIds: [uid(2),uid(3),uid(5),uid(10),uid(12),uid(14),uid(16),uid(18),uid(21),uid(24),uid(27),uid(29),uid(1),uid(7),uid(9),uid(15)], notAttendingIds: [] },
    { title: 'SWE Career Panel', description: 'Software engineers from Amazon, Microsoft, Google', location: 'Mason Hall Auditorium', dateTime: day(22), duration: 120, organizerId: uid(16), organizerName: uname(16), category: 'General', maxAttendees: 150, attendingIds: [uid(0),uid(2),uid(5),uid(10),uid(12),uid(14),uid(18),uid(24),uid(26),uid(29),uid(3),uid(7),uid(11),uid(17)], notAttendingIds: [] },
    
    // Week 3 Events
    { title: 'Swimming Laps at RAC Pool', description: 'Morning swim session for fitness', location: 'RAC Swimming Pool', dateTime: day(28), duration: 60, organizerId: uid(19), organizerName: uname(19), category: 'Sports', maxAttendees: 10, attendingIds: [uid(0),uid(8),uid(14),uid(22)], notAttendingIds: [] },
    { title: 'Python for Data Science', description: 'Learn pandas, numpy, matplotlib basics', location: 'Research Hall 163', dateTime: day(29), duration: 120, organizerId: uid(27), organizerName: uname(27), category: 'Study', maxAttendees: 25, attendingIds: [uid(2),uid(5),uid(13),uid(19),uid(21),uid(29),uid(6),uid(10)], notAttendingIds: [] },
    { title: 'Sushi Making Night', description: 'Learn to make sushi rolls! All ingredients provided', location: 'Potomac Heights Kitchen', dateTime: day(29), duration: 120, organizerId: uid(13), organizerName: uname(13), category: 'Social', maxAttendees: 12, attendingIds: [uid(3),uid(7),uid(11), uid(17),uid(23),uid(25)], notAttendingIds: [uid(1)] },
    { title: 'GraphQL Workshop', description: 'Building modern APIs with GraphQL and Apollo', location: 'Innovation Hall 105', dateTime: day(30), duration: 150, organizerId: uid(2), organizerName: uname(2), category: 'Study', maxAttendees: 20, attendingIds: [uid(0),uid(5),uid(10),uid(16),uid(18),uid(24)], notAttendingIds: [] },
    { title: 'Badminton Tournament', description: 'Single elimination bracket. Prizes for top 3!', location: 'RAC Gym 2', dateTime: day(31), duration: 180, organizerId: uid(22), organizerName: uname(22), category: 'Sports', maxAttendees: 16, attendingIds: [uid(0),uid(4),uid(6),uid(8),uid(14),uid(17),uid(19),uid(26)], notAttendingIds: [] },
    { title: 'Jazz Night @ Harris Theatre', description: 'Student jazz band performance. Free admission!', location: 'Harris Theatre', dateTime: day(32), duration: 90, organizerId: uid(23), organizerName: uname(23), category: 'Social', maxAttendees: 100, attendingIds: [uid(3),uid(7),uid(11),uid(13),uid(17),uid(23),uid(25),uid(28)], notAttendingIds: [] },
    { title: 'OS Study Group', description: 'Reviewing process synchronization and deadlock', location: 'Nguyen Engineering 1st Floor Lounge', dateTime: day(33), duration: 150, organizerId: uid(14), organizerName: uname(14), category: 'Study', maxAttendees: 12, attendingIds: [uid(0),uid(4),uid(8),uid(10),uid(12),uid(18)], notAttendingIds: [uid(22)] },
    { title: 'D&D Campaign Session 5', description: 'Continuing our adventure! Level 7 characters', location: 'Southside Private Room', dateTime: day(34), duration: 300, organizerId: uid(9), organizerName: uname(9), category: 'Social', maxAttendees: 6, attendingIds: [uid(1),uid(15),uid(20),uid(24),uid(29)], notAttendingIds: [] },
    { title: 'Kubernetes Basics Workshop', description: 'Container orchestration 101 with hands-on labs', location: 'Innovation Hall 208', dateTime: day(35), duration: 180, organizerId: uid(24), organizerName: uname(24), category: 'Study', maxAttendees: 20, attendingIds: [uid(0),uid(2),uid(10),uid(16),uid(18),uid(26)], notAttendingIds: [] },
    { title: 'Yoga on the Quad', description: 'Outdoor yoga session. Bring your mat!', location: 'Wilkins Plaza', dateTime: day(36), duration: 60, organizerId: uid(25), organizerName: uname(25), category: 'Sports', maxAttendees: 0, attendingIds: [uid(3),uid(7),uid(11),uid(13),uid(17),uid(23)], notAttendingIds: [] },
    
    // Week 4 Events
    { title: 'Git & GitHub Workshop', description: 'Version control for beginners. Bring laptop!', location: 'Fenwick Library Training Room', dateTime: day(42), duration: 120, organizerId: uid(18), organizerName: uname(18), category: 'Study', maxAttendees: 30, attendingIds: [uid(1),uid(6),uid(7),uid(13),uid(17),uid(22),uid(23),uid(28),uid(4)], notAttendingIds: [] },
    { title: 'Laser Tag Battle', description: 'Team competition! Transportation provided', location: 'Crossfire Laser Tag Fairfax', dateTime: day(43), duration: 120, organizerId: uid(4), organizerName: uname(4), category: 'Social', maxAttendees: 20, attendingIds: [uid(0),uid(6),uid(8),uid(14),uid(22),uid(26),uid(17),uid(19)], notAttendingIds: [] },
    { title: 'Web Security CTF', description: 'Practice XSS, CSRF, SQL injection challenges', location: 'Nguyen Engineering 1103', dateTime: day(44), duration: 240, organizerId: uid(9), organizerName: uname(9), category: 'Study', maxAttendees: 25, attendingIds: [uid(0),uid(1),uid(15),uid(20),uid(24),uid(26),uid(29),uid(2)], notAttendingIds: [] },
    { title: 'Ping Pong Tournament', description: 'Single and doubles brackets. All skill levels', location: 'Johnson Center Game Room', dateTime: day(45), duration: 180, organizerId: uid(6), organizerName: uname(6), category: 'Sports', maxAttendees: 24, attendingIds: [uid(0),uid(4),uid(8),uid(14),uid(17),uid(22),uid(28),uid(3)], notAttendingIds: [] },
    { title: 'Startup Pitch Night', description: 'Student founders pitch their startups. Q&A after!', location: 'Mason Innovation Exchange', dateTime: day(46), duration: 120, organizerId: uid(16), organizerName: uname(16), category: 'General', maxAttendees: 60, attendingIds: [uid(0),uid(2),uid(5),uid(10),uid(12),uid(18),uid(24),uid(27)], notAttendingIds: [] },
    { title: 'Hiking @ Great Falls', description: 'Sunday morning hike. Carpool from campus 8am', location: 'Great Falls Park', dateTime: day(47), duration: 240, organizerId: uid(8), organizerName: uname(8), category: 'Sports', maxAttendees: 15, attendingIds: [uid(0),uid(4),uid(14), uid(19),uid(22),uid(26),uid(11)], notAttendingIds: [] },
    { title: 'React Native Workshop', description: 'Build cross-platform mobile apps', location: 'Innovation Hall 134', dateTime: day(48), duration: 180, organizerId: uid(5), organizerName: uname(5), category: 'Study', maxAttendees: 20, attendingIds: [uid(0),uid(2),uid(12),uid(18),uid(21),uid(24)], notAttendingIds: [] },
    { title: 'Boba & Chill', description: 'Trying different boba flavors at Kung Fu Tea', location: 'Kung Fu Tea Fairfax', dateTime: day(49), duration: 90, organizerId: uid(11), organizerName: uname(11), category: 'Social', maxAttendees: 0, attendingIds: [uid(3),uid(7),uid(13),uid(17),uid(23),uid(25),uid(28)], notAttendingIds: [] },
    { title: 'Database Design Workshop', description: 'ER diagrams, normalization, and SQL best practices', location: 'Research Hall 163', dateTime: day(50), duration: 150, organizerId: uid(10), organizerName: uname(10), category: 'Study', maxAttendees: 20, attendingIds: [uid(0),uid(2),uid(5),uid(12),uid(14),uid(18),uid(24)], notAttendingIds: [] },
    { title: 'Spikeball on the Quad', description: 'Learn and play spikeball. Equipment provided!', location: 'Rappahannock River', dateTime: day(50), duration: 90, organizerId: uid(22), organizerName: uname(22), category: 'Sports', maxAttendees: 12, attendingIds: [uid(0),uid(4),uid(6),uid(8),uid(14),uid(17)], notAttendingIds: [] },
    
    // Week 5 Events
    { title: 'AI Ethics Panel Discussion', description: 'Discussing bias, privacy, and AI safety', location: 'Mason Hall Room 1100', dateTime: day(56), duration: 120, organizerId: uid(21), organizerName: uname(21), category: 'General', maxAttendees: 80, attendingIds: [uid(0),uid(2),uid(5),uid(13),uid(19),uid(21),uid(27),uid(29)], notAttendingIds: [] },
    { title: 'Cooking Competition', description: 'Iron Chef style! Mystery ingredients revealed at start', location: 'Student Apartments Kitchen', dateTime: day(57), duration: 180, organizerId: uid(13), organizerName: uname(13), category: 'Social', maxAttendees: 16, attendingIds: [uid(3),uid(7),uid(11),uid(17),uid(23),uid(25),uid(28)], notAttendingIds: [] },
    { title: 'Rust Programming Workshop', description: 'Systems programming with Rust. Memory safety!', location: 'Nguyen Engineering 2608', dateTime: day(58), duration: 180, organizerId: uid(26), organizerName: uname(26), category: 'Study', maxAttendees: 20, attendingIds: [uid(0),uid(8),uid(10),uid(14),uid(16),uid(20),uid(24)], notAttendingIds: [] },
    { title: 'Indoor Soccer League Game 1', description: 'CS Department vs SWE Department. Rivalries begin!', location: 'RAC Indoor Courts', dateTime: day(59), duration: 60, organizerId: uid(4), organizerName: uname(4), category: 'Sports', maxAttendees: 20, attendingIds: [uid(0),uid(6),uid(8),uid(14),uid(22),uid(17),uid(19),uid(26)], notAttendingIds: [] },
    { title: 'Tech Interview Bootcamp', description: '3-hour intensive: arrays, trees, DP, system design', location: 'Fenwick Library Presentation Room', dateTime: day(60), duration: 180, organizerId: uid(14), organizerName: uname(14), category: 'Study', maxAttendees: 25, attendingIds: [uid(0),uid(2),uid(4),uid(8),uid(10),uid(12),uid(18),uid(22),uid(24),uid(26)], notAttendingIds: [] },
    { title: 'Escape Room Challenge', description: 'CS team building! Can we escape in 60 min?', location: 'Escape Room Fairfax', dateTime: day(61), duration: 90, organizerId: uid(18), organizerName: uname(18), category: 'Social', maxAttendees: 10, attendingIds: [uid(0),uid(3),uid(7),uid(11),uid(23),uid(25)], notAttendingIds: [uid(15)] },
    { title: 'Robotics Club Demo Day', description: 'See student-built robots in action!', location: 'Nguyen Engineering Atrium', dateTime: day(62), duration: 120, organizerId: uid(12), organizerName: uname(12), category: 'Club', maxAttendees: 50, attendingIds: [uid(0),uid(4),uid(8),uid(16),uid(21),uid(24),uid(27),uid(1),uid(9)], notAttendingIds: [] },
    { title: 'Chess Tournament', description: 'Blitz format. 5-minute games', location: 'Johnson Center Atrium', dateTime: day(63), duration: 150, organizerId: uid(20), organizerName: uname(20), category: 'Social', maxAttendees: 32, attendingIds: [uid(1),uid(9),uid(15),uid(24),uid(29),uid(5),uid(10)], notAttendingIds: [] },
    { title: 'Flutter Mobile Dev Workshop', description: 'Build beautiful cross-platform apps with Dart', location: 'Innovation Hall 105', dateTime: day(64), duration: 180, organizerId: uid(5), organizerName: uname(5), category: 'Study', maxAttendees: 20, attendingIds: [uid(0),uid(2),uid(7),uid(12),uid(18),uid(21)], notAttendingIds: [] },
    { title: 'Bike Ride to DC', description: 'Saturday bike trip to National Mall. 30 miles round trip', location: 'Campus Center Bike Rack Start', dateTime: day(64), duration: 360, organizerId: uid(19), organizerName: uname(19), category: 'Sports', maxAttendees: 12, attendingIds: [uid(0),uid(4),uid(8),uid(14),uid(22),uid(26)], notAttendingIds: [] },
  ];

  await MasonMeet.insertMany(meetsData);
  console.log(`Created ${meetsData.length} MasonMeets`);

  // ═══════════════════════════════════════════
  // Done!
  // ═══════════════════════════════════════════
  console.log('\n✅ Seed complete!');
  console.log(`   ${users.length} users`);
  console.log(`   ${courses.length} courses`);
  console.log(`   ${eventsData.length} calendar events`);
  console.log(`   ${channelMsgs.length} channel messages`);
  console.log(`   ${dmMsgs.length} DM messages`);
  console.log(`   ${postsData.length} feed posts`);
  console.log(`   ${studySessionsData.length} study sessions`);
  console.log(`   ${docsData.length} documents`);
  console.log(`   ${meetsData.length} MasonMeets`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
