import { Delete, Edit, Info } from '@mui/icons-material';
import {
  InventoryParameterTypesModel,
  ActionTypes,
  useTranslate,
  useSettingsObject,
} from '6_shared';
import {
  ObjectParametersStyled,
  Header,
  HeaderParameterTypeIcon,
  HeaderParameterTypeName,
  ParamTypesTable,
  ParamTypeRow,
  RowName,
  RowIconInfo,
  RowIconEdit,
  RowIconDelete,
  RowIconContainer,
} from './ObjectParameters.styled';

interface IObjectParametersProps {
  paramTypesItemJSON: InventoryParameterTypesModel[];
  permissions?: Record<ActionTypes, boolean>;
}

const ObjectParameters = ({ paramTypesItemJSON, permissions }: IObjectParametersProps) => {
  const translate = useTranslate();

  const {
    nameOfSelectedGroup,
    setIsDeleteParamModalOpen,
    setIsEditParamModalOpen,
    setIsShowParamModalOpen,
    setParamType,
    setParamTypeDataAtTheStartEditing,
  } = useSettingsObject();

  const onInfoClick = (item: InventoryParameterTypesModel) => {
    setParamType(item);
    setIsShowParamModalOpen(true);
  };

  const onEditClick = (item: InventoryParameterTypesModel) => {
    setParamType(item);
    setIsEditParamModalOpen(true);
    setParamTypeDataAtTheStartEditing(item);
  };

  const onDeleteClick = (item: InventoryParameterTypesModel) => {
    setIsDeleteParamModalOpen(true);
    setParamType(item);
  };

  return (
    <ObjectParametersStyled>
      <Header>
        <HeaderParameterTypeName>{translate('Parameter type')}</HeaderParameterTypeName>
        <HeaderParameterTypeIcon>{translate('Information')}</HeaderParameterTypeIcon>
        <HeaderParameterTypeIcon>{translate('Edit')}</HeaderParameterTypeIcon>
        <HeaderParameterTypeIcon>{translate('Delete')}</HeaderParameterTypeIcon>
      </Header>

      <ParamTypesTable>
        {paramTypesItemJSON?.map(
          (item: InventoryParameterTypesModel) =>
            (item.group === nameOfSelectedGroup ||
              (!item.group && nameOfSelectedGroup === 'No group')) && (
              <ParamTypeRow key={item.id}>
                <RowName>{item.name}</RowName>
                <RowIconContainer>
                  <RowIconInfo
                    permissionsView={!!permissions?.view}
                    onClick={() => onInfoClick(item)}
                    disabled={!(permissions?.view ?? true)}
                  >
                    <Info />
                  </RowIconInfo>
                </RowIconContainer>
                <RowIconContainer>
                  <RowIconEdit
                    permissionsUpdate={!!permissions?.update}
                    onClick={() => onEditClick(item)}
                    disabled={!(permissions?.update ?? true)}
                  >
                    <Edit />
                  </RowIconEdit>
                </RowIconContainer>
                <RowIconContainer>
                  <RowIconDelete
                    permissionsUpdate={!!permissions?.update}
                    onClick={() => onDeleteClick(item)}
                    disabled={!(permissions?.update ?? true)}
                  >
                    <Delete />
                  </RowIconDelete>
                </RowIconContainer>
              </ParamTypeRow>
            ),
        )}
      </ParamTypesTable>
    </ObjectParametersStyled>
  );
};

export default ObjectParameters;
