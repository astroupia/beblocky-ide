import { Types } from "mongoose";

export interface IProgress {
  _id?: Types.ObjectId;
  studentId: Types.ObjectId;
  courseId: Types.ObjectId;
  lessonId: Types.ObjectId;
  completed: boolean;
  code?: string;
  timeSpent: number; // in seconds
  lastAccessed: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProgressDto {
  studentId: Types.ObjectId;
  courseId: Types.ObjectId;
  lessonId: Types.ObjectId;
}

export interface IUpdateProgressDto {
  completed?: boolean;
  code?: string;
  timeSpent?: number;
  lastAccessed?: Date;
  completedAt?: Date;
}

export interface ICompleteLessonDto {
  lessonId: Types.ObjectId;
}

export interface ISaveCodeDto {
  code: string;
  lessonId: Types.ObjectId;
}

export interface ITimeSpentDto {
  timeSpent: number; // in seconds
}

export interface IProgressResponse {
  progress: IProgress;
  percentage: number;
  totalLessons: number;
  completedLessons: number;
}

export interface IStudentProgress {
  studentId: Types.ObjectId;
  courseId: Types.ObjectId;
  progress: IProgress[];
  totalLessons: number;
  completedLessons: number;
  percentage: number;
}

export interface ICourseProgress {
  courseId: Types.ObjectId;
  progress: IProgress[];
  totalStudents: number;
  averageCompletion: number;
}
