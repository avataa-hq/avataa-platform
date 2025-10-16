import { Skeleton } from '@mui/material';
import { UserCommentStyled, UserCommentText, UserInfoContainer } from './UserComment.styled';

export const UserCommentSkeleton = () => {
  return (
    <UserCommentStyled>
      <UserInfoContainer>
        <Skeleton variant="circular" style={{ width: 50, height: 50 }} />
        <Skeleton variant="text" style={{ width: 200 }} />
      </UserInfoContainer>
      <UserCommentText>
        <Skeleton variant="rounded" style={{ width: '80%', height: 40 }} />
      </UserCommentText>
    </UserCommentStyled>
  );
};
