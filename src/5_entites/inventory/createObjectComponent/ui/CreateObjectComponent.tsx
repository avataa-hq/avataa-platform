import {
  useGetDataForTooltipName,
  useGetObjectParams,
  CreateObjectComponentDropdown,
  CreateObjectFeaturesBar,
  useGetObjectByFiltersById,
  useGetInventoryObjectData,
  DeleteObjectModal,
  useGetObjectTypes,
} from '5_entites';
import { IInventoryObjectModel, useConfig, useObjectCRUD, useTabs, useTranslate } from '6_shared';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';
import { Checkbox, FormControlLabel, IconButton, Tooltip, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ModalDialog from '6_shared/ui/modalDialog';
import {
  CreateObjectCircleIconStyled,
  CreateObjectComponentHeader,
  CreateObjectComponentStyled,
} from './CreateObjectComponent.styled';

interface IProps {
  objectId: number | null;
  objectTypeId: number | null;
  draggable?: boolean;
  isOpen?: boolean;
  selectedObjectParentID?: number | null;
}

export const CreateObjectComponent = ({
  objectId,
  objectTypeId,
  draggable,
  isOpen,
  selectedObjectParentID,
}: IProps) => {
  const translate = useTranslate();

  const {
    objectCRUDComponentUi,
    objectCRUDData,
    objectCoordinates,
    lineGeometry,
    duplicateObject,
    lastSelectedTmoId,
    templateFormData,

    setGeometryPointsDetails,
    setIsObjectCRUDModalOpen,
    setLastSelectedTmoId,
    setLineCoordinates,
    setNewObjectCoordinates,
    setObjectCRUDComponentMode,
    setCreateChildObjectId,
    setDuplicateObject,
    setObjectTmoId,
    setTemplateFormData,
  } = useObjectCRUD();

  const { isObjectCRUDModalOpen, objectCRUDComponentMode } = objectCRUDComponentUi;
  const { objectTmoId: objectCRUDDataTmoId } = objectCRUDData;
  const { selectedTab } = useTabs();
  const {
    config: { _disable_timezone_adjustment: disableTimezoneAdjustment },
  } = useConfig();

  const [tmoId, setTmoId] = useState<number | null>(objectTypeId);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [newModalTitle, setNewModalTitle] = useState('');
  const [duplicateAttempts, setDuplicateAttempts] = useState(false);
  const [tmoParentId, setTmoParentId] = useState<number | null>(null);

  useEffect(() => {
    if (!objectTypeId || (objectTypeId && templateFormData)) {
      setTmoId(objectCRUDDataTmoId || lastSelectedTmoId);
    }
  }, [objectCRUDDataTmoId, lastSelectedTmoId, objectTypeId, templateFormData]);

  const { objectTypesData, isFetching: isFetchingObjectTypes } = useGetObjectTypes({});

  const inventoryObjectTypeData = useMemo(() => {
    return objectTypesData?.find((item) => item.id === tmoId);
  }, [tmoId, objectTypesData]);

  const pointsConstraintByTmo = useMemo(() => {
    return inventoryObjectTypeData?.points_constraint_by_tmo ?? [];
  }, [inventoryObjectTypeData]);

  const { inventoryObjectData, isInventoryObjectDataFetching } = useGetInventoryObjectData({
    objectId,
    skip: objectCRUDComponentMode === 'creating' && !duplicateObject,
  });

  const { objectByFilters } = useGetObjectByFiltersById({
    objectId,
    tmoId: inventoryObjectData?.tmo_id ?? 0,
  });

  const form = useForm({ mode: 'onChange' });
  const { reset, setValue, clearErrors, setError } = form;

  const {
    objectTypeParamTypesData,
    requiredParams,
    primaryParams,
    otherParams,
    isObjectTypeParamTypesFetching,
    isObjectTypeParamTypesError,
  } = useGetObjectParams({
    objectTypeId: tmoId ?? lastSelectedTmoId ?? null,
    inventoryObjectData,
    isEditing: objectCRUDComponentMode === 'editing' || duplicateObject || !!templateFormData,
    setValue,
    templateFormData,
    setError,
  });

  const isLoading =
    isInventoryObjectDataFetching || isObjectTypeParamTypesFetching || isFetchingObjectTypes;
  const isError = isObjectTypeParamTypesError;

  const { createTooltipText } = useGetDataForTooltipName({
    objectTypeParamTypesData,
  });

  useEffect(() => {
    if (selectedTab !== 'map' || objectCRUDComponentMode === 'editing') {
      setLastSelectedTmoId(null);
    }
  }, [selectedTab, objectCRUDComponentMode, setLastSelectedTmoId]);

  useEffect(() => {
    if (!objectCoordinates || !inventoryObjectTypeData || !objectTypeParamTypesData) return;

    objectTypeParamTypesData.forEach((item) => {
      if (item.id === inventoryObjectTypeData.latitude) {
        setValue(String(item.id), objectCoordinates.latitude);
      }
      if (item.id === inventoryObjectTypeData.longitude) {
        setValue(String(item.id), objectCoordinates.longitude);
      }
    });
  }, [objectCoordinates, objectTypeParamTypesData, setValue, clearErrors, inventoryObjectTypeData]);

  useEffect(() => {
    const paramNames = primaryParams.map((item) => item.name).sort();
    const paramValue = paramNames.map((item) => form.getValues(item)).join(' - ');
    setNewModalTitle(paramValue);
  }, [form, primaryParams]);

  const handleModalClose = () => {
    reset();
    setIsObjectCRUDModalOpen(false);
    setObjectCRUDComponentMode('creating');
    setNewObjectCoordinates(null);
    setLineCoordinates(null);
    setGeometryPointsDetails(null);
    setCreateChildObjectId(null);
    setDuplicateObject(false);
    setObjectTmoId(null);
    setTemplateFormData(null);
  };

  const handleStatusText = (objectData: IInventoryObjectModel | undefined) => {
    if (!objectData || !objectData.status) {
      return {
        statusText: translate('No status'),
        tooltipText: '',
      };
    }

    if (objectData.status.length > 20) {
      return {
        statusText: `${objectData.status.slice(0, 20)}...`,
        tooltipText: objectData.status,
      };
    }

    return {
      statusText: objectData.status,
      tooltipText: '',
    };
  };

  const handleDuplicateAttachments = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDuplicateAttempts(event.target.checked);
  };

  return (
    <FormProvider {...form}>
      <ModalDialog
        modalTitle={
          objectCRUDComponentMode === 'creating'
            ? newModalTitle
            : inventoryObjectData?.Name || inventoryObjectData?.name || 'Object Name'
        }
        isModalOpen={isObjectCRUDModalOpen && (isOpen ?? true)}
        handleModalClose={handleModalClose}
        maxWidth="lg"
        isFullScreen={isFullScreen}
        draggable={draggable}
        titleContent={
          <CreateObjectComponentHeader>
            {duplicateObject && (
              <FormControlLabel
                control={
                  <Checkbox checked={duplicateAttempts} onChange={handleDuplicateAttachments} />
                }
                label={translate('Duplicate attachments')}
              />
            )}
            {objectCRUDComponentMode === 'creating' ? (
              <Typography>
                <CreateObjectCircleIconStyled color="success" />
                {translate('Draft')}
              </Typography>
            ) : (
              <Tooltip title={handleStatusText(inventoryObjectData).tooltipText} placement="top">
                <Typography>{handleStatusText(inventoryObjectData).statusText}</Typography>
              </Tooltip>
            )}
            <CreateObjectComponentDropdown
              objectTypesData={objectTypesData}
              objectTmoId={tmoId}
              isLineGeometry={lineGeometry !== null}
              isPointGeometry={objectCoordinates !== null}
              isProcessManagerPage={selectedTab === 'processManager'}
              setObjectTmoId={setTmoId}
              setTmoParentId={setTmoParentId}
            />
            <IconButton onClick={() => setIsFullScreen(!isFullScreen)}>
              {isFullScreen ? <FullscreenExitIcon /> : <FullscreenRoundedIcon />}
            </IconButton>
          </CreateObjectComponentHeader>
        }
      >
        <CreateObjectComponentStyled>
          <CreateObjectFeaturesBar
            objectId={objectId}
            inventoryObjectData={inventoryObjectData}
            objectByFilters={objectByFilters}
            objectTypeParamTypes={objectTypeParamTypesData || []}
            objectTmoId={tmoId}
            requiredParams={requiredParams}
            optionalParams={otherParams}
            isFullScreen={isFullScreen}
            createTooltipText={createTooltipText}
            isLoading={isLoading}
            isError={isError}
            selectedObjectParentID={selectedObjectParentID}
            duplicateAttempts={duplicateAttempts}
            disableTimezoneAdjustment={disableTimezoneAdjustment}
            objectTypeGeometryType={inventoryObjectTypeData?.geometry_type}
            tmoParentId={tmoParentId}
            // objectCRUDState={objectCRUDState}
            pointsConstraintByTmo={pointsConstraintByTmo}
          />
        </CreateObjectComponentStyled>
      </ModalDialog>

      <DeleteObjectModal objectId={objectId} />
    </FormProvider>
  );
};
