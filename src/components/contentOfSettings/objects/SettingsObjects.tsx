import { useEffect, useState } from 'react';
import { Add } from '@mui/icons-material';
import { Button, Menu, MenuItem } from '@mui/material';
import { useTheme } from '@emotion/react';
import { CustomSearch } from 'components/_reused components/myInput/CustomSearch';
import {
  Box,
  SidebarLayout,
  useRegistration,
  useTranslate,
  colorRangesApi,
  parameterTypesApi,
  objectTypesApi,
  useGetPermissions,
  useGetTemplateObjectsByObjectTypeId,
  useHierarchy,
  Modal,
  useColorsConfigure,
  useSettingsObject,
  useUser,
} from '6_shared';

import { useObjectTypesData } from '3_widgets/inventory/leftPanel/lib/useObjectTypesData';
import { TreeObjectTypes } from '5_entites';
import SettingsObjectsBody from './body/SettingsObjectsBody';
import SettingsObjectsHead from './head/SettingsObjectsHead';
import EditObjectTypeModal from './dialogBoxes/objectTypes/EditObjectTypeModal';
import DeleteObjectTypeModal from './dialogBoxes/objectTypes/DeleteObjectTypeModal';
import CreateObjectTypeModal from './dialogBoxes/objectTypes/CreateObjectTypeModal';
import ShowObjectTypeInfoModal from './dialogBoxes/objectTypes/ShowObjectTypeInfoModal';
import ShowParamTypeModal from './dialogBoxes/paramTypes/ShowParamTypeModal';
import DeleteParamTypeModal from './dialogBoxes/paramTypes/DeleteParamTypeModal';
import CreateParamTypeModal from './dialogBoxes/paramTypes/CreateParamTypeModal';
import EditParamTypeModal from './dialogBoxes/paramTypes/EditParamTypeModal';
import ForceParamTypeModal from './dialogBoxes/paramTypes/ForceParamTypeModal';
import RequaredParamTypeModal from './dialogBoxes/paramTypes/RequaredParamTypeModal';
import RequaredAndMultipleParamTypeModal from './dialogBoxes/paramTypes/RequaredAndMultipleParamTypeModal';
import { ImportTmoComponent } from './ImportTmoComponent';

const {
  useCreateColorRangesMutation,
  useDeleteColorRangesMutation,
  useFindRangesByFilterQuery,
  useGetDefaultColorRangeQuery,
  useUpdateColorRangesMutation,
} = colorRangesApi;
const { useGetObjectTypeParamTypesQuery } = parameterTypesApi;
const { useGetObjectTypesChildQuery } = objectTypesApi;

