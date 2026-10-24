import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppTab } from '../../types';
import {
  Home,
  Users,
  BarChart3,
  FileCheck2,
  BookOpen,
  FlaskConical,
  PieChart,
  Settings,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Globe2,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface MenuItem {
  id: AppTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', label: 'Trang chủ', icon: Home },
  { id: 'students', label: 'Học sinh', icon: Users },
  { id: 'gradebook', label: 'Bảng điểm', icon: BarChart3 },
  { id: 'exams', label: 'Kiểm tra', icon: FileCheck2 },
  { id: 'lessons', label: 'Bài giảng', icon: BookOpen },
  { id: 'simulations', label: 'Mô phỏng', icon: FlaskConical, badge: '5 Mô hình' },
  { id: 'reports', label: 'Báo cáo', icon: PieChart },
  { id: 'settings', label: 'Cài đặt', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, userRole } = useApp();

  const handleNav = (id: AppTab) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen md:h-[calc(100vh-6rem)] w-64 bg-[#082B60] text-white flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out border-r border-blue-900/60 shadow-xl select-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Section / Menu List */}
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Mobile Header in Drawer */}
          <div className="md:hidden flex items-center justify-between pb-4 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#24C4E8]" />
              <span className="font-bold text-lg">TÂY ĐÔ EDU</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              ✕
            </button>
          </div>

          <div className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
            <span>Danh mục quản lý</span>
            {userRole === 'student' && (
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-400/30">
                Góc học sinh
              </span>
            )}
          </div>

          <nav className="space-y-1.5">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-base font-semibold transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-[#168BFF] to-[#1565D8] text-white shadow-lg shadow-blue-500/30 translate-x-1'
                      : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'text-cyan-300 group-hover:text-white group-hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && !isActive && (
                    <span className="text-[11px] font-sans bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/30">
                      {item.badge}
                    </span>
                  )}

                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-white/80 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Slogan & Visual Motif (Matches mockup bottom left) */}
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-b from-blue-900/60 to-black/40 border border-cyan-400/20 relative overflow-hidden text-center">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="relative flex flex-col items-center justify-center py-2">
            <div className="w-10 h-10 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-300 mb-2 border border-cyan-300/30">
              <Globe2 className="w-6 h-6 animate-spin-slow" />
            </div>
            <div className="italic text-base text-cyan-200 font-serif font-bold tracking-wider">
              Tri thức
            </div>
            <div className="italic text-sm text-white/90 font-serif tracking-wide">
              Kết nối tương lai
            </div>
            <div className="text-[11px] text-blue-300 mt-1 font-sans">
              Trường THCS Tây Đô © 2024
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
