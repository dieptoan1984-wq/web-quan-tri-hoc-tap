# KẾ HOẠCH TRIỂN KHAI HỆ THỐNG TÂY ĐÔ EDU

Hệ thống dạy học và quản lý kết quả học tập chuyên biệt dành cho Thầy Diệp Thanh Toàn – Giáo viên Toán & Tin học, Trường THCS Tây Đô. Ứng dụng đáp ứng trọn vẹn 8 phân hệ quản lý giáo dục, hỗ trợ đầy đủ máy tính, máy tính bảng và điện thoại với giao diện bám sát 100% hình ảnh tham chiếu thực tế.

---

## Ý kiến người dùng & Quyết định then chốt

> [!IMPORTANT]
> Dưới đây là các định hướng kiến trúc cốt lõi đã được thiết lập nhằm đem lại trải nghiệm vận hành trơn tru và hoàn chỉnh nhất cho thầy cô và học sinh:

- **Bộ nhận diện & Kiểu chữ**: Bắt buộc sử dụng phông chữ chuẩn giáo dục Việt Nam `Times New Roman` cho toàn bộ giao diện (tiêu đề, bảng điểm, công thức, menu, nút bấm). Tông màu chủ đạo: Xanh navy đậm `#082B60`, Xanh dương `#1565D8`, Xanh công nghệ `#168BFF`, Xanh cyan `#24C4E8` trên nền dịu mắt `#F1F7FF`.
- **Lưu trữ & Chuyển đổi vai trò linh hoạt**: Sử dụng hệ thống Reactive State kết hợp `localStorage` đồng bộ hóa đầy đủ. Tích hợp thanh chuyển đổi nhanh giữa tài khoản Giáo viên (**GV. Diệp Thanh Toàn**) và Học sinh (**Nguyễn Minh Anh - 8A1**) để thầy có thể kiểm tra trực tiếp quy trình giao bài và làm bài thi trực tuyến.
- **Dữ liệu mẫu thực tế**: Khởi tạo sẵn dữ liệu 4 lớp phụ trách (**8A1, 8A2, 8A3, 8A4**) với đầy đủ môn Toán & Tin học, ngân hàng đề kiểm tra 15 phút, giữa kỳ, cuối kỳ, thư viện bài giảng điện tử và 5 mô phỏng tương tác.
- **Tính toán điểm số THCS**: Áp dụng chuẩn công thức tính điểm THCS hiện hành:
  $$\text{ĐTB học kỳ} = \frac{\sum \text{ĐĐGtx} + 2 \times \text{ĐGK} + 3 \times \text{ĐCK}}{\text{Số cột ĐĐGtx} + 5}$$
  Có bộ cấu hình tùy biến trọng số trong phần Cài đặt hệ thống.

---

## 1. Tổng quan & Mục tiêu hệ thống

- **Mục tiêu**: Cung cấp giải pháp phần mềm EdTech toàn diện, giúp giáo viên quản lý lớp học, nhập xuất bảng điểm Excel, tổ chức thi trắc nghiệm & tự luận trực tuyến, giảng dạy trực quan qua mô phỏng hình học và lưu trữ học liệu số.
- **Người dùng mục tiêu**:
  - *Giáo viên*: GV. Diệp Thanh Toàn (quản lý học sinh, nhập điểm, tạo đề thi, chấm bài tự luận, xuất báo cáo PDF/Excel).
  - *Học sinh THCS*: Tham gia làm bài kiểm tra trực tuyến có đồng hồ đếm ngược, xem kết quả, tải bài tập và tương tác với các mô hình Toán học.
  - *Cán bộ quản lý*: Xem báo cáo thống kê kết quả học tập toàn khối, so sánh chất lượng giữa các lớp.

---

## 2. Trải nghiệm người dùng & Thiết kế giao diện (UI/UX)