const SettingsObjects = () => {
  const translate = useTranslate();
  const theme = useTheme();
  useRegistration('settingsObject');

  const { user } = useUser();

  const [creationMenuAnchor, setCreationMenuAnchor] = useState<HTMLElement | null>(null);
  const [isOpenImportModal, setIsOpenImportModal] = useState(false);

  const permissions = useGetPermissions('settings-objects');

  const {
    objType,
    paramType,
    paramState,
    limitForColorPaleteRequst,
    elementIdToScroll,
    setIsCreateObjectModalOpen,
    setArrayOfGroupsObjects,
    setIsOpenSelectingColorModal,
    setIsOpenSettingColorModal,
    setLimitForColorPaleteRequst,
  } = useSettingsObject();

  const {
    selectedColor,
    colorValueType,
    colorPalleteName,
    newColorsArray,
    isPrivateColor,
    isDefaultColor,
    selectedColorId,
    colorSliderValues,
    setIsEditColors,
    setNewColorPallete,
    setColorSliderValues,
    setSelectedColor,
    setDefaultColor,
  } = useColorsConfigure();
  const { parentId } = useHierarchy();

  const { data: objectTypes, isFetching: isFetchingObjectTypes } =
    useGetObjectTypesChildQuery(parentId);

  const { data: paramTypesItemJSON } = useGetObjectTypeParamTypesQuery(
    { id: objType?.id ?? 0 },
    { skip: !objType?.id },
  );

  const { data: templatesObjectsData } = useGetTemplateObjectsByObjectTypeId({
    objectTypeId: objType?.id ?? 0,
    skip: !objType?.id,
  });

  const hasTemplates = Boolean(templatesObjectsData?.length);

  const { Sidebar, SidebarBody, SidebarHeader, Container } = SidebarLayout;

  const [tmoIdArray, setTmoIdArray] = useState<string[]>();
  const [tprmIdArray, setTprmIdArray] = useState<string[]>();
  const [searchValue, setSearchValue] = useState('');

  const objectTypesServerData = useObjectTypesData({
    searchValue,
  });

  useEffect(() => {
    if (objType && objType.id) {
      setTmoIdArray([objType.id.toString()]);
    }

    if (paramType && paramType.id) {
      setTprmIdArray([paramType.id.toString()]);
    }
  }, [objType, paramType]);

  const { data: colorRangesData } = useFindRangesByFilterQuery(
    {
      tmo_ids: tmoIdArray,
      tprm_ids: tprmIdArray,
      only_description: false,
      limit: limitForColorPaleteRequst,
      offset: 0,
    },
    { skip: !tmoIdArray || !tprmIdArray },
  );

  useEffect(() => {
    if (!colorRangesData) return;

    if (colorRangesData.length === limitForColorPaleteRequst) {
      setLimitForColorPaleteRequst(limitForColorPaleteRequst + limitForColorPaleteRequst);
    }
  }, [colorRangesData, limitForColorPaleteRequst]);

  const { data: defaultColor } = useGetDefaultColorRangeQuery(
    { tmo_id: objType?.id.toString(), tprm_id: paramType?.id.toString() },
    { skip: !objType || !objType.id || !paramType || !paramType.id },
  );

  useEffect(() => {
    if (defaultColor) {
      setDefaultColor(defaultColor[0]);
    }
  }, [defaultColor]);

  const [createColorRange] = useCreateColorRangesMutation();
  const [updateColorRange] = useUpdateColorRangesMutation();
  const [deleteRange] = useDeleteColorRangesMutation();

  const onCreationMenuItemClick = (type: 'create' | 'import') => {
    if (type === 'create') setIsCreateObjectModalOpen(true);
    if (type === 'import') setIsOpenImportModal(true);

    setCreationMenuAnchor(null);
  };

  // const convertTPRMTypeToPMTableType = (
  //   type:
  //     | 'str'
  //     | 'int'
  //     | 'float'
  //     | 'bool'
  //     | 'date'
  //     | 'datetime'
  //     | 'mo_link'
  //     | 'prm_link'
  //     | 'formula'
  //     | 'sequence'
  //     | 'user_link',
  // ) => {
  //   if (type === 'bool') return 'boolean';
  //   if (type === 'int' || type === 'float') return 'number';

  //   return 'string';
  // };

  const onCreateColorRange = () => {
    if (objType && objType.id && paramType && paramType.id) {
      createColorRange({
        tmoId: objType?.id.toString(),
        tprmId: paramType?.id.toString(),
        name: colorPalleteName,
        public: !isPrivateColor,
        default: isDefaultColor,
        value_type: colorValueType,
        ranges: {
          colors: newColorsArray,
          ...(paramState.type === 'int' || paramState.type === 'float'
            ? { values: colorSliderValues }
            : null),
        },
        forced_default: true,
        valType: paramState.type,
      });
      setIsOpenSettingColorModal(false);
    }
  };

  const onEditColorRange = () => {
    if (selectedColorId && selectedColor) {
      updateColorRange({
        id: selectedColorId,
        name: colorPalleteName,
        public: !isPrivateColor,
        default: isDefaultColor,
        value_type: colorValueType,
        ranges: { colors: newColorsArray, values: colorSliderValues },
        forced_default: true,
        valType: paramType?.val_type!,
      });
      setIsOpenSettingColorModal(false);
      setSelectedColor({
        id: selectedColor?.id!,
        created_by: selectedColor?.created_by!,
        created_by_sub: selectedColor?.created_by_sub!,
        tmoId: selectedColor?.tmoId!,
        tprmId: selectedColor?.tprmId!,
        name: colorPalleteName,
        public: !isPrivateColor,
        default: isDefaultColor,
        value_type: colorValueType,
        ranges: { colors: newColorsArray, values: colorSliderValues },
        valType: paramType?.val_type!,
      });
    }
  };

  const onDeleteRange = () => {
    if (selectedColorId) {
      deleteRange(selectedColorId);
    }
  };

  useEffect(() => {
    setArrayOfGroupsObjects(paramTypesItemJSON);
  }, [paramTypesItemJSON]);

  const onOpenEditColorRangesModal = () => {
    setIsEditColors(true);
    setIsOpenSelectingColorModal(true);

    setNewColorPallete(selectedColor?.ranges.colors!);
    setColorSliderValues(selectedColor?.ranges.values!);
  };

  const mockSet = {
    colors: [
      { name: 'Tier 1', id: '1', hex: '#FF0000', booleanValue: false },
      { name: 'Tier 2', id: '2', hex: '#FFCC00', booleanValue: true },
      { name: 'Tier 3', id: '3', hex: '#66CC33', booleanValue: false },
    ],
    values: [20, 80],
  };

  const onOpenCreateColorRangesModal = () => {
    if (paramState.type === 'bool') {
      const newColors = [...mockSet.colors];
      newColors.pop();
      setNewColorPallete(newColors);
    } else {
      const newColors = mockSet.colors.map(({ booleanValue, ...rest }) => rest);
      setNewColorPallete(newColors);
    }

    setColorSliderValues(mockSet.values);
    setIsEditColors(false);
    setIsOpenSelectingColorModal(true);
  };

  const onSearchValueChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setSearchValue(event.target.value);
  };
  return (
    <SidebarLayout>
      <Sidebar background={theme.palette.neutral.surfaceContainerLow} collapsible>
        <SidebarHeader>
          <Box marginTop="0.5rem" display="flex" alignItems="center" gap="5%">
            <CustomSearch
              IconPosition="right"
              placeHolderText={translate('Search')}
              value={searchValue}
              setSearchValue={setSearchValue}
              onChange={(event) => onSearchValueChange(event)}
              searchedValue={searchValue}
              objectTypes={objectTypes}
              isFetchingObjectTypes={isFetchingObjectTypes}
              anchor="object"
              scrollElementId={elementIdToScroll}
            />
            <Button
              variant="contained.icon"
              data-testid="left-panel__add-object-btn"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                setCreationMenuAnchor(event.currentTarget);
              }}
              disabled={!(permissions?.update ?? true)}
              style={{
                backgroundColor: !(permissions?.update ?? true) ? theme.palette.text.disabled : '',
              }}
            >
              <Add />
            </Button>
          </Box>
        </SidebarHeader>

        <SidebarBody>
          <TreeObjectTypes
            {...objectTypesServerData}
            permissions={permissions}
            favorites={[]}
            showParents
            showFavorite={false}
            anchor="object"
            isObjectSettings
          />
        </SidebarBody>

        <ShowObjectTypeInfoModal />
        <CreateObjectTypeModal />
        <EditObjectTypeModal />
        <DeleteObjectTypeModal hasTemplates={hasTemplates} />

        <ShowParamTypeModal />
        <CreateParamTypeModal />
        <EditParamTypeModal
          colorRangesData={colorRangesData}
          username={user?.name}
          onOpenEditColorRangesModal={onOpenEditColorRangesModal}
          onOpenCreateColorRangesModal={onOpenCreateColorRangesModal}
          onCreateColorRange={onCreateColorRange}
          onEditColorRange={onEditColorRange}
          onDeleteRange={onDeleteRange}
        />
        <DeleteParamTypeModal />
        <ForceParamTypeModal />
        <RequaredParamTypeModal />
        <RequaredAndMultipleParamTypeModal />
      </Sidebar>

      {objType?.id && paramTypesItemJSON && (
        <Container>
          <SettingsObjectsHead permissions={permissions} />
          <SettingsObjectsBody paramTypesItemJSON={paramTypesItemJSON} permissions={permissions} />
        </Container>
      )}

      <Menu
        anchorEl={creationMenuAnchor}
        open={!!creationMenuAnchor}
        onClose={() => setCreationMenuAnchor(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => onCreationMenuItemClick('create')}>Create</MenuItem>
        <MenuItem onClick={() => onCreationMenuItemClick('import')}>Import</MenuItem>
      </Menu>

      <Modal minWidth="600px" open={isOpenImportModal} onClose={() => setIsOpenImportModal(false)}>
        <ImportTmoComponent onSuccess={() => setIsOpenImportModal(false)} />
      </Modal>
    </SidebarLayout>
  );
};

export default SettingsObjects;
