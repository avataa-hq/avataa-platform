import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { useTheme } from '@mui/material';
import { IParams, ThreeDotsMenu } from '5_entites';
import { InputWithIcon } from '6_shared';
import * as SC from './InputComponent.styled';

interface IProps {
  value: any;
  isEdited: boolean;
  field: ControllerRenderProps<FieldValues, string>;
  onFieldChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, string>,
  ) => void;
  addNewField: () => void;
  deleteField: (index: number | null) => void;
  idx: number;
  shouldDisplayDeleteFieldButton: boolean;
  param: IParams;
  onDeleteClick?: (newParamTypeId: number) => void;
  showDeleteButton?: boolean;
  endButtonSlot?: React.ReactNode;
}

export const InputComponent = ({
  value,
  isEdited,
  field,
  onFieldChange,
  addNewField,
  deleteField,
  idx,
  shouldDisplayDeleteFieldButton,
  param,
  onDeleteClick,
  showDeleteButton,
  endButtonSlot,
}: IProps) => {
  const theme = useTheme();
  return (
    <SC.InputWrapper>
      <InputWithIcon
        multiline
        height="auto"
        value={value}
        widthPercent
        disabled={!isEdited}
        customStyles={{
          border: !isEdited ? 'none' : `1px solid ${theme.palette.neutralVariant.outline}`,
          minHeight: '37px',
          padding: '0 10px',
        }}
        customSX={{
          '&.MuiInputBase-root.Mui-disabled': {
            color: !isEdited ? theme.palette.text.primary : 'currentcolor',
            '& .MuiInputBase-input.Mui-disabled': {
              WebkitTextFillColor: 'currentcolor',
            },
          },
        }}
        inputProps={{
          ...field,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            onFieldChange(e, field);
          },
        }}
      />

      {isEdited && (
        <ThreeDotsMenu
          addNewField={addNewField}
          deleteField={deleteField}
          idx={idx}
          shouldDisplayDeleteFieldButton={shouldDisplayDeleteFieldButton}
          param={param}
          onDeleteClick={onDeleteClick}
          showDeleteButton={showDeleteButton}
          endButtonSlot={endButtonSlot}
        />
      )}
    </SC.InputWrapper>
  );
};
