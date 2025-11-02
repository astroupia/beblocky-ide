import { Types } from "mongoose";

// AI Conversation Types
export interface IAiConversation {
  _id?: string;
  courseId: Types.ObjectId;
  studentId: Types.ObjectId;
  title?: string;
  messages: IChatMessage[];
  isActive: boolean;
  lastActivity: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: {
    lessonId?: string;
    slideId?: string;
    courseContext?: any;
  };
}

export interface ICreateAiConversationDto {
  courseId: string;
  studentId: string;
  title?: string;
  initialMessage?: string;
  lessonId?: string;
  slideId?: string;
}

export interface ISendMessageDto {
  message: string;
  lessonId?: string;
  slideId?: string;
  generateTitle?: boolean; // Generate title based on first message
}

// Code Analysis Types
export interface ICodeAnalysis {
  _id?: string;
  progressId: Types.ObjectId;
  lessonId: Types.ObjectId;
  studentId: Types.ObjectId;
  courseId: Types.ObjectId;
  codeContent: string;
  language: string;
  feedback: ICodeFeedback[];
  totalPoints: number;
  analysisDate: Date;
  isCompleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICodeFeedback {
  type: "success" | "warning" | "error" | "info";
  message: string;
  line?: number;
  code?: string;
  suggestion?: string;
  points?: number;
}

export interface IAnalyzeCodeDto {
  progressId: string;
  lessonId: string;
  codeContent: string;
  language: string;
  customInstructions?: string;
}

export interface IStudentStats {
  totalAnalyses: number;
  averagePoints: number;
  totalPoints: number;
  feedbackBreakdown: Record<string, number>;
}

// Response types for frontend
export interface IAiConversationResponse {
  _id: string;
  courseId: string;
  studentId: string;
  title?: string;
  messages: IChatMessage[];
  isActive: boolean;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICodeAnalysisResponse {
  _id: string;
  progressId: string;
  lessonId: string;
  studentId: string;
  courseId: string;
  codeContent: string;
  language: string;
  feedback: ICodeFeedback[];
  totalPoints: number;
  analysisDate: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}
