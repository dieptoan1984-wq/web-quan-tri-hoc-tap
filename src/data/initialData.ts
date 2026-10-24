import {
  ClassItem,
  StudentItem,
  GradeRecord,
  Exam,
  LessonMaterial,
  TeacherProfile,
  GradeFormulaConfig,
  ExamSubmission
} from '../types';

export const initialFormulaConfig: GradeFormulaConfig = {
  weightTx: 1,
  weightGk: 2,
  weightCk: 3,
  passThreshold: 5.0,
  goodThreshold: 6.5,
  excellentThreshold: 8.0,
};

export const initialTeacherProfile: TeacherProfile = {
  fullName: 'GV. Diệp Thanh Toàn',
  title: 'Giáo viên',
  subject: 'Môn Toán – Tin học',
  school: 'Trường THCS Tây Đô',
  avatarUrl: '/assets/aistudio/B_ng__i_u_khi_n_gi_o_d_c_T_Y____EDU_cab901aa.png',
  email: 'dieptoan1984@gmail.com',
  phone: '0912 345 678',
  twoFactorEnabled: true,
};

export const initialClasses: ClassItem[] = [
  {
    id: 'c-8a1',
    name: '8A1',
    grade: 8,
    schoolYear: '2024-2025',
    room: 'Phòng 201',
    teacherName: 'Diệp Thanh Toàn',
    studentCount: 32,
  },
  {
    id: 'c-8a2',
    name: '8A2',
    grade: 8,
    schoolYear: '2024-2025',
    room: 'Phòng 202',
    teacherName: 'Nguyễn Văn Hải',
    studentCount: 32,
  },
  {
    id: 'c-8a3',
    name: '8A3',
    grade: 8,
    schoolYear: '2024-2025',
    room: 'Phòng 203',
    teacherName: 'Trần Thị Mai',
    studentCount: 32,
  },
  {
    id: 'c-8a4',
    name: '8A4',
    grade: 8,
    schoolYear: '2024-2025',
    room: 'Phòng 204',
    teacherName: 'Lê Hoàng Phong',
    studentCount: 32,
  },
];

// Seed 128 students across 4 classes (32 each)
const FIRST_NAMES_NAM = ['Minh', 'Hoàng', 'Quang', 'Đức', 'Anh', 'Tuấn', 'Duy', 'Gia', 'Hải', 'Khang', 'Bảo', 'Long', 'Trí', 'Phúc', 'Việt', 'Khôi'];
const FIRST_NAMES_NU = ['Ngọc', 'Hà', 'Vy', 'Trang', 'Phương', 'Linh', 'Châu', 'Lan', 'Mai', 'Thảo', 'Nhi', 'Hương', 'An', 'My', 'Dung', 'Tâm'];
const LAST_NAMES = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương'];

