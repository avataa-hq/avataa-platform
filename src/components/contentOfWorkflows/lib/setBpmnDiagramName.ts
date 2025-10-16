import BpmnModeler from 'bpmn-js/lib/Modeler';

import { setXmlAttribute } from './setXmlAttribute';

export const setBpmnDiagramName = async (bpmnModeler: BpmnModeler, name: string) => {
  if (!bpmnModeler) return;

  const { xml, error } = await bpmnModeler.saveXML();

  if (error) {
    console.error(error);
    throw error;
  } else if (xml) {
    const updatedXml = setXmlAttribute({
      xml,
      tagName: 'bpmn:process',
      attributeName: 'name',
      value: name,
    });
    bpmnModeler.importXML(updatedXml).catch((err) => console.error('XML import error', err));
  }
};
