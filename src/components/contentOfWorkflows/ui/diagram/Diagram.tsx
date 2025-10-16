import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import { Box, processDefinitionApi, useWorkflows } from '6_shared';
import BpmnEditor from './BpmnEditor';
import { DiagramContainer, EditorContainer } from './Diagram.styled';
import { SaveDiagramButton } from './SaveDiagramButton';
import { DiagramName } from './DiagramName';
import { DownloadDiagramButton } from './DownloadDiagramButton';

const { useGetProcessDefinitionsXmlQuery } = processDefinitionApi;

interface IProps {
  refetchProcessDefinitions: () => void;
}

const Diagram = ({ refetchProcessDefinitions }: IProps) => {
  const { activeItem, newItem } = useWorkflows();

  const { data, isFetching } = useGetProcessDefinitionsXmlQuery(activeItem.item?.key!, {
    skip: !activeItem.item || activeItem.item?.key === 0,
  });

  return (
    <DiagramContainer>
      <>
        {activeItem.item && !isFetching && (
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex">
              <DiagramName />
              <DownloadDiagramButton />
            </Box>
            <SaveDiagramButton refetchProcessDefinitions={refetchProcessDefinitions} />
          </Box>
        )}
        <EditorContainer>
          <BpmnEditor
            diagramXml={
              activeItem.item?.key === newItem.item?.key ? newItem.item?.diagramXml : data
            }
            isLoading={isFetching}
          />
        </EditorContainer>
      </>
    </DiagramContainer>
  );
};

export default Diagram;
