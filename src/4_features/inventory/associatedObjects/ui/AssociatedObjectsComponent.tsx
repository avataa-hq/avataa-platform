import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { gridVisibleColumnFieldsSelector, useGridApiRef } from '@mui/x-data-grid-premium';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Modal, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  ActionTypes,
  IInventoryObjectModel,
  capitalize,
  useTranslate,
  AllChildrenResponse,
  DataTransferFileExtension,
  useAssociatedObjects,
  AssociatedObjectsType,
  useTabs,
} from '6_shared';
import { useExportObjects } from '5_entites';
import { Header } from './header/Header';
import { CommonView } from './commonView/CommonView';
import { DetailedView } from './detailedView/DetailedView';
import {
  AssociatedObjectsComponentContainer,
  BodyContainer,
  HeaderContainer,
  HeaderContainerBottom,
  HeaderContainerTop,
} from './AssociatedObjectsComponent.styled';
import { ITmoModel, useGetDetailedTableData } from '../lib';
import { useDetailedTableHandleActions } from '../lib/useDetailedTableHandleActions';
import { ChildrenFlowchart } from './childrenFlowchart/ChildrenFlowchart';

interface AssociatedObjectsComponentProps {
  inventoryObjectData?: IInventoryObjectModel;
  isOpen: boolean;
  onClose?: () => void;
  detailedViewTmoModel: ITmoModel[];
  commonViewRows?: Record<number, any>[];
  commonViewRowsTotalCount?: number;
  isDataLoading: boolean;
  permissions?: Record<ActionTypes, boolean>;
  parentId?: number | null;
  associatedObjectType: AssociatedObjectsType;
  headerRightSlot?: ReactNode;
  childObjects?: AllChildrenResponse;
  setIsFindPathOpen?: (value: boolean) => void;
}

