import { useMemo } from 'react';
import { Tooltip } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PestControlIcon from '@mui/icons-material/PestControl';
import { IKanbanTask } from '6_shared';

interface IProps {
  task?: IKanbanTask | null;
}

export const KanbanIssueType = ({ task }: IProps) => {
  const taskIssueType = useMemo(() => {
    if (!task?.issueTypeId) return null;

    const taskType = task[task.issueTypeId];

    if (taskType === 'Task') {
      return { taskType: 'Task', icon: <CheckBoxIcon color="primary" fontSize="small" /> };
    }
    if (taskType === 'Sub-task') {
      return { taskType: 'Sub-task', icon: <FactCheckIcon color="primary" fontSize="small" /> };
    }
    if (taskType === 'Bug') {
      return {
        taskType: 'Bug',
        icon: <PestControlIcon color="error" fontSize="small" />,
      };
    }

    return null;
  }, [task]);

  return taskIssueType ? (
    <Tooltip title={taskIssueType.taskType} placement="bottom">
      {taskIssueType.icon}
    </Tooltip>
  ) : null;
};
