export type SubjectType = 'Toán' | 'Tin học';
export type GradeLevel = 6 | 7 | 8 | 9;
export type SemesterType = 'HK1' | 'HK2';

export interface ClassItem {
  id: string;
  name: string; // e.g. "8A1"
  grade: GradeLevel;
  schoolYear: string;
  room: string;
  teacherName: string;
  studentCount: number;
}

export interface StudentItem {
  id: string;
  studentCode: string;
  fullName: string;
  gender: 'Nam' | 'Nữ';
  birthDate: string;
  classId: string;
  className: string;
  grade: GradeLevel;
  schoolYear: string;
  status: 'Đang học' | 'Nghỉ học' | 'Chuyển trường';
  phone?: string;
  email?: string;
  address?: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  studentCode: string;
  fullName: string;
  className: string;
  subject: SubjectType;
  semester: SemesterType;
  scoresTx: number[]; // Đánh giá thường xuyên (hệ số 1)
  scoreGk: number | null; // Giữa kỳ (hệ số 2)
  scoreCk: number | null; // Cuối kỳ (hệ số 3)
  average: number | null; // ĐTB học kỳ
  note: string;
  updatedAt: string;
}

export interface GradeFormulaConfig {
  weightTx: number; // default 1
  weightGk: number; // default 2
  weightCk: number; // default 3
  passThreshold: number; // 5.0
  goodThreshold: number; // 6.5
  excellentThreshold: number; // 8.0
}

export type QuestionType = 'mcq4' | 'boolean' | 'short' | 'essay';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[]; // For mcq4
  correctAnswer: string | number | boolean;
  points: number;
  explanation?: string;
}

export type ExamType = '15p' | 'giua_ky' | 'cuoi_ky';

export interface Exam {
  id: string;
  title: string;
  subject: SubjectType;
  grade: GradeLevel;
  type: ExamType;
  durationMinutes: number;
  totalQuestions: number;
  isOpen: boolean;
  assignedClasses: string[];
  questions: Question[];
  createdAt: string;
  deadline?: string;
  showResultImmediate: boolean;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  className: string;
  submittedAt: string;
  answers: Record<string, string>;
  autoScore: number;
  essayScore: number | null;
  totalScore: number;
  status: 'auto_graded' | 'fully_graded';
  teacherFeedback?: string;
}

export type LessonCategory = 'pdf_giao_an' | 'video' | 'phieu_bai_tap' | 'giao_an_ppt' | 'tai_lieu_khac';

export interface LessonMaterial {
  id: string;
  title: string;
  subject: SubjectType;
  grade: GradeLevel;
  chapter: string;
  category: LessonCategory;
  fileType: 'PDF' | 'DOCX' | 'PPTX' | 'VIDEO' | 'OTHER';
  fileUrl?: string;
  videoEmbedId?: string;
  date: string;
  isPublic: boolean;
  description: string;
  mathFormula?: string;
  downloadCount: number;
}

export interface TeacherProfile {
  fullName: string;
  title: string;
  subject: string;
  school: string;
  avatarUrl: string;
  email: string;
  phone: string;
  twoFactorEnabled: boolean;
}

export type AppTab = 
  | 'dashboard' 
  | 'students' 
  | 'gradebook' 
  | 'exams' 
  | 'lessons' 
  | 'simulations' 
  | 'reports' 
  | 'settings';