### Luồng tương tác chính (User Flows)
1. **Header & Thanh điều hướng nhanh**:
   - Header phía trên chứa Logo biểu tượng sách mở kết hợp mũ cử nhân, thương hiệu **TÂY ĐÔ EDU** với hiệu ứng ánh sáng công nghệ và ảnh nền cổng Trường THCS Tây Đô.
   - Thẻ thông tin giáo viên bên phải: Tên, chức vụ, bộ môn, ảnh đại diện và menu chuyển đổi chế độ xem/đăng xuất.
2. **Sidebar cố định linh hoạt**:
   - Nền xanh navy `#082B60` sang trọng, hiệu ứng quả địa cầu công nghệ và khẩu hiệu *"Tri thức – Kết nối tương lai"*.
   - 8 mục menu chức năng: Trang chủ, Học sinh, Bảng điểm, Kiểm tra, Bài giảng, Mô phỏng, Báo cáo, Cài đặt.
   - Hỗ trợ co giãn gọn gàng (Collapsible Sidebar) và menu Drawer trên thiết bị di động.
3. **Màn hình Dashboard Trang chủ (bám sát ảnh tham chiếu)**:
   - **4 thẻ thống kê đầu trang**: Tổng học sinh (128), Lớp đang quản lý (4), Bài kiểm tra (12), Tỉ lệ hoàn thành (92%).
   - **6 thẻ phân hệ tương tác**:
     1. *Quản lý danh sách học sinh*: Bảng tóm tắt học sinh tiêu biểu, phân loại Giỏi/Khá, thao tác nhanh.
     2. *Thống kê kết quả học tập*: Biểu đồ cột so sánh điểm Toán và Tin học của 4 lớp (8A1 - 8A4), kèm các chỉ số ĐTB toàn khối (8.3), tăng trưởng (+0.5), tỉ lệ trên TB (95%).
     3. *Kiểm tra trực tuyến & chấm điểm*: Danh sách đề kiểm tra với các nút chức năng Tạo đề, Chấm tự động, Xem kết quả.
     4. *Thư viện bài giảng & bài tập*: Lọc theo thể loại Giáo án PDF, Video, Phiếu bài tập, Bài giảng PPT.
     5. *Mô phỏng Toán học tương tác*: Khung canvas trực quan tam giác góc 60°, bộ công cụ hình học, thanh thu phóng.
     6. *Tài khoản & bảo mật*: Thông tin cá nhân, công tắc Xác thực 2 bước, quản trị mật khẩu và phân quyền.
