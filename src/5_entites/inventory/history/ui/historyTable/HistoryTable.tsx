import { DEFAULT_PAGINATION_MODEL, useTranslate } from '6_shared';
import { Typography } from '@mui/material';
import {
  DataGridPremium,
  GridPaginationModel,
  GridSortModel,
  gridExpandedRowCountSelector,
} from '@mui/x-data-grid-premium';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { MutableRefObject, memo, useEffect, useRef, useState } from 'react';
import { useHistoryTableData } from '../../hooks';
import { filterTableRowsData } from '../../lib';
import { HistoryTableStyled, Overlay } from './HistoryTable.styled';

interface IProps {
  apiRef: MutableRefObject<GridApiPremium>;
  historySearchValue: string;
  isShowHistoryOpen: boolean;
  pmTmoId: number | undefined;
  selectedObjects: Record<string, string>;
}

export const HistoryTable = memo(
  ({ apiRef, historySearchValue, isShowHistoryOpen, pmTmoId, selectedObjects }: IProps) => {
    const translate = useTranslate();
    const boxRef = useRef<HTMLDivElement | null>(null);

    const [paginationModel, setPaginationModel] =
      useState<GridPaginationModel>(DEFAULT_PAGINATION_MODEL);
    const [sortingModel, setSortingModel] = useState<GridSortModel>([]);
    const [scrollEvent, setScrollEvent] = useState(false);
    const [newTableRows, setNewTableRows] = useState<any[]>([]);

    const {
      historyColumns,
      historyRows,
      isObjectsHistoryDataFetching,
      isObjectsHistoryError,
      shouldFetchData,
      objectIds,
    } = useHistoryTableData({
      isShowHistoryOpen,
      pmTmoId,
      selectedObjects,
      paginationModel,
      setPaginationModel,
    });

    useEffect(() => {
      setNewTableRows(historyRows);
    }, [historyRows, newTableRows]);

    useEffect(() => {
      const maxRowIndex = gridExpandedRowCountSelector(apiRef) - 1;
      const rowHeight = apiRef.current.unstable_getRowHeight(maxRowIndex);
      const totalRowsHeight = rowHeight * historyRows.length;
      const tableHeight = boxRef?.current?.scrollHeight;
      if (tableHeight && totalRowsHeight > tableHeight - 90) {
        setScrollEvent(true);
      }
    }, [apiRef, historyRows, scrollEvent, shouldFetchData]);

    useEffect(() => {
      if (
        !isObjectsHistoryDataFetching &&
        objectIds.length !== 0 &&
        historyRows.length !== 0 &&
        !scrollEvent &&
        shouldFetchData
      ) {
        setPaginationModel({ ...paginationModel, page: paginationModel.page + 1 });
      }
    }, [
      historyRows,
      isObjectsHistoryDataFetching,
      paginationModel,
      scrollEvent,
      setPaginationModel,
      shouldFetchData,
      objectIds,
    ]);

    useEffect(() => {
      if (!isShowHistoryOpen) {
        setScrollEvent(false);
        setTimeout(() => {
          setPaginationModel({ ...paginationModel, page: 0 });
        }, 500);
      }
    }, [isShowHistoryOpen]);

    useEffect(() => {
      setSortingModel([{ field: 'eventTime', sort: 'desc' }]);
    }, [historyColumns]);

    return (
      <HistoryTableStyled ref={boxRef}>
        <DataGridPremium
          apiRef={apiRef}
          loading={isObjectsHistoryDataFetching}
          columns={historyColumns}
          rows={filterTableRowsData(newTableRows, historySearchValue)}
          sortModel={sortingModel}
          sortingOrder={['desc', 'asc', null]}
          onSortModelChange={(model) => setSortingModel(model)}
          onRowsScrollEnd={(e) => {
            if (!isObjectsHistoryDataFetching && shouldFetchData) {
              setPaginationModel({ ...paginationModel, page: paginationModel.page + 1 });
            }
          }}
        />
        {isObjectsHistoryError && (
          <Overlay>
            <Typography color="error" variant="h3">
              {translate('Something went wrong when loading data')}...
            </Typography>
          </Overlay>
        )}
      </HistoryTableStyled>
    );
  },
);
