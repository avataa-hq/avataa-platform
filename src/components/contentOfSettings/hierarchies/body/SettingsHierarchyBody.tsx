import { ActionTypes } from '6_shared';
import { Hierarchy } from '6_shared/api/hierarchy/types';
import { HierarchyTreeBuilder } from '../hirarchyTreeBuilder/HierarchyTreeBuilder';
import SettingsHierarchyBodyStyled from './SettingsHierarchyBody.styled';

const SettingsHierarchyBody = ({
  permissions,
  activeHierarchyMenuItem,
}: {
  permissions?: Record<ActionTypes, boolean>;
  activeHierarchyMenuItem: Hierarchy | null;
}) => (
  <SettingsHierarchyBodyStyled>
    <HierarchyTreeBuilder permissions={permissions} activeHierarchy={activeHierarchyMenuItem} />
  </SettingsHierarchyBodyStyled>
);

export default SettingsHierarchyBody;