4. **Phân hệ chi tiết**:
   - **Phân hệ Học sinh**: Quản lý lớp, thêm/sửa/xóa học sinh, tìm kiếm, lọc theo lớp/khối, Import/Export file Excel (.xlsx), xem học bạ chi tiết.
   - **Phân hệ Bảng điểm**: Sổ điểm điện tử trực quan, nhập điểm trực tiếp như Excel, tự động tính ĐTB theo đúng quy chế THCS, cảnh báo điểm dưới ngưỡng, xuất sổ điểm Excel.
   - **Phân hệ Kiểm tra & Thi trực tuyến**:
     - *Phía giáo viên*: Tạo ngân hàng câu hỏi (trắc nghiệm 4 lựa chọn, đúng/sai, điền khuyết, tự luận), hẹn giờ mở/đóng đề, xem danh sách nộp bài và chấm bài tự luận trực tiếp.
     - *Phía học sinh*: Giao diện phòng thi trực tuyến chuyên nghiệp, đồng hồ đếm ngược, tự động lưu bài khi làm, nộp bài nhận kết quả ngay (trắc nghiệm).
   - **Phân hệ Thư viện học liệu**: Phân chia theo môn (Toán, Tin học) và khối (6, 7, 8, 9), hỗ trợ xem trước tài liệu, nhúng công thức Toán học đẹp mắt bằng KaTeX/MathJax.
   - **Phân hệ 5 Mô phỏng Toán học thực tế**:
     1. *Tổng 3 góc tam giác = 180°*: Kéo thả 3 đỉnh A, B, C tự do; tự động tính và hiển thị số đo 3 góc và tổng $\hat{A} + \hat{B} + \hat{C} = 180^\circ$; minh họa chứng minh bằng đường thẳng song song qua đỉnh A.
     2. *Thước đo góc trực quan*: Thước đo nửa cung tròn có thể xoay góc và dịch chuyển tâm để đo các góc mẫu trên màn hình.
     3. *Vẽ đường thẳng song song*: Mô phỏng thước thẳng và ê-ke trượt để dựng đường thẳng song song đi qua một điểm ngoài đường thẳng cho trước.
     4. *Khám phá tam giác*: Thanh trượt thay đổi 3 cạnh $a, b, c$, tự động kiểm tra bất đẳng thức tam giác $|b-c| < a < b+c$, phân loại (nhọn, vuông, tù, đều, cân) và tính diện tích/chu vi theo công thức Heron.
     5. *Đồ thị hàm số bậc nhất*: Vẽ hệ trục tọa độ Oxy, thay đổi hệ số $a$ và $b$ trên thanh trượt $y = ax + b$, hiển thị điểm cắt trục tung, trục hoành và góc nghiêng của đường thẳng.
   - **Phân hệ Báo cáo & Thống kê**: Biểu đồ phân phối phổ điểm, tỉ lệ học lực (Giỏi, Khá, Đạt, Chưa đạt), so sánh giữa các lớp và các kỳ kiểm tra.
   - **Phân hệ Cài đặt**: Tùy chỉnh công thức tính điểm, thông tin trường/lớp, sao lưu & khôi phục dữ liệu hệ thống.

---

## 3. Kiến trúc kỹ thuật & Tổ chức dữ liệu

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TÂY ĐÔ EDU APPLICATION                          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┴───────────────────────────┐
       ▼                                                        ▼
┌────────────────────────────────┐            ┌────────────────────────────────┐
│   GLOBAL STORE & PERSISTENCE   │            │        UI CORE LAYOUT          │
│ • LocalStorage Sync Engine     │            │ • Header (Brand, GV Info, Role)│
│ • Initial Demo Data Seeder     │◄───────────┤ • Left Sidebar (8 Mod Nav)     │
│ • Class & Student Management   │            │ • Responsive Viewport & Mobile │
│ • Gradebook & Formula Engine   │            │ • Times New Roman Font Rules   │
│ • Online Exam & Test Submissions            └───────────────┬────────────────┘
│ • Lesson Library & KaTeX Math  │                            │
│ • 5 Math Interactive Canvases  │                            ▼
└───────────────┬────────────────┘            ┌────────────────────────────────┐
                │                             │        ACTIVE MODULE VIEW      │
                │                             │ 1. Dashboard (Mockup matched)  │
                ├────────────────────────────►│ 2. Student Management          │
                │                             │ 3. Digital Gradebook           │
                │                             │ 4. Online Exam & Auto-Grading  │
                │                             │ 5. Lesson Library & KaTeX      │
                │                             │ 6. 5 Interactive Math Sims     │
                │                             │ 7. Academic Reports & Stats    │
                │                             │ 8. System & Account Settings   │
                └────────────────────────────►└────────────────────────────────┘
