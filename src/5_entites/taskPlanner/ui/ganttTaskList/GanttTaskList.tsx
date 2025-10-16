import { SimpleTreeView } from '@mui/x-tree-view';
import { memo, useMemo } from 'react';
import { GANT_ROW_HEIGHT, IGanttTask } from '6_shared';
import { GanttTaskListBodyItem } from './ganttTaskListBodyItem/GanttTaskListBodyItem';
import { TreeItemStyled, TreeItemTaskStyled } from './GanttTaskList.styled';
import { GanttTaskListCreateComponent } from './ganttTaskListCreateComponent/GanttTaskListCreateComponent';

type TaskWithChildren = IGanttTask & { children: IGanttTask[] };

interface IProps {
  expandItems?: string[];
  setExpandItems?: (items: string[]) => void;
  tasks?: IGanttTask[];
  handleCreateGanttTaskProject?: (projectName: string) => void;

  hoverTask?: IGanttTask | null;
  setHoverTask?: (task: IGanttTask | null) => void;
  projectExpanded?: boolean;
}

export const GanttTaskList = memo(
  ({
    expandItems,
    hoverTask,
    setExpandItems,
    setHoverTask,
    tasks,
    handleCreateGanttTaskProject,
    projectExpanded,
  }: IProps) => {
    // const tasksWithChildren = useMemo(() => {
    //   const groupedTasks: Record<string, TaskWithChildren> = {};

    //   tasks?.forEach((task) => {
    //     if (task.type === 'project') {
    //       groupedTasks[task.id] = { ...task, children: [] as TaskWithChildren[] };
    //     }

    //     if (task.type !== 'project') {
    //       if (task?.project) {
    //         groupedTasks[task.project].children.push(task);
    //       } else {
    //         groupedTasks[task.id] = { ...task, children: [] };
    //       }
    //     }
    //   });

    //   return Object.values(groupedTasks);
    // }, [tasks]);

    const tasksWithChildren = useMemo(() => {
      const groupedTasks = new Map<string, TaskWithChildren>();

      tasks?.forEach((task) => {
        if (task.type === 'project') {
          groupedTasks.set(task.id.toString(), { ...task, children: [] });
        }

        if (task.type !== 'project') {
          if (task?.project) {
            groupedTasks.get(task.project)?.children.push(task);
          } else {
            groupedTasks.set(task.id.toString(), { ...task, children: [] });
          }
        }
      });

      return Array.from(groupedTasks.values());
    }, [tasks]);

    // eslint-disable-next-line no-nested-ternary
    // const displayedTasks = !projectExpanded
    //   ? tasksWithChildren[0]
    //     ? [tasksWithChildren[0]]
    //     : []
    //   : tasksWithChildren;

    return (
      <SimpleTreeView
        expandedItems={expandItems}
        onExpandedItemsChange={(_, itemIds) => {
          setExpandItems?.(itemIds);
        }}
      >
        {projectExpanded &&
          tasksWithChildren.map((project, idx) => (
            <TreeItemStyled
              key={project.id.toString()}
              itemId={project.id.toString()}
              barcolor={project.children.length ? '#76BDFF' : undefined}
              aria-expanded={false}
              sx={
                idx === 0
                  ? {
                      '& .MuiTreeItem-iconContainer': {
                        display: 'none',
                      },
                    }
                  : {}
              }
              label={
                <GanttTaskListBodyItem
                  hovered={hoverTask?.id === project.id}
                  text={project.name}
                  progressValue={project.type === 'milestone' ? undefined : project.progress}
                  textWeight="bold"
                  height={GANT_ROW_HEIGHT}
                />
              }
            >
              {project.children.map((task) => (
                <TreeItemTaskStyled
                  key={task.id.toString()}
                  itemId={task.id.toString()}
                  onMouseEnter={() => setHoverTask?.(task)}
                  onMouseLeave={() => setHoverTask?.(null)}
                  label={
                    <GanttTaskListBodyItem
                      hovered={hoverTask?.id === task.id}
                      text={task.name}
                      progressValue={task.type === 'milestone' ? undefined : task.progress}
                      height={GANT_ROW_HEIGHT}
                    />
                  }
                />
              ))}
            </TreeItemStyled>
          ))}

        <GanttTaskListCreateComponent handleCreateGanttTaskProject={handleCreateGanttTaskProject} />
      </SimpleTreeView>
    );
  },
);
