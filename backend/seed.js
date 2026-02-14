// Comprehensive database seeding script
// Drops all collections and creates realistic sample data
// Run with: node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const Message = require('./models/Message');
const Post = require('./models/Post');
const CalendarEvent = require('./models/CalendarEvent');
const StudySession = require('./models/StudySession');
const Document = require('./models/Document');

// Helper to create dates relative to now
const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);
const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000);

const majors = ['Computer Science', 'Software Engineering', 'Information Technology', 'Cybersecurity', 'Data Science', 'Applied Mathematics'];

const users = [
  { name: 'Alex Chen', email: 'achen42@gmu.edu', password: 'password123', major: 'Computer Science', year: 3, bio: 'CS junior | Into ML and web dev | Always down to study' },
  { name: 'Sarah Martinez', email: 'smartinez@gmu.edu', password: 'password123', major: 'Software Engineering', year: 2, bio: 'SWE sophomore | Coffee addict ☕ | React enthusiast' },
  { name: 'Jordan Kim', email: 'jkim99@gmu.edu', password: 'password123', major: 'Computer Science', year: 4, bio: 'Senior | Interning at Amazon this summer | Ask me anything!' },
  { name: 'Emily Thompson', email: 'ethompson@gmu.edu', password: 'password123', major: 'Cybersecurity', year: 3, bio: 'CTF competitor | Mason CISSP club VP' },
  { name: 'Marcus Johnson', email: 'mjohnson@gmu.edu', password: 'password123', major: 'Computer Science', year: 2, bio: 'Sophomore | TA for CS 112 | Game dev hobbyist' },
  { name: 'Priya Patel', email: 'ppatel8@gmu.edu', password: 'password123', major: 'Data Science', year: 3, bio: 'Data science junior | Python & R | Looking for research opportunities' },
  { name: 'David Lee', email: 'dlee77@gmu.edu', password: 'password123', major: 'Information Technology', year: 2, bio: 'IT major | Building a homelab | Linux nerd 🐧' },
  { name: 'Olivia Brown', email: 'obrown@gmu.edu', password: 'password123', major: 'Software Engineering', year: 4, bio: 'SWE senior | Full-stack dev | Graduating in May!' },
  { name: 'Ryan Garcia', email: 'rgarcia@gmu.edu', password: 'password123', major: 'Computer Science', year: 1, bio: 'Freshman CS major | Still figuring things out' },
  { name: 'Sophia Wilson', email: 'swilson@gmu.edu', password: 'password123', major: 'Applied Mathematics', year: 3, bio: 'Math + CS double major | Proofs are fun, fight me' },
  { name: 'Chris Anderson', email: 'canderson@gmu.edu', password: 'password123', major: 'Computer Science', year: 3, bio: 'Junior | Algorithms nerd | LeetCode grinder' },
  { name: 'Mia Rodriguez', email: 'mrodriguez@gmu.edu', password: 'password123', major: 'Cybersecurity', year: 2, bio: 'Sophomore | Ethical hacking enthusiast' },
  { name: 'Ethan Davis', email: 'edavis@gmu.edu', password: 'password123', major: 'Software Engineering', year: 3, bio: 'SWE junior | Open source contributor | Vim > Emacs' },
  { name: 'Ava Taylor', email: 'ataylor@gmu.edu', password: 'password123', major: 'Data Science', year: 2, bio: 'Data viz enthusiast | Tableau certified' },
  { name: 'Noah White', email: 'nwhite@gmu.edu', password: 'password123', major: 'Computer Science', year: 4, bio: 'Senior | Grad school bound | Research in distributed systems' },
];

