import type { OrganisationalActivityScoreCalculationResult } from './organisational-activity-score-calculation-result';
import type { ScoreCalculationResult } from './score-calculation-result';

export interface FinancialHealthScoreCalculationResult {
  sustainabilityScore: ScoreCalculationResult;
  acceptanceOfFundingScore: ScoreCalculationResult;
  licenseTypeScore: ScoreCalculationResult;
  financialRoadmapScore: ScoreCalculationResult;
  organisationalActivityScore: OrganisationalActivityScoreCalculationResult;
  finalScore: number;
}
