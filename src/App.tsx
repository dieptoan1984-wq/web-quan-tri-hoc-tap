import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { StudentManager } from './components/students/StudentManager';
import { GradebookManager } from './components/gradebook/GradebookManager';
import { ExamManager } from './components/exams/ExamManager';
import { LessonLibrary } from './components/lessons/LessonLibrary';
import { MathSimulations } from './components/simulations/MathSimulations';
import { ReportAnalytics } from './components/reports/ReportAnalytics';
import { SettingsManager } from './components/settings/SettingsManager';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F1F7FF] flex flex-col font-serif selection:bg-[#1565D8] selection:text-white">
      {/* Top Main Header */}
      <Header onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Main Body: Sidebar + Dynamic Workspace View */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Fixed / Responsive Sidebar */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Center / Right Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'students' && <StudentManager />}
          {activeTab === 'gradebook' && <GradebookManager />}
          {activeTab === 'exams' && <ExamManager />}
          {activeTab === 'lessons' && <LessonLibrary />}
          {activeTab === 'simulations' && <MathSimulations />}
          {activeTab === 'reports' && <ReportAnalytics />}
          {activeTab === 'settings' && <SettingsManager />}

          {/* Quiet Clean Footer */}
          <footer className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 no-print">
            <div className="font-bold text-[#082B60]">
              TÂY ĐÔ EDU – Hệ thống dạy học và quản lý kết quả học tập
            </div>
            <div className="mt-1 text-slate-400">
              Giáo viên phụ trách: Diệp Thanh Toàn · Môn Toán – Tin học · Trường THCS Tây Đô
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
