import pacote from 'pacote';

export async function fetchData(packageName: string) {
  return pacote.manifest(packageName);
}
