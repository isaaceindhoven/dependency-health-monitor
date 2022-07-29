import { db, Package as DbPackage, Prisma } from '@dependency-health-monitor/database';
import { Package, PackageFunding, PackageFundingModel } from './PackageModel';

type DbPackageWithEdges = DbPackage & {
  edgesIn: {
    from: {
      name: string;
    };
  }[];
  edgesOut: {
    to: {
      name: string;
    };
  }[];
};

const edgesInclusion = {
  include: {
    edgesIn: { select: { from: { select: { name: true } } } },
    edgesOut: { select: { to: { select: { name: true } } } },
  },
};

export default class PackageRepository {
  public static transformDbPackageWithEdgesToPackage(pkg: DbPackageWithEdges): Package {
    const { name, version, funding, edgesIn, edgesOut } = pkg;
    return {
      name,
      version,
      funding: PackageFundingModel.parse(funding),
      edgesIn: new Set(edgesIn.map((edge) => edge.from.name)),
      edgesOut: new Set(edgesOut.map((edge) => edge.to.name)),
    };
  }

  public static async getById(id: string, includeEdges = false) {
    return db.package.findUnique({
      where: { id },
      ...(includeEdges && edgesInclusion),
    });
  }

  public static async getByName(name: string, includeEdges = false) {
    return db.package.findUnique({
      where: { name },
      ...(includeEdges && edgesInclusion),
    });
  }

  public static async getAll() {
    return db.package.findMany();
  }

  public static async create(data: Prisma.PackageCreateInput) {
    return db.package.create({ data });
  }

  public static async upsertByName(name: string, data: Prisma.PackageCreateInput) {
    return db.package.upsert({ where: { name }, create: data, update: data });
  }

  public static async updateByName(name: string, data: Prisma.PackageUpdateInput) {
    return db.package.update({ where: { name }, data });
  }
}
