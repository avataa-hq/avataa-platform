import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';

const scaleUp = keyframes`
  from { transform: scale(1); }
  to { transform: scale(1.02); }
`;

interface IProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isDragging: boolean;
}
export const UploadZoneStyled = styled.div<IProps>`
  border: 2px dashed
    ${({ theme, isDragging }) =>
      isDragging ? theme.palette.primary.main : theme.palette.neutralVariant.outline};
  border-radius: 10px;
  padding: 5%;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: ${({ theme, isDragging }) =>
    isDragging ? theme.palette.background.default : theme.palette.background.paper};

  ${(props) =>
    props.isDragging &&
    css`
      animation: ${scaleUp} 0.2s ease-in-out;
    `}

  &:hover {
    border-color: ${(props) => props.theme.palette.primary.light};
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const UploadZoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const UploadZoneContentText = styled.div`
  opacity: 0.3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;
