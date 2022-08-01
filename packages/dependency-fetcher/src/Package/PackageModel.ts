import z from 'zod';

export const PackageFundingObjectModel = z
  .object({
    type: z.string(),
    url: z.string(),
  })
  .partial();

export const PackageFundingModel = z.union([
  PackageFundingObjectModel.optional(),
  z.array(PackageFundingObjectModel).optional(),
  z.array(z.string()).optional(),
]);

export const PackagePersonModel = z
  .object({
    name: z.string(),
    email: z.string(),
    url: z.string(),
  })
  .partial();

export const PackageAuthorModel = z.union([
  z.array(PackagePersonModel).optional(),
  PackagePersonModel.optional(),
  z.array(z.string()).optional(),
]);

export const PackageModel = z.object({
  name: z.string(),
  version: z.string(),
  funding: z.optional(PackageFundingModel),
  author: z.optional(PackageAuthorModel),
  dependents: z.set(z.string()),
  dependencies: z.set(z.string()),
});

export type PackageFundingObject = z.infer<typeof PackageFundingObjectModel>;
export type PackageFunding = z.infer<typeof PackageFundingModel>;
export type PackageAuthor = z.infer<typeof PackageAuthorModel>;
export type PackagePerson = z.infer<typeof PackagePersonModel>;
export type Package = z.infer<typeof PackageModel>;
