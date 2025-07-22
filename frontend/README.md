# ContentHub - Educational Content & Assessment Platform

A comprehensive full-stack web application for admin-controlled content-based learning and question bank management with multi-language support, student assessments, and collaborative review workflows.

## 🎯 Features

### Part 1: Content-Based Assessment Module
- **Learning Units**: Create unique units with text/video/image content in English, Hindi, Tamil
- **Question Management**: Multiple question types (MCQ, short/long answer, match following)
- **Review Workflow**: 3-reviewer approval system for quality assurance
- **Student Assessment**: Content viewing and question attempts with score tracking

### Part 2: Question Bank Module
- **Hierarchical Organization**: Topic-based question structure
- **Rich Content Support**: LaTeX formulas, code blocks, rich text
- **Collaborative Review**: Comment system with mistake marking
- **Advanced Filtering**: Topic/subtopic-based question retrieval

## 🛠️ Frontend Technologies

- **Framework**: Vite + React + TypeScript
- **State Management**: Zustand for global state
- **UI Components**: shadcn/ui with custom educational theme
- **Styling**: Tailwind CSS with design system
- **Rich Text**: TipTap editor with LaTeX and code support
- **File Upload**: React Dropzone for multi-media content
- **Routing**: React Router with role-based access

## 🎨 Design System

The application features a professional educational design with:
- **Primary**: Educational Blue (#3B82F6)
- **Secondary**: Learning Green (#059669)  
- **Accent**: Success Orange (#EA580C)
- **Gradients**: Beautiful educational gradients
- **Animations**: Smooth hover effects and transitions
- **Responsive**: Mobile-first design approach

## 📁 Frontend Folder Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Layout components (Header, Sidebar)
│   └── dashboard/       # Role-specific dashboards
├── pages/               # Page components
│   ├── auth/           # Authentication pages
│   ├── admin/          # Admin-specific pages
│   ├── student/        # Student-specific pages
│   └── reviewer/       # Reviewer-specific pages
├── stores/             # Zustand stores
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
├── assets/             # Static assets (images, icons)
└── utils/              # Helper utilities
```

## 🔐 Backend Requirements

### Core Dependencies
```bash
# Authentication & Security
npm install jsonwebtoken bcryptjs
npm install helmet cors express-rate-limit

# Database & ORM
npm install mysql2 # or postgresql/sqlite3
npm install knex # SQL query builder

# File Upload & Storage
npm install multer
npm install cloudinary # for cloud storage

# Real-time Communication
npm install socket.io

# Email Services
npm install nodemailer

# Validation & Sanitization
npm install joi # or express-validator
npm install express-validator

# Development Dependencies
npm install --save-dev nodemon
npm install --save-dev @types/node # if using TypeScript
```

### Backend Structure
```
backend/
├── controllers/         # Route controllers
│   ├── auth.js         # Authentication logic
│   ├── content.js      # Content management
│   ├── questions.js    # Question management
│   ├── reviews.js      # Review workflow
│   └── users.js        # User management
├── middleware/          # Custom middleware
│   ├── auth.js         # JWT verification
│   ├── roles.js        # Role-based access
│   └── upload.js       # File upload handling
├── models/             # Database models
├── routes/             # API routes
├── utils/              # Utility functions
├── config/             # Configuration files
└── socket/             # Socket.io handlers
```

### Database Schema (SQL)
```sql
-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'student', 'reviewer') NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Learning units table
CREATE TABLE learning_units (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content_type ENUM('text', 'video', 'image') NOT NULL,
  content TEXT NOT NULL,
  language ENUM('en', 'hi', 'ta') NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Questions table
CREATE TABLE questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  unit_id INT,
  type ENUM('short_answer', 'long_answer', 'mcq', 'match_following') NOT NULL,
  question TEXT NOT NULL,
  options JSON, -- For MCQ options
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  review_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (unit_id) REFERENCES learning_units(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Reviews table
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  question_id INT NOT NULL,
  reviewer_id INT NOT NULL,
  status ENUM('approved', 'rejected', 'needs_edit') NOT NULL,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id),
  FOREIGN KEY (reviewer_id) REFERENCES users(id)
);

-- Student assessments table
CREATE TABLE assessments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  unit_id INT NOT NULL,
  question_id INT NOT NULL,
  answer TEXT NOT NULL,
  score DECIMAL(5,2),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (unit_id) REFERENCES learning_units(id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);
```

## 🚀 Quick Start

### Frontend Development
```bash
# Clone the repository
git clone <repository-url>
cd assess-content-hub

# Install dependencies
npm install

# Start development server
npm run dev
```

### Demo Login Credentials
- **Admin**: Click "Admin" in quick demo login
- **Reviewer**: Click "Reviewer" in quick demo login  
- **Student**: Click "Student" in quick demo login

## 🎯 Role-Based Features

### Admin Dashboard
- Create and manage learning units
- Add questions to units
- Monitor review workflow
- User management
- Platform analytics

### Reviewer Dashboard
- Review pending questions
- Approve/reject/request edits
- Comment on questions
- Mark mistakes and provide feedback

### Student Dashboard
- Browse available learning units
- Attempt questions and assessments
- View scores and progress
- Track learning streaks

## 🌐 Multi-Language Support

The platform supports UTF-8 encoding for:
- **English**: Full feature support
- **Hindi**: Text content and questions
- **Tamil**: Text content and questions

## 📚 Additional Resources

- [Lovable Documentation](https://docs.lovable.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [TipTap Editor](https://tiptap.dev/)
- [Zustand State Management](https://zustand-demo.pmnd.rs/)

---

**Built with ❤️ using Lovable - The AI-powered development platform**
