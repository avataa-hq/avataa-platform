import { FormControlLabel, TextField } from '@mui/material';
import { useSettingsObject, useTranslate } from '6_shared';
import CheckBoxCustom from 'components/UI/checkbox/CheckBoxCustom';
import {
  ConstraintContainer,
  HorContainer,
  InputContainer,
  InputTitle,
} from '../../ObjectAndParamTypeModal.styled';

interface Iprops {
  localIntMin: string;
  setLocalIntMin: React.Dispatch<React.SetStateAction<string>>;
  intMinDebounceTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  localIntMax: string;
  setLocalIntMax: React.Dispatch<React.SetStateAction<string>>;
  intMaxDebounceTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  handleChangeSelectedInput: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    typeOfInput: 'name' | 'description' | 'regex' | 'intMin' | 'intMax' | 'floatMin' | 'floatMax',
    setLocalFunction: (value: React.SetStateAction<string>) => void,
    debounceTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
  ) => void;
}

export const ParamTypeInt = ({
  localIntMin,
  setLocalIntMin,
  intMinDebounceTimeoutRef,
  localIntMax,
  setLocalIntMax,
  intMaxDebounceTimeoutRef,
  handleChangeSelectedInput,
}: Iprops) => {
  const translate = useTranslate();

  const { paramState, setParamState } = useSettingsObject();

  return (
    <ConstraintContainer>
      <InputContainer>
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
        <HorContainer>
          <HorContainer>
            <InputTitle>{translate('min')}:</InputTitle>
            <TextField
              disabled={!paramState.constraint}
              size="small"
              autoComplete="off"
              type="number"
              sx={{ width: '138px' }}
              value={localIntMin}
              onChange={(event) =>
                handleChangeSelectedInput(event, 'intMin', setLocalIntMin, intMinDebounceTimeoutRef)
              }
              error={paramState.isErrorIntMin}
              helperText={paramState.errorIntMinMessage}
            />
          </HorContainer>
          <HorContainer>
            <InputTitle>{translate('max')}:</InputTitle>
            <TextField
              disabled={!paramState.constraint}
              size="small"
              autoComplete="off"
              type="number"
              sx={{ width: '138px' }}
              value={localIntMax}
              onChange={(event) =>
                handleChangeSelectedInput(event, 'intMax', setLocalIntMax, intMaxDebounceTimeoutRef)
              }
              error={paramState.isErrorIntMax}
              helperText={paramState.errorIntMaxMessage}
            />
          </HorContainer>
        </HorContainer>
      </InputContainer>
    </ConstraintContainer>
  );
};
