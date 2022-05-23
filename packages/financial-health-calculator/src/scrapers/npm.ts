import { parse } from 'node-html-parser';
import type { NpmScrapeResult } from './../types/npm-scrape-result';

const getLicenseIdentifier = async (packageName: string): Promise<string> => {
  const response = await fetch(`https://www.npmjs.com/package/${packageName}`);
  const npmPage = await response.text();

  const root = parse(npmPage);
  const h3Elements = root.getElementsByTagName('h3');
  const h3Arr = Array.from(h3Elements);
  const licenseElement = h3Arr.filter((e) => e.innerText === 'License')[0];

  if (!licenseElement) {
    return '';
  }

  const licenseParentElement = licenseElement.parentNode;
  const licenseIdentifier = licenseParentElement.childNodes[1].innerText;

  return licenseIdentifier;
};

export const scrapeFromNpm = async (packageName: string): Promise<NpmScrapeResult> => {
  const licenseIdentifier = await getLicenseIdentifier(packageName);

  return {
    licenseIdentifier,
  };
};
