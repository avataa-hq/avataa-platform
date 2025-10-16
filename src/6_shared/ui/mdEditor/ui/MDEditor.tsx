import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import MDEditor, { PreviewType, RefMDEditor } from '@uiw/react-md-editor';
import { Button, SxProps, Theme, Typography, useTheme } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ActionButtonContainer, MdEditorStyled } from './MDEditor.styled';

const MAX_HEIGHT = 500;
const MIN_HEIGHT = 100;

const getInitialHeight = (markdown?: string) => {
  if (!markdown || markdown.trim() === '') return MIN_HEIGHT;
  const l = markdown.length * 2;
  return l < MAX_HEIGHT ? l : MAX_HEIGHT;
};

interface IProps {
  markdown: string;
  setMarkdown: (md: string) => void;
  maxHeight?: number;
  minHeight?: number;
  initialHeight?: number | string;
  customSx?: SxProps<Theme>;
  onSaveClick?: (markdown: string) => void;
  visibleDragbar?: boolean;
  autoSave?: boolean;
  disabled?: boolean;
}

export const MdEditor = ({
  markdown,
  setMarkdown,
  maxHeight,
  minHeight,
  initialHeight,
  customSx,
  onSaveClick,
  visibleDragbar = true,
  autoSave,
  disabled,
}: IProps) => {
  const { palette } = useTheme();

  const editorRef = useRef<RefMDEditor | null>(null);
  const height = useRef<number>(getInitialHeight(markdown));
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [mdValue, setMdValue] = useState(markdown);
  const [preview, setPreview] = useState<PreviewType>('preview');

  useEffect(() => {
    setMdValue(markdown);
  }, [markdown]);

  const onContainerClick = () => {
    if (preview === 'preview' && !disabled) setPreview('edit');
  };

  const onActionBtnClick = (type: 'save' | 'cancel') => {
    if (type === 'save') {
      setMarkdown(editorRef.current?.markdown ?? '');
      onSaveClick?.(editorRef.current?.markdown ?? '');
    }
    setPreview('preview');
  };

  const onKeyEditorDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.code === 'KeyS' && e.ctrlKey) {
      e.preventDefault();
      setMarkdown(editorRef?.current?.markdown ?? '');
      onSaveClick?.(editorRef.current?.markdown ?? '');
      setPreview('preview');
    }
  };

  // useEffect(() => {
  //   if (containerRef.current) {
  //     height.current = containerRef.current.clientHeight;
  //   }
  // }, [preview]);

  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', `${palette.mode}`);
  }, [palette.mode]);

  return (
    <MdEditorStyled
      ref={containerRef}
      onClick={onContainerClick}
      // sx={customSx ? { ...customSx } : { height: 'fit-content' }}
      sx={{ height: 'fit-content', overflow: 'hidden', overflowWrap: 'break-word', ...customSx }}
    >
      {preview === 'edit' && (
        <>
          <MDEditor
            onKeyDown={onKeyEditorDown}
            ref={editorRef}
            value={mdValue}
            onChange={(value) => setMdValue(value ?? '')}
            preview={preview}
            extraCommands={[]}
            autoFocus
            textareaProps={{
              placeholder: 'Please enter Markdown text',
              maxLength: 1000,
            }}
            visibleDragbar={visibleDragbar}
            onBlur={() => {
              if (autoSave) {
                setMarkdown(editorRef.current?.markdown ?? '');
              }
            }}
            height={initialHeight ?? height.current}
            maxHeight={maxHeight ?? MAX_HEIGHT}
            minHeight={minHeight ?? MIN_HEIGHT}
            onHeightChange={(value) => {
              if (!value) return;
              height.current = +value;
            }}
          />
          <ActionButtonContainer>
            <Button
              sx={{ height: 30 }}
              variant="outlined.icon"
              onClick={() => onActionBtnClick('save')}
            >
              <DoneIcon style={{ fill: palette.success.main }} />
            </Button>
            <Button
              sx={{ height: 30 }}
              variant="outlined.icon"
              onClick={() => onActionBtnClick('cancel')}
            >
              <ClearIcon style={{ fill: palette.error.main }} />
            </Button>
          </ActionButtonContainer>
        </>
      )}
      {preview === 'preview' && markdown.trim().length === 0 && (
        <div
          className="wmde-markdown"
          style={{
            height: '100%',
            background: 'transparent',
            padding: '10px 0',
          }}
        >
          <Typography color="darkgray">Add a description</Typography>
        </div>
      )}
      {preview === 'preview' && markdown.trim().length > 0 && (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      )}
    </MdEditorStyled>
  );
};
