import { InventoryParameterTypesModel, ActionTypes } from '6_shared';

import ObjectGroups from './groups/ObjectGroups';
import ObjectParameters from './parameters/ObjectParameters';
import SettingsObjectsBodyStyled from './SettingsObjectsBody.styled';

interface ISettingsObjectsBodyProps {
  paramTypesItemJSON: InventoryParameterTypesModel[];
  permissions?: Record<ActionTypes, boolean>;
}

const SettingsObjectsBody = ({ paramTypesItemJSON, permissions }: ISettingsObjectsBodyProps) => (
  <SettingsObjectsBodyStyled>
    <ObjectGroups />
    <ObjectParameters paramTypesItemJSON={paramTypesItemJSON} permissions={permissions} />
  </SettingsObjectsBodyStyled>
);

export default SettingsObjectsBody;
