import { pMapSkip } from 'p-map';
import pacote from 'pacote';

export async function fetchData(packageName: string) {
  try {
    const projectData = await pacote.manifest(packageName);

    return projectData;
  } catch (e) {
    return pMapSkip;
  }
}
