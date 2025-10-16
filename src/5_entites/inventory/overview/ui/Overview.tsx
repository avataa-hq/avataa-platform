import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  AutocompleteInputChangeReason,
  CircularProgress,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { lineString, length } from '@turf/turf';
// import {
//   IParentIDOption,
// } from '5_entites/inventory/model/createObjectComponent';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { ICustomInputs, useParnentOptions } from '5_entites';
import {
  ErrorPage,
  IInventoryGeometryModel,
  IInventoryObjectModel,
  IParentIDOption,
  LoadingAvataa,
  MdEditor,
  ObjectByFilters,
  ObjectTypeGeometryType,
  useDebounceValue,
  useObjectCRUD,
  useTranslate,
} from '6_shared';
import * as SC from './Overview.styled';
import { ObjectGeometryEditor } from './objectGeometryEditor/ObjectGeometryEditor';
import { ObjectModel } from './objectModel/ObjectModel';

interface IProps {
  objectId: number | null;
  inventoryObjectData: IInventoryObjectModel | undefined;
  objectByFilters: ObjectByFilters | undefined;
  selectedObjectParentID?: number | null;
  onFileChange: (newFile: File) => void;
  file: File | null;
  onSubmit: SubmitHandler<ICustomInputs>;
  geometry: IInventoryGeometryModel | null;
  getNewObjectGeometry: (newGeometry: IInventoryGeometryModel) => void;
  isLoading: boolean;
  description: string;
  handleObjectDescription: (newDescription: string) => void;
  objectTypeGeometryType?: ObjectTypeGeometryType | null;
  tmoParentId: number | null;
  pointsConstraintByTmo: number[];
}

