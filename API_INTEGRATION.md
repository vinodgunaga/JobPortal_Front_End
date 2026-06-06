# API Integration Guide

## 🔗 Backend Connection

This frontend connects to your ASP.NET Core backend API.

## ⚙️ Configuration

### Environment Variables

Create `.env` file in the root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**Production:**
```env
VITE_API_BASE_URL=https://your-production-domain.com/api
```

## 🚨 Backend CORS Setup

Your backend **MUST** have CORS configured to accept requests from the frontend.

### ASP.NET Core `Program.cs`

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://your-frontend-domain.com")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Use CORS (BEFORE other middleware)
app.UseCors("ReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
```

## 📡 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "role": "User" | "Recruiter"
}

Response: 200 OK
{
  "token": "jwt-token-here",
  "refreshToken": "refresh-token-here",
  "user": {
    "id": "user-guid",
    "email": "user@example.com",
    "role": "User",
    "isEmailVerified": false
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}

Response: 200 OK
{
  "token": "jwt-token-here",
  "refreshToken": "refresh-token-here",
  "user": { ... }
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh-token-here"
}

Response: 200 OK
{
  "token": "new-jwt-token",
  "refreshToken": "new-refresh-token"
}
```

### Jobs

#### Get Jobs (Paginated + Filtered)
```http
GET /api/jobs?page=1&pageSize=10&search=developer&location=bangalore&jobType=0&minSalary=50000&sortBy=createdAt&order=desc

Response: 200 OK
{
  "items": [
    {
      "id": "job-guid",
      "title": "Senior React Developer",
      "description": "...",
      "location": "Bangalore",
      "jobType": 0,
      "experienceLevel": 2,
      "minSalary": 80000,
      "maxSalary": 150000,
      "company": "TechCorp",
      "isActive": true,
      "deadline": "2024-12-31T00:00:00Z",
      "skills": "React, TypeScript, Node.js",
      "createdBy": "user-guid",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "totalCount": 45,
  "page": 1,
  "pageSize": 10,
  "totalPages": 5,
  "hasPreviousPage": false,
  "hasNextPage": true
}
```

#### Get Job by ID
```http
GET /api/jobs/{id}

Response: 200 OK
{
  "id": "job-guid",
  "title": "Senior React Developer",
  ...
}
```

#### Create Job (Recruiter only)
```http
POST /api/jobs
Authorization: Bearer {jwt-token}
Content-Type: application/json

{
  "title": "Backend Developer",
  "description": "Looking for experienced developer...",
  "location": "Mumbai",
  "jobType": 0,
  "experienceLevel": 1,
  "minSalary": 60000,
  "maxSalary": 100000,
  "company": "StartupXYZ",
  "deadline": "2024-12-31T00:00:00Z",
  "skills": "C#, ASP.NET Core, SQL Server"
}

Response: 201 Created
{
  "id": "new-job-guid",
  "title": "Backend Developer",
  ...
}
```

#### Apply to Job (User only)
```http
POST /api/jobs/{id}/apply
Authorization: Bearer {jwt-token}
Content-Type: multipart/form-data

FormData:
  resume: [File]

Response: 200 OK
{
  "message": "Application submitted successfully"
}
```

## 🔐 Authentication Flow

### 1. Login/Register
```typescript
// User logs in
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Store tokens
localStorage.setItem('token', response.token);
localStorage.setItem('refreshToken', response.refreshToken);
```

### 2. Automatic Token Attachment
```typescript
// Axios interceptor automatically adds token to requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. Automatic Token Refresh
```typescript
// On 401 error, automatically refresh token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post('/auth/refresh', { refreshToken });
      
      localStorage.setItem('token', response.data.token);
      
      // Retry original request with new token
      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

### 4. Logout
```typescript
// Clear tokens
localStorage.removeItem('token');
localStorage.removeItem('refreshToken');
```

## 📋 Query Parameters

### Job Filtering

All parameters are optional:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (1-based) | `1` |
| `pageSize` | number | Items per page | `10` |
| `search` | string | Search in title, description, company | `developer` |
| `location` | string | Filter by location | `bangalore` |
| `jobType` | number | Filter by job type (enum) | `0` (FullTime) |
| `experienceLevel` | number | Filter by experience | `1` (MidLevel) |
| `minSalary` | number | Minimum salary | `50000` |
| `maxSalary` | number | Maximum salary | `100000` |
| `company` | string | Filter by company | `microsoft` |
| `isActive` | boolean | Active jobs only | `true` |
| `skills` | string | Comma-separated skills | `react,node` |
| `sortBy` | string | Sort field | `createdAt`, `title`, `salary` |
| `order` | number | Sort order | `0` (Asc), `1` (Desc) |

### Enums

**JobType:**
```typescript
0 = FullTime
1 = PartTime
2 = Contract
3 = Internship
4 = Freelance
```

**ExperienceLevel:**
```typescript
0 = EntryLevel
1 = MidLevel
2 = Senior
3 = Lead
4 = Executive
```

**SortOrder:**
```typescript
0 = Asc
1 = Desc
```

## 🛠️ Service Layer Usage

### In Components

```typescript
import { useAppDispatch } from '@/store/hooks';
import { fetchJobs } from '@/store/slices/jobSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Fetch jobs with filters
    dispatch(fetchJobs({
      page: 1,
      pageSize: 10,
      search: 'developer',
      location: 'bangalore',
      jobType: JobType.FullTime,
      sortBy: 'createdAt',
      order: SortOrder.Desc
    }));
  }, []);
};
```

### Direct Service Usage (Alternative)

```typescript
import { jobService } from '@/services/job.service';

const loadJobs = async () => {
  try {
    const result = await jobService.getJobs({
      page: 1,
      pageSize: 10,
      search: 'developer'
    });
    
    console.log('Jobs:', result.items);
    console.log('Total:', result.totalCount);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 🚨 Error Handling

### HTTP Status Codes

| Code | Meaning | Frontend Handling |
|------|---------|-------------------|
| 200 | Success | Show data |
| 201 | Created | Show success message |
| 400 | Bad Request | Show validation errors |
| 401 | Unauthorized | Refresh token or redirect to login |
| 403 | Forbidden | Show "Access denied" message |
| 404 | Not Found | Show "Not found" message |
| 500 | Server Error | Show generic error message |

### Error Response Format

Backend should return errors in this format:

```json
{
  "message": "Email already exists",
  "errors": {
    "Email": ["Email is already registered"]
  }
}
```

### Frontend Error Handling

```typescript
try {
  await dispatch(createJob(data)).unwrap();
  toast.success('Job created successfully!');
} catch (error: any) {
  // Error automatically shown by axios interceptor
  console.error('Failed to create job:', error);
}
```

## 📤 File Upload

### Resume Upload Example

```typescript
const handleApply = async (jobId: string, file: File) => {
  const formData = new FormData();
  formData.append('resume', file);
  
  try {
    await jobService.applyToJob(jobId, file);
    toast.success('Application submitted!');
  } catch (error) {
    toast.error('Failed to apply');
  }
};
```

### Backend Expectation

```csharp
[HttpPost("{jobId}/apply")]
public async Task<IActionResult> Apply(
    Guid jobId, 
    IFormFile resume)
{
    // Handle file upload
}
```

## 🔍 Request/Response Examples

### Complete Job Creation Flow

**1. Frontend prepares data:**
```typescript
const formData: CreateJobRequest = {
  title: 'Full Stack Developer',
  description: 'We are looking for...',
  location: 'Bangalore',
  jobType: JobType.FullTime,
  experienceLevel: ExperienceLevel.MidLevel,
  minSalary: 80000,
  maxSalary: 150000,
  company: 'TechCorp',
  skills: 'React, Node.js, MongoDB',
  deadline: '2024-12-31'
};
```

**2. Dispatch Redux action:**
```typescript
await dispatch(createJob(formData)).unwrap();
```

**3. Service makes API call:**
```typescript
// services/job.service.ts
createJob: (data) => apiClient.post<Job>('/jobs', data)
```

**4. Axios adds auth header:**
```typescript
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**5. Backend processes:**
```csharp
[Authorize(Roles = "Recruiter")]
[HttpPost]
public async Task<IActionResult> CreateJob(CreateJobRequest request)
{
    var job = await _jobService.CreateJob(request, User.GetUserId());
    return CreatedAtAction(nameof(GetJob), new { id = job.Id }, job);
}
```

**6. Frontend receives response:**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "title": "Full Stack Developer",
  "createdAt": "2024-01-15T10:30:00Z",
  ...
}
```

**7. Redux updates state:**
```typescript
state.jobs = [action.payload, ...state.jobs];
```

**8. UI re-renders with new job**

## 🧪 Testing API Integration

### Using Browser DevTools

1. **Open Network Tab** (F12 → Network)
2. **Perform action** (e.g., login, create job)
3. **Check request:**
   - Request URL
   - Request headers (Authorization)
   - Request payload
4. **Check response:**
   - Status code
   - Response body
   - Response time

### Using Postman/Insomnia

```json
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!"
}
```

### Console Logging

```typescript
// In apiClient.ts
axios.interceptors.request.use((config) => {
  console.log('🚀 Request:', {
    url: config.url,
    method: config.method,
    data: config.data,
    headers: config.headers
  });
  return config;
});

