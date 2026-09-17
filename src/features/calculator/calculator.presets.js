export const INITIAL_INPUT = {
  goalName: 'Retirement Plan',
  initialInvestment: 10000,
  contributionAmount: 1200,
  expectedReturn: 7,
  duration: 20,
  contributionFrequency: 'monthly',
  annualFee: 0.5,
  inflationRate: 2.5,
  goalTarget: 500000,
  currency: 'USD',
};

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'KRW', label: 'KRW — Korean Won' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'UZS', label: 'UZS — Uzbek Som' },
];

export const GOAL_PRESETS = [
  { name: 'Retirement Plan', target: 500000, duration: 20 },
  { name: 'House Fund', target: 300000, duration: 15 },
  { name: 'Education Fund', target: 100000, duration: 10 },
  { name: 'Emergency Fund', target: 30000, duration: 3 },
];
