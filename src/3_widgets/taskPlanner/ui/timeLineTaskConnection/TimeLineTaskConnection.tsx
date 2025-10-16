import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { useTheme } from '@mui/material';
import { differenceInDays, startOfDay } from 'date-fns';
import * as d3 from 'd3';
import { GANT_ROW_HEIGHT, IGanttTask } from '6_shared';

interface IProps {
  tasks: IGanttTask[];
  startDate?: Date;
  dayWidth: number;
  timeLineWidth: number;
  timeLineRef: React.RefObject<HTMLDivElement>;
  onDeleteTaskDependency: (taskId: string, dependencyId: string) => void;
}

export const TimeLineTaskConnection = forwardRef(
  (
    {
      tasks: ganttTasks,
      startDate,
      dayWidth,
      timeLineWidth,
      timeLineRef,
      onDeleteTaskDependency,
    }: IProps,
    ref,
  ) => {
    const theme = useTheme();

    const [tasks, setTasks] = useState<IGanttTask[]>(ganttTasks);

    const upadeLineTasks = useCallback((newTasks: IGanttTask[]) => {
      setTasks(newTasks);
    }, []);

    useImperativeHandle(ref, () => ({
      upadeLineTasks,
    }));

    interface INode {
      id: string | number;
      x1: number;
      x2: number;
      y: number;
      width: number;
      type: string;
      nodeType: string | undefined;
    }

    const nodes = useMemo(() => {
      if (!startDate) return [];
      return tasks.reduce((acc, task, index) => {
        if (!task.start || !task.end) return acc;

        // const taskDurationInDays = differenceInDays(task.end, task.start);
        const taskStart = startOfDay(new Date(task.start));
        const taskEnd = startOfDay(new Date(task.end));
        const timelineStart = startOfDay(startDate);
        const taskDurationInDays = differenceInDays(taskEnd, taskStart) + 1;

        acc.push({
          id: task.id,
          // x1: (differenceInDays(task.start, startDate) + 1) * dayWidth,
          // x2: differenceInDays(task.start, startDate) * dayWidth,
          x1: differenceInDays(taskStart, timelineStart) * dayWidth, // исправлено
          x2: (differenceInDays(taskStart, timelineStart) + taskDurationInDays) * dayWidth, // исправлено
          y: index * GANT_ROW_HEIGHT,
          width: taskDurationInDays * dayWidth,
          type: task.type,
          nodeType: task.nodeType,
        });

        return acc;
      }, [] as INode[]);
    }, [tasks, startDate, dayWidth]);

    const links = useMemo(() => {
      return tasks.flatMap((task) =>
        task.dependencies?.map((dependencyId) => ({
          id: task.id,
          source: dependencyId.toString(),
          target: task.id.toString(),
        })),
      );
    }, [tasks]);

    const milestoneWidth = useMemo(() => (dayWidth > 60 ? dayWidth / 3 : dayWidth / 2), [dayWidth]);

    const drawLinks = useCallback(() => {
      const svg = d3.select(timeLineRef.current).select('svg');
      const fillColor = theme.palette.info.main;

      svg.select('defs').remove();
      const defs = svg.append('defs');

      defs
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 9)
        .attr('refY', 5)
        .attr('markerWidth', 4)
        .attr('markerHeight', 4)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('fill', fillColor);

      // Remove old links
      svg.selectAll('.link-group').remove();

      const linkGroups = svg
        .selectAll('.link-group')
        .data(links)
        .enter()
        .append('g')
        .attr('class', 'link-group')
        .style('pointer-events', 'none');

      linkGroups.each(function (d) {
        const group = d3.select(this);
        const sourceNode = nodes.find((node) => node.id.toString() === d?.source.toString());
        const targetNode = nodes.find((node) => node.id.toString() === d?.target.toString());

        const milestoneOffset = 15;

        let targetOffset = 0;

        if (targetNode?.nodeType === 'bpmn:endEvent')
          targetOffset = milestoneWidth + dayWidth / 2 - milestoneOffset;
        if (targetNode?.type === 'milestone' && targetNode?.nodeType !== 'bpmn:endEvent') {
          targetOffset = milestoneWidth - milestoneOffset;
        }

        let sourceOffset = 0;

        if (sourceNode?.nodeType === 'bpmn:startEvent')
          sourceOffset = milestoneWidth + dayWidth / 2 - milestoneOffset;
        if (sourceNode?.type === 'milestone' && sourceNode?.nodeType !== 'bpmn:startEvent') {
          sourceOffset = milestoneWidth - milestoneOffset;
        }

        if (sourceNode && targetNode) {
          const startX = sourceNode.x2;
          const startY = sourceNode.y + GANT_ROW_HEIGHT / 2;
          const targetX = targetNode.x1;
          const targetY = targetNode.y + GANT_ROW_HEIGHT / 2;

          const lineGenerator = d3.line().curve(d3.curveBumpX);
          const pathData = lineGenerator([
            [startX - sourceOffset, startY],
            [startX + milestoneOffset, startY],
            [startX + milestoneOffset, startY + GANT_ROW_HEIGHT / 2],
            [targetX - milestoneOffset, startY + GANT_ROW_HEIGHT / 2],
            [targetX - milestoneOffset, targetY],
            [targetX + targetOffset, targetY],
          ]);
          // const pathData = lineGenerator([
          //   [startX - sourceOffset, startY],
          //   [startX + 10, startY],
          //   [startX + 10, startY + 30],
          //   [targetX - 10, startY + 30],
          //   [targetX - 10, targetY],
          //   [targetX + targetOffset, targetY],
          // ]);

          // Add link path
          const path = group
            .append('path')
            .classed(`link link-source-${d?.source} link-target-${d?.target}`, true)
            // .attr('class', 'link')
            .attr('d', pathData)
            .attr('stroke', fillColor)
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('stroke-dasharray', '5,5')
            .attr('marker-end', 'url(#arrow)');

          // Cross initialy hidden
          // const pathLength = path?.node()?.getTotalLength() ?? 0;
          // const midpoint = path?.node()?.getPointAtLength(pathLength / 2) ?? {
          //   x: 0,
          //   y: 0,
          // };

          //   const cross = group
          //     .append('text')
          //     .classed(`cross cross-source-${d?.source} cross-target-${d?.target}`, true)
          //     .attr('x', midpoint.x)
          //     .attr('y', midpoint.y)
          //     .attr('dy', '0.35em')
          //     .attr('text-anchor', 'middle')
          //     .attr('font-size', 12)
          //     .attr('fill', 'red')
          //     .style('cursor', 'pointer')
          //     .style('pointer-events', 'auto')
          //     .style('opacity', 0)
          //     .style('transition', 'opacity 0.3s ease')
          //     .text('✖')
          //     .on('click', function () {
          //       if (d?.source && d?.target) {
          //         onDeleteTaskDependency(d.source, d.target);
          //       }
          //     })
          //     .on('mouseover', function () {
          //       cross.style('opacity', 1);
          //     })
          //     .on('mouseout', function () {
          //       cross.style('opacity', 0);
          //     });

          //   // Add hover effect
          //   path
          //     .on('mouseover', function () {
          //       cross.style('opacity', 1);
          //     })
          //     .on('mouseout', function () {
          //       cross.style('opacity', 0);
          //     });
        }
      });

      // ======================================

      // svg.select('defs').remove();
      // const defs = svg.append('defs');

      // defs
      //   .append('marker')
      //   .attr('id', 'arrow')
      //   .attr('viewBox', '0 0 10 10')
      //   .attr('refX', 9)
      //   .attr('refY', 5)
      //   .attr('markerWidth', 4)
      //   .attr('markerHeight', 4)
      //   .attr('orient', 'auto-start-reverse')
      //   .append('path')
      //   .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      //   .attr('fill', fillColor);

      // svg
      //   .selectAll('.link')
      //   .data(links)
      //   .join('path')
      //   .attr('class', 'link')
      //   .attr('d', (d) => {
      //     const sourceNode = nodes.find((node) => node.id.toString() === d?.source.toString());
      //     const targetNode = nodes.find((node) => node.id.toString() === d?.target.toString());

      //     if (sourceNode && targetNode) {
      //       const startX = sourceNode.x1 + sourceNode.width;
      //       const startY = sourceNode.y + GANT_ROW_HEIGHT / 2;
      //       const targetX = targetNode.x2;
      //       const targetY = targetNode.y + GANT_ROW_HEIGHT / 2;

      //       const gapInDays = (targetX - startX) / dayWidth;

      //       // const tasksBetween = nodes.filter(
      //       //   (task) =>
      //       //     task.x1 > sourceNode.x1 &&
      //       //     task.x2 < targetNode.x2 &&
      //       //     ((task.y > sourceNode.y && task.y < targetNode.y) ||
      //       //       (task.y < sourceNode.y && task.y > targetNode.y)),
      //       // );

      //       // if (tasksBetween.length > 0) {
      //       //   return d3.line()([
      //       //     [startX, startY], // Start point
      //       //     [startX + 10, startY], // To the right
      //       //     [startX + 10, startY + tasksBetween.length ? tasksBetween.length + 210 : 30], // To the bottom
      //       //     [targetX - 10, targetY], // To the bottom
      //       //     [targetX, targetY], // End point
      //       //   ]);
      //       // }

      //       if (Math.round(gapInDays) >= 1) {
      //         return d3.line()([
      //           [startX, startY],
      //           [startX + 10, startY],
      //           [startX + 10, startY + 60],
      //           [targetX, targetY],
      //         ]);
      //       }

      //       const lineGenerator = d3.line().curve(d3.curveBumpX);

      //       return lineGenerator([
      //         [startX, startY], // Start point
      //         [startX + 10, startY], // To the right
      //         [startX + 10, startY + 30], // To the bottom
      //         [targetX - 10, startY + 30], // To the left
      //         [targetX - 10, targetY], // To the bottom
      //         [targetX, targetY], // End point
      //       ]);
      //     }
      //     return '';
      //   })
      //   .attr('stroke', fillColor)
      //   .attr('stroke-width', 2)
      //   .attr('fill', 'none')
      //   .attr('stroke-dasharray', '5,5')
      //   .attr('marker-end', 'url(#arrow)');
    }, [timeLineRef, theme.palette.info.main, links, nodes, dayWidth, milestoneWidth]);

    useEffect(() => {
      drawLinks();
    }, [drawLinks, tasks, timeLineRef]);

    return (
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${timeLineWidth}px`,
          height: '100%',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
    );
  },
);
