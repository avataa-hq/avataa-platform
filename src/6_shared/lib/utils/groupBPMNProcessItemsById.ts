const checkArray = (field?: any | any[] | null) => {
  if (!field) return [];
  return Array.isArray(field) ? field : [field];
};
const processFieldModification = (filed: any, type: string) => {
  let source: string | string[] | undefined;
  let target: string | string[] | undefined;

  if (filed?.['bpmn:incoming']) source = filed['bpmn:incoming'];
  if (filed?.['bpmn:outgoing']) target = filed['bpmn:outgoing'];

  if (filed?.['@_sourceRef']) source = filed['@_sourceRef'];
  if (filed?.['@_targetRef']) target = filed['@_targetRef'];

  return {
    ...filed,
    source,
    target,
    type,
  };
};

export const groupBPMNProcessItemsById = (process: Record<string, any>) => {
  const processFields: any[] = [];
  const processSubProcess = checkArray(process['bpmn:subProcess']);

  Object.entries(process).forEach(([key, value]) => {
    if (key.includes('bpmn')) {
      let correctValue = value;
      if (!key.includes('startEvent') && !key.includes('endEvent')) {
        correctValue = checkArray(value);
      }

      if (Array.isArray(correctValue)) {
        const valuesWithType = correctValue.map((v) => processFieldModification(v, key));
        processFields.push(valuesWithType);
      } else {
        processFields.push(processFieldModification(correctValue, key));
      }
    }
  });

  const allElementsById: Record<string, any> = {};

  processFields.flat().forEach((item) => {
    if (item && item['@_id']) allElementsById[item['@_id']] = item;
  });

  processSubProcess.forEach((subProcess: any) => {
    if (subProcess && subProcess['@_id']) {
      allElementsById[subProcess['@_id']] = processFieldModification(subProcess, 'bpmn:subProcess');
      const nestedTasks = groupBPMNProcessItemsById(subProcess); // Функция разбора вложенных задач
      Object.entries(nestedTasks).forEach(([k, v]) => {
        allElementsById[k] = v;
      });
    }
  });

  return allElementsById;
};
