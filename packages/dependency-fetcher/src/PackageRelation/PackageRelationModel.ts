import z from 'zod';

export const PackageRelationModel = z.object({
  dependentName: z.string(),
  dependencyName: z.string(),
});

export type PackageRelation = z.infer<typeof PackageRelationModel>;
