import { useEffect, useMemo, useState } from 'react';

import {
  GetSeverityProcessBody,
  IColorRangeModel,
  IRangeModel,
  searchApiV2,
  severityApi,
  SeverityProcessModel,
  SeverityProcessModelData,
} from '6_shared';

import { enqueueSnackbar } from 'notistack';
import { GetRangesForProcessesBody } from '../../lib';
import { getColorRangesDataByValue } from '../../../../2_pages/processManager/lib/getColorRangesDataByValue';

const { useGetSeverityProcessesQuery } = searchApiV2;

interface IProps {
  body?: GetSeverityProcessBody | null;
  liveSeverityProcessesData: SeverityProcessModelData[];
  liveTotalCount?: number;
  getRanges?: GetRangesForProcessesBody;
  additionalSkip?: boolean;

  severityId?: number | null;
  selectedColorPalette?: IColorRangeModel;
}

export const useGetTableProcessData = ({
  body,
  liveSeverityProcessesData,
  liveTotalCount,
  getRanges,
  additionalSkip,
  selectedColorPalette,
  severityId,
}: IProps) => {
  const [tableRowsWithLive, setTableRowsWithLive] = useState<SeverityProcessModelData[]>([]);
  const [tableTotalCount, setTableTotalCount] = useState(0);
  const [processesBody, setProcessesBody] = useState<GetSeverityProcessBody | null>(null);
  const [warningRows, setWarningRows] = useState<SeverityProcessModelData[]>([]);

  useEffect(() => {
    setProcessesBody(!body ? null : { ...body, rangesObject: { ranges: getRanges?.(false) } });
  }, [body, getRanges]);

  const {
    data: tableProcessData,
    isSuccess: isTableProcessesDataSuccess,
    isFetching: isTableProcessesDataFetching,
    refetch: refetchProcessData,
    isError: isTableProcessesDataError,
  } = useGetSeverityProcessesQuery(processesBody!, {
    skip: !processesBody || !processesBody.tmoId || additionalSkip,
  });

  const playBeep = () => {
    try {
      const audio = new Audio('/sound/notification_sound.mp3'); // Путь относительно корня сборки
      audio.play();
    } catch (error) {
      console.error('Ошибка воспроизведения звука:', error);
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(440, context.currentTime);

      oscillator.connect(context.destination);
      oscillator.start();
      setTimeout(() => oscillator.stop(), 300);
    }
  };

  useEffect(() => {
    if (liveSeverityProcessesData.length > 0) {
      setTableRowsWithLive(liveSeverityProcessesData);
    } else if (tableProcessData && tableProcessData.rows.length > 0) {
      setTableRowsWithLive(tableProcessData.rows);
    } else {
      setTableRowsWithLive([]);
    }
  }, [liveSeverityProcessesData, tableProcessData]);

  useEffect(() => {
    if (liveTotalCount) {
      setTableTotalCount(liveTotalCount);
    } else if (tableProcessData?.totalCount) {
      setTableTotalCount(tableProcessData.totalCount);
    } else {
      setTableTotalCount(0);
    }
  }, [liveTotalCount, tableProcessData?.totalCount]);

  useEffect(() => {
    liveSeverityProcessesData.forEach((row) => {
      const stableRow = tableProcessData?.rows.find((sr) => sr.id === row.id);
      if (!stableRow) {
        setWarningRows((prev) => {
          const existingRow = prev.find((wr) => wr.id === row.id);
          if (existingRow || !severityId || !selectedColorPalette) return prev;

          const colorData = getColorRangesDataByValue(
            row[severityId],
            selectedColorPalette.ranges as IRangeModel,
          );
          if (!colorData?.warningSignal) return prev;

          const prevOld = prev.map((p) => ({ ...p, isNew: false }));
          return [{ ...row, severityValue: row[severityId ?? '-1'], isNew: true }, ...prevOld];
        });
      }
    });
  }, [liveSeverityProcessesData, selectedColorPalette, severityId, tableProcessData?.rows]);

  useEffect(() => {
    const showWarningsWithDelay = async () => {
      for (let i = 0; i < warningRows.length; i++) {
        if (warningRows[i].isNew) {
          playBeep();
          enqueueSnackbar(
            `Process: ${warningRows[i].name}. Severity: ${warningRows[i][severityId ?? '-1']}`,
            {
              variant: 'warning',
            },
          );
          // Добавляем задержку, например, 500 мс
          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve) => {
            setTimeout(resolve, 500);
          });
        }
      }
    };

    showWarningsWithDelay();
  }, [severityId, warningRows]);

  useEffect(() => {
    if (liveTotalCount) setTableTotalCount(liveTotalCount);
  }, [liveTotalCount]);

  const refetchTableProcessData = () => {
    if (tableProcessData) {
      severityApi.util.resetApiState();
      refetchProcessData();
    }
  };

  const processData = useMemo<SeverityProcessModel | null>(() => {
    return { rows: tableRowsWithLive, totalCount: tableTotalCount };
  }, [tableRowsWithLive, tableTotalCount]);

  return {
    isTableProcessesDataFetching,
    isTableProcessesDataSuccess,
    refetchTableProcessData,
    tableProcessData: processData || undefined,
    isTableProcessesDataError,
    warningRows,
  };
};