export function generateInitialStudents(): StudentItem[] {
  const students: StudentItem[] = [];
  
  // Specific prominent students from dashboard mockup
  students.push(
    {
      id: 'st-001',
      studentCode: 'HS8001',
      fullName: 'Nguyễn Minh Anh',
      gender: 'Nữ',
      birthDate: '2011-03-15',
      classId: 'c-8a1',
      className: '8A1',
      grade: 8,
      schoolYear: '2024-2025',
      status: 'Đang học',
      phone: '0901 123 456',
      email: 'minhanh.hs8001@thcstaydo.edu.vn',
      address: 'Số 12 đường Trần Hưng Đạo, Cần Thơ',
    },
    {
      id: 'st-002',
      studentCode: 'HS8002',
      fullName: 'Trần Hoàng Nam',
      gender: 'Nam',
      birthDate: '2011-08-22',
      classId: 'c-8a1',
      className: '8A1',
      grade: 8,
      schoolYear: '2024-2025',
      status: 'Đang học',
      phone: '0902 234 567',
      email: 'hoangnam.hs8002@thcstaydo.edu.vn',
      address: 'Số 45 đường 30 Tháng 4, Cần Thơ',
    },
    {
      id: 'st-003',
      studentCode: 'HS8003',
      fullName: 'Lê Thị Bảo Ngọc',
      gender: 'Nữ',
      birthDate: '2011-05-10',
      classId: 'c-8a2',
      className: '8A2',
      grade: 8,
      schoolYear: '2024-2025',
      status: 'Đang học',
      phone: '0903 345 678',
      email: 'baongoc.hs8003@thcstaydo.edu.vn',
      address: 'Số 78 đường Mậu Thân, Cần Thơ',
    },
    {
      id: 'st-004',
      studentCode: 'HS8004',
      fullName: 'Phạm Quang Huy',
      gender: 'Nam',
      birthDate: '2011-11-04',
      classId: 'c-8a2',
      className: '8A2',
      grade: 8,
      schoolYear: '2024-2025',
      status: 'Đang học',
      phone: '0904 456 789',
      email: 'quanghuy.hs8004@thcstaydo.edu.vn',
      address: 'Số 91 đường Cách Mạng Tháng 8, Cần Thơ',
    },
    {
      id: 'st-005',
      studentCode: 'HS8005',
      fullName: 'Đỗ Thị Thu Hà',
      gender: 'Nữ',
      birthDate: '2011-02-19',
      classId: 'c-8a3',
      className: '8A3',
      grade: 8,
      schoolYear: '2024-2025',
      status: 'Đang học',
      phone: '0905 567 890',
      email: 'thuha.hs8005@thcstaydo.edu.vn',
      address: 'Số 104 đường Nguyễn Văn Cừ, Cần Thơ',
    }
  );

  // Generate remainder to reach 32 students in each of the 4 classes
  const classes = [
    { id: 'c-8a1', name: '8A1', startIdx: 2 }, // already has 2
    { id: 'c-8a2', name: '8A2', startIdx: 2 }, // already has 2
    { id: 'c-8a3', name: '8A3', startIdx: 1 }, // already has 1
    { id: 'c-8a4', name: '8A4', startIdx: 0 }, // 0
  ];

  let codeCounter = 6;
  classes.forEach((cls) => {
    const need = 32 - cls.startIdx;
    for (let i = 0; i < need; i++) {
      const isMale = (i % 2 === 0);
      const lastName = LAST_NAMES[(codeCounter + i) % LAST_NAMES.length];
      const middleName = isMale ? 'Văn' : 'Thị';
      const firstName = isMale
        ? FIRST_NAMES_NAM[(i + codeCounter) % FIRST_NAMES_NAM.length]
        : FIRST_NAMES_NU[(i + codeCounter) % FIRST_NAMES_NU.length];
      const fullName = `${lastName} ${middleName} ${firstName}`;
      const codeStr = `HS8${String(codeCounter).padStart(3, '0')}`;
      
      students.push({
        id: `st-${codeCounter}`,
        studentCode: codeStr,
        fullName,
        gender: isMale ? 'Nam' : 'Nữ',
        birthDate: `2011-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}`,
        classId: cls.id,
        className: cls.name,
        grade: 8,
        schoolYear: '2024-2025',
        status: 'Đang học',
        phone: `090${(codeCounter % 9) + 1} 123 45${i % 10}`,
        email: `${codeStr.toLowerCase()}@thcstaydo.edu.vn`,
        address: `Phường An Khánh, Ninh Kiều, Cần Thơ`,
      });
      codeCounter++;
    }
  });

  return students;
}

// Calculate semester grade according to Vietnamese lower-secondary formula:
// ĐTB = (Sum(Tx) + 2*GK + 3*CK) / (Count(Tx) + 5)
export function calculateSemesterAverage(
  scoresTx: number[],
  scoreGk: number | null,
  scoreCk: number | null,
  config: GradeFormulaConfig = initialFormulaConfig
): number | null {
  if (scoreGk === null || scoreCk === null || scoresTx.length === 0) {
    return null;
  }
  const sumTx = scoresTx.reduce((sum, score) => sum + score * config.weightTx, 0);
  const totalWeight = scoresTx.length * config.weightTx + config.weightGk + config.weightCk;
  const rawAverage = (sumTx + scoreGk * config.weightGk + scoreCk * config.weightCk) / totalWeight;
  return Math.round(rawAverage * 10) / 10;
}

