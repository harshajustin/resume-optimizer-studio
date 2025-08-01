# SkillMatch AI

Bridge your resume with job skill needs - A modern web application for optimizing resumes and tracking job applications, built with React, TypeScript, and Tailwind CSS.

## 🚀 Live Demo
**Deployed on DigitalOcean App Platform**: [Your App URL]

## 📋 Features
- **Resume Upload & Analysis** with drag-and-drop support
- **Job Tracker** with Kanban board interface
- **Job Search & Discovery** with advanced filtering
- **Resume Management** with version control
- **Scan History** for tracking optimization progress
- **Modern UI** with teal/emerald color palette

## 🛠 Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Package Manager**: npm
- **Deployment**: DigitalOcean App Platform

## 🚀 Deployment

### DigitalOcean App Platform
This project is configured for deployment on DigitalOcean App Platform:

1. **Automatic Deployment**: Connected to GitHub for automatic deployments
2. **Build Command**: `npm install && npm run build`
3. **Run Command**: `npm run preview`
4. **Environment**: Node.js with npm package manager

### Environment Variables
```env
NODE_ENV=production
VITE_APP_TITLE="SkillMatch AI"
VITE_APP_VERSION="1.0.0"
```

## 💻 Local Development

### Prerequisites
- Node.js 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- npm (comes with Node.js)

### Setup

```sh
# Clone the repository
git clone https://github.com/harshajustin/resume-optimizer-studio.git

# Navigate to project directory
cd resume-optimizer-studio

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run start` - Start production server

## 🎯 Project Status
See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for detailed project roadmap and current implementation status.

## 🛠 Development

### Code Quality
- **ESLint**: Configured for React + TypeScript
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting (can be added)
- **shadcn/ui**: Consistent component library

### Git Workflow
1. Create feature branches from `main`
2. Make changes and test locally
3. Run `npm run lint` to check for errors
4. Commit and push changes
5. DigitalOcean App Platform will auto-deploy

## 📦 Dependencies
- **React 18**: Latest React with hooks
- **TypeScript**: Type safety and better DX
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library
- **React Router**: Client-side routing
- **Lucide React**: Beautiful icons

## 🚀 Next Steps
1. **Backend Integration**: Add API endpoints for data persistence
2. **Authentication**: Implement user login/registration
3. **Resume Processing**: AI-powered resume analysis
4. **Job Integration**: Connect to external job APIs
5. **Mobile App**: React Native implementation

---

Built with ❤️ using React, TypeScript, and modern web technologies.
