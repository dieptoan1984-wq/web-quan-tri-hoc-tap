import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { GradeRecord, SubjectType, SemesterType } from '../../types';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet,
  Download,
  Upload,
  Search,
  Filter,
  Save,
  AlertCircle,
  HelpCircle,
  History,
  TrendingUp,
  Award,
  CheckCircle2,
  X,
  Info,
} from 'lucide-react';

export const GradebookManager: React.FC = () => {
  const {
    grades,
    classes,
    updateGradeRecord,
    batchUpdateGrades,
    formulaConfig,
  } = useApp();

  // Filters
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('2024-2025');
  const [selectedSemester, setSelectedSemester] = useState<SemesterType>('HK1');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('Toán');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'c-8a1');
  const [searchQuery, setSearchQuery] = useState('');
  const [thresholdFilter, setThresholdFilter] = useState<'all' | 'under5' | 'under65' | 'above8'>('all');

  // Cell editing state
  const [editingCell, setEditingCell] = useState<{ recordId: string; field: string; index?: number } | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [saveToast, setSaveToast] = useState(false);
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [auditLog, setAuditLog] = useState<{ time: string; text: string }[]>([
    { time: '2024-11-20 10:15', text: 'Cập nhật điểm cuối kỳ lớp 8A1 môn Toán' },
    { time: '2024-11-15 14:30', text: 'Nhập điểm giữa kỳ 8A2 môn Tin học' },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Filtered Grade Records
  const currentGrades = useMemo(() => {
    return grades.filter((g) => {
      const matchClass = g.className === currentClass.name;
      const matchSubject = g.subject === selectedSubject;
      const matchSemester = g.semester === selectedSemester;
      const matchSearch =
        g.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.studentCode.toLowerCase().includes(searchQuery.toLowerCase());

      let matchThreshold = true;
      if (thresholdFilter === 'under5') {
        matchThreshold = g.average !== null && g.average < 5.0;
      } else if (thresholdFilter === 'under65') {
        matchThreshold = g.average !== null && g.average < 6.5;
      } else if (thresholdFilter === 'above8') {
        matchThreshold = g.average !== null && g.average >= 8.0;
      }

      return matchClass && matchSubject && matchSemester && matchSearch && matchThreshold;
    });
  }, [grades, currentClass.name, selectedSubject, selectedSemester, searchQuery, thresholdFilter]);

  // Grade Statistics Summary
  const stats = useMemo(() => {
    const list = currentGrades.map((g) => g.average).filter((avg): avg is number => avg !== null);
    if (list.length === 0) return { avg: 0, gio: 0, kha: 0, dat: 0, chuadat: 0 };

    const sum = list.reduce((a, b) => a + b, 0);
    const avg = Math.round((sum / list.length) * 10) / 10;
    const gio = list.filter((v) => v >= 8.0).length;
    const kha = list.filter((v) => v >= 6.5 && v < 8.0).length;
    const dat = list.filter((v) => v >= 5.0 && v < 6.5).length;
    const chuadat = list.filter((v) => v < 5.0).length;

    return { avg, gio, kha, dat, chuadat };
  }, [currentGrades]);

  // Start cell editing
  const startEditing = (recordId: string, field: string, currentValue: any, index?: number) => {
    setEditingCell({ recordId, field, index });
    setTempValue(currentValue !== null && currentValue !== undefined ? String(currentValue) : '');
  };

  // Commit cell editing with validation
  const commitEditing = (record: GradeRecord) => {
    if (!editingCell) return;
    const { field, index } = editingCell;

    if (field === 'note') {
      updateGradeRecord(record.id, 'note', tempValue);
      setEditingCell(null);
      return;
    }

    const num = parseFloat(tempValue);
    if (tempValue.trim() !== '' && (isNaN(num) || num < 0 || num > 10)) {
      alert('Điểm số phải là số thực từ 0.0 đến 10.0!');
      return;
    }

    const finalVal = tempValue.trim() === '' ? null : Math.round(num * 10) / 10;

    if (field === 'scoresTx' && index !== undefined) {
      const nextTx = [...record.scoresTx];
      if (finalVal === null) {
        nextTx.splice(index, 1);
      } else {
        nextTx[index] = finalVal;
      }
      updateGradeRecord(record.id, 'scoresTx', nextTx);
      addAudit(`Cập nhật ĐĐGtx[${index + 1}] học sinh ${record.fullName}: ${finalVal}`);
    } else if (field === 'scoresTx_add') {
      if (finalVal !== null) {
        const nextTx = [...record.scoresTx, finalVal];
        updateGradeRecord(record.id, 'scoresTx', nextTx);
        addAudit(`Thêm cột ĐĐGtx học sinh ${record.fullName}: ${finalVal}`);
      }
    } else if (field === 'scoreGk') {
      updateGradeRecord(record.id, 'scoreGk', finalVal);
      addAudit(`Cập nhật điểm Giữa kỳ học sinh ${record.fullName}: ${finalVal}`);
    } else if (field === 'scoreCk') {
      updateGradeRecord(record.id, 'scoreCk', finalVal);
      addAudit(`Cập nhật điểm Cuối kỳ học sinh ${record.fullName}: ${finalVal}`);
    }

    setEditingCell(null);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const addAudit = (text: string) => {
    const time = new Date().toLocaleString('vi-VN');
    setAuditLog((prev) => [{ time, text }, ...prev.slice(0, 9)]);
  };

  // Export Gradebook to Excel (.xlsx)
  const exportGradebookExcel = () => {
    const data = currentGrades.map((g, idx) => ({
      STT: idx + 1,
      'Mã Học Sinh': g.studentCode,
      'Họ và Tên': g.fullName,
      Lớp: g.className,
      Môn: g.subject,
      'Học Kỳ': g.semester === 'HK1' ? 'Học kỳ I' : 'Học kỳ II',
      'ĐĐGtx 1': g.scoresTx[0] ?? '',
      'ĐĐGtx 2': g.scoresTx[1] ?? '',
      'ĐĐGtx 3': g.scoresTx[2] ?? '',
      'ĐĐGtx 4': g.scoresTx[3] ?? '',
      'Điểm Giữa Kỳ (x2)': g.scoreGk ?? '',
      'Điểm Cuối Kỳ (x3)': g.scoreCk ?? '',
      'Điểm TB Học Kỳ': g.average ?? '',
      'Ghi Chú': g.note,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `SoDiem_${currentClass.name}`);
    XLSX.writeFile(
      workbook,
      `SoDiem_${selectedSubject}_Lop${currentClass.name}_${selectedSemester}_${new Date().toISOString().split('T')[0]}.xlsx`
    );
  };

  // Import Grades from Excel (.xlsx)
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawJson: any[] = XLSX.utils.sheet_to_json(sheet);

        let count = 0;
        const updatedGrades = grades.map((g) => {
          const row = rawJson.find(
            (r) =>
              String(r['Mã Học Sinh'] || r['studentCode'] || '').trim().toLowerCase() ===
              g.studentCode.trim().toLowerCase() &&
              g.subject === selectedSubject &&
              g.semester === selectedSemester
          );

          if (row) {
            count++;
            const tx: number[] = [];
            [row['ĐĐGtx 1'], row['ĐĐGtx 2'], row['ĐĐGtx 3'], row['ĐĐGtx 4']].forEach((v) => {
              const num = parseFloat(v);
              if (!isNaN(num) && num >= 0 && num <= 10) tx.push(Math.round(num * 10) / 10);
            });

            const gk = parseFloat(row['Điểm Giữa Kỳ (x2)'] ?? row['scoreGk']);
            const ck = parseFloat(row['Điểm Cuối Kỳ (x3)'] ?? row['scoreCk']);

            const scoreGk = !isNaN(gk) && gk >= 0 && gk <= 10 ? Math.round(gk * 10) / 10 : g.scoreGk;
            const scoreCk = !isNaN(ck) && ck >= 0 && ck <= 10 ? Math.round(ck * 10) / 10 : g.scoreCk;
            const finalTx = tx.length > 0 ? tx : g.scoresTx;

            const sumTx = finalTx.reduce((s, v) => s + v * formulaConfig.weightTx, 0);
            const totalW = finalTx.length * formulaConfig.weightTx + formulaConfig.weightGk + formulaConfig.weightCk;
            const avg =
              scoreGk !== null && scoreCk !== null && finalTx.length > 0
                ? Math.round(((sumTx + scoreGk * formulaConfig.weightGk + scoreCk * formulaConfig.weightCk) / totalW) * 10) / 10
                : null;

            return {
              ...g,
              scoresTx: finalTx,
              scoreGk,
              scoreCk,
              average: avg,
              note: row['Ghi Chú'] || g.note,
              updatedAt: new Date().toISOString().split('T')[0],
            };
          }
          return g;
        });

        if (count > 0) {
          batchUpdateGrades(updatedGrades);
          addAudit(`Đã nạp điểm thành công cho ${count} học sinh từ file Excel`);
          alert(`Đã cập nhật điểm thành công cho ${count} học sinh từ file Excel!`);
        } else {
          alert('Không tìm thấy mã học sinh tương ứng trong bảng điểm môn hiện tại.');
        }
      } catch (err) {
        alert('Lỗi đọc file Excel. Vui lòng kiểm tra định dạng tệp!');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 bg-[#16A765] text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-in fade-in z-50">
          <CheckCircle2 className="w-4 h-4" />
          <span>Điểm số đã được lưu & tự động tính toán lại!</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#1565D8] font-bold text-sm mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Phân hệ Sổ Điểm Điện Tử THCS Chuẩn Bộ GD&ĐT</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#082B60]">
            Bảng Điểm Môn {selectedSubject} – Lớp {currentClass.name}
          </h1>
          <p className="text-sm text-slate-500">
            Năm học: {selectedSchoolYear} · {selectedSemester === 'HK1' ? 'Học kỳ I' : 'Học kỳ II'} · Giáo viên: GV. Diệp Thanh Toàn
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowFormulaModal(true)}
            className="px-3 py-2 rounded-xl border border-blue-200 bg-blue-50 text-[#1565D8] text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5"
            title="Xem quy tắc tính điểm"
          >
            <HelpCircle className="w-4 h-4" />
            Công thức tính điểm
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportExcel}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            Nhập điểm Excel (.xlsx)
          </button>

          <button
            onClick={exportGradebookExcel}
            className="px-3.5 py-2 rounded-xl border border-blue-300 bg-blue-50 text-[#1565D8] text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4 text-[#1565D8]" />
            Xuất bảng điểm Excel
          </button>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Class Select */}
          <div className="flex items-center gap-1.5 text-xs text-slate-700">
            <span className="font-bold">Lớp:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-[#082B60] focus:ring-2 focus:ring-[#1565D8]"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  Lớp {cls.name} ({cls.room})
                </option>
              ))}
            </select>
          </div>

          {/* Subject Select */}
          <div className="flex items-center gap-1.5 text-xs text-slate-700">
            <span className="font-bold">Môn học:</span>
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                onClick={() => setSelectedSubject('Toán')}
                className={`px-3 py-1 rounded-md font-bold transition-all ${
                  selectedSubject === 'Toán'
                    ? 'bg-[#1565D8] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Toán học
              </button>
              <button
                onClick={() => setSelectedSubject('Tin học')}
                className={`px-3 py-1 rounded-md font-bold transition-all ${
                  selectedSubject === 'Tin học'
                    ? 'bg-[#24C4E8] text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tin học
              </button>
            </div>
          </div>

          {/* Semester Select */}
          <div className="flex items-center gap-1.5 text-xs text-slate-700">
            <span className="font-bold">Học kỳ:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value as SemesterType)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-800"
            >
              <option value="HK1">Học kỳ I</option>
              <option value="HK2">Học kỳ II</option>
            </select>
          </div>
        </div>

        {/* Threshold Quick Filters */}
        <div className="flex items-center gap-2">
          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm mã hoặc tên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500">Lọc ngưỡng:</span>
            <select
              value={thresholdFilter}
              onChange={(e) => setThresholdFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold"
            >
              <option value="all">Tất cả</option>
              <option value="under5">Điểm dưới 5.0 (Cần phụ đạo)</option>
              <option value="under65">Điểm dưới 6.5 (Khá/TB)</option>
              <option value="above8">Điểm giỏi (≥ 8.0)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4 Summary Badges for Current View */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm text-center">
          <div className="text-xs text-slate-500 font-medium">Điểm TB Lớp</div>
          <div className="text-xl font-black text-[#1565D8]">{stats.avg.toFixed(1)}</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm text-center">
          <div className="text-xs text-slate-500 font-medium">Loại Giỏi (≥ 8.0)</div>
          <div className="text-xl font-black text-[#16A765]">{stats.gio} HS</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm text-center">
          <div className="text-xs text-slate-500 font-medium">Loại Khá (6.5 - 7.9)</div>
          <div className="text-xl font-black text-blue-600">{stats.kha} HS</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-sm text-center">
          <div className="text-xs text-slate-500 font-medium">Loại Đạt (5.0 - 6.4)</div>
          <div className="text-xl font-black text-[#F59E0B]">{stats.dat} HS</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-red-100 shadow-sm text-center col-span-2 sm:col-span-1">
          <div className="text-xs text-slate-500 font-medium">Chưa Đạt (&lt; 5.0)</div>
          <div className="text-xl font-black text-red-600">{stats.chuadat} HS</div>
        </div>
      </div>

      {/* Main Gradebook Spreadsheet Grid */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-blue-800 font-medium">
            <Info className="w-4 h-4 text-[#1565D8]" />
            <span>Nhấp trực tiếp vào bất kỳ ô điểm nào để chỉnh sửa và nhấn Enter hoặc rời chuột để lưu.</span>
          </div>
          <span className="font-mono">Tổng: {currentGrades.length} học sinh</span>
        </div>

        <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#082B60] text-white text-xs uppercase tracking-wider font-semibold sticky top-0 z-20">
              <tr>
                <th className="py-3 px-3 text-center border-r border-blue-800 w-10">STT</th>
                <th className="py-3 px-3 border-r border-blue-800 w-24">Mã HS</th>
                <th className="py-3 px-4 border-r border-blue-800 min-w-[180px]">Họ và Tên</th>
                {/* ĐĐGtx (Hệ số 1) */}
                <th colSpan={3} className="py-2 px-2 text-center border-r border-blue-800 bg-[#0c387c]">
                  Đánh Giá Thường Xuyên (ĐĐGtx × 1)
                </th>
                {/* Giữa kỳ (Hệ số 2) */}
                <th className="py-3 px-3 text-center border-r border-blue-800 bg-[#124ca6] min-w-[90px]">
                  Giữa Kỳ (× 2)
                </th>
                {/* Cuối kỳ (Hệ số 3) */}
                <th className="py-3 px-3 text-center border-r border-blue-800 bg-[#1565D8] min-w-[90px]">
                  Cuối Kỳ (× 3)
                </th>
                {/* ĐTB Học kỳ */}
                <th className="py-3 px-3 text-center border-r border-blue-800 bg-[#168BFF] text-white min-w-[100px]">
                  ĐTB Học Kỳ
                </th>
                <th className="py-3 px-3 border-r border-blue-800 min-w-[120px]">Ghi chú</th>
              </tr>
              <tr className="bg-[#0a316c] text-[11px] text-cyan-200">
                <th className="py-1 border-r border-blue-800"></th>
                <th className="py-1 border-r border-blue-800"></th>
                <th className="py-1 border-r border-blue-800"></th>
                <th className="py-1 text-center border-r border-blue-800 w-16">Cột 1</th>
                <th className="py-1 text-center border-r border-blue-800 w-16">Cột 2</th>
                <th className="py-1 text-center border-r border-blue-800 w-16">Cột 3</th>
                <th className="py-1 text-center border-r border-blue-800">ĐGK</th>
                <th className="py-1 text-center border-r border-blue-800">ĐCK</th>
                <th className="py-1 text-center border-r border-blue-800">Tự động</th>
                <th className="py-1 border-r border-blue-800"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-serif">
              {currentGrades.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-slate-400">
                    Không có bản ghi điểm phù hợp.
                  </td>
                </tr>
              ) : (
                currentGrades.map((rec, idx) => {
                  const isAvgGood = rec.average !== null && rec.average >= 8.0;
                  const isAvgWarning = rec.average !== null && rec.average < 5.0;

                  return (
                    <tr
                      key={rec.id}
                      className={`hover:bg-blue-50/70 transition-colors ${
                        isAvgWarning ? 'bg-red-50/30' : ''
                      }`}
                    >
                      <td className="py-2 px-3 text-center font-mono text-slate-500 border-r border-slate-100">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-[#1565D8] border-r border-slate-100">
                        {rec.studentCode}
                      </td>
                      <td className="py-2 px-4 font-bold text-slate-800 border-r border-slate-100">
                        {rec.fullName}
                      </td>

                      {/* ĐĐGtx 1 */}
                      <td
                        onClick={() => startEditing(rec.id, 'scoresTx', rec.scoresTx[0], 0)}
                        className="py-2 px-2 text-center font-mono font-semibold cursor-pointer hover:bg-yellow-50 border-r border-slate-100"
                      >
                        {editingCell?.recordId === rec.id &&
                        editingCell.field === 'scoresTx' &&
                        editingCell.index === 0 ? (
                          <input
                            type="text"
                            autoFocus
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            onBlur={() => commitEditing(rec)}
                            onKeyDown={(e) => e.key === 'Enter' && commitEditing(rec)}
                            className="w-12 text-center font-mono py-0.5 border-2 border-[#1565D8] rounded bg-white shadow-sm"
                          />
                        ) : (
                          rec.scoresTx[0] ?? <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* ĐĐGtx 2 */}
                      <td
                        onClick={() => startEditing(rec.id, 'scoresTx', rec.scoresTx[1], 1)}
                        className="py-2 px-2 text-center font-mono font-semibold cursor-pointer hover:bg-yellow-50 border-r border-slate-100"
                      >
                        {editingCell?.recordId === rec.id &&
                        editingCell.field === 'scoresTx' &&
                        editingCell.index === 1 ? (
                          <input
                            type="text"
                            autoFocus
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            onBlur={() => commitEditing(rec)}
                            onKeyDown={(e) => e.key === 'Enter' && commitEditing(rec)}
                            className="w-12 text-center font-mono py-0.5 border-2 border-[#1565D8] rounded bg-white shadow-sm"
                          />
                        ) : (
                          rec.scoresTx[1] ?? <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* ĐĐGtx 3 */}
                      <td
                        onClick={() => startEditing(rec.id, 'scoresTx', rec.scoresTx[2], 2)}
                        className="py-2 px-2 text-center font-mono font-semibold cursor-pointer hover:bg-yellow-50 border-r border-slate-100"
                      >
                        {editingCell?.recordId === rec.id &&
                        editingCell.field === 'scoresTx' &&
                        editingCell.index === 2 ? (
                          <input
                            type="text"
                            autoFocus
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            onBlur={() => commitEditing(rec)}
                            onKeyDown={(e) => e.key === 'Enter' && commitEditing(rec)}
                            className="w-12 text-center font-mono py-0.5 border-2 border-[#1565D8] rounded bg-white shadow-sm"
                          />
                        ) : (
                          rec.scoresTx[2] ?? <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* ĐGK (Hệ số 2) */}
                      <td
                        onClick={() => startEditing(rec.id, 'scoreGk', rec.scoreGk)}
                        className="py-2 px-2 text-center font-mono font-bold text-blue-700 cursor-pointer hover:bg-yellow-50 border-r border-slate-100 bg-blue-50/30"
                      >
                        {editingCell?.recordId === rec.id && editingCell.field === 'scoreGk' ? (
                          <input
                            type="text"
                            autoFocus
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            onBlur={() => commitEditing(rec)}
                            onKeyDown={(e) => e.key === 'Enter' && commitEditing(rec)}
                            className="w-12 text-center font-mono py-0.5 border-2 border-[#1565D8] rounded bg-white shadow-sm"
                          />
                        ) : (
                          rec.scoreGk ?? <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* ĐCK (Hệ số 3) */}
                      <td
                        onClick={() => startEditing(rec.id, 'scoreCk', rec.scoreCk)}
                        className="py-2 px-2 text-center font-mono font-bold text-indigo-700 cursor-pointer hover:bg-yellow-50 border-r border-slate-100 bg-indigo-50/30"
                      >
                        {editingCell?.recordId === rec.id && editingCell.field === 'scoreCk' ? (
                          <input
                            type="text"
                            autoFocus
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            onBlur={() => commitEditing(rec)}
                            onKeyDown={(e) => e.key === 'Enter' && commitEditing(rec)}
                            className="w-12 text-center font-mono py-0.5 border-2 border-[#1565D8] rounded bg-white shadow-sm"
                          />
                        ) : (
                          rec.scoreCk ?? <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* ĐTB Học Kỳ */}
                      <td className="py-2 px-3 text-center font-mono font-black border-r border-slate-100 bg-slate-50">
                        {rec.average !== null ? (
                          <span
                            className={
                              isAvgGood
                                ? 'text-emerald-600'
                                : isAvgWarning
                                ? 'text-red-600'
                                : 'text-[#082B60]'
                            }
                          >
                            {rec.average.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Thiếu điểm</span>
                        )}
                      </td>

                      {/* Ghi chú */}
                      <td
                        onClick={() => startEditing(rec.id, 'note', rec.note)}
                        className="py-2 px-3 text-xs text-slate-600 cursor-pointer hover:bg-yellow-50 truncate max-w-[150px]"
                      >
                        {editingCell?.recordId === rec.id && editingCell.field === 'note' ? (
                          <input
                            type="text"
                            autoFocus
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            onBlur={() => commitEditing(rec)}
                            onKeyDown={(e) => e.key === 'Enter' && commitEditing(rec)}
                            className="w-full text-xs py-0.5 border border-[#1565D8] rounded px-1"
                          />
                        ) : (
                          rec.note || <span className="text-slate-300 italic">Thêm ghi chú...</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Strip */}
      <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-700">Nhật ký chỉnh sửa điểm gần nhất:</span>
          <span>{auditLog[0]?.text || 'Chưa có thay đổi'}</span>
          <span className="text-slate-400">({auditLog[0]?.time})</span>
        </div>
      </div>

      {/* MODAL: Công thức tính điểm */}
      {showFormulaModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-[#082B60]">
                Quy Định & Công Thức Tính Điểm THCS
              </h3>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <div className="text-xs text-slate-600 mb-1 font-bold">
                  Công thức tính ĐTB Môn Học Kỳ:
                </div>
                <div className="text-base font-extrabold text-[#082B60] font-mono py-1">
                  ĐTB = (Tổng ĐĐGtx + 2 × ĐGK + 3 × ĐCK) / (Số cột ĐĐGtx + 5)
                </div>
              </div>

              <div className="text-xs space-y-2 text-slate-700">
                <p>
                  <strong>• Đánh giá thường xuyên (ĐĐGtx):</strong> Tính theo hệ số 1.
                </p>
                <p>
                  <strong>• Đánh giá giữa kỳ (ĐGK):</strong> Tính theo hệ số 2.
                </p>
                <p>
                  <strong>• Đánh giá cuối kỳ (ĐCK):</strong> Tính theo hệ số 3.
                </p>
                <p>
                  <strong>• Điều kiện tính điểm học kỳ:</strong> Bắt buộc phải có đủ điểm Giữa kỳ, điểm Cuối kỳ và tối thiểu 1 cột điểm Đánh giá thường xuyên. Nếu thiếu một trong các thành phần bắt buộc, hệ thống không tự ý tính điểm mà ghi nhận trạng thái <em>Thiếu điểm</em>.
                </p>
                <p>
                  <strong>• Quy tắc làm tròn:</strong> Điểm số được làm tròn đến chữ số thập phân thứ nhất theo quy chế chuyên môn.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowFormulaModal(false)}
                className="px-4 py-2 rounded-xl bg-[#1565D8] text-white text-xs font-bold hover:bg-blue-700"
              >
                Đã rõ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
