import enJson from '../en';

function readAndCombineJsonFiles() {
  const dataContext: any = import.meta.glob('./*.json', { eager: true });

  let combinedData = {};
  Object.keys(dataContext).forEach((key: any) => {
    const jsonData = dataContext[key].default;
    combinedData = { ...combinedData, ...jsonData };
  });

  return combinedData;
}

// There may have some un-translated content. Always fill in the gaps with EN JSON.
// No need for a defaultMessage prop when render a FormattedMessage component.
export default Object.assign({}, enJson, readAndCombineJsonFiles());
