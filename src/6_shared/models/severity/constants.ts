import { ICommonColumnModel } from '5_entites/processManager/lib/table/tableData/types';

export const CAMUNDA_COLUMNS_GROUP_NAME = 'Automation Parameters';

export const camundaColumns: ICommonColumnModel[] = [
  {
    id: 'active',
    val_type: 'bool',
    name: 'Active',
    group: CAMUNDA_COLUMNS_GROUP_NAME,
  },
  {
    id: 'groupName',
    val_type: 'str',
    name: 'Group Name',
    group: null,
  },
  {
    id: 'state',
    val_type: 'str',
    name: 'State',
    group: CAMUNDA_COLUMNS_GROUP_NAME,
  },
  {
    id: 'startDate',
    val_type: 'datetime',
    name: 'Start Date',
    group: CAMUNDA_COLUMNS_GROUP_NAME,
  },
  {
    id: 'endDate',
    val_type: 'datetime',
    name: 'End Date',
    group: CAMUNDA_COLUMNS_GROUP_NAME,
  },
  {
    id: 'processDefinitionKey',
    val_type: 'str',
    name: 'BPMN Process Id',
    group: CAMUNDA_COLUMNS_GROUP_NAME,
  },
  {
    id: 'id',
    val_type: 'str',
    name: 'Id',
    group: CAMUNDA_COLUMNS_GROUP_NAME,
  },
  {
    id: 'processDefinitionVersion',
    val_type: 'str',
    name: 'Version',
    group: CAMUNDA_COLUMNS_GROUP_NAME,
  },
  {
    id: 'sortValues',
    val_type: 'str',
    name: 'Sort Values',
    group: CAMUNDA_COLUMNS_GROUP_NAME,
  },
  {
    id: 'processInstanceId',
    val_type: 'str',
    name: 'Process Instance Key',
    group: CAMUNDA_COLUMNS_GROUP_NAME,
  },
  {
    id: 'name',
    val_type: 'str',
    name: 'Process Name',
    group: CAMUNDA_COLUMNS_GROUP_NAME,
  },
  {
    id: 'tmo_id',
    val_type: 'str',
    name: 'tmo_id',
    group: CAMUNDA_COLUMNS_GROUP_NAME,
  },
];

const getDefaultColumnsVisibilityModel = () => {
  const hiddenColumnsIds = Object.entries(camundaColumns).flatMap(([name, dataObj]) => {
    if (name === 'state' || name === 'startDate' || name === 'endDate') return [];

    return dataObj.id;
  });

  return hiddenColumnsIds.reduce((acc, cur) => {
    return { ...acc, [cur]: false };
  }, {});
};

export const DEFAULT_COLUMNS_VISIBILITY_MODEL = getDefaultColumnsVisibilityModel();
