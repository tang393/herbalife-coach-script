import Link from 'next/link';

export const metadata = {
  title: 'Coach Playbook · 教練手冊',
  description: '12 bước PROCESS + 20 nhiệm vụ bắt buộc mỗi ngày · 12 步漏斗 + 20 項每日必做',
};

const PROCESS_GROUPS: {
  title_vi: string;
  title_zh: string;
  items: { n: number; vi: string; zh: string; en: string }[];
}[] = [
  {
    title_vi: 'Khai thác khách hàng',
    title_zh: '開發客戶',
    items: [
      {
        n: 1,
        en: 'Funnel activities (Fitcamp, Social Media, Personal Challenges, 1:1 Invitations...)',
        vi: 'Hoạt động phễu (Fitcamp, mạng xã hội, thử thách cá nhân, mời 1:1…)',
        zh: '漏斗活動（Fitcamp、社群媒體、個人挑戰、1:1 邀約…）',
      },
      {
        n: 2,
        en: '1:1 / 2:1 Meeting',
        vi: 'Cuộc họp 1:1 / 2:1',
        zh: '1:1 / 2:1 會議',
      },
      {
        n: 3,
        en: 'Product Experience',
        vi: 'Trải nghiệm sản phẩm',
        zh: '產品體驗',
      },
      {
        n: 4,
        en: 'Happy Customer',
        vi: 'Khách hàng hài lòng',
        zh: '開心顧客',
      },
    ],
  },
  {
    title_vi: 'Phát triển hội viên kinh doanh',
    title_zh: '發展事業夥伴',
    items: [
      {
        n: 5,
        en: 'Health Ambassador',
        vi: 'Đại sứ sức khoẻ',
        zh: '健康大使',
      },
      {
        n: 6,
        en: 'Introductory Class',
        vi: 'Lớp giới thiệu',
        zh: '介紹性課堂',
      },
      {
        n: 7,
        en: 'Business Member',
        vi: 'Thành viên kinh doanh',
        zh: '事業會員',
      },
      {
        n: 8,
        en: 'Hand-holding Training Class',
        vi: 'Lớp huấn luyện cầm tay chỉ việc',
        zh: '手把手培訓課',
      },
    ],
  },
  {
    title_vi: 'Lên Supervisor',
    title_zh: '晉升督導',
    items: [
      {
        n: 9,
        en: 'Practice',
        vi: 'Thực hành',
        zh: '實踐',
      },
      {
        n: 10,
        en: 'Orientation',
        vi: 'Định hướng',
        zh: '入門定向',
      },
      {
        n: 11,
        en: 'Fit Operation / Open Fit',
        vi: 'Vận hành Fit / Mở Fit',
        zh: 'Fit 運作 / 開 Fit',
      },
      {
        n: 12,
        en: 'Supervisor',
        vi: 'Giám sát (Supervisor)',
        zh: '督導',
      },
    ],
  },
];

