import { generateLettersId } from '6_shared';

export const getInitialBpmnDiagram = (name: string) => {
  const id = generateLettersId();

  return `<?xml version="1.0" encoding="UTF-8"?>
  <bpmn:definitions
      xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
      xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
      xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
      xmlns:zeebe="http://camunda.org/schema/zeebe/1.0"
      xmlns:modeler="http://camunda.org/schema/modeler/1.0"
      targetNamespace="http://your.custom.namespace"
      exporter="Camunda Web Modeler"
      exporterVersion="5.11.0"
      modeler:executionPlatform="Camunda Cloud"
      modeler:executionPlatformVersion="8.5.0">
    <bpmn:process id="${id}" name="${name}" isExecutable="true">
      <bpmn:startEvent id="StartEvent_1" name="Start">
        <!-- Future extensions, e.g., <bpmn:outgoing> can go here -->
      </bpmn:startEvent>
    </bpmn:process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
      <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${id}">
        <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
          <dc:Bounds x="179" y="159" width="36" height="36" />
        </bpmndi:BPMNShape>
      </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
  </bpmn:definitions>`;
};
