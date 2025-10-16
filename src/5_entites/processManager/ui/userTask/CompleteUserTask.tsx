import { useEffect, useMemo, useState } from 'react';
import {
  groupBPMNProcessItemsById,
  ICamundaUserTaskModel,
  InventoryObjectWithGroupedParametersParamsModel,
  parseBPMNTableToJSON,
  processDefinitionApi,
  userTaskApi,
} from '6_shared';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
  Typography,
} from '@mui/material';
import {
  Attributes,
  ParameterComponents,
  useGetObjectGroupedParams,
  useUpdateOrCreateParameters,
} from '5_entites';
import { enqueueSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CompleteUserTaskStyled, FormContainerItem } from './CompleteUserTast.styled';

const { useGetProcessDefinitionsXmlQuery } = processDefinitionApi;
const { useCompleteUserTaskMutation } = userTaskApi;

const getCorrectValue = (val: unknown) => {
  if (typeof val === 'string') {
    if (val.toLowerCase() === 'true') return true;
    if (val.toLowerCase() === 'false') return false;
  }

  return val;
};

interface IProps {
  selectedUserTask: ICamundaUserTaskModel | null;

  disableComplete?: boolean;

  onAfterSubmit?: () => void;
}

export const CompleteUserTask = ({ selectedUserTask, disableComplete, onAfterSubmit }: IProps) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const taskObjectData = useMemo(() => {
    let objectId: number | null = null;
    let objectTypeId: number | null = null;
    const processDefinitionId: number | null =
      selectedUserTask?.processDefinitionId != null
        ? Number(selectedUserTask?.processDefinitionId)
        : null;

    selectedUserTask?.variables?.forEach((variable) => {
      if (variable.name === 'id') objectId = variable.value;
      if (variable.name === 'tmo_id') objectTypeId = variable.value;
    });

    return {
      objectId,
      objectTypeId,
      processDefinitionId,
    };
  }, [selectedUserTask]);

  const { data: processDefinitionXml, isFetching: isProcessDefinitionFetching } =
    useGetProcessDefinitionsXmlQuery(taskObjectData.processDefinitionId!, {
      skip: !taskObjectData.processDefinitionId,
    });

  const { objectParams, isObjectParamsFetching } = useGetObjectGroupedParams({
    objectId: taskObjectData.objectId,
  });

  const tprmList = useMemo(() => {
    const tprms: InventoryObjectWithGroupedParametersParamsModel[] = [];

    objectParams?.forEach((objectParam) => {
      const { params } = objectParam;
      params.forEach((param) => {
        tprms.push(param);
      });
    });
    return tprms;
  }, [objectParams]);

  const [
    completeUserTask,
    { isSuccess: isCompleteUserTaskSuccess, isError: isCompleteUserTaskError },
  ] = useCompleteUserTaskMutation();

  useEffect(() => {
    if (isCompleteUserTaskSuccess) {
      enqueueSnackbar('Task completed', { variant: 'success' });
    }
  }, [isCompleteUserTaskSuccess]);

  useEffect(() => {
    if (isCompleteUserTaskError) {
      enqueueSnackbar('Failed to complete task', { variant: 'error' });
    }
  }, [isCompleteUserTaskError]);

  const { updateOrCreateParameters, isLoadingMultipleParamsUpdateOrCreate } =
    useUpdateOrCreateParameters();

  const taskBpmnElement = useMemo(() => {
    if (!processDefinitionXml) return null;
    const bpmnModel = parseBPMNTableToJSON(processDefinitionXml);
    if (!bpmnModel || !bpmnModel['bpmn:process']) return null;

    return (
      groupBPMNProcessItemsById(bpmnModel['bpmn:process'])?.[selectedUserTask?.name || ''] ?? null
    );
  }, [processDefinitionXml, selectedUserTask?.name]);

  const taskAdditionalProperties = useMemo(() => {
    const extensionElements = taskBpmnElement?.['bpmn:extensionElements'];
    const properties:
      | { '@_name': string; '@_value'?: string }[]
      | { '@_name': string; '@_value'?: string } =
      extensionElements?.['zeebe:properties']?.['zeebe:property'];

    let propertiesMap: { name: string; value?: any }[] = [];

    if (Array.isArray(properties)) {
      propertiesMap = properties?.map((prop) => ({
        name: prop['@_name'],
        value: prop['@_value'],
      }));
    } else {
      propertiesMap = [{ name: properties?.['@_name'], value: properties?.['@_value'] }];
    }

    return {
      properties: propertiesMap ?? [],
    };
  }, [taskBpmnElement]);

  const taskProperties = useMemo(() => {
    const propertiesName = taskAdditionalProperties?.properties?.map((property) => property.name);
    return tprmList?.filter((paramType) => propertiesName.includes(paramType.name)) ?? [];
    // return tprmList ?? [];
  }, [tprmList, taskAdditionalProperties.properties]);

  const taskVariables = useMemo(() => {
    const variables = [...(selectedUserTask?.variables ?? [])];
    return variables.sort((a, b) => {
      if (a.value == null) return 1;
      if (b.value == null) return -1;
      return a.name.localeCompare(b.name);
    });
  }, [selectedUserTask?.variables]);

  const form = useForm();

  const onSubmit = async (data: Record<string, string>) => {
    setIsSubmitLoading(true);

    let hasError = false;

    Object.entries(data).forEach(([key, value]) => {
      if (!value) {
        form.setError(key, { type: 'required', message: 'This field is required' });
        hasError = true;
      } else {
        hasError = false;
      }
    });

    if (hasError) {
      setIsSubmitLoading(false);

      return;
    }

    const tprms = taskProperties.filter((property) =>
      Object.keys(data).includes(String(property.tprm_id)),
    );

    const completeTaskVariables = Object.entries(data).reduce((acc, [id, value]) => {
      const name = tprms.find((tprm) => String(tprm.tprm_id) === id)?.name;
      if (value && name) {
        acc[name] = getCorrectValue(value);
      }

      return acc;
    }, {} as Record<string, any>);

    const tprmsVariables = tprms.flatMap((tprm) => {
      const new_value = data[tprm.tprm_id.toString()];

      if (!new_value) return [];

      return {
        tprm_id: tprm.tprm_id,
        new_value,
        version: tprm.version,
      };
    });

    if (selectedUserTask && taskObjectData.objectId) {
      try {
        await completeUserTask({
          user_task_key: +selectedUserTask.id,
          variables: completeTaskVariables,
        }).unwrap();

        if (tprms.length > 0) {
          await updateOrCreateParameters([
            { object_id: taskObjectData.objectId, new_values: tprmsVariables },
          ]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitLoading(false);
      }
    }

    setIsSubmitLoading(false);
    onAfterSubmit?.();
  };

  const isErrors = Object.keys(form.formState.errors).length > 0;
  return (
    <CompleteUserTaskStyled>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '100%',
          overflowY: 'auto',
          gap: '0.5rem',
          padding: '0.5rem',
        }}
      >
        <Accordion
          defaultExpanded={taskProperties.length > 0}
          sx={{ borderRadius: '5px', '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Properties</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormContainerItem>
              <FormProvider {...form}>
                <form
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    height: '100%',
                  }}
                  id="taskProperties"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  {taskProperties.map((property) => (
                    <div>
                      <Typography sx={{ opacity: 0.8 }} gutterBottom>
                        {property.name}
                      </Typography>
                      <ParameterComponents
                        isEdited={!disableComplete}
                        param={{
                          ...property,
                          expanded: false,
                          showExpandButton: false,
                        }}
                        testid={`complete-user-task__${property.name}`}
                      />
                    </div>
                  ))}
                </form>
              </FormProvider>
            </FormContainerItem>
          </AccordionDetails>
        </Accordion>

        <Accordion
          defaultExpanded
          sx={{ borderRadius: '10px', '&:before': { display: 'none' }, padding: '0' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Attributes</AccordionSummary>
          <AccordionDetails sx={{ paddingLeft: '10px', paddingRight: 0 }}>
            <Attributes
              permissions={{ administrate: false, update: false, view: true }}
              objectId={taskObjectData.objectId}
            />
          </AccordionDetails>
        </Accordion>
        {taskVariables?.length > 0 && (
          <Accordion sx={{ borderRadius: '10px', '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>Variables</AccordionSummary>
            <AccordionDetails>
              <FormContainerItem>
                {taskVariables?.map(({ name, value }) => (
                  <TextField
                    key={name}
                    variant="outlined"
                    defaultValue={value}
                    label={name}
                    disabled
                  />
                ))}
              </FormContainerItem>
            </AccordionDetails>
          </Accordion>
        )}
      </div>
      {!disableComplete && (
        <FormContainerItem sx={{ marginTop: 'auto' }}>
          <LoadingButton
            disabled={isErrors}
            loading={
              isSubmitLoading ||
              isProcessDefinitionFetching ||
              isObjectParamsFetching ||
              isLoadingMultipleParamsUpdateOrCreate
            }
            variant="contained"
            type="submit"
            form="taskProperties"
          >
            Complete
          </LoadingButton>
        </FormContainerItem>
      )}
    </CompleteUserTaskStyled>
  );
};
