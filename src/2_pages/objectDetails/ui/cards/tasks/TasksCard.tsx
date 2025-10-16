import { CardContent, CardHeader } from '@mui/material';
import { useMemo } from 'react';

import {
  LoadingAvataa,
  LoadingIndicatorContainer,
  objectTypesApi,
  processDefinitionApi,
  tasklistApi,
  useTranslate,
} from '6_shared';
import { useGetInventoryObjectData } from '5_entites';

import { ObjectDetailsCard } from '../ObjectDetailsCard';
import { ObjectTasks } from './ObjectTasks';
import { IconButtonStyled } from '../../commonComponents';

interface TasksCardProps {
  objectId: number;
}

const { useGetProcessDefinitionQuery } = processDefinitionApi;
const { useGetTasksByProcessDefinitionQuery } = tasklistApi;
const { useGetObjectTypeByIdQuery } = objectTypesApi;

export const TasksCard = ({ objectId }: TasksCardProps) => {
  const translate = useTranslate();
  const { inventoryObjectData } = useGetInventoryObjectData({ objectId });
  const { data: objectType } = useGetObjectTypeByIdQuery(inventoryObjectData?.tmo_id!, {
    skip: !inventoryObjectData?.tmo_id,
  });

  const processDefinitionBpmnProcessId = useMemo(
    () => objectType?.lifecycle_process_definition?.split(':')?.[0],
    [objectType?.lifecycle_process_definition],
  );

  const { data: processDefinitionsSearchResponse, isFetching: isProcessDefinitionsFetching } =
    useGetProcessDefinitionQuery(
      {
        filter_columns: {
          columnName: 'bpmnProcessId',
          value: processDefinitionBpmnProcessId ?? '',
        },

        limit: 100,
      },
      {
        skip: !processDefinitionBpmnProcessId,
      },
    );

  const { data, isFetching } = useGetTasksByProcessDefinitionQuery(
    processDefinitionsSearchResponse?.items[0]?.key.toString() ?? '',
    {
      skip: !processDefinitionsSearchResponse || !processDefinitionsSearchResponse?.items[0]?.key,
    },
  );

  if (!data?.tasks?.length) return null;
  const isLoading = isFetching || isProcessDefinitionsFetching;

  return (
    <ObjectDetailsCard>
      <CardHeader
        sx={{ marginBottom: 1 }}
        action={<IconButtonStyled />}
        title={translate('Tasks')}
      />
      <CardContent sx={{ overflow: 'auto' }}>
        {isLoading ? (
          <LoadingIndicatorContainer>
            <LoadingAvataa />
          </LoadingIndicatorContainer>
        ) : (
          <ObjectTasks tasks={data?.tasks ?? []} />
        )}
      </CardContent>
    </ObjectDetailsCard>
  );
};
