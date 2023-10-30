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
  z.string().optional(),
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

export const PackageModelWithCount = PackageModel.extend({
  count: z.number(),
});

export const PackageModelRaw = z.object({
  name: z.string(),
  version: z.string(),
  funding: z.optional(PackageFundingModel),
  author: z.optional(PackageAuthorModel),
  dependents: z.array(z.string()),
  dependencies: z.array(z.string()),
});

const PackageModelRawWithCount = PackageModelRaw.extend({
  count: z.number(),
});

export type PackageFundingObject = z.infer<typeof PackageFundingObjectModel>;
export type PackageFunding = z.infer<typeof PackageFundingModel>;
export type PackageAuthor = z.infer<typeof PackageAuthorModel>;
export type PackagePerson = z.infer<typeof PackagePersonModel>;
export type Package = z.infer<typeof PackageModel>;
export type PackageWithCount = z.infer<typeof PackageModelWithCount>;
export type PackageRaw = z.infer<typeof PackageModelRaw>;
export type PackageRawWithCount = z.infer<typeof PackageModelRawWithCount>;

export function mapPackageRawToPackage(pkg: PackageRaw): Package {
  const result = PackageModelRaw.safeParse(pkg);
  if (!result.success)
    throw new Error(
      `Error parsing package ${pkg.name}@${pkg.version}: /n${JSON.stringify(result.error.format(), null, 2)}`,
    );
  return {
    ...result.data,
    dependencies: new Set(result.data.dependencies),
    dependents: new Set(result.data.dependents),
  };
}

export function mapPackageToPackageRaw(pkg: Package): PackageRaw {
  const result = PackageModel.safeParse(pkg);

  if (!result.success)
    throw new Error(
      `Error parsing package ${pkg.name}@${pkg.version}: /n${JSON.stringify(result.error.format(), null, 2)}`,
    );
  return {
    ...result.data,
    dependencies: Array.from(result.data.dependencies),
    dependents: Array.from(result.data.dependents),
  };
}

export function mapPackageWithCountToPackageRawWithCount(pkg: PackageWithCount): PackageRawWithCount {
  const result = PackageModelWithCount.safeParse(pkg);

  if (!result.success)
    throw new Error(
      `Error parsing package ${pkg.name}@${pkg.version}: /n${JSON.stringify(result.error.format(), null, 2)}`,
    );
  return {
    ...result.data,
    dependencies: Array.from(result.data.dependencies),
    dependents: Array.from(result.data.dependents),
  };
}
