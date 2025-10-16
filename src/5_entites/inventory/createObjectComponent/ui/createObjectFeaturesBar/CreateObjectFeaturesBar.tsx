import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { TabContext, TabPanel } from '@mui/lab';
import { FileViewerWidget } from '3_widgets';
import {
  History,
  ICreateTooltipTextProps,
  ICustomInputs,
  Overview,
  addObjectModel,
  createObject,
  ObjectComments,
  ObjectPermissions,
  createMultipleEditBody,
  useUpdateMultipleObjects,
  useCreateMultipleParameters,
  useUpdateMultipleParameters,
  createMultipleUpdateBody,
  useCreateObject,
  useAddObjectModel,
  isResponseVersionConflict,
  useAddDocumentToObjectById,
  useCopyAttachments,
  getFilteredData,
} from '5_entites';
import {
  Box,
  IFileData,
  IInventoryGeometryModel,
  IInventoryObjectModel,
  InventoryParameterTypesModel,
  IObjectComponentParams,
  ObjectByFilters,
  ObjectTypeGeometryType,
  useObjectCRUD,
  useParamsResolver,
  useTranslate,
} from '6_shared';
import { ObjectParameters } from '../objectParameters';
import {
  CreateObjectFeatureTabList,
  CreateObjectFeaturesBarStyled,
  CreateObjectFeaturesTab,
  ObjectAttachmentsWrapper,
  ObjectHistoryWrapper,
} from './CreateObjectFeatures.styled';

interface IProps {
  objectId: number | null;
  inventoryObjectData: IInventoryObjectModel | undefined;
  objectByFilters: ObjectByFilters | undefined;
  objectTypeParamTypes: InventoryParameterTypesModel[];
  objectTmoId: number | null;
  requiredParams: IObjectComponentParams[];
  optionalParams: IObjectComponentParams[];
  isFullScreen: boolean;
  createTooltipText: ({ paramValType, paramConstraint }: ICreateTooltipTextProps) => string;
  isLoading: boolean;
  isError: boolean;
  selectedObjectParentID?: number | null;
  duplicateAttempts: boolean;
  objectTypeGeometryType?: ObjectTypeGeometryType | null;
  tmoParentId: number | null;
  disableTimezoneAdjustment: string;
  pointsConstraintByTmo: number[];
}

