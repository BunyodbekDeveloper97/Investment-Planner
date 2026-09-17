/**
 * Pure investment calculation engine.
 *
 * The UI never performs financial math directly. It passes normalized input
 * into these functions and receives deterministic projection data back.
 *
 * Model assumptions for v1:
 * - Contributions are added at the end of each period.
 * - Annual return is converted to an equal periodic rate.
 * - Annual fees are applied after growth on each period.
 * - Inflation is used only to show purchasing-power-adjusted value.
 */

export function calculateInvestmentResults({
  initialInvestment,
  contributionAmount,
  expectedReturn,
  duration,
  contributionFrequency = 'annual',
  annualFee = 0,
  inflationRate = 0,
}) {
  const initial = toFiniteNumber(initialInvestment);
  const contribution = Math.max(0, toFiniteNumber(contributionAmount));
  const annualReturn = toFiniteNumber(expectedReturn);
  const years = Math.max(0, Math.floor(toFiniteNumber(duration)));
  const feeRate = Math.max(0, toFiniteNumber(annualFee)) / 100;
  const inflation = Math.max(0, toFiniteNumber(inflationRate)) / 100;

  const periodsPerYear = contributionFrequency === 'monthly' ? 12 : 1;
  const periodicReturn = annualReturn / 100 / periodsPerYear;
  const periodicFee = feeRate / periodsPerYear;

  let investmentValue = initial;
  let totalInterest = 0;
  let totalFees = 0;
  let totalContributions = initial;
  const annualData = [];

  for (let year = 1; year <= years; year += 1) {
    let yearInterest = 0;
    let yearFees = 0;
    let yearContribution = 0;

    for (let period = 0; period < periodsPerYear; period += 1) {
      const interest = investmentValue * periodicReturn;
      investmentValue += interest;
      yearInterest += interest;

      const fee = investmentValue * periodicFee;
      investmentValue -= fee;
      yearFees += fee;

      investmentValue += contribution;
      yearContribution += contribution;
    }

    totalInterest += yearInterest;
    totalFees += yearFees;
    totalContributions += yearContribution;

    annualData.push({
      year,
      interest: yearInterest,
      fees: yearFees,
      contributionAmount: yearContribution,
      valueEndOfYear: investmentValue,
      totalInterest,
      totalFees,
      totalInvested: totalContributions,
      inflationAdjustedValue: investmentValue / (1 + inflation) ** year,
    });
  }

  return annualData;
}

export function getInvestmentSummary(input) {
  const data = calculateInvestmentResults(input);
  const finalYear = data[data.length - 1];
  const initial = Math.max(0, toFiniteNumber(input.initialInvestment));
  const contribution = Math.max(0, toFiniteNumber(input.contributionAmount));
  const duration = Math.max(0, Math.floor(toFiniteNumber(input.duration)));
  const periodsPerYear = input.contributionFrequency === 'monthly' ? 12 : 1;
  const totalInvested = initial + contribution * periodsPerYear * duration;

  if (!finalYear) {
    return {
      finalValue: initial,
      totalInvested: initial,
      totalInterest: 0,
      totalFees: 0,
      inflationAdjustedValue: initial,
      growth: 0,
      data,
    };
  }

  return {
    finalValue: finalYear.valueEndOfYear,
    totalInvested,
    totalInterest: finalYear.totalInterest,
    totalFees: finalYear.totalFees,
    inflationAdjustedValue: finalYear.inflationAdjustedValue,
    growth: finalYear.valueEndOfYear - totalInvested,
    data,
  };
}

/**
 * Finds the periodic contribution needed to reach a target under the same
 * model used by calculateInvestmentResults. Binary search keeps it fast even
 * for long horizons while preserving consistency with the projection engine.
 */
export function requiredContributionForGoal(input, target = input.goalTarget) {
  const goal = toFiniteNumber(target);
  const startingInput = { ...input, contributionAmount: 0 };
  const startingValue = getInvestmentSummary(startingInput).finalValue;

  if (!Number.isFinite(goal) || goal <= 0 || startingValue >= goal) return 0;

  let low = 0;
  let high = 100;
  let highValue = 0;
  let attempts = 0;

  while (attempts < 20) {
    highValue = getInvestmentSummary({ ...input, contributionAmount: high }).finalValue;
    if (highValue >= goal) break;
    high *= 2;
    attempts += 1;
  }

  if (highValue < goal) return null;

  for (let i = 0; i < 60; i += 1) {
    const mid = (low + high) / 2;
    const value = getInvestmentSummary({ ...input, contributionAmount: mid }).finalValue;
    if (value >= goal) high = mid;
    else low = mid;
  }

  return high;
}

export function validateInvestmentInput(input) {
  const errors = {};
  const values = {
    initialInvestment: Number(input.initialInvestment),
    contributionAmount: Number(input.contributionAmount),
    expectedReturn: Number(input.expectedReturn),
    duration: Number(input.duration),
    annualFee: Number(input.annualFee),
    inflationRate: Number(input.inflationRate),
    goalTarget: Number(input.goalTarget),
  };

  if (!Number.isFinite(values.initialInvestment) || values.initialInvestment < 0) {
    errors.initialInvestment = 'Enter a value of 0 or more.';
  }
  if (!Number.isFinite(values.contributionAmount) || values.contributionAmount < 0) {
    errors.contributionAmount = 'Enter a value of 0 or more.';
  }
  if (!Number.isFinite(values.expectedReturn) || values.expectedReturn < 0 || values.expectedReturn > 100) {
    errors.expectedReturn = 'Return must be between 0% and 100%.';
  }
  if (!Number.isFinite(values.duration) || values.duration < 1 || values.duration > 100) {
    errors.duration = 'Duration must be between 1 and 100 years.';
  }
  if (!Number.isFinite(values.annualFee) || values.annualFee < 0 || values.annualFee > 20) {
    errors.annualFee = 'Fee must be between 0% and 20%.';
  }
  if (!Number.isFinite(values.inflationRate) || values.inflationRate < 0 || values.inflationRate > 50) {
    errors.inflationRate = 'Inflation must be between 0% and 50%.';
  }
  if (!Number.isFinite(values.goalTarget) || values.goalTarget <= 0) {
    errors.goalTarget = 'Goal target must be greater than 0.';
  }

  return errors;
}

export function toFiniteNumber(value) {
  if (value === '' || value === null || value === undefined) return NaN;
  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
}