// Generate grade records matching exact averages on mockup dashboard:
// 8A1: Toán 8.9, Tin học 8.4
// 8A2: Toán 8.1, Tin học 7.8
// 8A3: Toán 7.6, Tin học 8.2
// 8A4: Toán 8.5, Tin học 8.0
export function generateInitialGrades(students: StudentItem[]): GradeRecord[] {
  const grades: GradeRecord[] = [];

  students.forEach((st) => {
    // Math grades
    let mathTx: number[] = [8.5, 9.0, 9.5];
    let mathGk: number = 9.0;
    let mathCk: number = 9.0;

    // Informatics grades
    let tinTx: number[] = [8.0, 8.5, 8.5];
    let tinGk: number = 8.5;
    let tinCk: number = 8.5;

    // Adjust based on student and class to match mockup statistics exactly
    if (st.studentCode === 'HS8001') {
      mathTx = [9.0, 9.5, 9.5];
      mathGk = 9.0;
      mathCk = 9.5; // Average ~ 9.2
      tinTx = [8.5, 9.0, 8.5];
      tinGk = 9.0;
      tinCk = 9.0;
    } else if (st.studentCode === 'HS8002') {
      mathTx = [8.0, 8.5, 8.5];
      mathGk = 8.5;
      mathCk = 8.5; // Average ~ 8.5
      tinTx = [8.0, 8.5, 8.0];
      tinGk = 8.5;
      tinCk = 8.5;
    } else if (st.studentCode === 'HS8003') {
      mathTx = [8.0, 8.5, 8.0];
      mathGk = 8.0;
      mathCk = 8.0;
      tinTx = [8.5, 9.0, 9.0];
      tinGk = 9.0;
      tinCk = 9.0; // Average ~ 8.8
    } else if (st.studentCode === 'HS8004') {
      mathTx = [7.5, 7.5, 8.0];
      mathGk = 7.5;
      mathCk = 7.5; // Average ~ 7.6
      tinTx = [7.5, 8.0, 8.0];
      tinGk = 7.5;
      tinCk = 8.0;
    } else if (st.studentCode === 'HS8005') {
      mathTx = [7.5, 7.5, 8.0];
      mathGk = 7.5;
      mathCk = 7.5;
      tinTx = [8.0, 8.5, 8.0];
      tinGk = 8.0;
      tinCk = 8.5; // Average ~ 8.1
    } else {
      // Class averages profile
      if (st.className === '8A1') {
        mathTx = [8.5, 9.0, 9.0];
        mathGk = 9.0;
        mathCk = 9.0;
        tinTx = [8.0, 8.5, 8.5];
        tinGk = 8.5;
        tinCk = 8.5;
      } else if (st.className === '8A2') {
        mathTx = [8.0, 8.0, 8.5];
        mathGk = 8.0;
        mathCk = 8.0;
        tinTx = [7.5, 8.0, 7.5];
        tinGk = 8.0;
        tinCk = 7.5;
      } else if (st.className === '8A3') {
        mathTx = [7.5, 7.5, 8.0];
        mathGk = 7.5;
        mathCk = 7.5;
        tinTx = [8.0, 8.5, 8.0];
        tinGk = 8.5;
        tinCk = 8.0;
      } else {
        // 8A4
        mathTx = [8.5, 8.5, 8.5];
        mathGk = 8.5;
        mathCk = 8.5;
        tinTx = [8.0, 8.0, 8.0];
        tinGk = 8.0;
        tinCk = 8.0;
      }
    }

    const mathAvg = calculateSemesterAverage(mathTx, mathGk, mathCk);
    const tinAvg = calculateSemesterAverage(tinTx, tinGk, tinCk);

    grades.push(
      {
        id: `gr-${st.id}-toan-hk1`,
        studentId: st.id,
        studentCode: st.studentCode,
        fullName: st.fullName,
        className: st.className,
        subject: 'Toán',
        semester: 'HK1',
        scoresTx: mathTx,
        scoreGk: mathGk,
        scoreCk: mathCk,
        average: mathAvg,
        note: mathAvg && mathAvg >= 8.0 ? 'Học tốt, chăm chú' : 'Có tiến bộ',
        updatedAt: '2024-11-20',
      },
      {
        id: `gr-${st.id}-tin-hk1`,
        studentId: st.id,
        studentCode: st.studentCode,
        fullName: st.fullName,
        className: st.className,
        subject: 'Tin học',
        semester: 'HK1',
        scoresTx: tinTx,
        scoreGk: tinGk,
        scoreCk: tinCk,
        average: tinAvg,
        note: 'Thao tác thực hành tốt',
        updatedAt: '2024-11-20',
      }
    );
  });

  return grades;
}

