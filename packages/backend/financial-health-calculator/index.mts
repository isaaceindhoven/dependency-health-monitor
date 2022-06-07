import { calculateFinancialHealthScore } from '@dependency-health-monitor/financial-health-calculator';
import type { AzureFunction, Context, HttpRequest } from '@azure/functions';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const eslintScore = await calculateFinancialHealthScore('eslint');
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: JSON.stringify(eslintScore),
  };
};

export default httpTrigger;
