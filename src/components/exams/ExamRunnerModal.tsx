import React, { useState, useEffect } from 'react';
import { Exam, Question } from '../../types';
import confetti from 'canvas-confetti';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Send,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react';

interface ExamRunnerModalProps {
  exam: Exam;
  studentName: string;
  studentCode: string;
  className: string;
  onClose: () => void;
  onSubmit: (answers: Record<string, string>, autoScore: number) => void;
}

export const ExamRunnerModal: React.FC<ExamRunnerModalProps> = ({
  exam,
  studentName,
  studentCode,
  className,
  onClose,
  onSubmit,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(exam.durationMinutes * 60);
  const [isFinished, setIsFinished] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [resultScore, setResultScore] = useState<number | null>(null);

  // Countdown Timer
  useEffect(() => {
    if (isFinished || secondsRemaining <= 0) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining, isFinished]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentQ: Question | undefined = exam.questions[currentIdx];

  const handleSelectAnswer = (qId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  // Calculate Auto Score for objective questions
  const calculateObjectiveScore = (): number => {
    let score = 0;
    exam.questions.forEach((q) => {
      const userAns = answers[q.id];
      if (!userAns) return;

      if (q.type === 'mcq4') {
        if (userAns.trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
          score += q.points;
        }
      } else if (q.type === 'boolean') {
        const boolUser = userAns === 'true';
        if (boolUser === Boolean(q.correctAnswer)) {
          score += q.points;
        }
      } else if (q.type === 'short') {
        if (userAns.trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
          score += q.points;
        }
      }
    });
    return score;
  };

  const handleAutoSubmit = () => {
    const autoScore = calculateObjectiveScore();
    setResultScore(autoScore);
    setIsFinished(true);
    onSubmit(answers, autoScore);

    // Trigger celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  };

  const totalAnswered = Object.keys(answers).length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full min-h-[580px] flex flex-col justify-between shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header of Exam Room */}
        <div className="bg-[#082B60] text-white p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#168BFF] text-white px-2 py-0.5 rounded-full font-bold">
                PHÒNG THI TRỰC TUYẾN
              </span>
              <span className="text-xs text-cyan-200 font-mono">
                {studentCode} · {studentName} ({className})
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">{exam.title}</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Countdown Badge */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-extrabold border ${
                secondsRemaining < 180
                  ? 'bg-red-500/30 border-red-400 text-red-200 animate-pulse'
                  : 'bg-white/10 border-white/20 text-cyan-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            <button
              onClick={() => {
                if (confirm('Bạn có chắc muốn thoát phòng thi? Bài làm hiện tại sẽ không được nộp.')) {
                  onClose();
                }
              }}
              className="text-white/60 hover:text-white p-1 rounded-lg"
              title="Đóng phòng thi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Finished Screen */}
        {isFinished ? (
          <div className="p-8 text-center flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#16A765] flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-[#082B60]">
              Đã Nộp Bài Kiểm Tra Thành Công!
            </h3>
            <p className="text-sm text-slate-600 max-w-md">
              Hệ thống đã tự động ghi nhận câu trả lời của em <strong>{studentName}</strong>.
            </p>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl max-w-sm w-full">
              <div className="text-xs text-slate-500 font-bold uppercase">
                Điểm Trắc Nghiệm Tự Động
              </div>
              <div className="text-4xl font-black text-[#1565D8] my-1">
                {resultScore} điểm
              </div>
              <div className="text-xs text-slate-600">
                (Phần câu hỏi tự luận sẽ được GV. Diệp Thanh Toàn chấm duyệt sau)
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#1565D8] text-white text-sm font-bold hover:bg-blue-700 shadow-md"
            >
              Quay lại danh mục
            </button>
          </div>
        ) : (
          /* Ongoing Test Screen */
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
            {/* Left Column: Question Navigator */}
            <div className="md:col-span-4 bg-slate-50 border-r border-slate-200 p-4 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                  <span>Bảng câu hỏi ({exam.questions.length} câu)</span>
                  <span className="text-[#1565D8]">
                    Đã trả lời: {totalAnswered}/{exam.questions.length}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {exam.questions.map((q, idx) => {
                    const isAnswered = answers[q.id] !== undefined && answers[q.id].trim() !== '';
                    const isCurrent = currentIdx === idx;

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIdx(idx)}
                        className={`py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                          isCurrent
                            ? 'bg-[#1565D8] text-white shadow-md scale-105 ring-2 ring-blue-300'
                            : isAnswered
                            ? 'bg-emerald-100 text-[#16A765] border border-emerald-300'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    Đã làm
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
                    Chưa làm
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1565D8] inline-block" />
                    Đang chọn
                  </div>
                </div>

                <button
                  onClick={() => setShowConfirmSubmit(true)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#16A765] to-emerald-600 text-white text-xs font-bold hover:brightness-110 shadow-md flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Nộp bài thi ngay
                </button>
              </div>
            </div>

            {/* Right Column: Active Question Stage */}
            <div className="md:col-span-8 p-6 flex flex-col justify-between overflow-y-auto">
              {currentQ ? (
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-4">
                    <span className="text-xs font-bold text-[#1565D8] bg-blue-50 px-2.5 py-1 rounded-lg">
                      Câu {currentIdx + 1} / {exam.questions.length} ({currentQ.points} điểm)
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {currentQ.type === 'mcq4'
                        ? 'Trắc nghiệm 4 lựa chọn'
                        : currentQ.type === 'boolean'
                        ? 'Đúng / Sai'
                        : currentQ.type === 'short'
                        ? 'Trả lời ngắn'
                        : 'Tự luận'}
                    </span>
                  </div>

                  {/* Question Prompt */}
                  <h3 className="text-base font-bold text-slate-900 mb-5 leading-relaxed">
                    {currentQ.prompt}
                  </h3>

                  {/* MCQ4 Options */}
                  {currentQ.type === 'mcq4' && currentQ.options && (
                    <div className="space-y-2.5">
                      {currentQ.options.map((opt, oIdx) => {
                        const optLetter = String.fromCharCode(65 + oIdx);
                        const isSelected = answers[currentQ.id] === opt;

                        return (
                          <div
                            key={oIdx}
                            onClick={() => handleSelectAnswer(currentQ.id, opt)}
                            className={`p-3.5 rounded-xl border text-sm font-serif cursor-pointer transition-all flex items-center gap-3 ${
                              isSelected
                                ? 'border-[#1565D8] bg-blue-50/70 text-[#082B60] font-bold shadow-sm'
                                : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 font-mono ${
                                isSelected
                                  ? 'bg-[#1565D8] text-white'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {optLetter}
                            </span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Boolean Options */}
                  {currentQ.type === 'boolean' && (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleSelectAnswer(currentQ.id, 'true')}
                        className={`p-4 rounded-xl border text-base font-bold transition-all ${
                          answers[currentQ.id] === 'true'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm'
                            : 'border-slate-200 hover:border-emerald-300 bg-white text-slate-700'
                        }`}
                      >
                        ĐÚNG
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectAnswer(currentQ.id, 'false')}
                        className={`p-4 rounded-xl border text-base font-bold transition-all ${
                          answers[currentQ.id] === 'false'
                            ? 'border-red-500 bg-red-50 text-red-800 shadow-sm'
                            : 'border-slate-200 hover:border-red-300 bg-white text-slate-700'
                        }`}
                      >
                        SAI
                      </button>
                    </div>
                  )}

                  {/* Short Answer */}
                  {currentQ.type === 'short' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Nhập kết quả ngắn gọn (số hoặc từ khóa):
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập câu trả lời..."
                        value={answers[currentQ.id] || ''}
                        onChange={(e) => handleSelectAnswer(currentQ.id, e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#1565D8]"
                      />
                    </div>
                  )}

                  {/* Essay Answer */}
                  {currentQ.type === 'essay' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Trình bày bài giải / bài luận chi tiết:
                      </label>
                      <textarea
                        rows={6}
                        placeholder="Em hãy trình bày các bước chứng minh hoặc giải thích chi tiết..."
                        value={answers[currentQ.id] || ''}
                        onChange={(e) => handleSelectAnswer(currentQ.id, e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed focus:ring-2 focus:ring-[#1565D8]"
                      />
                    </div>
                  )}
                </div>
              ) : null}

              {/* Prev / Next Buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-6">
                <button
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  disabled={currentIdx === 0}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Câu trước
                </button>

                {currentIdx < exam.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx((i) => Math.min(exam.questions.length - 1, i + 1))}
                    className="px-5 py-2 rounded-xl bg-[#1565D8] text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1 shadow-sm"
                  >
                    Câu tiếp theo
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConfirmSubmit(true)}
                    className="px-5 py-2 rounded-xl bg-[#16A765] text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1 shadow-sm"
                  >
                    Hoàn tất nộp bài
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Submission Dialog */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">Xác Nhận Nộp Bài</h3>
            </div>
            <p className="text-sm text-slate-600 mb-2">
              Em đã trả lời <strong>{totalAnswered}</strong> trên tổng số{' '}
              <strong>{exam.questions.length}</strong> câu hỏi.
            </p>
            {totalAnswered < exam.questions.length && (
              <p className="text-xs text-red-600 font-bold mb-4">
                ⚠️ Lưu ý: Vẫn còn {exam.questions.length - totalAnswered} câu chưa có câu trả lời!
              </p>
            )}
            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Tiếp tục làm
              </button>
              <button
                onClick={() => {
                  setShowConfirmSubmit(false);
                  handleAutoSubmit();
                }}
                className="px-5 py-2 rounded-xl bg-[#16A765] text-white text-xs font-bold hover:bg-emerald-700"
              >
                Đồng ý nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
