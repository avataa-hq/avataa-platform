import { IGroup, ModelConfig } from '@antv/g6';
import { alpha, useTheme } from '@mui/material';
import { useCallback } from 'react';
import {
  useGetPermissions,
  CustomNodeConfig,
  ICustomTableRow,
  TABLE_NODE_ITEM_HEIGHT,
  TABLE_NODE_COLUMN_WIDTH,
  TABLE_NODE_HEADER_HEIGHT,
  TABLE_NODE_COLUMN_HORIZONTAL_PADDING,
  TABLE_NODE_ITEMS_PER_PAGE,
  TABLE_NODE_BODY_MAX_HEIGHT,
} from '6_shared';
import { drawFrame } from './drawFrame';
import { drawHeader } from './drawHeader';
import { drawRow } from './drawRow';
import { drawExpandButton } from './drawExpandButton';
import { drawScrollBar } from './drawScrollBar';
import { drawSwitchViewButton } from './drawSwitchViewButton';

const getCalculatedValues = (
  tableRows: ICustomTableRow[],
  startIndex: number,
  isExpanded: boolean,
) => {
  const columnsCount = tableRows[0].connectedWith.length + 1; // Доп. строка это имя обьекта
  const tableWidth = TABLE_NODE_COLUMN_WIDTH;
  const totalWidth = tableWidth * columnsCount;

  const rowsCount = tableRows.length;
  const headerHeight = TABLE_NODE_HEADER_HEIGHT;
  const rowHeight = TABLE_NODE_ITEM_HEIGHT;
  const bodyHeight = isExpanded
    ? rowHeight * rowsCount
    : Math.min(TABLE_NODE_BODY_MAX_HEIGHT, rowsCount * rowHeight);

  const totalHeight = headerHeight + bodyHeight;

  const itemsPerPage = isExpanded ? tableRows.length : TABLE_NODE_ITEMS_PER_PAGE;
  const radius = 4;
  const offsetY = (0.5 - (startIndex % 1)) * rowHeight + headerHeight;

  return {
    tableWidth,
    totalWidth,
    headerHeight,
    rowHeight,
    totalHeight,
    radius,
    offsetY,
    itemsPerPage,
    columnsCount,
  };
};

const getTextWidth = (text: string, group: IGroup): number => {
  const columnPaddingY = 23;

  const shape = group.addShape('text', {
    attrs: { fontSize: 14, fontWeight: 100, text },
    id: '♥',
  });
  const { width } = shape.getBBox();
  group.removeChild(shape);
  return width + columnPaddingY;
};

const getShortenedName = (name: string) => (name.length > 20 ? `${name.slice(0, 13)}...` : name);

const buildTableRow = (tableRow: ICustomTableRow) => {
  const connectedNew = tableRow.connectedWith;

  const leftColumn = connectedNew[0].join(', ');

  const { label } = tableRow;
  const rightColumns = connectedNew.slice(1).map((i) => i.join(', '));
  const rowsColumns = [leftColumn, label, ...rightColumns];

  return { rowsColumns };
};

