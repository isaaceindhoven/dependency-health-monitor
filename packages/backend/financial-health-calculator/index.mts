import { calculateFinancialHealthScore } from '@dependency-health-monitor/financial-health-calculator';
import type { AzureFunction, Context, HttpRequest } from '@azure/functions';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  if (!req.body || !req.query.body) {
    context.res = {
      status: 400,
      body: 'Please specify a packageName key in your body.',
    };
    return;
  }

  const packageName = req.body.packageName;
  const score = await calculateFinancialHealthScore(packageName);
  context.res = {
    body: score,
    headers: {
      'Content-Type': 'application/json',
    },
  };
};

export default httpTrigger;
