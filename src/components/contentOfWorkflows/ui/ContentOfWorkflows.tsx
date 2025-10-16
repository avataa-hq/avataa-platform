import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { SearchInput, SidebarLayout, useRegistration, processDefinitionApi } from '6_shared';

import { ContentOfWorkflowsStyled, SidebarHorContainer } from './ContentOfWorkflows.styled';
import ProcessDefinitionsList from './ProcessDefinitionsList';
import Diagram from './diagram/Diagram';
import { CreateModal, UploadModal, SaveWarningModal } from './modals';
import { AddDiagramButton } from './diagram/AddDiagramButton';

const { useGetProcessDefinitionQuery } = processDefinitionApi;

const ContentOfWorkflows = () => {
  useRegistration('workflow');

  const { data: processDefinitions, refetch } = useGetProcessDefinitionQuery({
    limit: 2000,
  });

  const [searchResult, setSearchResult] = useState(processDefinitions);

  const refetchProcessDefinitions = () => {
    refetch();
  };

  const { Sidebar, Container, SidebarHeader, SidebarBody } = SidebarLayout;

  return (
    <ContentOfWorkflowsStyled>
      <SidebarLayout>
        <Sidebar collapsible>
          <SidebarHeader>
            <SidebarHorContainer marginTop="0.5rem">
              <SearchInput
                data={processDefinitions?.items}
                searchedProperty={['name', 'key']}
                onChange={(result) => {
                  if (processDefinitions)
                    setSearchResult({
                      ...processDefinitions,
                      items: result?.filter((p) => !p.name?.includes('DS Test')),
                    });
                }}
              />
              <AddDiagramButton />
              <CreateModal />
              <DndProvider backend={HTML5Backend}>
                <UploadModal />
              </DndProvider>
            </SidebarHorContainer>
          </SidebarHeader>
          <SidebarBody>
            <ProcessDefinitionsList data={searchResult} />
          </SidebarBody>
        </Sidebar>
        <Container>
          <Diagram refetchProcessDefinitions={refetchProcessDefinitions} />
        </Container>
      </SidebarLayout>
      <SaveWarningModal />
    </ContentOfWorkflowsStyled>
  );
};
export default ContentOfWorkflows;