```

### Cấu trúc dữ liệu chính (Data Models)
- `ClassItem`: `id`, `name` (8A1..), `grade` (8), `schoolYear` ("2024-2025"), `homeroomTeacher`, `totalStudents`.
- `StudentItem`: `id`, `studentCode`, `fullName`, `gender`, `birthDate`, `classId`, `className`, `status`, `avatar`.
- `GradeRecord`: `id`, `studentId`, `subject` ("Toán" | "Tin học"), `semester` ("HK1" | "HK2"), `scoresTx` (number[]), `scoreGk` (number | null), `scoreCk` (number | null), `average` (number | null), `note`.
- `Exam`: `id`, `title`, `subject`, `grade`, `type` ("15p" | "giua_ky" | "cuoi_ky"), `durationMinutes`, `totalQuestions`, `isOpen`, `questions` (list of Multiple Choice, True/False, Short Answer, Essay), `assignedClasses`.
- `ExamSubmission`: `id`, `examId`, `studentId`, `studentName`, `submittedAt`, `answers`, `autoScore`, `essayScore`, `totalScore`, `status` ("chấm tự động" | "đã chấm xong").
- `LessonMaterial`: `id`, `title`, `subject`, `grade`, `category` ("GiaoAn" | "Video" | "PhieuBaiTap" | "BaiGiangDienTu"), `date`, `fileType`, `fileUrl`, `description`, `mathContent`.

---

## 4. Các bước triển khai chi tiết

1. **Bước 1: Thiết lập phông chữ, bảng màu và bộ khung giao diện**:
   - Cập nhật `index.html` và `metadata.json` đúng chuẩn thông tin thương hiệu TÂY ĐÔ EDU.
   - Cấu hình phông chữ `Times New Roman` và các biến màu CSS theo chuẩn thiết kế quy định.
   - Xây dựng bố cục Header, Sidebar và chuyển đổi responsive.
2. **Bước 2: Xây dựng Module State & Dữ liệu mẫu (Data Seed)**:
   - Khởi tạo đầy đủ danh sách 4 lớp học (8A1, 8A2, 8A3, 8A4), danh sách học sinh chuẩn, bảng điểm môn Toán & Tin học.
   - Thư viện đề thi mẫu, câu hỏi trắc nghiệm & tự luận, tài liệu giảng dạy.
3. **Bước 3: Hoàn thiện Dashboard trang chủ chuẩn theo ảnh tham chiếu**:
   - 4 thẻ thống kê đầu trang đồng bộ dữ liệu thật.
   - 6 thẻ chức năng tương tác đầy đủ: Bảng học sinh, biểu đồ so sánh điểm 4 lớp, danh mục bài thi, danh mục bài giảng, mô phỏng tam giác và thẻ hồ sơ cá nhân.
4. **Bước 4: Hoàn thiện Phân hệ Học sinh & Bảng điểm điện tử**:
   - Bảng điểm cho phép nhập trực tiếp, kiểm tra hợp lệ điểm (0 - 10), công thức tính tự động chuẩn THCS.
   - Hỗ trợ xuất và nhập dữ liệu Excel dạng CSV/XLSX.
5. **Bước 5: Hoàn thiện Phân hệ Kiểm tra trực tuyến & Chấm điểm**:
   - Tạo đề thi, giao bài cho lớp.
   - Chế độ làm bài thi thực tế cho học sinh với đồng hồ đếm ngược và nộp bài.
   - Giao diện giáo viên chấm bài tự luận và công bố điểm vào sổ điểm.
6. **Bước 6: Hoàn thiện 5 Mô phỏng Toán học tương tác Canvas/SVG**:
   - Mô phỏng 1: Tổng 3 góc tam giác 180° kéo thả đỉnh trực tiếp.
   - Mô phỏng 2: Thước đo góc xoay tròn và đo đạc.
   - Mô phỏng 3: Thước và ê-ke vẽ đường thẳng song song.
   - Mô phỏng 4: Khám phá tam giác và kiểm tra bất đẳng thức.
   - Mô phỏng 5: Vẽ đồ thị hàm số bậc nhất $y = ax + b$ động.
7. **Bước 7: Hoàn thiện Thư viện bài giảng, Báo cáo thống kê và Cài đặt**:
   - Hỗ trợ công thức Toán học KaTeX, bộ lọc phân loại.
   - Báo cáo phân loại học lực, xuất báo cáo.
   - Cài đặt hệ thống, sao lưu & khôi phục dữ liệu.
8. **Bước 8: Kiểm thử toàn diện và biên dịch hệ thống (`compile_applet`)**.
