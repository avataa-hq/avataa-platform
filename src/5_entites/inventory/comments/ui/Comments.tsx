import { useEffect, useState } from 'react';
import {
  AccordionDetails,
  AccordionSummary,
  Typography,
  Avatar,
  IconButton,
  Autocomplete,
  TextField,
  Popper,
  Tooltip,
} from '@mui/material';
import { ExpandMore, Settings } from '@mui/icons-material';
import { Dayjs } from 'dayjs';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { useCreateComment } from '4_features';
import {
  DefaultCommentsModal,
  IDefaultOptions,
  RightPanelHeader,
  formatDate,
  formatQueryDate,
  useGetObjectCommentsData,
} from '5_entites';
import {
  ErrorPage,
  LoadingAvataa,
  useDebounceValue,
  useTranslate,
  ActionTypes,
  useUser,
} from '6_shared';

import * as SC from './Comments.styled';

interface IProps {
  objectId: number | null;
  newDrawerWidth?: number;
  isDrawerOpen?: boolean;
  searchValue?: string;
  userRoles?: string[] | null;
  permissions?: Record<ActionTypes, boolean>;
}
interface INewCommentsData {
  id: number;
  expanded: boolean;
  author: string;
  text: string;
  object_id: number;
  created: Date;
  changed: Date;
}
type FormValues = {
  comment: string;
};

const MANAGE_COMMENTS_ROLE = '_manage_comments';

