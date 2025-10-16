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
  localFloatMin: string;
  setLocalFloatMin: React.Dispatch<React.SetStateAction<string>>;
  floatMinDebounceTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  localFloatMax: string;
  setLocalFloatMax: React.Dispatch<React.SetStateAction<string>>;
  floatMaxDebounceTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  handleChangeSelectedInput: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    typeOfInput: 'name' | 'description' | 'regex' | 'intMin' | 'intMax' | 'floatMin' | 'floatMax',
    setLocalFunction: (value: React.SetStateAction<string>) => void,
    debounceTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
  ) => void;
}

export const ParamTypeFloat = ({
  localFloatMin,
  setLocalFloatMin,
  floatMinDebounceTimeoutRef,
  localFloatMax,
  setLocalFloatMax,
  floatMaxDebounceTimeoutRef,
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
              value={localFloatMin}
              onChange={(event) =>
                handleChangeSelectedInput(
                  event,
                  'floatMin',
                  setLocalFloatMin,
                  floatMinDebounceTimeoutRef,
                )
              }
              error={paramState.isErrorFloatMin}
              helperText={paramState.errorFloatMinMessage}
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
              value={localFloatMax}
              onChange={(event) =>
                handleChangeSelectedInput(
                  event,
                  'floatMax',
                  setLocalFloatMax,
                  floatMaxDebounceTimeoutRef,
                )
              }
              error={paramState.isErrorFloatMax}
              helperText={paramState.errorFloatMaxMessage}
            />
          </HorContainer>
        </HorContainer>
      </InputContainer>
    </ConstraintContainer>
  );
};
