import type { ScoreCalculationResult } from './score-calculation-result';

export interface FinancialHealthScoreCalculationResult {
  sustainabilityScore: ScoreCalculationResult;
  acceptanceOfFundingScore: ScoreCalculationResult;
  licenseTypeScore: ScoreCalculationResult;
  financialRoadmapScore: ScoreCalculationResult;
  organisationalActivityScore: ScoreCalculationResult;
  finalScore: number;
}
