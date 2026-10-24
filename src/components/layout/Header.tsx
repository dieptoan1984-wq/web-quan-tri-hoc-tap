import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  BookOpen,
  ChevronDown,
  UserCheck,
  User,
  LogOut,
  ShieldCheck,
  Menu,
  School,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const {
    teacherProfile,
    userRole,
    setUserRole,
    currentStudentId,
    setCurrentStudentId,
    students,
    setActiveTab,
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];

  return (
    <header className="relative w-full bg-gradient-to-r from-[#082B60] via-[#1565D8] to-[#168BFF] text-white shadow-lg overflow-hidden border-b border-blue-400/30">
      {/* Background Decorative Tech Lines & Glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#24C4E8_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#24C4E8]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between gap-4">
        {/* Left: Brand & School Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Mở menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* Logo Emblem: Book & Graduation Cap */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 border-2 border-[#24C4E8] flex items-center justify-center p-2 shadow-inner group-hover:scale-105 transition-transform backdrop-blur-md">
              <div className="relative flex items-center justify-center">
                <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-md" />
                <GraduationCap className="w-5 h-5 text-[#24C4E8] absolute -top-1.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-white drop-shadow-sm">
                  TÂY ĐÔ EDU
                </h1>
                <span className="hidden lg:inline-flex items-center gap-1 text-[11px] bg-white/20 text-cyan-200 px-2 py-0.5 rounded-full border border-white/20 font-sans">
                  <Sparkles className="w-3 h-3 text-cyan-300" /> THCS Tây Đô
                </span>
              </div>
              <p className="text-xs sm:text-sm text-cyan-100 font-medium tracking-wide">
                Hệ thống dạy học và quản lý kết quả học tập
              </p>
            </div>
          </div>
        </div>

        {/* Right: Teacher / Student Info Lockup */}
        <div className="flex items-center gap-3">
          {/* Quick Role Switcher Pill */}
          <div className="hidden sm:flex items-center bg-[#082B60]/60 backdrop-blur-md border border-cyan-400/40 rounded-full p-1 shadow-sm">
            <button
              onClick={() => setUserRole('teacher')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                userRole === 'teacher'
                  ? 'bg-gradient-to-r from-[#1565D8] to-[#168BFF] text-white shadow'
                  : 'text-cyan-200 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Giáo viên
            </button>
            <button
              onClick={() => setUserRole('student')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                userRole === 'student'
                  ? 'bg-gradient-to-r from-[#16A765] to-emerald-500 text-white shadow'
                  : 'text-cyan-200 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Học sinh
            </button>
          </div>

          {/* User Profile Card */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-left backdrop-blur-md"
            >
              <div className="relative">
                {userRole === 'teacher' ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 border-2 border-white flex items-center justify-center text-[#082B60] font-bold text-sm shadow">
                    TT
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-200 border-2 border-white flex items-center justify-center text-teal-900 font-bold text-sm shadow">
                    MA
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#082B60] rounded-full" />
              </div>

              <div className="hidden md:block text-right">
                <div className="text-sm font-bold text-white tracking-wide leading-tight">
                  {userRole === 'teacher' ? teacherProfile.fullName : currentStudent.fullName}
                </div>
                <div className="text-xs text-cyan-200 font-medium">
                  {userRole === 'teacher'
                    ? `${teacherProfile.subject} – ${teacherProfile.school}`
                    : `Học sinh Lớp ${currentStudent.className} – ${currentStudent.studentCode}`}
                </div>
              </div>

              <ChevronDown className="w-4 h-4 text-cyan-200 transition-transform hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    Đang đăng nhập với vai trò:
                  </p>
                  <p className="text-sm font-bold text-[#082B60]">
                    {userRole === 'teacher' ? 'Giáo viên bộ môn' : 'Học sinh'}
                  </p>
                  <p className="text-xs text-slate-600">
                    {userRole === 'teacher' ? teacherProfile.email : currentStudent.email}
                  </p>
                </div>

                <div className="p-2">
                  <div className="text-xs font-semibold text-slate-500 px-2 py-1">
                    Chuyển nhanh vai trò thử nghiệm:
                  </div>
                  <button
                    onClick={() => {
                      setUserRole('teacher');
                      setShowProfileMenu(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-left transition-colors ${
                      userRole === 'teacher'
                        ? 'bg-blue-50 text-[#1565D8] font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-[#1565D8]" />
                    <span>GV. Diệp Thanh Toàn</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserRole('student');
                      setCurrentStudentId('st-001');
                      setShowProfileMenu(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-left transition-colors ${
                      userRole === 'student'
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Học sinh: Nguyễn Minh Anh (8A1)</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 p-2">
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-100 text-left transition-colors"
                  >
                    <School className="w-4 h-4 text-slate-500" />
                    <span>Cài đặt hệ thống & bảo mật</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserRole('teacher');
                      setActiveTab('dashboard');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Đặt lại phiên làm việc</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
