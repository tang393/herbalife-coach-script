import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { ClientInput, CoachScriptOutput, GenerateResponse } from '@/lib/types';
import { computeDerived } from '@/lib/calculator';
import { SYSTEM_PROMPT_ZH_TW, buildUserPromptZhTW } from '@/lib/prompts/zh-tw';
import { detectViolations, getDisclaimer } from '@/lib/compliance-filter';
import { translateToVietnamese } from '@/lib/translator';

export const runtime = 'nodejs';
export const maxDuration = 120;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-sonnet-4-6';
const TRANSLATOR_MODEL = 'claude-haiku-4-5-20251001';

function validate(input: ClientInput): string | null {
  if (!input.name?.trim()) return 'name required';
  if (!(input.age > 0 && input.age < 120)) return 'age out of range';
  if (!(input.height_cm > 80 && input.height_cm < 250)) return 'height out of range';
  if (!(input.weight_kg > 20 && input.weight_kg < 300)) return 'weight out of range';
  if (!(input.body_fat_pct >= 3 && input.body_fat_pct <= 60)) return 'body fat out of range';
  if (!(input.visceral_fat_level >= 1 && input.visceral_fat_level <= 30)) return 'visceral fat out of range';
  if (!(input.muscle_mass_kg > 5 && input.muscle_mass_kg < 150)) return 'muscle mass out of range';
  return null;
}

function tryParseJson(raw: string): CoachScriptOutput | null {
  const text = raw.trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  const jsonStr = start >= 0 && end > start ? text.slice(start, end + 1) : text;
  try {
    return JSON.parse(jsonStr) as CoachScriptOutput;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const input = (await req.json()) as ClientInput;
    const err = validate(input);
    if (err) return NextResponse.json({ error: err }, { status: 400 });

    const computed = computeDerived(input);
    const userPrompt = buildUserPromptZhTW(input, computed);

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT_ZH_TW,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: userPrompt }],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'no text in response' }, { status: 500 });
    }

    const parsed = tryParseJson(textBlock.text);
    if (!parsed) {
      console.error('JSON parse failed, raw:', textBlock.text.slice(0, 500));
      return NextResponse.json(
        { error: 'AI 產出格式錯誤，請重試一次', raw: textBlock.text.slice(0, 1000) },
        { status: 502 },
      );
    }

    if (!parsed.disclaimer) parsed.disclaimer = getDisclaimer('zh-TW');

    let output_vi: CoachScriptOutput | null = null;
    let translator_input_tokens = 0;
    let translator_output_tokens = 0;
    try {
      const translated = await translateToVietnamese(client, parsed);
      output_vi = translated.output_vi;
      translator_input_tokens = translated.usage.input_tokens;
      translator_output_tokens = translated.usage.output_tokens;
      if (!output_vi.disclaimer) output_vi.disclaimer = getDisclaimer('vi');
    } catch (e) {
      console.error('translation failed:', e);
    }

    const { disclaimer: _zhD, ...zhForCheck } = parsed;
    const violationsZh = detectViolations(JSON.stringify(zhForCheck), 'zh-TW');

    let violationsVi: string[] = [];
    if (output_vi) {
      const { disclaimer: _viD, ...viForCheck } = output_vi;
      violationsVi = detectViolations(JSON.stringify(viForCheck), 'vi');
    }

    const result: GenerateResponse = {
      computed,
      output: parsed,
      output_vi,
      violations: { zh: violationsZh, vi: violationsVi },
      model: MODEL,
      translator_model: output_vi ? TRANSLATOR_MODEL : undefined,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        cache_read_input_tokens: response.usage.cache_read_input_tokens ?? 0,
        cache_creation_input_tokens: response.usage.cache_creation_input_tokens ?? 0,
        translator_input_tokens,
        translator_output_tokens,
      },
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error('generate error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
