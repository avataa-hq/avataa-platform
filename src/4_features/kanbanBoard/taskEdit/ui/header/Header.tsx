import { Button, Typography, useTheme } from '@mui/material';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { useTranslate } from '6_shared';
import { Container, HeaderStyled, NameActionsContainer } from './Header.styled';
import { CommentTextArea } from '../../../../../5_entites/inventory/comments/ui/streamComments/commentTextArea/CommentTextArea';

interface IProps {
  taskTitle: string;
  onSave?: (name: string) => void;
  disabled?: boolean;
}

export const Header = ({ taskTitle, onSave, disabled }: IProps) => {
  const translate = useTranslate();
  const { palette } = useTheme();
  const [isEdit, setIsEdit] = useState(false);
  const [value, setValue] = useState('');
  const height = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (value.trim() === '') setValue(taskTitle);
  }, [taskTitle]);

  const onClick = () => {
    if (!disabled) setIsEdit(true);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      onSave?.(value);
      setIsEdit(false);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      height.current = containerRef.current.clientHeight;
    }
  }, [isEdit]);

  return (
    <Container>
      <HeaderStyled ref={containerRef} isedit={String(isEdit)}>
        {!isEdit && (
          <Typography
            sx={{ width: '100%', height: '100%', cursor: 'pointer' }}
            onClick={onClick}
            fontSize="inherit"
          >
            {value || <p style={{ opacity: 0.4 }}>{translate('Add a summary')}</p>}
          </Typography>
        )}
        {isEdit && (
          <CommentTextArea
            maxLength={500}
            id="Summary"
            name="Summary"
            value={value}
            autoFocus
            disabled={disabled}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            style={{
              width: '100%',
              height: height.current,
              background: 'transparent',
              border: 'none',
              fontSize: '20px',
            }}
          />
        )}
      </HeaderStyled>

      <NameActionsContainer style={{ display: isEdit ? 'flex' : 'none' }}>
        <Button
          sx={{ height: 30 }}
          variant="outlined.icon"
          onClick={() => {
            onSave?.(value);
            setIsEdit(false);
          }}
        >
          <DoneIcon style={{ fill: palette.success.main }} />
        </Button>
        <Button
          sx={{ height: 30 }}
          variant="outlined.icon"
          onClick={() => {
            setValue(taskTitle);
            setIsEdit(false);
          }}
        >
          <ClearIcon style={{ fill: palette.error.main }} />
        </Button>
      </NameActionsContainer>
    </Container>
  );
};
