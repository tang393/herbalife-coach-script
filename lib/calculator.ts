import type { ClientInput, Computed, BmiCategory, Formula } from './types';

export function computeDerived(input: ClientInput): Computed {
  const height_m = input.height_cm / 100;
  const bmi = Math.round((input.weight_kg / (height_m * height_m)) * 10) / 10;

  const bmi_category: BmiCategory =
    bmi < 18.5 ? 'underweight' : bmi < 24 ? 'normal' : bmi < 27 ? 'overweight' : 'obese';

  const lbm_kg = Math.round(input.weight_kg * (1 - input.body_fat_pct / 100) * 10) / 10;

  const daily_protein_g_min = Math.round(lbm_kg * 1.0);
  const daily_protein_g_max = Math.round(lbm_kg * 1.3);

  let recommended_formula: Formula;
  if (input.goal === 'lose' || bmi_category === 'overweight' || bmi_category === 'obese') {
    recommended_formula = '2奶1餐';
  } else if (input.goal === 'gain' || bmi_category === 'underweight') {
    recommended_formula = '3奶3餐';
  } else {
    recommended_formula = '1奶2餐';
  }

  const bfRef = bodyFatReference(input.gender, input.age);
  const body_fat_status =
    input.body_fat_pct < bfRef.low
      ? 'low'
      : input.body_fat_pct <= bfRef.normal_high
        ? 'normal'
        : input.body_fat_pct <= bfRef.high
          ? 'high'
          : 'very_high';

  const visceral_fat_status =
    input.visceral_fat_level <= 9 ? 'normal' : input.visceral_fat_level <= 14 ? 'high' : 'very_high';

  return {
    bmi,
    bmi_category,
    lbm_kg,
    daily_protein_g_min,
    daily_protein_g_max,
    recommended_formula,
    body_fat_status,
    visceral_fat_status,
  };
}

function bodyFatReference(gender: ClientInput['gender'], age: number) {
  if (gender === 'male') {
    if (age < 30) return { low: 8, normal_high: 20, high: 24 };
    if (age < 50) return { low: 11, normal_high: 22, high: 27 };
    return { low: 13, normal_high: 25, high: 30 };
  }
  if (age < 30) return { low: 18, normal_high: 28, high: 32 };
  if (age < 50) return { low: 20, normal_high: 30, high: 35 };
  return { low: 22, normal_high: 32, high: 38 };
}

export const labels = {
  'zh-TW': {
    gender: { male: '男', female: '女' } as const,
    goal: { lose: '減重', maintain: '維持', gain: '增重', health: '保健' } as const,
    life_context: {
      sedentary: '久坐上班',
      active: '運動族',
      mom: '媽媽/家庭主婦',
      elderly: '長輩',
      student: '學生',
      shift: '輪班族',
    } as const,
    budget: { low: '預算低（3千以內）', medium: '預算中（3–6 千）', high: '預算高（6 千以上）' } as const,
    bmi_category: {
      underweight: '偏輕',
      normal: '正常',
      overweight: '過重',
      obese: '肥胖',
    } as const,
  },
};
