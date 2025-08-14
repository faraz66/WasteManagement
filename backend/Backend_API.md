# 🚀 EcoWaste Management Backend API Documentation

[![API Version](https://img.shields.io/badge/API%20Version-v1.0-blue.svg)](https://api.ecowaste.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)

> **Complete API reference for all EcoWaste Management backend microservices with detailed endpoints, request/response examples, and authentication requirements.**

## 📋 Table of Contents

- [🔐 Authentication](#-authentication)
- [👤 User Service API](#-user-service-api)
- [🛒 Marketplace Service API](#-marketplace-service-api)
- [📚 Educational Service API](#-educational-service-api)
- [📊 Response Format](#-response-format)
- [⚠️ Error Handling](#️-error-handling)
- [🔑 Authentication Headers](#-authentication-headers)

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Base URLs
- **User Service**: `http://localhost:3001/api`
- **Marketplace Service**: `http://localhost:3002/api`
- **Educational Service**: `http://localhost:3003/api`

---

## 👤 User Service API

### Authentication Endpoints

#### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isActive": true,
      "emailVerified": false,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST `/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

#### POST `/auth/refresh`
Refresh JWT token.

**Headers:** `Authorization: Bearer <current-token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

#### POST `/auth/logout`
Logout user and invalidate token.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### POST `/auth/forgot-password`
Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

#### POST `/auth/reset-password`
Reset password with token.

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newSecurePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

### User Management Endpoints

#### GET `/users`
Get all users (Admin only).

**Headers:** `Authorization: Bearer <admin-token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or email

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "user",
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```

#### GET `/users/:id`
Get user by ID.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "profile": {
        "phone": "+1234567890",
        "address": "123 Main St",
        "city": "New York",
        "country": "USA",
        "bio": "Environmental enthusiast"
      }
    }
  }
}
```

#### PUT `/users/:id`
Update user information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890",
  "address": "456 Oak Ave",
  "city": "Los Angeles",
  "country": "USA",
  "bio": "Updated bio"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Smith",
      "updatedAt": "2024-01-15T11:30:00Z"
    }
  }
}
```

#### DELETE `/users/:id`
Delete user (Admin only).

**Headers:** `Authorization: Bearer <admin-token>`

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### GET `/users/profile`
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "profile": {
        "phone": "+1234567890",
        "address": "123 Main St",
        "city": "New York",
        "country": "USA",
        "avatarUrl": "https://example.com/avatar.jpg",
        "bio": "Environmental enthusiast"
      }
    }
  }
}
```

#### PUT `/users/profile`
Update current user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890",
  "address": "456 Oak Ave",
  "city": "Los Angeles",
  "bio": "Updated bio"
}
```

---

## 🛒 Marketplace Service API

### Product Endpoints

#### GET `/products`
Get all products with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)
- `category` (optional): Filter by category ID
- `search` (optional): Search in title and description
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `condition` (optional): Filter by condition (new, used, refurbished)
- `location` (optional): Filter by location
- `sortBy` (optional): Sort by (price, date, title)
- `sortOrder` (optional): Sort order (asc, desc)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "title": "Recycled Plastic Bottles",
        "description": "High-quality recycled plastic bottles for crafting",
        "price": 25.99,
        "condition": "used",
        "location": "New York, NY",
        "images": [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg"
        ],
        "category": {
          "id": 1,
          "name": "Plastic",
          "icon": "recycle"
        },
        "seller": {
          "id": 2,
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "status": "active",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 8,
      "totalItems": 95,
      "itemsPerPage": 12
    }
  }
}
```

#### POST `/products`
Create a new product listing.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Recycled Glass Jars",
  "description": "Beautiful recycled glass jars perfect for storage",
  "price": 15.50,
  "condition": "used",
  "location": "San Francisco, CA",
  "categoryId": 2,
  "images": [
    "https://example.com/jar1.jpg",
    "https://example.com/jar2.jpg"
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": {
      "id": 25,
      "title": "Recycled Glass Jars",
      "description": "Beautiful recycled glass jars perfect for storage",
      "price": 15.50,
      "condition": "used",
      "location": "San Francisco, CA",
      "sellerId": 1,
      "categoryId": 2,
      "status": "active",
      "createdAt": "2024-01-15T12:00:00Z"
    }
  }
}
```

