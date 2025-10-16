import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({ ignoreAttributes: false });

export const parseBPMNTableToJSON = (bpmnStringTable: string): Record<string, any> | null => {
  const xmlData = parser.parse(bpmnStringTable);
  if (!xmlData) {
    return null;
  }

  if (!xmlData['bpmn:definitions']) {
    return null;
  }
  return xmlData['bpmn:definitions'];
};
