import z from 'zod';

export const PackageFundingObjectModel = z.object({
  type: z.string(),
  url: z.string(),
});

export const PackageFundingModel = z.union([PackageFundingObjectModel, z.array(PackageFundingObjectModel), z.string()]);

export const PackagePersonModel = z.object({
  name: z.string(),
  email: z.string(),
  url: z.string(),
});

const PackageAuthorObjectModel = z.union([z.array(PackagePersonModel), PackagePersonModel]);

export const PackageModel = z.object({
  name: z.string(),
  version: z.string(),
  funding: PackageFundingModel.optional(),
  author: PackageAuthorObjectModel.optional(),
  edgesIn: z.set(z.string()),
  edgesOut: z.set(z.string()),
});

export type PackageFundingObject = z.infer<typeof PackageFundingObjectModel>;
export type PackageFunding = z.infer<typeof PackageFundingModel>;
export type PackagePerson = z.infer<typeof PackagePersonModel>;
export type Package = z.infer<typeof PackageModel>;
