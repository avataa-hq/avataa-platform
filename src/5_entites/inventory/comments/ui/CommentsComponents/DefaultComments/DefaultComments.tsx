import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, IconButton, Typography, alpha, useTheme } from '@mui/material';
import { Edit, Delete, CheckCircleOutline } from '@mui/icons-material';
import { IGroupedDefaultComments } from '5_entites';
import {
  ActionTypes,
  DefaultComment,
  DefaultCommentsModel,
  InputWithIcon,
  Modal,
  UpdateDefaultCommentBody,
  useTranslate,
} from '6_shared';
import * as SC from './DefaultComments.styled';

interface IProps {
  defaultCommentsData: DefaultCommentsModel | undefined;
  deleteDefaultComment: (id: number) => Promise<void>;
  updateDefaultComment: (body: UpdateDefaultCommentBody) => Promise<void>;
  groupName: string;
  setGroupName: (value: React.SetStateAction<string>) => void;
  resetForm: () => void;
  setShouldDisableAddButton: React.Dispatch<React.SetStateAction<boolean>>;
  permissions?: Record<ActionTypes, boolean>;
}

export const DefaultComments = ({
  defaultCommentsData,
  deleteDefaultComment,
  updateDefaultComment,
  groupName,
  setGroupName,
  resetForm,
  setShouldDisableAddButton,
  permissions,
}: IProps) => {
  const theme = useTheme();
  const translate = useTranslate();

  const [groupedDefaultCommentsData, setGroupedDefaultCommentsData] = useState<
    IGroupedDefaultComments[]
  >([]);
  const [isEditingId, setIsEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState<number | null>(null);

  const { control, setValue, getValues, reset } = useForm({
    mode: 'onChange',
  });

  useEffect(() => {
    setShouldDisableAddButton(isEditingId !== null);
  }, [isEditingId, setShouldDisableAddButton]);

  useEffect(() => {
    if (!defaultCommentsData) return;
    const newDefaultCommentsData = defaultCommentsData.comments.reduce((acc, comment) => {
      setValue(String(comment.id), comment.text);
      const key = comment.group ?? translate('No group');

      if (!acc[key]) {
        acc[key] = { groupName: key, comments: [] };
      }

      acc[key].comments.push(comment);
      return acc;
    }, {} as any);

    setGroupedDefaultCommentsData(Object.values(newDefaultCommentsData));
  }, [defaultCommentsData, setValue]);

  const toggleEditing = (commentId: number) => {
    if (isEditingId === commentId) {
      setIsEditingId(null);
    } else {
      setIsEditingId(commentId);
    }
  };

  const onUpdateCommentClick = async (comment: DefaultComment) => {
    toggleEditing(comment.id);
    const fieldValue = getValues(String(comment.id));

    if ((fieldValue && fieldValue !== comment.text) || groupName !== '') {
      const commentToUpdate = {
        author: comment.author,
        text: fieldValue,
        group: groupName !== '' ? groupName : comment.group,
      };

      await updateDefaultComment({ id: comment.id, body: commentToUpdate });
      setGroupName('');
      resetForm();
    }
  };

  const onDeleteClick = (commentId: number) => {
    setCommentIdToDelete(commentId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    reset();
  };

  const handleConfirmDelete = async () => {
    setIsModalOpen(false);
    if (commentIdToDelete !== null) {
      await deleteDefaultComment(commentIdToDelete);
    }
  };

  return (
    <SC.DefaultCommentsStyled>
      {groupedDefaultCommentsData.map((group) => (
        <Box component="div" key={group.groupName}>
          <SC.Title>{group.groupName}</SC.Title>

          <SC.Wrapper>
            {group.comments.map((comment) => (
              <Controller
                key={comment.id}
                control={control}
                name={String(comment.id)}
                rules={{
                  required: translate('The field must not be empty'),
                }}
                render={({ field: { onChange, value }, fieldState }) => (
                  <>
                    <SC.Body>
                      <InputWithIcon
                        multiline
                        height="auto"
                        value={value}
                        widthPercent
                        disabled={comment.id !== isEditingId}
                        inputProps={{ onChange }}
                        customSX={{
                          '&.MuiInputBase-root.Mui-disabled': {
                            color: alpha(theme.palette.text.primary, 0.5),
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: 'currentcolor',
                            },
                          },
                        }}
                      />
                      {comment.id === isEditingId ? (
                        <IconButton
                          onClick={() => onUpdateCommentClick(comment)}
                          disabled={!!fieldState.error || permissions?.update !== true}
                          color={fieldState.error ? 'error' : 'success'}
                        >
                          <CheckCircleOutline color={fieldState.error ? 'error' : 'success'} />
                        </IconButton>
                      ) : (
                        <IconButton
                          disabled={
                            (isEditingId !== null && comment.id !== isEditingId) ||
                            permissions?.update !== true
                          }
                          onClick={() => toggleEditing(comment.id)}
                        >
                          <Edit />
                        </IconButton>
                      )}
                      <IconButton
                        onClick={() => onDeleteClick(comment.id)}
                        disabled={permissions?.update !== true}
                      >
                        <Delete />
                      </IconButton>
                    </SC.Body>
                    {fieldState.error && (
                      <Typography fontSize={10} color="error">
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </>
                )}
              />
            ))}
          </SC.Wrapper>
        </Box>
      ))}
      <Modal open={isModalOpen} onClose={handleModalClose} width={350}>
        <SC.ModalHeader>
          <SC.ModalTitle>
            {translate('Are you sure you want to delete this default comment?')}
          </SC.ModalTitle>
        </SC.ModalHeader>

        <SC.ModalBody>
          <SC.ModalButton variant="outlined" onClick={handleModalClose}>
            {translate('Cancel')}
          </SC.ModalButton>
          <SC.ModalButton variant="contained" onClick={handleConfirmDelete}>
            {translate('Delete')}
          </SC.ModalButton>
        </SC.ModalBody>
      </Modal>
    </SC.DefaultCommentsStyled>
  );
};
