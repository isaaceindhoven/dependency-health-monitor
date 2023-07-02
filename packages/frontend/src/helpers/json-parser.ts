export const parsePackageJSONStringToObject = (stringToParse: string) => {
  try {
    const result = JSON.parse(stringToParse);

    if (!result.dependencies && !result.devDependencies) {
      throw new Error('Package.json does not contain any dependencies or devDependencies.');
    }

    return result;
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      throw new TypeError('Invalid JSON object, please verify object.');
    } else {
      throw error;
    }
  }
};
