import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';
import { DataflowDiagramProps } from '5_entites/dataflowDiagram/ui';
import { DataflowDiagramNode, Link, patchObject, PopulatedLink } from '6_shared';
import {
  getLinksWithUpdatedNodeId,
  getNodesWithNewLinks,
  getNodesWithUpdatedNode,
} from '6_shared/lib/dataflowDiagram';

interface State {
  newLinkPromise: {
    value: PopulatedLink<DataflowDiagramNode>;
    resolve: Parameters<NonNullable<DataflowDiagramProps['onNewLink']>>[1];
    reject: Parameters<NonNullable<DataflowDiagramProps['onNewLink']>>[2];
  } | null;
  newNodePromise: {
    value: DataflowDiagramNode;
    resolve: Parameters<NonNullable<DataflowDiagramProps['onNewNode']>>[1];
    reject: Parameters<NonNullable<DataflowDiagramProps['onNewNode']>>[2];
  } | null;
  selectedNode: DataflowDiagramNode | null;

  pipelineId: number | null;
  pipelineName: string | null;
  pipelineTags: string[];
  pipelineSchedule?: string;
  isDiagramChanged: boolean;
  isLoading: boolean;
  nodes: DataflowDiagramNode[];
  links: Link[];
}

const initialState: State = {
  newLinkPromise: null,
  newNodePromise: null,
  selectedNode: null,

  pipelineId: null,
  pipelineName: null,
  pipelineTags: [],
  isDiagramChanged: false,
  isLoading: false,
  nodes: [],
  links: [],
};

