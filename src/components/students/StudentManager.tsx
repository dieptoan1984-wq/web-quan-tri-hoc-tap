import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentItem, ClassItem } from '../../types';
import * as XLSX from 'xlsx';
import {
  Users,
  Search,
  Plus,
  FileSpreadsheet,
  Download,
  Upload,
  Edit2,
  Trash2,
  Eye,
  School,
  AlertTriangle,
  X,
  Check,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Filter,
} from 'lucide-react';

export const StudentManager: React.FC = () => {
  const {
    students,
    classes,
    addClass,
    updateClass,
    deleteClass,
    addStudent,
    updateStudent,
    deleteStudent,
    importStudentsList,
    grades,
  } = useApp();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Modals
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);
  const [viewingStudent, setViewingStudent] = useState<StudentItem | null>(null);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);

  // Class Form State
  const [classNameInput, setClassNameInput] = useState('');
  const [classGradeInput, setClassGradeInput] = useState<number>(8);
  const [classRoomInput, setClassRoomInput] = useState('Phòng 201');
  const [classTeacherInput, setClassTeacherInput] = useState('Diệp Thanh Toàn');

  // Student Form State
  const [stCode, setStCode] = useState('');
  const [stName, setStName] = useState('');
  const [stGender, setStGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [stBirthDate, setStBirthDate] = useState('2011-01-01');
  const [stClassId, setStClassId] = useState(classes[0]?.id || '');
  const [stStatus, setStStatus] = useState<'Đang học' | 'Nghỉ học' | 'Chuyển trường'>('Đang học');
  const [stPhone, setStPhone] = useState('');
  const [stEmail, setStEmail] = useState('');
  const [stAddress, setStAddress] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((st) => {
      const matchSearch =
        st.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.studentCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = selectedClassId === 'all' || st.classId === selectedClassId;
      const matchStatus = selectedStatus === 'all' || st.status === selectedStatus;
      return matchSearch && matchClass && matchStatus;
    });
  }, [students, searchTerm, selectedClassId, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  // Open Edit Student Modal
  const openEditStudent = (st: StudentItem) => {
    setEditingStudent(st);
    setStCode(st.studentCode);
    setStName(st.fullName);
    setStGender(st.gender);
    setStBirthDate(st.birthDate);
    setStClassId(st.classId);
    setStStatus(st.status);
    setStPhone(st.phone || '');
    setStEmail(st.email || '');
    setStAddress(st.address || '');
    setIsAddStudentOpen(true);
  };

  const openNewStudent = () => {
    setEditingStudent(null);
    setStCode(`HS8${String(students.length + 1).padStart(3, '0')}`);
    setStName('');
    setStGender('Nam');
    setStBirthDate('2011-01-01');
    setStClassId(classes[0]?.id || '');
    setStStatus('Đang học');
    setStPhone('');
    setStEmail('');
    setStAddress('');
    setIsAddStudentOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClass = classes.find((c) => c.id === stClassId);
    const className = targetClass ? targetClass.name : '8A1';

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        studentCode: stCode,
        fullName: stName,
        gender: stGender,
        birthDate: stBirthDate,
        classId: stClassId,
        className,
        status: stStatus,
        phone: stPhone,
        email: stEmail,
        address: stAddress,
      });
    } else {
      addStudent({
        studentCode: stCode,
        fullName: stName,
        gender: stGender,
        birthDate: stBirthDate,
        classId: stClassId,
        className,
        grade: 8,
        schoolYear: '2024-2025',
        status: stStatus,
        phone: stPhone,
        email: stEmail,
        address: stAddress,
      });
    }
    setIsAddStudentOpen(false);
  };

  // Class Management Handlers
  const openNewClass = () => {
    setEditingClass(null);
    setClassNameInput('');
    setClassGradeInput(8);
    setClassRoomInput('Phòng 205');
    setClassTeacherInput('Diệp Thanh Toàn');
    setIsAddClassOpen(true);
  };

  const openEditClass = (cls: ClassItem) => {
    setEditingClass(cls);
    setClassNameInput(cls.name);
    setClassGradeInput(cls.grade);
    setClassRoomInput(cls.room);
    setClassTeacherInput(cls.teacherName);
    setIsAddClassOpen(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classNameInput.trim()) return;

    if (editingClass) {
      updateClass(editingClass.id, {
        name: classNameInput.trim(),
        grade: classGradeInput as any,
        room: classRoomInput,
        teacherName: classTeacherInput,
      });
    } else {
      addClass({
        name: classNameInput.trim(),
        grade: classGradeInput as any,
        schoolYear: '2024-2025',
        room: classRoomInput,
        teacherName: classTeacherInput,
      });
    }
    setIsAddClassOpen(false);
  };

  const handleDeleteClass = (cls: ClassItem) => {
    const result = deleteClass(cls.id);
    if (!result.success) {
      setDeleteWarning(result.message);
    }
  };

  // Real Excel Export (.xlsx)
  const exportToExcel = () => {
    const exportData = filteredStudents.map((st, idx) => ({
      STT: idx + 1,
      'Mã Học Sinh': st.studentCode,
      'Họ và Tên': st.fullName,
      'Giới Tính': st.gender,
      'Ngày Sinh': st.birthDate,
      Lớp: st.className,
      Khối: st.grade,
      'Năm Học': st.schoolYear,
      'Trạng Thái': st.status,
      'Số Điện Thoại': st.phone || '',
      Email: st.email || '',
      'Địa Chỉ': st.address || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachHocSinh');
    XLSX.writeFile(workbook, `TayDoEdu_DanhSachHocSinh_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Real Excel Import (.xlsx / .csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet);

        const imported: Omit<StudentItem, 'id'>[] = rawJson.map((row, idx) => {
          const clsName = row['Lớp'] || row['className'] || '8A1';
          const matchCls = classes.find((c) => c.name.toLowerCase() === String(clsName).toLowerCase());
          const classId = matchCls ? matchCls.id : classes[0]?.id || 'c-8a1';

          return {
            studentCode: row['Mã Học Sinh'] || row['studentCode'] || `HS8${String(students.length + idx + 1).padStart(3, '0')}`,
            fullName: row['Họ và Tên'] || row['fullName'] || 'Học sinh mới',
            gender: row['Giới Tính'] === 'Nữ' ? 'Nữ' : 'Nam',
            birthDate: row['Ngày Sinh'] || '2011-01-01',
            classId,
            className: matchCls ? matchCls.name : clsName,
            grade: 8,
            schoolYear: '2024-2025',
            status: 'Đang học',
            phone: row['Số Điện Thoại'] || '',
            email: row['Email'] || '',
            address: row['Địa Chỉ'] || '',
          };
        });

        if (imported.length > 0) {
          importStudentsList(imported);
          alert(`Đã nhập thành công ${imported.length} học sinh từ file Excel!`);
        } else {
          alert('Không tìm thấy dữ liệu hợp lệ trong file Excel.');
        }
      } catch (err) {
        alert('Lỗi khi đọc file Excel. Vui lòng kiểm tra định dạng tệp .xlsx');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#1565D8] font-bold text-sm mb-1">
            <School className="w-4 h-4" />
            <span>Phân hệ Quản lý Học sinh & Lớp học</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#082B60]">
            Danh Sách & Hồ Sơ Học Sinh
          </h1>
          <p className="text-sm text-slate-500">
            Trường THCS Tây Đô – Khối 8 – Năm học 2024–2025
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Hidden Excel File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            Nhập Excel (.xlsx)
          </button>
          <button
            onClick={exportToExcel}
            className="px-3.5 py-2 rounded-xl border border-blue-300 bg-blue-50 text-[#1565D8] text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4 text-[#1565D8]" />
            Xuất Excel (.xlsx)
          </button>
          <button
            onClick={openNewStudent}
            className="px-4 py-2 rounded-xl bg-[#1565D8] text-white text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Thêm học sinh
          </button>
        </div>
      </div>

      {/* Class Overview Ribbon with Manage Class Buttons */}
      <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-[#082B60] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#1565D8]" />
            <span>Danh sách lớp học phụ trách ({classes.length} lớp)</span>
          </div>
          <button
            onClick={openNewClass}
            className="text-xs font-bold text-[#1565D8] hover:text-[#082B60] flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Tạo lớp mới
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {classes.map((cls) => {
            const count = students.filter((s) => s.classId === cls.id).length;
            const isSelected = selectedClassId === cls.id;

            return (
              <div
                key={cls.id}
                onClick={() => setSelectedClassId(isSelected ? 'all' : cls.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'border-[#1565D8] bg-blue-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-blue-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-[#082B60]">
                    Lớp {cls.name}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditClass(cls);
                      }}
                      className="text-slate-400 hover:text-blue-600 p-0.5"
                      title="Sửa lớp"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClass(cls);
                      }}
                      className="text-slate-400 hover:text-red-600 p-0.5"
                      title="Xóa lớp"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                  <span>{cls.room}</span>
                  <span className="font-bold text-[#1565D8]">{count} học sinh</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  GVCN: {cls.teacherName}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo họ tên hoặc mã học sinh..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1565D8]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Lọc lớp:</span>
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1565D8]"
            >
              <option value="all">Tất cả các lớp</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Lớp {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Trạng thái:</span>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1565D8]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Đang học">Đang học</option>
              <option value="Nghỉ học">Nghỉ học</option>
              <option value="Chuyển trường">Chuyển trường</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Student Data Table */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#082B60] text-white text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4 text-center w-12">STT</th>
                <th className="py-3 px-4">Mã HS</th>
                <th className="py-3 px-4">Họ và Tên</th>
                <th className="py-3 px-4 text-center">Giới tính</th>
                <th className="py-3 px-4">Ngày sinh</th>
                <th className="py-3 px-4 text-center">Lớp</th>
                <th className="py-3 px-4 text-center">Điểm TB Toán</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-serif">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Không tìm thấy học sinh nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((st, idx) => {
                  const globalIdx = (currentPage - 1) * itemsPerPage + idx + 1;
                  const mathGrade = grades.find(
                    (g) => g.studentId === st.id && g.subject === 'Toán'
                  );
                  const gpa = mathGrade?.average;

                  return (
                    <tr
                      key={st.id}
                      className="hover:bg-blue-50/50 transition-colors group"
                    >
                      <td className="py-3 px-4 text-center text-slate-500 font-medium">
                        {globalIdx}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#1565D8]">
                        {st.studentCode}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {st.fullName}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600">
                        {st.gender}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-xs">
                        {st.birthDate}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-[#082B60]">
                        {st.className}
                      </td>
                      <td className="py-3 px-4 text-center font-bold font-mono">
                        {gpa !== null && gpa !== undefined ? (
                          <span
                            className={
                              gpa >= 8
                                ? 'text-emerald-600'
                                : gpa >= 6.5
                                ? 'text-blue-600'
                                : 'text-amber-600'
                            }
                          >
                            {gpa.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            st.status === 'Đang học'
                              ? 'bg-emerald-100 text-emerald-700'
                              : st.status === 'Nghỉ học'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {st.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingStudent(st)}
                            className="p-1 rounded text-slate-400 hover:text-[#1565D8] hover:bg-blue-50 transition-colors"
                            title="Xem hồ sơ học sinh"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditStudent(st)}
                            className="p-1 rounded text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Chỉnh sửa học sinh"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Bạn có chắc muốn xóa học sinh ${st.fullName} (${st.studentCode})?`)) {
                                deleteStudent(st.id);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Xóa học sinh"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Hiển thị {filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{' '}
            {Math.min(currentPage * itemsPerPage, filteredStudents.length)} trên tổng số{' '}
            {filteredStudents.length} học sinh
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
            >
              Trang trước
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                  currentPage === i + 1
                    ? 'bg-[#1565D8] text-white'
                    : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: Thêm / Sửa Học Sinh */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-[#082B60]">
                {editingStudent ? 'Chỉnh Sửa Thông Tin Học Sinh' : 'Thêm Học Sinh Mới'}
              </h3>
              <button
                onClick={() => setIsAddStudentOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mã Học Sinh *
                  </label>
                  <input
                    type="text"
                    required
                    value={stCode}
                    onChange={(e) => setStCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#1565D8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và Tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={stName}
                    onChange={(e) => setStName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Giới tính
                  </label>
                  <select
                    value={stGender}
                    onChange={(e) => setStGender(e.target.value as 'Nam' | 'Nữ')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    value={stBirthDate}
                    onChange={(e) => setStBirthDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lớp phân bổ *
                  </label>
                  <select
                    value={stClassId}
                    onChange={(e) => setStClassId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#1565D8]"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số điện thoại phụ huynh
                  </label>
                  <input
                    type="text"
                    value={stPhone}
                    onChange={(e) => setStPhone(e.target.value)}
                    placeholder="09xx xxx xxx"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Trạng thái học tập
                  </label>
                  <select
                    value={stStatus}
                    onChange={(e) => setStStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                  >
                    <option value="Đang học">Đang học</option>
                    <option value="Nghỉ học">Nghỉ học</option>
                    <option value="Chuyển trường">Chuyển trường</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Địa chỉ thường trú
                </label>
                <input
                  type="text"
                  value={stAddress}
                  onChange={(e) => setStAddress(e.target.value)}
                  placeholder="Khu vực cư trú..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1565D8] text-white text-xs font-bold hover:bg-blue-700 shadow-sm"
                >
                  {editingStudent ? 'Lưu thay đổi' : 'Thêm học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Thêm / Sửa Lớp Học */}
      {isAddClassOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-[#082B60]">
                {editingClass ? 'Chỉnh Sửa Lớp Học' : 'Tạo Lớp Học Mới'}
              </h3>
              <button
                onClick={() => setIsAddClassOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên Lớp (ví dụ: 8A5) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="8A5"
                  value={classNameInput}
                  onChange={(e) => setClassNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#1565D8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Khối lớp
                  </label>
                  <select
                    value={classGradeInput}
                    onChange={(e) => setClassGradeInput(Number(e.target.value))}
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
                    Phòng học
                  </label>
                  <input
                    type="text"
                    value={classRoomInput}
                    onChange={(e) => setClassRoomInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Giáo viên chủ nhiệm
                </label>
                <input
                  type="text"
                  value={classTeacherInput}
                  onChange={(e) => setClassTeacherInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddClassOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1565D8] text-white text-xs font-bold hover:bg-blue-700 shadow-sm"
                >
                  {editingClass ? 'Lưu thay đổi' : 'Tạo lớp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Xem Hồ Sơ Chi Tiết Học Sinh */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-[#1565D8] font-bold flex items-center justify-center text-lg">
                  {viewingStudent.fullName.slice(-2)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#082B60]">
                    {viewingStudent.fullName}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Mã HS: {viewingStudent.studentCode} · Lớp {viewingStudent.className}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingStudent(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-xs text-slate-500 block">Giới tính:</span>
                  <span className="font-bold text-slate-800">{viewingStudent.gender}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Ngày sinh:</span>
                  <span className="font-bold text-slate-800 font-mono">{viewingStudent.birthDate}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Năm học:</span>
                  <span className="font-bold text-slate-800">{viewingStudent.schoolYear}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Trạng thái:</span>
                  <span className="font-bold text-emerald-600">{viewingStudent.status}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-600 text-xs">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>Điện thoại: {viewingStudent.phone || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-xs">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>Email: {viewingStudent.email || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-xs">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Địa chỉ: {viewingStudent.address || 'Chưa cập nhật'}</span>
                </div>
              </div>

              {/* Academic Snapshot */}
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="text-xs font-bold text-[#082B60] mb-2">
                  Kết quả học tập môn phụ trách (HK1)
                </h4>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-white p-2 rounded-lg border border-blue-100">
                    <div className="text-[11px] text-slate-500">Môn Toán</div>
                    <div className="text-lg font-black text-[#1565D8]">
                      {grades.find((g) => g.studentId === viewingStudent.id && g.subject === 'Toán')?.average?.toFixed(1) || 'Chưa đủ'}
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-blue-100">
                    <div className="text-[11px] text-slate-500">Môn Tin học</div>
                    <div className="text-lg font-black text-[#24C4E8]">
                      {grades.find((g) => g.studentId === viewingStudent.id && g.subject === 'Tin học')?.average?.toFixed(1) || 'Chưa đủ'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingStudent(null)}
                className="px-4 py-2 rounded-xl bg-[#1565D8] text-white text-xs font-bold hover:bg-blue-700"
              >
                Đóng hồ sơ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning Alert Modal */}
      {deleteWarning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Cảnh Báo Dữ Liệu</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">{deleteWarning}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setDeleteWarning(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