export const CreateObjectFeaturesBar = ({
  objectId,
  inventoryObjectData,
  objectByFilters,
  objectTypeParamTypes,
  objectTmoId,
  requiredParams,
  optionalParams,
  isFullScreen,
  createTooltipText,
  isLoading,
  isError,
  selectedObjectParentID,
  duplicateAttempts,
  objectTypeGeometryType,
  tmoParentId,
  disableTimezoneAdjustment,
  pointsConstraintByTmo,
}: IProps) => {
  const translate = useTranslate();
  const { reset, getValues } = useFormContext();

  const {
    objectCRUDComponentUi,
    lineGeometry,
    parentIdFromTemplates,

    setGeometryPointsDetails,
    setIsObjectCRUDModalOpen,
    setLineCoordinates,
    setNewObjectCoordinates,
    setObjectCRUDComponentMode,
    setCreateChildObjectId,
    setDuplicateObject,
    setLastCreatedObjectId,
    setParentIdFromTemplates,
  } = useObjectCRUD();
  const { objectCRUDComponentMode } = objectCRUDComponentUi;

  const { setIsParamsResolverOpen, setUpdateParamsBody, setUpdateObjectBody } = useParamsResolver();

  const [tabValue, setTabValue] = useState('parameters');
  const [file, setFile] = useState<File | null>(null);
  const [newObjectGeometry, setNewObjectGeometry] = useState<IInventoryGeometryModel | null>(
    inventoryObjectData?.geometry ?? null,
  );
  const [description, setDescription] = useState('');
  const [tempFiles, setTempFiles] = useState<IFileData[]>([]);

  const { addObjectModelFn } = useAddObjectModel();

  const { createObjectFn, isLoadingCreateObject } = useCreateObject();
  const { updateMultipleObjectFn, isLoadingUpdateMultipleObjects } = useUpdateMultipleObjects();
  const { createMultipleParameters, isMultipleCreateParamsLoading } = useCreateMultipleParameters();
  const { updateMultipleParameters, isMultipleUpdateParamsLoading } = useUpdateMultipleParameters();
  const { addDocumentToObjectById, isLoadingAddDocumentToObjectById } =
    useAddDocumentToObjectById();
  const { copyAttachments, isLoadingCopyAttachments } = useCopyAttachments();

  const isApiLoading =
    isLoadingCreateObject ||
    isLoadingUpdateMultipleObjects ||
    isMultipleCreateParamsLoading ||
    isMultipleUpdateParamsLoading ||
    isLoadingAddDocumentToObjectById ||
    isLoadingCopyAttachments;

  useEffect(() => {
    setDescription(inventoryObjectData?.description || '');
  }, [inventoryObjectData]);

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  // useEffect(() => {
  //   if (!isObjectCRUDModalOpen) {
  //     setLineCoordinates(null);
  //   }
  // }, [isObjectCRUDModalOpen, setLineCoordinates]);

  useEffect(() => {
    if (objectCRUDComponentMode === 'creating') {
      setNewObjectGeometry(null);
    }
  }, [objectCRUDComponentMode]);

  const onFileChange = async (newFile: File) => {
    setFile(newFile);
  };

  const getNewObjectGeometry = useCallback((newGeometry: IInventoryGeometryModel) => {
    setNewObjectGeometry(newGeometry);
  }, []);

  const onModalClose = () => {
    setIsObjectCRUDModalOpen(false);
  };

  const paramTypeIds = useMemo(
    () => objectTypeParamTypes?.map((param) => param.id) || [],
    [objectTypeParamTypes],
  );

  const onSubmit: SubmitHandler<ICustomInputs> = async (data) => {
    const objectParentID = getValues('p_id')?.id ?? null;
    const objectPointAID = getValues('point_a_id')?.id ?? null;
    const objectPointBID = getValues('point_b_id')?.id ?? null;

    const filteredData = getFilteredData({ data, paramTypeIds });

    if (objectCRUDComponentMode === 'editing') {
      const { createParamsBody, updateParamsBody } = createMultipleEditBody({
        newData: filteredData,
        inventoryObjectData,
        checkValueEquality: true,
      });

      if (createParamsBody.length) {
        await createMultipleParameters(createParamsBody);
      }

      if (updateParamsBody.length) {
        const res = await updateMultipleParameters(updateParamsBody);

        if (isResponseVersionConflict(res)) {
          setUpdateParamsBody(updateParamsBody);
          setIsParamsResolverOpen(true);
        }
      }

      const objectUpdateBody = createMultipleUpdateBody({
        objectIds: objectId ? [objectId] : [],
        objectsData: objectByFilters ? [objectByFilters] : undefined,
        objectParentID,
        objectPointAID,
        objectPointBID,
        objectGeometry:
          JSON.stringify(newObjectGeometry) !== JSON.stringify(inventoryObjectData?.geometry)
            ? newObjectGeometry
            : undefined,
        description,
      });

      if (objectUpdateBody && objectUpdateBody.length > 0) {
        const res = await updateMultipleObjectFn(objectUpdateBody);

        if (isResponseVersionConflict(res)) {
          setUpdateObjectBody(objectUpdateBody[0]);
          setIsParamsResolverOpen(true);
        }
      }

      await addObjectModel({ addObjectModelFn, objectId, file });
    } else {
      const res = await createObject({
        values: filteredData,
        objectTmoId,
        createObjectFn,
        objectParentID: parentIdFromTemplates || objectParentID,
        objectPointAID,
        objectPointBID,
        lineGeometry: lineGeometry !== null ? lineGeometry : undefined,
        objectGeometry:
          JSON.stringify(newObjectGeometry) !== JSON.stringify(inventoryObjectData?.geometry)
            ? newObjectGeometry
            : undefined,
        description,
      });

      if (res) {
        setLastCreatedObjectId(res.id);
      }

      if (res && tempFiles.length > 0) {
        const formData = new FormData();
        tempFiles.forEach((doc) => {
          if (doc.tempFile) {
            formData.append('attachments', doc.tempFile);
          }
        });

        await addDocumentToObjectById({ objectId: res.id, body: formData });
      }

      if (res && res.status && res.status?.startsWith('4')) return;

      if (duplicateAttempts && objectId && res) {
        await copyAttachments({ from_mo_id: objectId, to_mo_id: res.id });
      }
    }

    reset();
    setIsObjectCRUDModalOpen(false);
    setObjectCRUDComponentMode('creating');
    setNewObjectGeometry(null);
    setNewObjectCoordinates(null);
    setLineCoordinates(null);
    setGeometryPointsDetails(null);
    setCreateChildObjectId(null);
    setDuplicateObject(false);
    setParentIdFromTemplates(null);
  };

  const handleObjectDescription = (newDescription: string) => {
    setDescription(newDescription);
  };

  const handleAddTempFiles = (newFile: IFileData) => {
    setTempFiles((prevFiles) => [...prevFiles, newFile]);
  };

  const handleDeleteTempFile = (id: string) => {
    setTempFiles((prevFiles) => prevFiles.filter((f) => f.id !== id));
  };

  return (
    <CreateObjectFeaturesBarStyled>
      <TabContext value={tabValue}>
        <CreateObjectFeatureTabList onChange={handleChange} aria-label="lab API tabs example">
          <CreateObjectFeaturesTab label={translate('Parameters')} value="parameters" />
          <CreateObjectFeaturesTab label={translate('Overview')} value="overview" />
          <CreateObjectFeaturesTab label={translate('Attachments')} value="attachments" />
          <CreateObjectFeaturesTab
            label={translate('History')}
            value="history"
            disabled={objectCRUDComponentMode === 'creating'}
          />
          <CreateObjectFeaturesTab
            label={translate('Comments')}
            value="comments"
            disabled={objectCRUDComponentMode === 'creating'}
          />
          <CreateObjectFeaturesTab
            label={translate('Permissions')}
            value="permissions"
            disabled={objectCRUDComponentMode === 'creating'}
          />
        </CreateObjectFeatureTabList>
        <Box height="93%">
          <TabPanel value="parameters">
            <ObjectParameters
              inventoryObjectData={inventoryObjectData}
              optionalParams={optionalParams}
              objectId={objectId}
              requiredParams={requiredParams}
              onSubmit={onSubmit}
              isLoading={isLoading || isApiLoading}
              isError={isError}
              createTooltipText={createTooltipText}
            />
          </TabPanel>
          <TabPanel value="overview">
            <Overview
              objectId={objectId}
              inventoryObjectData={inventoryObjectData}
              objectByFilters={objectByFilters}
              selectedObjectParentID={selectedObjectParentID}
              onFileChange={onFileChange}
              file={file}
              onSubmit={onSubmit}
              geometry={newObjectGeometry}
              getNewObjectGeometry={getNewObjectGeometry}
              isLoading={isLoading || isApiLoading}
              description={description}
              handleObjectDescription={handleObjectDescription}
              objectTypeGeometryType={objectTypeGeometryType}
              tmoParentId={tmoParentId}
              pointsConstraintByTmo={pointsConstraintByTmo}
            />
          </TabPanel>
          <TabPanel value="attachments">
            <ObjectAttachmentsWrapper>
              <FileViewerWidget
                objectId={objectId}
                tempFiles={tempFiles}
                handleAddTempFiles={handleAddTempFiles}
                handleDeleteTempFile={handleDeleteTempFile}
              />
            </ObjectAttachmentsWrapper>
          </TabPanel>
          <TabPanel value="history">
            <ObjectHistoryWrapper sx={{ maxWidth: isFullScreen ? '100%' : '900px' }}>
              <History
                objectId={objectId}
                title
                disableTimezoneAdjustment={disableTimezoneAdjustment}
              />
            </ObjectHistoryWrapper>
          </TabPanel>
          <TabPanel value="comments">
            <ObjectComments objectId={objectId} />
          </TabPanel>
          <TabPanel value="permissions">
            <ObjectPermissions objectId={objectId} onModalClose={onModalClose} />
          </TabPanel>
        </Box>
      </TabContext>
    </CreateObjectFeaturesBarStyled>
  );
};
