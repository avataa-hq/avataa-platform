import { useTranslate } from '6_shared';
import CheckBoxCustom from 'components/UI/checkbox/CheckBoxCustom';
import { FormControlLabel } from '@mui/material';
import { ConstraintContainer, InputContainer } from '../../ObjectAndParamTypeModal.styled';

export const ParamTypeBoolDateDateTime = () => {
  const translate = useTranslate();

  return (
    <ConstraintContainer>
      <InputContainer>
        <FormControlLabel
          sx={{ mb: '10px' }}
          control={<CheckBoxCustom disabled sx={{ p: '4px', marginX: 1.1 }} />}
          label={translate('Constraint')}
        />
      </InputContainer>
    </ConstraintContainer>
  );
};
