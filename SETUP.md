# Quick Setup Guide

## 🚀 Installation Steps

### 1. Prerequisites Check

```bash
# Check Node.js version (requires 18+)
node --version

# Check npm version
npm --version
```

### 2. Install Dependencies

```bash
cd jobportal-frontend
npm install
```

This will install:
- React 18
- TypeScript
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios
- React Hook Form
- And all other dependencies

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**Important:** Make sure your backend API is running on port 5000!

### 4. Start Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

## ✅ Verification Checklist

### Backend Connection
- [ ] Backend API running on `http://localhost:5000`
- [ ] Can access `http://localhost:5000/api/jobs` (should return job list)
- [ ] CORS enabled in backend for `http://localhost:3000`

### Frontend
- [ ] No console errors on page load
- [ ] Can see login/register pages
- [ ] Can browse jobs (even without login)
- [ ] Tailwind styles loading correctly

## 🔧 Common Issues & Solutions

### Issue 1: "Cannot find module '@/...'"
**Solution:** TypeScript path aliases configured in `vite.config.ts` and `tsconfig.json`
```bash
npm run dev
```

### Issue 2: API requests failing
**Solution:** Check backend CORS configuration

Add to your ASP.NET Core `Program.cs`:
```csharp
app.UseCors(policy => 
    policy.WithOrigins("http://localhost:3000")
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials());
```

### Issue 3: Tailwind styles not working
**Solution:**
```bash
npm install -D tailwindcss postcss autoprefixer
npm run dev
```

### Issue 4: Port 3000 already in use
**Solution:** Change port in `vite.config.ts`:
```typescript
server: {
  port: 3001, // Change to any available port
}
```

## 📁 Project Structure Overview

```
jobportal-frontend/
├── node_modules/           # Dependencies (auto-generated)
├── public/                 # Static files
├── src/
│   ├── components/        # Reusable components
│   │   ├── auth/          # Auth-related components
│   │   ├── jobs/          # Job-related components
│   │   ├── layout/        # Layout components
│   │   └── ui/            # Generic UI components
│   ├── pages/             # Page components (routes)
│   │   ├── auth/          # Login, Register
│   │   ├── jobs/          # Job list, detail
│   │   └── recruiter/     # Recruiter pages
│   ├── services/          # API calls
│   ├── store/             # Redux state
│   │   └── slices/        # Redux slices
│   ├── types/             # TypeScript types
│   ├── App.tsx            # Main app with routing
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── .env                   # Environment variables
├── .env.example           # Environment template
├── index.html             # HTML entry
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite config
├── tailwind.config.js     # Tailwind config
└── README.md              # Documentation
```

## 🎯 First Steps After Setup

### 1. Test Login Flow
```
1. Go to http://localhost:3000/register
2. Create account (User or Recruiter)
3. Login with credentials
4. Should redirect to /jobs
```

### 2. Test Job Browsing
```
1. Browse jobs on /jobs page
2. Use filters (location, job type, etc.)
3. Click on a job to see details
4. Try pagination
```

### 3. Test Job Application (as User)
```
1. Login as User
2. Click on a job
3. Upload resume (PDF/DOC)
4. Submit application
```

### 4. Test Job Creation (as Recruiter)
```
1. Login as Recruiter
2. Go to "Post a Job" in navbar
3. Fill job details
4. Submit
5. See job in listings
```

## 📊 Development Workflow

### Daily Development
```bash
# 1. Start backend (in backend folder)
dotnet run --project JobPortal.API

# 2. Start frontend (in frontend folder)
npm run dev

# 3. Code and test
# Hot reload enabled - changes reflect immediately
```

### Before Committing
```bash
# Check TypeScript errors
npm run type-check

# Check ESLint issues
npm run lint

# Build to verify production build works
npm run build
```

## 🌐 API Endpoints Used

The frontend calls these backend endpoints:

### Auth
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

### Jobs
- `GET /api/jobs` - Get paginated jobs with filters
- `GET /api/jobs/{id}` - Get job details
- `POST /api/jobs` - Create job (Recruiter only)
- `POST /api/jobs/{id}/apply` - Apply to job (User only)

## 🎨 Customization

### Change Primary Color
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#your-color',
    600: '#your-darker-color',
    // ...
  }
}
```

### Change Logo/Brand
Edit `src/components/layout/Navbar.tsx`:
```tsx
<Link to="/jobs" className="text-2xl font-bold text-primary-600">
  Your Brand Name
</Link>
```

### Add New Route
1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`:
```tsx
<Route path="/your-path" element={<YourComponent />} />
```

## 📱 Testing on Mobile

### Local Network Testing
1. Find your local IP:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

2. Update Vite config:
```typescript
server: {
  host: '0.0.0.0', // Listen on all interfaces
  port: 3000,
}
```

3. Access from mobile: `http://YOUR_IP:3000`

## 🚀 Production Build

```bash
# Build optimized production bundle
npm run build

# Test production build locally
npm run preview
```

Output in `dist/` folder - ready to deploy!

## 📚 Next Steps

1. ✅ Customize branding and colors
2. ✅ Add more features (favorites, notifications)
3. ✅ Implement advanced search
4. ✅ Add user profile pages
5. ✅ Implement job analytics
6. ✅ Add email notifications
7. ✅ Deploy to production

## 🆘 Getting Help

### Debug Tools
- **Redux DevTools** - Chrome extension for state debugging
- **React DevTools** - Chrome extension for component debugging
- **Network Tab** - Check API calls in browser DevTools
- **Console** - Check for JavaScript errors

### Logs to Check
```typescript
// In components
console.log('Current state:', useAppSelector(state => state));

// In Redux slices
console.log('Action payload:', action.payload);

// In API calls
console.log('Request:', config);
console.log('Response:', response);
```

---

**Ready to code! Happy developing! 🎉**
