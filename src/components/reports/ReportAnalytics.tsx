import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  Award,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  School,
} from 'lucide-react';

export const ReportAnalytics: React.FC = () => {
  const { classes, students, grades, teacherProfile } = useApp();
  const [selectedSemester, setSelectedSemester] = useState<'HK1' | 'HK2'>('HK1');
  const [selectedSubject, setSelectedSubject] = useState<'Toán' | 'Tin học'>('Toán');

  // Compute statistics per class for the selected subject and semester
  const classStats = useMemo(() => {
    return classes.map((cls) => {
      const clsGrades = grades.filter(
        (g) => g.className === cls.name && g.subject === selectedSubject && g.semester === selectedSemester
      );
      const avgs = clsGrades.map((g) => g.average).filter((v): v is number => v !== null);

      const total = avgs.length;
      if (total === 0) {
        return {
          name: cls.name,
          avg: 0,
          gio: 0,
          kha: 0,
          dat: 0,
          chuadat: 0,
          gioPct: 0,
          total: 0,
        };
      }

      const sum = avgs.reduce((a, b) => a + b, 0);
      const avg = Math.round((sum / total) * 10) / 10;
      const gio = avgs.filter((v) => v >= 8.0).length;
      const kha = avgs.filter((v) => v >= 6.5 && v < 8.0).length;
      const dat = avgs.filter((v) => v >= 5.0 && v < 6.5).length;
      const chuadat = avgs.filter((v) => v < 5.0).length;

      return {
        name: cls.name,
        avg,
        gio,
        kha,
        dat,
        chuadat,
        gioPct: Math.round((gio / total) * 100),
        total,
      };
    });
  }, [classes, grades, selectedSubject, selectedSemester]);

  // Overall totals
  const overallTotals = useMemo(() => {
    const allFiltered = grades.filter(
      (g) => g.subject === selectedSubject && g.semester === selectedSemester
    );
    const avgs = allFiltered.map((g) => g.average).filter((v): v is number => v !== null);
    if (avgs.length === 0) return { avg: 0, total: 0, gio: 0, kha: 0, dat: 0, chuadat: 0, passPct: 0 };

    const sum = avgs.reduce((a, b) => a + b, 0);
    const avg = Math.round((sum / avgs.length) * 10) / 10;
    const gio = avgs.filter((v) => v >= 8.0).length;
    const kha = avgs.filter((v) => v >= 6.5 && v < 8.0).length;
    const dat = avgs.filter((v) => v >= 5.0 && v < 6.5).length;
    const chuadat = avgs.filter((v) => v < 5.0).length;
    const passPct = Math.round(((gio + kha + dat) / avgs.length) * 100);

    return { avg, total: avgs.length, gio, kha, dat, chuadat, passPct };
  }, [grades, selectedSubject, selectedSemester]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-[#1565D8] font-bold text-sm mb-1">
            <PieChart className="w-4 h-4" />
            <span>Phân hệ Báo Cáo & Thống Kê Kết Quả Học Tập</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#082B60]">
            Báo Cáo Chất Lượng Giáo Dục Toàn Khối 8
          </h1>
          <p className="text-sm text-slate-500">
            Trường THCS Tây Đô · Giáo viên phụ trách: {teacherProfile.fullName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as any)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-[#082B60]"
          >
            <option value="Toán">Môn Toán</option>
            <option value="Tin học">Môn Tin học</option>
          </select>

          {/* Semester Filter */}
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value as any)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
          >
            <option value="HK1">Học kỳ I</option>
            <option value="HK2">Học kỳ II</option>
          </select>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-[#1565D8] text-white text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            In báo cáo
          </button>
        </div>
      </div>

      {/* Printable Report Sheet */}
      <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm space-y-6 font-serif">
        {/* Header on printed doc */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs uppercase font-bold text-slate-500">
              TRƯỜNG THCS TÂY ĐÔ – TỔ TOÁN TIN
            </div>
            <div className="text-lg font-black text-[#082B60] mt-1">
              BẢNG TỔNG HỢP KẾT QUẢ ĐÁNH GIÁ MÔN {selectedSubject.toUpperCase()} – {selectedSemester === 'HK1' ? 'HỌC KỲ I' : 'HỌC KỲ II'}
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              Năm học 2024–2025 · Khối 8 (Lớp 8A1, 8A2, 8A3, 8A4)
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>Ngày lập: {new Date().toLocaleDateString('vi-VN')}</div>
            <div className="font-bold text-[#082B60] mt-0.5">{teacherProfile.fullName}</div>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
            <div className="text-xs text-slate-500 font-sans uppercase font-bold">Điểm TB Toàn Khối</div>
            <div className="text-3xl font-black text-[#1565D8] my-1 font-mono">
              {overallTotals.avg.toFixed(1)}
            </div>
            <div className="text-xs text-emerald-600 font-bold font-sans">+0.5 so với kỳ trước</div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <div className="text-xs text-slate-500 font-sans uppercase font-bold">Tỉ Lệ Đạt (≥ 5.0)</div>
            <div className="text-3xl font-black text-[#16A765] my-1 font-mono">
              {overallTotals.passPct}%
            </div>
            <div className="text-xs text-slate-600 font-sans">{overallTotals.gio + overallTotals.kha + overallTotals.dat} / {overallTotals.total} học sinh</div>
          </div>

          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-center">
            <div className="text-xs text-slate-500 font-sans uppercase font-bold">Học Lực Giỏi (≥ 8.0)</div>
            <div className="text-3xl font-black text-[#7655DF] my-1 font-mono">
              {overallTotals.gio} HS
            </div>
            <div className="text-xs text-slate-600 font-sans">
              Chiếm {overallTotals.total > 0 ? Math.round((overallTotals.gio / overallTotals.total) * 100) : 0}%
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <div className="text-xs text-slate-500 font-sans uppercase font-bold">Cần Bồi Dưỡng (&lt; 5.0)</div>
            <div className="text-3xl font-black text-[#F59E0B] my-1 font-mono">
              {overallTotals.chuadat} HS
            </div>
            <div className="text-xs text-slate-600 font-sans">
              Chiếm {overallTotals.total > 0 ? Math.round((overallTotals.chuadat / overallTotals.total) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Detailed Class Comparison Table */}
        <div>
          <h3 className="text-sm font-bold text-[#082B60] uppercase mb-3">
            Bảng Chi Tiết So Sánh Các Lớp Phụ Trách
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse border border-slate-200">
              <thead className="bg-[#082B60] text-white text-xs uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3 border border-blue-900 text-center">Lớp</th>
                  <th className="py-2.5 px-3 border border-blue-900 text-center">Sĩ số</th>
                  <th className="py-2.5 px-3 border border-blue-900 text-center">Điểm TB</th>
                  <th className="py-2.5 px-3 border border-blue-900 text-center">Giỏi (≥ 8.0)</th>
                  <th className="py-2.5 px-3 border border-blue-900 text-center">Khá (6.5-7.9)</th>
                  <th className="py-2.5 px-3 border border-blue-900 text-center">Đạt (5.0-6.4)</th>
                  <th className="py-2.5 px-3 border border-blue-900 text-center">Chưa Đạt (&lt;5.0)</th>
                  <th className="py-2.5 px-3 border border-blue-900 text-center">Tỉ lệ Giỏi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {classStats.map((item) => (
                  <tr key={item.name} className="hover:bg-blue-50/50">
                    <td className="py-2.5 px-3 border border-slate-200 text-center font-bold font-serif text-[#082B60]">
                      Lớp {item.name}
                    </td>
                    <td className="py-2.5 px-3 border border-slate-200 text-center">
                      {item.total}
                    </td>
                    <td className="py-2.5 px-3 border border-slate-200 text-center font-black text-[#1565D8]">
                      {item.avg.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 border border-slate-200 text-center text-emerald-600 font-bold">
                      {item.gio} ({item.total > 0 ? Math.round((item.gio / item.total) * 100) : 0}%)
                    </td>
                    <td className="py-2.5 px-3 border border-slate-200 text-center text-blue-600">
                      {item.kha} ({item.total > 0 ? Math.round((item.kha / item.total) * 100) : 0}%)
                    </td>
                    <td className="py-2.5 px-3 border border-slate-200 text-center text-amber-600">
                      {item.dat} ({item.total > 0 ? Math.round((item.dat / item.total) * 100) : 0}%)
                    </td>
                    <td className="py-2.5 px-3 border border-slate-200 text-center text-red-600">
                      {item.chuadat}
                    </td>
                    <td className="py-2.5 px-3 border border-slate-200 text-center font-bold text-[#082B60]">
                      {item.gioPct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visual Bar Representation */}
        <div>
          <h3 className="text-sm font-bold text-[#082B60] uppercase mb-3">
            Biểu Đồ So Sánh Trực Quan Giữa Các Lớp
          </h3>
          <div className="space-y-3 font-sans">
            {classStats.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#082B60]">Lớp {item.name}</span>
                  <span className="font-mono text-[#1565D8]">{item.avg.toFixed(1)} / 10 điểm</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${(item.gio / (item.total || 1)) * 100}%` }}
                    className="bg-[#16A765] h-full"
                    title={`Giỏi: ${item.gio}`}
                  />
                  <div
                    style={{ width: `${(item.kha / (item.total || 1)) * 100}%` }}
                    className="bg-[#1565D8] h-full"
                    title={`Khá: ${item.kha}`}
                  />
                  <div
                    style={{ width: `${(item.dat / (item.total || 1)) * 100}%` }}
                    className="bg-[#F59E0B] h-full"
                    title={`Đạt: ${item.dat}`}
                  />
                  <div
                    style={{ width: `${(item.chuadat / (item.total || 1)) * 100}%` }}
                    className="bg-[#DC3545] h-full"
                    title={`Chưa đạt: ${item.chuadat}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs font-sans text-slate-500 mt-3 pt-2 border-t border-slate-100 justify-center">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#16A765] rounded-sm inline-block" /> Giỏi</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#1565D8] rounded-sm inline-block" /> Khá</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#F59E0B] rounded-sm inline-block" /> Đạt</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#DC3545] rounded-sm inline-block" /> Chưa đạt</span>
          </div>
        </div>

        {/* Signatures for Print */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-center text-xs">
          <div>
            <div className="font-bold text-slate-700 uppercase">BAN GIÁM HIỆU DUYỆT</div>
            <div className="italic text-slate-400 mt-1">(Ký và ghi rõ họ tên)</div>
            <div className="h-16" />
          </div>
          <div>
            <div className="font-bold text-slate-700 uppercase">GIÁO VIÊN BỘ MÔN</div>
            <div className="italic text-slate-400 mt-1">(Ký và ghi rõ họ tên)</div>
            <div className="h-16" />
            <div className="font-bold text-slate-800 text-sm">{teacherProfile.fullName}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
