import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  RotateCcw,
  Compass,
  Maximize2,
  Minimize2,
  Grid,
  Info,
  CheckCircle2,
  Sliders,
  Play,
  Layers,
  Sparkles,
  HelpCircle,
  Eye,
} from 'lucide-react';

export const MathSimulations: React.FC = () => {
  const { selectedSimulation, setSelectedSimulation } = useApp();

  // Active Simulation Tab: 'sum180' | 'protractor' | 'parallel' | 'triangle_explore' | 'graph_function'
  const [activeSim, setActiveSim] = useState<string>(selectedSimulation || 'sum180');

  // ================= SIM 1: TỔNG BA GÓC TAM GIÁC 180° =================
  const [vertA, setVertA] = useState({ x: 250, y: 70 });
  const [vertB, setVertB] = useState({ x: 100, y: 280 });
  const [vertC, setVertC] = useState({ x: 420, y: 280 });
  const [dragVertex, setDragVertex] = useState<'A' | 'B' | 'C' | null>(null);
  const [showProofLine, setShowProofLine] = useState(true);
  const [proofStep, setProofStep] = useState<number>(1);

  const resetTriangle = () => {
    setVertA({ x: 250, y: 70 });
    setVertB({ x: 100, y: 280 });
    setVertC({ x: 420, y: 280 });
  };

  const dist = (p1: { x: number; y: number }, p2: { x: number; y: number }) =>
    Math.hypot(p1.x - p2.x, p1.y - p2.y);

  const sideA = dist(vertB, vertC);
  const sideB = dist(vertA, vertC);
  const sideC = dist(vertA, vertB);

  const angleA = Math.round(
    Math.acos(Math.max(-1, Math.min(1, (sideB * sideB + sideC * sideC - sideA * sideA) / (2 * sideB * sideC)))) *
      (180 / Math.PI)
  ) || 60;
  const angleB = Math.round(
    Math.acos(Math.max(-1, Math.min(1, (sideA * sideA + sideC * sideC - sideB * sideB) / (2 * sideA * sideC)))) *
      (180 / Math.PI)
  ) || 60;
  const angleC = Math.max(0, 180 - angleA - angleB);

  const handleTriangleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragVertex) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    if (dragVertex === 'A') setVertA({ x: Math.max(40, Math.min(480, x)), y: Math.max(40, Math.min(230, y)) });
    if (dragVertex === 'B') setVertB({ x: Math.max(40, Math.min(vertC.x - 60, x)), y: Math.max(150, Math.min(340, y)) });
    if (dragVertex === 'C') setVertC({ x: Math.max(vertB.x + 60, Math.min(500, x)), y: Math.max(150, Math.min(340, y)) });
  };

  // ================= SIM 2: ĐO GÓC BẰNG THƯỚC ĐO GÓC (PROTRACTOR) =================
  const [protractorPos, setProtractorPos] = useState({ x: 260, y: 220 });
  const [protractorAngle, setProtractorAngle] = useState(0);
  const [isDraggingProtractor, setIsDraggingProtractor] = useState(false);
  const [targetAngle, setTargetAngle] = useState(65);
  const [studentInputAngle, setStudentInputAngle] = useState('');
  const [measureFeedback, setMeasureFeedback] = useState<string | null>(null);

  const generateNewAngle = () => {
    const angles = [35, 45, 60, 75, 90, 110, 120, 135, 150];
    const next = angles[Math.floor(Math.random() * angles.length)];
    setTargetAngle(next);
    setStudentInputAngle('');
    setMeasureFeedback(null);
  };

  const checkMeasuredAngle = () => {
    const val = parseFloat(studentInputAngle);
    if (isNaN(val)) return;
    const diff = Math.abs(val - targetAngle);
    if (diff === 0) {
      setMeasureFeedback('Chính xác tuyệt đối! Em đo rất chuẩn (10/10).');
    } else if (diff <= 2) {
      setMeasureFeedback(`Rất tốt! Sai số chỉ ${diff}° (Chấp nhận được trong thực hành).`);
    } else {
      setMeasureFeedback(`Chưa chính xác. Góc thực tế là ${targetAngle}°. Em hãy quan sát kỹ vạch chia độ.`);
    }
  };

  // ================= SIM 3: VẼ ĐƯỜNG THẲNG SONG SONG =================
  const [parallelStep, setParallelStep] = useState(1);

  // ================= SIM 4: KHÁM PHÁ TAM GIÁC (BẤT ĐẲNG THỨC TAM GIÁC) =================
  const [sideInputA, setSideInputA] = useState(6);
  const [sideInputB, setSideInputB] = useState(8);
  const [sideInputC, setSideInputC] = useState(10);

  // Check triangle inequality
  const isValidTriangle =
    sideInputA + sideInputB > sideInputC &&
    sideInputA + sideInputC > sideInputB &&
    sideInputB + sideInputC > sideInputA;

  // Classify triangle
  const classifyTriangle = () => {
    if (!isValidTriangle) return 'Không thể tạo thành tam giác (Vi phạm bất đẳng thức tam giác)';

    const sides = [sideInputA, sideInputB, sideInputC].sort((x, y) => x - y);
    const [x, y, z] = sides;

    const isRight = Math.abs(x * x + y * y - z * z) < 0.01;
    const isEquilateral = sideInputA === sideInputB && sideInputB === sideInputC;
    const isIsosceles = sideInputA === sideInputB || sideInputB === sideInputC || sideInputA === sideInputC;

    if (isEquilateral) return 'Tam giác đều (Ba cạnh bằng nhau)';
    if (isRight && isIsosceles) return 'Tam giác vuông cân (Áp dụng định lý Pythagore)';
    if (isRight) return 'Tam giác vuông (Thỏa mãn định lý Pythagore: a² + b² = c²)';
    if (isIsosceles) return 'Tam giác cân (Có hai cạnh bằng nhau)';
    if (x * x + y * y > z * z) return 'Tam giác nhọn (Tất cả các góc đều nhọn < 90°)';
    return 'Tam giác tù (Có một góc tù > 90°)';
  };

  // Perimeter and Heron's Formula Area
  const perimeter = sideInputA + sideInputB + sideInputC;
  const semiP = perimeter / 2;
  const areaHeron = isValidTriangle
    ? Math.sqrt(Math.max(0, semiP * (semiP - sideInputA) * (semiP - sideInputB) * (semiP - sideInputC)))
    : 0;

  // ================= SIM 5: ĐỒ THỊ HÀM SỐ Y = AX + B =================
  const [slopeA, setSlopeA] = useState(2);
  const [interceptB, setInterceptB] = useState(-3);

  return (
    <div className="space-y-6">
      {/* Simulation Header */}
      <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#1565D8] font-bold text-sm mb-1">
            <Compass className="w-4 h-4" />
            <span>Phân hệ Mô Phỏng Toán Học Tương Tác Trực Quan</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#082B60]">
            Phòng Thí Nghiệm & Mô Phỏng Hình Học, Đại Số
          </h1>
          <p className="text-sm text-slate-500">
            Dành cho giáo viên giảng bài trên máy chiếu/máy tính và học sinh tự khám phá trên điện thoại
          </p>
        </div>

        {/* 5 Tab Navigation Switches */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {[
            { id: 'sum180', label: '1. Tổng 3 góc 180°' },
            { id: 'protractor', label: '2. Thước đo góc' },
            { id: 'parallel', label: '3. Thước & Ê-ke' },
            { id: 'triangle_explore', label: '4. Bất đẳng thức tam giác' },
            { id: 'graph_function', label: '5. Đồ thị y = ax + b' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSim(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSim === tab.id
                  ? 'bg-[#1565D8] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SIMULATION 1: TỔNG BA GÓC TAM GIÁC BẰNG 180° */}
      {/* ========================================================================= */}
      {activeSim === 'sum180' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Stage (7 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-blue-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-blue-100 text-[#1565D8]">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-bold text-[#082B60]">
                    Kéo Thả Các Đỉnh A, B, C Để Khám Phá
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetTriangle}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Đặt lại
                  </button>
                </div>
              </div>

              {/* Interactive SVG Canvas */}
              <div className="relative w-full h-[360px] bg-gradient-to-b from-blue-50/40 to-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center">
                <svg
                  viewBox="0 0 520 360"
                  className="w-full h-full select-none cursor-crosshair"
                  onMouseMove={handleTriangleMouseMove}
                  onMouseUp={() => setDragVertex(null)}
                  onMouseLeave={() => setDragVertex(null)}
                >
                  {/* Grid lines */}
                  <g stroke="#e2e8f0" strokeWidth="0.8">
                    {Array.from({ length: 26 }).map((_, i) => (
                      <line key={`gx-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="360" />
                    ))}
                    {Array.from({ length: 18 }).map((_, i) => (
                      <line key={`gy-${i}`} x1="0" y1={i * 20} x2="520" y2={i * 20} />
                    ))}
                  </g>

                  {/* Parallel Line xy through A (Demonstration line) */}
                  {showProofLine && (
                    <g stroke="#7655DF" strokeWidth="1.8" strokeDasharray="5,5">
                      <line x1={vertA.x - 180} y1={vertA.y} x2={vertA.x + 180} y2={vertA.y} />
                      <text x={vertA.x - 190} y={vertA.y + 4} fill="#7655DF" className="text-xs font-bold">x</text>
                      <text x={vertA.x + 185} y={vertA.y + 4} fill="#7655DF" className="text-xs font-bold">y</text>
                    </g>
                  )}

                  {/* Triangle Polygon */}
                  <polygon
                    points={`${vertA.x},${vertA.y} ${vertB.x},${vertB.y} ${vertC.x},${vertC.y}`}
                    fill="#1565D8"
                    fillOpacity="0.15"
                    stroke="#1565D8"
                    strokeWidth="3"
                  />

                  {/* Vertex A (Blue) */}
                  <circle
                    cx={vertA.x}
                    cy={vertA.y}
                    r="8"
                    fill="#1565D8"
                    stroke="#fff"
                    strokeWidth="3"
                    className="cursor-pointer hover:scale-125 transition-transform"
                    onMouseDown={() => setDragVertex('A')}
                  />
                  <text
                    x={vertA.x}
                    y={vertA.y - 12}
                    textAnchor="middle"
                    className="text-sm font-extrabold fill-[#082B60]"
                  >
                    A ({angleA}°)
                  </text>

                  {/* Vertex B (Green) */}
                  <circle
                    cx={vertB.x}
                    cy={vertB.y}
                    r="8"
                    fill="#16A765"
                    stroke="#fff"
                    strokeWidth="3"
                    className="cursor-pointer hover:scale-125 transition-transform"
                    onMouseDown={() => setDragVertex('B')}
                  />
                  <text
                    x={vertB.x - 14}
                    y={vertB.y + 20}
                    textAnchor="middle"
                    className="text-sm font-extrabold fill-[#082B60]"
                  >
                    B ({angleB}°)
                  </text>

                  {/* Vertex C (Orange) */}
                  <circle
                    cx={vertC.x}
                    cy={vertC.y}
                    r="8"
                    fill="#F59E0B"
                    stroke="#fff"
                    strokeWidth="3"
                    className="cursor-pointer hover:scale-125 transition-transform"
                    onMouseDown={() => setDragVertex('C')}
                  />
                  <text
                    x={vertC.x + 14}
                    y={vertC.y + 20}
                    textAnchor="middle"
                    className="text-sm font-extrabold fill-[#082B60]"
                  >
                    C ({angleC}°)
                  </text>
                </svg>
              </div>
            </div>

            {/* Live Angle Summary Strip */}
            <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-wrap items-center justify-between gap-3 text-center">
              <div className="flex items-center gap-6 font-mono text-sm">
                <div>
                  <span className="text-slate-500 text-xs block">Góc Â:</span>
                  <span className="font-extrabold text-[#1565D8] text-lg">{angleA}°</span>
                </div>
                <span className="text-slate-400 font-bold">+</span>
                <div>
                  <span className="text-slate-500 text-xs block">Góc B̂:</span>
                  <span className="font-extrabold text-[#16A765] text-lg">{angleB}°</span>
                </div>
                <span className="text-slate-400 font-bold">+</span>
                <div>
                  <span className="text-slate-500 text-xs block">Góc Ĉ:</span>
                  <span className="font-extrabold text-[#F59E0B] text-lg">{angleC}°</span>
                </div>
              </div>

              <div className="bg-white px-4 py-2 rounded-xl border border-blue-300 shadow-sm">
                <span className="text-xs text-slate-500 block">Tổng 3 góc:</span>
                <span className="text-2xl font-black text-[#082B60] font-mono">
                  {angleA + angleB + angleC}°
                </span>
              </div>
            </div>
          </div>

          {/* Explanation & Proof Steps (5 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-blue-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
                <Info className="w-5 h-5 text-[#1565D8]" />
                <h3 className="text-base font-bold text-[#082B60]">
                  Các Bước Chứng Minh Bằng Đường Song Song
                </h3>
              </div>

              <div className="space-y-3 text-xs text-slate-700 leading-relaxed font-serif">
                <div
                  onClick={() => setProofStep(1)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    proofStep === 1
                      ? 'border-[#1565D8] bg-blue-50/70 font-bold'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="text-[11px] text-[#1565D8] font-bold uppercase mb-1">
                    Bước 1: Kẻ đường thẳng phụ
                  </div>
                  <p>
                    Qua đỉnh A, kẻ đường thẳng xy song song với cạnh BC (đường nét đứt màu tím).
                  </p>
                </div>

                <div
                  onClick={() => setProofStep(2)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    proofStep === 2
                      ? 'border-[#1565D8] bg-blue-50/70 font-bold'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="text-[11px] text-[#1565D8] font-bold uppercase mb-1">
                    Bước 2: Sử dụng tính chất so le trong
                  </div>
                  <p>
                    Vì xy // BC nên:
                    <br />• ∠xAB = ∠B (hai góc so le trong)
                    <br />• ∠yAC = ∠C (hai góc so le trong)
                  </p>
                </div>

                <div
                  onClick={() => setProofStep(3)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    proofStep === 3
                      ? 'border-[#1565D8] bg-blue-50/70 font-bold'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="text-[11px] text-[#1565D8] font-bold uppercase mb-1">
                    Bước 3: Tổng góc bẹt
                  </div>
                  <p>
                    Ta có góc bẹt: ∠xAB + ∠BAC + ∠yAC = 180°
                    <br />Thay thế: ∠B + ∠A + ∠C = 180°
                    <br /><strong>⇒ Tổng ba góc trong tam giác luôn bằng 180° (đpcm).</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showProofLine}
                  onChange={(e) => setShowProofLine(e.target.checked)}
                  className="rounded text-[#1565D8]"
                />
                <span>Hiện đường song song xy</span>
              </label>
              <button
                onClick={resetTriangle}
                className="text-[#1565D8] font-bold hover:underline"
              >
                Đặt lại tam giác gốc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SIMULATION 2: ĐO GÓC BẰNG THƯỚC ĐO GÓC (PROTRACTOR) */}
      {/* ========================================================================= */}
      {activeSim === 'protractor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-blue-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-blue-100 text-[#1565D8]">
                    <Compass className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-bold text-[#082B60]">
                    Thực Hành Đo Góc xOy Bằng Thước Đo Độ
                  </h3>
                </div>
                <button
                  onClick={generateNewAngle}
                  className="px-3 py-1.5 rounded-lg bg-[#1565D8] text-white text-xs font-bold hover:bg-blue-700 shadow-sm"
                >
                  Đổi góc ngẫu nhiên mới
                </button>
              </div>

              {/* Stage SVG */}
              <div className="relative w-full h-[360px] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center select-none">
                <svg viewBox="0 0 520 360" className="w-full h-full">
                  {/* Origin O */}
                  <circle cx="260" cy="220" r="5" fill="#082B60" />
                  <text x="245" y="240" className="text-sm font-bold fill-[#082B60]">O</text>

                  {/* Ray Ox (Horizontal) */}
                  <line x1="260" y1="220" x2="480" y2="220" stroke="#082B60" strokeWidth="2.5" />
                  <text x="485" y="225" className="text-sm font-bold fill-[#082B60]">x</text>

                  {/* Ray Oy (Angle `targetAngle`) */}
                  {(() => {
                    const rad = (targetAngle * Math.PI) / 180;
                    const len = 200;
                    const endX = 260 + len * Math.cos(rad);
                    const endY = 220 - len * Math.sin(rad);
                    return (
                      <>
                        <line x1="260" y1="220" x2={endX} y2={endY} stroke="#1565D8" strokeWidth="2.5" />
                        <text x={endX + 8} y={endY} className="text-sm font-bold fill-[#1565D8]">y</text>
                      </>
                    );
                  })()}

                  {/* Semi-circular Protractor Graphics */}
                  <g
                    transform={`translate(${protractorPos.x}, ${protractorPos.y}) rotate(${protractorAngle})`}
                    className="cursor-move opacity-85 hover:opacity-100 transition-opacity"
                  >
                    {/* Semi-circle body */}
                    <path
                      d="M -180 0 A 180 180 0 0 1 180 0 Z"
                      fill="#24C4E8"
                      fillOpacity="0.25"
                      stroke="#1565D8"
                      strokeWidth="2"
                    />
                    <line x1="-180" y1="0" x2="180" y2="0" stroke="#1565D8" strokeWidth="2" />
                    <circle cx="0" cy="0" r="4" fill="#1565D8" />

                    {/* Degree Ticks */}
                    {Array.from({ length: 19 }).map((_, i) => {
                      const deg = i * 10;
                      const rad = (deg * Math.PI) / 180;
                      const rInner = i % 3 === 0 ? 155 : 165;
                      const x1 = 180 * Math.cos(rad);
                      const y1 = -180 * Math.sin(rad);
                      const x2 = rInner * Math.cos(rad);
                      const y2 = -rInner * Math.sin(rad);
                      const textR = 140;
                      const tx = textR * Math.cos(rad);
                      const ty = -textR * Math.sin(rad);

                      return (
                        <g key={deg}>
                          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#082B60" strokeWidth={i % 3 === 0 ? 1.5 : 1} />
                          {i % 3 === 0 && (
                            <text
                              x={tx}
                              y={ty + 4}
                              textAnchor="middle"
                              className="text-[9px] font-mono font-bold fill-[#082B60]"
                            >
                              {deg}°
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>
                </svg>
              </div>
            </div>

            {/* Protractor Controls Slider */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-700">Dịch chuyển thước:</span>
                <button
                  onClick={() => setProtractorPos({ x: 260, y: 220 })}
                  className="px-2.5 py-1 rounded bg-blue-50 text-[#1565D8] font-bold border border-blue-200"
                >
                  Căn tâm thước vào gốc O
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Xoay thước:</span>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={protractorAngle}
                  onChange={(e) => setProtractorAngle(parseInt(e.target.value))}
                  className="w-32 accent-[#1565D8]"
                />
                <span className="font-mono">{protractorAngle}°</span>
              </div>
            </div>
          </div>

          {/* Practice & Verification Deck */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-blue-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
                <CheckCircle2 className="w-5 h-5 text-[#16A765]" />
                <h3 className="text-base font-bold text-[#082B60]">
                  Thực Hành & Kiểm Tra Kết Quả
                </h3>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed font-serif">
                  Hãy điều chỉnh thước đo góc sao cho <strong>tâm thước trùng đỉnh O</strong> và vạch số 0° trùng tia Ox. Sau đó đọc số đo của góc xOy và nhập vào bên dưới:
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số đo góc xOy mà em đo được (độ):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Ví dụ: 65"
                      value={studentInputAngle}
                      onChange={(e) => setStudentInputAngle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base font-mono font-bold focus:ring-2 focus:ring-[#1565D8]"
                    />
                    <button
                      onClick={checkMeasuredAngle}
                      className="px-4 py-2 rounded-xl bg-[#16A765] text-white text-xs font-bold hover:bg-emerald-700 shadow-sm shrink-0"
                    >
                      Kiểm tra
                    </button>
                  </div>
                </div>

                {measureFeedback && (
                  <div
                    className={`p-3 rounded-xl border text-xs font-bold leading-relaxed ${
                      measureFeedback.includes('tuyệt đối') || measureFeedback.includes('Rất tốt')
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}
                  >
                    {measureFeedback}
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-slate-700 mt-4">
              <strong>💡 Mẹo học sinh:</strong> Khi tia Ox nằm bên phải, hãy đọc thang đo từ 0° ở phía trong cung đo từ phải sang trái.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SIMULATION 3: VẼ ĐƯỜNG THẲNG SONG SONG BẰNG THƯỚC & Ê-KE */}
      {/* ========================================================================= */}
      {activeSim === 'parallel' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-blue-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h3 className="text-base font-bold text-[#082B60]">
                  Mô Phỏng Trực Quan: Vẽ Đường Thẳng Song Song Qua Điểm M
                </h3>
                <span className="text-xs bg-blue-100 text-[#1565D8] px-2.5 py-1 rounded-full font-bold">
                  Bước {parallelStep} / 3
                </span>
              </div>

              {/* Animated Set-Square Stage */}
              <div className="relative w-full h-[360px] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center">
                <svg viewBox="0 0 520 360" className="w-full h-full">
                  {/* Grid */}
                  <g stroke="#f1f5f9" strokeWidth="1">
                    {Array.from({ length: 26 }).map((_, i) => (
                      <line key={`gx-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="360" />
                    ))}
                    {Array.from({ length: 18 }).map((_, i) => (
                      <line key={`gy-${i}`} x1="0" y1={i * 20} x2="520" y2={i * 20} />
                    ))}
                  </g>

                  {/* Line d */}
                  <line x1="50" y1="280" x2="470" y2="280" stroke="#082B60" strokeWidth="3" />
                  <text x="480" y="285" className="text-sm font-bold fill-[#082B60]">d</text>

                  {/* Point M outside line d */}
                  <circle cx="260" cy="140" r="5" fill="#DC3545" />
                  <text x="260" y="125" textAnchor="middle" className="text-sm font-bold fill-[#DC3545]">M</text>

                  {/* Ruler (Thước thẳng đặt dọc bên trái) */}
                  <rect
                    x="110"
                    y="60"
                    width="40"
                    height="250"
                    fill="#F1F7FF"
                    stroke="#1565D8"
                    strokeWidth="2"
                    rx="4"
                  />
                  <text x="130" y="90" textAnchor="middle" className="text-[10px] font-bold fill-[#1565D8] rotate-90">
                    THƯỚC THẲNG
                  </text>

                  {/* Set-square (Ê-ke trượt) */}
                  {(() => {
                    const ekeY = parallelStep === 1 ? 280 : 140;

                    return (
                      <g className="transition-all duration-700 ease-in-out">
                        <polygon
                          points={`150,${ekeY} 290,${ekeY} 150,${ekeY - 140}`}
                          fill="#24C4E8"
                          fillOpacity="0.3"
                          stroke="#1565D8"
                          strokeWidth="2"
                        />
                        <text x="190" y={ekeY - 30} className="text-xs font-bold fill-[#082B60]">
                          Ê-ke
                        </text>
                        {/* Right angle marker at vertex */}
                        <rect x="150" y={ekeY - 16} width="16" height="16" fill="none" stroke="#082B60" strokeWidth="1.5" />
                      </g>
                    );
                  })()}

                  {/* New Parallel Line d' (drawn in step 3) */}
                  {parallelStep >= 2 && (
                    <g className="animate-in fade-in duration-500">
                      <line x1="50" y1="140" x2="470" y2="140" stroke="#16A765" strokeWidth="3" strokeDasharray={parallelStep === 2 ? '6,6' : '0'} />
                      <text x="480" y="145" className="text-sm font-bold fill-[#16A765]">d' // d</text>
                    </g>
                  )}
                </svg>
              </div>
            </div>

            {/* Stepper Controls */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setParallelStep((s) => Math.max(1, s - 1))}
                disabled={parallelStep === 1}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold disabled:opacity-40 hover:bg-slate-50"
              >
                Bước trước
              </button>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <button
                    key={step}
                    onClick={() => setParallelStep(step)}
                    className={`w-7 h-7 rounded-full text-xs font-bold ${
                      parallelStep === step
                        ? 'bg-[#1565D8] text-white shadow'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setParallelStep((s) => Math.min(3, s + 1))}
                disabled={parallelStep === 3}
                className="px-4 py-2 rounded-xl bg-[#1565D8] text-white text-xs font-bold disabled:opacity-40 hover:bg-blue-700"
              >
                Bước tiếp theo
              </button>
            </div>
          </div>

          {/* Step Guidance */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-blue-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
                <Info className="w-5 h-5 text-[#1565D8]" />
                <h3 className="text-base font-bold text-[#082B60]">
                  Quy Trình Dựng Hình Học Chuẩn
                </h3>
              </div>

              <div className="space-y-3 text-xs leading-relaxed font-serif">
                <div className={`p-3 rounded-xl border ${parallelStep === 1 ? 'border-[#1565D8] bg-blue-50 font-bold' : 'border-slate-200'}`}>
                  <strong>Bước 1:</strong> Đặt một cạnh góc vuông của ê-ke trùng với đường thẳng d đã cho. Áp sát mép thước thẳng vào cạnh góc vuông còn lại của ê-ke.
                </div>
                <div className={`p-3 rounded-xl border ${parallelStep === 2 ? 'border-[#1565D8] bg-blue-50 font-bold' : 'border-slate-200'}`}>
                  <strong>Bước 2:</strong> Giữ cố định thước thẳng, trượt ê-ke dọc theo mép thước cho đến khi cạnh góc vuông thứ nhất đi qua điểm M.
                </div>
                <div className={`p-3 rounded-xl border ${parallelStep === 3 ? 'border-[#1565D8] bg-blue-50 font-bold' : 'border-slate-200'}`}>
                  <strong>Bước 3:</strong> Dùng bút chì vạch một đường thẳng d' đi qua điểm M theo mép cạnh góc vuông đó. Đường thẳng d' vừa vẽ chính là đường thẳng song song với d.
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 mt-4">
              <strong>Định lý Tiên đề Ơ-clit:</strong> Qua một điểm ở ngoài một đường thẳng, chỉ có một và chỉ một đường thẳng song song với đường thẳng đó.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SIMULATION 4: KHÁM PHÁ TAM GIÁC & BẤT ĐẲNG THỨC TAM GIÁC */}
      {/* ========================================================================= */}
      {activeSim === 'triangle_explore' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-blue-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-[#082B60] pb-3 border-b border-slate-100 mb-4">
                Mô Hình Ba Cạnh & Bất Đẳng Thức Tam Giác
              </h3>

              {/* Sliders for sides a, b, c */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Độ dài cạnh a (BC):</span>
                    <span className="font-mono text-[#1565D8] text-sm">{sideInputA} cm</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    step="1"
                    value={sideInputA}
                    onChange={(e) => setSideInputA(parseInt(e.target.value))}
                    className="w-full accent-[#1565D8]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Độ dài cạnh b (AC):</span>
                    <span className="font-mono text-[#16A765] text-sm">{sideInputB} cm</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    step="1"
                    value={sideInputB}
                    onChange={(e) => setSideInputB(parseInt(e.target.value))}
                    className="w-full accent-[#16A765]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Độ dài cạnh c (AB):</span>
                    <span className="font-mono text-[#F59E0B] text-sm">{sideInputC} cm</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    step="1"
                    value={sideInputC}
                    onChange={(e) => setSideInputC(parseInt(e.target.value))}
                    className="w-full accent-[#F59E0B]"
                  />
                </div>
              </div>

              {/* Status Banner */}
              <div
                className={`p-4 rounded-xl border flex items-center gap-3 ${
                  isValidTriangle
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                <div className="text-xl">{isValidTriangle ? '✅' : '❌'}</div>
                <div>
                  <div className="text-sm font-extrabold">{classifyTriangle()}</div>
                  <div className="text-xs mt-0.5">
                    {isValidTriangle
                      ? `Thỏa mãn: ${sideInputA} + ${sideInputB} > ${sideInputC} và |${sideInputB} - ${sideInputC}| < ${sideInputA}`
                      : `Vi phạm: Tổng hai cạnh bất kỳ phải luôn lớn hơn cạnh còn lại!`}
                  </div>
                </div>
              </div>
            </div>

            {/* Calculations Deck */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100 text-center font-mono">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 font-serif">Chu vi (P)</div>
                <div className="text-lg font-black text-[#082B60]">{perimeter} cm</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 font-serif">Nửa chu vi (p)</div>
                <div className="text-lg font-black text-[#1565D8]">{semiP.toFixed(1)} cm</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 font-serif">Diện tích Heron (S)</div>
                <div className="text-lg font-black text-[#16A765]">{areaHeron.toFixed(1)} cm²</div>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-blue-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-[#082B60] pb-3 border-b border-slate-100 mb-3">
                Các Bộ Ba Cạnh Mẫu Để Khám Phá
              </h3>

              <div className="space-y-2">
                {[
                  { label: 'Bộ ba Pythagore (3, 4, 5)', a: 3, b: 4, c: 5, desc: 'Tam giác vuông kinh điển' },
                  { label: 'Bộ ba Pythagore (6, 8, 10)', a: 6, b: 8, c: 10, desc: 'Tam giác vuông cân xứng' },
                  { label: 'Tam giác đều (7, 7, 7)', a: 7, b: 7, c: 7, desc: 'Ba góc đều bằng 60°' },
                  { label: 'Tam giác cân (6, 6, 8)', a: 6, b: 6, c: 8, desc: 'Hai cạnh bên bằng nhau' },
                  { label: 'Trường hợp vi phạm (2, 3, 6)', a: 2, b: 3, c: 6, desc: '2 + 3 = 5 < 6 (Không thể tạo tam giác)' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSideInputA(item.a);
                      setSideInputB(item.b);
                      setSideInputC(item.c);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-colors"
                  >
                    <div className="text-xs font-bold text-[#082B60]">{item.label}</div>
                    <div className="text-[11px] text-slate-500">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 mt-4">
              <strong>Định lý:</strong> Trong một tam giác, độ dài một cạnh bao giờ cũng lớn hơn hiệu và nhỏ hơn tổng của độ dài hai cạnh còn lại:
              <br />
              <span className="font-mono font-bold">|b - c| &lt; a &lt; b + c</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SIMULATION 5: ĐỒ THỊ HÀM SỐ BẬC NHẤT Y = AX + B */}
      {/* ========================================================================= */}
      {activeSim === 'graph_function' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-blue-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h3 className="text-base font-bold text-[#082B60]">
                  Hệ Trục Tọa Độ Descartes Oxy & Đồ Thị y = ax + b
                </h3>
                <div className="text-sm font-mono font-black text-[#1565D8] bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                  y = {slopeA}x {interceptB >= 0 ? `+ ${interceptB}` : `- ${Math.abs(interceptB)}`}
                </div>
              </div>

              {/* Cartesian Coordinate Stage (520x360 with origin at 260, 180) */}
              <div className="relative w-full h-[360px] bg-white border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center">
                <svg viewBox="0 0 520 360" className="w-full h-full">
                  {/* Grid Lines: step 30px */}
                  <g stroke="#f1f5f9" strokeWidth="1">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <line key={`gx-${i}`} x1={i * 30} y1="0" x2={i * 30} y2="360" />
                    ))}
                    {Array.from({ length: 13 }).map((_, i) => (
                      <line key={`gy-${i}`} x1="0" y1={i * 30} x2="520" y2={i * 30} />
                    ))}
                  </g>

                  {/* Axis Ox */}
                  <line x1="20" y1="180" x2="500" y2="180" stroke="#082B60" strokeWidth="2" />
                  <polygon points="500,176 508,180 500,184" fill="#082B60" />
                  <text x="495" y="172" className="text-xs font-bold fill-[#082B60]">x</text>

                  {/* Axis Oy */}
                  <line x1="260" y1="340" x2="260" y2="20" stroke="#082B60" strokeWidth="2" />
                  <polygon points="256,20 260,12 264,20" fill="#082B60" />
                  <text x="270" y="24" className="text-xs font-bold fill-[#082B60]">y</text>
                  <text x="248" y="196" className="text-xs font-bold fill-[#082B60]">O</text>

                  {/* Function Line: y = slopeA * x + interceptB */}
                  {/* Origin is (260, 180), scale is 30px per unit */}
                  {(() => {
                    const xStart = -8;
                    const xEnd = 8;
                    const yStartVal = slopeA * xStart + interceptB;
                    const yEndVal = slopeA * xEnd + interceptB;

                    const sx = 260 + xStart * 30;
                    const sy = 180 - yStartVal * 30;
                    const ex = 260 + xEnd * 30;
                    const ey = 180 - yEndVal * 30;

                    const intersectY_Y = 180 - interceptB * 30;
                    const intersectX_Val = slopeA !== 0 ? -interceptB / slopeA : 0;
                    const intersectX_X = 260 + intersectX_Val * 30;

                    return (
                      <>
                        <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="#1565D8" strokeWidth="3" />

                        {/* Intercept with Oy (0, b) */}
                        <circle cx="260" cy={intersectY_Y} r="5" fill="#DC3545" />
                        <text x="272" y={intersectY_Y + 4} className="text-[11px] font-mono font-bold fill-[#DC3545]">
                          A(0; {interceptB})
                        </text>

                        {/* Intercept with Ox (-b/a, 0) if slopeA != 0 */}
                        {slopeA !== 0 && (
                          <>
                            <circle cx={intersectX_X} cy="180" r="5" fill="#16A765" />
                            <text x={intersectX_X} y="200" textAnchor="middle" className="text-[11px] font-mono font-bold fill-[#16A765]">
                              B({intersectX_Val.toFixed(1)}; 0)
                            </text>
                          </>
                        )}
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>

            {/* Sliders for a and b */}
            <div className="grid grid-cols-2 gap-6 mt-4 pt-3 border-t border-slate-100">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Hệ số góc a:</span>
                  <span className="font-mono text-[#1565D8] text-sm">{slopeA}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={slopeA}
                  onChange={(e) => setSlopeA(parseFloat(e.target.value))}
                  className="w-full accent-[#1565D8]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Tung độ gốc b:</span>
                  <span className="font-mono text-[#DC3545] text-sm">{interceptB}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={interceptB}
                  onChange={(e) => setInterceptB(parseInt(e.target.value))}
                  className="w-full accent-[#DC3545]"
                />
              </div>
            </div>
          </div>

          {/* Function Characteristics Summary */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-blue-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-[#082B60] pb-3 border-b border-slate-100 mb-3">
                Tính Chất & Nhận Xét Hình Học
              </h3>

              <div className="space-y-3 text-xs leading-relaxed font-serif">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-[11px] font-bold text-[#1565D8] uppercase mb-1">
                    Chiều biến thiên:
                  </div>
                  <p>
                    {slopeA > 0 ? (
                      <span className="text-emerald-700 font-bold">
                        • a &gt; 0: Hàm số đồng biến trên ℝ. Góc tạo bởi đường thẳng với trục Ox là góc nhọn.
                      </span>
                    ) : slopeA < 0 ? (
                      <span className="text-amber-700 font-bold">
                        • a &lt; 0: Hàm số nghịch biến trên ℝ. Góc tạo bởi đường thẳng với trục Ox là góc tù.
                      </span>
                    ) : (
                      <span className="text-blue-700 font-bold">
                        • a = 0: Hàm hằng y = b. Đường thẳng song song hoặc trùng với trục hoành Ox.
                      </span>
                    )}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Giao điểm với hai trục:
                  </div>
                  <p>
                    • Cắt trục tung Oy tại điểm: <strong>A(0; {interceptB})</strong>
                    <br />
                    • Cắt trục hoành Ox tại điểm:{' '}
                    <strong>
                      B({slopeA !== 0 ? (-interceptB / slopeA).toFixed(2) : 'Không có'}; 0)
                    </strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-xs text-slate-700 mt-4">
              <strong>Hệ số góc:</strong> Đại lượng a được gọi là hệ số góc của đường thẳng y = ax + b vì nó quyết định độ dốc và chiều nghiêng của đồ thị.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
