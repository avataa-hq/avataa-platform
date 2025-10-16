import { TimeLineSegments } from '6_shared';
import {
  startOfYear,
  endOfYear,
  addYears,
  startOfQuarter,
  endOfQuarter,
  addQuarters,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek,
  addWeeks,
  addDays,
  differenceInDays,
  format,
} from 'date-fns';

/**
 * Генерирует массив дней между timelineStart и timelineEnd.
 */
function generateDays(timelineStart: Date, timelineEnd: Date, dayWidth: number) {
  const days = [];
  let currentDay = timelineStart;
  while (currentDay <= timelineEnd) {
    days.push({
      label: format(currentDay, 'dd'),
      width: dayWidth,
      start: currentDay,
      end: currentDay,
    });
    currentDay = addDays(currentDay, 1);
  }
  return days;
}

/**
 * Генерирует массив недель между timelineStart и timelineEnd.
 * Неделя начинается с понедельника (weekStartsOn: 1).
 */
function generateWeeks(timelineStart: Date, timelineEnd: Date, dayWidth: number) {
  const weeks = [];
  let currentWeek = startOfWeek(timelineStart, { weekStartsOn: 1 });
  while (currentWeek <= timelineEnd) {
    const weekStart = timelineStart > currentWeek ? timelineStart : currentWeek;
    const weekEndCandidate = endOfWeek(currentWeek, { weekStartsOn: 1 });
    const weekEnd = weekEndCandidate > timelineEnd ? timelineEnd : weekEndCandidate;
    const daysCount = differenceInDays(weekEnd, weekStart) + 1;
    weeks.push({
      label: `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`,
      width: daysCount * dayWidth,
      start: weekStart,
      end: weekEnd,
    });
    currentWeek = addWeeks(currentWeek, 1);
  }
  return weeks;
}

/**
 * Генерирует массив месяцев между timelineStart и timelineEnd.
 */
function generateMonths(timelineStart: Date, timelineEnd: Date, dayWidth: number) {
  const months = [];
  let currentMonth = startOfMonth(timelineStart);
  while (currentMonth <= timelineEnd) {
    const monthStart = timelineStart > currentMonth ? timelineStart : currentMonth;
    const monthEndCandidate = endOfMonth(currentMonth);
    const monthEnd = monthEndCandidate > timelineEnd ? timelineEnd : monthEndCandidate;
    const daysCount = differenceInDays(monthEnd, monthStart) + 1;
    const label = format(currentMonth, 'MMM yyyy');
    months.push({
      label,
      width: daysCount * dayWidth,
      start: monthStart,
      end: monthEnd,
    });
    currentMonth = addMonths(currentMonth, 1);
  }
  return months;
}

/**
 * Генерирует массив кварталов между timelineStart и timelineEnd.
 */
function generateQuarters(timelineStart: Date, timelineEnd: Date, dayWidth: number) {
  const quarters = [];
  let currentQuarter = startOfQuarter(timelineStart);
  while (currentQuarter <= timelineEnd) {
    const quarterStart = timelineStart > currentQuarter ? timelineStart : currentQuarter;
    const quarterEndCandidate = endOfQuarter(currentQuarter);
    const quarterEnd = quarterEndCandidate > timelineEnd ? timelineEnd : quarterEndCandidate;
    const daysCount = differenceInDays(quarterEnd, quarterStart) + 1;
    // Нумерация кварталов в году
    const quarterNumber = Math.floor(currentQuarter.getMonth() / 3) + 1;
    quarters.push({
      label: `Q${quarterNumber} ${currentQuarter.getFullYear()}`,
      width: daysCount * dayWidth,
      start: quarterStart,
      end: quarterEnd,
    });
    currentQuarter = addQuarters(currentQuarter, 1);
  }
  return quarters;
}

function generateYears(timelineStart: Date, timelineEnd: Date, dayWidth: number) {
  const years = [];
  let currentYear = startOfYear(timelineStart);
  while (currentYear <= timelineEnd) {
    const yearStart = timelineStart > currentYear ? timelineStart : currentYear;
    const yearEndCandidate = endOfYear(currentYear);
    const yearEnd = yearEndCandidate > timelineEnd ? timelineEnd : yearEndCandidate;
    const daysCount = differenceInDays(yearEnd, yearStart) + 1;
    years.push({
      label: currentYear.getFullYear().toString(),
      width: daysCount * dayWidth,
      start: yearStart,
      end: yearEnd,
    });
    currentYear = addYears(currentYear, 1);
  }
  return years;
}

export function generateTimelineData(
  timelineStart: Date,
  timelineEnd: Date,
  dayWidth: number,
): TimeLineSegments {
  return {
    years: generateYears(timelineStart, timelineEnd, dayWidth),
    quarters: generateQuarters(timelineStart, timelineEnd, dayWidth),
    months: generateMonths(timelineStart, timelineEnd, dayWidth),
    weeks: generateWeeks(timelineStart, timelineEnd, dayWidth),
    days: generateDays(timelineStart, timelineEnd, dayWidth),
  };
}
