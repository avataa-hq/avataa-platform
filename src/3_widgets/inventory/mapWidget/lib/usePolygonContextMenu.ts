import { useEffect, useMemo, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import {
  GetNodesByMoIdModel,
  graphApi,
  useAppNavigate,
  useDiagramsPage,
  useTranslate,
} from '6_shared';
import {
  ISelectedInventoryObject,
  MapBoxPolygonContextMenuType,
} from '6_shared/models/inventoryMapWidget/types';
import { POLYGON_CONTEXT_MENU_OPTIONS } from '6_shared/models/inventoryMapWidget/constants';
import { exportToKml } from './exportToKml';
import { exportToTab } from './exportToTab';
import { exportToExcel } from './exportToExcel';
import { MainModuleListE } from '../../../../config/mainModulesConfig';

interface IProps {
  polygonCoordinates?: GeoJSON.Position[];
  selectedObjectList?: Record<string, any>[];
  polygonMenuPosition: ISelectedInventoryObject['position'] | null;
}

export const usePolygonContextMenu = ({
  polygonCoordinates,
  selectedObjectList,
  polygonMenuPosition,
}: IProps) => {
  const { useLazyGetObjectDiagramsQuery } = graphApi.search;
  const { useGetEdgesBetweenNodesMutation } = graphApi.analysis;
  const translate = useTranslate();
  const navigate = useAppNavigate();

  const [nodeDiagrams, setNodeDiagrams] = useState<GetNodesByMoIdModel[]>([]);
  const [isObjectDiagramsFetching, setIsObjectDiagramsFetching] = useState(false);

  const { setGraphInitialData, setSelectedDiagram } = useDiagramsPage();

  const [getObjectDiagrams] = useLazyGetObjectDiagramsQuery();
  const [getEdgesBetweenNodes, { isLoading: isEdgesBetweenNodesLoading }] =
    useGetEdgesBetweenNodesMutation();

  useEffect(() => {
    if (!polygonMenuPosition) return;
    const fetchNodeDiagrams = async () => {
      if (!selectedObjectList?.length) {
        setNodeDiagrams([]);
        return {};
      }

      const output: Record<string, GetNodesByMoIdModel> = {};
      setIsObjectDiagramsFetching(true);

      // eslint-disable-next-line no-restricted-syntax
      for await (const object of selectedObjectList) {
        const diagrams = await getObjectDiagrams(object.id).unwrap();
        diagrams.forEach((diagram) => {
          if (!output[diagram.key]) {
            output[diagram.key] = { ...diagram };
          } else {
            diagram.nodes.forEach((node) => {
              if (!output[diagram.key].nodes.some((n) => n.key === node.key)) {
                output[diagram.key] = {
                  ...output[diagram.key],
                  nodes: [...output[diagram.key].nodes, node],
                };
              }
            });
          }
        });
      }
      setIsObjectDiagramsFetching(false);
      return output;
    };

    fetchNodeDiagrams().then((diagrams) => setNodeDiagrams(Object.values(diagrams)));
  }, [getObjectDiagrams, selectedObjectList, polygonMenuPosition]);

  const polygonContextMenuOptions = useMemo(() => {
    if (!isObjectDiagramsFetching && !nodeDiagrams?.length) return POLYGON_CONTEXT_MENU_OPTIONS;

    return POLYGON_CONTEXT_MENU_OPTIONS.map((option) => {
      if (option.value === 'viewDiagram') {
        return {
          ...option,
          disabled: false,
          isLoading: isObjectDiagramsFetching || isEdgesBetweenNodesLoading,
          submenu: nodeDiagrams.map((diagram) => ({
            id: diagram.key,
            label: diagram.name,
            value: diagram,
          })),
        };
      }
      return option;
    });
  }, [isObjectDiagramsFetching, isEdgesBetweenNodesLoading, nodeDiagrams]);

  const onPolygonContextMenuItemClick = async (menuItem: MapBoxPolygonContextMenuType | string) => {
    switch (menuItem) {
      case 'toKml':
        if (!polygonCoordinates) {
          enqueueSnackbar(translate('Something went wrong, please try once more'), {
            variant: 'error',
            anchorOrigin: { horizontal: 'right', vertical: 'top' },
          });
          return;
        }
        await exportToKml({ polygonCoordinates, selectedObjectList });

        break;

      case 'toTab':
        if (!polygonCoordinates) {
          enqueueSnackbar(translate('Something went wrong, please try once more'), {
            variant: 'error',
            anchorOrigin: { horizontal: 'right', vertical: 'top' },
          });
          return;
        }
        exportToTab({ polygonCoordinates, selectedObjectList });

        break;

      case 'toExcel':
        if (!polygonCoordinates) {
          enqueueSnackbar(translate('There are no polygon coordinates'), {
            variant: 'error',
            anchorOrigin: { horizontal: 'right', vertical: 'top' },
          });
          return;
        }

        try {
          await exportToExcel({ polygonCoordinates, selectedObjectList });
        } catch (error) {
          enqueueSnackbar(translate('Something went wrong, please try once more'), {
            variant: 'error',
            anchorOrigin: { horizontal: 'right', vertical: 'top' },
          });
        }

        break;

      default:
        break;
    }

    if (
      menuItem.hasOwnProperty('nodes') &&
      menuItem.hasOwnProperty('key') &&
      menuItem.hasOwnProperty('name')
    ) {
      const objectDiagram = menuItem as unknown as GetNodesByMoIdModel;

      const diagramData = await getEdgesBetweenNodes({
        graphKey: objectDiagram.key,
        nodeKeys: objectDiagram.nodes.map((node) => node.key),
      }).unwrap();

      navigate(MainModuleListE.diagrams);

      setGraphInitialData({
        nodes: objectDiagram.nodes,
        edges: diagramData.edges,
      });

      setSelectedDiagram({
        key: objectDiagram.key,
        name: objectDiagram.name,
        tmo_id: objectDiagram.nodes[0].tmo,
        status: 'Complete',
        error_description: null,
      });
    }
  };
  return { onPolygonContextMenuItemClick, polygonContextMenuOptions };
};
