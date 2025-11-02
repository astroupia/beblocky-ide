# Student API Integration Guide

## Overview

This document provides comprehensive information about the Student module in the BeBlocky API, including all available endpoints, data structures, and integration guidelines for frontend development.

## Base URL

All student-related endpoints are prefixed with `/students`.

## Authentication

All endpoints require authentication via better-auth. Include the session token in the Authorization header:

```
Authorization: Bearer <session_token>
```

## Data Models

### Student Entity

```typescript
interface Student {
  userId: string; // String ID from better-auth
  dateOfBirth?: Date;
  grade?: number;
  gender?: Gender;
  schoolId?: ObjectId;
  parentId?: ObjectId;
  enrolledCourses: ObjectId[];
  coins: number;
  codingStreak: number;
  lastCodingActivity: Date;
  totalCoinsEarned: number;
  totalTimeSpent: number; // in minutes
  goals?: string[];
  subscription?: string;
  section?: string; // Class section (e.g., "A", "B", "1A")
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Gender Enum

```typescript
enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}
```

### Emergency Contact

```typescript
interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}
```

## API Endpoints

### 1. Create Student

**POST** `/students`

Creates a new student account.

**Request Body:**

```typescript
{
  // Required fields from CreateUserDto
  name: string;
  email: string;
  role: UserRole.STUDENT;

  // Optional student-specific fields
  dateOfBirth?: Date;
  grade?: number;
  gender?: Gender;
  schoolId?: string;
  parentId?: string;
  enrolledCourses?: string[];
  coins?: number;
  codingStreak?: number;
  lastCodingActivity?: Date;
  totalCoinsEarned?: number;
  totalTimeSpent?: number;
  goals?: string[];
  subscription?: string;
  emergencyContact?: EmergencyContact;
  section?: string;
}
```

**Response:** `StudentDocument`

**Status Codes:**

- `201` - Student created successfully
- `400` - Validation error
- `409` - Email already exists

### 2. Create Student from Existing User

**POST** `/students/from-user`

Creates a student profile for an existing better-auth user.

**Request Body:**

```typescript
{
  userId: string; // The existing better-auth user ID

  // Optional student-specific fields
  dateOfBirth?: Date;
  grade?: number;
  gender?: Gender;
  schoolId?: string;
  parentId?: string;
  enrolledCourses?: string[];
  coins?: number;
  codingStreak?: number;
  lastCodingActivity?: Date;
  totalCoinsEarned?: number;
  totalTimeSpent?: number;
  goals?: string[];
  subscription?: string;
  emergencyContact?: EmergencyContact;
  section?: string;
}
```

**Response:** `StudentDocument` (includes user information)

**Status Codes:**

- `201` - Student profile created successfully
- `200` - Student profile already exists (returns existing)
- `400` - Validation error

### 3. Get All Students

**GET** `/students`

Retrieves all students with optional filtering and pagination.

**Query Parameters:**

- None currently supported

**Response:** `StudentDocument[]`

**Status Codes:**

- `200` - Students retrieved successfully

### 4. Get Student by ID

**GET** `/students/:id`

Retrieves a specific student by their ID.

**Path Parameters:**

- `id` (string) - Student ID

**Response:** `StudentDocument`

**Status Codes:**

- `200` - Student found
- `404` - Student not found

### 5. Update Student

**PATCH** `/students/:id`

Updates student information.

**Path Parameters:**

- `id` (string) - Student ID

**Request Body:** Partial update of student fields

**Response:** `StudentDocument`

**Status Codes:**

- `200` - Student updated successfully
- `404` - Student not found
- `400` - Validation error

### 6. Delete Student

**DELETE** `/students/:id`

Deletes a student account.

**Path Parameters:**

- `id` (string) - Student ID

**Response:** `void`

**Status Codes:**

- `200` - Student deleted successfully
- `404` - Student not found

### 7. Enroll in Course

**POST** `/students/:id/enroll/:courseId`

Enrolls a student in a specific course.

**Path Parameters:**

- `id` (string) - Student ID
- `courseId` (string) - Course ID

**Response:** `StudentDocument`

**Status Codes:**

- `200` - Enrollment successful
- `404` - Student not found

### 8. Unenroll from Course

**POST** `/students/:id/unenroll/:courseId`

Removes a student from a specific course.

**Path Parameters:**

- `id` (string) - Student ID
- `courseId` (string) - Course ID

**Response:** `StudentDocument`

**Status Codes:**

- `200` - Unenrollment successful
- `404` - Student not found

### 9. Add Coins

**POST** `/students/:id/coins`

Adds coins to a student's account.

**Path Parameters:**

- `id` (string) - Student ID

**Request Body:**

```typescript
{
  amount: number; // Amount of coins to add
}
```

**Response:** `StudentDocument`

**Status Codes:**

- `200` - Coins added successfully
- `404` - Student not found

### 10. Add Goal

**POST** `/students/:id/goals`

Adds a learning goal to a student's profile.

**Path Parameters:**

- `id` (string) - Student ID

**Request Body:**

```typescript
{
  goal: string; // The goal text
}
```

**Response:** `StudentDocument`

**Status Codes:**

- `200` - Goal added successfully
- `404` - Student not found

### 11. Get Coding Streak

**GET** `/students/:id/streak`

Retrieves a student's current coding streak.

**Path Parameters:**

- `id` (string) - Student ID

**Response:**

```typescript
{
  codingStreak: number;
}
```

**Status Codes:**

- `200` - Streak retrieved successfully
- `404` - Student not found

### 12. Update Coding Activity

**PATCH** `/students/:id/activity`

Updates the student's coding streak based on recent activity.

**Path Parameters:**

- `id` (string) - Student ID

**Response:** `StudentDocument`

**Status Codes:**

- `200` - Activity updated successfully
- `404` - Student not found

### 13. Get Total Coins Earned

**GET** `/students/:id/coins/total`

Retrieves the total coins earned by a student across all courses.

**Path Parameters:**

- `id` (string) - Student ID

**Response:**

```typescript
{
  totalCoinsEarned: number;
}
```

**Status Codes:**

- `200` - Total retrieved successfully
- `404` - Student not found

### 14. Add Coins and Update Total

**POST** `/students/:id/coins/add`

Adds coins to a student and updates their total earned coins.

**Path Parameters:**

- `id` (string) - Student ID

**Request Body:**

```typescript
{
  amount: number; // Amount of coins to add
}
```

**Response:** `StudentDocument`

**Status Codes:**

- `200` - Coins added and total updated
- `404` - Student not found

### 15. Update Total Time Spent

**PATCH** `/students/:id/time-spent`

Updates the total time spent by a student on learning activities.

**Path Parameters:**

- `id` (string) - Student ID

**Request Body:**

```typescript
{
  minutes: number; // Minutes to add to total time spent
}
```

**Response:** `StudentDocument`

**Status Codes:**

- `200` - Time updated successfully
- `404` - Student not found

### 16. Find Student by Email

**GET** `/students/email/:email`

Finds a student by their email address.

**Path Parameters:**

- `email` (string) - Student email

**Response:** `StudentDocument`

**Status Codes:**

- `200` - Student found
- `404` - Student not found

### 17. Find Student by User ID

**GET** `/students/user/:userId`

Finds a student by their better-auth user ID.

**Path Parameters:**

- `userId` (string) - Better-auth user ID

**Response:** `StudentDocument`

**Status Codes:**

- `200` - Student found
- `404` - Student not found

### 18. Find Students by Parent ID

**GET** `/students/parent/:parentId`

Finds all students associated with a specific parent.

**Path Parameters:**

- `parentId` (string) - Parent user ID

**Response:** `StudentDocument[]`

**Status Codes:**

- `200` - Students found
- `404` - No students found for this parent

## Response DTOs

### StudentResponseDto

```typescript
{
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string;
  role: string;
  dateOfBirth?: Date;
  grade?: number;
  gender?: Gender;
  schoolId?: ObjectId;
  parentId?: ObjectId;
  enrolledCourses: ObjectId[];
  coins: number;
  codingStreak: number;
  lastCodingActivity?: Date;
  totalCoinsEarned: number;
  totalTimeSpent: number;
  goals?: string[];
  subscription?: string;
  emergencyContact?: EmergencyContact;
  createdAt: Date;
  updatedAt: Date;
}
```

### StudentStatsResponseDto

```typescript
{
  totalCoinsEarned: number;
  codingStreak: number;
  totalTimeSpent: number;
  enrolledCoursesCount: number;
  currentCoins: number;
}
```

### StudentEnrollmentResponseDto

```typescript
{
  studentId: string;
  courseId: string;
  enrolled: boolean;
  message: string;
}
```

### StudentCoinsResponseDto

```typescript
{
  studentId: string;
  previousCoins: number;
  addedCoins: number;
  newTotal: number;
  totalCoinsEarned: number;
}
```

## Error Handling

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate data)

### Error Response Format

```typescript
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Integration Examples