const courses = [
  {
    code: 'CS 310', name: 'Data Structures', instructor: 'Dr. Katherine Raven',
    schedule: 'MWF 10:30 AM - 11:20 AM', location: 'Innovation Hall 136', credits: 3,
    description: 'Study of fundamental data structures including lists, stacks, queues, trees, graphs, and hash tables.',
    channels: [
      { name: 'General', icon: '💬' }, { name: 'Homework', icon: '📝' },
      { name: 'Projects', icon: '🛠️' }, { name: 'Exam Prep', icon: '📚' },
    ],
  },
  {
    code: 'CS 330', name: 'Formal Methods & Models', instructor: 'Dr. James Mitchell',
    schedule: 'TR 1:30 PM - 2:45 PM', location: 'Engineering Building 1101', credits: 3,
    description: 'Introduction to formal methods including logic, automata theory, and formal languages.',
    channels: [
      { name: 'General', icon: '💬' }, { name: 'Homework', icon: '📝' }, { name: 'Study Group', icon: '🤓' },
    ],
  },
  {
    code: 'CS 367', name: 'Computer Systems & Programming', instructor: 'Dr. Michael Torres',
    schedule: 'MWF 1:30 PM - 2:20 PM', location: 'Nguyen Engineering 1103', credits: 3,
    description: 'Introduction to low-level programming in C, memory management, and systems programming.',
    channels: [
      { name: 'General', icon: '💬' }, { name: 'Homework', icon: '📝' },
      { name: 'Labs', icon: '🔬' }, { name: 'C Memes', icon: '😂' },
    ],
  },
  {
    code: 'MATH 214', name: 'Linear Algebra', instructor: 'Dr. Anne Fischer',
    schedule: 'TR 10:30 AM - 11:45 AM', location: 'Exploratory Hall 4106', credits: 3,
    description: 'Systems of linear equations, matrices, vector spaces, linear transformations, eigenvalues.',
    channels: [
      { name: 'General', icon: '💬' }, { name: 'Homework', icon: '📝' }, { name: 'Help Desk', icon: '🆘' },
    ],
  },
  {
    code: 'CS 262', name: 'Intro to Low-Level Programming', instructor: 'Dr. Paul Henderson',
    schedule: 'MWF 9:00 AM - 9:50 AM', location: 'Innovation Hall 204', credits: 3,
    description: 'Introduction to C programming and Unix/Linux environment.',
    channels: [ { name: 'General', icon: '💬' }, { name: 'Homework', icon: '📝' } ],
  },
  {
    code: 'CS 471', name: 'Operating Systems', instructor: 'Dr. Sandra Lee',
    schedule: 'TR 3:00 PM - 4:15 PM', location: 'Engineering Building 4457', credits: 3,
    description: 'Process management, memory management, file systems, and I/O systems.',
    channels: [ { name: 'General', icon: '💬' }, { name: 'Homework', icon: '📝' }, { name: 'Off-Topic', icon: '🎮' } ],
  },
  {
    code: 'CS 483', name: 'Analysis of Algorithms', instructor: 'Dr. Robert Chang',
    schedule: 'MWF 11:30 AM - 12:20 PM', location: 'Nguyen Engineering 1110', credits: 3,
    description: 'Techniques for design and analysis of algorithms: sorting, searching, graph algorithms.',
    channels: [ { name: 'General', icon: '💬' }, { name: 'Homework', icon: '📝' } ],
  },
  {
    code: 'SWE 432', name: 'Design of Software Systems', instructor: 'Dr. Linda Park',
    schedule: 'TR 12:00 PM - 1:15 PM', location: 'Innovation Hall 325', credits: 3,
    description: 'Design principles for web-based software including REST, MVC, and modern frameworks.',
    channels: [ { name: 'General', icon: '💬' }, { name: 'Homework', icon: '📝' }, { name: 'Project Help', icon: '🚀' } ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // DROP ALL COLLECTIONS
    console.log('\n🗑️  Dropping all collections...');
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
      console.log(`  Dropped: ${collection.collectionName}`);
    }

    // CREATE USERS
    console.log('\n👥 Creating users...');
    const createdUsers = await User.insertMany(users);
    console.log(`  Created ${createdUsers.length} users`);
    
    const userMap = {};
    createdUsers.forEach(u => { userMap[u.email] = u; });

    // CREATE COURSES
    console.log('\n📚 Creating courses...');
    const createdCourses = await Course.insertMany(courses);
    console.log(`  Created ${createdCourses.length} courses`);
    
    const courseMap = {};
    createdCourses.forEach(c => { courseMap[c.code] = c; });

    // ENROLL USERS IN COURSES (realistic patterns)
    console.log('\n🎓 Enrolling users in courses...');
    const enrollments = [
      { email: 'achen42@gmu.edu', courses: ['CS 310', 'CS 330', 'CS 367', 'MATH 214'] },
      { email: 'smartinez@gmu.edu', courses: ['CS 310', 'CS 262', 'SWE 432'] },
      { email: 'jkim99@gmu.edu', courses: ['CS 471', 'CS 483', 'SWE 432'] },
      { email: 'ethompson@gmu.edu', courses: ['CS 310', 'CS 471', 'CS 330'] },
      { email: 'mjohnson@gmu.edu', courses: ['CS 310', 'CS 262', 'MATH 214'] },
      { email: 'ppatel8@gmu.edu', courses: ['CS 310', 'MATH 214', 'CS 483'] },
      { email: 'dlee77@gmu.edu', courses: ['CS 262', 'CS 367', 'CS 471'] },
      { email: 'obrown@gmu.edu', courses: ['SWE 432', 'CS 483', 'CS 471'] },
      { email: 'rgarcia@gmu.edu', courses: ['CS 262', 'MATH 214'] },
      { email: 'swilson@gmu.edu', courses: ['MATH 214', 'CS 330', 'CS 483'] },
      { email: 'canderson@gmu.edu', courses: ['CS 310', 'CS 330', 'CS 483'] },
      { email: 'mrodriguez@gmu.edu', courses: ['CS 262', 'CS 310', 'CS 471'] },
      { email: 'edavis@gmu.edu', courses: ['CS 367', 'SWE 432', 'CS 310'] },
      { email: 'ataylor@gmu.edu', courses: ['MATH 214', 'CS 310'] },
      { email: 'nwhite@gmu.edu', courses: ['CS 471', 'CS 483'] },
    ];

    for (const enroll of enrollments) {
      const user = userMap[enroll.email];
      const courseIds = enroll.courses.map(code => courseMap[code]._id.toString());
      await User.findByIdAndUpdate(user._id, { enrolledCourseIds: courseIds });
    }
    console.log(`  Enrolled users in courses`);

    // CREATE CALENDAR EVENTS
    console.log('\n📅 Creating calendar events...');
    const events = [
      // CS 310
      { courseId: courseMap['CS 310']._id, title: 'PA3: BST Implementation', description: 'Programming Assignment 3', date: daysFromNow(5), type: 'homework' },
      { courseId: courseMap['CS 310']._id, title: 'Quiz 4: Trees', description: 'Quiz covering binary trees, BST, and AVL trees', date: daysFromNow(10), type: 'quiz' },
      { courseId: courseMap['CS 310']._id, title: 'Midterm Exam', description: 'Covers chapters 1-8', date: daysFromNow(19), type: 'exam' },
      { courseId: courseMap['CS 310']._id, title: 'PA4: Graph Algorithms', description: 'Implement BFS, DFS, and Dijkstra\'s', date: daysFromNow(34), type: 'homework' },
      // CS 330
      { courseId: courseMap['CS 330']._id, title: 'HW5: Pumping Lemma', description: 'Regular languages and pumping lemma proofs', date: daysFromNow(1), type: 'homework' },
      { courseId: courseMap['CS 330']._id, title: 'HW6: Context-Free Grammars', description: 'CFG design and derivation trees', date: daysFromNow(11), type: 'homework' },
      { courseId: courseMap['CS 330']._id, title: 'Midterm Exam', description: 'Logic, regular languages, DFA/NFA, pumping lemma', date: daysFromNow(17), type: 'exam' },
      // CS 367
      { courseId: courseMap['CS 367']._id, title: 'Lab 4: Linked Lists in C', description: 'Implement singly and doubly linked lists', date: daysFromNow(3), type: 'homework' },
      { courseId: courseMap['CS 367']._id, title: 'Project 1: Shell', description: 'Build a simple Unix shell in C', date: daysFromNow(14), type: 'project' },
      { courseId: courseMap['CS 367']._id, title: 'Midterm Exam', description: 'C programming, memory management, pointers', date: daysFromNow(24), type: 'exam' },
      // MATH 214
      { courseId: courseMap['MATH 214']._id, title: 'WebAssign HW6', description: 'Vector spaces and subspaces problems', date: daysFromNow(2), type: 'homework' },
      { courseId: courseMap['MATH 214']._id, title: 'Quiz 3: Determinants', description: 'Determinant computation and properties', date: daysFromNow(8), type: 'quiz' },
      { courseId: courseMap['MATH 214']._id, title: 'Midterm Exam', description: 'Systems of equations, matrices, vector spaces', date: daysFromNow(18), type: 'exam' },
      // CS 471
      { courseId: courseMap['CS 471']._id, title: 'Lab 3: Process Scheduling', description: 'Implement scheduling algorithms', date: daysFromNow(4), type: 'homework' },
      { courseId: courseMap['CS 471']._id, title: 'Project: Custom Shell', description: 'Build a Unix shell with pipes and redirection', date: daysFromNow(21), type: 'project' },
      // CS 483
      { courseId: courseMap['CS 483']._id, title: 'HW4: Dynamic Programming', description: 'DP problems including knapsack and LCS', date: daysFromNow(6), type: 'homework' },
      { courseId: courseMap['CS 483']._id, title: 'Midterm Exam', description: 'Sorting, searching, divide and conquer, DP', date: daysFromNow(20), type: 'exam' },
      // SWE 432
      { courseId: courseMap['SWE 432']._id, title: 'Project Milestone 2', description: 'Backend REST API implementation', date: daysFromNow(7), type: 'project' },
      { courseId: courseMap['SWE 432']._id, title: 'Quiz: REST & HTTP', description: 'RESTful design principles quiz', date: daysFromNow(12), type: 'quiz' },
    ];
    await CalendarEvent.insertMany(events);
    console.log(`  Created ${events.length} calendar events`);

    // CREATE CHANNEL MESSAGES
    console.log('\n💬 Creating channel messages...');
    const channelMessages = [];
    
    // CS 310 General channel
    const cs310General = courseMap['CS 310'].channels[0]._id.toString();
    channelMessages.push(
      { channelId: cs310General, senderId: userMap['achen42@gmu.edu']._id.toString(), senderName: 'Alex Chen', content: 'Hey everyone! Anyone else stuck on PA3 question 2?', timestamp: hoursAgo(5) },
      { channelId: cs310General, senderId: userMap['mjohnson@gmu.edu']._id.toString(), senderName: 'Marcus Johnson', content: 'Yeah that one is tricky. Are you talking about the balancing part?', timestamp: hoursAgo(4.8) },
      { channelId: cs310General, senderId: userMap['achen42@gmu.edu']._id.toString(), senderName: 'Alex Chen', content: 'Exactly! I can\'t figure out the rotation logic', timestamp: hoursAgo(4.5) },
      { channelId: cs310General, senderId: userMap['ethompson@gmu.edu']._id.toString(), senderName: 'Emily Thompson', content: 'Check out the slides from lecture 12, there\'s a good example there', timestamp: hoursAgo(4.2) },
      { channelId: cs310General, senderId: userMap['ppatel8@gmu.edu']._id.toString(), senderName: 'Priya Patel', content: 'Also geeksforgeeks has a really clear explanation of AVL rotations', timestamp: hoursAgo(3.5) },
      { channelId: cs310General, senderId: userMap['achen42@gmu.edu']._id.toString(), senderName: 'Alex Chen', content: 'Thanks! That helped a lot', timestamp: hoursAgo(2) },
      { channelId: cs310General, senderId: userMap['canderson@gmu.edu']._id.toString(), senderName: 'Chris Anderson', content: 'Does anyone know if the quiz on Friday is open note?', timestamp: hoursAgo(1) },
      { channelId: cs310General, senderId: userMap['ethompson@gmu.edu']._id.toString(), senderName: 'Emily Thompson', content: 'No, Dr. Raven said closed note but we can have one page of handwritten notes', timestamp: hoursAgo(0.5) },
    );

    // CS 310 Homework channel
    const cs310Homework = courseMap['CS 310'].channels[1]._id.toString();
    channelMessages.push(
      { channelId: cs310Homework, senderId: userMap['smartinez@gmu.edu']._id.toString(), senderName: 'Sarah Martinez', content: 'Reminder: PA3 is due Monday at 11:59 PM!', timestamp: daysAgo(1) },
      { channelId: cs310Homework, senderId: userMap['mjohnson@gmu.edu']._id.toString(), senderName: 'Marcus Johnson', content: 'Is anyone else getting a seg fault on test case 5?', timestamp: hoursAgo(8) },
      { channelId: cs310Homework, senderId: userMap['ppatel8@gmu.edu']._id.toString(), senderName: 'Priya Patel', content: 'I had that! Check your delete function, you might be freeing memory twice', timestamp: hoursAgo(7.5) },
      { channelId: cs310Homework, senderId: userMap['mjohnson@gmu.edu']._id.toString(), senderName: 'Marcus Johnson', content: 'OMG that was it! Thank you so much 🙏', timestamp: hoursAgo(7) },
    );

    // CS 367 C Memes channel
    const cs367Memes = courseMap['CS 367'].channels[3]._id.toString();
    channelMessages.push(
      { channelId: cs367Memes, senderId: userMap['edavis@gmu.edu']._id.toString(), senderName: 'Ethan Davis', content: 'Pointers be like: I know a guy who knows a guy who knows the value', timestamp: daysAgo(2) },
      { channelId: cs367Memes, senderId: userMap['dlee77@gmu.edu']._id.toString(), senderName: 'David Lee', content: '😂😂😂', timestamp: daysAgo(1.9) },
      { channelId: cs367Memes, senderId: userMap['achen42@gmu.edu']._id.toString(), senderName: 'Alex Chen', content: 'Segmentation fault (core dumped)', timestamp: daysAgo(1.5) },
      { channelId: cs367Memes, senderId: userMap['edavis@gmu.edu']._id.toString(), senderName: 'Ethan Davis', content: '*chef\'s kiss* classic', timestamp: daysAgo(1.3) },
    );

    // SWE 432 General
    const swe432General = courseMap['SWE 432'].channels[0]._id.toString();
    channelMessages.push(
      { channelId: swe432General, senderId: userMap['obrown@gmu.edu']._id.toString(), senderName: 'Olivia Brown', content: 'The project milestone is due next week! Make sure your API endpoints are working', timestamp: daysAgo(1) },
      { channelId: swe432General, senderId: userMap['jkim99@gmu.edu']._id.toString(), senderName: 'Jordan Kim', content: 'Is anyone using MongoDB or are most people using PostgreSQL?', timestamp: hoursAgo(6) },
      { channelId: swe432General, senderId: userMap['smartinez@gmu.edu']._id.toString(), senderName: 'Sarah Martinez', content: 'My group is using MongoDB with Express. It\'s pretty straightforward', timestamp: hoursAgo(5.5) },
      { channelId: swe432General, senderId: userMap['edavis@gmu.edu']._id.toString(), senderName: 'Ethan Davis', content: 'We\'re doing PostgreSQL + Sequelize ORM. Definitely more setup but type safety is nice', timestamp: hoursAgo(5) },
    );

    // MATH 214 Help Desk
    const math214Help = courseMap['MATH 214'].channels[2]._id.toString();
    channelMessages.push(
      { channelId: math214Help, senderId: userMap['rgarcia@gmu.edu']._id.toString(), senderName: 'Ryan Garcia', content: 'Can someone explain how to find the basis for a vector space?', timestamp: hoursAgo(3) },
      { channelId: math214Help, senderId: userMap['swilson@gmu.edu']._id.toString(), senderName: 'Sophia Wilson', content: 'Sure! You need to find the set of linearly independent vectors that span the space. Are you working on a specific problem?', timestamp: hoursAgo(2.8) },
      { channelId: math214Help, senderId: userMap['rgarcia@gmu.edu']._id.toString(), senderName: 'Ryan Garcia', content: 'Yeah, problem 3.2 number 14 from the textbook', timestamp: hoursAgo(2.5) },
      { channelId: math214Help, senderId: userMap['swilson@gmu.edu']._id.toString(), senderName: 'Sophia Wilson', content: 'Oh that one! First you need to put the vectors into a matrix and row reduce. The pivot columns give you your basis', timestamp: hoursAgo(2.3) },
      { channelId: math214Help, senderId: userMap['ataylor@gmu.edu']._id.toString(), senderName: 'Ava Taylor', content: 'I can meet at the library in 30 min if you want to go through it together?', timestamp: hoursAgo(2) },
      { channelId: math214Help, senderId: userMap['rgarcia@gmu.edu']._id.toString(), senderName: 'Ryan Garcia', content: 'That would be amazing! See you there', timestamp: hoursAgo(1.9) },
    );

    await Message.insertMany(channelMessages);
    console.log(`  Created ${channelMessages.length} channel messages`);

    // CREATE DM CONVERSATIONS
    console.log('\n✉️  Creating DM conversations...');
    const dmMessages = [];

    // Alex and Sarah
    const alexId = userMap['achen42@gmu.edu']._id.toString();
    const sarahId = userMap['smartinez@gmu.edu']._id.toString();
    dmMessages.push(
      { senderId: alexId, senderName: 'Alex Chen', content: 'Hey! Do you want to work on the CS 310 project together?', timestamp: daysAgo(2), dmPartnerId: sarahId, dmParticipants: [alexId, sarahId].sort() },
      { senderId: sarahId, senderName: 'Sarah Martinez', content: 'Yeah that sounds great! When are you free?', timestamp: daysAgo(2, -0.5), dmPartnerId: alexId, dmParticipants: [alexId, sarahId].sort() },
      { senderId: alexId, senderName: 'Alex Chen', content: 'How about tomorrow at 3pm in Fenwick library?', timestamp: daysAgo(1.9), dmPartnerId: sarahId, dmParticipants: [alexId, sarahId].sort() },
      { senderId: sarahId, senderName: 'Sarah Martinez', content: 'Perfect! See you then 👍', timestamp: daysAgo(1.8), dmPartnerId: alexId, dmParticipants: [alexId, sarahId].sort() },
      { senderId: alexId, senderName: 'Alex Chen', content: 'Just got here, I\'m on the 2nd floor near the windows', timestamp: hoursAgo(25), dmPartnerId: sarahId, dmParticipants: [alexId, sarahId].sort() },
    );

    // Jordan and Olivia
    const jordanId = userMap['jkim99@gmu.edu']._id.toString();
    const oliviaId = userMap['obrown@gmu.edu']._id.toString();
    dmMessages.push(
      { senderId: jordanId, senderName: 'Jordan Kim', content: 'Hey Olivia! I saw you\'re graduating in May - congrats! Any job search tips?', timestamp: daysAgo(3), dmPartnerId: oliviaId, dmParticipants: [jordanId, oliviaId].sort() },
      { senderId: oliviaId, senderName: 'Olivia Brown', content: 'Thanks! Start applying early and do lots of leetcode. Also go to career fairs', timestamp: daysAgo(2.9), dmPartnerId: jordanId, dmParticipants: [jordanId, oliviaId].sort() },
      { senderId: jordanId, senderName: 'Jordan Kim', content: 'Good to know. How many applications did you send out?', timestamp: daysAgo(2.8), dmPartnerId: oliviaId, dmParticipants: [jordanId, oliviaId].sort() },
      { senderId: oliviaId, senderName: 'Olivia Brown', content: 'Probably around 150 lol. Got like 10 interviews and 2 offers', timestamp: daysAgo(2.7), dmPartnerId: jordanId, dmParticipants: [jordanId, oliviaId].sort() },
      { senderId: jordanId, senderName: 'Jordan Kim', content: 'Wow that\'s intense but good to know the numbers. Thanks!', timestamp: daysAgo(2.6), dmPartnerId: oliviaId, dmParticipants: [jordanId, oliviaId].sort() },
    );

    // Emily and Marcus
    const emilyId = userMap['ethompson@gmu.edu']._id.toString();
    const marcusId = userMap['mjohnson@gmu.edu']._id.toString();
    dmMessages.push(
      { senderId: emilyId, senderName: 'Emily Thompson', content: 'Are you going to the CISSP club meeting tomorrow?', timestamp: hoursAgo(20), dmPartnerId: marcusId, dmParticipants: [emilyId, marcusId].sort() },
      { senderId: marcusId, senderName: 'Marcus Johnson', content: 'Planning to! What time does it start?', timestamp: hoursAgo(19.5), dmPartnerId: emilyId, dmParticipants: [emilyId, marcusId].sort() },
      { senderId: emilyId, senderName: 'Emily Thompson', content: '6pm in Engineering 2901. They\'re doing a CTF workshop', timestamp: hoursAgo(19), dmPartnerId: marcusId, dmParticipants: [emilyId, marcusId].sort() },
      { senderId: marcusId, senderName: 'Marcus Johnson', content: 'Sweet I\'ll be there!', timestamp: hoursAgo(18.5), dmPartnerId: emilyId, dmParticipants: [emilyId, marcusId].sort() },
    );

    // Priya and Sophia (study buddies)
    const priyaId = userMap['ppatel8@gmu.edu']._id.toString();
    const sophiaId = userMap['swilson@gmu.edu']._id.toString();
    dmMessages.push(
      { senderId: priyaId, senderName: 'Priya Patel', content: 'Want to study for the math exam together?', timestamp: daysAgo(1), dmPartnerId: sophiaId, dmParticipants: [priyaId, sophiaId].sort() },
      { senderId: sophiaId, senderName: 'Sophia Wilson', content: 'Yes! I\'m so stressed about eigenvalues', timestamp: daysAgo(0.9), dmPartnerId: priyaId, dmParticipants: [priyaId, sophiaId].sort() },
      { senderId: priyaId, senderName: 'Priya Patel', content: 'Same lol. How about Saturday morning?', timestamp: daysAgo(0.8), dmPartnerId: sophiaId, dmParticipants: [priyaId, sophiaId].sort() },
      { senderId: sophiaId, senderName: 'Sophia Wilson', content: 'Works for me! Starbucks at 10am?', timestamp: daysAgo(0.7), dmPartnerId: priyaId, dmParticipants: [priyaId, sophiaId].sort() },
      { senderId: priyaId, senderName: 'Priya Patel', content: 'Perfect see you then!', timestamp: daysAgo(0.6), dmPartnerId: sophiaId, dmParticipants: [priyaId, sophiaId].sort() },
    );

    // David and Ethan (Linux nerds)
    const davidId = userMap['dlee77@gmu.edu']._id.toString();
    const ethanId = userMap['edavis@gmu.edu']._id.toString();
    dmMessages.push(
      { senderId: davidId, senderName: 'David Lee', content: 'Dude check out my new homelab setup', timestamp: hoursAgo(10), dmPartnerId: ethanId, dmParticipants: [davidId, ethanId].sort() },
      { senderId: ethanId, senderName: 'Ethan Davis', content: 'What did you get??', timestamp: hoursAgo(9.5), dmPartnerId: davidId, dmParticipants: [davidId, ethanId].sort() },
      { senderId: davidId, senderName: 'David Lee', content: 'Got a R720 off eBay for $200! Running Proxmox', timestamp: hoursAgo(9), dmPartnerId: ethanId, dmParticipants: [davidId, ethanId].sort() },
      { senderId: ethanId, senderName: 'Ethan Davis', content: 'No way that\'s a steal! How many VMs are you running?', timestamp: hoursAgo(8.5), dmPartnerId: davidId, dmParticipants: [davidId, ethanId].sort() },
      { senderId: davidId, senderName: 'David Lee', content: 'So far just 5: pihole, plex, nextcloud, ubuntu server, and arch btw', timestamp: hoursAgo(8), dmPartnerId: ethanId, dmParticipants: [davidId, ethanId].sort() },
      { senderId: ethanId, senderName: 'Ethan Davis', content: 'Love it. I need to come over and check it out', timestamp: hoursAgo(7.5), dmPartnerId: davidId, dmParticipants: [davidId, ethanId].sort() },
    );

    await Message.insertMany(dmMessages);
    console.log(`  Created ${dmMessages.length} DM messages`);

    // CREATE FEED POSTS
    console.log('\n📰 Creating feed posts...');
    const posts = [
      {
        authorId: jordanId,
        authorName: 'Jordan Kim',
        authorAvatar: 'JK',
        authorMajor: 'Computer Science',
        content: 'Just accepted my offer from Amazon! So excited to be joining AWS in Seattle after graduation 🎉',
        timestamp: hoursAgo(2),
        likedBy: [alexId, sarahId, emilyId, oliviaId, marcusId, priyaId],
      },
      {
        authorId: sarahId,
        authorName: 'Sarah Martinez',
        authorAvatar: 'SM',
        authorMajor: 'Software Engineering',
        content: 'Anyone else running on pure caffeine and hope this week? ☕😅',
        timestamp: hoursAgo(5),
        likedBy: [alexId, marcusId, davidId, emilyId],
      },
      {
        authorId: emilyId,
        authorName: 'Emily Thompson',
        authorAvatar: 'ET',
        authorMajor: 'Cybersecurity',
        content: 'CISSP club is hosting a CTF competition next week! DM me if you want to join our team',
        timestamp: hoursAgo(8),
        likedBy: [marcusId, davidId],
      },
      {
        authorId: sophiaId,
        authorName: 'Sophia Wilson',
        authorAvatar: 'SW',
        authorMajor: 'Applied Mathematics',
        content: 'Hot take: Linear algebra is actually fun once you understand it 🤓',
        timestamp: hoursAgo(12),
        likedBy: [priyaId, alexId, userMap['canderson@gmu.edu']._id.toString()],
      },
      {
        authorId: davidId,
        authorName: 'David Lee',
        authorAvatar: 'DL',
        authorMajor: 'Information Technology',
        content: 'Finally got my homelab working! Running Proxmox on a R720. Time to host everything myself lol',
        timestamp: hoursAgo(15),
        likedBy: [ethanId, marcusId],
      },
      {
        authorId: marcusId,
        authorName: 'Marcus Johnson',
        authorAvatar: 'MJ',
        authorMajor: 'Computer Science',
        content: 'Study tip: explain your code to a rubber duck. Sounds dumb but it actually works',
        timestamp: hoursAgo(18),
        likedBy: [alexId, sarahId, userMap['rgarcia@gmu.edu']._id.toString(), priyaId],
      },
      {
        authorId: oliviaId,
        authorName: 'Olivia Brown',
        authorAvatar: 'OB',
        authorMajor: 'Software Engineering',
        content: 'Graduation in 3 months!! Can\'t believe it\'s almost over 🎓',
        timestamp: daysAgo(1),
        likedBy: [jordanId, sarahId, ethanId, userMap['nwhite@gmu.edu']._id.toString()],
      },
      {
        authorId: userMap['canderson@gmu.edu']._id.toString(),
        authorName: 'Chris Anderson',
        authorAvatar: 'CA',
        authorMajor: 'Computer Science',
        content: 'Just finished my 100th leetcode problem! Only 1000 more to go... 😭',
        timestamp: daysAgo(1),
        likedBy: [jordanId, alexId, oliviaId],
      },
      {
        authorId: alexId,
        authorName: 'Alex Chen',
        authorAvatar: 'AC',
        authorMajor: 'Computer Science',
        content: 'Does anyone else feel like they\'re drowning in assignments or is it just me?',
        timestamp: daysAgo(2),
        likedBy: [sarahId, marcusId, userMap['rgarcia@gmu.edu']._id.toString(), emilyId, davidId],
      },
      {
        authorId: ethanId,
        authorName: 'Ethan Davis',
        authorAvatar: 'ED',
        authorMajor: 'Software Engineering',
        content: 'Shoutout to the person who pushed to main without testing. Now the whole team\'s build is broken 🙃',
        timestamp: daysAgo(2),
        likedBy: [oliviaId, sarahId, jordanId],
      },
      {
        authorId: priyaId,
        authorName: 'Priya Patel',
        authorAvatar: 'PP',
        authorMajor: 'Data Science',
        content: 'Looking for students interested in a research project on ML models for climate data. DM me!',
        timestamp: daysAgo(3),
        likedBy: [sophiaId, alexId],
      },
      {
        authorId: userMap['nwhite@gmu.edu']._id.toString(),
        authorName: 'Noah White',
        authorAvatar: 'NW',
        authorMajor: 'Computer Science',
        content: 'Got accepted to CMU for grad school! Dreams do come true 🚀',
        timestamp: daysAgo(3),
        likedBy: [jordanId, oliviaId, alexId, emilyId, sophiaId, marcusId],
      },
      {
        authorId: userMap['rgarcia@gmu.edu']._id.toString(),
        authorName: 'Ryan Garcia',
        authorAvatar: 'RG',
        authorMajor: 'Computer Science',
        content: 'As a freshman: is it normal to feel completely lost all the time??',
        timestamp: daysAgo(4),
        likedBy: [alexId, sarahId, marcusId, emilyId],
      },
      {
        authorId: userMap['ataylor@gmu.edu']._id.toString(),
        authorName: 'Ava Taylor',
        authorAvatar: 'AT',
        authorMajor: 'Data Science',
        content: 'Just made my first data visualization dashboard with Tableau! This stuff is so cool',
        timestamp: daysAgo(4),
        likedBy: [priyaId, sophiaId],
      },
      {
        authorId: userMap['mrodriguez@gmu.edu']._id.toString(),
        authorName: 'Mia Rodriguez',
        authorAvatar: 'MR',
        authorMajor: 'Cybersecurity',
        content: 'Passed my Security+ certification!! One step closer to my dream job 🔐',
        timestamp: daysAgo(5),
        likedBy: [emilyId, davidId, jordanId],
      },
    ];

    const createdPosts = await Post.insertMany(posts);
    console.log(`  Created ${createdPosts.length} feed posts`);

    // CREATE STUDY SESSIONS
    console.log('\n📖 Creating study sessions...');
    const studySessions = [
      {
        courseId: courseMap['CS 310']._id,
        organizerId: alexId,
        organizerName: 'Alex Chen',
        title: 'Midterm Exam Prep',
        description: 'Going over practice problems and reviewing data structures. Bring your questions!',
        location: 'Fenwick Library Room 2020',
        dateTime: daysFromNow(2),
        duration: 120,
        attendingIds: [alexId, sarahId, marcusId, userMap['canderson@gmu.edu']._id.toString()],
        notAttendingIds: [],
      },
      {
        courseId: courseMap['CS 310']._id,
        organizerId: emilyId,
        organizerName: 'Emily Thompson',
        title: 'Graph Algorithms Study Group',
        description: 'Working on PA4 together. Let\'s tackle BFS, DFS, and Dijkstra\'s algorithm',
        location: 'Johnson Center Room 301',
        dateTime: daysFromNow(5),
        duration: 90,
        attendingIds: [emilyId, priyaId],
        notAttendingIds: [alexId],
      },
      {
        courseId: courseMap['MATH 214']._id,
        organizerId: sophiaId,
        organizerName: 'Sophia Wilson',
        title: 'Linear Algebra Homework Help',
        description: 'Group session for WebAssign problems. I\'ll walk through some examples',
        location: 'Horizon Hall 2010',
        dateTime: daysFromNow(1),
        duration: 60,
        attendingIds: [sophiaId, priyaId, userMap['rgarcia@gmu.edu']._id.toString(), userMap['ataylor@gmu.edu']._id.toString()],
        notAttendingIds: [],
      },
      {
        courseId: courseMap['CS 367']._id,
        organizerId: ethanId,
        organizerName: 'Ethan Davis',
        title: 'C Programming Lab Help',
        description: 'Working through linked list implementation. Bring your laptops!',
        location: 'Engineering Building 1103',
        dateTime: daysFromNow(3),
        duration: 90,
        attendingIds: [ethanId, davidId, alexId],
        notAttendingIds: [],
      },
      {
        courseId: courseMap['SWE 432']._id,
        organizerId: oliviaId,
        organizerName: 'Olivia Brown',
        title: 'Project Milestone Review',
        description: 'Going over REST API design patterns and testing strategies',
        location: 'Innovation Hall 325',
        dateTime: daysFromNow(4),
        duration: 75,
        attendingIds: [oliviaId, jordanId, sarahId],
        notAttendingIds: [ethanId],
      },
      {
        courseId: courseMap['CS 483']._id,
        organizerId: userMap['canderson@gmu.edu']._id.toString(),
        organizerName: 'Chris Anderson',
        title: 'DP Problems Practice',
        description: 'Solving dynamic programming problems together. Let\'s conquer this topic!',
        location: 'Nguyen Engineering 4th Floor Study Room',
        dateTime: daysFromNow(6),
        duration: 120,
        attendingIds: [userMap['canderson@gmu.edu']._id.toString(), sophiaId, priyaId],
        notAttendingIds: [],
      },
    ];

    await StudySession.insertMany(studySessions);
    console.log(`  Created ${studySessions.length} study sessions`);

    // CREATE DOCUMENTS
    console.log('\n📄 Creating documents...');
    const documents = [
      {
        courseId: courseMap['CS 310']._id,
        title: 'Lecture 12 Slides - AVL Trees.pdf',
        uploaderId: marcusId,
        uploaderName: 'Marcus Johnson',
        fileUrl: '/documents/cs310/lecture12-avl.pdf',
        fileSize: 2458624,
        uploadDate: daysAgo(7),
        semester: 'Spring 2026',
        isPreviousSemester: false,
        downloads: 45,
      },
      {
        courseId: courseMap['CS 310']._id,
        title: 'PA2 Solution Code.java',
        uploaderId: emilyId,
        uploaderName: 'Emily Thompson',
        fileUrl: '/documents/cs310/pa2-solution.java',
        fileSize: 15360,
        uploadDate: daysAgo(14),
        semester: 'Spring 2026',
        isPreviousSemester: false,
        downloads: 62,
      },
      {
        courseId: courseMap['CS 310']._id,
        title: 'Midterm 1 Study Guide.pdf',
        uploaderId: alexId,
        uploaderName: 'Alex Chen',
        fileUrl: '/documents/cs310/midterm1-guide.pdf',
        fileSize: 1048576,
        uploadDate: daysAgo(21),
        semester: 'Fall 2025',
        isPreviousSemester: true,
        downloads: 128,
      },
      {
        courseId: courseMap['CS 330']._id,
        title: 'DFA NFA Conversion Examples.pdf',
        uploaderId: sophiaId,
        uploaderName: 'Sophia Wilson',
        fileUrl: '/documents/cs330/dfa-nfa-examples.pdf',
        fileSize: 856432,
        uploadDate: daysAgo(10),
        semester: 'Spring 2026',
        isPreviousSemester: false,
        downloads: 31,
      },
      {
        courseId: courseMap['CS 367']._id,
        title: 'C Pointers Cheat Sheet.pdf',
        uploaderId: davidId,
        uploaderName: 'David Lee',
        fileUrl: '/documents/cs367/pointers-cheatsheet.pdf',
        fileSize: 524288,
        uploadDate: daysAgo(5),
        semester: 'Spring 2026',
        isPreviousSemester: false,
        downloads: 89,
      },
      {
        courseId: courseMap['CS 367']._id,
        title: 'Valgrind Tutorial.pdf',
        uploaderId: ethanId,
        uploaderName: 'Ethan Davis',
        fileUrl: '/documents/cs367/valgrind-tutorial.pdf',
        fileSize: 2097152,
        uploadDate: daysAgo(12),
        semester: 'Spring 2026',
        isPreviousSemester: false,
        downloads: 53,
      },
      {
        courseId: courseMap['MATH 214']._id,
        title: 'Eigenvalue Practice Problems.pdf',
        uploaderId: sophiaId,
        uploaderName: 'Sophia Wilson',
        fileUrl: '/documents/math214/eigenvalue-practice.pdf',
        fileSize: 1572864,
        uploadDate: daysAgo(8),
        semester: 'Spring 2026',
        isPreviousSemester: false,
        downloads: 41,
      },
      {
        courseId: courseMap['SWE 432']._id,
        title: 'REST API Best Practices.pdf',
        uploaderId: oliviaId,
        uploaderName: 'Olivia Brown',
        fileUrl: '/documents/swe432/rest-best-practices.pdf',
        fileSize: 3145728,
        uploadDate: daysAgo(6),
        semester: 'Spring 2026',
        isPreviousSemester: false,
        downloads: 37,
      },
      {
        courseId: courseMap['CS 483']._id,
        title: 'Algorithm Analysis Notes.pdf',
        uploaderId: userMap['canderson@gmu.edu']._id.toString(),
        uploaderName: 'Chris Anderson',
        fileUrl: '/documents/cs483/algorithm-analysis.pdf',
        fileSize: 2621440,
        uploadDate: daysAgo(4),
        semester: 'Spring 2026',
        isPreviousSemester: false,
        downloads: 28,
      },
    ];

    await Document.insertMany(documents);
    console.log(`  Created ${documents.length} documents`);

    console.log('\n✅ SEED COMPLETE!\n');
    console.log('Summary:');
    console.log(`  Users: ${createdUsers.length}`);
    console.log(`  Courses: ${createdCourses.length}`);
    console.log(`  Calendar Events: ${events.length}`);
    console.log(`  Channel Messages: ${channelMessages.length}`);
    console.log(`  DM Messages: ${dmMessages.length}`);
    console.log(`  Feed Posts: ${createdPosts.length}`);
    console.log(`  Study Sessions: ${studySessions.length}`);
    console.log(`  Documents: ${documents.length}`);
    console.log('\nTest accounts (all passwords: password123):');
    console.log('  achen42@gmu.edu - Alex Chen');
    console.log('  smartinez@gmu.edu - Sarah Martinez');
    console.log('  jkim99@gmu.edu - Jordan Kim');

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
