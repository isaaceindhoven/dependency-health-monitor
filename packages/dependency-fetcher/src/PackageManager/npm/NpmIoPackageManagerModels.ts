import { z } from 'zod';
import { PackageAuthorModel, PackageFundingModel } from '../../Package/PackageModel.js';

export const ManifestModel = z.object({
  name: z.string(),
  version: z.string(),
  dependencies: z.record(z.string()).optional(),
  devDependencies: z.record(z.string()).optional(),
  funding: z.optional(PackageFundingModel),
  author: z.optional(PackageAuthorModel),
});

export type Manifest = z.infer<typeof ManifestModel>;
