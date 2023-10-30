import { Prisma, db } from '@dependency-health-monitor/database';
import { PackageRelation } from './PackageRelationModel.js';

export class PackageRelationRepository {
  static async getAllByPackageNames(pkgs: Set<string>): Promise<PackageRelation[]> {
    const pkgsNames = Prisma.join(Array.from(pkgs));

    const query = await db.$queryRaw`WITH RECURSIVE AllPackages (dependentName, dependencyName) AS (
      SELECT pr.dependentName,
        pr.dependencyName
      FROM PackageRelations pr
      WHERE pr.dependentName IN (${pkgsNames})
      UNION
      SELECT prr.dependentName,
        prr.dependencyName
        FROM PackageRelations prr,
        AllPackages ap
      WHERE prr.dependentName = ap.dependencyName
      LIMIT 100000
    )
    SELECT *
    FROM AllPackages;
  `;

    return query as Array<PackageRelation>;
  }

  static findPackageRelationsByPackageNameAndDependencies({
    dependentName,
    dependencies,
  }: {
    dependentName: string;
    dependencies: Set<string>;
  }) {
    return db.packageRelations.findMany({
      select: { dependentName: true, dependencyName: true },
      where: {
        AND: [
          {
            dependentName,
            dependencyName: { in: [...dependencies] },
          },
        ],
      },
    });
  }

  static async createManyByDependentNameAndDependencies({
    data,
  }: {
    data: { dependentName: string; dependencyName: string }[];
  }) {
    return db.packageRelations.createMany({ skipDuplicates: true, data });
  }
}
