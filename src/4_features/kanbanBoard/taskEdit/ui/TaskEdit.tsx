import {
  ActionTypes,
  CreateParamTypeBody,
  IInventoryObjectModel,
  InventoryParameterTypesModel,
  MdEditor,
  parameterTypesApi,
  useTranslate,
} from '6_shared';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Typography } from '@mui/material';
import {
  useGetInventoryObjectData,
  useUpdateMultipleObjects,
  useUpdateMultipleParameters,
  useGetReturnableParamTypes,
  useCreateMultipleParameters,
} from '5_entites';
import { LeftArea, RightArea, TaskEditStyled } from './TaskEdit.styled';
import { Header } from './header/Header';
import { Footer, IFooterProps } from './footer/Footer';

const { useCreateParamTypeMutation } = parameterTypesApi;

const createSummaryParamType = (
  inventoryObjectData: IInventoryObjectModel,
): CreateParamTypeBody => {
  return {
    name: 'Summary',
    val_type: 'str',
    tmo_id: inventoryObjectData.tmo_id,
    returnable: true,
  };
};

interface IProps {
  objectId: number;
  footerSlots?: IFooterProps;
  rightSlot?: ReactNode;
  permissions?: Record<ActionTypes, boolean>;
}

export const TaskEdit = ({ objectId, footerSlots, rightSlot, permissions }: IProps) => {
  const translate = useTranslate();

  const [summaryTprm, setSummaryTprm] = useState<InventoryParameterTypesModel | null>(null);

  const { inventoryObjectData, inventoryObjectDataError } = useGetInventoryObjectData({
    objectId,
  });

  const [descriptionMarkdown, setDescriptionMarkdown] = useState(
    inventoryObjectData?.description || '',
  );

  useEffect(() => {
    setDescriptionMarkdown(inventoryObjectData?.description || '');
  }, [inventoryObjectData]);

  // useEffect(() => {
  //   if (descriptionMarkdown.trim() === '' && inventoryObjectData?.description) {
  //     setDescriptionMarkdown(inventoryObjectData.description);
  //   }
  // }, [inventoryObjectData?.description]);

  const { returnableParamTypes } = useGetReturnableParamTypes({
    pmTmoId: inventoryObjectData?.tmo_id!,
  });

  const [createParamType] = useCreateParamTypeMutation();

  useEffect(() => {
    const summaryParamType = returnableParamTypes?.find((p) => p.name?.toLowerCase() === 'summary');
    if (summaryParamType) setSummaryTprm(summaryParamType);
    else if (inventoryObjectData) {
      const newSummaryParamType = createSummaryParamType(inventoryObjectData);
      createParamType(newSummaryParamType)
        .unwrap()
        .then((res) => {
          setSummaryTprm(res);
        });
    }
  }, [createParamType, inventoryObjectData, returnableParamTypes]);

  const { updateMultipleObjectFn } = useUpdateMultipleObjects(); // description update
  const { updateMultipleParameters } = useUpdateMultipleParameters();
  const { createMultipleParameters } = useCreateMultipleParameters();

  const objectSummaryPRM = useMemo(() => {
    return inventoryObjectData?.params?.find((p) => p.tprm_id === summaryTprm?.id);
  }, [inventoryObjectData?.params, summaryTprm?.id]);

  const onTaskNameInputSave = useCallback(
    async (name: string) => {
      if (summaryTprm && inventoryObjectData) {
        if (!objectSummaryPRM) {
          await createMultipleParameters([
            {
              object_id: +inventoryObjectData.id,
              new_values: [
                { tprm_id: summaryTprm.id, new_value: name, version: summaryTprm.version },
              ],
            },
          ]);
        } else if (objectSummaryPRM.value !== name) {
          await updateMultipleParameters(
            [
              {
                object_id: +inventoryObjectData.id,
                new_values: [
                  { tprm_id: summaryTprm.id, new_value: name, version: objectSummaryPRM.version },
                ],
              },
            ],
            'Summary updated successfully',
          );
        }
      }
    },
    [
      summaryTprm,
      inventoryObjectData,
      objectSummaryPRM,
      createMultipleParameters,
      updateMultipleParameters,
    ],
  );

  const onMdSaveAction = async (markdown: string) => {
    if (inventoryObjectData?.description !== markdown && inventoryObjectData) {
      await updateMultipleObjectFn([
        {
          object_id: +inventoryObjectData.id,
          data_for_update: {
            description: markdown,
            version: inventoryObjectData.version,
          },
        },
      ]);
    }
  };

  if (inventoryObjectDataError) {
    return (
      <TaskEditStyled>
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* @ts-ignore */}
          <Typography variant="h2">{inventoryObjectDataError.data.detail}</Typography>
        </div>
      </TaskEditStyled>
    );
  }
  return (
    <TaskEditStyled>
      <LeftArea>
        <Typography sx={{ opacity: 0.6 }} variant="subtitle1">
          {translate('Summary')}:
        </Typography>
        <Header
          disabled={!summaryTprm || permissions?.update !== true}
          taskTitle={(objectSummaryPRM?.value ?? '') as string}
          onSave={onTaskNameInputSave}
        />

        <Typography sx={{ opacity: 0.6 }} gutterBottom={false} variant="subtitle1">
          {translate('Description')}:
        </Typography>
        <MdEditor
          onSaveClick={onMdSaveAction}
          markdown={descriptionMarkdown}
          setMarkdown={setDescriptionMarkdown}
          disabled={permissions?.update !== true}
          initialHeight="100%"
        />

        <Typography sx={{ opacity: 0.6 }} variant="subtitle1">
          {translate('Activity')}:
        </Typography>
        <Footer {...footerSlots} />
      </LeftArea>
      <RightArea>{rightSlot}</RightArea>
    </TaskEditStyled>
  );
};