### JavaScript/TypeScript Frontend Integration

```typescript
// Example API client for student operations
class StudentAPI {
  private baseURL = "/students";
  private headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${this.getAuthToken()}`,
  };

  async createStudent(studentData: CreateStudentDto) {
    const response = await fetch(`${this.baseURL}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(studentData),
    });
    return response.json();
  }

  async getStudentById(studentId: string) {
    const response = await fetch(`${this.baseURL}/${studentId}`, {
      headers: this.headers,
    });
    return response.json();
  }

  async enrollInCourse(studentId: string, courseId: string) {
    const response = await fetch(
      `${this.baseURL}/${studentId}/enroll/${courseId}`,
      {
        method: "POST",
        headers: this.headers,
      }
    );
    return response.json();
  }

  async addCoins(studentId: string, amount: number) {
    const response = await fetch(`${this.baseURL}/${studentId}/coins`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ amount }),
    });
    return response.json();
  }

  async updateCodingActivity(studentId: string) {
    const response = await fetch(`${this.baseURL}/${studentId}/activity`, {
      method: "PATCH",
      headers: this.headers,
    });
    return response.json();
  }

  private getAuthToken(): string {
    // Get token from your auth system
    return localStorage.getItem("authToken") || "";
  }
}
```

### React Hook Example

```typescript
import { useState, useEffect } from "react";

interface UseStudentResult {
  student: Student | null;
  loading: boolean;
  error: string | null;
  updateStudent: (data: Partial<Student>) => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  addCoins: (amount: number) => Promise<void>;
}

export function useStudent(studentId: string): UseStudentResult {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudent();
  }, [studentId]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      const data = await response.json();
      setStudent(data);
    } catch (err) {
      setError("Failed to fetch student data");
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (data: Partial<Student>) => {
    try {
      const response = await fetch(`/students/${studentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(data),
      });
      const updated = await response.json();
      setStudent(updated);
    } catch (err) {
      setError("Failed to update student");
    }
  };

  const enrollInCourse = async (courseId: string) => {
    try {
      await fetch(`/students/${studentId}/enroll/${courseId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      // Refresh student data to show updated enrolled courses
      await fetchStudent();
    } catch (err) {
      setError("Failed to enroll in course");
    }
  };

  const addCoins = async (amount: number) => {
    try {
      await fetch(`/students/${studentId}/coins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ amount }),
      });
      // Refresh student data to show updated coins
      await fetchStudent();
    } catch (err) {
      setError("Failed to add coins");
    }
  };

  return {
    student,
    loading,
    error,
    updateStudent,
    enrollInCourse,
    addCoins,
  };
}
```

## Business Logic Notes

### Automatic Subscription Creation

When creating a student from an existing user (`POST /students/from-user`), the system automatically creates a free tier subscription with the following features:

- Plan: FREE
- Duration: 1 year
- Features: Basic access, Limited courses, Community support, Student learning tools, Progress tracking

### Coding Streak Calculation

The coding streak is automatically calculated based on the `lastCodingActivity` date:

- Same day activity: No streak change
- Consecutive day activity: Increment streak
- Non-consecutive activity: Reset streak to 1

### Coins Management

Students have two coin-related fields:

- `coins`: Current spendable coins
- `totalCoinsEarned`: Lifetime coins earned across all activities

## Dependencies

### Module Dependencies

The Student module depends on:

- **UserModule**: For user management and authentication
- **SubscriptionModule**: For subscription management

### Database Indexes

- Unique index on `userId` to prevent duplicate student profiles per user

## Validation Rules

All DTOs use class-validator decorators for validation:

- **Required fields**: `@IsNotEmpty()`, `@IsString()`, etc.
- **Optional fields**: `@IsOptional()`
- **Email format**: `@IsEmail()`
- **ObjectId validation**: `@IsObjectId()`
- **Enum validation**: `@IsEnum(Gender)`
- **Date validation**: `@IsDate()`, `@Type(() => Date)`
- **Nested validation**: `@ValidateNested()`, `@Type()`

## Best Practices

### Frontend Integration

1. **Error Handling**: Always handle 404 errors when fetching specific students
2. **Optimistic Updates**: Consider implementing optimistic UI updates for better UX
3. **Loading States**: Show loading indicators during API calls
4. **Data Synchronization**: Refresh student data after mutations that affect their state
5. **Authentication**: Ensure auth tokens are properly managed and refreshed

### API Usage

1. **Batch Operations**: Use appropriate endpoints for bulk operations when available
2. **Caching**: Consider caching student data that doesn't change frequently
3. **Real-time Updates**: Consider WebSocket integration for real-time streak and coin updates
4. **Validation**: Validate data on frontend before sending to API
5. **TypeScript**: Use the provided DTOs and interfaces for type safety

## Troubleshooting

### Common Issues

1. **404 Errors**: Verify the student ID exists and the user has permission to access it
2. **Validation Errors**: Check that all required fields are provided and properly formatted
3. **Authentication Errors**: Ensure the auth token is valid and not expired
4. **Duplicate Users**: Use the `/from-user` endpoint to handle existing better-auth users

### Support

For technical support or questions about the Student API integration, refer to the development team or check the API documentation repository.
