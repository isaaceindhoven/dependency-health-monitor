import { calculateFinancialHealthScore } from '@dependency-health-monitor/financial-health-calculator';
import { calculateEquityScore } from '@dependency-health-monitor/equity-score-calculator';
import type { AzureFunction, Context, HttpRequest } from '@azure/functions';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  if (!req.query || !req.query.packageName) {
    context.res = {
      status: 400,
      body: 'Please specify a packageName key in your query parameters.',
    };
    return;
  }

  const packageName = req.query.packageName;
  const financialHealthScore = await calculateFinancialHealthScore(packageName);
  const equityScore = await calculateEquityScore(packageName, financialHealthScore);
  context.res = {
    body: {
      financialHealthScore,
      equityScore,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  };
};

export default httpTrigger;
