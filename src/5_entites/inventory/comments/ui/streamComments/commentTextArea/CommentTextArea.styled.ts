import styled from '@emotion/styled';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

export const CommentTextAreaStyled = styled(TextareaAutosize)`
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  min-height: 50px;
  background: ${({ theme }) => theme.palette.neutral.backdrop};
  padding: 10px;

  border-radius: 5px 0 0 5px;
  border: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};

  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.palette.neutralVariant.iconDisabled};
  }
`;
