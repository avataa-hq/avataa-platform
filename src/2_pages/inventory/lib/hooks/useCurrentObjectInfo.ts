import { useEffect, useState } from 'react';
import { GridRowSelectionModel } from '@mui/x-data-grid-premium';

interface IProps {
  isOpenAssociatedTableModal: boolean;
  mainTableRightClickedObjectId: number | null;
  mainTableTmo?: number;
  mainTableSelectedObjects: GridRowSelectionModel;
  associatedTableRightClickedObjectId: number | null;
  associatedTableTmo: number | null;
  associatedTableSelectedObjects: GridRowSelectionModel;
}

export const useCurrentObjectInfo = ({
  isOpenAssociatedTableModal,
  mainTableRightClickedObjectId,
  mainTableTmo,
  mainTableSelectedObjects,
  associatedTableRightClickedObjectId,
  associatedTableTmo,
  associatedTableSelectedObjects,
}: IProps) => {
  const [currentObjectId, setCurrentObjectId] = useState<number | null>(null);
  const [currentObjectTmo, setCurrentObjectTmo] = useState<number | undefined>(undefined);
  const [currentSelectedObjects, setCurrentSelectedObjects] = useState<number[]>([]);

  const selectedObjectIdsToNumber = (ids: GridRowSelectionModel) => ids.map((id) => +id);

  useEffect(() => {
    if (!isOpenAssociatedTableModal) {
      setCurrentObjectId(mainTableRightClickedObjectId);
      setCurrentObjectTmo(mainTableTmo);
      setCurrentSelectedObjects(selectedObjectIdsToNumber(mainTableSelectedObjects));
    } else {
      setCurrentObjectId(associatedTableRightClickedObjectId);
      setCurrentObjectTmo(associatedTableTmo!);
      setCurrentSelectedObjects(selectedObjectIdsToNumber(associatedTableSelectedObjects));
    }
  }, [
    associatedTableRightClickedObjectId,
    associatedTableSelectedObjects,
    associatedTableTmo,
    isOpenAssociatedTableModal,
    mainTableRightClickedObjectId,
    mainTableSelectedObjects,
    mainTableTmo,
  ]);

  return {
    currentObjectId,
    currentObjectTmo,
    currentSelectedObjects,
  };
};
