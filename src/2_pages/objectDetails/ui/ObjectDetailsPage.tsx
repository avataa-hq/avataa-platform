import { useEffect } from 'react';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import {
  ArrowBackRounded,
  DatasetLinkedRounded,
  DeviceHubRounded,
  EditRounded,
  RouteRounded,
} from '@mui/icons-material';
import {
  AssociatedObjectsType,
  OBJECT_ID_STACK_KEY,
  useAssociatedObjects,
  useConfig,
  useGetPermissions,
  useObjectCRUD,
  useObjectDetails,
  useTabs,
  useTranslate,
} from '6_shared';
import { useGetInventoryObjectData, CreateObjectComponent } from '5_entites';
import { AssociatedObjectsWidget } from '3_widgets';
import {
  ObjectDetailsCardGrid,
  ObjectDetailsPageContainer,
  ObjectDetailsPageContent,
} from './ObjectDetailsPage.styled';
import {
  ParametersCard,
  HistoryCard,
  DocumentsCard,
  CommentsCard,
  ProcessesCard,
  TasksCard,
  ObjectTreeCard,
  LocationCard,
  DiagramsCard,
  // SummaryCard,
} from './cards';

const ObjectDetailsPage = () => {
  const translate = useTranslate();

  const {
    objectCRUDComponentUi: { isObjectCRUDModalOpen },
    setIsObjectCRUDModalOpen,
    setObjectCRUDComponentMode,
  } = useObjectCRUD();

  const { pushToObjectHistory, setIsOpenAssociatedTableModal } = useAssociatedObjects();

  const {
    config: { _disable_timezone_adjustment: disableTimezoneAdjustment },
  } = useConfig();

  // const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  const { objectIdsStack, setObjectIdsStack, popObjectIdFromStack } = useObjectDetails();

  const { inventoryObjectData } = useGetInventoryObjectData({
    objectId: objectIdsStack.length ? objectIdsStack[objectIdsStack.length - 1] : null,
  });

  const permissions = useGetPermissions('details');
  const { selectedTab } = useTabs();

  const handleHistoryLinkClick = () => {
    // setIsRightPanelOpen(true);
  };

  const handleCommentsLinkClick = () => {
    // setIsRightPanelOpen(true);
  };

  useEffect(() => {
    if (objectIdsStack.length) return;

    const storedObjectIdStack = localStorage.getItem(OBJECT_ID_STACK_KEY);
    const parsedStack = JSON.parse(storedObjectIdStack ?? '{}') as number[];
    if (parsedStack && Array.isArray(parsedStack)) setObjectIdsStack(parsedStack);
  }, [objectIdsStack]);

  const handleBackButtonClick = () => {
    if (objectIdsStack.length > 1) {
      popObjectIdFromStack();
    }
  };

  if (!objectIdsStack.length) return null;

  const lastObjectId = objectIdsStack[objectIdsStack.length - 1];

  const handleOpenAssociatedModal = (type: AssociatedObjectsType) => {
    pushToObjectHistory({ id: lastObjectId, popupType: type });
    setIsOpenAssociatedTableModal({
      isOpen: true,
      type,
      initialId: lastObjectId,
    });
  };

  return (
    <>
      <ObjectDetailsPageContainer>
        <Box component="div" display="flex" alignItems="center" justifyContent="space-between">
          <Box component="div" display="flex" alignItems="center" gap="10px">
            {objectIdsStack.length > 1 && (
              <IconButton onClick={handleBackButtonClick}>
                <ArrowBackRounded />
              </IconButton>
            )}
            <Typography variant="h1">{inventoryObjectData?.name}</Typography>
          </Box>
          <Box component="div" display="flex" alignItems="center" gap="10px">
            <Tooltip title={translate('Show children')}>
              <Button variant="outlined.icon" onClick={() => handleOpenAssociatedModal('children')}>
                <DeviceHubRounded />
              </Button>
            </Tooltip>
            <Tooltip title={translate('Show linked')}>
              <Button variant="outlined.icon" onClick={() => handleOpenAssociatedModal('linked')}>
                <DatasetLinkedRounded />
              </Button>
            </Tooltip>
            <Tooltip title={translate('Show related')}>
              <Button variant="outlined.icon" onClick={() => handleOpenAssociatedModal('related')}>
                <RouteRounded />
              </Button>
            </Tooltip>
            <Tooltip title={translate('Edit')}>
              <Button
                variant="outlined.icon"
                onClick={() => {
                  setIsObjectCRUDModalOpen(true);
                  setObjectCRUDComponentMode('editing');
                }}
              >
                <EditRounded />
              </Button>
            </Tooltip>
          </Box>
        </Box>
        <ObjectDetailsPageContent>
          <Box component="div" flex={1} position="sticky" top="0" height="100%">
            <ParametersCard objectId={lastObjectId} permissions={permissions} />
          </Box>
          <ObjectDetailsCardGrid>
            <ProcessesCard objectId={lastObjectId} />
            <ObjectTreeCard object={inventoryObjectData} />
            <LocationCard objectId={lastObjectId} />
            <DiagramsCard objectId={lastObjectId} />
            <DocumentsCard objectId={lastObjectId} />
            <TasksCard objectId={lastObjectId} />
            {/* {_summaryApiBase && <SummaryCard objectId={lastObjectId} />} */}
            <CommentsCard objectId={lastObjectId} onLinkClick={handleCommentsLinkClick} />
            <HistoryCard
              objectId={lastObjectId}
              onLinkClick={handleHistoryLinkClick}
              disableTimezoneAdjustment={disableTimezoneAdjustment}
            />
            {/* <StatisticsCard objectId={objectIdsStack[objectIdsStack.length - 1} /> */}
          </ObjectDetailsCardGrid>

          {/* <RightSidePanel
            objectId={lastObjectId}
            isOpen={isRightPanelOpen}
            setIsOpen={() => setIsRightPanelOpen(!isRightPanelOpen)}
            permissions={permissions}
          /> */}
        </ObjectDetailsPageContent>
      </ObjectDetailsPageContainer>
      <AssociatedObjectsWidget permissions={permissions} />
      {isObjectCRUDModalOpen && selectedTab === 'objectDetails' && (
        <CreateObjectComponent
          objectId={lastObjectId}
          objectTypeId={inventoryObjectData?.tmo_id ?? null}
          isOpen={isObjectCRUDModalOpen && selectedTab === 'objectDetails'}
        />
      )}
    </>
  );
};

export default ObjectDetailsPage;
