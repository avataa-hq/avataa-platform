import { Avatar, Button, Typography } from '@mui/material';
import { memo, useEffect, useMemo, useState } from 'react';
import { ActionTypes, Comment, useTranslate } from '6_shared';
import { KeycloakTokenParsed } from 'keycloak-js';
import { UserRepresentation } from '6_shared/api/keycloak/users/types';
import {
  UserCommentActions,
  UserCommentStyled,
  UserCommentText,
  UserInfoContainer,
} from './UserComment.styled';
import { CommentTextArea } from '../commentTextArea/CommentTextArea';
import { CommentAction } from '../commentTextArea/CommentActions';
import { formatDate } from '../../../../lib';

interface IProps {
  comment: Comment;
  user?: KeycloakTokenParsed;
  onSaveComment?: (comment: Comment) => void;
  onDeleteComment?: (comment: Comment) => void;
  usersData?: Record<string, UserRepresentation>;
  permissions?: Record<ActionTypes, boolean>;
}

export const UserComment = memo(
  ({ comment, user, onDeleteComment, onSaveComment, usersData, permissions }: IProps) => {
    const translate = useTranslate();

    const { created, text, author, changed } = comment;

    const currentCommentUser = useMemo(() => {
      const correctCommentName = author.toLowerCase().trim();
      return usersData?.[correctCommentName];
    }, [author, usersData]);

    const [hovered, setHovered] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [userComment, setUserComment] = useState(text);

    const onCommentActionsClick = (clickType: 'edit' | 'delete') => {
      if (clickType === 'edit') setIsEdit(true);
      if (clickType === 'delete') onDeleteComment?.(comment);
    };

    const onEditingCommentActionClick = (clickType: 'save' | 'cancel') => {
      if (clickType === 'cancel') {
        setUserComment(text);
      }
      if (clickType === 'save') {
        onSaveComment?.({ ...comment, text: userComment });
      }
      setIsEdit(false);
    };

    useEffect(() => {
      return () => setIsEdit(false);
    }, []);

    return !isEdit ? (
      <UserCommentStyled
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <UserInfoContainer>
          <Avatar src={currentCommentUser?.attributes?.picture?.[0]} alt={author} />
          <Typography variant="body2">{author}</Typography>
          <Typography sx={{ opacity: 0.5 }} variant="subtitle2">
            {formatDate(changed ?? created, 'dd.MM.yyyy HH:mm:ss')}
          </Typography>
          {changed && (
            <Typography sx={{ opacity: 0.5 }} variant="subtitle2">
              <i>edited</i>
            </Typography>
          )}
        </UserInfoContainer>
        <UserCommentText variant="subtitle1">{userComment}</UserCommentText>

        <UserCommentActions style={{ opacity: hovered ? 1 : 0.4 }}>
          <Button
            size="small"
            color="info"
            sx={{ height: 25, p: 0 }}
            variant="text"
            onClick={() => onCommentActionsClick('edit')}
            disabled={permissions?.update !== true}
          >
            {translate('Edit')}
          </Button>

          <Button
            size="small"
            color="error"
            sx={{ height: 25, p: 0 }}
            variant="text"
            onClick={() => onCommentActionsClick('delete')}
            disabled={permissions?.update !== true}
          >
            {translate('Delete')}
          </Button>
        </UserCommentActions>
      </UserCommentStyled>
    ) : (
      <UserCommentStyled>
        <CommentTextArea
          value={userComment}
          onChange={(event) => setUserComment(event.target.value)}
          style={{ marginBottom: 10, resize: 'none' }}
          maxRows={10}
          onKeyDown={async (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              onSaveComment?.({ ...comment, text: userComment });
            }
          }}
        />
        <CommentAction onClick={onEditingCommentActionClick} />
      </UserCommentStyled>
    );
  },
);
