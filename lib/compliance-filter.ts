import type { Language } from './types';

const BANNED_TERMS: Record<Language, RegExp[]> = {
  'zh-TW': [
    /治療/g, /治好/g, /根治/g, /痊癒/g,
    /療效/g, /療癒/g, /療程/g,
    /保證瘦/g, /保證有效/g, /一定瘦/g, /一定會瘦/g, /百分之百/g,
    /燃燒脂肪/g, /消除脂肪/g,
    /排毒/g, /解毒/g, /抗發炎/g,
    /降血糖/g, /降血壓/g, /降膽固醇/g, /調節血糖/g,
    /癌症/g, /糖尿病/g, /高血壓/g, /心臟病/g, /腦瘤/g,
    /取代藥物/g, /替代藥物/g, /等同藥物/g, /不用吃藥/g,
    /財富自由/g, /被動收入/g, /辭職/g, /月入百萬/g,
  ],
  vi: [
    /chữa bệnh/gi, /điều trị/gi, /khỏi bệnh/gi, /chữa khỏi/gi,
    /thay thế thuốc/gi, /tương đương thuốc/gi, /không cần uống thuốc/gi,
    /100% hiệu quả/gi, /đảm bảo hiệu quả/gi, /chắc chắn giảm/gi,
    /ung thư/gi, /tiểu đường/gi, /cao huyết áp/gi, /tim mạch/gi,
    /tự do tài chính/gi, /thu nhập thụ động/gi,
    /đốt mỡ/gi, /thải độc/gi, /giải độc/gi,
  ],
};

const DISCLAIMERS: Record<Language, string> = {
  'zh-TW':
    '⚠️ 本內容僅供營養參考。賀寶芙產品為食品而非藥物，不具治療、診斷、預防疾病或替代醫療之效果。個人成效因體質、飲食及生活習慣而異。',
  vi: '⚠️ Thực phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh. Kết quả có thể khác nhau tuỳ cơ địa và thói quen sinh hoạt của mỗi người.',
};

export function detectViolations(text: string, lang: Language): string[] {
  const patterns = BANNED_TERMS[lang];
  const hits: string[] = [];
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) hits.push(...matches);
  }
  return Array.from(new Set(hits));
}

export function getDisclaimer(lang: Language): string {
  return DISCLAIMERS[lang];
}

export function hasRevenueHype(text: string): boolean {
  const patterns = [
    /月入\d+/g,
    /年收\d+萬/g,
    /百萬收入/g,
    /辭掉工作/g,
    /不用上班/g,
  ];
  return patterns.some((p) => p.test(text));
}
