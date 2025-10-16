import styled from '@emotion/styled';
import { Typography } from '@mui/material';

export const UserCommentStyled = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 100px;
`;

export const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`;
export const UserCommentText = styled(Typography)`
  padding-left: 50px;
  width: 100%;
  word-break: break-all;
`;
export const UserCommentActions = styled(Typography)`
  margin-top: 10px;
  padding: 5px 30px;
  gap: 5px;
  display: 'flex';
`;
