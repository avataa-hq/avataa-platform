import { useEffect, useState } from 'react';
import { Autocomplete, Button, TextField, Typography, Popper } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { KeycloakTokenParsed } from 'keycloak-js';
import { ActionTypes, ErrorPage, LoadingAvataa, Modal, useTranslate } from '6_shared';
import {
  useCreateDefaultComment,
  useDeleteDefaultComment,
  useUpdateDefaultComment,
} from '4_features';
import { IDefaultOptions, useGetDefaultComments } from '5_entites';
import * as SC from './DefaultCommentsModal.styled';
import { DefaultComments } from '../DefaultComments/DefaultComments';

interface IProps {
  isModalOpen: boolean;
  handleClose: () => void;
  user: KeycloakTokenParsed | undefined;
  setDefaultOptions: React.Dispatch<React.SetStateAction<IDefaultOptions[]>>;
  permissions?: Record<ActionTypes, boolean>;
}

type FormInputs = {
  defaultComment: string;
  groupName: string;
};

export const DefaultCommentsModal = ({
  isModalOpen,
  handleClose,
  user,
  setDefaultOptions,
  permissions,
}: IProps) => {
  const translate = useTranslate();
  const { handleSubmit, register, reset, control } = useForm<FormInputs>({
    defaultValues: {
      defaultComment: '',
      groupName: '',
    },
  });

  const [groupList, setGroupList] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [shouldDisableAddButton, setShouldDisableAddButton] = useState(false);

  const {
    defaultCommentsData,
    isDefaultCommentsDataFetching,
    isDefaultCommentsDataError,
    defaultCommentsRefetchFn,
  } = useGetDefaultComments();

  const { createDefaultComment } = useCreateDefaultComment();
  const { updateDefaultComment } = useUpdateDefaultComment();
  const { deleteDefaultComment } = useDeleteDefaultComment();

  useEffect(() => {
    if (!defaultCommentsData) return;

    const newOptions: IDefaultOptions[] = [];
    const groupSet: Set<string> = new Set();

    defaultCommentsData.comments.forEach((comment) => {
      if (comment.group !== null && comment.group !== undefined) {
        groupSet.add(comment.group);
      }

      newOptions.push({
        group: comment.group ?? 'No group',
        text: comment.text,
        id: comment.id,
      });
    });

    setGroupList(Array.from(groupSet));
    setDefaultOptions(newOptions);
  }, [defaultCommentsData, setDefaultOptions]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (data.defaultComment === '') return;
    const commentToAdd = {
      author: user?.name,
      text: data.defaultComment,
      group: data.groupName !== '' ? data.groupName : null,
    };
    await createDefaultComment(commentToAdd);
    reset();
  };

  const onAddClick = () => {
    handleSubmit(onSubmit)();
    reset();
  };

  const onCloseClick = () => {
    handleClose();
    reset();
  };

  const resetForm = () => {
    reset();
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      title={translate('Default comments')}
      width={600}
      actions={
        <>
          <Button variant="outlined" onClick={onCloseClick}>
            {translate('Cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={onAddClick}
            disabled={shouldDisableAddButton || permissions?.update !== true}
          >
            {translate('Add')}
          </Button>
        </>
      }
    >
      <SC.Body>
        {isDefaultCommentsDataFetching && (
          <SC.LoadingContainer>
            <LoadingAvataa />
          </SC.LoadingContainer>
        )}
        {!isDefaultCommentsDataFetching && isDefaultCommentsDataError && (
          <ErrorPage
            error={{ message: translate('An error has occurred, please try again'), code: '404' }}
            refreshFn={defaultCommentsRefetchFn}
          />
        )}
        {!isDefaultCommentsDataFetching &&
          !isDefaultCommentsDataError &&
          defaultCommentsData?.comments.length === 0 && (
            <SC.LoadingContainer>
              <Typography>{translate('There are no default comments')}</Typography>
            </SC.LoadingContainer>
          )}
        {!isDefaultCommentsDataFetching && (
          <DefaultComments
            defaultCommentsData={defaultCommentsData}
            deleteDefaultComment={deleteDefaultComment}
            updateDefaultComment={updateDefaultComment}
            groupName={groupName}
            setGroupName={setGroupName}
            resetForm={resetForm}
            setShouldDisableAddButton={setShouldDisableAddButton}
            permissions={permissions}
          />
        )}
      </SC.Body>
      <SC.Footer>
        <SC.Form>
          <SC.InputBaseStyled placeholder={translate('Comment')} {...register('defaultComment')} />
          <Controller
            control={control}
            name="groupName"
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                options={groupList}
                inputValue={value}
                onChange={(_, newValue) => {
                  if (newValue !== null) {
                    onChange(newValue);
                    setGroupName(newValue);
                  } else {
                    onChange('');
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    multiline
                    onChange={onChange}
                    label={translate('Add or select a group')}
                  />
                )}
                // eslint-disable-next-line react/no-unstable-nested-components
                PopperComponent={(props) => <Popper {...props} placement="top-start" />}
              />
            )}
          />
        </SC.Form>
      </SC.Footer>
    </Modal>
  );
};
