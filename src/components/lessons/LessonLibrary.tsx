import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LessonMaterial, SubjectType, GradeLevel, LessonCategory } from '../../types';
import {
  BookOpen,
  Search,
  Plus,
  Video,
  FileText,
  FileSpreadsheet,
  Download,
  Eye,
  Filter,
  CheckCircle2,
  Lock,
  Globe,
  Trash2,
  X,
  Share2,
} from 'lucide-react';

export const LessonLibrary: React.FC = () => {
  const { lessons, addLesson, deleteLesson, incrementLessonDownload, userRole } = useApp();

  // Filters
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | 'all'>('all');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>(8);
  const [selectedCategory, setSelectedCategory] = useState<LessonCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [previewingLesson, setPreviewingLesson] = useState<LessonMaterial | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<SubjectType>('Toán');
  const [grade, setGrade] = useState<GradeLevel>(8);
  const [chapter, setChapter] = useState('Chương I: Đa thức');
  const [category, setCategory] = useState<LessonCategory>('pdf_giao_an');
  const [fileType, setFileType] = useState<'PDF' | 'DOCX' | 'PPTX' | 'VIDEO' | 'OTHER'>('PDF');
  const [description, setDescription] = useState('');
  const [mathFormula, setMathFormula] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // Filtered Lessons
  const filteredLessons = useMemo(() => {
    return lessons.filter((les) => {
      const matchSubject = selectedSubject === 'all' || les.subject === selectedSubject;
      const matchGrade = selectedGrade === 'all' || les.grade === selectedGrade;
      const matchCategory = selectedCategory === 'all' || les.category === selectedCategory;
      const matchSearch =
        les.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        les.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        les.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchPublic = userRole === 'teacher' ? true : les.isPublic;

      return matchSubject && matchGrade && matchCategory && matchSearch && matchPublic;
    });
  }, [lessons, selectedSubject, selectedGrade, selectedCategory, searchQuery, userRole]);

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addLesson({
      title: title.trim(),
      subject,
      grade,
      chapter: chapter.trim(),
      category,
      fileType,
      description: description.trim(),
      mathFormula: mathFormula.trim() || undefined,
      isPublic,
    });
    setIsAddOpen(false);
    alert('Đã thêm tài liệu học liệu mới thành công!');
  };

  const handleDownload = (lesson: LessonMaterial) => {
    incrementLessonDownload(lesson.id);
    alert(`Đang tải tệp học liệu: "${lesson.title}.${lesson.fileType.toLowerCase()}"...`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#1565D8] font-bold text-sm mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Phân hệ Thư Viện Học Liệu & Bài Giảng Điện Tử</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#082B60]">
            Kho Học Liệu Môn Toán & Tin Học THCS
          </h1>
          <p className="text-sm text-slate-500">
            Giáo án, video bài giảng trực quan, phiếu bài tập và công thức Toán học
          </p>
        </div>

        {userRole === 'teacher' && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#1565D8] text-white text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            Tải lên tài liệu mới
          </button>
        )}
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Subject Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="font-bold text-slate-700">Môn:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold"
            >
              <option value="all">Tất cả môn</option>
              <option value="Toán">Toán học</option>
              <option value="Tin học">Tin học</option>
            </select>
          </div>

          {/* Grade Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="font-bold text-slate-700">Khối:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value === 'all' ? 'all' : (Number(e.target.value) as any))}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold"
            >
              <option value="all">Tất cả khối</option>
              <option value={6}>Khối 6</option>
              <option value={7}>Khối 7</option>
              <option value={8}>Khối 8</option>
              <option value={9}>Khối 9</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="font-bold text-slate-700">Chuyên mục:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold"
            >
              <option value="all">Tất cả chuyên mục</option>
              <option value="pdf_giao_an">Giáo án PDF</option>
              <option value="video">Video bài giảng</option>
              <option value="phieu_bai_tap">Phiếu bài tập</option>
              <option value="giao_an_ppt">Bài giảng điện tử (PPT)</option>
              <option value="tai_lieu_khac">Tài liệu tham khảo khác</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên bài học hoặc chủ đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Grid of Materials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLessons.map((les) => (
          <div
            key={les.id}
            className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    les.fileType === 'VIDEO'
                      ? 'bg-blue-100 text-[#1565D8]'
                      : les.fileType === 'PDF'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-orange-100 text-orange-600'
                  }`}
                >
                  {les.fileType}
                </span>

                <span className="text-[11px] text-slate-400 font-mono">
                  {les.date}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#082B60] mb-1.5 leading-snug">
                {les.title}
              </h3>

              <div className="text-xs text-slate-500 font-medium mb-3">
                {les.subject} {les.grade} · {les.chapter}
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                {les.description}
              </p>

              {/* Math Formula Card Preview if available */}
              {les.mathFormula && (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl mb-3 text-center">
                  <div className="text-[10px] text-slate-400 font-mono mb-0.5">Công thức trọng tâm:</div>
                  <div className="text-xs font-mono font-bold text-[#1565D8] tracking-wide">
                    {les.mathFormula}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {les.downloadCount} lượt tải
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPreviewingLesson(les)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Xem chi tiết
                </button>
                <button
                  onClick={() => handleDownload(les)}
                  className="px-3 py-1 rounded-lg bg-[#1565D8] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Tải về
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Xem trước chi tiết bài học */}
      {previewingLesson && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-xs font-bold text-[#1565D8] uppercase tracking-wider">
                  {previewingLesson.subject} {previewingLesson.grade}
                </span>
                <h3 className="text-lg font-bold text-[#082B60]">
                  {previewingLesson.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewingLesson(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm font-serif">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs text-slate-600">
                <div>• Chủ đề: <strong>{previewingLesson.chapter}</strong></div>
                <div>• Định dạng tệp: <strong>{previewingLesson.fileType}</strong></div>
                <div>• Ngày phát hành: <strong>{previewingLesson.date}</strong></div>
                <div>• Trạng thái: <strong>{previewingLesson.isPublic ? 'Công khai cho học sinh' : 'Nội bộ giáo viên'}</strong></div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-1">Tóm tắt nội dung bài học:</h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {previewingLesson.description}
                </p>
              </div>

              {previewingLesson.mathFormula && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
                  <div className="text-xs font-bold text-slate-500 mb-1">Biểu thức & Công thức Toán học:</div>
                  <div className="text-base font-extrabold text-[#082B60] font-mono py-1">
                    {previewingLesson.mathFormula}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {previewingLesson.downloadCount} lượt tải về
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewingLesson(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Đóng
                </button>
                <button
                  onClick={() => handleDownload(previewingLesson)}
                  className="px-5 py-2 rounded-xl bg-[#1565D8] text-white text-xs font-bold hover:bg-blue-700 shadow-sm flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Tải tệp học liệu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Thêm Bài Giảng Mới */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-[#082B60]">
                Tải Lên Học Liệu & Bài Giảng Mới
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề bài giảng / tài liệu *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bài giảng: Định lý Pythagore..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bộ môn
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as SubjectType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                  >
                    <option value="Toán">Toán học</option>
                    <option value="Tin học">Tin học</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Khối lớp
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value) as GradeLevel)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                  >
                    <option value={6}>Khối 6</option>
                    <option value={7}>Khối 7</option>
                    <option value={8}>Khối 8</option>
                    <option value={9}>Khối 9</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Định dạng
                  </label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="PPTX">PPTX</option>
                    <option value="VIDEO">Video</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chương / Chủ đề
                </label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô tả ngắn gọn nội dung
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nêu tóm tắt mục tiêu bài học..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#1565D8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Công thức Toán học trọng tâm (nếu có):
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: a² + b² = c²"
                  value={mathFormula}
                  onChange={(e) => setMathFormula(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#1565D8]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPub"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded text-[#1565D8]"
                />
                <label htmlFor="isPub" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Công khai cho học sinh xem và tải về
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1565D8] text-white text-xs font-bold hover:bg-blue-700 shadow-sm"
                >
                  Lưu bài giảng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
