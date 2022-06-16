import fetch from 'node-fetch';

export const fetchNpmWeeklyDownloads = async (packageName: string): Promise<number> => {
  const response = await fetch('https://api.npmjs.org/downloads/point/last-week/' + packageName);
  const data = await response.json();

  return data.downloads || 0;
};
