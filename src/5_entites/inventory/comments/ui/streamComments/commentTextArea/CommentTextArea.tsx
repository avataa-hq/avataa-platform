import { TextareaAutosizeProps } from '@mui/base/TextareaAutosize';
import { forwardRef } from 'react';
import { CommentTextAreaStyled } from './CommentTextArea.styled';

interface IProps extends TextareaAutosizeProps {}

export const CommentTextArea = forwardRef<HTMLTextAreaElement, IProps>((props, ref) => {
  return <CommentTextAreaStyled ref={ref} {...props} />;
});