export const initialExams: Exam[] = [
  {
    id: 'ex-001',
    title: 'Đề kiểm tra 15 phút - Toán 8 - Chương I: Phép nhân đa thức',
    subject: 'Toán',
    grade: 8,
    type: '15p',
    durationMinutes: 15,
    totalQuestions: 10,
    isOpen: true,
    assignedClasses: ['8A1', '8A2', '8A3', '8A4'],
    createdAt: '2024-10-15',
    deadline: '2024-12-31',
    showResultImmediate: true,
    questions: [
      {
        id: 'q-101',
        type: 'mcq4',
        prompt: 'Kết quả của phép nhân đơn thức 2x với đa thức (3x - 5) là:',
        options: ['6x² - 10x', '6x² - 5', '5x² - 10x', '6x - 10'],
        correctAnswer: '6x² - 10x',
        points: 1,
        explanation: '2x · (3x - 5) = 2x · 3x - 2x · 5 = 6x² - 10x',
      },
      {
        id: 'q-102',
        type: 'mcq4',
        prompt: 'Khai triển hằng đẳng thức (a + b)² ta được:',
        options: ['a² + 2ab + b²', 'a² + ab + b²', 'a² - 2ab + b²', 'a² + b²'],
        correctAnswer: 'a² + 2ab + b²',
        points: 1,
        explanation: 'Đây là hằng đẳng thức bình phương của một tổng: (a + b)² = a² + 2ab + b²',
      },
      {
        id: 'q-103',
        type: 'mcq4',
        prompt: 'Hằng đẳng thức hiệu hai bình phương là:',
        options: ['a² - b² = (a - b)(a + b)', '(a - b)² = a² - b²', 'a² - b² = (a - b)²', 'a² - b² = a² - 2ab + b²'],
        correctAnswer: 'a² - b² = (a - b)(a + b)',
        points: 1,
      },
      {
        id: 'q-104',
        type: 'boolean',
        prompt: 'Biểu thức (x - 2)(x + 2) bằng x² - 4. Đúng hay Sai?',
        correctAnswer: true,
        points: 1,
      },
      {
        id: 'q-105',
        type: 'short',
        prompt: 'Tính giá trị của đa thức P = x² - 4x + 4 tại x = 12.',
        correctAnswer: '100',
        points: 2,
        explanation: 'P = (x - 2)². Với x = 12 thì P = (12 - 2)² = 10² = 100.',
      },
      {
        id: 'q-106',
        type: 'mcq4',
        prompt: 'Phân tích đa thức x² - 9 thành nhân tử:',
        options: ['(x - 3)(x + 3)', '(x - 9)(x + 1)', '(x - 3)²', '(x + 3)²'],
        correctAnswer: '(x - 3)(x + 3)',
        points: 1,
      },
      {
        id: 'q-107',
        type: 'mcq4',
        prompt: 'Đơn thức 15x³y² chia hết cho đơn thức nào sau đây?',
        options: ['3x²y', '5x⁴y', '3xy³', '15x²y³'],
        correctAnswer: '3x²y',
        points: 1,
      },
      {
        id: 'q-108',
        type: 'boolean',
        prompt: 'Tổng các góc trong một tứ giác bằng 360°. Đúng hay Sai?',
        correctAnswer: true,
        points: 1,
      },
      {
        id: 'q-109',
        type: 'mcq4',
        prompt: 'Hình bình hành có hai đường chéo vuông góc với nhau là:',
        options: ['Hình thoi', 'Hình chữ nhật', 'Hình thang cân', 'Hình tròn'],
        correctAnswer: 'Hình thoi',
        points: 1,
      },
      {
        id: 'q-110',
        type: 'essay',
        prompt: 'Trình bày cách tính nhanh giá trị của 101² bằng cách áp dụng hằng đẳng thức.',
        correctAnswer: '101² = (100 + 1)² = 10000 + 200 + 1 = 10201',
        points: 2,
        explanation: 'Tách 101 = 100 + 1 và áp dụng (a+b)² = a² + 2ab + b².',
      },
    ],
  },
  {
    id: 'ex-002',
    title: 'Đề kiểm tra giữa kỳ - Tin học 8 - Chủ đề 3: Lập trình',
    subject: 'Tin học',
    grade: 8,
    type: 'giua_ky',
    durationMinutes: 45,
    totalQuestions: 20,
    isOpen: true,
    assignedClasses: ['8A1', '8A2', '8A3', '8A4'],
    createdAt: '2024-10-20',
    deadline: '2024-12-31',
    showResultImmediate: true,
    questions: [
      {
        id: 'q-201',
        type: 'mcq4',
        prompt: 'Trong ngôn ngữ lập trình, biến là đại lượng dùng để:',
        options: ['Lưu trữ dữ liệu có thể thay đổi', 'Chỉ dùng để tính toán số nguyên', 'In kết quả ra màn hình', 'Lưu trữ dữ liệu cố định không đổi'],
        correctAnswer: 'Lưu trữ dữ liệu có thể thay đổi',
        points: 1,
      },
      {
        id: 'q-202',
        type: 'mcq4',
        prompt: 'Để nhập dữ liệu từ bàn phím trong Python, ta dùng hàm:',
        options: ['input()', 'print()', 'scan()', 'read()'],
        correctAnswer: 'input()',
        points: 1,
      },
      {
        id: 'q-203',
        type: 'mcq4',
        prompt: 'Cấu trúc rẽ nhánh trong lập trình được thể hiện qua câu lệnh nào?',
        options: ['if ... else', 'for ... in', 'while', 'def'],
        correctAnswer: 'if ... else',
        points: 1,
      },
      {
        id: 'q-204',
        type: 'boolean',
        prompt: 'Vòng lặp "for i in range(5)" sẽ lặp đúng 5 lần với i nhận giá trị từ 0 đến 4. Đúng hay Sai?',
        correctAnswer: true,
        points: 1,
      },
      {
        id: 'q-205',
        type: 'short',
        prompt: 'Cho đoạn mã: a = 10; b = 5; c = a % b. Giá trị của biến c là bao nhiêu?',
        correctAnswer: '0',
        points: 2,
        explanation: 'Phép chia lấy dư 10 % 5 = 0.',
      },
      {
        id: 'q-206',
        type: 'essay',
        prompt: 'Hãy nêu sự khác nhau giữa biến và hằng trong lập trình.',
        correctAnswer: 'Biến là đại lượng lưu trữ giá trị có thể thay đổi trong quá trình thực thi chương trình. Hằng là đại lượng có giá trị cố định không đổi trong suốt chương trình.',
        points: 4,
      },
    ],
  },
  {
    id: 'ex-003',
    title: 'Đề kiểm tra cuối kỳ - Toán 8 - Học kỳ I',
    subject: 'Toán',
    grade: 8,
    type: 'cuoi_ky',
    durationMinutes: 60,
    totalQuestions: 30,
    isOpen: true,
    assignedClasses: ['8A1', '8A2', '8A3', '8A4'],
    createdAt: '2024-11-01',
    deadline: '2025-01-15',
    showResultImmediate: false,
    questions: [
      {
        id: 'q-301',
        type: 'mcq4',
        prompt: 'Điều kiện xác định của phân thức đại số (x + 1) / (x - 2) là:',
        options: ['x ≠ 2', 'x ≠ -1', 'x ≠ 0', 'x > 2'],
        correctAnswer: 'x ≠ 2',
        points: 1,
      },
      {
        id: 'q-302',
        type: 'mcq4',
        prompt: 'Tứ giác có hai đường chéo bằng nhau và cắt nhau tại trung điểm mỗi đường là:',
        options: ['Hình chữ nhật', 'Hình thoi', 'Hình thang cân', 'Hình vuông'],
        correctAnswer: 'Hình chữ nhật',
        points: 1,
      },
      {
        id: 'q-303',
        type: 'short',
        prompt: 'Độ dài cạnh huyền tam giác vuông có hai cạnh góc vuông 6cm và 8cm là bao nhiêu cm?',
        correctAnswer: '10',
        points: 2,
        explanation: 'Áp dụng định lý Pythagore: c = √(6² + 8²) = √(36 + 64) = √100 = 10 cm.',
      },
      {
        id: 'q-304',
        type: 'essay',
        prompt: 'Cho tam giác ABC vuông tại A. Gọi M là trung điểm cạnh BC. Chứng minh rằng AM = BC/2.',
        correctAnswer: 'Trong tam giác vuông, đường trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền.',
        points: 6,
      },
    ],
  },
];

