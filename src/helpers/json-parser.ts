export const parsePackageJSONStringToObject = (stringToParse: string) => {
  try {
    const result = JSON.parse(stringToParse);

    if (!result.dependencies && !result.devDependencies) {
      throw new Error('Package.json does not contain any dependencies or devDependencies.');
    }

    return result;
  } catch (error: any) {
    console.log(error);

    throw new Error('Invalid JSON object, please verify object.');
  }
};
