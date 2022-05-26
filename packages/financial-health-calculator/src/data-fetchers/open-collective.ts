import { OPEN_COLLECTIVE_API_KEY } from '../secrets.js';
import type { OpenCollectiveData } from '../types/open-collective-data';

const query = `
query fetchFundingData($slug: String!) {
    collective(slug: $slug) {
        stats {
            yearlyBudget {
                value
                currency
            }
        }

        contributors(roles:[ADMIN, MEMBER]) {
            totalCount
            nodes {
                name
            }
        }

        currency

        settings
    }
}`;

const getTotalFundingGoalCents = (fundingGoals: Record<string, unknown>[]): number => {
  let totalFundingCents = 0;

  // TODO: research if there are more types than balance and yearlyBudget
  fundingGoals.forEach((goal) => {
    if (goal.type === 'balance' || goal.type === 'yearlyBudget') {
      totalFundingCents += goal.amount as number;
    }
  });

  return totalFundingCents;
};

export const fetchOpenCollectiveData = (packageName: string): Promise<OpenCollectiveData> => {
  const headers = new Headers();
  headers.append('Api-Key', OPEN_COLLECTIVE_API_KEY);
  headers.append('Content-Type', 'application/json');

  const body = {
    query,
    variables: {
      slug: packageName,
    },
  };

  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: headers,
  };

  return fetch('https://api.opencollective.com/graphql/v2', options)
    .then((response) => response.json())
    .then(
      ({ data }): OpenCollectiveData => ({
        yearlyRevenueCents: data.collective.stats.yearlyBudget,
        fundingGoalCents: getTotalFundingGoalCents(data.collective.settings.goals || []),
        teamSize: data.collective.contributors.totalCount,
        currency: data.collective.currency,
      }),
    );
};