export const initialSubmissions: ExamSubmission[] = [
  {
    id: 'sub-001',
    examId: 'ex-001',
    examTitle: 'Đề kiểm tra 15 phút - Toán 8 - Chương I',
    studentId: 'st-001',
    studentName: 'Nguyễn Minh Anh',
    studentCode: 'HS8001',
    className: '8A1',
    submittedAt: '2024-10-18 08:14',
    answers: {
      'q-101': '6x² - 10x',
      'q-102': 'a² + 2ab + b²',
      'q-103': 'a² - b² = (a - b)(a + b)',
      'q-104': 'true',
      'q-105': '100',
      'q-106': '(x - 3)(x + 3)',
      'q-107': '3x²y',
      'q-108': 'true',
      'q-109': 'Hình thoi',
      'q-110': '101² = (100 + 1)² = 100² + 2·100·1 + 1² = 10000 + 200 + 1 = 10201',
    },
    autoScore: 8,
    essayScore: 2,
    totalScore: 10,
    status: 'fully_graded',
    teacherFeedback: 'Bài làm rất tốt, trình bày rõ ràng, áp dụng hằng đẳng thức chuẩn xác.',
  },
  {
    id: 'sub-002',
    examId: 'ex-001',
    examTitle: 'Đề kiểm tra 15 phút - Toán 8 - Chương I',
    studentId: 'st-002',
    studentName: 'Trần Hoàng Nam',
    studentCode: 'HS8002',
    className: '8A1',
    submittedAt: '2024-10-18 08:15',
    answers: {
      'q-101': '6x² - 10x',
      'q-102': 'a² + 2ab + b²',
      'q-103': 'a² - b² = (a - b)(a + b)',
      'q-104': 'true',
      'q-105': '100',
      'q-106': '(x - 3)(x + 3)',
      'q-107': '3x²y',
      'q-108': 'true',
      'q-109': 'Hình chữ nhật',
      'q-110': 'Tách 101 = 100 + 1, ta được 10000 + 200 + 1 = 10201',
    },
    autoScore: 7,
    essayScore: 1.5,
    totalScore: 8.5,
    status: 'fully_graded',
    teacherFeedback: 'Lưu ý phân biệt dấu hiệu nhận biết hình thoi và hình chữ nhật.',
  },
  {
    id: 'sub-003',
    examId: 'ex-002',
    examTitle: 'Đề kiểm tra giữa kỳ - Tin học 8 - Chủ đề 3: Lập trình',
    studentId: 'st-003',
    studentName: 'Lê Thị Bảo Ngọc',
    studentCode: 'HS8003',
    className: '8A2',
    submittedAt: '2024-10-22 09:30',
    answers: {
      'q-201': 'Lưu trữ dữ liệu có thể thay đổi',
      'q-202': 'input()',
      'q-203': 'if ... else',
      'q-204': 'true',
      'q-205': '0',
      'q-206': 'Biến có thể thay đổi giá trị trong khi hằng giữ nguyên không đổi.',
    },
    autoScore: 6,
    essayScore: null,
    totalScore: 6,
    status: 'auto_graded',
  },
];

