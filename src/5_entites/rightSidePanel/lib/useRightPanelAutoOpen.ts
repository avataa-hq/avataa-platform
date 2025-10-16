import { useEffect } from 'react';
import { IGetObjectsByFiltersModel } from '6_shared';

interface IProps {
  rightPanelAutoOpen: boolean;
  inventoryRows?: IGetObjectsByFiltersModel;
  setNewObjectId?: (id: number | null) => void;
  setIsRightPanelOpen?: (isOpen: boolean) => void;
}

export const useRightPanelAutoOpen = ({
  rightPanelAutoOpen,
  inventoryRows,
  setNewObjectId,
  setIsRightPanelOpen,
}: IProps) => {
  useEffect(() => {
    if (!inventoryRows || !rightPanelAutoOpen) {
      return () => {};
    }
    if (rightPanelAutoOpen && inventoryRows) {
      setNewObjectId?.(inventoryRows.objects[0].id);
      setIsRightPanelOpen?.(rightPanelAutoOpen);
    }

    return () => {
      setIsRightPanelOpen?.(false);
    };
  }, [inventoryRows, rightPanelAutoOpen, setIsRightPanelOpen, setNewObjectId]);

  return {};
};