axios.interceptors.response.use((response) => {
  console.log('✅ Response:', {
    status: response.status,
    data: response.data
  });
  return response;
});
```

## 🔒 Security Best Practices

### ✅ DO:
- Store JWT in `localStorage` (acceptable for non-sensitive apps)
- Use `httpOnly` cookies for production (more secure)
- Validate all user inputs
- Use HTTPS in production
- Implement token expiration
- Refresh tokens before expiry

### ❌ DON'T:
- Store passwords client-side
- Send sensitive data in URL params
- Trust client-side validation alone
- Use GET requests for mutations
- Expose API keys in frontend code

## 📊 API Performance Tips

### Optimize Requests
```typescript
// Bad: Multiple requests
const job1 = await jobService.getJobById(id1);
const job2 = await jobService.getJobById(id2);
const job3 = await jobService.getJobById(id3);

// Good: Batch request (if backend supports)
const jobs = await jobService.getJobs({ 
  ids: [id1, id2, id3] 
});
```

### Caching
```typescript
// Redux caches data automatically
const { jobs } = useAppSelector(state => state.jobs);

// Only fetch if not already loaded
if (jobs.length === 0) {
  dispatch(fetchJobs());
}
```

### Debounce Search
```typescript
import { debounce } from 'lodash';

const debouncedSearch = debounce((value: string) => {
  dispatch(setFilters({ search: value }));
}, 300);
```

---

## 🆘 Troubleshooting

### Problem: CORS Error
**Symptom:** "Access to XMLHttpRequest blocked by CORS policy"

**Solution:** Configure CORS in backend (see above)

### Problem: 401 Unauthorized
**Symptom:** All requests fail with 401

**Solutions:**
1. Check if token is stored: `localStorage.getItem('token')`
2. Check if token is valid (not expired)
3. Check if Authorization header is attached
4. Try logging in again

### Problem: Network Error
**Symptom:** "Network Error" or "ERR_CONNECTION_REFUSED"

**Solutions:**
1. Check if backend is running: `http://localhost:5000`
2. Check `.env` file has correct API URL
3. Check firewall settings

### Problem: 500 Internal Server Error
**Symptom:** API returns 500

**Solution:** Check backend logs and error details

---

**Happy API integration! 🚀**
