import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppTab,
  ClassItem,
  StudentItem,
  GradeRecord,
  Exam,
  ExamSubmission,
  LessonMaterial,
  TeacherProfile,
  GradeFormulaConfig,
} from '../types';
import {
  initialClasses,
  generateInitialStudents,
  generateInitialGrades,
  initialExams,
  initialSubmissions,
  initialLessons,
  initialTeacherProfile,
  initialFormulaConfig,
  calculateSemesterAverage,
} from '../data/initialData';

interface AppContextType {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  userRole: 'teacher' | 'student';
  setUserRole: (role: 'teacher' | 'student') => void;
  currentStudentId: string;
  setCurrentStudentId: (id: string) => void;
  selectedSimulation: string;
  setSelectedSimulation: (simId: string) => void;
  
  classes: ClassItem[];
  students: StudentItem[];
  grades: GradeRecord[];
  exams: Exam[];
  submissions: ExamSubmission[];
  lessons: LessonMaterial[];
  teacherProfile: TeacherProfile;
  formulaConfig: GradeFormulaConfig;

  // Class Actions
  addClass: (cls: Omit<ClassItem, 'id' | 'studentCount'>) => void;
  updateClass: (id: string, cls: Partial<ClassItem>) => void;
  deleteClass: (id: string) => { success: boolean; message: string };

  // Student Actions
  addStudent: (st: Omit<StudentItem, 'id'>) => void;
  updateStudent: (id: string, st: Partial<StudentItem>) => void;
  deleteStudent: (id: string) => void;
  importStudentsList: (newStudents: Omit<StudentItem, 'id'>[]) => void;

  // Grade Actions
  updateGradeRecord: (
    recordId: string,
    field: 'scoresTx' | 'scoreGk' | 'scoreCk' | 'note',
    value: any
  ) => void;
  batchUpdateGrades: (updatedList: GradeRecord[]) => void;

  // Exam Actions
  addExam: (exam: Omit<Exam, 'id' | 'createdAt'>) => void;
  toggleExamOpen: (examId: string) => void;
  submitExam: (submission: Omit<ExamSubmission, 'id' | 'submittedAt'>) => string;
  gradeEssay: (submissionId: string, essayScore: number, teacherFeedback: string) => void;

  // Lesson Actions
  addLesson: (lesson: Omit<LessonMaterial, 'id' | 'date' | 'downloadCount'>) => void;
  deleteLesson: (lessonId: string) => void;
  incrementLessonDownload: (lessonId: string) => void;

  // Settings Actions
  updateTeacherProfile: (profile: Partial<TeacherProfile>) => void;
  updateFormulaConfig: (config: Partial<GradeFormulaConfig>) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'taydo_edu_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [userRole, setUserRole] = useState<'teacher' | 'student'>('teacher');
  const [currentStudentId, setCurrentStudentId] = useState<string>('st-001');
  const [selectedSimulation, setSelectedSimulation] = useState<string>('sum180');

