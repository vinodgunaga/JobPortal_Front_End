# Job Portal Frontend

A modern, production-ready React + TypeScript frontend for the Job Portal application.

## 🚀 Tech Stack

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Redux Toolkit** - State Management
- **React Router v6** - Routing
- **Axios** - HTTP Client
- **React Hook Form** - Form Handling
- **Tailwind CSS** - Styling
- **Vite** - Build Tool
- **React Hot Toast** - Notifications

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   │   └── ProtectedRoute.tsx
│   ├── jobs/           # Job-related components
│   │   ├── JobCard.tsx
│   │   └── JobFilters.tsx
│   ├── layout/         # Layout components
│   │   ├── Layout.tsx
│   │   └── Navbar.tsx
│   └── ui/             # Generic UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Loader.tsx
│       ├── Pagination.tsx
│       └── Select.tsx
├── pages/              # Page components
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── jobs/
│   │   ├── JobListPage.tsx
│   │   └── JobDetailPage.tsx
│   └── recruiter/
│       └── CreateJobPage.tsx
├── services/           # API services
│   ├── api.ts         # Axios instance with interceptors
│   ├── auth.service.ts
│   └── job.service.ts
├── store/              # Redux store
│   ├── slices/
│   │   ├── authSlice.ts
│   │   └── jobSlice.ts
│   ├── hooks.ts       # Typed Redux hooks
│   └── store.ts       # Store configuration
├── types/              # TypeScript types
│   ├── auth.types.ts
│   └── job.types.ts
├── utils/              # Utility functions
├── App.tsx            # Main App component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## 🎯 Key Features

### ✅ Authentication
- Login/Register with JWT
- Protected routes
- Role-based access (User, Recruiter, Admin)
- Automatic token refresh
- Persistent sessions

### ✅ Job Browsing
- Advanced filtering (location, job type, experience, salary, skills)
- Real-time search
- Sorting (by date, title, salary)
- Pagination with metadata
- Job detail view

### ✅ Job Application
- Resume upload (PDF, DOC, DOCX)
- File validation
- Application status tracking

### ✅ Recruiter Features
- Post new jobs
- Rich job form with validation
- Salary range specification
- Skills tagging

### ✅ UI/UX
- Responsive design (mobile-first)
- Loading states
- Error handling with toast notifications
- Form validation
- Accessible components

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:5000`

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

3. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📝 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT token stored in localStorage
3. Token attached to all API requests via Axios interceptor
4. Token refresh on 401 errors
5. Automatic logout on refresh failure

## 🛣️ Routes

### Public Routes
- `/login` - Login page
- `/register` - Registration page
- `/jobs` - Browse jobs (public access)
- `/jobs/:id` - Job details

### Protected Routes (Requires Login)
- Apply to jobs - User role only

### Recruiter Routes
- `/recruiter/jobs/create` - Create job posting

## 🎨 Styling Conventions

### Tailwind Classes
- Use utility-first approach
- Component-specific styles in component files
- Consistent spacing scale (4px grid)
- Responsive breakpoints: sm, md, lg, xl

### Color Palette
```
Primary: Blue (#3b82f6)
Success: Green (#4ade80)
Error: Red (#ef4444)
Warning: Yellow (#fbbf24)
Gray scale: 50-950
```

## 🔄 State Management

### Redux Slices

**Auth Slice** (`authSlice.ts`)
- User authentication state
- Login/Register/Logout actions
- Token management

**Job Slice** (`jobSlice.ts`)
- Job listings with pagination
- Current job details
- Filters and search state
- Create job and apply actions

### Usage Example

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchJobs, setFilters } from '@/store/slices/jobSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const { jobs, loading } = useAppSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs({ page: 1, pageSize: 10 }));
  }, []);
};
```

## 🌐 API Integration

### Axios Configuration
- Base URL from environment variables
- Request interceptor adds JWT token
- Response interceptor handles errors and token refresh
- Automatic retry on 401

### Service Layer

```typescript
// services/job.service.ts
export const jobService = {
  getJobs(params: JobQueryParams): Promise<PagedResult<Job>>
  getJobById(id: string): Promise<Job>
  createJob(data: CreateJobRequest): Promise<Job>
  applyToJob(jobId: string, file: File): Promise<void>
}
```

## 🧪 Type Safety

All API responses and component props are fully typed:

```typescript
interface Job {
  id: string;
  title: string;
  description: string;
  location?: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  minSalary?: number;
  maxSalary?: number;
  // ... more fields
}
```

## 📱 Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile-First Approach
```tsx
<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
  {/* 1 column on mobile, 4 on desktop */}
</div>
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Output in `dist/` folder ready for deployment.

### Environment Variables

Production `.env`:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Deployment Platforms
- **Vercel** (Recommended for Vite)
- **Netlify**
- **AWS S3 + CloudFront**
- **Azure Static Web Apps**

## 🎯 Performance Optimizations

- Code splitting with React.lazy
- Memoization with useMemo/useCallback
- Debounced search inputs
- Pagination to limit data fetching
- Image lazy loading
- Tree shaking with Vite

## 🔒 Security Best Practices

- ✅ XSS protection (React escapes by default)
- ✅ CSRF protection (JWT in Authorization header)
- ✅ Input validation with React Hook Form
- ✅ File upload validation
- ✅ Role-based access control
- ✅ Secure token storage
- ✅ HTTPS only in production

## 🐛 Error Handling

### Global Error Handling
- API errors caught by Axios interceptor
- User-friendly toast notifications
- Form validation errors
- Network error handling

### Example
```typescript
try {
  await dispatch(createJob(data)).unwrap();
  toast.success('Job created!');
} catch (error) {
  // Error already shown by interceptor
}
```

## 📚 Component Guidelines

### Creating New Components

1. **Use TypeScript interfaces**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  children: React.ReactNode;
}
```

2. **Implement proper error states**
```typescript
{loading && <Loader />}
{error && <ErrorMessage />}
{data && <Content />}
```

3. **Keep components focused**
- One responsibility per component
- Reusable and composable
- Props for customization

## 🤝 Contributing

### Coding Standards
- Follow existing file structure
- Use TypeScript strictly
- Write self-documenting code
- Use meaningful variable names
- Comment complex logic

### Pull Request Process
1. Create feature branch
2. Write/update tests
3. Update documentation
4. Submit PR with description

## 📄 License

MIT License - see LICENSE file

## 🙋 Support

For issues or questions:
- Check existing documentation
- Review TypeScript types
- Check Redux DevTools for state issues

---

**Built with ❤️ using React + TypeScript + Tailwind CSS**
