import { useEffect, useRef, useState } from 'react';
import { SendRounded } from '@mui/icons-material';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';

import { Comment } from '6_shared/ui/comment';
import {
  Comment as CommentModel,
  LoadingAvataa,
  commentsApi,
  useTranslate,
  getErrorMessage,
  useUser,
} from '6_shared';

interface ObjectCommentsProps {
  objectId: number;
  searchString?: string;
}

const { useLazyGetAllCommentsQuery, useCreateCommentMutation } = commentsApi;

const COMMENTS_PER_PAGE = 10;

export const ObjectComments = ({ objectId, searchString }: ObjectCommentsProps) => {
  const translate = useTranslate();
  const { tokenParsed } = useUser();
  const commentsListRef = useRef<HTMLDivElement>();
  const commentInputRef = useRef<HTMLTextAreaElement>();
  const [pageOffset, setPageOffset] = useState(0);
  const [comments, setComments] = useState<CommentModel[][]>([]);

  const [getComments, { data, isLoading: areCommentsLoading }] = useLazyGetAllCommentsQuery();
  const [createComment, { isLoading: isCreateCommentLoading }] = useCreateCommentMutation();

  useEffect(() => {
    setPageOffset(0);
    setComments([]);
  }, [objectId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getComments({
          id: objectId,
          offset: pageOffset * COMMENTS_PER_PAGE,
          contains: searchString,
          limit: COMMENTS_PER_PAGE,
        }).unwrap();
        if (response.comments.length)
          setComments((prev) => {
            const commentsCopy = [...prev];
            commentsCopy[pageOffset] = response.comments;

            return commentsCopy;
          });
      } catch (error) {
        console.error(error);
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
      }
    };

    fetchComments();
  }, [comments.length, data, getComments, objectId, pageOffset, searchString]);

  useEffect(() => {
    if (!commentsListRef.current) return () => {};
    const commentsListElement = commentsListRef.current;

    const scrollEventListener = () => {
      const isScrolledToBottom =
        commentsListElement.scrollTop + commentsListElement.clientHeight >=
        commentsListElement.scrollHeight - 1;

      if (isScrolledToBottom && data && data.quantity > comments.flat().length) {
        setPageOffset((prev) => prev + 1);
      }
    };

    commentsListElement.addEventListener('scroll', scrollEventListener);
    return () => commentsListElement?.removeEventListener('scroll', scrollEventListener);
  }, [comments, comments.length, data]);

  const handleCreateComment = async (objId: number, text?: string) => {
    try {
      if (!text) throw new Error('Comment cannot be empty');

      await createComment({
        id: objId,
        body: {
          text,
          author: tokenParsed?.name,
          object_id: objId,
        },
      }).unwrap();
      setPageOffset(0);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  return (
    <Box component="div" display="flex" flexDirection="column" height="100%" width="100%">
      <Box
        component="div"
        width="100%"
        height="100%"
        flex={1}
        overflow="auto"
        ref={commentsListRef}
        display="flex"
        flexDirection="column"
        gap="20px"
        pr="5px"
      >
        {comments.length === 0 && areCommentsLoading && (
          <Box
            component="div"
            width="100%"
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <LoadingAvataa />
          </Box>
        )}
        {comments.length === 0 && !areCommentsLoading && (
          <Box
            component="div"
            width="100%"
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography>{translate('There are no comments')}</Typography>
          </Box>
        )}
        {comments.flat().map((comment, index) => (
          <Comment
            key={comment.id}
            authorName={comment.author}
            text={comment.text}
            date={new Date(comment.changed ?? comment.created ?? '1.1.1999').toLocaleString(
              'en-GB',
              {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              },
            )}
            float={comment.author === tokenParsed?.name ? 'right' : 'left'}
          />
        ))}
      </Box>

      {data && data.quantity > 0 && <Typography mb="10px">{data.quantity} comments</Typography>}
      <TextField
        multiline
        inputRef={commentInputRef}
        InputProps={{
          endAdornment:
            areCommentsLoading || isCreateCommentLoading ? (
              <CircularProgress size={20} />
            ) : (
              <Button
                variant="contained.icon"
                sx={{ p: '5px' }}
                onClick={async () => {
                  await handleCreateComment(objectId, commentInputRef.current?.value);
                  if (commentInputRef.current) {
                    commentInputRef.current.value = '';
                    commentsListRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                <SendRounded />
              </Button>
            ),
        }}
      />
    </Box>
  );
};
