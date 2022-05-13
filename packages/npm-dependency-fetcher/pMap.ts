import pMap from 'p-map';
import { fetchData } from './fetch';
import { CONCURRENCY } from './constants';

export default async function fetchDependencies(dependencies: string[]) {
  return pMap(dependencies, fetchData, {
    concurrency: CONCURRENCY,
    stopOnError: false,
  });
}
