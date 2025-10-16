import {
  Autocomplete,
  Button,
  Divider,
  IconButton,
  Menu,
  Popper,
  TextField,
  Tooltip,
  useTheme,
} from '@mui/material';
import { useRef, useState } from 'react';
import { ActionTypes, useDebounceValue, useTranslate, useUser } from '6_shared';
import { useCreateComment, useDeleteComment, useUpdateComment } from '4_features';
import { Dayjs } from 'dayjs';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import { IDefaultOptions } from '5_entites';
import { UserRepresentation } from '6_shared/api/keycloak/users/types';
import {
  CommentsListContainer,
  // HintContainer,
  // SearchValueContainer,
  StreamCommentsStyled,
  TextAreaActionsContainer,
  TextAreaContainer,
} from './StreamComments.styled';
import { UserComment } from './userComment/UserComment';
import { CommentTextArea } from './commentTextArea/CommentTextArea';
import { UserCommentSkeleton } from './userComment/UserCommentSkeleton';
import { useGetObjectCommentsData } from '../../api';
import { DateRangeCustomizer } from '../dateRangeCustomizer/DateRangeCustomizer';
import { formatQueryDate } from '../../../lib';
import { DefaultCommentsModal } from '../CommentsComponents';
// import { IDefaultOptions } from '../../../model';

const MANAGE_COMMENTS_ROLE = '_manage_comments';

interface IProps {
  objectId: number;
  usersData?: Record<string, UserRepresentation>;
  permissions?: Record<ActionTypes, boolean>;
}

export const StreamComments = ({ objectId, permissions, usersData }: IProps) => {
  const translate = useTranslate();
  const { palette } = useTheme();

  const { user } = useUser();

  const newCommentRef = useRef<HTMLTextAreaElement | null>(null);
  const dateRangeBtnRef = useRef<HTMLButtonElement | null>(null);

  const [searchValue, setSearchValue] = useState('');
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);
  const [isOpenDefaultCommentsModal, setIsOpenDefaultCommentsModal] = useState(false);
  const [defaultOptions, setDefaultOptions] = useState<IDefaultOptions[]>([]);

  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
  const [timeFrom, setTimeFrom] = useState<Dayjs | null>(null);
  const [dateTo, setDateTo] = useState<Dayjs | null>(null);
  const [timeTo, setTimeTo] = useState<Dayjs | null>(null);

  const isDateRangeActive = dateTo || dateFrom || timeTo || timeFrom;

  const debounceSearchValue = useDebounceValue(searchValue);

  const { commentsData, isCommentsDataFetching } = useGetObjectCommentsData({
    objectId,
    searchQuery: debounceSearchValue,
    endDate: formatQueryDate(dateTo, timeTo),
    startDate: formatQueryDate(dateFrom, timeFrom),
    page: undefined,
  });

  const { createComment } = useCreateComment();
  const { deleteComment } = useDeleteComment();
  const { updateComment } = useUpdateComment();

  const onNewCommentActionClick = async (clickType: 'cancel' | 'save') => {
    if (clickType === 'save' && newCommentRef.current?.value?.trim() !== '') {
      await createComment(objectId, {
        author: user?.name,
        object_id: objectId,
        text: newCommentRef.current?.value ?? '',
      });
    }
    if (newCommentRef.current) newCommentRef.current.value = '';
  };

  return (
    <StreamCommentsStyled>
      <TextAreaContainer>
        <CommentTextArea
          ref={newCommentRef}
          placeholder="Add a comment..."
          maxRows={2}
          style={{ maxHeight: 300, resize: 'none' }}
          readOnly={isCommentsDataFetching}
          onKeyDown={async (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              await onNewCommentActionClick('save');
            }
          }}
        />
        <TextAreaActionsContainer>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Autocomplete
              options={defaultOptions.sort((a, b) => -b.group.localeCompare(a.group))}
              getOptionLabel={(option) => `${option.id}: ${option.text}`}
              groupBy={(option) => option.group}
              onChange={(_, newValue) => {
                if (newCommentRef.current) {
                  newCommentRef.current.value = newValue?.text ?? '';
                }
              }}
              renderInput={(params) => <TextField {...params} multiline label="Enter a comment" />}
              fullWidth
              // eslint-disable-next-line react/no-unstable-nested-components
              PopperComponent={(props) => <Popper {...props} placement="top-start" />}
            />
            <Tooltip title="Configure default comments">
              <IconButton onClick={() => setIsOpenDefaultCommentsModal(true)}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            <IconButton
              ref={dateRangeBtnRef}
              onClick={() => setIsDateRangeModalOpen(true)}
              disabled={permissions?.update !== true}
            >
              <FilterAltIcon
                style={{ fill: isDateRangeActive ? palette.primary.main : palette.info.main }}
              />
            </IconButton>
          </div>

          <Button
            variant="outlined.icon"
            onClick={() => onNewCommentActionClick('save')}
            disabled={permissions?.update !== true}
          >
            {translate('Send')}
          </Button>
        </TextAreaActionsContainer>

        {/* <HintContainer>
          <Typography variant="overline">(ctrl+enter) to send</Typography>
        </HintContainer> */}
      </TextAreaContainer>
      <Divider />
      <CommentsListContainer>
        {isCommentsDataFetching ? (
          <>
            <UserCommentSkeleton />
            <UserCommentSkeleton />
            <UserCommentSkeleton />
          </>
        ) : (
          commentsData?.comments?.map((comment) => (
            <UserComment
              usersData={usersData}
              key={comment.id}
              comment={comment}
              user={user}
              onDeleteComment={({ id }) => deleteComment(id)}
              onSaveComment={(currentComment) => updateComment(currentComment.id, currentComment)}
              permissions={permissions}
            />
          ))
        )}
      </CommentsListContainer>
      <Menu
        open={isDateRangeModalOpen}
        onClose={() => setIsDateRangeModalOpen(false)}
        anchorEl={dateRangeBtnRef.current}
      >
        <div style={{ width: 400 }}>
          <DateRangeCustomizer
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            timeFrom={timeFrom}
            setTimeFrom={setTimeFrom}
            timeTo={timeTo}
            setTimeTo={setTimeTo}
          />
        </div>
      </Menu>
      <DefaultCommentsModal
        isModalOpen={isOpenDefaultCommentsModal}
        handleClose={() => setIsOpenDefaultCommentsModal(false)}
        user={user}
        setDefaultOptions={setDefaultOptions}
        permissions={permissions}
      />
    </StreamCommentsStyled>
  );
};
