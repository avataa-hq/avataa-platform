import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import Tree from 'react-d3-tree';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Popover, Typography } from '@mui/material';
import { DeleteRounded } from '@mui/icons-material';
import NewHierarchyBubbleIcon from 'assets/img/new_hierarchy_bubble.svg?react';
import NewHierarchyChildIcon from 'assets/img/new_hierarchy_child.svg?react';
import { hierarchyLevels, ActionTypes, useTranslate, useHierarchyBuilder } from '6_shared';
import { Hierarchy, HierarchyLevel } from '6_shared/api/hierarchy/types';
import { HierarchyBubble } from './HierarchyBubble';

interface HierarchyLevelWithChildren extends HierarchyLevel {
  children?: HierarchyLevel[];
}

const populateWithChildren = (
  level: HierarchyLevelWithChildren,
  levelArray: HierarchyLevel[],
): HierarchyLevelWithChildren => {
  const children = levelArray.filter((l) => level.id === l.parent_id);
  return {
    ...level,
    children: children.map((c) => populateWithChildren(c, levelArray)),
  };
};

export const HierarchyTreeBuilder = ({
  permissions,
  activeHierarchy,
  levels,
}: {
  permissions?: Record<ActionTypes, boolean>;
  activeHierarchy: Hierarchy | null;
  levels?: any[];
}) => {
  const { useGetLevelsQuery } = hierarchyLevels;
  const translate = useTranslate();

  const treeRef = useRef<any>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [chartState, setChartState] = useState<HierarchyLevelWithChildren[]>([] as any);
  const activeNode = useRef<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const {
    setIsAddLevelDialogOpen,
    setIsDeleteHierarchyLevelDialogOpen,
    setIsEditLevelDialogOpen,
    setSelectedHierarchyLevel,
  } = useHierarchyBuilder();

  const {
    data: hierarchyLevelsData,
    isError,
    isSuccess,
  } = useGetLevelsQuery(activeHierarchy?.id!, {
    skip: !activeHierarchy?.id,
  });

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handlePopoverClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    activeNode.current = null;
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    if (!treeRef.current || !treeRef.current.parentElement) return;

    const { parentElement } = treeRef.current;

    const parentRect = parentElement.getBoundingClientRect();

    setCanvasSize({
      width: parentRect.width,
      height: parentRect.height,
    });
  }, [treeRef]);

  const handleNodeClick = (node: any, event: any) => {
    if (permissions?.update ?? true) {
      event.stopPropagation();
      activeNode.current = node;
      handlePopoverClick(event);
    }
  };

  useEffect(() => {
    const lvls = levels || hierarchyLevelsData;
    if (!lvls || isError) {
      setChartState([] as HierarchyLevelWithChildren[]);
      return;
    }

    const root = lvls.find((l) => !l.parent_id);
    const levelsWithChildren = root ? [populateWithChildren(root, lvls)] : [];

    setChartState(levelsWithChildren);
  }, [hierarchyLevelsData, isError, isSuccess, levels]);

  const handleTreeContainerClick = (e: any) => {
    if (anchorEl || chartState.length > 0) {
      setAnchorEl(null);
      return;
    }
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
    setAnchorEl(e.currentTarget);
  };

  return (
    <Box
      component="div"
      ref={treeRef}
      sx={{
        width: '100%',
        height: '100%',
      }}
      onClick={handleTreeContainerClick}
    >
      {chartState.length !== 0 && (
        <Tree
          data={chartState}
          dimensions={canvasSize}
          orientation="vertical"
          pathFunc="straight"
          collapsible={false}
          translate={{ x: canvasSize.width / 2, y: 50 }}
          zoom={1}
          svgClassName="hierarchy-builder-diagram-svg"
          renderCustomNodeElement={(nodeProps) => (
            <HierarchyBubble nodeProps={nodeProps} onClick={handleNodeClick} />
          )}
          separation={{ siblings: 2, nonSiblings: 2.5 }}
          nodeSize={{ x: 50, y: 100 }}
        />
      )}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorReference={activeNode.current ? 'anchorEl' : 'anchorPosition'}
        anchorPosition={
          activeNode.current
            ? undefined
            : {
                top: mousePosition.y,
                left: mousePosition.x,
              }
        }
      >
        <Box
          component="div"
          sx={{
            display: 'flex',
            px: 1.5,
            py: 1,
            gap: 2,
          }}
        >
          {activeNode.current && (
            <Box
              component="div"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={(e: MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();

                setSelectedHierarchyLevel({
                  data: activeNode.current?.data,
                  parentData: activeNode.current?.parent?.data,
                });
                setIsEditLevelDialogOpen(true);
                setAnchorEl(null);
                activeNode.current = null;
              }}
            >
              <EditIcon style={{ flex: 1 }} />
              <Typography>{translate('Edit')}</Typography>
            </Box>
          )}
          {(chartState.length === 0 || !!activeNode.current?.parent) && (
            <Box
              component="div"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={(e: MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();

                setSelectedHierarchyLevel({
                  data: null,
                  parentData: activeNode.current?.parent?.data || null,
                });
                setIsAddLevelDialogOpen(true);
                setAnchorEl(null);
                activeNode.current = null;
              }}
            >
              <NewHierarchyBubbleIcon style={{ flex: 1 }} />
              <Typography>{translate('Node')}</Typography>
            </Box>
          )}
          {anchorEl && activeNode.current && (
            <Box
              component="div"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={(e: MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();

                setSelectedHierarchyLevel({
                  data: null,
                  parentData: activeNode.current?.data || null,
                });
                setIsAddLevelDialogOpen(true);
                setAnchorEl(null);
                activeNode.current = null;
              }}
            >
              <NewHierarchyChildIcon style={{ flex: 1 }} />
              <Typography>{translate('Child')}</Typography>
            </Box>
          )}
          {chartState.length > 0 && (
            <Box
              component="div"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={(e: MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                setIsDeleteHierarchyLevelDialogOpen(true);

                setSelectedHierarchyLevel({
                  data: activeNode.current?.data,
                  parentData: activeNode.current?.parent?.data,
                });
                setAnchorEl(null);
                activeNode.current = null;
              }}
            >
              <DeleteRounded sx={{ flex: 1 }} />
              <Typography>{translate('Delete')}</Typography>
            </Box>
          )}
        </Box>
      </Popover>
    </Box>
  );
};
