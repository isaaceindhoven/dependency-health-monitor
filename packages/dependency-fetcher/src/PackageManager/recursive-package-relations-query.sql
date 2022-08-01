WITH RECURSIVE AllPackages (dependentName, dependencyName, lvl) AS (
  SELECT pr.dependentName,
    pr.dependencyName,
    0
  FROM PackageRelations pr
#     JOIN Package p ON p.name = pr.dependencyName
  WHERE pr.dependentName = 'eslint'
  UNION ALL
  SELECT 
  prr.dependentName,
  prr.dependencyName,
    ap.lvl + 1
  FROM PackageRelations prr,
    AllPackages ap
  WHERE prr.dependentName = ap.dependencyName
  LIMIT 150000
)
SELECT *
FROM AllPackages;