# 🎓 MasonNet

<div align="center">

![Flutter](https://img.shields.io/badge/Flutter-3.10.8-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![Dart](https://img.shields.io/badge/Dart-3.0+-0175C2?style=for-the-badge&logo=dart&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**The ultimate social and academic hub for George Mason University students**

*Connect with classmates • Share knowledge • Ace your classes*

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Docs](#-api-documentation) • [Screenshots](#-screenshots)

</div>

---

## 📖 About

**MasonNet** is a comprehensive mobile application designed exclusively for George Mason University students. It combines social networking, class management, and academic collaboration into one seamless platform. Whether you're looking for study partners, sharing class notes, or staying on top of assignments, MasonNet has you covered.

### ✨ Key Highlights

- 🔐 **Secure Authentication** - GMU email-only registration with JWT tokens
- 📱 **Beautiful UI** - Dark-themed interface with GMU's signature green and gold
- 💬 **Real-time Messaging** - DMs and course-specific channel chats
- 📚 **Academic Management** - Track courses, assignments, and study sessions
- 🌐 **Social Feed** - University-wide feed for announcements and discussions
- 📄 **Document Sharing** - Upload and download class materials
- 🗓️ **Smart Calendar** - Visualize all your deadlines and events
- 👥 **Study Groups** - Find and organize study sessions with RSVP tracking

---

## 🎯 Features

### 🏠 Dashboard
- **Personalized Overview** - See your enrolled courses at a glance
- **Upcoming Events** - Never miss a deadline with the event preview
- **Quick Stats** - Track your study groups and academic activity
- **Pull to Refresh** - Always get the latest data

### 📚 Class Management
- **Browse Courses** - Explore all available GMU courses
- **Enroll/Unenroll** - Manage your class schedule with one tap
- **Course Channels** - Access dedicated chat channels for each class
  - 💬 General discussion
  - 📝 Homework help
  - 🛠️ Project collaboration
  - 📚 Exam preparation
- **Class Materials** - View events, study sessions, documents, and enrolled students

### 📅 Calendar
- **Visual Timeline** - Beautiful calendar view of all your events
- **Event Types** - Color-coded badges for homework, quizzes, exams, and projects
- **Multi-Course** - See events from all enrolled courses in one place
- **Interactive** - Tap any date to see that day's events

### 🌐 Global Feed
- **Campus-Wide Posts** - Share thoughts, questions, and announcements
- **Like & Engage** - React to posts from fellow students
- **Real-time Updates** - See the latest activity as it happens
- **User Profiles** - View author details (major, year, bio)

### 💬 Messaging
- **Direct Messages** - Private 1-on-1 conversations with any student
- **Course Channels** - Topic-specific group chats for each class
- **Smart Timestamps** - Human-readable time formatting
- **Conversation List** - See all your DMs with latest message previews

### 📖 Study Sessions
- **Create Sessions** - Organize study groups with date/time picker
- **RSVP System** - Attend or decline with one tap
- **Session Details** - Location, duration, description, and attendee list
- **Course-Specific** - Filter sessions by class

### 📄 Documents
- **Upload Files** - Share notes, slides, and study materials
- **Download Tracking** - See which documents are most helpful
- **Semester Organization** - View current and previous semester materials
- **Search & Filter** - Find documents quickly

### 👤 Profile
- **Edit Profile** - Update your name and bio
- **Academic Stats** - See your enrolled courses and study groups
- **Activity Feed** - View your post history
- **Sign Out** - Secure logout with token clearing

---

## 🛠 Tech Stack

### Frontend (Flutter)
```yaml
Flutter SDK: 3.10.8
Language: Dart 3.0+
UI Framework: Material Design 3
```

**Key Packages:**
- `http: ^1.2.0` - REST API communication
- `shared_preferences: ^2.3.0` - Local token persistence
- `table_calendar: ^3.0.9` - Interactive calendar widget
- `intl: ^0.18.0` - Date/time formatting
- `image_picker: ^1.0.4` - Photo selection
- `file_picker: ^6.0.0` - Document uploads

### Backend (Node.js)
```json
Runtime: Node.js 18+
Framework: Express.js
Database: MongoDB Atlas
```

**Dependencies:**
- `express: ^4.18.2` - REST API server
- `mongoose: ^8.0.0` - MongoDB ODM
- `jsonwebtoken: ^9.0.2` - JWT authentication
- `bcryptjs: ^2.4.3` - Password hashing
- `cors: ^2.8.5` - Cross-origin requests
- `dotenv: ^16.3.1` - Environment configuration

### Database Schema
```
📦 MongoDB Collections
├── users - Student accounts and profiles
├── courses - Class information and channels
├── messages - DMs and channel chats
├── posts - Global feed content
├── calendarevents - Assignments and deadlines
├── studysessions - Study group meetings
└── documents - Shared class materials
```

---

## 🚀 Getting Started

### Prerequisites

- **Flutter SDK** 3.10.8 or higher ([Install Flutter](https://docs.flutter.dev/get-started/install))
- **Node.js** 18+ ([Download Node.js](https://nodejs.org/))
- **MongoDB Atlas** account ([Sign up free](https://www.mongodb.com/cloud/atlas/register))
- **Git** for version control
- **VS Code** or **Android Studio** (recommended)

### 📥 Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/masonnet.git
cd masonnet
```

#### 2️⃣ Set Up MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user (Database Access → Add New Database User)
3. Whitelist your IP (Network Access → Add IP Address → Add Current IP)
4. Get your connection string:
   - Click **Connect** on your cluster
   - Choose **Connect your application**
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

#### 3️⃣ Configure Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/masonnet
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3000
```

#### 4️⃣ Seed the Database

```bash
node seed.js
```

You should see:
```
✅ Connected to MongoDB
🗑️  Dropping all collections...
👥 Creating users...
📚 Creating courses...
💬 Creating channel messages...
✉️  Creating DM conversations...
📰 Creating feed posts...
📖 Creating study sessions...
📄 Creating documents...
✅ SEED COMPLETE!
```

#### 5️⃣ Start the Backend Server

```bash
node server.js
```

Expected output:
```
MongoDB connected successfully
Server running on port 3000
```

**Keep this terminal running!** The Flutter app needs the backend to be active.

#### 6️⃣ Configure Flutter

Return to project root and install dependencies:
```bash
cd ..  # Back to project root
flutter pub get
```

**Important:** Update the API base URL in `lib/services/api_config.dart`:

```dart
class ApiConfig {
  // Choose the right URL for your platform:
  
  // iOS Simulator / Windows / Web:
  static const String baseUrl = 'http://localhost:3000/api';
  
  // Android Emulator:
  // static const String baseUrl = 'http://10.0.2.2:3000/api';
  
  // Physical Device (use your computer's local IP):
  // static const String baseUrl = 'http://192.168.1.XXX:3000/api';
}
```

#### 7️⃣ Run the App

```bash
flutter run
```

Or use VS Code/Android Studio's run button!

---

## 🔐 Test Accounts

All test accounts use password: **`password123`**

| Email | Name | Major | Year | Course Load |
|-------|------|-------|------|-------------|
| `achen42@gmu.edu` | Alex Chen | Computer Science | Junior | CS 310, CS 330, CS 367, MATH 214 |
| `smartinez@gmu.edu` | Sarah Martinez | Software Engineering | Sophomore | CS 310, CS 262, SWE 432 |
| `jkim99@gmu.edu` | Jordan Kim | Computer Science | Senior | CS 471, CS 483, SWE 432 |
| `ethompson@gmu.edu` | Emily Thompson | Cybersecurity | Junior | CS 310, CS 471, CS 330 |
| `mjohnson@gmu.edu` | Marcus Johnson | Computer Science | Sophomore | CS 310, CS 262, MATH 214 |

**Or create your own account!** Just use any `@gmu.edu` email format.

---

## 📱 Screenshots

### 🏠 Home Dashboard
The personalized dashboard shows your enrolled courses, upcoming deadlines, and study group count. Pull to refresh for real-time updates.

### 📚 Course Channels
Each course has dedicated channels for different topics - General chat, Homework help, Projects, and Exam prep. Stay organized and collaborate with classmates.

### 🗓️ Calendar View
Beautiful visual calendar with color-coded events. Tap any date to see homework, quizzes, exams, and project deadlines. Never miss an assignment!

### 🌐 Global Feed
Campus-wide social feed where students share announcements, ask questions, and engage with the GMU community. Like posts and see trending discussions.

### 💬 Messaging
Direct message any student or participate in course-specific group chats. Real-time conversations with clean UI and smart timestamps.

### 📖 Study Sessions
Create and join study sessions with built-in RSVP system. See who's attending, location, duration, and session details. Perfect for exam prep!

---

## 🔧 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### 🔐 Authentication
```http
POST   /api/auth/register       # Create new account
POST   /api/auth/login          # Login and get token
GET    /api/auth/me             # Get current user
PUT    /api/auth/profile        # Update profile
GET    /api/auth/users/:id      # Get user by ID
```

#### 📚 Courses
```http
GET    /api/courses             # List all courses
GET    /api/courses/:id         # Get course details
POST   /api/courses/:id/enroll  # Enroll in course
POST   /api/courses/:id/unenroll # Leave course
GET    /api/courses/:id/students # Get enrolled students
```

#### 💬 Messages
```http
GET    /api/messages/channel/:channelId     # Get channel messages
POST   /api/messages/channel/:channelId     # Send channel message
GET    /api/messages/dm/:partnerId          # Get DM thread
POST   /api/messages/dm/:partnerId          # Send DM
GET    /api/messages/dm-conversations       # List all DM conversations
```

#### 📰 Posts
```http
GET    /api/posts               # Get global feed
POST   /api/posts               # Create post
POST   /api/posts/:id/like      # Toggle like
GET    /api/posts/user/:userId  # Get user's posts
```

#### 📅 Events
```http
GET    /api/events/course/:courseId  # Get course events
GET    /api/events/my-events         # Get user's events
POST   /api/events                   # Create event
```

#### 📖 Study Sessions
```http
GET    /api/study-sessions/course/:courseId  # Get course sessions
GET    /api/study-sessions/my-sessions       # Get user's sessions
POST   /api/study-sessions                   # Create session
POST   /api/study-sessions/:id/rsvp          # RSVP to session
```

#### 📄 Documents
```http
GET    /api/documents/course/:courseId?previous=true  # Get course docs
POST   /api/documents                                 # Upload document
POST   /api/documents/:id/download                    # Track download
```

---

## 🎨 Design System

### Color Palette
```dart
Primary (GMU Green):  #006633
Secondary (GMU Gold): #FFCC33
Background Dark:      #121212
Card Dark:            #1E1E1E
Text Light:           #FFFFFF
Text Secondary:       #B0B0B0
```

### Typography
- **Headers**: SF Pro Display / Roboto Bold
- **Body**: SF Pro Text / Roboto Regular
- **Monospace**: SF Mono / Roboto Mono (for code)

### Components
- **Cards**: Elevated with subtle shadows
- **Buttons**: Rounded corners (12px radius)
- **Icons**: Material Design Icons
- **Avatars**: Circular with initials on colored background

---

## 🏗️ Project Structure

```
masonnet/
├── lib/
│   ├── main.dart                    # App entry point
│   ├── models/                      # Data models
│   │   ├── user.dart
│   │   ├── course.dart
│   │   ├── message.dart
│   │   ├── post.dart
│   │   ├── calendar_event.dart
│   │   ├── study_session.dart
│   │   └── document.dart
│   ├── screens/                     # UI screens
│   │   ├── auth/                    # Login & Registration
│   │   ├── home/                    # Dashboard
│   │   ├── classes/                 # Course management
│   │   ├── calendar/                # Calendar view
│   │   ├── feed/                    # Global feed
│   │   ├── messaging/               # DMs & channels
│   │   ├── profile/                 # User profile
│   │   ├── study_sessions/          # Study groups
│   │   └── documents/               # File sharing
│   ├── services/                    # Business logic
│   │   ├── api_config.dart          # API base URL
│   │   ├── auth_service.dart        # Authentication
│   │   └── api_service.dart         # API client
│   ├── theme/
│   │   └── app_theme.dart           # Color scheme & styling
│   └── data/
│       └── mock_data.dart           # Legacy (unused)
├── backend/
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Message.js
│   │   ├── Post.js
│   │   ├── CalendarEvent.js
│   │   ├── StudySession.js
│   │   └── Document.js
│   ├── routes/                      # API endpoints
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── messages.js
│   │   ├── posts.js
│   │   ├── events.js
│   │   ├── studySessions.js
│   │   └── documents.js
│   ├── middleware/
│   │   └── auth.js                  # JWT verification
│   ├── server.js                    # Express app
│   ├── seed.js                      # Database seeding
│   ├── package.json
│   └── .env                         # Environment variables
├── pubspec.yaml                     # Flutter dependencies
└── README.md                        # This file!
```

---

## 🤝 Contributing

We welcome contributions from the GMU community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Write clear commit messages
- Test on both iOS and Android before submitting
- Update documentation for new features

---

## 🐛 Troubleshooting

### Backend won't start
**Error:** `MongoNetworkError: failed to connect to server`
- ✅ Check your MongoDB URI in `.env`
- ✅ Verify IP whitelist in Atlas
- ✅ Ensure cluster is running (not paused)

### Flutter can't connect to API
**Error:** `SocketException: Connection refused`
- ✅ Backend server must be running (`node server.js`)
- ✅ Check `api_config.dart` URL matches your platform:
  - iOS/Windows: `http://localhost:3000/api`
  - Android emulator: `http://10.0.2.2:3000/api`
  - Physical device: `http://YOUR_LOCAL_IP:3000/api`

### Authentication fails
**Error:** `401 Unauthorized`
- ✅ Check JWT_SECRET is set in `.env`
- ✅ Try logging out and back in
- ✅ Clear app data if persisted token is invalid

### Seed script fails
**Error:** `E11000 duplicate key error`
- ✅ The script drops all collections first - if it fails, manually delete collections in MongoDB Atlas
- ✅ Ensure MongoDB connection is stable

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **George Mason University** - For inspiring this project
- **Flutter Team** - For the amazing framework
- **MongoDB** - For the free Atlas tier
- **The GMU Student Community** - For feedback and support

---

## 📬 Contact

**Project Maintainer:** Tahir And Daanish  
**Email:** twentysixprojects.business@gmail.com  


