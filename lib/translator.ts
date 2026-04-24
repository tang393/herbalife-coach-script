import Anthropic from '@anthropic-ai/sdk';
import type { CoachScriptOutput } from './types';

const HAIKU_MODEL = 'claude-haiku-4-5-20251001';

const TRANSLATION_SYSTEM_PROMPT = `你是越南文在地化專家，專門處理賀寶芙（Herbalife）直銷話術的翻譯。

## 任務
把使用者提供的繁體中文 JSON 翻譯成越南文。規則：
1. **保持 JSON schema 完全一樣**（key 不翻譯，只翻譯值）
2. **所有字串值都要翻成越南文**
3. 不翻譯這些 enum 值：level (entry/core/complete)、status (high/normal/low)、currency
4. 產品名使用越南賀寶芙通用翻法：
   - F1 營養蛋白混合飲料 → Sữa lắc F1 (Formula 1)
   - 草本茶飲 → Trà thảo mộc Herbalife
   - 蛋白粉 / 個人化蛋白飲 → Bột protein cá nhân hoá (PDM / PPP)
   - 蘆薈飲 → Nước ép lô hội (Aloe)
5. 貨幣保留新台幣數字不動（monthly_cost），但文字描述中提到金額時加「(NT$)」即可
6. 保留所有 emoji 和 hashtag

## 越南合規紅線（必須遵守）
禁用詞（絕對不能出現）：
- chữa bệnh, điều trị, khỏi bệnh, chữa khỏi
- thay thế thuốc, tương đương thuốc, không cần uống thuốc
- 100% hiệu quả, đảm bảo hiệu quả, chắc chắn giảm
- 不要提具體疾病名（ung thư / tiểu đường / cao huyết áp…）
- 不要承諾收入（tự do tài chính / thu nhập thụ động）
- 不要承諾幾週瘦幾 kg

取代用詞：
- 「減重/瘦」→ quản lý cân nặng / thân hình cân đối
- 「療效」→ cảm giác nhẹ nhàng / năng lượng / sức sống

## disclaimer 用這句（固定翻譯）
"⚠️ Thực phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh. Kết quả có thể khác nhau tuỳ cơ địa và thói quen sinh hoạt của mỗi người."`;

const TRANSLATION_TOOL: Anthropic.Tool = {
  name: 'submit_vietnamese_translation',
  description: '提交翻譯後的越南文教練話術 JSON',
  input_schema: {
    type: 'object' as const,
    properties: {
      opening_script: { type: 'string' as const },
      data_interpretation: {
        type: 'object' as const,
        properties: {
          overall: { type: 'string' as const },
          points: {
            type: 'array' as const,
            items: {
              type: 'object' as const,
              properties: {
                metric: { type: 'string' as const },
                value: { type: 'string' as const },
                status: { type: 'string' as const, enum: ['high', 'normal', 'low'] },
                comment: { type: 'string' as const },
              },
              required: ['metric', 'value', 'status', 'comment'],
            },
          },
        },
        required: ['overall', 'points'],
      },
      plans: {
        type: 'array' as const,
        items: {
          type: 'object' as const,
          properties: {
            name: { type: 'string' as const },
            level: { type: 'string' as const, enum: ['entry', 'core', 'complete'] },
            monthly_cost: { type: 'number' as const },
            currency: { type: 'string' as const },
            products: {
              type: 'array' as const,
              items: {
                type: 'object' as const,
                properties: {
                  name: { type: 'string' as const },
                  qty: { type: 'number' as const },
                  note: { type: 'string' as const },
                },
                required: ['name', 'qty'],
              },
            },
            daily_schedule: { type: 'array' as const, items: { type: 'string' as const } },
            selling_point: { type: 'string' as const },
          },
          required: ['name', 'level', 'monthly_cost', 'currency', 'products', 'daily_schedule', 'selling_point'],
        },
      },
      objection_handling: {
        type: 'array' as const,
        items: {
          type: 'object' as const,
          properties: {
            concern: { type: 'string' as const },
            response: { type: 'string' as const },
          },
          required: ['concern', 'response'],
        },
      },
      next_actions: {
        type: 'array' as const,
        items: {
          type: 'object' as const,
          properties: {
            timing: { type: 'string' as const },
            action: { type: 'string' as const },
          },
          required: ['timing', 'action'],
        },
      },
      line_template: { type: 'string' as const },
      disclaimer: { type: 'string' as const },
    },
    required: [
      'opening_script',
      'data_interpretation',
      'plans',
      'objection_handling',
      'next_actions',
      'line_template',
      'disclaimer',
    ],
  },
};

export async function translateToVietnamese(
  client: Anthropic,
  output: CoachScriptOutput,
): Promise<{ output_vi: CoachScriptOutput; usage: { input_tokens: number; output_tokens: number } }> {
  const userPrompt = `請把以下繁體中文 JSON 翻譯成越南文，保持結構完整，透過 submit_vietnamese_translation tool 回傳：

${JSON.stringify(output, null, 2)}`;

  const response = await client.messages.create({
    model: HAIKU_MODEL,
    max_tokens: 5000,
    tools: [TRANSLATION_TOOL],
    tool_choice: { type: 'tool', name: 'submit_vietnamese_translation' },
    system: [
      {
        type: 'text',
        text: TRANSLATION_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: userPrompt }],
  });

  const toolUse = response.content.find((b) => b.type === 'tool_use');
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error('translator: no tool_use block in response');
  }

  return {
    output_vi: toolUse.input as CoachScriptOutput,
    usage: {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    },
  };
}