#### GET `/products/:id`
Get product details by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "title": "Recycled Plastic Bottles",
      "description": "High-quality recycled plastic bottles for crafting",
      "price": 25.99,
      "condition": "used",
      "location": "New York, NY",
      "images": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
      ],
      "category": {
        "id": 1,
        "name": "Plastic",
        "description": "Plastic recyclable materials",
        "icon": "recycle"
      },
      "seller": {
        "id": 2,
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@example.com",
        "phone": "+1234567890"
      },
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### PUT `/products/:id`
Update product (Owner or Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated Recycled Plastic Bottles",
  "description": "Updated description",
  "price": 29.99,
  "condition": "refurbished",
  "location": "Brooklyn, NY"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "product": {
      "id": 1,
      "title": "Updated Recycled Plastic Bottles",
      "price": 29.99,
      "updatedAt": "2024-01-15T13:00:00Z"
    }
  }
}
```

#### DELETE `/products/:id`
Delete product (Owner or Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

#### GET `/products/search`
Search products with advanced filters.

**Query Parameters:**
- `q`: Search query
- `category`: Category filter
- `minPrice`, `maxPrice`: Price range
- `condition`: Condition filter
- `location`: Location filter

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "totalResults": 15,
    "searchQuery": "plastic bottles",
    "filters": {
      "category": "Plastic",
      "priceRange": "10-50",
      "condition": "used"
    }
  }
}
```

### Category Endpoints

#### GET `/categories`
Get all product categories.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Plastic",
        "description": "Plastic recyclable materials",
        "icon": "recycle",
        "productCount": 45,
        "createdAt": "2024-01-01T00:00:00Z"
      },
      {
        "id": 2,
        "name": "Glass",
        "description": "Glass recyclable materials",
        "icon": "glass",
        "productCount": 23,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### POST `/categories`
Create new category (Admin only).

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "name": "Metal",
  "description": "Metal recyclable materials",
  "icon": "metal"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "category": {
      "id": 3,
      "name": "Metal",
      "description": "Metal recyclable materials",
      "icon": "metal",
      "createdAt": "2024-01-15T14:00:00Z"
    }
  }
}
```

### Transaction Endpoints

#### GET `/transactions`
Get user transactions.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status (pending, completed, cancelled)
- `type` (optional): Filter by type (buy, sell)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": 1,
        "productId": 5,
        "buyerId": 1,
        "sellerId": 2,
        "amount": 25.99,
        "status": "completed",
        "product": {
          "title": "Recycled Plastic Bottles",
          "images": ["https://example.com/image1.jpg"]
        },
        "createdAt": "2024-01-15T10:30:00Z",
        "completedAt": "2024-01-15T11:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25
    }
  }
}
```

#### POST `/transactions`
Create new transaction.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": 5,
  "amount": 25.99
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "transaction": {
      "id": 15,
      "productId": 5,
      "buyerId": 1,
      "sellerId": 2,
      "amount": 25.99,
      "status": "pending",
      "createdAt": "2024-01-15T15:00:00Z"
    }
  }
}
```

---

## 📚 Educational Service API

### Course Endpoints

#### GET `/courses`
Get all available courses.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `difficulty` (optional): Filter by difficulty (beginner, intermediate, advanced)
- `published` (optional): Filter published courses (default: true)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": 1,
        "title": "Introduction to Recycling",
        "description": "Learn the basics of recycling and waste management",
        "instructor": "Dr. Sarah Green",
        "durationHours": 4,
        "difficultyLevel": "beginner",
        "thumbnailUrl": "https://example.com/course1.jpg",
        "lessonsCount": 8,
        "enrolledCount": 245,
        "rating": 4.8,
        "isPublished": true,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 4,
      "totalItems": 35
    }
  }
}
```

