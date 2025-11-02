# Progress-Course Integration Feature

## Overview

When a new progress record is created for a student-course pair, the system automatically adds the student to the course's `students` array. This ensures that courses maintain an up-to-date list of all students who have started or are actively learning the course.

## How It Works

### 1. **Progress Creation Trigger**

- When `POST /progress` is called with a new student-course pair
- The system creates a progress record for tracking learning progress
- **Automatically** adds the student to the course's `students` array

### 2. **Duplicate Prevention**

- If a student is already in the course's students array, no duplicate is added
- Uses MongoDB's `$addToSet` operator to ensure uniqueness
- Progress creation is prevented if a progress record already exists for the student-course pair

### 3. **Error Handling**

- If adding the student to the course fails, progress creation still succeeds
- Errors are logged but don't break the progress creation process
- This ensures data consistency and prevents partial failures

## Implementation Details

### Course Repository (`src/course/repositories/course.repository.ts`)

Added `addStudent` method:

```typescript
async addStudent(courseId: string, studentId: string): Promise<CourseDocument> {
  const course = await this.courseModel.findById(courseId).exec();
  if (!course) {
    throw new NotFoundException(`Course with ID ${courseId} not found`);
  }

  const studentObjectId = this.convertToObjectId(studentId);

  // Check if student is already in the course
  if (
    course.students &&
    course.students.some((id) => id.equals(studentObjectId))
  ) {
    // Student already exists, return the course as is
    return course;
  }

  // Add student to the course using $addToSet to prevent duplicates
  const updatedCourse = await this.courseModel
    .findByIdAndUpdate(
      courseId,
      { $addToSet: { students: studentObjectId } },
      { new: true },
    )
    .exec();

  return updatedCourse;
}
```

### Course Service (`src/course/services/course.service.ts`)

Added service method:

```typescript
async addStudent(
  courseId: string,
  studentId: string,
): Promise<CourseDocument> {
  return this.courseRepository.addStudent(courseId, studentId);
}
```

### Progress Service (`src/progress/services/progress.service.ts`)

Modified `create` method:

```typescript
async create(createProgressDto: CreateProgressDto): Promise<ProgressDocument> {
  const { studentId, courseId, currentLesson } = createProgressDto;

  // Check if progress already exists
  const exists = await this.progressRepository.exists(studentId, courseId);
  if (exists) {
    throw new Error(
      `Progress already exists for student ${studentId} and course ${courseId}`,
    );
  }

  // Verify student and course exist
  await this.studentService.findOne(studentId);
  await this.courseService.findById(courseId);

  // Create progress data...
  const progressData: Partial<Progress> = {
    studentId: createObjectId(studentId, 'studentId'),
    courseId: createObjectId(courseId, 'courseId'),
    // ... other fields
  };

  // Create the progress record
  const progress = await this.progressRepository.create(progressData);

  // Add student to course's students array
  try {
    await this.courseService.addStudent(courseId, studentId);
    console.log(
      `✅ Student ${studentId} added to course ${courseId} students array`,
    );
  } catch (error) {
    console.error(
      `❌ Failed to add student ${studentId} to course ${courseId}:`,
      error,
    );
    // Don't throw error to avoid breaking progress creation
  }

  return progress;
}
```

## API Endpoints

### Progress Management Endpoints

#### Create Progress (Triggers Student Addition)

```http
POST /progress
```

**Request Body:**

```json
{
  "studentId": "507f1f77bcf86cd799439011",
  "courseId": "507f1f77bcf86cd799439012",
  "currentLesson": "507f1f77bcf86cd799439013" // optional
}
```

**Response:**

```json
{
  "_id": "progress_id",
  "studentId": "507f1f77bcf86cd799439011",
  "courseId": "507f1f77bcf86cd799439012",
  "completedLessons": {},
  "completionPercentage": 0,
  "timeSpent": {},
  "coinsEarned": 0,
  "lessonCode": {},
  "currentLesson": "507f1f77bcf86cd799439013",
  "startedAt": "2025-08-11T00:00:00.000Z",
  "isActive": true,
  "lastCalculatedAt": "2025-08-11T00:00:00.000Z"
}
```

