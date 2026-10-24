import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  ShieldCheck,
  Lock,
  KeyRound,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  History,
  User,
  School,
  Save,
} from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const {
    teacherProfile,
    updateTeacherProfile,
    formulaConfig,
    updateFormulaConfig,
    resetAllData,
  } = useApp();

  // Profile form state
  const [fullName, setFullName] = useState(teacherProfile.fullName);
  const [title, setTitle] = useState(teacherProfile.title);
  const [subject, setSubject] = useState(teacherProfile.subject);
  const [school, setSchool] = useState(teacherProfile.school);
  const [email, setEmail] = useState(teacherProfile.email);
  const [phone, setPhone] = useState(teacherProfile.phone);

  // Formula form state
  const [weightTx, setWeightTx] = useState(formulaConfig.weightTx);
  const [weightGk, setWeightGk] = useState(formulaConfig.weightGk);
  const [weightCk, setWeightCk] = useState(formulaConfig.weightCk);

  // Security state
  const [twoFactor, setTwoFactor] = useState(teacherProfile.twoFactorEnabled);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacherProfile({
      fullName,
      title,
      subject,
      school,
      email,
      phone,
    });
    showToast('Đã lưu thông tin hồ sơ giáo viên thành công!');
  };

  const handleSaveFormula = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormulaConfig({
      weightTx: Number(weightTx),
      weightGk: Number(weightGk),
      weightCk: Number(weightCk),
    });
    showToast('Đã cập nhật trọng số và tự động tính lại toàn bộ bảng điểm!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert('Mật khẩu mới phải có tối thiểu 6 ký tự!');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    setShowPasswordModal(false);
    setNewPassword('');
    setConfirmPassword('');
    showToast('Đã đổi mật khẩu thành công!');
  };

  const handleResetData = () => {
    if (
      confirm(
        'Bạn có chắc chắn muốn đặt lại toàn bộ hệ thống về dữ liệu mẫu ban đầu (128 học sinh, 4 lớp học, đề thi chuẩn)?'
      )
    ) {
      resetAllData();
      showToast('Đã khôi phục dữ liệu ban đầu thành công!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-[#16A765] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-in fade-in z-50">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#1565D8] font-bold text-sm mb-1">
            <Settings className="w-4 h-4" />
            <span>Phân hệ Cài Đặt Hệ Thống & Bảo Mật</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#082B60]">
            Cấu Hình Hệ Thống Tây Đô Edu
          </h1>
          <p className="text-sm text-slate-500">
            Thông tin giáo viên, quy chế tính điểm THCS, an toàn tài khoản và sao lưu dữ liệu
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= CARD 1: THÔNG TIN HỒ SƠ GIÁO VIÊN ================= */}
        <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
            <User className="w-5 h-5 text-[#1565D8]" />
            <h2 className="text-base font-bold text-[#082B60]">
              Thông Tin Giáo Viên & Đơn Vị Công Tác
            </h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Họ và Tên Giáo Viên *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#1565D8]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chức vụ
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bộ môn phụ trách
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Đơn vị trường học
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email liên hệ
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#1565D8] text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Lưu thông tin giáo viên
              </button>
            </div>
          </form>
        </div>

        {/* ================= CARD 2: CẤU HÌNH TRỌNG SỐ TÍNH ĐIỂM ================= */}
        <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <Sliders className="w-5 h-5 text-[#1565D8]" />
              <h2 className="text-base font-bold text-[#082B60]">
                Cấu Hình Quy Tắc Tính Điểm THCS
              </h2>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed font-serif">
              Hệ thống áp dụng công thức quy chế giáo dục THCS. Thầy cô có thể điều chỉnh trọng số (hệ số) nếu có sự thay đổi quy chế mà không cần can thiệp mã nguồn:
            </p>

            <form onSubmit={handleSaveFormula} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Hệ số ĐĐGtx
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="3"
                    value={weightTx}
                    onChange={(e) => setWeightTx(parseInt(e.target.value) || 1)}
                    className="w-16 mx-auto text-center font-mono font-bold text-base py-1 bg-white border border-slate-300 rounded-lg"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Mặc định: 1</div>
                </div>

                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Hệ số Giữa kỳ
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={weightGk}
                    onChange={(e) => setWeightGk(parseInt(e.target.value) || 2)}
                    className="w-16 mx-auto text-center font-mono font-bold text-base py-1 bg-white border border-slate-300 rounded-lg text-[#1565D8]"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Mặc định: 2</div>
                </div>

                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-center">
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Hệ số Cuối kỳ
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={weightCk}
                    onChange={(e) => setWeightCk(parseInt(e.target.value) || 3)}
                    className="w-16 mx-auto text-center font-mono font-bold text-base py-1 bg-white border border-slate-300 rounded-lg text-indigo-700"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Mặc định: 3</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 text-center font-mono">
                ĐTB = (Tổng ĐĐGtx × {weightTx} + ĐGK × {weightGk} + ĐCK × {weightCk}) / (Số cột Tx × {weightTx} + {weightGk + weightCk})
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1565D8] text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Cập nhật công thức tính điểm
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ================= CARD 3: TÀI KHOẢN VÀ BẢO MẬT ================= */}
        <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
            <ShieldCheck className="w-5 h-5 text-[#1565D8]" />
            <h2 className="text-base font-bold text-[#082B60]">
              Bảo Mật Tài Khoản & Phân Quyền
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <div className="text-xs font-bold text-slate-800">Mật khẩu tài khoản</div>
                <div className="text-[11px] text-slate-500">Lần đổi gần nhất: 15/10/2024</div>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Đổi mật khẩu
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <div className="text-xs font-bold text-slate-800">Xác thực 2 bước (2FA)</div>
                <div className="text-[11px] text-slate-500">Bảo vệ tài khoản qua mã xác minh</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setTwoFactor(val);
                    updateTeacherProfile({ twoFactorEnabled: val });
                    showToast(val ? 'Đã bật xác thực 2 bước!' : 'Đã tắt xác thực 2 bước.');
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1565D8]"></div>
              </label>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Ma trận phân quyền hệ thống:
              </span>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• <strong>Giáo viên Diệp Thanh Toàn:</strong> Quản lý học sinh, nhập xuất điểm, tạo đề thi, chấm bài.</li>
                <li>• <strong>Học sinh THCS:</strong> Làm bài thi trực tuyến, xem kết quả, tải bài học.</li>
                <li>• <strong>Quản trị viên:</strong> Cấu hình hệ thống, quản lý tài khoản.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ================= CARD 4: SAO LƯU & KHÔI PHỤC DỮ LIỆU ================= */}
        <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <RotateCcw className="w-5 h-5 text-red-500" />
              <h2 className="text-base font-bold text-[#082B60]">
                Sao Lưu & Khôi Phục Dữ Liệu
              </h2>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed font-serif">
              Tất cả các thao tác thêm, sửa, xóa học sinh, bảng điểm, bài thi đều được lưu trữ trực tiếp trên trình duyệt của Thầy. Nếu cần nạp lại dữ liệu chuẩn mẫu (128 học sinh, 4 lớp 8A1-8A4, các đề kiểm tra và mô phỏng gốc), hãy sử dụng nút bên dưới:
            </p>

            <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-2">
              <div className="flex items-center gap-2 text-red-700 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Khôi phục dữ liệu gốc của TÂY ĐÔ EDU</span>
              </div>
              <p className="text-[11px] text-red-600">
                Hành động này sẽ thiết lập lại toàn bộ dữ liệu mẫu ban đầu như trong thiết kế tham chiếu.
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleResetData}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Đặt lại dữ liệu mẫu ban đầu
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: ĐỔI MẬT KHẨU */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#082B60] pb-2 border-b border-slate-100 mb-4">
              Đổi Mật Khẩu Tài Khoản
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mật khẩu mới (tối thiểu 6 ký tự)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Xác nhận lại mật khẩu mới
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1565D8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1565D8] text-white text-xs font-bold hover:bg-blue-700"
                >
                  Cập nhật mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
