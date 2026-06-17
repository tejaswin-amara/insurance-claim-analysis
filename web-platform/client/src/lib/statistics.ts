// Statistical Utilities for Insurance Claim Analysis

export interface SummaryStats {
  count: number;
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  skewness: number;
}

export function computeSummaryStats(values: number[]): SummaryStats {
  const count = values.length;
  if (count === 0) {
    return { count: 0, mean: 0, median: 0, stdDev: 0, min: 0, max: 0, skewness: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[count - 1];
  
  // Median
  const mid = Math.floor(count / 2);
  const median = count % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  // Mean
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / count;

  // Variance & Standard Deviation
  const sqDiffSum = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
  const variance = count > 1 ? sqDiffSum / (count - 1) : 0;
  const stdDev = Math.sqrt(variance);

  // Skewness (Fisher-Pearson standardized third moment)
  let skewness = 0;
  if (stdDev > 0 && count > 2) {
    const cubedDiffSum = values.reduce((a, b) => a + Math.pow((b - mean) / stdDev, 3), 0);
    skewness = (count / ((count - 1) * (count - 2))) * cubedDiffSum;
  }

  return { count, mean, median, stdDev, min, max, skewness };
}

// Welch's T-Test: returns { tStat, pValue, df }
export interface TTestResult {
  tStat: number;
  pValue: number;
  df: number;
}

// Normal Cumulative Distribution Function (Abramowitz & Stegun 26.2.17)
function normalCDF(z: number): number {
  const absZ = Math.abs(z);
  const t = 1 / (1 + 0.2316419 * absZ);
  const d = 0.39894228; // 1 / Math.sqrt(2 * Math.PI)
  const prob = 1 - d * Math.exp(-0.5 * z * z) * (
    0.31938153 * t +
    -0.356563782 * t * t +
    1.781477937 * Math.pow(t, 3) +
    -1.821255978 * Math.pow(t, 4) +
    1.330274429 * Math.pow(t, 5)
  );
  return z < 0 ? 1 - prob : prob;
}

// Student's T CDF approximation
function tCDF(t: number, df: number): number {
  if (df <= 0) return 0.5;
  const x = t;
  const absX = Math.abs(x);
  
  if (df > 100) {
    return normalCDF(x);
  }
  
  // Correction factor for Student's T (Hill's approximation / A&S 26.7.3)
  const z = absX * (1 - 1 / (4 * df));
  const p = normalCDF(z);
  return x < 0 ? 1 - p : p;
}

export function computeWelchTTest(group1: number[], group2: number[]): TTestResult {
  const n1 = group1.length;
  const n2 = group2.length;

  if (n1 < 2 || n2 < 2) {
    return { tStat: 0, pValue: 1, df: 1 };
  }

  const s1 = computeSummaryStats(group1);
  const s2 = computeSummaryStats(group2);

  const mean1 = s1.mean;
  const mean2 = s2.mean;
  const var1 = Math.pow(s1.stdDev, 2);
  const var2 = Math.pow(s2.stdDev, 2);

  // Welch's t-statistic
  const se = Math.sqrt(var1 / n1 + var2 / n2);
  if (se === 0) return { tStat: 0, pValue: 1, df: 1 };
  
  const tStat = (mean1 - mean2) / se;

  // Welch-Satterthwaite equation for degrees of freedom
  const num = Math.pow(var1 / n1 + var2 / n2, 2);
  const den = Math.pow(var1 / n1, 2) / (n1 - 1) + Math.pow(var2 / n2, 2) / (n2 - 1);
  const df = den > 0 ? num / den : 1;

  // Two-tailed p-value
  const pValue = 2 * (1 - tCDF(Math.abs(tStat), df));

  return { tStat, pValue: Math.max(0, Math.min(1, pValue)), df };
}

// Compute Pearson correlation coefficient between two numeric arrays
export function computePearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0 || n !== y.length) return 0;

  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    num += diffX * diffY;
    denX += diffX * diffX;
    denY += diffY * diffY;
  }

  const den = Math.sqrt(denX * denY);
  return den === 0 ? 0 : num / den;
}
