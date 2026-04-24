export type Gender = 'male' | 'female';
export type Goal = 'lose' | 'maintain' | 'gain' | 'health';
export type LifeContext = 'sedentary' | 'active' | 'mom' | 'elderly' | 'student' | 'shift';
export type Budget = 'low' | 'medium' | 'high';
export type Language = 'zh-TW' | 'vi';

export interface ClientInput {
  name: string;
  age: number;
  gender: Gender;
  height_cm: number;
  weight_kg: number;
  body_fat_pct: number;
  visceral_fat_level: number;
  muscle_mass_kg: number;
  bmr_kcal?: number;
  goal: Goal;
  life_contexts: LifeContext[];
  budget: Budget;
  language: Language;
  notes?: string;
}

export type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese';
export type Formula = '2奶1餐' | '1奶2餐' | '3奶3餐';

export interface Computed {
  bmi: number;
  bmi_category: BmiCategory;
  lbm_kg: number;
  daily_protein_g_min: number;
  daily_protein_g_max: number;
  recommended_formula: Formula;
  body_fat_status: 'low' | 'normal' | 'high' | 'very_high';
  visceral_fat_status: 'normal' | 'high' | 'very_high';
}

export interface PlanProduct {
  name: string;
  qty: number;
  note?: string;
}

export interface Plan {
  name: string;
  level: 'entry' | 'core' | 'complete';
  monthly_cost: number;
  currency: 'TWD' | 'VND' | 'USD';
  products: PlanProduct[];
  daily_schedule: string[];
  selling_point: string;
}

export interface DataPoint {
  metric: string;
  value: string;
  status: 'high' | 'normal' | 'low';
  comment: string;
}

export interface NextAction {
  timing: string;
  action: string;
}

export interface CoachScriptOutput {
  opening_script: string;
  data_interpretation: {
    overall: string;
    points: DataPoint[];
  };
  plans: Plan[];
  objection_handling: {
    concern: string;
    response: string;
  }[];
  next_actions: NextAction[];
  line_template: string;
  disclaimer: string;
}

export interface GenerateResponse {
  computed: Computed;
  output: CoachScriptOutput;
  output_vi: CoachScriptOutput | null;
  violations: {
    zh: string[];
    vi: string[];
  };
  model: string;
  translator_model?: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
    translator_input_tokens?: number;
    translator_output_tokens?: number;
  };
}