export const Overview = ({
  objectId,
  inventoryObjectData,
  objectByFilters,
  selectedObjectParentID,
  onFileChange,
  file,
  onSubmit,
  geometry,
  getNewObjectGeometry,
  isLoading,
  description,
  handleObjectDescription,
  objectTypeGeometryType,
  tmoParentId,
  pointsConstraintByTmo,
}: IProps) => {
  const translate = useTranslate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { handleSubmit, formState, setValue, getValues } = useFormContext();

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('  ');
  const [selectedView, setSelectedView] = useState<'description' | 'model'>('description');

  const { objectCRUDComponentUi } = useObjectCRUD();
  const { objectCRUDComponentMode } = objectCRUDComponentUi;

  const debounceSearchValue = useDebounceValue(searchQuery);

  const {
    setPointIDInputValue,
    parentABIDOptions,
    parentIDOptions,
    isObjectsByNameWithMisspelledWordsFetching,
    isObjectsByNameWithMisspelledWordsError,
    isFetchingObjectsDataByName,
    objectParentID,
    objectPointAID,
    objectPointBID,
    setObjectParentID,
    setObjectPointAID,
    setObjectPointBID,
  } = useParnentOptions({
    inventoryObjectData,
    objectByFilters,
    selectedObjectParentID,
    objectId,
    tmoParentId,
    pointsConstraintByTmo,
    debounceSearchValue,
  });

  useEffect(() => {
    setLoading(isFetchingObjectsDataByName);
  }, [isFetchingObjectsDataByName]);

  const handleParentInputValueChange = (
    e: any,
    value: string,
    reason: AutocompleteInputChangeReason,
  ) => {
    if (reason === 'input') {
      setSearchQuery(value.trim());

      if (value.trim() === '') {
        setSearchQuery('  ');
      }
    }

    if (reason === 'clear') {
      setSearchQuery('  ');
      setValue('p_id', undefined);
    }
  };

  const handleUpdateObject = () => {
    handleSubmit(onSubmit)();

    // handleSubmit((data) =>
    //   onSubmit({
    //     ...data,
    // objectParentID: objectParentID?.id ?? null,
    // objectPointAID: objectPointAID?.id ?? null,
    // objectPointBID: objectPointBID?.id ?? null,
    //   }),
    // )();
  };

  const handleParentIDchange = (
    e: React.SyntheticEvent<Element, Event>,
    value: IParentIDOption | null,
  ) => {
    setObjectParentID(value);
    setValue('p_id', value);
  };

  const handlePointAIDChange = (
    e: React.SyntheticEvent<Element, Event>,
    value: IParentIDOption | null,
  ) => {
    setObjectPointAID(value);
    setValue('point_a_id', value);
  };

  const handlePointBIDChange = (
    e: React.SyntheticEvent<Element, Event>,
    value: IParentIDOption | null,
  ) => {
    setObjectPointBID(value);
    setValue('point_b_id', value);
  };

  const onGeometryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const geojsonFile = e.target.files[0];

      const text = await geojsonFile.text();

      try {
        const geojson = JSON.parse(text);
        const polygonGeometry = geojson?.features?.[0]?.geometry;
        if (
          polygonGeometry &&
          (polygonGeometry?.type === 'Polygon' || polygonGeometry?.type === 'MultiPolygon') &&
          polygonGeometry?.coordinates
        ) {
          let pathLength = 0;
          if (polygonGeometry?.type === 'Polygon') {
            const outerRing = polygonGeometry.coordinates[0];
            const line = lineString(outerRing);
            pathLength = length(line, { units: 'meters' });
          }

          if (polygonGeometry.type === 'MultiPolygon') {
            Object.keys(polygonGeometry.coordinates).forEach((key) => {
              const polygon = polygonGeometry.coordinates[key];
              const outerRing = polygon[0];
              const line = lineString(outerRing);
              pathLength += length(line, { units: 'meters' });
            });
          }

          getNewObjectGeometry({
            path: {
              coordinates: polygonGeometry.coordinates,
              type: polygonGeometry.type,
            },
            path_length: pathLength,
          });
        }
      } catch (error) {
        console.error('Error parsing GeoJSON:', error);
      }
    }
  };

  const inventoryObjectModel = useMemo(() => {
    return inventoryObjectData?.model ?? '';
  }, [inventoryObjectData]);

  const tooltipGeometryText = useMemo(() => {
    return objectTypeGeometryType === 'polygon'
      ? 'Add polygon geometry from file'
      : `Object type geometry is: ${objectTypeGeometryType}`;
  }, [objectTypeGeometryType]);

  return (
    <SC.OverviewStyled>
      {!isLoading && isObjectsByNameWithMisspelledWordsError && (
        <ErrorPage
          error={{ message: translate('An error has occurred, please try again'), code: '404' }}
        />
      )}
      {isLoading && !isObjectsByNameWithMisspelledWordsError && (
        <SC.LoadingContainer>
          <LoadingAvataa />
        </SC.LoadingContainer>
      )}
      {!isObjectsByNameWithMisspelledWordsError && (
        <SC.OverviewContent sx={isLoading ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
          <SC.Body>
            <SC.LeftContent>
              <SC.Title>{translate('Parent')}</SC.Title>
              <SC.AutocompleteWrapper>
                <SC.AutocompleteStyled
                  onClose={() => {
                    setSearchQuery('');
                  }}
                  options={parentIDOptions}
                  value={getValues('p_id') || objectParentID}
                  getOptionLabel={(option) => option.name || ''}
                  filterOptions={(options) => options}
                  onChange={handleParentIDchange}
                  onInputChange={handleParentInputValueChange}
                  disabled={tmoParentId === null}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  loading={isObjectsByNameWithMisspelledWordsFetching}
                  renderInput={(params) => (
                    <TextField
                      label={translate('Parent ID')}
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isObjectsByNameWithMisspelledWordsFetching ? (
                              <CircularProgress color="primary" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      <Typography>{`(ID: ${option.id}): ${option.name}`}</Typography>
                    </li>
                  )}
                />
              </SC.AutocompleteWrapper>

              <SC.AutocompleteWrapper>
                <SC.AutocompleteStyled
                  options={parentABIDOptions}
                  value={getValues('point_a_id') || objectPointAID}
                  getOptionLabel={(option) => option.name || ''}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={handlePointAIDChange}
                  onInputChange={(event, value, reason) => {
                    if (reason === 'input') {
                      setPointIDInputValue(value.trim());
                    }

                    if (reason === 'clear') {
                      setPointIDInputValue('');
                      setValue('point_a_id', undefined);
                    }
                  }}
                  loading={loading}
                  renderInput={(params) => (
                    <TextField
                      label={translate('Parent A')}
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress color="primary" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      <Typography>{`(ID: ${option.id}): ${option.name}`}</Typography>
                    </li>
                  )}
                />
              </SC.AutocompleteWrapper>

              <SC.AutocompleteWrapper>
                <SC.AutocompleteStyled
                  options={parentABIDOptions}
                  value={getValues('point_b_id') || objectPointBID}
                  getOptionLabel={(option) => option.name || ''}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={handlePointBIDChange}
                  onInputChange={(event, value, reason) => {
                    if (reason === 'input') {
                      setPointIDInputValue(value.trim());
                    }

                    if (reason === 'clear') {
                      setPointIDInputValue('');
                      setValue('point_b_id', undefined);
                    }
                  }}
                  loading={loading}
                  renderInput={(params) => (
                    <TextField
                      label={translate('Parent B')}
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress color="primary" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      <Typography>{`(ID: ${option.id}): ${option.name}`}</Typography>
                    </li>
                  )}
                />
              </SC.AutocompleteWrapper>

              <ObjectGeometryEditor
                geometry={geometry}
                getNewObjectGeometry={getNewObjectGeometry}
              />

              <Tooltip title={tooltipGeometryText} placement="top">
                <Box
                  component="div"
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <IconButton
                    onClick={() => inputRef.current?.click()}
                    disabled={objectTypeGeometryType !== 'polygon'}
                  >
                    <Add />
                  </IconButton>

                  <SC.HiddenInput
                    ref={inputRef}
                    type="file"
                    onChange={onGeometryFileChange}
                    accept=".geojson"
                  />
                </Box>
              </Tooltip>
            </SC.LeftContent>

            <SC.RightContent>
              <SC.RightContentHeder>
                <ToggleButtonGroup
                  color="primary"
                  value={selectedView}
                  exclusive
                  aria-label="View selection"
                  sx={{
                    '& .MuiToggleButton-root': {
                      margin: '4px',
                      height: '20px',
                      borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                    },
                  }}
                >
                  <ToggleButton value="description" onClick={() => setSelectedView('description')}>
                    Description
                  </ToggleButton>
                  <ToggleButton value="model" onClick={() => setSelectedView('model')}>
                    Model
                  </ToggleButton>
                </ToggleButtonGroup>
              </SC.RightContentHeder>

              <SC.RightContentBody>
                {selectedView === 'description' && (
                  <MdEditor
                    markdown={description}
                    setMarkdown={handleObjectDescription}
                    customSx={{ height: 'calc(100% - 50px)' }}
                    initialHeight="100%"
                    visibleDragbar={false}
                    autoSave
                  />
                )}

                {selectedView === 'model' && (
                  <ObjectModel
                    inventoryObjectModel={inventoryObjectModel}
                    onFileChange={onFileChange}
                    file={file}
                  />
                )}
              </SC.RightContentBody>
            </SC.RightContent>
          </SC.Body>

          <SC.Footer>
            <SC.ButtonStyled
              variant="contained"
              onClick={handleUpdateObject}
              disabled={Object.keys(formState.errors).length > 0}
              sx={{ alignSelf: 'flex-end' }}
              type="submit"
            >
              {objectCRUDComponentMode === 'editing' ? translate('Save') : translate('Add')}
            </SC.ButtonStyled>
          </SC.Footer>
        </SC.OverviewContent>
      )}
    </SC.OverviewStyled>
  );
};
