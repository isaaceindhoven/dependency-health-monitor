import { fetchDependencies } from './fetch-dependencies.js';

function storeDependenciesInMap(dependenciesToStore: string[], map: Map<string, number>) {
  dependenciesToStore.forEach((dependency) => {
    if (map.has(dependency)) {
      // @ts-ignore: line above guarantees the key 'dependency' exists in the map
      map.set(dependency, map.get(dependency) + 1);
    } else {
      map.set(dependency, 1);
    }
  });
}

export async function fetchDependenciesForPackageInDepth(packageName: string, depth = 2) {
  const dependencies = new Map<string, number>();
  let previousDepthDependencies = [packageName];

  for (let currentDepth = 0; currentDepth <= depth; currentDepth++) {
    if (previousDepthDependencies.length === 0) {
      break;
    }

    const pMapResults = await fetchDependencies(previousDepthDependencies);
    const filteredDependencies: string[] = [];

    pMapResults.forEach((packageData) => {
      const dependencies = {
        ...packageData.dependencies,
        ...packageData.devDependencies,
      };

      filteredDependencies.push(
        ...Object.keys(dependencies).filter((dep) => !dep.includes('file:') && !dep.includes('link:')),
      );
    });

    storeDependenciesInMap(filteredDependencies, dependencies);
    previousDepthDependencies = filteredDependencies;
  }

  return dependencies;
}
