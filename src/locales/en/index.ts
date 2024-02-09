function readAndCombineJsonFiles() {
  const dataContext: any = import.meta.glob('./*.json', { eager: true });

  let combinedData = {};
  Object.keys(dataContext).forEach((key: any) => {
    const jsonData = dataContext[key].default;
    combinedData = { ...combinedData, ...jsonData };
  });

  return combinedData;
}

export default readAndCombineJsonFiles();
