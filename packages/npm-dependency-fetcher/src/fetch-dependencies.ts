import pMap from 'p-map';
import { fetchData } from './fetch.js';
import { CONCURRENCY } from './constants.js';

export async function fetchDependencies(dependencies: string[]) {
  return pMap(dependencies, fetchData, {
    concurrency: CONCURRENCY,
    stopOnError: false,
  });
}