export const AssociatedObjectsComponent = ({
  inventoryObjectData,
  isOpen,
  onClose,
  detailedViewTmoModel,
  commonViewRows,
  commonViewRowsTotalCount,
  isDataLoading,
  permissions,
  parentId,
  associatedObjectType,
  headerRightSlot,
  childObjects,
  setIsFindPathOpen,
}: AssociatedObjectsComponentProps) => {
  const translate = useTranslate();
  const { name } = { ...inventoryObjectData };

  const [isDetailed, setIsDetailed] = useState<boolean>(false);
  const [isFlowchart, setIsFlowchart] = useState<boolean>(false);

  const apiRef = useGridApiRef();

  const { selectedTab } = useTabs();

  const {
    detailedView,
    objectHistory,
    setAssociatedObjectType,
    setComposedSelectedTmo,
    setCurrentMoId,
    setDetailedViewRightClickedRowId,
    setIsOpenAssociatedTableModal,
    setSelectedTmo,
    setTprmNameWhenOpen,
    setObjectDataToRequest,
    popFromObjectHistory,
  } = useAssociatedObjects();

  const { selectedTmo } = detailedView;

  const isHidden =
    selectedTab !== 'inventory' &&
    selectedTab !== 'processManager' &&
    selectedTab !== 'map' &&
    selectedTab !== 'objectDetails' &&
    selectedTab !== 'diagrams';

  useEffect(() => {
    if (associatedObjectType !== 'linked') {
      setIsDetailed(true);
    }
  }, [associatedObjectType]);

  const idsArr = useMemo(
    () => detailedViewTmoModel.find((item) => item.tmoId === selectedTmo)?.moIds,
    [detailedViewTmoModel, selectedTmo],
  );

  const {
    inventoryColumns,
    isInventoryColumnsLoading,
    inventoryRows,
    inventoryRowsLoading,
    getExportBody,
  } = useGetDetailedTableData({
    linkObjName: name,
    tmoModel: detailedViewTmoModel,
    parentId,
    associatedObjectType,
    idsArr: idsArr || [],
  });

  const { exportData, isExportLoading } = useExportObjects();

  const loadFile = useCallback(
    (fileType: DataTransferFileExtension) => {
      if (selectedTmo) {
        const params = gridVisibleColumnFieldsSelector(apiRef);
        exportData(getExportBody(params, fileType));
      }
    },
    [apiRef, exportData, getExportBody, selectedTmo],
  );

  const detailedTable = (
    <DetailedView
      tmoModel={detailedViewTmoModel}
      apiRef={apiRef}
      isDataLoading={isDataLoading}
      permissions={permissions}
      inventoryColumns={inventoryColumns}
      inventoryRows={inventoryRows}
      isLoading={isInventoryColumnsLoading || inventoryRowsLoading}
      setIsFindPathOpen={setIsFindPathOpen}
    />
  );

  const renderTableView = () => {
    if (associatedObjectType === 'linked' && commonViewRows && commonViewRowsTotalCount) {
      return isDetailed ? (
        detailedTable
      ) : (
        <CommonView rows={commonViewRows} apiRef={apiRef} totalCount={commonViewRowsTotalCount} />
      );
    }

    if (associatedObjectType === 'children') {
      return isFlowchart ? <ChildrenFlowchart childObjects={childObjects} /> : detailedTable;
    }

    return detailedTable;
  };

  const handleBack = () => {
    if (objectHistory.length < 2) {
      console.warn('Not enough objectHistory to go back.');
      return;
    }
    const { id, popupType } = objectHistory[objectHistory.length - 2];

    setIsOpenAssociatedTableModal({
      isOpen: true,
      type: popupType,
      initialId: id,
    });
    popFromObjectHistory();
  };

  const handleClose = () => {
    onClose?.();
    setSelectedTmo(null);
    setAssociatedObjectType(null);
    setDetailedViewRightClickedRowId(null);
    setCurrentMoId(null);
    popFromObjectHistory();
    setIsOpenAssociatedTableModal(false);
    setComposedSelectedTmo(null);
    setTprmNameWhenOpen(null);
    setObjectDataToRequest([]);
  };

  const {
    handleSetColumnsVisibility,
    handleSetColumnDimensions,
    handleSetColumnsOrder,
    handleSetPinnedColumns,
  } = useDetailedTableHandleActions();

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      sx={{
        display: isHidden ? 'none' : 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <AssociatedObjectsComponentContainer>
        <HeaderContainer>
          <HeaderContainerTop>
            <Typography align="center" variant="h6">
              {associatedObjectType ? capitalize(translate(associatedObjectType)) : ''}
            </Typography>
            <Box component="div">
              {objectHistory.length > 1 && (
                <IconButton
                  sx={{ marginLeft: 'auto' }}
                  onClick={handleBack}
                  data-testid="associated-objects-modal__back-button"
                >
                  <ArrowBackIcon />
                </IconButton>
              )}
              <IconButton
                sx={{ marginLeft: 'auto' }}
                onClick={handleClose}
                data-testid="associated-objects-modal__close-button"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </HeaderContainerTop>
          <HeaderContainerBottom>
            <Header
              title={name ?? ''}
              isDetailed={isDetailed}
              setIsDetailed={() => setIsDetailed(!isDetailed)}
              isFlowchart={isFlowchart}
              setIsFlowchart={() => setIsFlowchart(!isFlowchart)}
              apiRef={apiRef}
              loadFile={loadFile}
              isExportLoading={isExportLoading}
              rightSlot={headerRightSlot}
              setCustomVisibleColumns={handleSetColumnsVisibility}
              setCustomColumnDimensions={handleSetColumnDimensions}
              setCustomColumnsOrder={handleSetColumnsOrder}
              setCustomPinnedColumns={handleSetPinnedColumns}
              associatedObjectType={associatedObjectType}
            />
          </HeaderContainerBottom>
        </HeaderContainer>
        <BodyContainer>{renderTableView()}</BodyContainer>
      </AssociatedObjectsComponentContainer>
    </Modal>
  );
};
