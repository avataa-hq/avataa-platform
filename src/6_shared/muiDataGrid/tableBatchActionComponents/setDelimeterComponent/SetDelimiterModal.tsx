import { ChangeEvent, useEffect, useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Button, TextField } from '@mui/material';
import { Modal } from '6_shared';
import { ErrorMessage, InputWrapper } from './SetDelimiterModal.styled';

interface IProps {
  open: boolean;
  onClose: () => void;
  setDelimiter: (value: string) => void;
  sendData: (body?: any) => void;
}

export const SetDelimiterModal = ({ open, onClose, setDelimiter, sendData }: IProps) => {
  const [radioValue, setRadioValue] = useState<string>(';');
  const [inputValue, setInputValue] = useState<string>('');
  const [emptyDelimiterError, setEmptyDelimiterError] = useState<boolean>(false);
  const [longDelimiterError, setLongDelimiterError] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRadioValue((event.target as HTMLInputElement).value);
  };

  useEffect(() => {
    if (radioValue === 'Other') {
      setDelimiter(inputValue);
    } else {
      setDelimiter(radioValue);
    }
  }, [inputValue, radioValue]);

  useEffect(() => {
    if (radioValue !== 'Other' || inputValue.length) {
      setEmptyDelimiterError(false);
    }
  }, [inputValue, radioValue]);

  useEffect(() => {
    if (radioValue === 'Other' && inputValue.length > 1) {
      setLongDelimiterError(true);
    } else {
      setLongDelimiterError(false);
    }
  }, [inputValue, radioValue]);

  const onSubmit = () => {
    if (radioValue === 'Other' && !inputValue.length) {
      setEmptyDelimiterError(true);
    }
    if (
      !emptyDelimiterError &&
      !longDelimiterError &&
      !(radioValue === 'Other' && !inputValue.length)
    ) {
      sendData();
      onClose();
    }
  };

  return (
    <Modal
      width="400px"
      height="350px"
      open={open}
      onClose={onClose}
      title="Please choose delimiter for CSV file"
    >
      <FormControl sx={{ position: 'relative' }}>
        <RadioGroup value={radioValue} onChange={handleChange}>
          <FormControlLabel value=";" control={<Radio />} label="Semicolon" />
          <FormControlLabel value="," control={<Radio />} label="Comma" />
          <FormControlLabel value=" " control={<Radio />} label="Space" />
          <FormControlLabel value="&#9;" control={<Radio />} label="Tab character" />
          <FormControlLabel value="Other" control={<Radio />} label="Other" />
          <InputWrapper>
            <TextField
              sx={{ width: '50px', marginRight: '5px' }}
              value={inputValue}
              disabled={radioValue !== 'Other'}
              autoFocus
              error={inputValue.length > 1}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setInputValue(event.target.value);
              }}
            />
            {longDelimiterError && (
              <ErrorMessage>
                The length of the delimiter must not exceed one character!
              </ErrorMessage>
            )}
            {emptyDelimiterError && <ErrorMessage>Delimiter can not be empty.</ErrorMessage>}
          </InputWrapper>
        </RadioGroup>
      </FormControl>

      <Button sx={{ marginTop: '15px', display: 'block' }} variant="contained" onClick={onSubmit}>
        Download CSV File
      </Button>
    </Modal>
  );
};
