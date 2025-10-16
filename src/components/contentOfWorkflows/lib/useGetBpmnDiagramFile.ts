import { useWorkflows } from '6_shared';

export const useGetBpmnDiagramFile = () => {
  const { bpmnModeler, activeItem } = useWorkflows();

  const getBpmnDiagramFile = async () => {
    if (!bpmnModeler || !activeItem.item) return null;

    try {
      const { xml } = await bpmnModeler.saveXML({ format: true });

      if (!xml) {
        throw new Error('Unable to export diagram XML.');
      }

      return new File(
        [xml],
        `${activeItem.item.name ?? activeItem.item.key ?? 'New Diagram'}.bpmn`,
        {
          type: 'application/octet-stream',
        },
      );
    } catch (error) {
      console.error('Failed to create BPMN file', error);
      return null;
    }
  };

  return getBpmnDiagramFile;
};
