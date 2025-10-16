import { MutableRefObject, memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import {
  ErrorPage,
  IInventoryObjectModel,
  LoadingAvataa,
  NodeByMoIdModel,
  useTranslate,
  ActionTypes,
  SquashLevel,
  ILatitudeLongitude,
  GraphData,
  ITab,
  Graph3000Data,
} from '6_shared';
import { IFindPathData, INodeByMoIdKeys, IRoute } from '5_entites';
import { IMuiIconsType } from 'components/MUIIconLibrary/MUIIconLibrary';
import { Graph } from '@antv/g6';
import { useTraceData } from '../hooks';
import { formatDistance } from '../lib';
import * as SC from './Trace.styled';
import { TraceTableModal } from './traceTable';
import { TraceGraph } from './TraceGraph';

interface IProps {
  objectId: number | null;
  isTraceTableModalOpen: boolean;
  handleTraceTableModal: () => void;
  graphRef: MutableRefObject<Graph | null>;
  setIsTraceButtonsDisabled: (value: boolean) => void;
  setSelectedTraceObject?: (object: IInventoryObjectModel | null) => void;
  isRightPanelOpen?: boolean;
  traceRouteValue?: IRoute | null;
  setTraceRouteValue?: (value: IRoute | null) => void;
  setIsFindPathOpen?: (value: boolean) => void;
  isFindPathOpen?: boolean;
  findPathData?: IFindPathData | null;
  traceNodesByMoIdKeysValue?: INodeByMoIdKeys | null;
  setTraceNodesByMoIdKeysValue?: (value: INodeByMoIdKeys | null) => void;
  selectedTab?: string;
  activeTabs?: string[];
  setMapData?: (data: Record<string, any>[]) => void;
  setSelectedObjectList?: (data: Record<string, any>[]) => void;
  setTempCoordinates?: (
    data: (ILatitudeLongitude & { zoom?: number; speed?: number }) | null,
  ) => void;
  addTab?: (value: ITab) => void;
  setSelectedDiagram?: (data: GraphData | null) => void;
  setGraphInitialData?: (data: Graph3000Data | null) => void;
  setIsLoadingDiagram?: (value: boolean) => void;
  permissions?: Record<ActionTypes, boolean>;
}

export const Trace = memo(
  ({
    objectId,
    isTraceTableModalOpen,
    handleTraceTableModal,
    graphRef,
    setIsTraceButtonsDisabled,
    setSelectedTraceObject,
    isRightPanelOpen,
    setTraceRouteValue,
    traceRouteValue,
    setIsFindPathOpen,
    isFindPathOpen,
    findPathData,
    traceNodesByMoIdKeysValue,
    setTraceNodesByMoIdKeysValue,
    selectedTab,
    activeTabs,
    setMapData,
    setSelectedObjectList,
    setTempCoordinates,
    setSelectedDiagram,
    setGraphInitialData,
    setIsLoadingDiagram,
    addTab,
    permissions,
  }: IProps) => {
    const translate = useTranslate();

    const [squashLevel, setSquashLevel] = useState<SquashLevel>('Local');
    const [showOnMapObjects, setShowOnMapObjects] = useState<Record<string, any>[]>([]);

    const squashLevels: SquashLevel[] = ['Full', 'Local', 'None', 'Graph', 'Straight'];

    const {
      nodesByMoIdData,
      pathData,
      nodesByMoIdKeys,
      routes,
      tmoData,
      totalPathLength,
      isFetching,
      isError,
      refetch,
      setNewPathData,
    } = useTraceData({
      objectId,
      squashLevel,
      setTraceRouteValue,
      isFindPathOpen,
      findPathData,
      traceNodesByMoIdKeysValue,
      setTraceNodesByMoIdKeysValue,
      traceRouteValue,
    });

    const isTraceButtonsDisabled = useMemo(() => {
      const shouldBeDisabled = !pathData || pathData.nodes.length === 0;
      return shouldBeDisabled;
    }, [pathData]);

    useEffect(() => {
      setIsTraceButtonsDisabled(!pathData || pathData.nodes.length === 0);
    }, [pathData, setIsTraceButtonsDisabled]);

    useEffect(() => {
      if (!pathData) return;

      if (Object.keys(tmoData).length !== 0) {
        const getShowOnMapObjects = pathData.nodes.map((node) => {
          const isValidIcon = (newIcon: string | null) => {
            if (newIcon && newIcon in Icons) {
              return newIcon;
            }
            return null;
          };

          return {
            ...node.data,
            icon: isValidIcon(tmoData[node.tmo]?.icon),
            tmoName: tmoData[node.tmo]?.name,
            visible: true,
          };
        });

        setShowOnMapObjects(getShowOnMapObjects);
      }
    }, [pathData, setShowOnMapObjects, tmoData]);

    useEffect(() => {
      if (!isRightPanelOpen) {
        setSelectedTraceObject?.(null);
      }
    }, [isRightPanelOpen, setSelectedTraceObject]);

    const onShowOnMapClick = () => {
      setMapData?.([]);

      setSelectedTraceObject?.(null);

      if (selectedTab !== 'map') addTab?.({ value: 'map' });
      setIsFindPathOpen?.(false);
      const objectWithLatLng = showOnMapObjects.find((obj) => obj.latitude && obj.longitude);
      const newShowOnMapObjects = showOnMapObjects.map((item) => ({
        ...item,
        parameters: item?.params,
      }));

      setMapData?.(newShowOnMapObjects);

      setTimeout(() => {
        setSelectedObjectList?.(newShowOnMapObjects);
        setTempCoordinates?.({
          latitude: objectWithLatLng?.latitude,
          longitude: objectWithLatLng?.longitude,
          zoom: 14,
          speed: 3.5,
        });
      }, 500);
    };

    const onOpenDiagramClick = async () => {
      if (!pathData) return;
      setGraphInitialData?.(null);
      setSelectedDiagram?.(null);

      addTab?.({ value: 'diagrams' });
      setIsFindPathOpen?.(false);
      setIsLoadingDiagram?.(true);

      const getTimeout = () => {
        if (!activeTabs?.includes('diagrams')) return 7000;
        if (selectedTab !== 'diagrams') return 3000;
        return 0;
      };

      const timeout = getTimeout();
      setTimeout(() => {
        if (nodesByMoIdData) {
          setGraphInitialData?.({
            nodes: pathData.nodes,
            edges: pathData.edges,
            commutation: [],
            tmo: pathData.tmo,
          });

          setSelectedDiagram?.({
            key: nodesByMoIdData[0]?.key || traceNodesByMoIdKeysValue?.database_key || '',
            name: nodesByMoIdData[0]?.name || traceNodesByMoIdKeysValue?.database_name || '',
            tmo_id: nodesByMoIdData[0]?.nodes[0]?.tmo || traceNodesByMoIdKeysValue?.tmo || 0,
            status: 'Complete',
            error_description: null,
          });
          setIsLoadingDiagram?.(false);
        }
      }, timeout);
    };

    const onNodeClick = useCallback(
      (node: NodeByMoIdModel) => {
        if (!node?.data) return;

        const newNodeData = {
          ...node.data,
          icon: tmoData[node.tmo]?.icon as IMuiIconsType,
        } as IInventoryObjectModel;

        if (node.data.geometry) {
          const newGeometry = {
            path: {
              type: node.data.geometry.path.type,
              coordinates: node.data.geometry.path.coordinates,
            },
            path_length: node.data.geometry.path_length,
          };
          newNodeData.geometry = { ...newGeometry };
        }
        setSelectedTraceObject?.(newNodeData);

        if (!pathData) return;
        const selectedIndex = pathData.nodes.findIndex((item) => item.key === node.key);
        if (selectedIndex !== -1) {
          const traceNodes = pathData.nodes.slice(selectedIndex);

          setSelectedDiagram?.({
            key: traceNodesByMoIdKeysValue?.database_key ?? '',
            name: traceNodesByMoIdKeysValue?.database_name ?? '',
            tmo_id: 0,
            status: 'Complete',
            error_description: null,
          });
          setGraphInitialData?.({ nodes: [traceNodes[0]] });
        }
      },
      [
        tmoData,
        setSelectedTraceObject,
        pathData,
        setSelectedDiagram,
        traceNodesByMoIdKeysValue?.database_key,
        traceNodesByMoIdKeysValue?.database_name,
        setGraphInitialData,
      ],
    );

    const handleSquashLevelChange = (event: SelectChangeEvent) => {
      setSquashLevel(event.target.value as SquashLevel);
    };

    return (
      <SC.TraceStyled>
        <SC.TraceHeader>
          <Autocomplete
            value={traceNodesByMoIdKeysValue}
            options={nodesByMoIdKeys}
            getOptionLabel={(option) => `${option.database_name}: ${option.name}`}
            renderInput={(params) => <TextField {...params} label={translate('Select table')} />}
            isOptionEqualToValue={(option, value) => option.database_key === value.database_key}
            onChange={(e, val) => {
              setTraceNodesByMoIdKeysValue?.(val);
            }}
            sx={{ width: '100%' }}
          />

          <Autocomplete
            value={traceRouteValue}
            options={routes}
            getOptionLabel={(option) => option.route}
            renderInput={(params) => <TextField {...params} label={translate('Select path')} />}
            isOptionEqualToValue={(option, value) => option.route === value.route}
            onChange={(e, val) => {
              setTraceRouteValue?.(val);
              if (findPathData && val) {
                setNewPathData(findPathData[val.route].pathData);
              }
            }}
            sx={{ width: '100%' }}
          />
        </SC.TraceHeader>
        <SC.TraceBody
          sx={!pathData || squashLevel === 'Graph' ? { justifyContent: 'center' } : undefined}
        >
          {isFetching && !isError && (
            <SC.LoadingContainer>
              <LoadingAvataa />
            </SC.LoadingContainer>
          )}
          {!isFetching && isError && (
            <ErrorPage
              error={{ message: translate('An error has occurred, please try again'), code: '404' }}
              refreshFn={refetch}
            />
          )}
          {!isFetching && !isError && !pathData && (
            <Typography>{translate('No trace data')}</Typography>
          )}
          {!isFetching && !isError && pathData && squashLevel !== 'Graph' && (
            <TraceGraph pathData={pathData} graphRef={graphRef} onNodeClick={onNodeClick} />
          )}
          {!isFetching && !isError && squashLevel === 'Graph' && (
            <Typography>{translate('Please, open the diagrams to see the graph')}</Typography>
          )}
        </SC.TraceBody>

        <SC.TraceFooter>
          {totalPathLength !== 0 && (
            <Typography variant="subtitle1">{`Total Path Length ${formatDistance(
              totalPathLength,
            )}`}</Typography>
          )}
          <SC.ButtonsWrapper>
            <SC.ButtonStyled
              variant="contained"
              onClick={onOpenDiagramClick}
              disabled={isTraceButtonsDisabled || !(permissions?.view ?? true)}
            >
              {translate('Open diagrams')}
            </SC.ButtonStyled>
            <SC.ButtonStyled
              variant="contained"
              onClick={onShowOnMapClick}
              disabled={isTraceButtonsDisabled || !(permissions?.view ?? true)}
            >
              {translate('Show on map')}
            </SC.ButtonStyled>
          </SC.ButtonsWrapper>
          <FormControl fullWidth>
            <InputLabel id="select-label">{translate('Squash level')}</InputLabel>
            <Select
              labelId="select-label"
              value={squashLevel}
              label={translate('Squash level')}
              onChange={handleSquashLevelChange}
              disabled={isTraceButtonsDisabled || !(permissions?.view ?? true)}
              sx={{ height: '38px' }}
            >
              {squashLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {translate(level)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </SC.TraceFooter>

        {isTraceTableModalOpen && (
          <TraceTableModal
            isOpen={isTraceTableModalOpen}
            onClose={handleTraceTableModal}
            pathData={pathData}
            loading={isFetching}
            traceRouteValue={traceRouteValue}
          />
        )}
      </SC.TraceStyled>
    );
  },
);