export const initialLessons: LessonMaterial[] = [
  {
    id: 'les-001',
    title: 'Bài giảng: Phương trình bậc nhất một ẩn',
    subject: 'Toán',
    grade: 8,
    chapter: 'Chương III: Phương trình bậc nhất một ẩn',
    category: 'video',
    fileType: 'VIDEO',
    date: '12/10/2024',
    isPublic: true,
    description: 'Video hướng dẫn định nghĩa dạng ax + b = 0 (a ≠ 0), quy tắc chuyển vế và quy tắc nhân với một số.',
    mathFormula: 'ax + b = 0 \\iff ax = -b \\iff x = -\\frac{b}{a} \\quad (a \\neq 0)',
    downloadCount: 142,
  },
  {
    id: 'les-002',
    title: 'Bài tập trắc nghiệm Chương I: Phép nhân và chia đa thức',
    subject: 'Toán',
    grade: 8,
    chapter: 'Chương I: Đa thức',
    category: 'phieu_bai_tap',
    fileType: 'PDF',
    date: '10/10/2024',
    isPublic: true,
    description: 'Tập hợp 50 câu trắc nghiệm rèn luyện 7 hằng đẳng thức đáng nhớ có đáp án chi tiết.',
    mathFormula: '(a \\pm b)^2 = a^2 \\pm 2ab + b^2, \\quad a^2 - b^2 = (a-b)(a+b)',
    downloadCount: 230,
  },
  {
    id: 'les-003',
    title: 'Giáo án: Hàm số bậc nhất và đồ thị y = ax + b',
    subject: 'Toán',
    grade: 8,
    chapter: 'Chương II: Hàm số bậc nhất',
    category: 'giao_an_ppt',
    fileType: 'PPTX',
    date: '08/10/2024',
    isPublic: false,
    description: 'Slide bài giảng tương tác vẽ đồ thị hàm số, xác định tọa độ giao điểm với hai trục Oxy.',
    mathFormula: 'y = ax + b \\quad (a \\neq 0)',
    downloadCount: 95,
  },
  {
    id: 'les-004',
    title: 'Giáo án (Toán - Tin học): Thuật toán và cấu trúc rẽ nhánh',
    subject: 'Tin học',
    grade: 8,
    chapter: 'Chủ đề 3: Tư duy thuật toán',
    category: 'pdf_giao_an',
    fileType: 'PDF',
    date: '05/10/2024',
    isPublic: true,
    description: 'Kế hoạch bài dạy thiết kế sơ đồ khối và viết chương trình rẽ nhánh cơ bản trong Python.',
    downloadCount: 178,
  },
  {
    id: 'les-005',
    title: 'Phiếu bài tập: Định lý Pythagore và ứng dụng trong thực tế',
    subject: 'Toán',
    grade: 8,
    chapter: 'Chương IV: Tam giác đồng dạng và hình học',
    category: 'phieu_bai_tap',
    fileType: 'PDF',
    date: '02/10/2024',
    isPublic: true,
    description: 'Hệ thống bài tập thực hành tính khoảng cách, chiều cao cây, độ nghiêng thang bằng định lý Pythagore.',
    mathFormula: 'BC^2 = AB^2 + AC^2 \\implies BC = \\sqrt{AB^2 + AC^2}',
    downloadCount: 312,
  },
  {
    id: 'les-006',
    title: 'Video thực hành: Xử lý dữ liệu bảng tính với hàm SUM, AVERAGE, IF',
    subject: 'Tin học',
    grade: 8,
    chapter: 'Chủ đề 4: Ứng dụng tin học',
    category: 'video',
    fileType: 'VIDEO',
    date: '28/09/2024',
    isPublic: true,
    description: 'Video hướng dẫn thao tác nhập công thức, định dạng có điều kiện trên bảng tính điện tử.',
    downloadCount: 205,
  },
];
