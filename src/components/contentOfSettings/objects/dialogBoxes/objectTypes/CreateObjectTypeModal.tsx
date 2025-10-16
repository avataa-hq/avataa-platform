import { SyntheticEvent, useEffect, useState } from 'react';
import {
  Button,
  Autocomplete,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Tooltip,
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import TimelineIcon from '@mui/icons-material/Timeline';
import HexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import { IMuiIconsType, MuiIconLibrary } from 'components/MUIIconLibrary/MUIIconLibrary';
import CheckBoxCustom from 'components/UI/checkbox/CheckBoxCustom';
import {
  Box,
  Modal,
  useTranslate,
  objectTypesApi,
  LineSvg,
  lineTypes,
  LineType,
  capitalize,
  InventoryObjectTypesModel,
  getErrorMessage,
  useHierarchy,
  useSettingsObject,
} from '6_shared';
import { enqueueSnackbar } from 'notistack';
import { useGroupedProcessDefinitions } from '../../utilities/useGroupedProcessDefinitions';
import { renderIcon } from '../lib/renderIcon';
import { normalizeSpaces } from '../lib/normalizeSpaces';
import {
  Content,
  ObjectAndParamTypeModalStyled,
  Header,
  ModalTitle,
  ModalClose,
  InputContainer,
  InputTitle,
  InputAutocomplete,
  CreateButton,
  Bottom,
  IconContainer,
  CheckboxesSection,
} from '../ObjectAndParamTypeModal.styled';

const { useCreateObjectTypeMutation, useGetObjectTypesQuery } = objectTypesApi;

const CreateObjectTypeModal = () => {
  const translate = useTranslate();
  const groupedProcessDefinitions = useGroupedProcessDefinitions();

  const [addInventoryObjectType, { isLoading }] = useCreateObjectTypeMutation();
  const { data: objectTypesJSON = [] } = useGetObjectTypesQuery({});

  const { isCreateObjectModalgOpen, setIsCreateObjectModalOpen } = useSettingsObject();
  const { parentId } = useHierarchy();

  const [name, setName] = useState<string>('');
  const [errorName, setErrorName] = useState({ isError: false, message: ' ' });
  const [folder, setFolder] = useState<unknown>(null);
  const [isErrorFolder, setIsErrorFolder] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<null | IMuiIconsType>(null);
  const [isIconsModalOpen, setIsIconsModalOpen] = useState(false);
  const [description, setDescription] = useState<null | string>(null);
  const [virtual, setVirtual] = useState(false);
  const [globalUniqueness, setGlobalUniqueness] = useState(true);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number | ''>('');
  const [geometryType, setGeometryType] = useState<null | 'point' | 'line' | 'polygon'>(null);
  const [materialize, setMaterialize] = useState(false);
  const [inheritLocation, setInheritLocation] = useState(false);
  const [lineType, setLineType] = useState<LineType | null>(null);
  const [minimize, setMinimize] = useState(false);
  const [pointsConstraintByTMO, setPointsConstraintByTMO] = useState<InventoryObjectTypesModel[]>(
    [],
  );

  useEffect(() => {
    if (!isCreateObjectModalgOpen) return;

    const defaultFolder = objectTypesJSON.find((item) => item.id === parentId);
    if (defaultFolder) {
      setFolder(defaultFolder.name);
    }
  }, [parentId, objectTypesJSON, isCreateObjectModalgOpen]);

  const onModalClose = () => {
    setIsCreateObjectModalOpen(false);
    setErrorName({ isError: false, message: ' ' });
    setIsErrorFolder(false);
    setName('');
    setFolder(null);
    setSelectedIcon(null);
    setDescription(null);
    setVirtual(false);
    setMaterialize(false);
    setGlobalUniqueness(true);
    setSelectedProcess(null);
    setGeometryType(null);
    setInheritLocation(false);
    setMinimize(false);
    setPointsConstraintByTMO([]);
  };

  const addObjectType = async (parent_id: number | null) => {
    const normalizedName = normalizeSpaces(name);
    const errorNameAlreadyExist =
      objectTypesJSON?.some((item) => normalizeSpaces(item.name) === normalizedName) || false;
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

    if (normalizedName.trim() !== '' && !errorNameAlreadyExist && !errorNameIsToLong) {
      setErrorName({ isError: false, message: ' ' });

      try {
        await addInventoryObjectType({
          name: normalizedName,
          p_id: parent_id,
          icon: selectedIcon,
          description,
          virtual,
          materialize,
          global_uniqueness: globalUniqueness,
          lifecycle_process_definition: selectedProcess
            ? `${selectedProcess}:${selectedVersion}`
            : null,
          geometry_type: geometryType,
          inherit_location: inheritLocation,
          minimize,
          line_type: lineType,
          points_constraint_by_tmo: pointsConstraintByTMO.map((item) => item.id),
        }).unwrap();

        enqueueSnackbar(translate('Object type created successfully'), {
          variant: 'success',
        });
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
      }
      onModalClose();
    }
  };

  const createObject = () => {
    if (!folder) {
      addObjectType(null);
    } else {
      const filteredArr: any = objectTypesJSON.filter((item) => item.name === folder);

      if (filteredArr.length > 0) {
        addObjectType(filteredArr[0].id);
      } else {
        setIsErrorFolder(true);
      }
    }
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

  const handleVersionChange = (event: any) => {
    setSelectedVersion(event.target.value);
  };

  const selectedProcessVersions = selectedProcess
    ? groupedProcessDefinitions[selectedProcess] || []
    : [];

  const onGeometryTypeClick = (type: 'point' | 'line' | 'polygon') =>
    geometryType === type ? setGeometryType(null) : setGeometryType(type);

  return (
    <ObjectAndParamTypeModalStyled open={isCreateObjectModalgOpen} onClose={onModalClose}>
      <Header>
        <ModalTitle>{translate('Add object type')}</ModalTitle>
        <ModalClose onClick={onModalClose} />
      </Header>

      <Content>
        <InputContainer>
          <TextField
            label={translate('Name')}
            size="small"
            autoFocus
            autoComplete="off"
            defaultValue={name}
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
            options={objectTypesJSON.map((item) => item.name)}
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
        <InputContainer marginBottom="20px">
          <InputTitle>{translate('Description')}</InputTitle>
          <TextField
            value={description || ''}
            onChange={(event) => setDescription(event.target.value)}
            autoComplete="off"
            multiline
            rows={4}
          />
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
              {selectedProcessVersions.map((version: any) => (
                <MenuItem key={version.version} value={version.version}>
                  {translate('Version')} {version.version}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </InputContainer>

        <InputContainer marginBottom="20px">
          <Box component="div" display="flex" justifyContent="space-between" alignItems="center">
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
            {selectedIcon ? (
              <IconContainer marginBottom="20px">
                <Typography>{translate('Selected Icon:')}</Typography>
                {renderIcon(selectedIcon, setIsIconsModalOpen)}
              </IconContainer>
            ) : (
              <Button
                variant="outlined"
                onClick={() => setIsIconsModalOpen(true)}
                sx={{ marginBottom: '20px' }}
              >
                {translate('Choose an icon')}
              </Button>
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
                options={objectTypesJSON || []}
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
      <Bottom>
        <CreateButton
          variant="contained"
          loadingIndicator={<CircularProgress color="primary" size={23} />}
          loading={isLoading}
          onClick={() => createObject()}
        >
          {translate('Create')}
        </CreateButton>
      </Bottom>
    </ObjectAndParamTypeModalStyled>
  );
};

export default CreateObjectTypeModal;