const MUST_DO: { n: number; vi: string; zh: string }[] = [
  {
    n: 1,
    vi: 'Đến trước giờ vận hành Fit 30 phút',
    zh: '在 Fit 運作前 30 分鐘到場',
  },
  {
    n: 2,
    vi: 'Dọn WC, rửa ly theo tiêu chuẩn; giữ vệ sinh chung của nhóm',
    zh: '清潔廁所、洗杯達標準；維持團隊衛生',
  },
  {
    n: 3,
    vi: 'Pha sữa lắc chuẩn công thức',
    zh: '準備標準配方奶昔',
  },
  {
    n: 4,
    vi: 'Hướng dẫn thành viên pha trà và sữa lắc đúng cách',
    zh: '引導會員正確泡茶、調奶昔',
  },
  {
    n: 5,
    vi: 'Thành thạo máy đo cơ thể và đọc chính xác các chỉ số quan trọng',
    zh: '熟練使用體組成測量機並正確解讀關鍵指標',
  },
  {
    n: 6,
    vi: 'Dùng thành thạo công cụ theo dõi thành viên; tìm ra nguyên nhân chỉ số chưa tốt',
    zh: '熟練使用會員追蹤工具；分析指標不佳的原因',
  },
  {
    n: 7,
    vi: 'Làm chủ quy trình tư vấn 15 phút (tư vấn gói) / Tính calo lý tưởng / Lập thực đơn',
    zh: '掌握 15 分鐘諮詢流程（套組諮詢）/ 計算理想熱量 / 制定菜單',
  },
  {
    n: 8,
    vi: 'Tự tin dẫn lớp, hướng dẫn đúng kỹ thuật, truyền năng lượng cho thành viên',
    zh: '有自信地帶課，用正確技巧和能量引導會員',
  },
  {
    n: 9,
    vi: 'Thành thạo 10 bài talking point',
    zh: '熟練使用 10 個 talking points',
  },
  {
    n: 10,
    vi: 'Biết điều chỉnh thực đơn từ Ngày 11 trở đi',
    zh: '會從 Day 11 開始調整菜單',
  },
  {
    n: 11,
    vi: 'Biết nâng cấp sản phẩm; hiểu sâu 6 vòng tròn ảnh hưởng của thành viên',
    zh: '會升級產品；深入理解會員的 6 個影響圈',
  },
  {
    n: 12,
    vi: 'Biết quản lý tài chính Fit club hàng ngày',
    zh: '會管理 Fit 俱樂部日常財務',
  },
  {
    n: 13,
    vi: 'Điều phối hoạt động trong Fit (chuông thành viên mới, vinh danh hàng ngày, đo eo chụp hình, quay video chứng thực…)',
    zh: '協調 Fit 運作中的活動（新會員敲鐘、每日表揚、量腰圍拍照、拍短見證影片…）',
  },
  {
    n: 14,
    vi: 'Tổ chức tiệc tháng / sự kiện đại sứ; đưa thành viên đến sự kiện công ty hoặc hệ thống; kết nối với các Fit club khác',
    zh: '組織每月派對 / 大使活動；帶會員參加公司或系統活動；跟其他 Fit club 交流',
  },
  {
    n: 15,
    vi: 'Thái độ đúng: thân thiện, khiêm tốn, lịch sự; tôn trọng góc nhìn khác; luôn tích cực và rộng lượng',
    zh: '正確態度：親切、謙虛、禮貌溝通；尊重他人觀點；保持正向大方',
  },
  {
    n: 16,
    vi: 'Đặt lịch 2:1 với tuyến trên/leader để được hỗ trợ và chia sẻ',
    zh: '跟上線/領導者安排 2:1 會議，得到支持與分享',
  },
  {
    n: 17,
    vi: 'Mời đều đặn hàng ngày ở thị trường lạnh/ấm/nóng (mục tiêu 10 lời mời/ngày; tháng: 5–7 khách mới, 1–3 hội viên kinh doanh mới)',
    zh: '每天持續邀約冷/暖/熱市場（目標 10 邀/天；月目標：5–7 新客、1–3 新事業夥伴）',
  },
  {
    n: 18,
    vi: 'Có lịch làm việc chi tiết trong ngày trước khi đến club',
    zh: '到 Fit 前有詳細的每日工作安排',
  },
  {
    n: 19,
    vi: 'Học cách xử lý tình huống khi mời / tư vấn / chăm sóc thành viên',
    zh: '學習邀約 / 諮詢 / 會員關懷時的狀況處理',
  },
  {
    n: 20,
    vi: 'Đặt mục tiêu tuần / tháng / 90 ngày',
    zh: '設定每週 / 每月 / 90 天目標',
  },
];

export default function CoachPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <Nav />

      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Coach Playbook — Lộ trình + 20 Nhiệm vụ
        </h1>
        <p className="mt-2 text-slate-800">
          Lộ trình 12 bước phát triển Coach chuyên nghiệp & 20 nhiệm vụ bắt buộc mỗi ngày.
        </p>
        <p className="mt-1 text-sm text-slate-600">
          教練手冊 · 12 步發展漏斗 + 20 項每日必做
        </p>
      </header>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold text-slate-900">
          📈 PROCESS — 12 bước <span className="text-sm font-medium text-slate-600">· 12 步發展漏斗</span>
        </h2>

        <div className="space-y-6">
          {PROCESS_GROUPS.map((group, gi) => (
            <div
              key={gi}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="mb-4 border-b border-slate-200 pb-2">
                <h3 className="text-base font-bold text-emerald-700">
                  Giai đoạn {gi + 1}: {group.title_vi}
                </h3>
                <p className="text-xs font-medium text-slate-600">
                  階段 {gi + 1}：{group.title_zh}
                </p>
              </div>
              <ol className="space-y-3">
                {group.items.map((item) => (
                  <li key={item.n} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                      {item.n}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.vi}</p>
                      <p className="text-sm text-slate-700">{item.zh}</p>
                      <p className="mt-0.5 text-xs italic text-slate-500">{item.en}</p>
                    </div>
                  </li>
                ))}
              </ol>
              {gi < PROCESS_GROUPS.length - 1 && (
                <div className="mt-4 flex justify-center">
                  <div className="text-2xl text-slate-400">⬇</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-900">
          ✅ 20 Nhiệm vụ bắt buộc mỗi ngày{' '}
          <span className="text-sm font-medium text-slate-600">· 20 項每日必做</span>
        </h2>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <ul className="space-y-3">
            {MUST_DO.map((task) => (
              <li key={task.n} className="flex gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                  {task.n}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{task.vi}</p>
                  <p className="mt-0.5 text-sm italic text-slate-600">{task.zh}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-10 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900 ring-1 ring-emerald-200">
        <p className="font-semibold">
          💪 Kiên trì 90 ngày, bạn sẽ khác. · 堅持 90 天，你會不一樣。
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          href="/"
          className="rounded-lg bg-emerald-600 px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          Tạo kịch bản tư vấn · 產生諮詢話術 →
        </Link>
      </div>
    </main>
  );
}

function Nav() {
  return (
    <nav className="mb-6 flex gap-2 text-sm">
      <Link
        href="/"
        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-900 hover:bg-slate-100"
      >
        🎤 Kịch bản · 話術
      </Link>
      <span className="rounded-lg border border-emerald-600 bg-emerald-600 px-3 py-1.5 font-medium text-white">
        📋 Coach Playbook · 教練手冊
      </span>
    </nav>
  );
}
