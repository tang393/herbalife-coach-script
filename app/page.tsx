'use client';

import { useState } from 'react';
import type { ClientInput, GenerateResponse, LifeContext } from '@/lib/types';

const defaultInput: ClientInput = {
  name: '',
  age: 35,
  gender: 'female',
  height_cm: 165,
  weight_kg: 65,
  body_fat_pct: 30,
  visceral_fat_level: 8,
  muscle_mass_kg: 42,
  bmr_kcal: undefined,
  goal: 'lose',
  life_contexts: ['sedentary'],
  budget: 'medium',
  language: 'zh-TW',
  notes: '',
};

const LIFE_CONTEXT_OPTIONS: { value: LifeContext; label: string }[] = [
  { value: 'sedentary', label: 'Ngồi văn phòng' },
  { value: 'active', label: 'Tập luyện' },
  { value: 'mom', label: 'Mẹ / Nội trợ' },
  { value: 'elderly', label: 'Cao tuổi' },
  { value: 'student', label: 'Học sinh / Sinh viên' },
  { value: 'shift', label: 'Làm ca' },
];

export default function Home() {
  const [input, setInput] = useState<ClientInput>(defaultInput);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  function update<K extends keyof ClientInput>(key: K, value: ClientInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  function toggleLifeContext(ctx: LifeContext) {
    setInput((prev) => ({
      ...prev,
      life_contexts: prev.life_contexts.includes(ctx)
        ? prev.life_contexts.filter((c) => c !== ctx)
        : [...prev.life_contexts, ctx],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Tạo kịch bản thất bại');
        return;
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Coach Herbalife — Công cụ tạo kịch bản
        </h1>
        <p className="mt-2 text-slate-800">
          Nhập dữ liệu cơ thể khách hàng, tạo ngay kịch bản tư vấn + 3 gói sản phẩm + hành động
          tiếp theo.
        </p>
        <p className="mt-1 text-sm text-slate-600">
          賀寶芙教練話術產生器（越南文為主 · 中文對照）
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Tên khách hàng" sub="客戶姓名" required>
            <input
              type="text"
              required
              value={input.name}
              onChange={(e) => update('name', e.target.value)}
              className={inputCls}
              placeholder="VD: Nguyễn Thị Lan / 王小美"
            />
          </Field>
          <Field label="Tuổi" sub="年齡">
            <input
              type="number"
              min={10}
              max={100}
              required
              value={input.age}
              onChange={(e) => update('age', Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Giới tính" sub="性別">
            <select
              value={input.gender}
              onChange={(e) => update('gender', e.target.value as 'male' | 'female')}
              className={inputCls}
            >
              <option value="female">Nữ / 女</option>
              <option value="male">Nam / 男</option>
            </select>
          </Field>
          <Field label="Chiều cao (cm)" sub="身高">
            <input
              type="number"
              min={100}
              max={220}
              step={0.1}
              required
              value={input.height_cm}
              onChange={(e) => update('height_cm', Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Cân nặng (kg)" sub="體重">
            <input
              type="number"
              min={25}
              max={200}
              step={0.1}
              required
              value={input.weight_kg}
              onChange={(e) => update('weight_kg', Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Tỷ lệ mỡ cơ thể (%)" sub="體脂率">
            <input
              type="number"
              min={3}
              max={60}
              step={0.1}
              required
              value={input.body_fat_pct}
              onChange={(e) => update('body_fat_pct', Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Mỡ nội tạng" sub="內臟脂肪等級">
            <input
              type="number"
              min={1}
              max={30}
              step={0.5}
              required
              value={input.visceral_fat_level}
              onChange={(e) => update('visceral_fat_level', Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Khối lượng cơ (kg)" sub="肌肉量">
            <input
              type="number"
              min={10}
              max={100}
              step={0.1}
              required
              value={input.muscle_mass_kg}
              onChange={(e) => update('muscle_mass_kg', Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="BMR (kcal, tuỳ chọn)" sub="基礎代謝・選填">
            <input
              type="number"
              min={600}
              max={3500}
              value={input.bmr_kcal ?? ''}
              onChange={(e) =>
                update('bmr_kcal', e.target.value ? Number(e.target.value) : undefined)
              }
              className={inputCls}
            />
          </Field>
          <Field label="Mục tiêu" sub="目標">
            <select
              value={input.goal}
              onChange={(e) => update('goal', e.target.value as ClientInput['goal'])}
              className={inputCls}
            >
              <option value="lose">Giảm cân / 減重</option>
              <option value="maintain">Duy trì / 維持</option>
              <option value="gain">Tăng cân / 增重</option>
              <option value="health">Sức khoẻ / 保健</option>
            </select>
          </Field>
          <Field label="Ngân sách" sub="預算">
            <select
              value={input.budget}
              onChange={(e) => update('budget', e.target.value as ClientInput['budget'])}
              className={inputCls}
            >
              <option value="low">Thấp (≤3.000 NT$)</option>
              <option value="medium">Trung bình (3.000–6.000 NT$)</option>
              <option value="high">Cao (≥6.000 NT$)</option>
            </select>
          </Field>
        </section>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-semibold text-slate-900">
            Bối cảnh sinh hoạt <span className="text-slate-500">· 生活情境（可複選）</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {LIFE_CONTEXT_OPTIONS.map((opt) => {
              const active = input.life_contexts.includes(opt.value);
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => toggleLifeContext(opt.value)}
                  className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                    active
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-slate-300 bg-white text-slate-800 hover:border-slate-500'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-sm font-semibold text-slate-900">
            Ghi chú <span className="text-slate-500">· 備註（選填）</span>
          </label>
          <textarea
            value={input.notes ?? ''}
            onChange={(e) => update('notes', e.target.value)}
            rows={2}
            className={inputCls}
            placeholder="VD: không dung nạp lactose, muốn giảm bụng, sau sinh 6 tháng..."
          />
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <p className="text-xs text-slate-700">
            ⚠️ Nội dung chỉ dùng để tham khảo dinh dưỡng, không phải tư vấn y tế.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
          >
            {loading ? 'Đang tạo... (60–120 giây)' : 'Tạo kịch bản · 產生話術'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          ❌ {error}
        </div>
      )}

      {result && <ResultView data={result} />}
    </main>
  );
}

function ResultView({ data }: { data: GenerateResponse }) {
  const { output, output_vi, computed, violations, usage } = data;
  const zh = output;
  const vi = output_vi;

  return (
    <section className="mt-8 space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-3 text-lg font-bold text-slate-900">
          📊 Dữ liệu đã tính <span className="text-sm font-medium text-slate-600">· 系統計算</span>
        </h2>
        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
          <Stat label="BMI" sub="BMI" value={`${computed.bmi} (${bmiLabelVi(computed.bmi_category)})`} />
          <Stat label="LBM" sub="去脂體重" value={`${computed.lbm_kg} kg`} />
          <Stat
            label="Protein/ngày"
            sub="每日蛋白質"
            value={`${computed.daily_protein_g_min}–${computed.daily_protein_g_max} g`}
          />
          <Stat label="Công thức" sub="建議配方" value={computed.recommended_formula} />
        </div>
        {(violations.zh.length > 0 || violations.vi.length > 0) && (
          <div className="mt-3 rounded border border-amber-300 bg-amber-50 p-2 text-xs text-amber-900">
            ⚠️ Phát hiện từ cảnh báo:
            {violations.vi.length > 0 && <> VI [{violations.vi.join(', ')}]</>}
            {violations.zh.length > 0 && <> ZH [{violations.zh.join('、')}]</>}
          </div>
        )}
        {!vi && (
          <div className="mt-3 rounded border border-red-300 bg-red-50 p-2 text-xs text-red-800">
            ⚠️ Dịch tiếng Việt thất bại, chỉ hiển thị bản tiếng Trung
          </div>
        )}
      </div>

      <Card title="🎤 Kịch bản mở đầu" subtitle="開場話術 · Coach đọc nguyên văn">
        <Dual vi={vi?.opening_script} zh={zh.opening_script} />
      </Card>

      <Card title="📋 Giải thích dữ liệu" subtitle="數據解讀">
        <Dual vi={vi?.data_interpretation.overall} zh={zh.data_interpretation.overall} />
        <div className="mt-4 space-y-2">
          {zh.data_interpretation.points.map((p, i) => {
            const vp = vi?.data_interpretation.points[i];
            return (
              <div key={i} className="rounded-lg bg-slate-50 p-3 text-sm">
                {vp && (
                  <>
                    <div className="mb-1 flex items-baseline gap-2">
                      <span className="font-bold text-slate-900">{vp.metric}</span>
                      <span className={`font-bold ${statusColor(vp.status)}`}>{vp.value}</span>
                    </div>
                    <p className="text-slate-900">{vp.comment}</p>
                  </>
                )}
                <div
                  className={
                    vp
                      ? 'mt-2 border-l-2 border-slate-300 pl-3 text-xs italic text-slate-700'
                      : 'text-sm'
                  }
                >
                  {!vp && (
                    <div className="mb-1 flex items-baseline gap-2">
                      <span className="font-bold text-slate-900">{p.metric}</span>
                      <span className={`font-bold ${statusColor(p.status)}`}>{p.value}</span>
                    </div>
                  )}
                  <p>
                    {vp && `${p.metric} ${p.value} · `}
                    {p.comment}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="💊 3 Gói sản phẩm" subtitle="ABC 方案：完整組 / 核心組 / 入門組">
        <div className="grid gap-4 md:grid-cols-3">
          {zh.plans.map((plan, i) => {
            const vp = vi?.plans[i];
            const isCore = plan.level === 'core';
            return (
              <div
                key={plan.level}
                className={`rounded-xl border-2 p-4 ${
                  isCore ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">
                    {vp?.name ?? plan.name}
                  </h3>
                  {isCore && (
                    <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
                      Chính
                    </span>
                  )}
                </div>
                <div className="mb-2 text-xs italic text-slate-700">{plan.name}</div>
                <p className="mb-3 text-2xl font-bold text-emerald-700">
                  NT$ {plan.monthly_cost.toLocaleString()}
                  <span className="text-sm font-medium text-slate-700">/tháng</span>
                </p>
                <p className="mb-1 text-sm font-semibold text-slate-900">
                  {vp?.selling_point ?? plan.selling_point}
                </p>
                {vp && (
                  <p className="mb-3 text-xs italic text-slate-700">{plan.selling_point}</p>
                )}
                <div className="mb-3">
                  <div className="mb-1 text-xs font-bold text-slate-700">
                    Sản phẩm <span className="text-slate-500">· 產品</span>
                  </div>
                  <ul className="space-y-0.5 text-sm text-slate-900">
                    {(vp?.products ?? plan.products).map((p, idx) => (
                      <li key={idx}>
                        • {p.name} ×{p.qty}
                        {p.note && <span className="text-xs text-slate-700"> ({p.note})</span>}
                      </li>
                    ))}
                  </ul>
                  {vp && (
                    <ul className="mt-1 space-y-0.5 border-l-2 border-slate-300 pl-2 text-xs italic text-slate-700">
                      {plan.products.map((p, idx) => (
                        <li key={idx}>
                          • {p.name} ×{p.qty}
                          {p.note && <span> ({p.note})</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <div className="mb-1 text-xs font-bold text-slate-700">
                    Lịch ngày <span className="text-slate-500">· 每日安排</span>
                  </div>
                  <ul className="space-y-0.5 text-xs text-slate-900">
                    {(vp?.daily_schedule ?? plan.daily_schedule).map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                  {vp && (
                    <ul className="mt-1 space-y-0.5 border-l-2 border-slate-300 pl-2 text-[11px] italic text-slate-700">
                      {plan.daily_schedule.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="🛡️ Xử lý thắc mắc" subtitle="常見疑慮回應">
        <div className="space-y-3">
          {zh.objection_handling.map((o, i) => {
            const vo = vi?.objection_handling[i];
            return (
              <div key={i} className="rounded-lg bg-slate-50 p-4">
                {vo && (
                  <>
                    <p className="mb-1 text-sm font-bold text-slate-900">💬 {vo.concern}</p>
                    <p className="mb-2 text-sm text-slate-900">{vo.response}</p>
                  </>
                )}
                <div
                  className={`${vo ? 'border-l-2 border-slate-300 pl-3 text-xs italic' : 'text-sm'} text-slate-700`}
                >
                  {!vo && <p className="mb-1 font-bold text-slate-900">💬 {o.concern}</p>}
                  {vo && <p className="font-semibold">💬 {o.concern}</p>}
                  <p>{o.response}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="✅ Hành động kế tiếp" subtitle="下一步行動清單">
        <div className="space-y-2">
          {zh.next_actions.map((a, i) => {
            const va = vi?.next_actions[i];
            return (
              <div key={i} className="rounded-lg bg-emerald-50 p-3 text-sm">
                {va && (
                  <>
                    <div className="mb-1 font-bold text-emerald-800">{va.timing}</div>
                    <p className="text-slate-900">{va.action}</p>
                  </>
                )}
                <div
                  className={
                    va
                      ? 'mt-2 border-l-2 border-emerald-400 pl-3 text-xs italic text-slate-700'
                      : ''
                  }
                >
                  {!va && <div className="mb-1 font-bold text-emerald-800">{a.timing}</div>}
                  <p>
                    {va && `${a.timing} · `}
                    {a.action}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="📱 Mẫu check-in LINE" subtitle="LINE 打卡範本（給客戶自己貼）">
        <div className="space-y-3">
          {vi && (
            <div>
              <div className="mb-1 text-xs font-bold text-slate-700">Tiếng Việt</div>
              <div className="rounded-lg bg-[#06C755]/10 p-4">
                <p className="whitespace-pre-wrap leading-relaxed text-slate-900">
                  {vi.line_template}
                </p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(vi.line_template)}
                className="mt-2 rounded border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                Sao chép tiếng Việt
              </button>
            </div>
          )}
          <div>
            <div className="mb-1 text-xs font-bold text-slate-700">繁體中文</div>
            <div className="rounded-lg bg-[#06C755]/10 p-4">
              <p className="whitespace-pre-wrap leading-relaxed text-slate-900">
                {zh.line_template}
              </p>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(zh.line_template)}
              className="mt-2 rounded border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              複製中文
            </button>
          </div>
        </div>
      </Card>

      <div className="space-y-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
        {vi && <p className="font-semibold">{vi.disclaimer}</p>}
        <p className="italic text-amber-800">{zh.disclaimer}</p>
      </div>

      <div className="text-xs text-slate-700">
        {data.model}
        {data.translator_model && ` + ${data.translator_model}`} · tokens{' '}
        {usage.input_tokens + (usage.translator_input_tokens ?? 0)}→
        {usage.output_tokens + (usage.translator_output_tokens ?? 0)}
      </div>
    </section>
  );
}

function Dual({ vi, zh }: { vi?: string; zh: string }) {
  return (
    <div>
      {vi && (
        <p className="whitespace-pre-wrap font-medium leading-relaxed text-slate-900">{vi}</p>
      )}
      <p
        className={`whitespace-pre-wrap leading-relaxed ${
          vi ? 'mt-3 border-l-2 border-slate-300 pl-3 text-sm italic text-slate-700' : 'text-slate-900'
        }`}
      >
        {zh}
      </p>
    </div>
  );
}

function Field({
  label,
  sub,
  children,
  required,
}: {
  label: string;
  sub?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-900">
        {label} {required && <span className="text-red-500">*</span>}
        {sub && <span className="ml-1 text-xs font-normal text-slate-500">· {sub}</span>}
      </span>
      {children}
    </label>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs font-medium text-slate-600">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Stat({ label, sub, value }: { label: string; sub?: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-100 p-3">
      <div className="text-xs font-semibold text-slate-700">
        {label}
        {sub && <span className="ml-1 text-[10px] font-normal text-slate-500">· {sub}</span>}
      </div>
      <div className="mt-1 font-bold text-slate-900">{value}</div>
    </div>
  );
}

const inputCls =
  'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500';

function bmiLabelVi(c: string) {
  return (
    ({
      underweight: 'Thiếu cân',
      normal: 'Bình thường',
      overweight: 'Hơi cao',
      obese: 'Cao',
    } as Record<string, string>)[c] ?? c
  );
}

function statusColor(s: string) {
  return s === 'high' ? 'text-red-600' : s === 'low' ? 'text-blue-600' : 'text-emerald-700';
}