export const useDrawTableNode = () => {
  const theme = useTheme();
  const { view: viewPermission } = useGetPermissions('connectivityDiagram');

  const getNodeRowColor = useCallback(
    ({
      rowIndex,
      isConnected = false,
      isActive = false,
    }: {
      rowIndex: number;
      isConnected: boolean;
      isActive: boolean;
    }) => {
      const connectedRowColor = alpha(theme.palette.primary.main, 0.3);
      const activeRowColor = alpha(theme.palette.primary.main, 0.6);
      const boxStyle = {
        headerColor: theme.palette.neutral.surfaceContainerHigh,
        cellColor: theme.palette.background.default,
        radius: 4,
      };
      const rowColor = rowIndex % 2 === 0 ? boxStyle.cellColor : boxStyle.headerColor;

      if (isActive) return activeRowColor;
      if (isConnected) return connectedRowColor;

      return rowColor;
    },
    [
      theme.palette.background.default,
      theme.palette.neutral.surfaceContainerHigh,
      theme.palette.primary.main,
    ],
  );

  const drawTableNode = useCallback(
    (cfg: ModelConfig, group: IGroup) => {
      const {
        tableRows = [],
        isExpanded = false,
        startIndex = 0,
        activeRowKey = null,
        isTransparent = false,
      } = cfg as CustomNodeConfig;
      const {
        tableWidth,
        totalWidth,
        totalHeight,
        rowHeight,
        radius,
        headerHeight,
        offsetY,
        itemsPerPage,
        columnsCount,
      } = getCalculatedValues(tableRows, startIndex, isExpanded);

      const { keyshape, rowsContainer, rowsContainerClip } = drawFrame({
        group,
        radius,
        headerHeight,
        width: totalWidth,
        height: totalHeight,
      });

      const { header } = drawHeader({
        group,
        theme,
        radius,
        label: cfg.label,
        width: totalWidth,
        height: headerHeight,
      });

      const paginatedTableRows = tableRows.slice(
        Math.floor(startIndex),
        Math.floor(startIndex + itemsPerPage),
      );

      let maxColumnWidth = tableWidth;

      const rowCoordinates: { x: number; y: number }[] = [];
      paginatedTableRows.forEach((row) => {
        const { rowsColumns } = buildTableRow(row);
        rowsColumns.forEach((col) => {
          const shapeText = isExpanded ? col : getShortenedName(col);
          const columnTextWidth = getTextWidth(shapeText, group);
          const columnWidth = columnTextWidth + TABLE_NODE_COLUMN_HORIZONTAL_PADDING * 2;
          maxColumnWidth = Math.max(maxColumnWidth, columnWidth);
        });
      });

      paginatedTableRows.forEach((row, rowIndex) => {
        const { rowsColumns } = buildTableRow(row);

        const isActiveRow = row.key === activeRowKey;

        rowsColumns.forEach((col, colIndex) => {
          const isRowConnected = !!col.trim().length;
          const rowColor = getNodeRowColor({
            rowIndex,
            isActive: isActiveRow,
            isConnected: isRowConnected,
          });

          const shapeX = colIndex * maxColumnWidth;
          const shapeY = rowIndex * rowHeight - rowHeight / 2 + offsetY;

          const id = row.objectId.toString();
          const shapeName = `col_shape${colIndex}`;
          const shapeText = isExpanded ? col : getShortenedName(col);

          rowCoordinates.push({
            x: shapeX + maxColumnWidth / 2,
            y: shapeY,
          });

          drawRow({
            id,
            theme,
            row,
            y: shapeY,
            x: shapeX,
            width: maxColumnWidth,
            height: rowHeight,
            text: shapeText,
            shapeFill: rowColor,
            name: shapeName,
            group: rowsContainer,
          });
        });
      });

      const newTotalWidth = maxColumnWidth * columnsCount;

      if (!isTransparent) {
        drawExpandButton({
          group,
          nodeWidth: newTotalWidth,
          theme,
          type: isExpanded ? 'collapse' : 'expand',
        });
      }

      if (columnsCount >= 3 && viewPermission) {
        drawSwitchViewButton({
          group,
          nodeWidth: newTotalWidth,
          theme,
        });
      }

      group.attr({ size: [newTotalWidth, totalHeight], width: newTotalWidth });
      header.attr({ width: newTotalWidth });
      keyshape.attr({ width: newTotalWidth });
      rowsContainerClip.attr({ width: newTotalWidth });

      drawScrollBar({
        startIndex,
        headerHeight,
        totalHeight,
        itemsPerPage,
        group: rowsContainer,
        totalWidth: newTotalWidth,
        totalRowsLength: tableRows.length,
        paginatedRowsLength: paginatedTableRows.length,
      });

      return keyshape;
    },
    [getNodeRowColor, theme, viewPermission],
  );

  return drawTableNode;
};
