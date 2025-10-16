import { useState } from 'react';
import { Box, Button, IconButton, TextField } from '@mui/material';
import { Add, AddCircleOutline } from '@mui/icons-material';
import { ClickAwayListener, GANT_ROW_HEIGHT, useTranslate } from '6_shared';

interface IProps {
  handleCreateGanttTaskProject?: (projectName: string) => void;
}

export const GanttTaskListCreateComponent = ({ handleCreateGanttTaskProject }: IProps) => {
  const translate = useTranslate();
  const [isCreatingNewTask, setIsCreatingNewTask] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');

  const onAddProjectClick = () => {
    if (!inputValue.trim()) {
      setInputError('Project name is required');
      return;
    }
    handleCreateGanttTaskProject?.(inputValue.trim());
    setInputValue('');
    setIsCreatingNewTask(false);
  };

  const onInputKeyDownClick = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onAddProjectClick();
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!e.target.value.trim()) {
      setInputError('Project name is required');
    } else {
      setInputError('');
    }
  };

  const onClickAway = () => {
    setIsCreatingNewTask(false);
    setInputValue('');
    setInputError('');
  };

  return (
    <Box
      component="div"
      sx={{
        height: `${GANT_ROW_HEIGHT}px`,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {!isCreatingNewTask && (
        <Button startIcon={<Add />} onClick={() => setIsCreatingNewTask(true)}>
          {translate('Create a project')}
        </Button>
      )}

      {isCreatingNewTask && (
        <ClickAwayListener onClickAway={onClickAway}>
          <Box
            component="div"
            sx={{ display: 'flex', alignItems: 'center', gap: '5px', width: '100%' }}
          >
            <TextField
              className="projectName"
              variant="outlined"
              fullWidth
              size="small"
              placeholder="Project name"
              value={inputValue}
              onChange={onInputChange}
              onKeyDown={onInputKeyDownClick}
              error={!!inputError}
              helperText={inputError}
              sx={{
                '.MuiFormHelperText-root': {
                  position: 'absolute',
                  bottom: '-20px',
                  left: 0,
                },
              }}
            />
            <IconButton onClick={() => onAddProjectClick()}>
              <AddCircleOutline />
            </IconButton>
          </Box>
        </ClickAwayListener>
      )}
    </Box>
  );
};
