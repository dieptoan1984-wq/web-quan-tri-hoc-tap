import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Exam, ExamSubmission, Question, SubjectType, ExamType } from '../../types';
import { ExamRunnerModal } from './ExamRunnerModal';
import * as XLSX from 'xlsx';
import {
  FileCheck2,
  Clock,
  Plus,
  Play,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Download,
  Users,
  Award,
  BookOpen,
  Send,
  X,
  FileText,
  Lock,
  Unlock,
} from 'lucide-react';

export const ExamManager: React.FC = () => {
  const {
    exams,
    submissions,
    userRole,
    classes,
    students,
    teacherProfile,
    currentStudentId,
    addExam,
    toggleExamOpen,
    submitExam,
    gradeEssay,
  } = useApp();

  // Active Runner State
  const [runningExam, setRunningExam] = useState<Exam | null>(null);

  // Submissions Modal State
  const [viewingSubmissionsExam, setViewingSubmissionsExam] = useState<Exam | null>(null);
  const [gradingSubmission, setGradingSubmission] = useState<ExamSubmission | null>(null);
  const [essayScoreInput, setEssayScoreInput] = useState<number>(0);
  const [teacherFeedbackInput, setTeacherFeedbackInput] = useState<string>('');

  // Create Exam Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<SubjectType>('Toán');
  const [newType, setNewType] = useState<ExamType>('15p');
  const [newDuration, setNewDuration] = useState<number>(15);
  const [newClasses, setNewClasses] = useState<string[]>(['8A1', '8A2', '8A3', '8A4']);
  const [newQuestions, setNewQuestions] = useState<Question[]>([
    {
      id: 'q-new-1',
      type: 'mcq4',
      prompt: 'Hằng đẳng thức (a - b)² bằng:',
      options: ['a² - 2ab + b²', 'a² + 2ab + b²', 'a² - b²', '(a-b)(a+b)'],
      correctAnswer: 'a² - 2ab + b²',
      points: 2,
    },
    {
      id: 'q-new-2',
      type: 'boolean',
      prompt: 'Trong hình vuông, hai đường chéo bằng nhau và vuông góc với nhau. Đúng hay Sai?',
      correctAnswer: true,
      points: 2,
    },
    {
      id: 'q-new-3',
      type: 'short',
      prompt: 'Tính nhanh: 99² = ?',
      correctAnswer: '9801',
      points: 2,
    },
    {
      id: 'q-new-4',
      type: 'essay',
      prompt: 'Nêu định nghĩa và dấu hiệu nhận biết của hình bình hành.',
      correctAnswer: 'Tứ giác có các cạnh đối song song là hình bình hành.',
      points: 4,
    },
  ]);

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];

  const handleStartExam = (exam: Exam) => {
    if (!exam.isOpen) {
      alert('Đề kiểm tra hiện đang khóa bởi giáo viên.');
      return;
    }
    setRunningExam(exam);
  };

  const handleFinishExamSubmission = (answers: Record<string, string>, autoScore: number) => {
    if (!runningExam) return;
    submitExam({
      examId: runningExam.id,
      examTitle: runningExam.title,
      studentId: currentStudent.id,
      studentName: currentStudent.fullName,
      studentCode: currentStudent.studentCode,
      className: currentStudent.className,
      answers,
      autoScore,
      essayScore: null,
      totalScore: autoScore,
      status: 'auto_graded',
    });
  };

  const handleSaveEssayGrade = () => {
    if (!gradingSubmission) return;
    gradeEssay(gradingSubmission.id, essayScoreInput, teacherFeedbackInput);
    setGradingSubmission(null);
    alert('Đã lưu điểm và nhận xét bài tự luận thành công!');
  };

  const exportSubmissionsExcel = (exam: Exam) => {
    const list = submissions.filter((s) => s.examId === exam.id);
    const data = list.map((s, idx) => ({
      STT: idx + 1,
      'Mã Học Sinh': s.studentCode,
      'Họ và Tên': s.studentName,
      Lớp: s.className,
      'Thời Gian Nộp': s.submittedAt,
      'Điểm Trắc Nghiệm': s.autoScore,
      'Điểm Tự Luận': s.essayScore ?? 'Chưa chấm',
      'Tổng Điểm': s.totalScore,
      'Trạng Thái': s.status === 'fully_graded' ? 'Đã chấm xong' : 'Chờ chấm tự luận',
      'Nhận Xét': s.teacherFeedback || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'KetQuaThi');
    XLSX.writeFile(workbook, `KetQuaThi_${exam.title.slice(0, 25)}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleSaveNewExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addExam({
      title: newTitle.trim(),
      subject: newSubject,
      grade: 8,
      type: newType,
      durationMinutes: newDuration,
      totalQuestions: newQuestions.length,
      isOpen: true,
      assignedClasses: newClasses,
      questions: newQuestions,
      showResultImmediate: true,
    });
    setIsCreateOpen(false);
    alert('Đã tạo đề kiểm tra thành công và giao cho các lớp!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#1565D8] font-bold text-sm mb-1">
            <FileCheck2 className="w-4 h-4" />
            <span>Phân hệ Kiểm Tra Trực Tuyến & Chấm Điểm Tự Động</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#082B60]">
            Ngân Hàng Đề Kiểm Tra & Quản Lý Phòng Thi
          </h1>
          <p className="text-sm text-slate-500">
            {userRole === 'teacher'
              ? 'Tổ chức thi, hẹn giờ mở đề, tự động chấm trắc nghiệm & chấm bài tự luận'
              : `Góc làm bài thi của học sinh: ${currentStudent.fullName} (Lớp ${currentStudent.className})`}
          </p>
        </div>

        {userRole === 'teacher' && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#1565D8] text-white text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            Tạo đề kiểm tra mới
          </button>
        )}
      </div>

      {/* Main Exams List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exams.map((ex) => {
          const exSubmissions = submissions.filter((s) => s.examId === ex.id);
          const studentSub = submissions.find(
            (s) => s.examId === ex.id && s.studentId === currentStudent.id
          );

          return (
            <div
              key={ex.id}
              className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      ex.type === '15p'
                        ? 'bg-blue-100 text-[#1565D8]'
                        : ex.type === 'giua_ky'
                        ? 'bg-emerald-100 text-[#16A765]'
                        : 'bg-purple-100 text-[#7655DF]'
                    }`}
                  >
                    {ex.type === '15p' ? '15 Phút' : ex.type === 'giua_ky' ? 'Giữa Kỳ' : 'Cuối Kỳ'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {userRole === 'teacher' ? (
                      <button
                        onClick={() => toggleExamOpen(ex.id)}
                        className={`text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors ${
                          ex.isOpen
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-600 border border-red-200'
                        }`}
                        title="Bấm để đóng/mở đề"
                      >
                        {ex.isOpen ? (
                          <>
                            <Unlock className="w-3 h-3" /> Đang mở
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" /> Đã đóng
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">
                        {ex.isOpen ? '🟢 Mở đề' : '🔒 Đóng đề'}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#082B60] mb-2 leading-snug">
                  {ex.title}
                </h3>

                <div className="text-xs text-slate-500 space-y-1 mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Môn: {ex.subject} · Khối {ex.grade}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Thời gian làm bài: {ex.durationMinutes} phút · {ex.questions.length} câu hỏi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Lớp áp dụng: {ex.assignedClasses.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions based on User Role */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {userRole === 'teacher' ? (
                  <>
                    <button
                      onClick={() => setViewingSubmissionsExam(ex)}
                      className="text-xs font-bold text-[#1565D8] hover:text-[#082B60] flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Xem {exSubmissions.length} bài nộp
                    </button>

                    <button
                      onClick={() => handleStartExam(ex)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" />
                      Thi thử nghiệm
                    </button>
                  </>
                ) : (
                  <>
                    {studentSub ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Đã nộp bài
                        </span>
                        <span className="text-xs font-mono font-extrabold text-[#1565D8] bg-blue-50 px-2.5 py-1 rounded-lg">
                          Điểm: {studentSub.totalScore}/10
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartExam(ex)}
                        disabled={!ex.isOpen}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-[#1565D8] to-[#168BFF] text-white text-xs font-bold hover:brightness-110 shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-40"
                      >
                        <Play className="w-4 h-4" />
                        Bắt đầu làm bài
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTIVE EXAM RUNNER MODAL */}
      {runningExam && (
        <ExamRunnerModal
          exam={runningExam}
          studentName={userRole === 'teacher' ? teacherProfile.fullName : currentStudent.fullName}
          studentCode={userRole === 'teacher' ? 'GV-TEST' : currentStudent.studentCode}
          className={userRole === 'teacher' ? '8A1' : currentStudent.className}
          onClose={() => setRunningExam(null)}
          onSubmit={handleFinishExamSubmission}
        />
      )}

      {/* DRAWER / MODAL: Danh sách bài nộp & Chấm tự luận (Teacher View) */}
      {viewingSubmissionsExam && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col justify-between p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#082B60]">
                    Danh Sách Học Sinh Nộp Bài: {viewingSubmissionsExam.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tự động chấm trắc nghiệm & hỗ trợ giáo viên chấm bài tự luận trực tiếp
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportSubmissionsExcel(viewingSubmissionsExam)}
                    className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Xuất Excel
                  </button>
                  <button
                    onClick={() => setViewingSubmissionsExam(null)}
                    className="text-slate-400 hover:text-slate-700 p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Submissions Table */}
              <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#082B60] text-white text-xs uppercase font-semibold">
                    <tr>
                      <th className="py-2.5 px-3 text-center">STT</th>
                      <th className="py-2.5 px-3">Mã HS</th>
                      <th className="py-2.5 px-3">Họ và Tên</th>
                      <th className="py-2.5 px-3 text-center">Lớp</th>
                      <th className="py-2.5 px-3 text-center">Thời gian nộp</th>
                      <th className="py-2.5 px-3 text-center">Điểm trắc nghiệm</th>
                      <th className="py-2.5 px-3 text-center">Điểm tự luận</th>
                      <th className="py-2.5 px-3 text-center">Tổng điểm</th>
                      <th className="py-2.5 px-3 text-center">Trạng thái</th>
                      <th className="py-2.5 px-3 text-right">Chấm bài</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-serif">
                    {submissions.filter((s) => s.examId === viewingSubmissionsExam.id).length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-slate-400">
                          Chưa có học sinh nào nộp bài kiểm tra này.
                        </td>
                      </tr>
                    ) : (
                      submissions
                        .filter((s) => s.examId === viewingSubmissionsExam.id)
                        .map((sub, idx) => (
                          <tr key={sub.id} className="hover:bg-blue-50/50">
                            <td className="py-2.5 px-3 text-center text-slate-500 font-mono">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-[#1565D8]">
                              {sub.studentCode}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-slate-800">
                              {sub.studentName}
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-[#082B60]">
                              {sub.className}
                            </td>
                            <td className="py-2.5 px-3 text-center text-xs text-slate-500 font-mono">
                              {sub.submittedAt}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700">
                              {sub.autoScore} đ
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-600">
                              {sub.essayScore !== null ? `${sub.essayScore} đ` : 'Chờ chấm'}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-black text-emerald-600 text-base">
                              {sub.totalScore}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                                  sub.status === 'fully_graded'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                {sub.status === 'fully_graded' ? 'Đã chấm xong' : 'Chờ chấm tự luận'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => {
                                  setGradingSubmission(sub);
                                  setEssayScoreInput(sub.essayScore ?? 2);
                                  setTeacherFeedbackInput(sub.teacherFeedback || '');
                                }}
                                className="px-2.5 py-1 rounded bg-[#1565D8] text-white text-xs font-bold hover:bg-blue-700"
                              >
                                Chấm bài
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingSubmissionsExam(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700"
              >
                Đóng danh sách
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Chấm Bài Tự Luận Thủ Công */}
      {gradingSubmission && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#082B60]">
                  Chấm Bài Tự Luận: {gradingSubmission.studentName} ({gradingSubmission.className})
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Mã HS: {gradingSubmission.studentCode} · Điểm trắc nghiệm hiện tại: {gradingSubmission.autoScore} điểm
                </p>
              </div>
              <button
                onClick={() => setGradingSubmission(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm max-h-[60vh] overflow-y-auto">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 block mb-1">
                  Bài làm của học sinh cho câu hỏi tự luận:
                </span>
                <p className="font-serif italic text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {gradingSubmission.answers['q-110'] ||
                    gradingSubmission.answers['q-206'] ||
                    gradingSubmission.answers['q-304'] ||
                    'Học sinh đã nộp bài tự luận đầy đủ.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Điểm tự luận cho học sinh (0.0 – 4.0):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    step="0.5"
                    value={essayScoreInput}
                    onChange={(e) => setEssayScoreInput(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold font-mono focus:ring-2 focus:ring-[#1565D8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tổng điểm sau khi chấm:
                  </label>
                  <div className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-base font-black font-mono text-[#1565D8]">
                    {Math.min(10, Math.round((gradingSubmission.autoScore + essayScoreInput) * 10) / 10)} / 10 điểm
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lời nhận xét & ghi chú của giáo viên:
                </label>
                <textarea
                  rows={3}
                  value={teacherFeedbackInput}
                  onChange={(e) => setTeacherFeedbackInput(e.target.value)}
                  placeholder="Ví dụ: Em đã áp dụng đúng quy tắc, lập luận chặt chẽ..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#1565D8]"
                />
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setGradingSubmission(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveEssayGrade}
                className="px-5 py-2 rounded-xl bg-[#16A765] text-white text-xs font-bold hover:bg-emerald-700 shadow-sm"
              >
                Lưu điểm & Nhận xét
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Tạo Đề Kiểm Tra Mới */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-[#082B60]">
                Tạo Đề Kiểm Tra Trực Tuyến Mới
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewExam} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề đề thi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Đề kiểm tra 15 phút - Toán 8 - Chủ đề..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bộ môn
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as SubjectType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                  >
                    <option value="Toán">Toán học</option>
                    <option value="Tin học">Tin học</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hình thức
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ExamType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                  >
                    <option value="15p">15 phút</option>
                    <option value="giua_ky">Giữa kỳ (45 phút)</option>
                    <option value="cuoi_ky">Cuối kỳ (60 phút)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Thời gian làm (phút)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="90"
                    value={newDuration}
                    onChange={(e) => setNewDuration(parseInt(e.target.value) || 15)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#1565D8]"
                  />
                </div>
              </div>

              {/* Questions Summary */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Cấu trúc câu hỏi mẫu kèm theo ({newQuestions.length} câu):
                </span>
                <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
                  <li>Câu 1: Trắc nghiệm 4 lựa chọn (2 điểm)</li>
                  <li>Câu 2: Câu hỏi Đúng / Sai (2 điểm)</li>
                  <li>Câu 3: Trả lời ngắn điền kết quả (2 điểm)</li>
                  <li>Câu 4: Câu hỏi tự luận trình bày chi tiết (4 điểm)</li>
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1565D8] text-white text-xs font-bold hover:bg-blue-700 shadow-sm"
                >
                  Tạo đề & Mở thi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