#### Get All Progress Records

```http
GET /progress
```

#### Get Progress by ID

```http
GET /progress/:id
```

#### Get Progress by Student and Course

```http
GET /progress/:studentId/:courseId
```

#### Get All Progress for a Student

```http
GET /progress/student/:studentId
```

#### Get All Progress for a Course

```http
GET /progress/course/:courseId
```

#### Get Completion Percentage

```http
GET /progress/:studentId/:courseId/percentage
```

**Response:**

```json
{
  "percentage": 75.5,
  "completedLessons": 15,
  "totalLessons": 20
}
```

#### Update Progress

```http
PATCH /progress/:id
```

**Request Body:**

```json
{
  "completionPercentage": 85.5,
  "coinsEarned": 150,
  "isActive": true,
  "currentLesson": "507f1f77bcf86cd799439014"
}
```

#### Complete a Lesson

```http
PATCH /progress/:id/complete-lesson
```

**Request Body:**

```json
{
  "lessonId": "507f1f77bcf86cd799439013",
  "timeSpent": 45
}
```

#### Save Lesson Code

```http
PATCH /progress/:id/save-code
```

**Request Body:**

```json
{
  "lessonId": "507f1f77bcf86cd799439013",
  "language": "javascript",
  "code": "console.log('Hello, World!');"
}
```

#### Update Time Spent

```http
PATCH /progress/:id/time-spent
```

**Request Body:**

```json
{
  "minutes": 30
}
```

#### Delete Progress

```http
DELETE /progress/:id
```

### Course Management Endpoints

#### Get Course (Shows Updated Students Array)

```http
GET /courses/:courseId
```

**Response:**

```json
{
  "_id": "course_id",
  "courseTitle": "Test Course",
  "courseDescription": "A test course",
  "students": [
    {
      "_id": "student_id_1",
      "userId": "user_id_1",
      "name": "Student 1"
    },
    {
      "_id": "student_id_2",
      "userId": "user_id_2",
      "name": "Student 2"
    }
  ]
  // ... other course fields
}
```

## Advanced Progress Features

### Lesson Completion Tracking

The progress system includes advanced lesson completion tracking with automatic coin awards and streak management:

```typescript
// Complete a lesson and update progress
await this.progressService.completeLesson(progressId, {
  lessonId: "lesson_id",
  timeSpent: 45, // minutes
});
```

**Features:**

- Tracks lesson completion with timestamps
- Updates student coding streaks
- Calculates total time spent
- Automatically calculates completion percentage
- Awards coins based on progress (10 coins per lesson + bonuses)

### Code Storage

Students can save their code for each lesson:

```typescript
// Save lesson code
await this.progressService.saveCode(progressId, {
  lessonId: "lesson_id",
  language: "javascript",
  code: "console.log('Hello, World!');",
});
```

**Features:**

- Stores code with language and timestamp
- Supports multiple programming languages
- Maintains code history for each lesson

### Time Tracking

Weekly time spent tracking for analytics:

```typescript
// Update time spent for current week
await this.progressService.updateTimeSpent(progressId, 30);
```

**Features:**

- Tracks time spent per week (ISO week format)
- Used for weekly activity bonuses
- Supports analytics and reporting

### Dynamic Completion Calculation

Completion percentage is calculated dynamically based on course structure:

```typescript
// Get completion percentage
const completion = await this.progressService.getCompletionPercentage(
  studentId,
  courseId
);
// Returns: { percentage: 75.5, completedLessons: 15, totalLessons: 20 }
```

**Features:**

- Automatically recalculates when new lessons are added to courses
- Updates progress records when course structure changes
- Provides accurate completion statistics

### Coin Awards System

Sophisticated coin awarding system:

```typescript
// Automatic coin calculation and awarding
await this.progressService.calculateAndAwardCoins(progressId);
```

**Coin Awards:**

- **Base coins**: 10 coins per completed lesson
- **Streak bonus**: 5 coins per day in coding streak
- **Completion bonus**: 50 coins for course completion
- **Weekly bonus**: 25 coins for 5+ hours of weekly activity

## Data Structure

### Progress Entity Fields

The progress entity includes comprehensive tracking fields:

