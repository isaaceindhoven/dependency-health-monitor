import fetch, { RequestInit, Headers } from 'node-fetch';
import type { OpenCollectiveData } from '../types/open-collective/open-collective-data';

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

  fundingGoals.forEach((goal) => {
    if (goal.type === 'balance' || goal.type === 'yearlyBudget') {
      totalFundingCents += goal.amount as number;
    }
  });

  return totalFundingCents;
};

export const fetchOpenCollectiveData = (packageName: string): Promise<OpenCollectiveData> => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Api-Key', process.env.OPEN_COLLECTIVE_API_KEY);

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
    .then(({ data }): OpenCollectiveData => {
      if (!data.collective) {
        return {
          yearlyRevenueCents: 0,
          fundingGoalCents: 0,
          teamSize: 0,
          currency: '',
        };
      }

      return {
        yearlyRevenueCents: data.collective.stats.yearlyBudget.value * 100,
        fundingGoalCents: getTotalFundingGoalCents(data.collective.settings.goals || []),
        teamSize: data.collective.contributors.totalCount,
        currency: data.collective.currency,
      };
    });
};
