import { useEffect, useState } from 'react';
import { Dayjs } from 'dayjs';
import { IObjectHistoryData, formatDate } from '5_entites';
import { IGetParameterEventsByObjectId } from '6_shared';

interface IProps {
  objectParameterEventsData: IGetParameterEventsByObjectId[] | undefined;
  objectId?: number | null;
  dateFrom: Dayjs | null;
  timeFrom: Dayjs | null;
  dateTo: Dayjs | null;
  timeTo: Dayjs | null;
  resetStateWhenDateOrTimeChanged: () => void;
}

export const useTransformObjectHistoryData = ({
  objectParameterEventsData,
  objectId,
  dateFrom,
  timeFrom,
  dateTo,
  timeTo,
  resetStateWhenDateOrTimeChanged,
}: IProps) => {
  const [historyData, setHistoryData] = useState<IObjectHistoryData[]>([]);

  useEffect(() => {
    resetStateWhenDateOrTimeChanged();
    setHistoryData([]);
  }, [dateFrom, timeFrom, dateTo, timeTo, objectId]);

  useEffect(() => {
    if (!objectParameterEventsData) return;

    const newData = objectParameterEventsData.reduce((acc, param) => {
      const key = JSON.stringify({
        date: formatDate(param.valid_from, 'dd.MM.yyyy HH:mm:ss'),
        event: param.event_type,
      });

      if (!acc[key]) {
        acc[key] = {
          date: formatDate(param.valid_from, 'dd.MM.yyyy HH:mm:ss'),
          event: param.event_type,
          expanded: false,
          params: [],
        };
      }

      acc[key].params.push(param);
      return acc;
    }, {} as IObjectHistoryData);

    setHistoryData((prev) => {
      const filteredNewData = Object.values(newData).filter((newItem) => {
        const exists = prev.some(
          (existingItem) =>
            existingItem.date === newItem.date && existingItem.event === newItem.event,
        );
        return !exists;
      });

      return [...prev, ...filteredNewData];
    });

    // const filteredNewData = Object.values(newData).filter((newItem) => {
    //   const exists = historyData.some(
    //     (existingItem) =>
    //       existingItem.date === newItem.date && existingItem.event === newItem.event,
    //   );
    //   return !exists;
    // });

    // setHistoryData((prev) => [...prev, ...filteredNewData]);
  }, [objectParameterEventsData]);

  return { historyData };
};
