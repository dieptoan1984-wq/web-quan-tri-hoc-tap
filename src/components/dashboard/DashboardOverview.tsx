import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Presentation,
  FileText,
  TrendingUp,
  MoreHorizontal,
  Trophy,
  ArrowUpRight,
  PieChart as PieIcon,
  Clock,
  CheckCircle2,
  FileCheck,
  Video,
  FileSpreadsheet,
  BookOpen,
  Eye,
  Lock,
  ShieldCheck,
  Settings,
  History,
  KeyRound,
  MousePointer,
  Minus,
  Sparkles,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const {
    students,
    classes,
    exams,
    lessons,
    teacherProfile,
    setActiveTab,
    setSelectedSimulation,
    userRole,
    setUserRole,
    setCurrentStudentId,
    updateTeacherProfile,
  } = useApp();

  const [selectedSemester, setSelectedSemester] = useState<'HK1' | 'HK2'>('HK1');
  const [libraryFilter, setLibraryFilter] = useState<string>('all');
  const [twoFactorActive, setTwoFactorActive] = useState<boolean>(teacherProfile.twoFactorEnabled);

  // Interactive Mini-Simulation in Card 5: Interactive Triangle ABC
  const [vertexA, setVertexA] = useState({ x: 150, y: 40 });
  const [vertexB, setVertexB] = useState({ x: 60, y: 160 });
  const [vertexC, setVertexC] = useState({ x: 240, y: 160 });
  const [isDragging, setIsDragging] = useState<'A' | 'B' | 'C' | null>(null);
  const [showAngles, setShowAngles] = useState(true);
  const [showLengths, setShowLengths] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Math calculation for triangle angles
  const dist = (p1: { x: number; y: number }, p2: { x: number; y: number }) =>
    Math.hypot(p1.x - p2.x, p1.y - p2.y);

  const a = dist(vertexB, vertexC); // opposite to A
  const b = dist(vertexA, vertexC); // opposite to B
  const c = dist(vertexA, vertexB); // opposite to C

  const angleA = Math.round(
    Math.acos(Math.max(-1, Math.min(1, (b * b + c * c - a * a) / (2 * b * c)))) * (180 / Math.PI)
  ) || 60;
  const angleB = Math.round(
    Math.acos(Math.max(-1, Math.min(1, (a * a + c * c - b * b) / (2 * a * c)))) * (180 / Math.PI)
  ) || 60;
  const angleC = Math.max(0, 180 - angleA - angleB);

  // Handle vertex dragging
  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(Math.max(20, Math.min(280, (e.clientX - rect.left) / zoomLevel)));
    const y = Math.round(Math.max(20, Math.min(180, (e.clientY - rect.top) / zoomLevel)));

    if (isDragging === 'A') setVertexA({ x, y });
    if (isDragging === 'B') setVertexB({ x, y });
    if (isDragging === 'C') setVertexC({ x, y });
  };

  // Top highlight students for Card 1
  const highlightStudents = [
    { stt: 1, name: 'Nguyễn Minh Anh', class: '8A1', subject: 'Toán', gpa: 9.2, rank: 'Giỏi', stId: 'st-001' },
    { stt: 2, name: 'Trần Hoàng Nam', class: '8A1', subject: 'Toán', gpa: 8.5, rank: 'Giỏi', stId: 'st-002' },
    { stt: 3, name: 'Lê Thị Bảo Ngọc', class: '8A2', subject: 'Tin học', gpa: 8.8, rank: 'Giỏi', stId: 'st-003' },
    { stt: 4, name: 'Phạm Quang Huy', class: '8A2', subject: 'Toán', gpa: 7.6, rank: 'Khá', stId: 'st-004' },
    { stt: 5, name: 'Đỗ Thị Thu Hà', class: '8A3', subject: 'Tin học', gpa: 8.1, rank: 'Khá', stId: 'st-005' },
  ];

  // Bar chart stats comparing Toán & Tin học for classes
  const chartClasses = [
    { name: '8A1', math: 8.9, tin: 8.4 },
    { name: '8A2', math: 8.1, tin: 7.8 },
    { name: '8A3', math: 7.6, tin: 8.2 },
    { name: '8A4', math: 8.5, tin: 8.0 },
  ];

  return (
    <div className="space-y-6">
      {/* 4 TOP STAT CARDS (Matches mockup exactly) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Tổng học sinh */}
        <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1565D8] flex items-center justify-center shadow-inner">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">Tổng học sinh</div>
              <div className="text-3xl font-extrabold text-[#082B60] tracking-tight">
                {students.length}
              </div>
            </div>
          </div>
          <div className="text-blue-300">
            <Users className="w-6 h-6 opacity-40" />
          </div>
        </div>

        {/* Card 2: Lớp đang quản lý */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#16A765] flex items-center justify-center shadow-inner">
              <Presentation className="w-8 h-8" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">Lớp đang quản lý</div>
              <div className="text-3xl font-extrabold text-[#16A765] tracking-tight">
                {classes.length}
              </div>
            </div>
          </div>
          <div className="text-emerald-300">
            <Users className="w-6 h-6 opacity-40" />
          </div>
        </div>

        {/* Card 3: Bài kiểm tra */}
        <div className="bg-white rounded-2xl p-5 border border-orange-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#F59E0B] flex items-center justify-center shadow-inner">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">Bài kiểm tra</div>
              <div className="text-3xl font-extrabold text-[#F59E0B] tracking-tight">
                {exams.length}
              </div>
            </div>
          </div>
          <div className="text-orange-300">
            <FileCheck className="w-6 h-6 opacity-40" />
          </div>
        </div>

        {/* Card 4: Tỉ lệ hoàn thành */}
        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center border-4 border-[#7655DF]/20 text-[#7655DF] font-bold text-sm">
              92%
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">Tỉ lệ hoàn thành</div>
              <div className="text-3xl font-extrabold text-[#7655DF] tracking-tight">
                92%
              </div>
            </div>
          </div>
          <div className="text-purple-300">
            <TrendingUp className="w-6 h-6 opacity-50" />
          </div>
        </div>
      </div>

      {/* 6 MAIN CONTENT SECTIONS (2 columns of 3 cards on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= CARD 1: Quản lý danh sách học sinh ================= */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-[#1565D8]">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-[#082B60]">
                  Quản lý danh sách học sinh
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('students')}
                className="text-xs font-bold text-[#1565D8] hover:text-[#082B60] flex items-center gap-1 transition-colors"
              >
                Xem tất cả &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs text-slate-500 font-semibold border-b border-slate-200">
                    <th className="pb-2 text-center w-10">STT</th>
                    <th className="pb-2">Họ tên</th>
                    <th className="pb-2">Lớp</th>
                    <th className="pb-2">Môn</th>
                    <th className="pb-2 text-center">Điểm TB</th>
                    <th className="pb-2 text-center">Xếp loại</th>
                    <th className="pb-2 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {highlightStudents.map((st) => (
                    <tr key={st.stt} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-2.5 text-center text-slate-500 font-medium">
                        {st.stt}
                      </td>
                      <td className="py-2.5 font-bold text-slate-800">
                        {st.name}
                      </td>
                      <td className="py-2.5 text-slate-600 font-medium">{st.class}</td>
                      <td className="py-2.5 text-slate-600">{st.subject}</td>
                      <td className="py-2.5 text-center font-bold text-[#082B60]">
                        {st.gpa.toFixed(1)}
                      </td>
                      <td className="py-2.5 text-center">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            st.rank === 'Giỏi'
                              ? 'bg-emerald-100 text-[#16A765]'
                              : 'bg-amber-100 text-[#F59E0B]'
                          }`}
                        >
                          {st.rank}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => {
                            setCurrentStudentId(st.stId);
                            setActiveTab('students');
                          }}
                          className="text-slate-400 hover:text-[#1565D8] p-1 rounded transition-colors"
                          title="Xem chi tiết"
                        >
                          <MoreHorizontal className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Hiển thị 5 / {students.length} học sinh</span>
            <button
              onClick={() => setActiveTab('students')}
              className="text-[#1565D8] font-bold hover:underline"
            >
              Quản lý đầy đủ danh sách & nhập xuất Excel &rarr;
            </button>
          </div>
        </div>

        {/* ================= CARD 2: Thống kê kết quả học tập ================= */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-[#1565D8]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-[#082B60]">
                  Thống kê kết quả học tập
                </h2>
              </div>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value as 'HK1' | 'HK2')}
                className="text-xs bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1565D8]"
              >
                <option value="HK1">Học kỳ I</option>
                <option value="HK2">Học kỳ II</option>
              </select>
            </div>

            {/* Sub-header & Legend */}
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-bold text-slate-700">Điểm trung bình theo lớp</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 font-medium text-slate-600">
                  <span className="w-3 h-3 rounded-sm bg-[#1565D8] inline-block" />
                  Toán
                </div>
                <div className="flex items-center gap-1.5 font-medium text-slate-600">
                  <span className="w-3 h-3 rounded-sm bg-[#24C4E8] inline-block" />
                  Tin học
                </div>
              </div>
            </div>

            {/* Custom Bar Chart Canvas (Matching mockup visually) */}
            <div className="relative h-44 w-full flex items-end justify-between pt-6 pb-2 px-3 border-b border-l border-slate-200">
              {/* Y-axis guideline levels */}
              <div className="absolute left-0 top-0 text-[10px] text-slate-400 font-mono -translate-x-full pr-1">10</div>
              <div className="absolute left-0 top-1/4 text-[10px] text-slate-400 font-mono -translate-x-full pr-1">8</div>
              <div className="absolute left-0 top-2/4 text-[10px] text-slate-400 font-mono -translate-x-full pr-1">6</div>
              <div className="absolute left-0 top-3/4 text-[10px] text-slate-400 font-mono -translate-x-full pr-1">4</div>

              {chartClasses.map((item) => {
                const mathHeight = (item.math / 10) * 100;
                const tinHeight = (item.tin / 10) * 100;

                return (
                  <div key={item.name} className="flex flex-col items-center flex-1 max-w-[70px]">
                    <div className="flex items-end gap-1.5 h-36 w-full justify-center">
                      {/* Math Bar */}
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-bold text-slate-700 mb-1">
                          {item.math.toFixed(1)}
                        </span>
                        <div
                          style={{ height: `${mathHeight}%` }}
                          className="w-4 sm:w-5 bg-[#1565D8] rounded-t hover:brightness-110 transition-all cursor-pointer shadow-sm"
                          title={`${item.name} - Môn Toán: ${item.math}`}
                        />
                      </div>
                      {/* Tin học Bar */}
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-bold text-slate-700 mb-1">
                          {item.tin.toFixed(1)}
                        </span>
                        <div
                          style={{ height: `${tinHeight}%` }}
                          className="w-4 sm:w-5 bg-[#24C4E8] rounded-t hover:brightness-110 transition-all cursor-pointer shadow-sm"
                          title={`${item.name} - Môn Tin học: ${item.tin}`}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-700 mt-2">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom 3 KPI Badges */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#082B60]">8.3</div>
                  <div className="text-[10px] text-slate-500 leading-tight">Điểm TB toàn khối</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#16A765] flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#16A765]">+0.5</div>
                  <div className="text-[10px] text-slate-500 leading-tight">So với học kỳ trước</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1565D8] flex items-center justify-center shrink-0">
                  <PieIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#1565D8]">95%</div>
                  <div className="text-[10px] text-slate-500 leading-tight">Học sinh đạt từ TB trở lên</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CARD 3: Kiểm tra trực tuyến & chấm điểm tự động ================= */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-[#1565D8]">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-[#082B60]">
                  Kiểm tra trực tuyến & chấm điểm tự động
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('exams')}
                className="text-xs font-bold text-[#1565D8] hover:text-[#082B60] transition-colors"
              >
                Quản lý đề thi &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {/* Exam 1: 15 Phút */}
              <div className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors flex items-center justify-between gap-3 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1565D8] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#082B60]">
                      Đề kiểm tra 15 phút
                    </h3>
                    <p className="text-xs text-slate-600">
                      Toán 8 – Chương I: Phép nhân đa thức
                    </p>
                    <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-0.5">
                      <span>📄 10 câu hỏi</span>
                      <span>⏱️ 15 phút</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('exams')}
                  className="px-3 py-1.5 rounded-lg bg-[#1565D8] text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm shrink-0"
                >
                  Tạo đề
                </button>
              </div>

              {/* Exam 2: Giữa kỳ */}
              <div className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors flex items-center justify-between gap-3 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#16A765] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#082B60]">
                      Đề kiểm tra giữa kỳ
                    </h3>
                    <p className="text-xs text-slate-600">
                      Tin học 8 – Chủ đề 3: Lập trình
                    </p>
                    <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-0.5">
                      <span>📄 20 câu hỏi</span>
                      <span>⏱️ 45 phút</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('exams')}
                  className="px-3 py-1.5 rounded-lg bg-[#16A765] text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm shrink-0"
                >
                  Chấm tự động
                </button>
              </div>

              {/* Exam 3: Cuối kỳ */}
              <div className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-300 transition-colors flex items-center justify-between gap-3 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-[#7655DF] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#082B60]">
                      Đề kiểm tra cuối kỳ
                    </h3>
                    <p className="text-xs text-slate-600">
                      Toán 8 – Học kỳ I
                    </p>
                    <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-0.5">
                      <span>📄 30 câu hỏi</span>
                      <span>⏱️ 60 phút</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('exams')}
                  className="px-3 py-1.5 rounded-lg bg-[#7655DF] text-white text-xs font-bold hover:bg-purple-700 transition-colors shadow-sm shrink-0"
                >
                  Xem kết quả
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CARD 4: Thư viện bài giảng & bài tập ================= */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-[#1565D8]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-[#082B60]">
                  Thư viện bài giảng & bài tập
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('lessons')}
                className="text-xs font-bold text-[#1565D8] hover:text-[#082B60] transition-colors"
              >
                Xem thêm &rarr;
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 text-xs font-medium text-slate-600 border-b border-slate-100">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'lecture', label: 'Bài giảng' },
                { id: 'exercise', label: 'Bài tập' },
                { id: 'plan', label: 'Giáo án' },
                { id: 'other', label: 'Tài liệu khác' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setLibraryFilter(tab.id)}
                  className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    libraryFilter === tab.id
                      ? 'bg-[#1565D8] text-white font-bold'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 4 Quick Category Cards (Matches mockup) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3">
              <div
                onClick={() => setActiveTab('lessons')}
                className="bg-red-50 hover:bg-red-100/80 p-2.5 rounded-xl border border-red-200 cursor-pointer transition-all text-center flex flex-col items-center justify-center"
              >
                <div className="w-7 h-7 rounded-lg bg-red-500 text-white flex items-center justify-center font-bold text-xs mb-1">
                  PDF
                </div>
                <div className="text-xs font-bold text-slate-800">Giáo án</div>
                <div className="text-[10px] text-slate-500">(Toán – Tin học)</div>
              </div>

              <div
                onClick={() => setActiveTab('lessons')}
                className="bg-blue-50 hover:bg-blue-100/80 p-2.5 rounded-xl border border-blue-200 cursor-pointer transition-all text-center flex flex-col items-center justify-center"
              >
                <div className="w-7 h-7 rounded-lg bg-[#1565D8] text-white flex items-center justify-center mb-1">
                  <Video className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Video</div>
                <div className="text-[10px] text-slate-500">trực tuyến</div>
              </div>

              <div
                onClick={() => setActiveTab('lessons')}
                className="bg-emerald-50 hover:bg-emerald-100/80 p-2.5 rounded-xl border border-emerald-200 cursor-pointer transition-all text-center flex flex-col items-center justify-center"
              >
                <div className="w-7 h-7 rounded-lg bg-[#16A765] text-white flex items-center justify-center mb-1">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Phiếu bài tập</div>
                <div className="text-[10px] text-slate-500">và đề luyện tập</div>
              </div>

              <div
                onClick={() => setActiveTab('lessons')}
                className="bg-orange-50 hover:bg-orange-100/80 p-2.5 rounded-xl border border-orange-200 cursor-pointer transition-all text-center flex flex-col items-center justify-center"
              >
                <div className="w-7 h-7 rounded-lg bg-[#F59E0B] text-white flex items-center justify-center font-bold text-xs mb-1">
                  Giáo án
                </div>
                <div className="text-xs font-bold text-slate-800">Giáo án điện tử</div>
                <div className="text-[10px] text-slate-500">(PPT)</div>
              </div>
            </div>

            {/* List of recent items */}
            <div className="space-y-2">
              {lessons.slice(0, 3).map((les) => (
                <div
                  key={les.id}
                  onClick={() => setActiveTab('lessons')}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    {les.fileType === 'VIDEO' ? (
                      <Video className="w-4 h-4 text-blue-600 shrink-0" />
                    ) : les.fileType === 'PDF' ? (
                      <span className="text-[10px] bg-red-100 text-red-600 px-1 py-0.5 rounded font-bold">PDF</span>
                    ) : (
                      <span className="text-[10px] bg-orange-100 text-orange-600 px-1 py-0.5 rounded font-bold">PPT</span>
                    )}
                    <div>
                      <div className="text-xs font-bold text-slate-800 hover:text-[#1565D8]">
                        {les.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {les.subject} 8 | {les.chapter}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono shrink-0">
                    {les.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= CARD 5: Mô phỏng Toán học tương tác ================= */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-[#1565D8]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-[#082B60]">
                  Mô phỏng Toán học tương tác
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedSimulation('sum180');
                  setActiveTab('simulations');
                }}
                className="text-xs font-bold px-3 py-1 bg-[#1565D8] text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Mở mô phỏng &rarr;
              </button>
            </div>

            {/* Layout: Sidebar Sub-categories + Stage Canvas + Tool Palette */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Left Sub-nav inside Card */}
              <div className="md:col-span-3 space-y-1 text-xs">
                {[
                  { id: 'sum180', label: 'Hình học phẳng', active: true },
                  { id: 'parallel', label: 'Hình học không gian', active: false },
                  { id: 'explore', label: 'Đại số', active: false },
                  { id: 'graph', label: 'Hàm số', active: false },
                  { id: 'protractor', label: 'Thống kê xác suất', active: false },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedSimulation(item.id);
                      setActiveTab('simulations');
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg transition-colors font-medium ${
                      item.active
                        ? 'bg-blue-50 text-[#1565D8] font-bold border border-blue-200'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Center Canvas: Interactive Triangle ABC */}
              <div className="md:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-2 relative flex flex-col items-center">
                <div className="text-[11px] font-bold text-slate-700 w-full text-center pb-1 border-b border-slate-200 flex items-center justify-between">
                  <span>Tam giác và các góc (Kéo đỉnh A, B, C)</span>
                  <span className="text-blue-600 font-mono font-bold">
                    Tổng: {angleA + angleB + angleC}°
                  </span>
                </div>

                <div className="relative w-full overflow-hidden flex items-center justify-center py-1">
                  <svg
                    viewBox="0 0 300 200"
                    className="w-full h-44 select-none cursor-crosshair"
                    onMouseMove={handleSvgMouseMove}
                    onMouseUp={() => setIsDragging(null)}
                    onMouseLeave={() => setIsDragging(null)}
                  >
                    {/* Coordinate Grid */}
                    {showGrid && (
                      <g stroke="#e2e8f0" strokeWidth="0.8">
                        {Array.from({ length: 15 }).map((_, i) => (
                          <line key={`x-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="200" />
                        ))}
                        {Array.from({ length: 10 }).map((_, i) => (
                          <line key={`y-${i}`} x1="0" y1={i * 20} x2="300" y2={i * 20} />
                        ))}
                      </g>
                    )}

                    {/* Triangle Polygon */}
                    <polygon
                      points={`${vertexA.x},${vertexA.y} ${vertexB.x},${vertexB.y} ${vertexC.x},${vertexC.y}`}
                      fill="#1565D8"
                      fillOpacity="0.12"
                      stroke="#1565D8"
                      strokeWidth="2.5"
                    />

                    {/* Vertex A */}
                    <circle
                      cx={vertexA.x}
                      cy={vertexA.y}
                      r="6"
                      fill="#1565D8"
                      stroke="#fff"
                      strokeWidth="2"
                      className="cursor-pointer hover:scale-125 transition-transform"
                      onMouseDown={() => setIsDragging('A')}
                    />
                    <text
                      x={vertexA.x}
                      y={vertexA.y - 10}
                      textAnchor="middle"
                      className="text-xs font-bold fill-[#082B60]"
                    >
                      A ({angleA}°)
                    </text>

                    {/* Vertex B */}
                    <circle
                      cx={vertexB.x}
                      cy={vertexB.y}
                      r="6"
                      fill="#16A765"
                      stroke="#fff"
                      strokeWidth="2"
                      className="cursor-pointer hover:scale-125 transition-transform"
                      onMouseDown={() => setIsDragging('B')}
                    />
                    <text
                      x={vertexB.x - 12}
                      y={vertexB.y + 16}
                      textAnchor="middle"
                      className="text-xs font-bold fill-[#082B60]"
                    >
                      B ({angleB}°)
                    </text>

                    {/* Vertex C */}
                    <circle
                      cx={vertexC.x}
                      cy={vertexC.y}
                      r="6"
                      fill="#F59E0B"
                      stroke="#fff"
                      strokeWidth="2"
                      className="cursor-pointer hover:scale-125 transition-transform"
                      onMouseDown={() => setIsDragging('C')}
                    />
                    <text
                      x={vertexC.x + 12}
                      y={vertexC.y + 16}
                      textAnchor="middle"
                      className="text-xs font-bold fill-[#082B60]"
                    >
                      C ({angleC}°)
                    </text>

                    {/* Length labels */}
                    {showLengths && (
                      <>
                        <text
                          x={(vertexA.x + vertexB.x) / 2 - 12}
                          y={(vertexA.y + vertexB.y) / 2}
                          className="text-[10px] fill-slate-500 font-mono"
                        >
                          {Math.round(c / 10)}cm
                        </text>
                        <text
                          x={(vertexA.x + vertexC.x) / 2 + 6}
                          y={(vertexA.y + vertexC.y) / 2}
                          className="text-[10px] fill-slate-500 font-mono"
                        >
                          {Math.round(b / 10)}cm
                        </text>
                        <text
                          x={(vertexB.x + vertexC.x) / 2}
                          y={(vertexB.y + vertexC.y) / 2 + 14}
                          textAnchor="middle"
                          className="text-[10px] fill-slate-500 font-mono"
                        >
                          {Math.round(a / 10)}cm
                        </text>
                      </>
                    )}
                  </svg>
                </div>

                {/* Bottom Zoom Slider */}
                <div className="w-full flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <span>Thu nhỏ</span>
                  <input
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.1"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                    className="w-28 h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-[#1565D8]"
                  />
                  <span>Phóng to</span>
                </div>
              </div>

              {/* Right Tools Palette inside Card (Matches mockup) */}
              <div className="md:col-span-3 space-y-2 text-xs">
                <div className="font-bold text-slate-700">Công cụ</div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button className="p-1.5 rounded-lg border border-[#1565D8] bg-blue-50 text-[#1565D8] flex items-center justify-center">
                    <MousePointer className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center">
                    <Minus className="w-4 h-4 rotate-45" />
                  </button>
                </div>

                <div className="space-y-1.5 pt-2 text-[11px] text-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showAngles}
                      onChange={(e) => setShowAngles(e.target.checked)}
                      className="rounded text-[#1565D8] focus:ring-[#1565D8]"
                    />
                    <span>Hiển thị góc</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showLengths}
                      onChange={(e) => setShowLengths(e.target.checked)}
                      className="rounded text-[#1565D8] focus:ring-[#1565D8]"
                    />
                    <span>Hiển thị độ dài</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                      className="rounded text-[#1565D8] focus:ring-[#1565D8]"
                    />
                    <span>Lưới tọa độ</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CARD 6: Tài khoản & bảo mật ================= */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-[#1565D8]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-[#082B60]">
                  Tài khoản & bảo mật
                </h2>
              </div>
            </div>

            {/* Role Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3 text-xs">
              <button
                onClick={() => setUserRole('teacher')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  userRole === 'teacher'
                    ? 'bg-blue-50 text-[#1565D8] border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Tài khoản giáo viên
              </button>
              <button
                onClick={() => setUserRole('student')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  userRole === 'student'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Tài khoản học sinh
              </button>
            </div>

            {/* Profile Detail Strip */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-[#082B60] font-bold flex items-center justify-center text-sm border-2 border-white shadow">
                  TT
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#082B60]">
                    {teacherProfile.fullName}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {teacherProfile.school}
                  </p>
                  <p className="text-[11px] text-[#1565D8] font-medium">
                    {teacherProfile.subject}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('settings')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm shrink-0"
              >
                Chỉnh sửa thông tin
              </button>
            </div>

            {/* Security Options List (Matches mockup) */}
            <div className="divide-y divide-slate-100 text-xs">
              <button
                onClick={() => setActiveTab('settings')}
                className="w-full py-2 flex items-center justify-between text-slate-700 hover:text-[#1565D8] group"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>Đổi mật khẩu</span>
                </div>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>

              <div className="w-full py-2 flex items-center justify-between text-slate-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#1565D8]" />
                  <span>Xác thực 2 bước</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={twoFactorActive}
                    onChange={(e) => {
                      const val = e.target.checked;
                      setTwoFactorActive(val);
                      updateTeacherProfile({ twoFactorEnabled: val });
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1565D8]"></div>
                </label>
              </div>

              <button
                onClick={() => setActiveTab('settings')}
                className="w-full py-2 flex items-center justify-between text-slate-700 hover:text-[#1565D8] group"
              >
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#7655DF]" />
                  <span>Phân quyền truy cập</span>
                </div>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="w-full py-2 flex items-center justify-between text-slate-700 hover:text-[#1565D8] group"
              >
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-amber-500" />
                  <span>Lịch sử đăng nhập</span>
                </div>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="w-full py-2 flex items-center justify-between text-slate-700 hover:text-[#1565D8] group"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Cài đặt bảo mật khác</span>
                </div>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
