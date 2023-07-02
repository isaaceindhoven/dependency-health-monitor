import { calculateEquityScore } from '@dependency-health-monitor/equity-score-calculator';
import { calculateFinancialHealthScore } from '@dependency-health-monitor/financial-health-calculator';

const getGitHubApiRateLimit: any = () =>
  fetch('https://api.github.com/rate_limit')
    .then((response) => response.json())
    .catch((error) => {
      throw new Error(error);
    });

export default defineEventHandler(async (event) => {
  const { gitHubAccessToken, openCollectiveApiKey } = useRuntimeConfig();

  if (!gitHubAccessToken) {
    throw new Error('No GitHub access token found in runtime config.');
  }

  if (!openCollectiveApiKey) {
    throw new Error('No Open Collective API key found in runtime config.');
  }

  const body = await useBody(event);
  if (!body || !body.packageName) {
    return createError({ statusCode: 400, statusMessage: 'Please specify a packageName key in your body.' });
  }

  const rateLimitLeftBefore = await getGitHubApiRateLimit();

  if (rateLimitLeftBefore.resources.core.remaining === 0) {
    return createError({
      statusCode: 400,
      statusMessage: `API rate limit reached. Reset is on ${new Date(rateLimitLeftBefore.resources.core.reset * 1000)}`,
    });
  }

  const {packageName} = body;
  const financialHealthReport = await calculateFinancialHealthScore(
    packageName,
    gitHubAccessToken,
    openCollectiveApiKey,
  );
  const equityReport = await calculateEquityScore(packageName, financialHealthReport.finalScore);
  const rateLimitLeft = await getGitHubApiRateLimit();

  return {
    financialHealthReport,
    equityReport,
    rateLimitLeft: {
      remaining: rateLimitLeft.resources.core.remaining,
      reset: rateLimitLeft.resources.core.reset * 1000,
    },
  };
});
