import { MutableRefObject, UIEvent, useCallback, useRef } from 'react';
import { addDays } from 'date-fns';

interface IProps {
  taskListAreaRef: MutableRefObject<HTMLDivElement | null>;
  timeLineAreaRef: MutableRefObject<HTMLDivElement | null>;
  timeLineHeaderRef: MutableRefObject<HTMLDivElement | null>;
  timeLineStartDate?: Date;
  dayWidth: number;
  todayPosition: number;

  activeTaskPosition?: number | null;
}

export const useScrollsSync = ({
  taskListAreaRef,
  timeLineAreaRef,
  timeLineHeaderRef,
  dayWidth,
  timeLineStartDate,
  todayPosition,

  activeTaskPosition,
}: IProps) => {
  const scrollDate = useRef<Date>(new Date());

  // Синхронизация вертикального скролла: если прокручивается левая панель, задаём scrollTop правой панели, и наоборот.
  const syncVerticalScroll = useCallback(
    (source: 'left' | 'right') => {
      if (source === 'left' && taskListAreaRef.current && timeLineAreaRef.current) {
        timeLineAreaRef.current.scrollTop = taskListAreaRef.current.scrollTop;
      }
      if (source === 'right' && taskListAreaRef.current && timeLineAreaRef.current) {
        taskListAreaRef.current.scrollTop = timeLineAreaRef.current.scrollTop;
      }
    },
    [taskListAreaRef, timeLineAreaRef],
  );

  // Синхронизация горизонтального скролла: при скролле правой панели обновляем scrollLeft правой шапки
  const syncHorizontalScroll = useCallback(() => {
    if (timeLineAreaRef.current && timeLineHeaderRef.current) {
      timeLineHeaderRef.current.scrollLeft = timeLineAreaRef.current.scrollLeft;
    }
  }, [timeLineAreaRef, timeLineHeaderRef]);

  const onTimeLineScroll = useCallback(
    ({ currentTarget }: UIEvent<HTMLDivElement>) => {
      if (timeLineAreaRef.current && timeLineStartDate) {
        timeLineAreaRef.current.scrollLeft = currentTarget.scrollLeft;

        const sLeft = timeLineAreaRef.current.scrollLeft;
        const daysFromStart = Math.round(sLeft / dayWidth);
        const currentDate = addDays(timeLineStartDate, daysFromStart);
        scrollDate.current = currentDate;
      }
    },
    [dayWidth, timeLineAreaRef, timeLineStartDate],
  );

  const scrollToActiveTask = useCallback(() => {
    if (!timeLineAreaRef.current || !timeLineStartDate || !activeTaskPosition) return;
    const container = timeLineAreaRef.current;
    const containerWidth = container.clientWidth;

    container.scrollTo({ left: activeTaskPosition - containerWidth / 2 });
  }, [timeLineAreaRef, timeLineStartDate, activeTaskPosition]);

  const scrollToToday = useCallback(() => {
    if (activeTaskPosition) scrollToActiveTask();

    if (!timeLineAreaRef.current || !timeLineStartDate) return;

    // const today = new Date();
    // const todayPosition = differenceInDays(today, timeLineStartDate) * dayWidth;
    const container = timeLineAreaRef.current;
    const containerWidth = container.clientWidth;

    container.scrollTo({ left: todayPosition - containerWidth / 2 });
  }, [timeLineAreaRef, timeLineStartDate, todayPosition, activeTaskPosition, scrollToActiveTask]);

  return { syncVerticalScroll, syncHorizontalScroll, onTimeLineScroll, scrollToToday };
};
