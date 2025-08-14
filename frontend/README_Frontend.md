# 🌐 EcoWaste Management Frontend

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-cyan.svg)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.23+-pink.svg)](https://www.framer.com/motion/)

> **Modern, responsive React frontend for the EcoWaste Management platform featuring cutting-edge UI/UX, real-time data visualization, and seamless user experience.**

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🛠️ Technology Stack](#️-technology-stack)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🔧 Configuration](#-configuration)
- [🎨 UI Components](#-ui-components)
- [🔄 State Management](#-state-management)
- [🌐 API Integration](#-api-integration)
- [🎭 Theming & Styling](#-theming--styling)
- [📱 Responsive Design](#-responsive-design)
- [🧪 Testing](#-testing)
- [🚢 Deployment](#-deployment)
- [🔧 Development Tools](#-development-tools)
- [🤝 Contributing](#-contributing)

## 🌟 Features

### 🎯 **Core Application Features**
- **🏠 Dashboard** - Comprehensive waste management analytics and insights
- **🔐 Authentication** - Secure login/register with JWT token management
- **👤 User Profiles** - Complete user profile management and settings
- **🛒 Marketplace** - Browse, search, and purchase recyclable materials
- **📚 Educational Hub** - Interactive learning modules and progress tracking
- **📊 Analytics** - Real-time data visualization and reporting
- **🔔 Notifications** - Toast notifications and real-time updates

### 🖥️ **Technical Features**
- **⚡ Lightning Fast** - Vite-powered development with HMR
- **📱 Fully Responsive** - Mobile-first design with Tailwind CSS
- **🎨 Modern UI** - Beautiful components with Framer Motion animations
- **🔒 Type Safe** - Full TypeScript integration with strict typing
- **♿ Accessible** - WCAG compliant with proper ARIA attributes
- **🌙 Dark Mode** - Built-in theme switching capability
- **🔄 Real-time** - Live data updates and synchronization
- **📈 Performance** - Optimized bundle size and lazy loading

## 🚀 Quick Start

### **Prerequisites**
- **Node.js 18+** (LTS recommended)
- **npm 8+** or **yarn 1.22+**

### **⚡ One-Command Setup**
```bash
# Install dependencies and start development server
npm install && npm run dev
```

**🎉 Your app will be running at:** http://localhost:5173

### **🔗 Connect to Backend**
Make sure your backend services are running:
```bash
# In the backend directory
cd ../backend && npm run dev:backend
```

## 📁 Project Structure

```
frontend/
├── 📁 public/                     # Static assets
│   ├── 📄 favicon.ico            # App favicon
│   ├── 📄 logo192.png            # App logo (192x192)
│   └── 📄 manifest.json          # PWA manifest
│
├── 📁 src/                       # Source code
│   ├── 📁 components/            # Reusable UI components
│   │   ├── 📁 ui/                # Base UI components
│   │   │   ├── 📄 Button.tsx     # Button component
│   │   │   ├── 📄 Input.tsx      # Input component
│   │   │   ├── 📄 Modal.tsx      # Modal component
│   │   │   ├── 📄 Card.tsx       # Card component
│   │   │   └── 📄 index.ts       # Component exports
│   │   ├── 📁 forms/             # Form components
│   │   │   ├── 📄 LoginForm.tsx  # Login form
│   │   │   ├── 📄 RegisterForm.tsx # Registration form
│   │   │   └── 📄 ProfileForm.tsx # Profile form
│   │   ├── 📁 layout/            # Layout components
│   │   │   ├── 📄 Header.tsx     # App header
│   │   │   ├── 📄 Sidebar.tsx    # Navigation sidebar
│   │   │   ├── 📄 Footer.tsx     # App footer
│   │   │   └── 📄 Layout.tsx     # Main layout wrapper
│   │   └── 📁 charts/            # Data visualization components
│   │       ├── 📄 WasteChart.tsx # Waste analytics chart
│   │       └── 📄 ProgressChart.tsx # Progress tracking chart
│   │
│   ├── 📁 pages/                 # Application pages
│   │   ├── 📄 Home.tsx           # Landing page
│   │   ├── 📄 Dashboard.tsx      # Main dashboard
│   │   ├── 📄 Login.tsx          # Login page
│   │   ├── 📄 Register.tsx       # Registration page
│   │   ├── 📄 Profile.tsx        # User profile page
│   │   ├── 📄 Marketplace.tsx    # Marketplace page
│   │   ├── 📄 Education.tsx      # Educational hub
│   │   └── 📄 NotFound.tsx       # 404 error page
│   │
│   ├── 📁 contexts/              # React contexts
│   │   ├── 📄 AuthContext.tsx    # Authentication context
│   │   ├── 📄 ThemeContext.tsx   # Theme management context
│   │   └── 📄 NotificationContext.tsx # Notification context
│   │
│   ├── 📁 hooks/                 # Custom React hooks
│   │   ├── 📄 useAuth.ts         # Authentication hook
│   │   ├── 📄 useApi.ts          # API calling hook
│   │   ├── 📄 useLocalStorage.ts # Local storage hook
│   │   ├── 📄 useDebounce.ts     # Debounce hook
│   │   └── 📄 useTheme.ts        # Theme switching hook
│   │
│   ├── 📁 services/              # API service layer
│   │   ├── 📄 api.ts             # Base API configuration
│   │   ├── 📄 authService.ts     # Authentication API calls
│   │   ├── 📄 userService.ts     # User management API calls
│   │   ├── 📄 marketplaceService.ts # Marketplace API calls
│   │   └── 📄 educationService.ts # Education API calls
│   │
│   ├── 📁 utils/                 # Utility functions
│   │   ├── 📄 constants.ts       # App constants
│   │   ├── 📄 helpers.ts         # Helper functions
│   │   ├── 📄 validators.ts      # Form validation utilities
│   │   ├── 📄 formatters.ts      # Data formatting utilities
│   │   └── 📄 storage.ts         # Storage utilities
│   │
│   ├── 📁 lib/                   # Third-party library configurations
│   │   ├── 📄 axios.ts           # Axios configuration
│   │   ├── 📄 zod.ts             # Zod schema definitions
│   │   └── 📄 framer.ts          # Framer Motion configurations
│   │
│   ├── 📁 styles/                # Global styles
│   │   ├── 📄 globals.css        # Global CSS styles
│   │   ├── 📄 components.css     # Component-specific styles
│   │   └── 📄 animations.css     # Animation definitions
│   │
│   ├── 📁 types/                 # TypeScript type definitions
│   │   ├── 📄 auth.ts            # Authentication types
│   │   ├── 📄 user.ts            # User-related types
│   │   ├── 📄 marketplace.ts     # Marketplace types
│   │   ├── 📄 education.ts       # Education types
│   │   └── 📄 api.ts             # API response types
│   │
│   ├── 📄 App.tsx                # Main App component
│   ├── 📄 main.tsx               # Application entry point
│   └── 📄 vite-env.d.ts          # Vite environment types
│
├── 📄 package.json               # Dependencies and scripts
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 tsconfig.app.json          # App-specific TypeScript config
├── 📄 tsconfig.node.json         # Node-specific TypeScript config
├── 📄 vite.config.ts             # Vite configuration
├── 📄 tailwind.config.js         # Tailwind CSS configuration
├── 📄 postcss.config.js          # PostCSS configuration
├── 📄 eslint.config.js           # ESLint configuration
├── 📄 .env.example               # Environment variables template
└── 📄 README_Frontend.md         # This file
```

## 🛠️ Technology Stack

### **Core Framework & Language**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI library with latest features |
| **TypeScript** | 5.0+ | Type safety and developer experience |
| **Vite** | Latest | Lightning-fast build tool and dev server |

### **Styling & UI**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 4.0 | Utility-first CSS framework |
| **Framer Motion** | 12.23+ | Smooth animations and transitions |
| **Lucide React** | Latest | Beautiful, customizable icons |
| **Heroicons** | 2.2+ | Additional icon set |

### **Form Management & Validation**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React Hook Form** | 7.62+ | Performant form management |
| **Zod** | 4.0+ | Schema validation and type inference |
| **@hookform/resolvers** | 5.2+ | Form validation integration |

### **State Management & API**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React Context** | Built-in | Global state management |
| **Axios** | 1.11+ | HTTP client for API calls |
| **React Hot Toast** | 2.5+ | Beautiful toast notifications |

### **Routing & Navigation**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React Router DOM** | 7.8+ | Client-side routing |

### **Development Tools**
| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | 9.33+ | Code linting and quality |
| **Prettier** | Latest | Code formatting |
| **PostCSS** | Latest | CSS processing |

## ⚙️ Installation & Setup

### **1. Clone & Navigate**
```bash
git clone https://github.com/faraz66/WasteManagement.git
cd WasteManagement/frontend
```

### **2. Install Dependencies**
```bash
# Using npm
npm install

# Using yarn
yarn install
```

### **3. Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### **4. Start Development Server**
```bash
# Start with hot reload
npm run dev

# Start with network access
npm run dev -- --host
```

## 🔧 Configuration

### **Environment Variables** (`.env`)
```bash
# Backend API URLs
VITE_USER_SERVICE_URL=http://localhost:3001
VITE_MARKETPLACE_SERVICE_URL=http://localhost:3002
VITE_EDUCATION_SERVICE_URL=http://localhost:3003

# Application Configuration
VITE_APP_NAME=EcoWaste Management
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Sustainable waste management platform

# Feature Flags
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=true

# External Services (Optional)
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_SENTRY_DSN=your_sentry_dsn
```

### **Vite Configuration** (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

## 🎨 UI Components

### **Base Components**
Our UI component library includes:

```typescript
// Button Component Example
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  onClick,
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200'
  const variantClasses = {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'hover:bg-gray-100 text-gray-700'
  }
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner /> : children}
    </button>
  )
}
```

### **Component Categories**
- **📝 Forms** - Input, Select, Textarea, Checkbox, Radio
- **📊 Data Display** - Table, Card, Badge, Avatar, Progress
- **🔔 Feedback** - Alert, Toast, Modal, Tooltip, Loading
- **🧭 Navigation** - Breadcrumb, Pagination, Tabs, Menu
- **📱 Layout** - Container, Grid, Stack, Divider

## 🔄 State Management

### **Authentication Context**
```typescript
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await authService.login({ email, password })
      setUser(response.data.user)
      setToken(response.data.token)
      localStorage.setItem('token', response.data.token)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      loading,
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  )
}
```

## 🌐 API Integration

### **API Service Layer**
```typescript
// services/api.ts
import axios from 'axios'

const createApiClient = (baseURL: string) => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor for auth token
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )

  return client
}

export const userApi = createApiClient(import.meta.env.VITE_USER_SERVICE_URL)
export const marketplaceApi = createApiClient(import.meta.env.VITE_MARKETPLACE_SERVICE_URL)
export const educationApi = createApiClient(import.meta.env.VITE_EDUCATION_SERVICE_URL)
```

## 🎭 Theming & Styling

### **Tailwind Configuration**
```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### **Dark Mode Implementation**
```typescript
// hooks/useTheme.ts
export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return { theme, toggleTheme }
}
```

## 📱 Responsive Design

### **Breakpoint System**
```css
/* Mobile First Approach */
.container {
  @apply px-4;          /* Mobile: 16px padding */
}

@screen sm {            /* 640px+ */
  .container {
    @apply px-6;        /* Tablet: 24px padding */
  }
}

@screen lg {            /* 1024px+ */
  .container {
    @apply px-8;        /* Desktop: 32px padding */
  }
}

@screen xl {            /* 1280px+ */
  .container {
    @apply px-12;       /* Large Desktop: 48px padding */
  }
}
```

### **Responsive Components**
```typescript
// Responsive Grid Component
const ResponsiveGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
    {children}
  </div>
)
```

## 🧪 Testing

### **Testing Setup**
```bash
# Install testing dependencies
npm install -D @testing-library/react @testing-library/jest-dom vitest jsdom

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### **Example Component Test**
```typescript
// components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../ui/Button'

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  test('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('shows loading state', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

## 🚢 Deployment

### **Build for Production**
```bash
# Create production build
npm run build

# Preview production build locally
npm run preview

# Analyze bundle size
npm run build -- --analyze
```

### **Deployment Options**

#### **Netlify Deployment**
```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables (set in Netlify dashboard)
VITE_USER_SERVICE_URL=https://your-api.com
VITE_MARKETPLACE_SERVICE_URL=https://your-api.com
VITE_EDUCATION_SERVICE_URL=https://your-api.com
```

#### **Vercel Deployment**
```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 🔧 Development Tools

### **Available Scripts**
```json
{
  "scripts": {
    "dev": "vite",                    // Start development server
    "build": "tsc -b && vite build", // Build for production
    "preview": "vite preview",        // Preview production build
    "lint": "eslint .",              // Run ESLint
    "lint:fix": "eslint . --fix",    // Fix ESLint issues
    "type-check": "tsc --noEmit",    // Type checking only
    "test": "vitest",                // Run tests
    "test:coverage": "vitest --coverage" // Run tests with coverage
  }
}
```

### **VS Code Extensions**
Recommended extensions for optimal development experience:
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Importer**
- **Auto Rename Tag**
- **Prettier - Code formatter**
- **ESLint**

## 🤝 Contributing

### **Development Workflow**

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/frontend-feature`
3. **Make** your changes following the coding standards
4. **Write** tests for new components/features
5. **Run** tests and linting: `npm run test && npm run lint`
6. **Commit** changes: `git commit -m 'Add frontend feature'`
7. **Push** to branch: `git push origin feature/frontend-feature`
8. **Create** a Pull Request

### **Coding Standards**

- **TypeScript** - Use strict typing, avoid `any`
- **Components** - Use functional components with hooks
- **Styling** - Use Tailwind CSS classes, avoid inline styles
- **File Naming** - Use PascalCase for components, camelCase for utilities
- **Imports** - Use absolute imports with path aliases
- **Testing** - Write tests for all new components and utilities

### **Code Review Checklist**

- [ ] Components are properly typed with TypeScript
- [ ] All props have proper interfaces/types
- [ ] Components are responsive and accessible
- [ ] Tests are written and passing
- [ ] ESLint and Prettier rules are followed
- [ ] No console.log statements in production code
- [ ] Error boundaries are implemented where needed
- [ ] Performance optimizations are considered (memo, useMemo, useCallback)

---

<div align="center">

**🌐 Built with React & TypeScript for modern web experiences**

[Main README](../README.md) • [Backend README](../backend/README_Backend.md) • [Live Demo](https://ecowaste-demo.netlify.app)

</div>
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