#### POST `/courses`
Create new course (Admin only).

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "title": "Advanced Composting Techniques",
  "description": "Master advanced composting methods for maximum efficiency",
  "instructor": "Prof. Mike Brown",
  "durationHours": 6,
  "difficultyLevel": "advanced",
  "thumbnailUrl": "https://example.com/course-thumb.jpg"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "course": {
      "id": 12,
      "title": "Advanced Composting Techniques",
      "description": "Master advanced composting methods for maximum efficiency",
      "instructor": "Prof. Mike Brown",
      "durationHours": 6,
      "difficultyLevel": "advanced",
      "isPublished": false,
      "createdAt": "2024-01-15T16:00:00Z"
    }
  }
}
```

#### GET `/courses/:id`
Get course details with lessons.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "course": {
      "id": 1,
      "title": "Introduction to Recycling",
      "description": "Learn the basics of recycling and waste management",
      "instructor": "Dr. Sarah Green",
      "durationHours": 4,
      "difficultyLevel": "beginner",
      "thumbnailUrl": "https://example.com/course1.jpg",
      "lessons": [
        {
          "id": 1,
          "title": "What is Recycling?",
          "durationMinutes": 30,
          "orderIndex": 1
        },
        {
          "id": 2,
          "title": "Types of Recyclable Materials",
          "durationMinutes": 45,
          "orderIndex": 2
        }
      ],
      "enrolledCount": 245,
      "rating": 4.8,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### Lesson Endpoints

#### GET `/lessons/:id`
Get lesson content.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "lesson": {
      "id": 1,
      "title": "What is Recycling?",
      "content": "Recycling is the process of converting waste materials into new materials and objects...",
      "videoUrl": "https://example.com/lesson1-video.mp4",
      "durationMinutes": 30,
      "orderIndex": 1,
      "course": {
        "id": 1,
        "title": "Introduction to Recycling"
      }
    }
  }
}
```

#### POST `/lessons`
Create new lesson (Admin only).

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "courseId": 1,
  "title": "Recycling Best Practices",
  "content": "In this lesson, we'll cover the best practices for effective recycling...",
  "videoUrl": "https://example.com/lesson-video.mp4",
  "durationMinutes": 35,
  "orderIndex": 3
}
```

### Progress Tracking Endpoints

#### GET `/progress`
Get user's learning progress.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "progress": [
      {
        "courseId": 1,
        "courseTitle": "Introduction to Recycling",
        "totalLessons": 8,
        "completedLessons": 5,
        "progressPercentage": 62,
        "lastAccessedAt": "2024-01-15T14:30:00Z"
      }
    ],
    "overallStats": {
      "totalCoursesEnrolled": 3,
      "totalCoursesCompleted": 1,
      "totalHoursLearned": 12.5
    }
  }
}
```

#### POST `/progress`
Update learning progress.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "lessonId": 3,
  "completed": true,
  "progressPercentage": 75
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Progress updated successfully",
  "data": {
    "progress": {
      "lessonId": 3,
      "completed": true,
      "progressPercentage": 75,
      "completedAt": "2024-01-15T17:00:00Z"
    }
  }
}
```

---

## 📊 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error - Server error |

### Common Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `AUTHENTICATION_REQUIRED` | JWT token required |
| `INVALID_TOKEN` | JWT token is invalid or expired |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `RESOURCE_NOT_FOUND` | Requested resource doesn't exist |
| `DUPLICATE_RESOURCE` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |

---

## 🔑 Authentication Headers

### Required Headers for Protected Endpoints

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Optional Headers

```http
X-Request-ID: unique-request-identifier
X-Client-Version: 1.0.0
Accept-Language: en-US
```

---

<div align="center">

**🚀 EcoWaste Management Backend API v1.0**

[Main README](../README.md) • [Backend README](./README_Backend.md) • [Frontend API](../frontend/API.md)

</div>
