import { useEffect, useState } from 'react';
import { useLazyGetObjectTypesChild } from '5_entites/inventory/api';
import { InventoryObjectTypesModel } from '6_shared';

interface IProps {
  selectedNodeObjectTypeChildId: number | null;
}

export const useGetTemplateChildOptions = ({ selectedNodeObjectTypeChildId }: IProps) => {
  const [templateChildOptions, setTemplateChildOptions] = useState<InventoryObjectTypesModel[]>([]);

  const { getObjectTypesChildFn, isFetching: isGetObjectTypesChildFetching } =
    useLazyGetObjectTypesChild();

  useEffect(() => {
    if (!selectedNodeObjectTypeChildId) return;
    const getChildObjectTypes = async () => {
      const childObjectTypes = await getObjectTypesChildFn(selectedNodeObjectTypeChildId);

      if (childObjectTypes) {
        setTemplateChildOptions(childObjectTypes);
      }
    };
    getChildObjectTypes();
  }, [selectedNodeObjectTypeChildId]);

  return { templateChildOptions, isGetObjectTypesChildFetching };
};
