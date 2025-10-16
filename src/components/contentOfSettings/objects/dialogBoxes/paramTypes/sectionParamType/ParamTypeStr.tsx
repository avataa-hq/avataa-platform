import { TextField, FormControlLabel } from '@mui/material';
import { useSettingsObject, useTranslate } from '6_shared';
import CheckBoxCustom from 'components/UI/checkbox/CheckBoxCustom';
import { ConstraintContainer, StrInputContainer } from '../../ObjectAndParamTypeModal.styled';

interface Iprops {
  localRegex: string;
  setLocalRegex: React.Dispatch<React.SetStateAction<string>>;
  regexDebounceTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  handleChangeSelectedInput: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    typeOfInput: 'name' | 'description' | 'regex' | 'intMin' | 'intMax' | 'floatMin' | 'floatMax',
    setLocalFunction: (value: React.SetStateAction<string>) => void,
    debounceTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
  ) => void;
}

export const ParamTypeStr = ({
  localRegex,
  regexDebounceTimeoutRef,
  setLocalRegex,
  handleChangeSelectedInput,
}: Iprops) => {
  const translate = useTranslate();

  const { paramState, setParamState } = useSettingsObject();

  return (
    <ConstraintContainer>
      <StrInputContainer>
        <FormControlLabel
          sx={{ mb: '10px' }}
          control={
            <CheckBoxCustom
              sx={{ p: '4px', marginX: 1.1 }}
              checked={paramState.constraint}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setParamState({ ...paramState, constraint: event.target.checked });
              }}
            />
          }
          label={translate('Constraint')}
        />
        <TextField
          disabled={!paramState.constraint}
          size="small"
          autoComplete="off"
          placeholder={translate('regular expression')}
          value={localRegex}
          onChange={(event) =>
            handleChangeSelectedInput(event, 'regex', setLocalRegex, regexDebounceTimeoutRef)
          }
          error={paramState.isErrorRegex}
          helperText={paramState.errorRegexMessage}
        />
      </StrInputContainer>
    </ConstraintContainer>
  );
};