export const Comments = ({
  objectId,
  newDrawerWidth,
  isDrawerOpen,
  searchValue: externalSearchValue,
  userRoles,
  permissions,
}: IProps) => {
  const translate = useTranslate();
  const { control, reset, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      comment: '',
    },
  });

  const { user } = useUser();

  const [searchValue, setSearchValue] = useState('');
  const [newCommentsData, setNewCommentsData] = useState<INewCommentsData[]>([]);
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
  const [timeFrom, setTimeFrom] = useState<Dayjs | null>(null);
  const [dateTo, setDateTo] = useState<Dayjs | null>(null);
  const [timeTo, setTimeTo] = useState<Dayjs | null>(null);
  const [isManageCommentsRole, setIsManageCommentsRole] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultOptions, setDefaultOptions] = useState<IDefaultOptions[]>([]);

  useEffect(() => {
    setSearchValue(externalSearchValue ?? '');
  }, [externalSearchValue]);

  const debounceValue = useDebounceValue(searchValue);

  const { createComment } = useCreateComment();

  const { commentsData, isCommentsDataFetching, isCommentsDataError, commentsRefetchFn } =
    useGetObjectCommentsData({
      objectId,
      startDate: formatQueryDate(dateFrom, timeFrom),
      endDate: formatQueryDate(dateTo, timeTo),
      searchQuery: debounceValue,
    });

  useEffect(() => {
    if (!userRoles) return;
    setIsManageCommentsRole(userRoles.includes(MANAGE_COMMENTS_ROLE));
  }, [isManageCommentsRole, userRoles]);

  useEffect(() => {
    const resetDateTimeState = () => {
      setDateFrom(null);
      setTimeFrom(null);
      setDateTo(null);
      setTimeTo(null);
    };
    if (!isDrawerOpen) resetDateTimeState();
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!commentsData) return;
    const newComments = commentsData.comments.map((item) => ({ ...item, expanded: true }));
    setNewCommentsData(newComments);
  }, [commentsData]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (objectId === null || !user || data.comment === '') return;
    const commentToAdd = {
      author: user.name,
      text: data.comment,
      object_id: objectId,
    };

    await createComment(objectId, commentToAdd);

    reset();
  };

  const onCommentClick = async () => {
    handleSubmit(onSubmit)();
  };

  const onCancelClick = () => {
    reset();
  };

  const handleExpandedChange = (id: number) => {
    setNewCommentsData((prevState) =>
      prevState?.map((item) => (item.id === id ? { ...item, expanded: !item.expanded } : item)),
    );
  };

  return (
    <SC.CommentsStyled>
      <RightPanelHeader
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        timeFrom={timeFrom}
        setTimeFrom={setTimeFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        timeTo={timeTo}
        setTimeTo={setTimeTo}
        newDrawerWidth={newDrawerWidth}
      />

      <SC.CommentsBody>
        {isCommentsDataFetching && (
          <SC.LoadingContainer>
            <LoadingAvataa />
          </SC.LoadingContainer>
        )}
        {!isCommentsDataFetching && isCommentsDataError && (
          <ErrorPage
            error={{ message: translate('An error has occurred, please try again'), code: '404' }}
            refreshFn={commentsRefetchFn}
          />
        )}
        {!isCommentsDataFetching && !isCommentsDataError && newCommentsData.length === 0 && (
          <SC.LoadingContainer>
            <Typography>{translate('There are no comments')}</Typography>
          </SC.LoadingContainer>
        )}
        {!isCommentsDataFetching &&
          !isCommentsDataError &&
          newCommentsData.length !== 0 &&
          newCommentsData.map((item) => (
            <SC.AccordionStyled
              disableGutters
              key={item.id}
              expanded={item.expanded}
              onClick={() => handleExpandedChange(item.id)}
            >
              {item.author === user?.name ? (
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <SC.AccordionContent>
                    <Avatar src={user?.picture} alt={user?.name} />
                    <Typography>{item.author}</Typography>
                    <SC.AccordionDate>{formatDate(item.created)}</SC.AccordionDate>
                  </SC.AccordionContent>
                </AccordionSummary>
              ) : (
                <SC.AccordionSummaryReverse expandIcon={<ExpandMore />}>
                  <SC.AccordionContent sx={{ marginLeft: 'auto', paddingLeft: '5px' }}>
                    <Typography>{item.author}</Typography>
                    <SC.AccordionDate>{formatDate(item.created)}</SC.AccordionDate>
                    <Avatar src={user?.picture} alt={user?.name} />
                  </SC.AccordionContent>
                </SC.AccordionSummaryReverse>
              )}

              <AccordionDetails>
                <Typography
                  sx={{
                    textAlign: item.author === user?.name ? 'left' : 'right',
                    paddingLeft: item.author === user?.name ? '40px' : '0',
                    paddingRight: item.author === user?.name ? '0' : '40px',
                  }}
                >
                  {item.text}
                </Typography>
              </AccordionDetails>
            </SC.AccordionStyled>
          ))}
      </SC.CommentsBody>

      <SC.CommentsFooter>
        <SC.FooterWrapper>
          <Typography>
            {commentsData?.quantity ?? 0} {translate('Comments')}
          </Typography>
          {isManageCommentsRole && (
            <Tooltip title={translate('Manage default comments')}>
              <IconButton
                disabled={!(permissions?.update ?? true)}
                onClick={() => setIsModalOpen(true)}
              >
                <Settings />
              </IconButton>
            </Tooltip>
          )}
        </SC.FooterWrapper>

        <Controller
          control={control}
          name="comment"
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              options={defaultOptions.sort((a, b) => -b.group.localeCompare(a.group))}
              inputValue={value}
              getOptionLabel={(option) => `${option.id}: ${option.text}`}
              groupBy={(option) => option.group}
              onChange={(_, newValue) => onChange(newValue?.text)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  multiline
                  onChange={onChange}
                  label={translate('Enter a comment')}
                />
              )}
              sx={{ width: '240px' }}
              // eslint-disable-next-line react/no-unstable-nested-components
              PopperComponent={(props) => <Popper {...props} placement="top-start" />}
            />
          )}
        />

        <SC.ButtonsWrapper>
          <SC.ButtonStyled variant="outlined" onClick={onCancelClick}>
            {translate('Cancel')}
          </SC.ButtonStyled>
          <SC.ButtonStyled
            variant="contained"
            disabled={!(permissions?.view ?? true)}
            onClick={onCommentClick}
          >
            {translate('Comment')}
          </SC.ButtonStyled>
        </SC.ButtonsWrapper>
      </SC.CommentsFooter>

      <DefaultCommentsModal
        isModalOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        user={user}
        setDefaultOptions={setDefaultOptions}
        permissions={permissions}
      />
    </SC.CommentsStyled>
  );
};