```typescript
{
  studentId: ObjectId,           // Reference to the student
  courseId: ObjectId,            // Reference to the course
  completedLessons: Map,         // lessonId -> { isCompleted, completedAt, timeSpent }
  completionPercentage: number,   // Calculated completion percentage (0-100)
  timeSpent: Map,               // weekKey -> total minutes spent that week
  coinsEarned: number,          // Total coins earned from this course
  lessonCode: Map,              // lessonId -> { language, code, timestamp }
  currentLesson: ObjectId,       // Currently active lesson (optional)
  startedAt: Date,              // When progress tracking started
  lastCompletedAt: Date,        // When last lesson was completed (optional)
  isActive: boolean,            // Whether progress tracking is active
  lastCalculatedAt: Date        // When completion percentage was last calculated
}
```

### Course Integration Fields

When a progress record is created, the system automatically manages course enrollment:

```typescript
// Course entity includes students array
{
  // ... other course fields
  students: ObjectId[]  // Array of student ObjectIds
}
```

**Student Addition Process:**

1. Progress creation triggers course update
2. Student is added to course's `students` array using `$addToSet`
3. Duplicate prevention ensures students aren't added twice
4. Error handling prevents progress creation failure if course update fails

**Performance Optimizations:**

- Compound unique index on `{studentId, courseId}` prevents duplicate progress records
- Single field indexes on `studentId`, `courseId`, and `lastCompletedAt` for fast queries
- Efficient MongoDB queries with proper population of referenced documents

## Testing

### Manual Testing

Use the provided test script to verify the functionality:

```bash
pnpm run test:progress-course-integration
```

### Test Scenarios

1. **New Progress**: Student is added to course when progress is created
2. **Duplicate Prevention**: Student is not added twice if already in course
3. **Multiple Students**: Multiple students can be added to the same course
4. **Error Handling**: Progress creation succeeds even if course update fails

## Benefits

### Core Integration Benefits

1. **Data Consistency**: Course always has up-to-date student list
2. **Automatic Management**: No manual intervention required for enrollment
3. **Duplicate Prevention**: Students are never added twice to courses
4. **Fault Tolerance**: Progress creation doesn't fail if course update fails
5. **Real-time Updates**: Student list is updated immediately when progress is created

### Advanced Progress Tracking Benefits

6. **Comprehensive Lesson Tracking**: Detailed completion status with timestamps and time spent
7. **Code Preservation**: Students can save and retrieve their code for each lesson
8. **Time Analytics**: Weekly time tracking for activity monitoring and bonuses
9. **Dynamic Completion**: Automatic recalculation when course structure changes
10. **Automated Rewards**: Sophisticated coin system with multiple bonus types
11. **Performance Optimized**: Efficient database queries with proper indexing
12. **Streak Management**: Automatic coding streak tracking and bonuses

## Use Cases

### 1. **Course Analytics**

- Track how many students are enrolled in each course
- Monitor course popularity and engagement
- Generate reports on student participation
- Analyze completion rates and time spent per course

### 2. **Course Management**

- Teachers can see all students in their courses
- Organizations can track student enrollment
- Administrators can monitor course capacity
- View detailed progress reports for each student

### 3. **Student Progress Tracking**

- Link student progress to course enrollment
- Track learning paths and course completion
- Generate certificates and achievements
- Monitor individual lesson completion and time spent

### 4. **Learning Analytics**

- Track coding streaks and learning consistency
- Monitor weekly activity levels
- Analyze time spent patterns across courses
- Generate insights for personalized learning recommendations

### 5. **Gamification and Rewards**

- Award coins for lesson completion and milestones
- Track and reward coding streaks
- Provide completion bonuses for finished courses
- Implement weekly activity challenges

### 6. **Code Management**

- Preserve student code for each lesson
- Support multiple programming languages
- Enable code review and feedback workflows
- Track code evolution over time

## Monitoring

The system logs progress-course integration events:

- ✅ Successful student addition to course
- ❌ Failed student addition attempts (with error details)
- 📋 Course student count updates

This feature ensures that course enrollment data is always synchronized with actual student progress, providing accurate analytics and management capabilities.
