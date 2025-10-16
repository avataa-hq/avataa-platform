import { Controller, useFormContext } from 'react-hook-form';
import { MenuItem, Select, Typography } from '@mui/material';
import { DeleteButton, IParams, Wrapper } from '5_entites';

interface IProps {
  param: IParams;
  isEdited: boolean;
  onDeleteClick?: (newParamTypeId: number) => void;
  showDeleteButton?: boolean;
  endButtonSlot?: React.ReactNode;
  customWrapperStyles?: React.CSSProperties;
  testid?: string;
}

export const BooleanComponent = ({
  param,
  isEdited,
  onDeleteClick,
  showDeleteButton = true,
  endButtonSlot,
  customWrapperStyles,
  testid,
}: IProps) => {
  const { control, setValue, clearErrors } = useFormContext();

  return (
    <Controller
      control={control}
      name={param.tprm_id.toString()}
      defaultValue={param.value?.toLowerCase() ?? ''}
      render={({ field, fieldState }) => (
        <>
          <Wrapper
            sx={{
              paddingRight: showDeleteButton || endButtonSlot ? 0 : '40px',
            }}
            style={{ ...customWrapperStyles }}
          >
            <Select
              {...field}
              value={field.value?.toLowerCase() ?? ''}
              onChange={(e) => {
                setValue(param.tprm_id.toString(), e.target.value.toLowerCase());
                clearErrors(param.tprm_id.toString());
              }}
              data-testid={testid}
              disabled={!isEdited}
              sx={{ height: '37px' }}
            >
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </Select>

            {showDeleteButton && <DeleteButton onClick={() => onDeleteClick?.(param.tprm_id)} />}
            {endButtonSlot}
          </Wrapper>
          {fieldState.error && (
            <Typography fontSize={10} color="error">
              {fieldState.error.message}
            </Typography>
          )}
        </>
      )}
    />
  );
};
