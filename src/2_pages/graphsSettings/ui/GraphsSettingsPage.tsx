import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@emotion/react';
import { Box, Button, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { AddRounded, DeleteRounded, EditRounded, FiberManualRecord } from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';

import {
  SearchInput,
  SidebarLayout,
  getErrorMessage,
  graphApi,
  useGetPermissions,
  useGraphSettingsPage,
} from '6_shared';
import { ItemTreeList } from '6_shared/ui/itemTreeList';
import { GraphData, GraphTmoNode } from '6_shared/api/graph/types';
import {
  ConfigGraph,
  ConfigGraphProps,
  IEdgeContextMenuListData,
  addLevelToNodes,
  invertEdgesDirection,
} from '5_entites';
import { CreateGraphModal, DeleteGraphModal, EditGraphDataModal, NodeOptionsModal } from './modals';
import { StatusDotComponent } from './StatusDotComponent';

const { useGetGraphsQuery } = graphApi.initialisation;
const { useUpdateTmoGraphMutation, useGetTmoGraphQuery } = graphApi.tmo;

const getTmoIdbyTprmId = (tprmId: number, nodes: GraphTmoNode[]) => {
  const node = nodes.find((n) => n.params.some((param) => param.id === tprmId));
  if (!node) return undefined;
  return node.id;
};

const GraphsSettingsPage = () => {
  const theme = useTheme();
  const permissions = useGetPermissions('settings-graphs');

  const {
    displayedGraph,
    setCreateGraphModalOpen,
    setDeleteGraphModalOpen,
    setDisplayedGraph,
    setEditGraphDataModalOpen,
    setNodeOptionsModalOpen,
    setSelectedGraph,
    setSelectedNode,
  } = useGraphSettingsPage();

  const { data: graphs } = useGetGraphsQuery();
  const [searchResult, setSearchResult] = useState(graphs);

  const [updateTmoGraph] = useUpdateTmoGraphMutation();
  const { data, refetch } = useGetTmoGraphQuery(displayedGraph?.key ?? '', {
    skip: !displayedGraph,
  });

  const nodesWithLevelAndId = useMemo(
    () =>
      addLevelToNodes(data?.nodes ?? [], data?.edges ?? [])
        .map(({ icon, ...node }) => ({
          ...node,
          id: node.key,
        }))
        .sort((a, b) => (a.level ?? 0) - (b.level ?? 0)) ?? [],
    [data?.edges, data?.nodes],
  );

  const invertedEdgesWithId = useMemo(
    () => invertEdgesDirection(data?.edges ?? []).map((edge) => ({ ...edge, id: edge.key })) ?? [],
    [data?.edges],
  );

  const { Container, Sidebar, SidebarHeader, SidebarBody } = SidebarLayout;

  useEffect(() => {
    if (!graphs?.length || displayedGraph) return;
    setDisplayedGraph(graphs[0]);
  }, [graphs, displayedGraph]);

  const getItemActions = (item: GraphData) => (
    <>
      <IconButton
        style={{ padding: 0 }}
        onClick={() => {
          setSelectedGraph(item);
          setEditGraphDataModalOpen(true);
        }}
        data-testid={item?.name?.startsWith('at_') ? `${item.name}_edit-btn` : undefined}
        disabled={!(permissions?.update ?? true)}
      >
        <EditRounded />
      </IconButton>
      <IconButton
        style={{ padding: 0 }}
        onClick={() => {
          setSelectedGraph(item);
          setDeleteGraphModalOpen(true);
        }}
        data-testid={item?.name?.startsWith('at_') ? `${item.name}_delete-btn` : undefined}
        disabled={!(permissions?.update ?? true)}
      >
        <DeleteRounded />
      </IconButton>
    </>
  );

  const handleSetRootClick = useCallback<ConfigGraphProps['onSetRootClick']>(
    async (target, node) => {
      try {
        if (!displayedGraph) throw new Error('No graph selected');

        let requestBody = {};

        if (node.is_grouped) {
          const tprmId = (node.params as GraphTmoNode['params']).length
            ? (node.params as GraphTmoNode['params'])[0].id
            : 0;
          const tmoId = getTmoIdbyTprmId(tprmId, data?.nodes ?? []);

          if (!tmoId) throw new Error('No tmo id found for tprm id');

          requestBody = {
            start_from_tmo_id: tmoId,
            start_from_tprm_id: tprmId,
          };
        } else {
          requestBody = {
            start_from_tmo_id: Number.parseInt(node.id, 10),
          };
        }

        await updateTmoGraph({
          graphKey: displayedGraph?.key,
          body: requestBody,
        }).unwrap();
        enqueueSnackbar('Root node updated', { variant: 'success' });
      } catch (error) {
        console.error(error);
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
      }
    },
    [data?.nodes, displayedGraph, updateTmoGraph],
  );

  const handleToggleNodeClick = useCallback<ConfigGraphProps['onToggleNodeClick']>(
    async (target, node) => {
      try {
        if (!displayedGraph) throw new Error('No graph selected');
        await updateTmoGraph({
          graphKey: displayedGraph?.key,
          body: {
            nodes: [
              {
                key: node.key as string,
                enabled: !node.enabled,
              },
            ],
          },
        }).unwrap();
        enqueueSnackbar('Success', { variant: 'success' });
      } catch (error) {
        console.error(error);
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
      }
    },
    [displayedGraph, updateTmoGraph],
  );

  const handleNodeOptionsClick = useCallback<ConfigGraphProps['onNodeOptionsClick']>(
    (target, node) => {
      setSelectedNode(node);
      setNodeOptionsModalOpen(true);
    },
    [],
  );

  const handleToggleEdgeClick = useCallback<ConfigGraphProps['onToggleEdgeClick']>(
    async (target, node) => {
      try {
        if (!displayedGraph) throw new Error('No graph selected');

        const edgeFromItem = target.getAttribute('data-item');
        if (edgeFromItem) {
          const edgeToChangeItem = JSON.parse(edgeFromItem) as IEdgeContextMenuListData | undefined;
          if (edgeToChangeItem) {
            await updateTmoGraph({
              graphKey: displayedGraph?.key,
              body: {
                edges: [
                  {
                    key: edgeToChangeItem.key,
                    enabled: !edgeToChangeItem.enabled,
                  },
                ],
              },
            }).unwrap();
          }
        }

        enqueueSnackbar('Success', { variant: 'success' });
      } catch (error) {
        console.error(error);
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
      }
    },
    [displayedGraph, updateTmoGraph],
  );

  const rootNodeKey = useMemo(() => {
    if (!data?.start_from_tmo_id) return '';

    if (data.start_from_tprm_id) return `${data.start_from_tmo_id}_${data.start_from_tprm_id}`;

    return data.start_from_tmo_id.toString();
  }, [data?.start_from_tmo_id, data?.start_from_tprm_id]);

  const getItemEndAdornment = useCallback((item: GraphData) => {
    switch (item.status) {
      case 'New':
      case 'Complete':
      case 'Error':
        return <StatusDotComponent status={item.status} />;
      case 'In Process':
        return (
          <Tooltip title={item.status}>
            <CircularProgress size={15} />
          </Tooltip>
        );
      default:
        return <FiberManualRecord sx={{ width: '15px' }} color="info" />;
    }
  }, []);

  const onItemClick = (e: MouseEvent<HTMLDivElement>, item: GraphData) => {
    setDisplayedGraph(item);

    // It needs for beckend testing
    if (e.shiftKey) refetch();
  };

  return (
    <SidebarLayout>
      <Sidebar collapsible>
        <SidebarHeader>
          <Box component="div" display="flex" gap="5px" alignItems="center">
            <SearchInput
              data={graphs}
              searchedProperty="name"
              onChange={(value) => setSearchResult(value)}
            />
            <Button
              data-testid="add-graph-button"
              variant="contained.icon"
              onClick={() => setCreateGraphModalOpen(true)}
              disabled={!(permissions?.update ?? true)}
              style={{
                backgroundColor: !(permissions?.update ?? true) ? theme.palette.text.disabled : '',
              }}
            >
              <AddRounded />
            </Button>
          </Box>
        </SidebarHeader>
        <SidebarBody>
          <ItemTreeList
            items={searchResult ?? []}
            getItemActions={getItemActions}
            onItemClick={(e, item) => onItemClick(e, item)}
            activeItem={displayedGraph}
            getItemId={(item) => item.key}
            getItemEndAdornment={getItemEndAdornment}
          />
        </SidebarBody>
      </Sidebar>
      <Container>
        <ConfigGraph
          data={{
            nodes: nodesWithLevelAndId,
            edges: invertedEdgesWithId,
          }}
          rootNodeKey={rootNodeKey}
          onSetRootClick={handleSetRootClick}
          onToggleNodeClick={handleToggleNodeClick}
          onNodeOptionsClick={handleNodeOptionsClick}
          onToggleEdgeClick={handleToggleEdgeClick}
          permissions={permissions}
        />
      </Container>
      <CreateGraphModal />
      <DeleteGraphModal />
      <EditGraphDataModal />
      <NodeOptionsModal />
    </SidebarLayout>
  );
};
export default GraphsSettingsPage;
