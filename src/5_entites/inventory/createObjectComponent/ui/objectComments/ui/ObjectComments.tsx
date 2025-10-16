import { useState } from 'react';
import { Typography } from '@mui/material';
import { Search, Close } from '@mui/icons-material';

import {
  Box,
  ErrorPage,
  commentsApi,
  LoadingAvataa,
  InputWithIcon,
  useTranslate,
  useDebounceValue,
  useUser,
} from '6_shared';
import { CommentsInput } from './commentsInput/CommentsInput';
import * as SC from './ObjectComments.styled';
import { useGetObjectCommentsData } from '../api/useGetObjectCommentsData';
import { CommentsAccordion } from './commentsAccordion/CommentsAccordion';

interface IProps {
  objectId: number | null;
}

export const ObjectComments = ({ objectId }: IProps) => {
  const translate = useTranslate();
  const [comment, setComment] = useState<string>('');
  const [searchValue, setSearchValue] = useState(' ');
  const [isInputFilled, setIsInputFilled] = useState(false);

  const debounceValue = useDebounceValue(searchValue);

  const { user } = useUser();

  const { commentsData, isCommentsDataFetching, isCommentsDataError, commentsRefetchFn } =
    useGetObjectCommentsData({
      objectId,
      searchQuery: debounceValue,
    });

  const [createComment] = commentsApi.useCreateCommentMutation();

  const handleAddComment = async () => {
    if (objectId === null || !comment) return;
    const commentToAdd = {
      author: user?.name,
      text: comment,
      object_id: objectId,
    };

    await createComment({ id: objectId!, body: commentToAdd });
    setComment('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsInputFilled(e.target.value.trim() !== '');
    setSearchValue(e.target.value);
  };

  const onIconClick = () => {
    setSearchValue('');
    if (isInputFilled) {
      setIsInputFilled(false);
    }
  };

  return (
    <SC.ObjectCommentsStyled>
      {!isCommentsDataFetching && isCommentsDataError ? (
        <Box>
          <ErrorPage
            error={{ message: translate('An error has occurred, please try again'), code: '404' }}
            refreshFn={commentsRefetchFn}
          />
        </Box>
      ) : (
        <>
          <SC.Header>
            <InputWithIcon
              iconPosition="right"
              widthPercent
              placeHolderText={translate('Search')}
              value={searchValue}
              onChange={handleSearchChange}
              icon={!isInputFilled ? <Search fontSize="small" /> : <Close fontSize="small" />}
              onIconClick={() => onIconClick()}
            />
          </SC.Header>
          {!isCommentsDataError && !isCommentsDataFetching && !commentsData?.comments.length && (
            <SC.CommentsErrorContent>
              <Typography>{translate('There are no comments')}</Typography>
            </SC.CommentsErrorContent>
          )}
          {isCommentsDataFetching && !isCommentsDataError ? (
            <SC.LoadingContainer>
              <LoadingAvataa />
            </SC.LoadingContainer>
          ) : (
            <>
              {commentsData?.comments.length !== 0 && (
                <SC.Body>
                  <CommentsAccordion commentsData={commentsData} user={user} />
                </SC.Body>
              )}
              <SC.Footer>
                <CommentsInput
                  handleAddComment={handleAddComment}
                  setComment={setComment}
                  comment={comment}
                />
              </SC.Footer>
            </>
          )}
        </>
      )}
    </SC.ObjectCommentsStyled>
  );
};