  // Load from LocalStorage or seed defaults
  const [classes, setClasses] = useState<ClassItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}classes`);
    return saved ? JSON.parse(saved) : initialClasses;
  });

  const [students, setStudents] = useState<StudentItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}students`);
    return saved ? JSON.parse(saved) : generateInitialStudents();
  });

  const [grades, setGrades] = useState<GradeRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}grades`);
    if (saved) return JSON.parse(saved);
    const initialSts = generateInitialStudents();
    return generateInitialGrades(initialSts);
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}exams`);
    return saved ? JSON.parse(saved) : initialExams;
  });

  const [submissions, setSubmissions] = useState<ExamSubmission[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}submissions`);
    return saved ? JSON.parse(saved) : initialSubmissions;
  });

  const [lessons, setLessons] = useState<LessonMaterial[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}lessons`);
    return saved ? JSON.parse(saved) : initialLessons;
  });

  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}profile`);
    return saved ? JSON.parse(saved) : initialTeacherProfile;
  });

  const [formulaConfig, setFormulaConfig] = useState<GradeFormulaConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}formula`);
    return saved ? JSON.parse(saved) : initialFormulaConfig;
  });

  // Save to LocalStorage whenever state updates
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}classes`, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}students`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}grades`, JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}exams`, JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}submissions`, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}lessons`, JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}profile`, JSON.stringify(teacherProfile));
  }, [teacherProfile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}formula`, JSON.stringify(formulaConfig));
  }, [formulaConfig]);

  // Actions: Classes
  const addClass = (cls: Omit<ClassItem, 'id' | 'studentCount'>) => {
    const id = `c-${Date.now().toString(36)}`;
    const newClass: ClassItem = {
      ...cls,
      id,
      studentCount: 0,
    };
    setClasses((prev) => [...prev, newClass]);
  };

  const updateClass = (id: string, updated: Partial<ClassItem>) => {
    setClasses((prev) =>
      prev.map((cls) => (cls.id === id ? { ...cls, ...updated } : cls))
    );
    if (updated.name) {
      // Cascade update className to students and grades
      setStudents((prev) =>
        prev.map((s) => (s.classId === id ? { ...s, className: updated.name! } : s))
      );
      setGrades((prev) =>
        prev.map((g) => {
          const st = students.find((s) => s.id === g.studentId);
          return st && st.classId === id ? { ...g, className: updated.name! } : g;
        })
      );
    }
  };

  const deleteClass = (id: string): { success: boolean; message: string } => {
    const studentCountInClass = students.filter((s) => s.classId === id).length;
    if (studentCountInClass > 0) {
      return {
        success: false,
        message: `Không thể xóa lớp vì đang có ${studentCountInClass} học sinh trong lớp. Vui lòng chuyển hoặc xóa học sinh trước.`,
      };
    }
    setClasses((prev) => prev.filter((cls) => cls.id !== id));
    return { success: true, message: 'Đã xóa lớp thành công.' };
  };

  // Actions: Students
  const addStudent = (st: Omit<StudentItem, 'id'>) => {
    const id = `st-${Date.now().toString(36)}`;
    const newStudent: StudentItem = { ...st, id };
    setStudents((prev) => [newStudent, ...prev]);

    // Update class student count
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === st.classId ? { ...cls, studentCount: cls.studentCount + 1 } : cls
      )
    );

    // Create empty grade record for Math & Informatics
    const newGrades: GradeRecord[] = [
      {
        id: `gr-${id}-toan-hk1`,
        studentId: id,
        studentCode: st.studentCode,
        fullName: st.fullName,
        className: st.className,
        subject: 'Toán',
        semester: 'HK1',
        scoresTx: [],
        scoreGk: null,
        scoreCk: null,
        average: null,
        note: '',
        updatedAt: new Date().toISOString().split('T')[0],
      },
      {
        id: `gr-${id}-tin-hk1`,
        studentId: id,
        studentCode: st.studentCode,
        fullName: st.fullName,
        className: st.className,
        subject: 'Tin học',
        semester: 'HK1',
        scoresTx: [],
        scoreGk: null,
        scoreCk: null,
        average: null,
        note: '',
        updatedAt: new Date().toISOString().split('T')[0],
      },
    ];
    setGrades((prev) => [...newGrades, ...prev]);
  };

  const updateStudent = (id: string, updated: Partial<StudentItem>) => {
    setStudents((prev) =>
      prev.map((st) => (st.id === id ? { ...st, ...updated } : st))
    );
    if (updated.fullName || updated.studentCode || updated.className) {
      setGrades((prev) =>
        prev.map((g) =>
          g.studentId === id
            ? {
                ...g,
                fullName: updated.fullName ?? g.fullName,
                studentCode: updated.studentCode ?? g.studentCode,
                className: updated.className ?? g.className,
              }
            : g
        )
      );
    }
  };

  const deleteStudent = (id: string) => {
    const studentToDelete = students.find((s) => s.id === id);
    if (studentToDelete) {
      setClasses((prev) =>
        prev.map((cls) =>
          cls.id === studentToDelete.classId
            ? { ...cls, studentCount: Math.max(0, cls.studentCount - 1) }
            : cls
        )
      );
    }
    setStudents((prev) => prev.filter((st) => st.id !== id));
    setGrades((prev) => prev.filter((g) => g.studentId !== id));
  };

  const importStudentsList = (newStudents: Omit<StudentItem, 'id'>[]) => {
    const created: StudentItem[] = newStudents.map((st, idx) => ({
      ...st,
      id: `st-imp-${Date.now().toString(36)}-${idx}`,
    }));
    setStudents((prev) => [...created, ...prev]);

    // Recalculate class counts
    setClasses((prev) =>
      prev.map((cls) => {
        const addedCount = created.filter((s) => s.classId === cls.id).length;
        return { ...cls, studentCount: cls.studentCount + addedCount };
      })
    );

    // Create empty grades for new students
    const newGrades: GradeRecord[] = [];
    created.forEach((st) => {
      newGrades.push(
        {
          id: `gr-${st.id}-toan-hk1`,
          studentId: st.id,
          studentCode: st.studentCode,
          fullName: st.fullName,
          className: st.className,
          subject: 'Toán',
          semester: 'HK1',
          scoresTx: [],
          scoreGk: null,
          scoreCk: null,
          average: null,
          note: '',
          updatedAt: new Date().toISOString().split('T')[0],
        },
        {
          id: `gr-${st.id}-tin-hk1`,
          studentId: st.id,
          studentCode: st.studentCode,
          fullName: st.fullName,
          className: st.className,
          subject: 'Tin học',
          semester: 'HK1',
          scoresTx: [],
          scoreGk: null,
          scoreCk: null,
          average: null,
          note: '',
          updatedAt: new Date().toISOString().split('T')[0],
        }
      );
    });
    setGrades((prev) => [...newGrades, ...prev]);
  };

  // Actions: Grades
  const updateGradeRecord = (
    recordId: string,
    field: 'scoresTx' | 'scoreGk' | 'scoreCk' | 'note',
    value: any
  ) => {
    setGrades((prev) =>
      prev.map((rec) => {
        if (rec.id !== recordId) return rec;

        const updated = { ...rec, [field]: value };
        if (field !== 'note') {
          updated.average = calculateSemesterAverage(
            updated.scoresTx,
            updated.scoreGk,
            updated.scoreCk,
            formulaConfig
          );
        }
        updated.updatedAt = new Date().toISOString().split('T')[0];
        return updated;
      })
    );
  };

  const batchUpdateGrades = (updatedList: GradeRecord[]) => {
    setGrades(updatedList);
  };

  // Actions: Exams
  const addExam = (exam: Omit<Exam, 'id' | 'createdAt'>) => {
    const newExam: Exam = {
      ...exam,
      id: `ex-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setExams((prev) => [newExam, ...prev]);
  };

  const toggleExamOpen = (examId: string) => {
    setExams((prev) =>
      prev.map((ex) => (ex.id === examId ? { ...ex, isOpen: !ex.isOpen } : ex))
    );
  };

  const submitExam = (submission: Omit<ExamSubmission, 'id' | 'submittedAt'>) => {
    const id = `sub-${Date.now().toString(36)}`;
    const newSub: ExamSubmission = {
      ...submission,
      id,
      submittedAt: new Date().toLocaleString('vi-VN'),
    };
    setSubmissions((prev) => [newSub, ...prev]);
    return id;
  };

  const gradeEssay = (submissionId: string, essayScore: number, teacherFeedback: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id !== submissionId) return sub;
        const total = Math.min(10, Math.round((sub.autoScore + essayScore) * 10) / 10);
        return {
          ...sub,
          essayScore,
          totalScore: total,
          status: 'fully_graded',
          teacherFeedback,
        };
      })
    );
  };

  // Actions: Lessons
  const addLesson = (lesson: Omit<LessonMaterial, 'id' | 'date' | 'downloadCount'>) => {
    const newLesson: LessonMaterial = {
      ...lesson,
      id: `les-${Date.now().toString(36)}`,
      date: new Date().toLocaleDateString('vi-VN'),
      downloadCount: 0,
    };
    setLessons((prev) => [newLesson, ...prev]);
  };

  const deleteLesson = (lessonId: string) => {
    setLessons((prev) => prev.filter((les) => les.id !== lessonId));
  };

  const incrementLessonDownload = (lessonId: string) => {
    setLessons((prev) =>
      prev.map((les) =>
        les.id === lessonId ? { ...les, downloadCount: les.downloadCount + 1 } : les
      )
    );
  };

  // Actions: Settings
  const updateTeacherProfile = (profile: Partial<TeacherProfile>) => {
    setTeacherProfile((prev) => ({ ...prev, ...profile }));
  };

  const updateFormulaConfig = (config: Partial<GradeFormulaConfig>) => {
    const updated = { ...formulaConfig, ...config };
    setFormulaConfig(updated);
    // Recalculate all grades
    setGrades((prev) =>
      prev.map((rec) => ({
        ...rec,
        average: calculateSemesterAverage(rec.scoresTx, rec.scoreGk, rec.scoreCk, updated),
      }))
    );
  };

  const resetAllData = () => {
    localStorage.clear();
    const st = generateInitialStudents();
    setClasses(initialClasses);
    setStudents(st);
    setGrades(generateInitialGrades(st));
    setExams(initialExams);
    setSubmissions(initialSubmissions);
    setLessons(initialLessons);
    setTeacherProfile(initialTeacherProfile);
    setFormulaConfig(initialFormulaConfig);
    setActiveTab('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userRole,
        setUserRole,
        currentStudentId,
        setCurrentStudentId,
        selectedSimulation,
        setSelectedSimulation,
        classes,
        students,
        grades,
        exams,
        submissions,
        lessons,
        teacherProfile,
        formulaConfig,
        addClass,
        updateClass,
        deleteClass,
        addStudent,
        updateStudent,
        deleteStudent,
        importStudentsList,
        updateGradeRecord,
        batchUpdateGrades,
        addExam,
        toggleExamOpen,
        submitExam,
        gradeEssay,
        addLesson,
        deleteLesson,
        incrementLessonDownload,
        updateTeacherProfile,
        updateFormulaConfig,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