const dataflowDiagramSlice = createSlice({
  name: 'dataflowDiagram',
  initialState,
  reducers: {
    // Reducer for restoring slice state
    restore: (_, action: PayloadAction<State>) => action.payload,
    // Link creation reducers
    setNewLinkPromise: (state, { payload }: PayloadAction<State['newLinkPromise']>) => {
      state.newLinkPromise = payload;
    },
    setNewNodePromise: (state, { payload }: PayloadAction<State['newNodePromise']>) => {
      state.newNodePromise = payload;
    },
    setSelectedNode: (state, { payload }: PayloadAction<State['selectedNode']>) => {
      state.selectedNode = payload;
    },
    setPipelineId: (state, { payload }: PayloadAction<State['pipelineId']>) => {
      state.pipelineId = payload;
    },
    setPipelineName: (state, { payload }: PayloadAction<State['pipelineName']>) => {
      state.pipelineName = payload;
    },
    setPipelineTags: (state, { payload }: PayloadAction<State['pipelineTags']>) => {
      state.pipelineTags = payload;
    },
    setPipelineSchedule: (state, { payload }: PayloadAction<State['pipelineSchedule']>) => {
      state.pipelineSchedule = payload;
    },
    setIsDiagramChanged: (state, { payload }: PayloadAction<State['isDiagramChanged']>) => {
      state.isDiagramChanged = payload;
    },
    setIsLoading: (state, { payload }: PayloadAction<State['isLoading']>) => {
      state.isLoading = payload;
    },
    setNodes: (state, { payload }: PayloadAction<State['nodes']>) => {
      state.nodes = payload;
    },
    setLinks: (state, { payload }: PayloadAction<State['links']>) => {
      state.links = payload;
    },
    resetDiagramState: (state) => {
      state.newLinkPromise = null;
      state.newNodePromise = null;
      state.selectedNode = null;
      state.pipelineId = null;
      state.pipelineName = null;
      state.pipelineTags = [];
      state.pipelineSchedule = undefined;
      state.isDiagramChanged = false;
      state.isLoading = false;
      state.nodes = [];
      state.links = [];
    },
    /**
     * Adds new link to the dataflowDiagram.
     * The payload must contain the `id`, `name` and `rows_count` properties of the new target node
     */
    addNewLink: (
      state,
      { payload: updatedNode }: PayloadAction<Partial<DataflowDiagramNode> | undefined | null>,
    ) => {
      const currentState = current(state);
      if (!currentState.newLinkPromise) return;

      const updatedTargetNode = {
        ...currentState.newLinkPromise.value.target,
        ...updatedNode,
      };
      const newLink = {
        ...currentState.newLinkPromise.value,
        target: updatedTargetNode,
      };
      const unpopulatedNewLink = {
        ...newLink,
        source: newLink.source.id,
        target: newLink.target.id,
      };

      // Adding the new link to the diagram.
      currentState.newLinkPromise.resolve(newLink);

      // Updating the links array
      state.links = [...currentState.links, unpopulatedNewLink];

      let updatedNodes = currentState.nodes;
      // Replacing temporary node with the new, updated one
      if (updatedNode) {
        updatedNodes = getNodesWithUpdatedNode(
          currentState.nodes,
          currentState.newLinkPromise.value.target.id,
          updatedNode,
        );
      }

      // Updating the `connections` property of the nodes
      state.nodes = getNodesWithNewLinks(updatedNodes, [unpopulatedNewLink]);

      state.newLinkPromise = null;
    },
    /**
     * Adds new link to the dataflowDiagram. Generates needed nodes and links for branches of the split.
     * The payload must contain the `split` node object and the `branches` array of node objects.
     */
    addNewLinkToSplit: (
      state,
      {
        payload,
      }: PayloadAction<{
        splitNode: { id: number } & Partial<DataflowDiagramNode>;
        branches: DataflowDiagramNode[];
      }>,
    ) => {
      const currentState = current(state);
      if (!currentState.newLinkPromise) return;

      const updatedTargetNode = {
        ...currentState.newLinkPromise.value.target,
        ...payload.splitNode,
      };

      const newLink = {
        ...currentState.newLinkPromise.value,
        target: updatedTargetNode,
      };

      // Adding the new link to the diagram.
      currentState.newLinkPromise.resolve(newLink);

      const unpopulatedNewLink = {
        ...newLink,
        source: newLink.source.id,
        target: newLink.target.id,
      };

      // Branches that are connecting the `split` node with each `branch` node
      const branchesLinks = payload.branches.map((branch) => ({
        id: Math.random(),
        source: payload.splitNode.id,
        target: branch.id,
      }));

      const newLinks = [unpopulatedNewLink, ...branchesLinks];

      // Updating the links array
      state.links = [...currentState.links, ...newLinks];

      let updatedNodes = currentState.nodes;
      // Replacing temporary node with the new, updated one
      if (payload.splitNode) {
        updatedNodes = getNodesWithUpdatedNode(
          currentState.nodes,
          currentState.newLinkPromise.value.target.id,
          payload.splitNode,
        );
      }

      // Updating the `connections` property of the nodes. Updating `state.nodes`.
      state.nodes = getNodesWithNewLinks([...updatedNodes, ...payload.branches], newLinks);

      state.newLinkPromise = null;
    },
    /**
     * Adds new link to the dataflowDiagram, the target being a `Join` node. Must be used only if the `Join` node is connected to one source node. As a payload it receives the updated `Join` node object.
     */
    addNewLinkToJoin: (
      state,
      { payload: updatedNode }: PayloadAction<Partial<DataflowDiagramNode> | undefined>,
    ) => {
      const currentState = current(state);
      if (!currentState.newLinkPromise) {
        return;
      }

      const updatedTargetNode = {
        ...currentState.newLinkPromise.value.target,
        ...updatedNode,
      };

      const newLink = {
        ...currentState.newLinkPromise.value,
        target: updatedTargetNode,
      };

      // Adding the new link to the diagram.
      currentState.newLinkPromise.resolve(newLink);

      const unpopulatedNewLink = {
        ...newLink,
        source: newLink.source.id,
        target: newLink.target.id,
      };

      const oldTargetNode = currentState.newLinkPromise.value.target;

      // Updating the links array
      state.links = [...currentState.links, unpopulatedNewLink];

      let updatedNodes = currentState.nodes;
      // Replacing temporary node with a new, updated one
      if (updatedNode) {
        updatedNodes = getNodesWithUpdatedNode(
          currentState.nodes,
          currentState.newLinkPromise.value.target.id,
          updatedNode,
        );

        if (updatedNode.id && updatedNode.id !== oldTargetNode.id) {
          state.links = getLinksWithUpdatedNodeId(
            // The state of the links has changed, so we need to get the current state of the links again by using `current(state)` instead of the cached `currentState`
            current(state).links,
            oldTargetNode.id,
            updatedNode.id,
          );
        }
      }

      // Updating the `connections` property of the nodes. Updating `state.nodes`.
      state.nodes = getNodesWithNewLinks(updatedNodes, [unpopulatedNewLink]);

      state.newLinkPromise = null;
    },
    addNewNode: (
      state,
      { payload }: PayloadAction<Partial<DataflowDiagramNode> | undefined | null>,
    ) => {
      const currentState = current(state);
      if (!currentState.newNodePromise) return;

      const newNode = patchObject(currentState.newNodePromise.value, payload ?? {});

      state.nodes = [...currentState.nodes, newNode];
      currentState.newNodePromise.resolve(newNode);
      state.newNodePromise = null;
    },
    updateNode: (
      state,
      { payload: updatedNode }: PayloadAction<{ id: number } & Partial<DataflowDiagramNode>>,
    ) => {
      const currentState = current(state);
      state.nodes = getNodesWithUpdatedNode(currentState.nodes, updatedNode.id, updatedNode);
    },
    removeNewLink: (state) => {
      const currentState = current(state);
      if (!currentState.newLinkPromise) return;

      currentState.newLinkPromise.reject();
      state.newLinkPromise = null;
    },
    removeNewNode: (state) => {
      const currentState = current(state);
      if (!currentState.newNodePromise) return;

      currentState.newNodePromise.reject();
      state.newNodePromise = null;
    },
    removeNode: (state, { payload: nodeId }: PayloadAction<number>) => {
      const currentState = current(state);
      state.nodes = currentState.nodes.filter((n) => n.id !== nodeId);
      state.links = currentState.links.filter((l) => l.source !== nodeId && l.target !== nodeId);
    },
  },
});

export const dataflowDiagramActions = dataflowDiagramSlice.actions;
export const dataflowDiagramReducer = dataflowDiagramSlice.reducer;
export const dataflowDiagramSliceName = dataflowDiagramSlice.name;
