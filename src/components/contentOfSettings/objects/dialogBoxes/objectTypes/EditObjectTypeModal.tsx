import { SyntheticEvent, useEffect, useState } from 'react';
import {
  Autocomplete,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import TimelineIcon from '@mui/icons-material/Timeline';
import HexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import { ObjectPermissions } from '5_entites';
import {
  useTranslate,
  Modal,
  InventoryParameterTypesModel,
  Box,
  parameterTypesApi,
  objectTypesApi,
  UpdateObjectTypeParams,
  InventoryObjectTypesModel,
  LineSvg,
  lineTypes,
  capitalize,
  LineType,
  getErrorMessage,
  useSettingsObject,
  IProcessDefinition,
} from '6_shared';
import { MuiIconLibrary, IMuiIconsType } from 'components/MUIIconLibrary/MUIIconLibrary';
import CheckBoxCustom from 'components/UI/checkbox/CheckBoxCustom';
import { enqueueSnackbar } from 'notistack';
import {
  ObjectAndParamTypeModalStyled,
  Content,
  Header,
  // ModalTitle,
  ModalClose,
  InputContainer,
  InputTitle,
  InputAutocomplete,
  CreateButton,
  Bottom,
  IconContainer,
  CheckboxesSection,
} from '../ObjectAndParamTypeModal.styled';
import { renderIcon } from '../lib/renderIcon';
import { useGroupedProcessDefinitions } from '../../utilities/useGroupedProcessDefinitions';
import { normalizeSpaces } from '../lib/normalizeSpaces';

const { useGetObjectTypeParamTypesQuery } = parameterTypesApi;
const { useUpdateObjectTypeMutation, useGetObjectTypesQuery } = objectTypesApi;

const EditObjectTypeModal = () => {
  const translate = useTranslate();
  const groupedProcessDefinitions = useGroupedProcessDefinitions();

  const { objType, isEditObjectModalOpen, setIsEditObjectModalOpen } = useSettingsObject();

  const { data: objectTypesJSON = [] } = useGetObjectTypesQuery({});
  const { data: objectTypeParamsJSON } = useGetObjectTypeParamTypesQuery(
    { id: objType?.id! },
    {
      skip: !objType,
    },
  );

  const [editObject, { isLoading }] = useUpdateObjectTypeMutation();

  const [tabValue, setTabValue] = useState('1');
  const [name, setName] = useState('');
  const [errorName, setErrorName] = useState({ isError: false, message: ' ' });
  const [folder, setFolder] = useState<unknown>(null);
  const [isErrorFolder, setIsErrorFolder] = useState(false);
  const [foldersList, setFolderList] = useState<InventoryObjectTypesModel[]>([]);
  const [lat, setLat] = useState<InventoryParameterTypesModel | undefined>(undefined);
  const [lon, setLon] = useState<InventoryParameterTypesModel | undefined>(undefined);
  const [latLonList, setLatLonList] = useState<InventoryParameterTypesModel[]>([]);
  const [isErrorLatLon, setIsErrorLatLon] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<null | IMuiIconsType | 'string'>(null);
  const [isIconsModalOpen, setIsIconsModalOpen] = useState(false);
  const [description, setDescription] = useState<null | string>(null);
  const [virtual, setVirtual] = useState(false);
  const [globalUniqueness, setGlobalUniqueness] = useState(true);
  const [primaryNameArray, setPrimaryNameArray] = useState<string[]>([]);
  const [primaryIdArray, setPrimaryIdArray] = useState<number[]>([]);
  const [labelNameArray, setLabelNameArray] = useState<string[]>([]);
  const [labelIdArray, setLabelIdArray] = useState<number[]>([]);
  const [status, setStatus] = useState<InventoryParameterTypesModel | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number | ''>('');
  const [geometryType, setGeometryType] = useState<null | 'point' | 'line' | 'polygon'>(null);
  const [severityParameter, setSeverityParameter] = useState<null | InventoryParameterTypesModel>(
    null,
  );
  const [materialize, setMaterialize] = useState(false);
  const [inheritLocation, setInheritLocation] = useState(false);
  const [lineType, setLineType] = useState<LineType | null>('blank');
  const [minimize, setMinimize] = useState(false);
  const [pointsConstraintByTMO, setPointsConstraintByTMO] = useState<InventoryObjectTypesModel[]>(
    [],
  );

  useEffect(() => {
    if (!objectTypeParamsJSON) return;

    const filteredLatLonList =
      objectTypeParamsJSON.filter((item) => item.val_type === 'float' && !item.multiple) ?? [];
    setLatLonList(filteredLatLonList);
  }, [objectTypeParamsJSON]);

  useEffect(() => {
    if (lat && lon && lat === lon) {
      setIsErrorLatLon(true);
    } else {
      setIsErrorLatLon(false);
    }
  }, [lat, lon]);

  useEffect(() => {
    if (objType && isEditObjectModalOpen && objectTypeParamsJSON) {
      setName(objType.name);
      setVirtual(objType.virtual);
      setGeometryType(objType.geometry_type);
      setGlobalUniqueness(objType.global_uniqueness);
      setMaterialize(objType.materialize);
      setInheritLocation(objType.inherit_location);
      setMinimize(objType.minimize);

      if (objType.primary.length) {
        setPrimaryIdArray(objType.primary);

        const primaryNamesArray = objType.primary
          .map((paramId) => {
            const matchingParam = objectTypeParamsJSON.find((param) => param.id === paramId);
            return matchingParam ? matchingParam.name : null;
          })
          .filter((itemName): itemName is string => itemName !== null);

        setPrimaryNameArray(primaryNamesArray);
      }

      if (objType.label) {
        setLabelIdArray(objType.label);

        const labelNames = objType.label
          .map((paramId) => {
            const matchingParam = objectTypeParamsJSON.find((param) => param.id === paramId);
            return matchingParam ? matchingParam.name : null;
          })
          .filter((itemName): itemName is string => itemName !== null);

        setLabelNameArray(labelNames);
      }

      if (objType.icon) {
        if (Object.keys(lineTypes).includes(objType.icon)) {
          // setLineType(objType.icon as LineType);
          setSelectedIcon(null);
        } else {
          setSelectedIcon(objType.icon as IMuiIconsType);
        }
      }
      if (objType.line_type) {
        setLineType(objType.line_type);
      }
      if (objType.p_id && objectTypesJSON) {
        const parent = objectTypesJSON.filter((item) => item.id === objType.p_id);
        setFolder(parent[0].name);
      }
      if (objType.latitude && objectTypeParamsJSON.length) {
        const parameterType = objectTypeParamsJSON.find(
          (item: InventoryParameterTypesModel) => item.id === objType.latitude,
        );
        setLat(parameterType);
      }
      if (objType.longitude && objectTypeParamsJSON.length) {
        const parameterType = objectTypeParamsJSON.find(
          (item: InventoryParameterTypesModel) => item.id === objType.longitude,
        );
        setLon(parameterType);
      }
      if (objType.description) {
        setDescription(objType.description);
      }
      if (objType.status) {
        const parameterType = objectTypeParamsJSON.find(
          (item: InventoryParameterTypesModel) => item.id === objType.status,
        );
        setStatus(parameterType ?? null);
      }
      if (objType.lifecycle_process_definition) {
        const processDefenitionParts = objType.lifecycle_process_definition.split(':');
        setSelectedProcess(processDefenitionParts[0]);
        setSelectedVersion(+processDefenitionParts[1]);
      }
      if (objType.severity_id) {
        const selectedSeverity = objectTypeParamsJSON?.find(
          (item) => item.id === objType.severity_id,
        );

        if (selectedSeverity) {
          setSeverityParameter(selectedSeverity);
        } else {
          setSeverityParameter(null);
        }
      }
      if (objType?.points_constraint_by_tmo) {
        const filteredPointsConstraint = objectTypesJSON.filter((item) =>
          objType.points_constraint_by_tmo!.includes(item.id),
        );
        setPointsConstraintByTMO(filteredPointsConstraint);
      }
    }
  }, [
    objType,
    objectTypesJSON,
    isEditObjectModalOpen,
    objectTypeParamsJSON,
    groupedProcessDefinitions,
  ]);

  useEffect(() => {
    if (objectTypesJSON !== undefined && isEditObjectModalOpen) {
      const list = objectTypesJSON.filter((item) => item.id !== objType?.id);
      setFolderList(list);
      const latItem = latLonList.filter((item) => objType?.latitude === item.id);
      setLat(latItem.length ? latItem[0] : undefined);
      const lonItem = latLonList.filter((item) => objType?.longitude === item.id);
      setLon(lonItem.length ? lonItem[0] : undefined);
    }
  }, [isEditObjectModalOpen, latLonList, objType, objectTypesJSON]);

  const onModalClose = () => {
    setIsEditObjectModalOpen(false);
    setErrorName({ isError: false, message: ' ' });
    setIsErrorFolder(false);
    setIsErrorLatLon(false);
    setFolder(null);
    setSelectedIcon(null);
    setLat(undefined);
    setLon(undefined);
    setDescription(null);
    setVirtual(false);
    setGlobalUniqueness(true);
    setPrimaryNameArray([]);
    setLabelNameArray([]);
    setPrimaryIdArray([]);
    setSelectedProcess(null);
    setSelectedVersion('');
    setStatus(null);
    setGeometryType(null);
    setSeverityParameter(null);
    setMaterialize(false);
    setInheritLocation(false);
    setMinimize(false);
    setTabValue('1');
    setPointsConstraintByTMO([]);
  };

  const handlePrimaryChange = (item: InventoryParameterTypesModel) => {
    setPrimaryIdArray((prev) =>
      prev.includes(item.id) ? prev.filter((i) => i !== item.id) : [...prev, item.id],
    );
    setPrimaryNameArray((prev) =>
      prev.includes(item.name) ? prev.filter((i) => i !== item.name) : [...prev, item.name],
    );
  };

  const handleLabelChange = (item: InventoryParameterTypesModel) => {
    setLabelIdArray((prev) =>
      prev.includes(item.id) ? prev.filter((i) => i !== item.id) : [...prev, item.id],
    );
    setLabelNameArray((prev) =>
      prev.includes(item.name) ? prev.filter((i) => i !== item.name) : [...prev, item.name],
    );
  };

  const handleProcessChange = (event: SyntheticEvent<Element, Event>, newValue: string | null) => {
    setSelectedProcess(newValue);
    const selectedVersions = newValue ? groupedProcessDefinitions[newValue] || [] : [];

    if (selectedVersions.length > 0) {
      const lastVersion = selectedVersions[selectedVersions.length - 1].version;
      setSelectedVersion(lastVersion);
    } else {
      setSelectedVersion('');
    }
  };

  const handleDefenitionParameterChange = (
    event: SyntheticEvent<Element, Event>,
    newValue: string | null,
  ) => {
    const selectedSeverity = objectTypeParamsJSON?.find((item) => item.name === newValue);

    if (selectedSeverity) {
      setSeverityParameter(selectedSeverity);
    } else {
      setSeverityParameter(null);
    }
  };

  const handleVersionChange = (event: any) => {
    setSelectedVersion(event.target.value);
  };

  const selectedProcessVersions = selectedProcess
    ? groupedProcessDefinitions[selectedProcess] || []
    : [];

  const onGeometryTypeClick = (type: 'point' | 'line' | 'polygon') =>
    geometryType === type ? setGeometryType(null) : setGeometryType(type);

  const editObjectType = async (p_id: number | null) => {
    const normalizedName = normalizeSpaces(name);
    const errorNameAlreadyExist =
      objectTypesJSON?.some(
        (item) => normalizeSpaces(item.name) === normalizedName && objType?.name !== normalizedName,
      ) || false;
    const errorNameIsToLong = normalizedName.length > 60;

    if (errorNameAlreadyExist) {
      setErrorName({ isError: true, message: translate('Name already exists') });
    }
    if (errorNameIsToLong) {
      setErrorName({ isError: true, message: translate('Name is too long') });
    }
    if (normalizedName.trim() === '') {
      setErrorName({ isError: true, message: translate('Incorrect name') });
    }

    if (
      objType &&
      normalizedName.trim() !== '' &&
      !errorNameAlreadyExist &&
      !isErrorLatLon &&
      !errorNameIsToLong
    ) {
      setErrorName({ isError: false, message: ' ' });

      const editedFields: Record<string, any> = {};

      // name check
      if (normalizedName !== objType.name) editedFields.name = normalizedName;

      // p_id check
      if (p_id === null && objType.p_id !== null) {
        editedFields.p_id = null;
      } else if (p_id !== objType.p_id) {
        editedFields.p_id = p_id;
      }
      // latitude & longitude check
      if (lat === null && objType.latitude !== null) {
        editedFields.latitude = null;
      } else if (lat && lat.id !== objType.latitude) {
        editedFields.latitude = lat.id;
      }
      if (lon === null && objType.longitude !== null) {
        editedFields.longitude = null;
      } else if (lon && lon.id !== objType.longitude) {
        editedFields.longitude = lon.id;
      }
      // status check
      if (status === null && objType.status !== null) {
        editedFields.status = null;
      } else if (status && status.id !== objType.status) {
        editedFields.status = status.id;
      }
      // description check
      if (description === null && objType.description !== null) {
        editedFields.description = null;
      } else if (description !== objType.description) {
        editedFields.description = description;
      }
      // primary check
      // Функция для сравнения массивов по содержимому
      const arraysEqual = (arr1: number[], arr2: number[]) => {
        if (arr1.length !== arr2.length) {
          return false;
        }
        for (let i = 0; i < arr1.length; i++) {
          if (arr1[i] !== arr2[i]) {
            return false;
          }
        }
        return true;
      };

      if (!arraysEqual(primaryIdArray, objType.primary)) {
        editedFields.primary = primaryIdArray;
      }

      // label check
      if (!arraysEqual(labelIdArray, objType.label)) {
        editedFields.label = labelIdArray;
      }

      // lifecycle_process_definition check
      if (
        selectedProcess === null &&
        selectedVersion === '' &&
        objType.lifecycle_process_definition !== null
      ) {
        editedFields.lifecycle_process_definition = null;
      } else if (selectedProcess && selectedVersion !== '') {
        const processDefinition = `${selectedProcess}:${selectedVersion}`;
        if (processDefinition !== objType.lifecycle_process_definition) {
          editedFields.lifecycle_process_definition = processDefinition;
        }
      }
      // icon check
      if (selectedIcon !== objType.icon) editedFields.icon = selectedIcon;
      // virtual check
      if (virtual !== objType.virtual) editedFields.virtual = virtual;
      // geometry_type check
      if (geometryType !== objType.geometry_type) editedFields.geometry_type = geometryType;
      // line_type check
      if (objType.line_type !== lineType) editedFields.line_type = lineType;
      // global_uniqueness check
      if (globalUniqueness !== objType.global_uniqueness)
        editedFields.global_uniqueness = globalUniqueness;
      // severity_id check
      if (severityParameter !== objType.severity_id)
        editedFields.severity_id = severityParameter?.id;
      // materilize check
      if (materialize !== objType.materialize) editedFields.materialize = materialize;
      // inherit_location check
      if (inheritLocation !== objType.inherit_location)
        editedFields.inherit_location = inheritLocation;
      // minimize check
      if (minimize !== objType.minimize) editedFields.minimize = minimize;
      // points_constraint_by_tmo check
      const getIds = (array: InventoryObjectTypesModel[]) => array.map((item) => item.id);
      if (
        objType.points_constraint_by_tmo !== null &&
        !arraysEqual(getIds(pointsConstraintByTMO), objType.points_constraint_by_tmo)
      ) {
        editedFields.points_constraint_by_tmo = getIds(pointsConstraintByTMO);
      }

      if (Object.keys(editedFields).length > 0) {
        editedFields.version = objType.version;

        const editArr = { id: objType.id, ...editedFields };
        try {
          await editObject(editArr as unknown as UpdateObjectTypeParams).unwrap();
          enqueueSnackbar(translate('Object type changed successfully'), { variant: 'success' });
        } catch (error) {
          enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
        }
        onModalClose();
      } else {
        onModalClose();
      }
    }
  };

  const createObject = () => {
    if (objectTypesJSON !== undefined) {
      if (!folder) {
        editObjectType(null);
      } else {
        const filteredArr = objectTypesJSON.filter((item) => item.name === folder);

        if (filteredArr.length > 0) {
          editObjectType(filteredArr[0].id);
        } else {
          setIsErrorFolder(true);
        }
      }
    }
  };

  return (
    <ObjectAndParamTypeModalStyled
      open={isEditObjectModalOpen}
      onClose={onModalClose}
      sx={{ maxWidth: '100%' }}
    >
      <TabContext value={tabValue}>
        <Header>
          <TabList
            onChange={(event: React.SyntheticEvent, newValue: string) => setTabValue(newValue)}
          >
            <Tab label={translate('Edit object type')} value="1" />
            <Tab label={translate('Permissions')} value="2" />
          </TabList>
          <ModalClose onClick={onModalClose} />
        </Header>
        <TabPanel value="1" sx={{ overflowX: 'hidden', overflowY: 'auto' }}>
          <Content marginBottom="20px">
            <InputContainer>
              <TextField
                label={translate('Name')}
                size="small"
                autoFocus
                autoComplete="off"
                defaultValue={objType?.name}
                onChange={(event) => setName(event.target.value)}
                required
                error={errorName.isError}
                helperText={errorName.message}
              />
            </InputContainer>
            <InputContainer>
              <InputTitle>{translate('Select the folder where to place the object')}</InputTitle>
              <InputAutocomplete
                size="small"
                options={foldersList.map((item) => item.name)}
                value={folder}
                onChange={(event: SyntheticEvent<Element, Event>, value: unknown): void =>
                  setFolder(value)
                }
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    error={isErrorFolder}
                    helperText={isErrorFolder ? translate('Folder does not exist') : ' '}
                  />
                )}
                freeSolo
                autoSelect
              />
            </InputContainer>
            {geometryType === 'point' && (
              <>
                <InputContainer marginBottom="20px">
                  <InputTitle>{translate('Select latitude parameter')}</InputTitle>
                  <Select
                    sx={{ padding: '8px 39px 8px 0px' }}
                    error={isErrorLatLon}
                    value={lat?.name ?? ''}
                    onChange={(event: SelectChangeEvent<string>) => {
                      const selectedItem = latLonList.filter(
                        (item) => event.target.value === item.name,
                      );
                      setLat(selectedItem.length ? selectedItem[0] : undefined);
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {latLonList.map((item) => (
                      <MenuItem key={item.id} value={item.name}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </InputContainer>
                <InputContainer marginBottom="20px">
                  <InputTitle>{translate('Select longitude parameter')}</InputTitle>
                  <Select
                    sx={{ padding: '8px 39px 8px 0px' }}
                    error={isErrorLatLon}
                    value={lon?.name ?? ''}
                    onChange={(event: SelectChangeEvent<string>) => {
                      const selectedItem = latLonList.filter(
                        (item) => event.target.value === item.name,
                      );
                      setLon(selectedItem.length ? selectedItem[0] : undefined);
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {latLonList.map((item) => (
                      <MenuItem key={item.id} value={item.name}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </InputContainer>
              </>
            )}
            <InputContainer marginBottom="20px">
              <InputTitle>{translate('Status')}</InputTitle>
              <Select
                sx={{ padding: '8px 39px 8px 0px' }}
                value={status?.name ?? ''}
                onChange={(event: SelectChangeEvent<string>) => {
                  const selectedItem = objectTypeParamsJSON?.filter(
                    (item) => event.target.value === item.name,
                  );
                  setStatus(selectedItem?.length ? selectedItem[0] : null);
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {objectTypeParamsJSON?.map(
                  (item) =>
                    !item.multiple &&
                    (item.val_type === 'str' ||
                      item.val_type === 'int' ||
                      item.val_type === 'float' ||
                      item.val_type === 'enum') && (
                      <MenuItem key={item.id} value={item.name}>
                        {item?.name}
                      </MenuItem>
                    ),
                )}
              </Select>
            </InputContainer>
            <InputContainer marginBottom="20px">
              <InputTitle>{translate('Description')}</InputTitle>
              <TextField
                value={description || ''}
                onChange={(event) => setDescription(event.target.value)}
                autoComplete="off"
                multiline
                minRows={2}
                maxRows={4}
              />
            </InputContainer>
            <InputContainer marginBottom="20px">
              <InputTitle>{translate('Primary')}</InputTitle>
              <Select
                sx={{
                  padding: '0',
                  height: 'auto',
                  '.MuiOutlinedInput-input': { padding: '10px' },
                }}
                multiple
                value={primaryNameArray}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {objectTypeParamsJSON?.map((item) => {
                  if (
                    (item.val_type === 'str' ||
                      item.val_type === 'int' ||
                      item.val_type === 'float' ||
                      item.val_type === 'mo_link' ||
                      item.val_type === 'enum' ||
                      item.val_type === 'formula') &&
                    item.required &&
                    !item.multiple
                  ) {
                    return (
                      <MenuItem
                        onClick={() => handlePrimaryChange(item)}
                        key={item.id}
                        value={item.name}
                      >
                        {item.name}
                      </MenuItem>
                    );
                  }
                  return null;
                })}
              </Select>
            </InputContainer>
            <InputContainer marginBottom="20px">
              <InputTitle>{translate('Label')}</InputTitle>
              <Select
                sx={{
                  padding: '0',
                  height: 'auto',
                  '.MuiOutlinedInput-input': { padding: '10px' },
                }}
                multiple
                value={labelNameArray}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {objectTypeParamsJSON?.map((item) => {
                  if (
                    (item.val_type === 'str' ||
                      item.val_type === 'int' ||
                      item.val_type === 'float' ||
                      item.val_type === 'mo_link' ||
                      item.val_type === 'enum' ||
                      item.val_type === 'formula') &&
                    item.required &&
                    !item.multiple
                  ) {
                    return (
                      <MenuItem
                        onClick={() => handleLabelChange(item)}
                        key={item.id}
                        value={item.name}
                      >
                        {item.name}
                      </MenuItem>
                    );
                  }
                  return null;
                })}
              </Select>
            </InputContainer>
            <InputContainer marginBottom="20px">
              <Box gap="2%" display="flex">
                <InputTitle sx={{ width: '60%' }}>
                  {translate('Lifecycle process definition')}
                </InputTitle>
                <InputTitle sx={{ width: '40%' }}> {translate('Version')}</InputTitle>
              </Box>
              <Box gap="2%" display="flex">
                <Autocomplete
                  size="small"
                  options={Object.keys(groupedProcessDefinitions)}
                  value={selectedProcess}
                  onChange={handleProcessChange}
                  renderInput={(params: any) => <TextField {...params} />}
                  renderOption={(props, option) => {
                    const processGroup = groupedProcessDefinitions[option];
                    const process = processGroup[0];
                    return (
                      <li {...props} style={{ display: 'block', padding: '8px' }}>
                        <Typography>{process.name ?? 'No Name'}</Typography>
                        <Typography variant="body2">{process.bpmnProcessId}</Typography>
                      </li>
                    );
                  }}
                  freeSolo
                  autoSelect
                  sx={{ width: '60%' }}
                />
                <Select
                  value={selectedVersion}
                  onChange={handleVersionChange}
                  disabled={!selectedProcess}
                  sx={{ width: '40%', height: '38px' }}
                >
                  {selectedProcessVersions.map((version: IProcessDefinition) => (
                    <MenuItem
                      key={version.version}
                      value={version.version}
                      sx={{ display: 'block' }}
                    >
                      <Typography>Version {version.version}</Typography>
                      <Typography variant="body2" fontSize="0.7rem">
                        {new Date(version.timestamp).toLocaleString()}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </InputContainer>

            <InputContainer marginBottom="20px">
              <Typography>{translate('Select an option for severity')}</Typography>
              <Autocomplete
                size="small"
                options={objectTypeParamsJSON?.map((item) => item.name) || []}
                value={severityParameter?.name || null}
                onChange={handleDefenitionParameterChange}
                renderInput={(params: any) => <TextField {...params} />}
                freeSolo
                autoSelect
              />
            </InputContainer>

            <InputContainer marginBottom="20px">
              <Box
                component="div"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography width="35%">{translate('Geometry type')}:</Typography>
                <Box component="div" display="flex" gap="10%" alignItems="center" width="65%">
                  <Tooltip title="Point" placement="top">
                    <PlaceIcon
                      color={geometryType === 'point' ? 'primary' : 'inherit'}
                      onClick={() => {
                        onGeometryTypeClick('point');
                        setLineType(null);
                      }}
                      sx={{ cursor: 'pointer' }}
                    />
                  </Tooltip>
                  <Tooltip title="Line" placement="top">
                    <TimelineIcon
                      color={geometryType === 'line' ? 'primary' : 'inherit'}
                      onClick={() => {
                        onGeometryTypeClick('line');
                        setSelectedIcon(null);
                      }}
                      sx={{ cursor: 'pointer' }}
                    />
                  </Tooltip>
                  <Tooltip title="Polygon" placement="top">
                    <HexagonOutlinedIcon
                      color={geometryType === 'polygon' ? 'primary' : 'inherit'}
                      onClick={() => onGeometryTypeClick('polygon')}
                      sx={{ cursor: 'pointer' }}
                    />
                  </Tooltip>
                </Box>
              </Box>
            </InputContainer>

            {geometryType !== 'line' && (
              <Box component="div">
                {!selectedIcon ||
                selectedIcon === 'string' ||
                Object.keys(lineTypes).includes(selectedIcon) ? (
                  <Button
                    variant="outlined"
                    onClick={() => setIsIconsModalOpen(true)}
                    sx={{ marginBottom: '20px' }}
                  >
                    {translate('Choose an icon')}
                  </Button>
                ) : (
                  <IconContainer marginBottom="20px">
                    <Typography>{translate('Selected Icon:')}</Typography>
                    {!Object.keys(lineTypes).includes(selectedIcon) &&
                      renderIcon(selectedIcon, setIsIconsModalOpen)}
                  </IconContainer>
                )}
              </Box>
            )}

            {geometryType === 'line' && (
              <Box component="div" display="flex" flexDirection="column" marginBottom="20px">
                <Box component="div" display="flex" alignItems="center" marginBottom="20px">
                  <Select
                    value={lineType || ''}
                    onChange={(e) => setLineType(e.target.value as LineType)}
                    sx={{ height: '38px' }}
                  >
                    {Object.values(lineTypes).map((item) => (
                      <MenuItem key={item} value={item}>
                        {capitalize(item)}
                      </MenuItem>
                    ))}
                  </Select>
                  <Box component="div" sx={{ marginLeft: '40px' }}>
                    <LineSvg lineType={lineType ?? 'blank'} />
                  </Box>
                </Box>
                <InputContainer>
                  <InputTitle>{translate('Points constraint')}</InputTitle>
                  <InputAutocomplete
                    multiple
                    size="small"
                    options={objectTypesJSON?.filter((item) => item.id !== objType?.id) || []}
                    getOptionLabel={(option) => (option as InventoryObjectTypesModel).name}
                    value={pointsConstraintByTMO}
                    onChange={(event, newValue) =>
                      setPointsConstraintByTMO(newValue as InventoryObjectTypesModel[])
                    }
                    autoSelect
                    renderInput={(params) => <TextField {...params} />}
                  />
                </InputContainer>
              </Box>
            )}
            <Modal
              title={translate('Choose an icon')}
              open={isIconsModalOpen}
              onClose={() => setIsIconsModalOpen(false)}
              width="500px"
              height="500px"
            >
              <MuiIconLibrary
                onIconClick={(icon) => {
                  setSelectedIcon(icon);
                  setIsIconsModalOpen(false);
                }}
              />
            </Modal>
            <CheckboxesSection flexDirection="column">
              <FormControlLabel
                sx={{ mb: '10px' }}
                control={
                  <CheckBoxCustom
                    sx={{ p: '4px', marginX: 1.1 }}
                    checked={inheritLocation}
                    onChange={(event) => setInheritLocation(event.target.checked)}
                  />
                }
                label={translate('Inherit location')}
              />
              <FormControlLabel
                sx={{ mb: '10px' }}
                control={
                  <CheckBoxCustom
                    sx={{ p: '4px', marginX: 1.1 }}
                    checked={virtual}
                    onChange={(event) => setVirtual(event.target.checked)}
                  />
                }
                label={translate('Virtual')}
              />
              <FormControlLabel
                sx={{ mb: '10px' }}
                control={
                  <CheckBoxCustom
                    sx={{ p: '4px', marginX: 1.1 }}
                    checked={globalUniqueness}
                    onChange={(event) => setGlobalUniqueness(event.target.checked)}
                  />
                }
                label={translate('Global uniqueness')}
              />
              <FormControlLabel
                sx={{ mb: '10px' }}
                control={
                  <CheckBoxCustom
                    sx={{ p: '4px', marginX: 1.1 }}
                    checked={materialize}
                    onChange={(event) => setMaterialize(event.target.checked)}
                  />
                }
                label={translate('Materialize')}
              />
              <FormControlLabel
                sx={{ mb: '10px' }}
                control={
                  <CheckBoxCustom
                    sx={{ p: '4px', marginX: 1.1 }}
                    checked={minimize}
                    onChange={(event) => setMinimize(event.target.checked)}
                  />
                }
                label={translate('Minimize')}
              />
            </CheckboxesSection>
          </Content>
        </TabPanel>
        <TabPanel value="2" sx={{ display: 'flex' }}>
          <Box component="div">
            <ObjectPermissions objectTypeId={objType?.id} onModalClose={onModalClose} />
          </Box>
        </TabPanel>
      </TabContext>
      <Bottom>
        <CreateButton
          variant="contained"
          loadingIndicator={<CircularProgress color="primary" size={23} />}
          loading={isLoading}
          onClick={() => createObject()}
        >
          {translate('Accept')}
        </CreateButton>
      </Bottom>
    </ObjectAndParamTypeModalStyled>
  );
};

export default EditObjectTypeModal;
