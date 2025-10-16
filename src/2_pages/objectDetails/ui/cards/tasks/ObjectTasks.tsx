import { Avatar, Box, Typography } from '@mui/material';

import { useTranslate } from '6_shared';
import { Task } from '6_shared/api/camunda/tasklist/types';

import { ObjectTasksContainer } from '../../ObjectDetailsPage.styled';

interface ObjectTasksProps {
  tasks: Pick<
    Task,
    'id' | 'name' | 'assignee' | 'creationTime' | 'completionTime' | 'processDefinitionId'
  >[];
}

export const ObjectTasks = ({ tasks }: ObjectTasksProps) => {
  const translate = useTranslate();

  return (
    <ObjectTasksContainer>
      {!tasks?.length && (
        <Box
          component="div"
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography>{translate('There are no tasks')}</Typography>
        </Box>
      )}
      {tasks?.map((task) => (
        <Box key={task.id} component="div" display="flex" flexDirection="column" gap="10px">
          <Box component="div" display="flex" gap="10px">
            <Avatar className="user-avatar" alt="Martin" sx={{ width: '36px', height: '36px' }} />
            <Box component="div">
              <Typography
                fontSize="13px"
                lineHeight="16px"
                letterSpacing="-0.3px"
                sx={{ opacity: 0.6 }}
              >
                {new Date(task.completionTime ?? task.creationTime ?? '1.1.1999').toLocaleString(
                  'en-GB',
                  {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  },
                )}
              </Typography>
              <Typography
                fontSize="13px"
                lineHeight="16px"
                letterSpacing="-0.3px"
                color={(theme) => theme.palette.primary.main}
              >
                {task.assignee}
              </Typography>
            </Box>
          </Box>
          <Typography fontSize="14px" lineHeight="17px">
            {task.name}
          </Typography>
        </Box>
      ))}
    </ObjectTasksContainer>
  );
};
