import { GridColDef, GridPaginationModel } from '@mui/x-data-grid-premium';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { IGetParameterEventsByObjectId, useTimezoneAdjustment } from '6_shared';
import { useGetObjectParametersEventsByObjectId, useGetObjectTypeParamTypes } from '../../api';
import { formatDate } from '../../lib';

interface IProps {
  isShowHistoryOpen: boolean;
  pmTmoId: number | undefined;
  selectedObjects: Record<string, string>;
  paginationModel: GridPaginationModel;
  setPaginationModel: (model: GridPaginationModel) => void;
}
export const useHistoryTableData = ({
  isShowHistoryOpen,
  pmTmoId,
  selectedObjects,
  paginationModel,
  setPaginationModel,
}: IProps) => {
  const { disableTimezoneAdjustment } = useTimezoneAdjustment();

  const prevGroupedEvents = useRef<Record<string, any>>({});

  const [historyTableRows, setHistoryTableRows] = useState<any[]>([]);
  const [shouldFetchData, setShouldFetchData] = useState(true);
  const [paramTypeNamesData, setParamTypeNamesData] = useState<{ [key: string]: string }>({});
  const [paramTypeValTypes, setParamTypeValTypes] = useState<{ [key: string]: string }>({});

  const objectIds = useMemo(
    () => Object.keys(selectedObjects).map((key) => +key),
    [selectedObjects],
  );

  const {
    objectParameterEventsData,
    isObjectParameterEventsDataFetching,
    isObjectParameterEventsDataError,
  } = useGetObjectParametersEventsByObjectId({
    objectIds,
    limit: paginationModel.pageSize,
    offset: paginationModel.page * paginationModel.pageSize,
    sort: 'DESC',
    skip: !isShowHistoryOpen || objectIds.length === 0 || !shouldFetchData,
  });

  const total = useMemo(() => {
    return objectIds.reduce((sum, id) => {
      const value = objectParameterEventsData?.[id]?.total || 0;
      return sum + value;
    }, 0);
  }, [objectIds, objectParameterEventsData]);

  const { objectTypeParamTypes } = useGetObjectTypeParamTypes({ objectTmoId: pmTmoId });

  useEffect(() => {
    if (!isShowHistoryOpen) {
      setHistoryTableRows([]);
      setShouldFetchData(true);
      prevGroupedEvents.current = {};
    }
  }, [isShowHistoryOpen]);

  useEffect(() => {
    setShouldFetchData(true);
    setPaginationModel({ ...paginationModel, page: 0 });
    prevGroupedEvents.current = {};
    if (objectIds.length === 0) {
      setHistoryTableRows([]);
    }
  }, [objectIds]);

  useEffect(() => {
    if (!objectParameterEventsData) return;
    setShouldFetchData(total > paginationModel.page * paginationModel.pageSize);
  }, [objectParameterEventsData, paginationModel.page, paginationModel.pageSize, total]);

  useEffect(() => {
    if (objectTypeParamTypes) {
      const { tprmNames, tprmValtypes } = objectTypeParamTypes.reduce(
        (
          acc: { tprmNames: { [key: string]: string }; tprmValtypes: { [key: string]: string } },
          item,
        ) => {
          acc.tprmNames[String(item.id)] = item.name;
          acc.tprmValtypes[String(item.id)] = item.val_type;
          return acc;
        },
        { tprmNames: {}, tprmValtypes: {} },
      );

      setParamTypeValTypes(tprmValtypes);
      setParamTypeNamesData(tprmNames);
    }
  }, [objectTypeParamTypes]);

  const historyColumns = useMemo<GridColDef[]>(() => {
    if (!paramTypeNamesData) return [];
    const paramsArray = Object.entries(paramTypeNamesData);
    if (!paramsArray.length) return [];

    const columns: GridColDef[] = [
      {
        field: 'objectName',
        headerName: 'Object name',
      },
      {
        field: 'eventType',
        headerName: 'Event',
        valueFormatter: (value) => {
          if (!value) return '';
          if (value === 'CREATED') return 'Create';
          if (value === 'UPDATED') return 'Update';
          if (value === 'DELETED') return 'Delete';
          return value;
        },
      },
      {
        field: 'eventTime',
        headerName: 'Event Time',
        // Changed after migrating to MUI Data Grid 7. It's surprising that the typescript didn't respond to the error until migrating
        type: 'date',
        width: 150,
        valueFormatter: (value) => {
          if (!value) return '';
          return formatDate(value, 'dd.MM.yyyy HH:mm:ss');
        },
      },
    ];

    paramsArray.forEach(([key, value]) => {
      columns.push({
        field: key,
        headerName: value,
      });
    });
    return columns;
  }, [paramTypeNamesData]);

  const transformValue = useCallback(
    (prm: IGetParameterEventsByObjectId) => {
      if (paramTypeValTypes[prm.parameter_type_id] === 'datetime') {
        const newValue = disableTimezoneAdjustment
          ? String(prm.new_value).replace('Z', '')
          : String(prm.new_value);
        return dayjs(new Date(newValue)).format('DD-MM-YYYY HH:mm:ss');
      }
      return prm.new_value;
    },
    [disableTimezoneAdjustment, paramTypeValTypes],
  );

  useEffect(() => {
    if (!objectParameterEventsData) return;
    const rows: any[] = [];

    Object.entries(objectParameterEventsData).forEach(([moId, item]) => {
      item?.data.forEach((param) => {
        const key = JSON.stringify({
          date: formatDate(param.valid_from, 'dd.MM.yyyy HH:mm:ss'),
          event: param.event_type,
          moId,
        });

        if (!prevGroupedEvents.current[key]) {
          prevGroupedEvents.current[key] = {
            eventTime: param.valid_from,
            eventType: param.event_type,
            id: param.valid_from,
            moId,
            objectName: selectedObjects[moId],
            [param.parameter_type_id]: transformValue(param),
          };
        } else {
          prevGroupedEvents.current[key] = {
            ...prevGroupedEvents.current[key],
            [param.parameter_type_id]: transformValue(param),
          };
        }
      });
    });

    const prevObjectEvent: Record<string, any> = {};

    const reversedGroupedEvents = Object.values(prevGroupedEvents.current).reverse();

    reversedGroupedEvents.forEach((item) => {
      const newRow: any = { ...(prevObjectEvent[item.moId] ?? {}), ...item };
      rows.unshift(newRow);
      prevObjectEvent[newRow.moId] = newRow;
    });

    setHistoryTableRows(rows);
  }, [objectParameterEventsData, selectedObjects, transformValue]);

  return {
    historyColumns,
    historyRows: historyTableRows,
    totalHistoryCount: total,
    isObjectsHistoryDataFetching: isObjectParameterEventsDataFetching,
    isObjectsHistoryError: isObjectParameterEventsDataError,
    shouldFetchData,
    objectIds,
  };
};
