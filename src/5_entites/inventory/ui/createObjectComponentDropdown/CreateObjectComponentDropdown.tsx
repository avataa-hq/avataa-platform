import { useEffect, useMemo } from 'react';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { InventoryObjectTypesModel, useObjectCRUD } from '6_shared';
import { CreateObjectComponentDropdownStyled } from './CreateObjectComponentDropdown.styled';

interface IProps {
  objectTypesData: InventoryObjectTypesModel[] | undefined;
  objectTmoId: number | null;
  setObjectTmoId: (tmoId: number) => void;
  setTmoParentId: (tmoParentId: number | null) => void;
  isLineGeometry: boolean;
  isPointGeometry: boolean;
  isProcessManagerPage?: boolean;
}

export const CreateObjectComponentDropdown = ({
  objectTmoId,
  setObjectTmoId,
  setTmoParentId,
  objectTypesData,
  isLineGeometry,
  isPointGeometry,
  isProcessManagerPage = false,
}: IProps) => {
  const {
    objectCRUDComponentUi: { objectCRUDComponentMode },
    lastSelectedTmoId,
    createChildObjectId,

    setLastSelectedTmoId,
  } = useObjectCRUD();

  const { reset } = useFormContext();

  const filteredObjectTypes = useMemo(() => {
    if (!objectTypesData) return [];

    if (isLineGeometry) {
      return objectTypesData.filter((item) => item.geometry_type === 'line');
    }

    if (isPointGeometry) {
      return objectTypesData.filter((item) => item.geometry_type !== 'line');
    }

    if (isProcessManagerPage) {
      return objectTypesData.filter((item) => item.lifecycle_process_definition !== null);
    }

    return objectTypesData;
  }, [isLineGeometry, isPointGeometry, isProcessManagerPage, objectTypesData]);

  const renderObjectTypeMenuItems = () => {
    return filteredObjectTypes.map((objectType) => (
      <MenuItem value={objectType.id} key={objectType.id}>
        {objectType.name}
      </MenuItem>
    ));
  };

  const handleChange = (event: SelectChangeEvent) => {
    setObjectTmoId(+event.target.value);
    setLastSelectedTmoId(+event.target.value);
  };

  useEffect(() => {
    if (objectCRUDComponentMode !== 'creating' || createChildObjectId || !objectTypesData) return;

    const selectObjectType = (targetGeometryType: string, operator: string) => {
      const targetObjectType = objectTypesData.find((item) =>
        operator === 'eq'
          ? item.geometry_type === targetGeometryType
          : item.geometry_type !== targetGeometryType,
      );
      const lastSelectedObjectType = objectTypesData.find(
        (item) => lastSelectedTmoId && item.id === +lastSelectedTmoId,
      );

      if (
        targetObjectType &&
        (!lastSelectedObjectType ||
          (lastSelectedObjectType &&
            (operator === 'eq'
              ? lastSelectedObjectType.geometry_type !== targetGeometryType
              : lastSelectedObjectType.geometry_type === targetGeometryType)))
      ) {
        setObjectTmoId(targetObjectType.id);
        setLastSelectedTmoId(targetObjectType.id);
      }
    };

    if (isLineGeometry) {
      selectObjectType('line', 'eq');
    }

    if (isPointGeometry) {
      selectObjectType('line', 'neq');
    }

    reset();
  }, [
    isLineGeometry,
    isPointGeometry,
    objectTypesData,
    objectCRUDComponentMode,
    reset,
    createChildObjectId,
    lastSelectedTmoId,
    setObjectTmoId,
    setLastSelectedTmoId,
  ]);

  const currentValue = useMemo(() => {
    if (!objectTypesData) return '';
    const neededObject = objectTypesData.find((item) => item.id === objectTmoId);
    return neededObject ? neededObject.id.toString() : '';
  }, [objectTmoId, objectTypesData]);

  useEffect(() => {
    if (!objectTypesData) return;
    const neededObject = objectTypesData.find((item) => item.id === objectTmoId);
    if (neededObject) {
      setTmoParentId(neededObject.p_id);
    }
  }, [objectTypesData, objectTmoId, setTmoParentId]);

  return (
    <CreateObjectComponentDropdownStyled size="small">
      <Select
        sx={{ height: '37px' }}
        id="create-object-select"
        // value={objectTmoId.toString()}
        value={lastSelectedTmoId?.toString() ?? currentValue}
        onChange={handleChange}
        disabled={objectCRUDComponentMode === 'editing'}
      >
        {renderObjectTypeMenuItems()}
      </Select>
    </CreateObjectComponentDropdownStyled>
  );
};
