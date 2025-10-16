import { groupBPMNProcessItemsById } from '6_shared';
import { getBPMNFieldParticipantsToBuildTasks, getBPMNItemDurationInSecond } from './utils';

export const getBPMNItemsListToBuildTasks = (process: Record<string, any>) => {
  const orderedElements: Record<string, any>[] = [];
  const visited = new Set<string>();

  const elementsById = groupBPMNProcessItemsById(process); // ✅
  const allowedTypes = getBPMNFieldParticipantsToBuildTasks(process); // ✅

  let count = 0;
  const getDependenciesTarget = (item: string | string[]): string[] => {
    count++;
    const processItem = (id: string): string[] => {
      const targetItem = elementsById[id];
      if (!targetItem) return [];

      if (allowedTypes.has(targetItem.type)) return [targetItem['@_id']];

      if (count >= 100) return [];

      return getDependenciesTarget(targetItem.target);
    };

    if (!Array.isArray(item)) return processItem(item);

    return item.reduce((acc: string[], id) => acc.concat(processItem(id)), []);
  };

  let count2 = 0;
  const getDependenciesSource = (item: string | string[]): string[] => {
    count2++;
    const processItem = (id: string): string[] => {
      const sourceItem = elementsById[id];
      if (!sourceItem) return [];

      if (allowedTypes.has(sourceItem.type)) return [sourceItem['@_id']];

      if (count2 >= 100) return [];

      return getDependenciesSource(sourceItem.source);
    };

    if (!Array.isArray(item)) return processItem(item);

    return item.reduce((acc: string[], id) => acc.concat(processItem(id)), []);
  };

  const elementsWithCorrectDependencies = Object.values(elementsById).reduce((acc, item) => {
    if (allowedTypes.has(item.type)) {
      const source = item.source ? getDependenciesSource(item.source) : [];
      const target = item.target ? getDependenciesTarget(item.target) : [];
      const duration = getBPMNItemDurationInSecond(item);

      acc[item['@_id']] = {
        ...item,
        source,
        target,
        duration,
        projectId: process['@_id'],
      };
    }

    return acc;
  }, {} as Record<string, any>); // ✅

  function traverseChain(currentId: string, lastAllowed?: Record<string, any>) {
    if (visited.has(currentId)) return;
    visited.add(currentId);

    const currentElem = elementsById[currentId];
    if (!currentElem) return;

    const isAllowed = allowedTypes.has(currentElem.type);

    // Если элемент разрешён – добавляем его и обновляем связь
    if (isAllowed) {
      if (lastAllowed) {
        // Обновляем связь: предыдущий разрешённый элемент теперь напрямую связан с текущим
        lastAllowed.target = currentId;
        currentElem.source = lastAllowed.id;
      }
      orderedElements.push(currentElem);

      // Обновляем последний разрешённый элемент
      // eslint-disable-next-line no-param-reassign
      lastAllowed = currentElem;
    }

    // Если есть связь, идём дальше
    if (currentElem.target) {
      if (Array.isArray(currentElem.target)) {
        currentElem.target.forEach((targetId: string) => {
          traverseChain(targetId, lastAllowed);
        });
      } else {
        traverseChain(currentElem.target, lastAllowed);
      }
    }
  }

  // Находим стартовый элемент (без source)
  const firstEntry = Object.entries(elementsById).find(
    ([_, elem]) => elem.type === 'bpmn:startEvent',
  );
  if (firstEntry) {
    const [firstId] = firstEntry;
    traverseChain(firstId);
  }

  let bpmnElementsOrderedResult = orderedElements.map((i) => {
    const taskWithAdditionalData = elementsWithCorrectDependencies[i['@_id']];
    return taskWithAdditionalData ?? i;
  }); // ✅

  const lastElement = bpmnElementsOrderedResult[bpmnElementsOrderedResult.length - 1];

  if (lastElement.type !== 'bpmn:endEvent') {
    const endEvent = bpmnElementsOrderedResult.find((i) => i.type === 'bpmn:endEvent');
    if (endEvent) {
      bpmnElementsOrderedResult = bpmnElementsOrderedResult.filter(
        (i) => i.type !== 'bpmn:endEvent',
      );
      bpmnElementsOrderedResult.push(endEvent);
    }
  }

  return bpmnElementsOrderedResult;
};
