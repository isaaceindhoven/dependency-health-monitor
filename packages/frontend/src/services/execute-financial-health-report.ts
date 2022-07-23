export const executeFinancialHealthReport = async (packageName: string) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const url = '/api/financial-health-report';
  const body = JSON.stringify({
    packageName,
  });
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: headers,
    body,
  };

  return fetch(url, requestOptions)
    .then((response) => response.json())
    .catch((e) => console.error(e));
};
