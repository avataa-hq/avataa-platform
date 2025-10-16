import {
  getCenterFromCoordinates,
  IInventorySearchObjectModel,
  ILatitudeLongitude,
  IInventoryObjectModel,
  useInventoryMapWidget,
} from '6_shared';
import { useAppDispatch } from 'hooks/reduxHooks';
import { useGetObjectTypeById } from '5_entites';
import { IMuiIconsType } from '../../../../../components/MUIIconLibrary/MUIIconLibrary';

const getPositionToFly = (
  coords: number[] | null,
  object?: IInventorySearchObjectModel,
): ILatitudeLongitude | null => {
  if (coords && coords.length > 1) {
    return { latitude: coords[1], longitude: coords[0] };
  }

  if (object && object.latitude && object.longitude) {
    return { latitude: object.longitude, longitude: object.longitude };
  }

  if (object && object.geometry && Object.keys(object.geometry).length) {
    const { coordinates, type } = object.geometry.path;
    const center = getCenterFromCoordinates({
      type: 'Feature',
      geometry: { type, coordinates },
      properties: null,
    });
    if (center) return { latitude: center.latitude, longitude: center.longitude };
  }
  return null;
};

interface IProps {
  mapData?: Record<string, any>[];
  editMode?: boolean;
  setIsRightPanelOpen?: (isOpen: boolean) => void;
}

export const useSearch = ({ mapData, editMode, setIsRightPanelOpen }: IProps) => {
  const dispatch = useAppDispatch();
  const { setMarkerPosition, setSelectedObject, setTempCoordinates, setMapData } =
    useInventoryMapWidget();

  const { getObjectTypeById } = useGetObjectTypeById({});

  return async (coords: number[] | null, foundObject?: IInventorySearchObjectModel) => {
    setSelectedObject(null);
    if (foundObject) {
      const { data } = await getObjectTypeById(foundObject.tmo_id);

      const newSelectedInventoryObject = {
        ...foundObject,
        icon: (data?.icon as IMuiIconsType) ?? null,
        line_type: data?.line_type ?? null,
      } as unknown as IInventoryObjectModel;

      const positionToFly = getPositionToFly(coords, foundObject);

      if (positionToFly) {
        setIsRightPanelOpen?.(!!newSelectedInventoryObject && !editMode);

        setSelectedObject({ position: { ...positionToFly }, object: newSelectedInventoryObject });
        setTempCoordinates({ ...positionToFly, zoom: 15, speed: 3.5 });

        setMapData([newSelectedInventoryObject]);
      }
    } else if (coords && coords.length > 1) {
      setTempCoordinates({ latitude: coords[1], longitude: coords[0], zoom: 15, speed: 3.5 });
      setMarkerPosition({ latitude: coords[1], longitude: coords[0] });
    }
  };
};
