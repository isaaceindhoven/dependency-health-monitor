export const fetchNPMDependenciesForPackageJSON = async (packageJSON: Record<string, unknown>) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const url = '/api/npm-dependency-report';
  const body = JSON.stringify(packageJSON);
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: headers,
    body,
  };

  return fetch(url, requestOptions)
    .then((response) => response.json())
    .catch((e) => console.error(e));
};
