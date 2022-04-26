// const parseJson = await import('parse-json');

// export const parsePackageJSONStringToObject = (stringToParse: string) => {
//   try {
//       parseJson.default
//     const parsedObject = parseJson(stringToParse);

//     return {
//       status: 'Success',
//       value: parsedObject,
//     };
//   } catch (error) {
//     return {
//       status: 'Failed',
//       value: error,
//     };
//   }
// };

export const parsePackageJSONStringToObject = (stringToParse: string) => {
  try {
    const result = JSON.parse(stringToParse);

    if (!result.dependencies && !result.devDependencies) {
      return {
        status: 'Failed',
        value: 'Package.json does not contain any dependencies or devDependencies.',
      };
    }

    return {
      status: 'Success',
      value: result,
    };
  } catch (error: any) {
    console.log(error);

    return {
      status: 'Failed',
      value: 'Invalid JSON object, please verify object.',
    };
  }
};
