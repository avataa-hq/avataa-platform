import { ReactNode } from 'react';
import { MenuItem, Select, TextField } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { HeaderStyled, HeaderSlot } from './Header.styled';
import { INestedMultiFilterForm } from '../../types';
import { useTranslate } from '../../../../localization';

interface IProps {
  rightSlotContent?: ReactNode;
  control: Control<INestedMultiFilterForm, any>;
  withName?: boolean;
  withSharingSettings?: boolean;
  readonly?: boolean;
}
export const Header = ({
  rightSlotContent,
  control,
  withName,
  withSharingSettings,
  readonly,
}: IProps) => {
  const translate = useTranslate();

  return (
    <HeaderStyled>
      {withName && (
        <HeaderSlot>
          <Controller
            name="name"
            rules={{
              required: { value: true, message: 'Field must be filled in' },
              validate: (value) => value?.trim() !== '' || 'Field must be filled in',
            }}
            control={control}
            render={({ field, fieldState: { error, invalid } }) => (
              <TextField
                {...field}
                placeholder={translate('Name')}
                error={invalid}
                helperText={error?.message}
                sx={{ flex: 1 }}
                inputProps={{
                  readOnly: readonly,
                }}
              />
            )}
          />
        </HeaderSlot>
      )}
      {rightSlotContent && <HeaderSlot>{rightSlotContent}</HeaderSlot>}
      {withSharingSettings && (
        <HeaderSlot>
          <Controller
            name="isPublic"
            control={control}
            render={({ field, fieldState: { error, invalid } }) => (
              <Select
                {...field}
                sx={{ flex: 1 }}
                inputProps={{
                  readOnly: readonly,
                }}
              >
                <MenuItem value="true">{translate('Public')}</MenuItem>
                <MenuItem value="false">{translate('Private')}</MenuItem>
              </Select>
            )}
          />
        </HeaderSlot>
      )}
    </HeaderStyled>
  );
};
