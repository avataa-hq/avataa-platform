import { useRef, useState } from 'react';
import { CopyAll } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Divider,
  IconButton,
  InputBase,
  Stack,
  Tooltip,
  Typography,
  Slider,
  Zoom,
  Box,
} from '@mui/material';
import { useTranslate } from '6_shared';
import { CopyLinkRange, PopoverShareContent } from './ShareFile.styled';

const marksDay = [
  { value: 0, x: 0 },
  { value: 1, x: 1 },
  { value: 2, x: 2 },
  { value: 3, x: 3 },
  { value: 4, x: 4 },
  { value: 5, x: 5 },
  { value: 6, x: 6 },
  { value: 7, x: 7 },
];
const marksHours = [
  { value: 0, x: 0 },
  { value: 6, x: 6 },
  { value: 12, x: 12 },
  { value: 18, x: 18 },
  { value: 24, x: 24 },
];
const marksMinutes = [
  { value: 0, x: 0 },
  { value: 10, x: 10 },
  { value: 20, x: 20 },
  { value: 30, x: 30 },
  { value: 40, x: 40 },
  { value: 50, x: 50 },
  { value: 60, x: 60 },
];

interface ValueName {
  value: number;
  name: string;
}

interface IProps {
  fileLink: string;
}

export const ShareFileContent = ({ fileLink }: IProps) => {
  const translate = useTranslate();

  const inputRef = useRef<HTMLDivElement | null>(null);

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const [loadLink, setLoadLink] = useState(false);
  const [isCopyLink, setIsCopyLink] = useState(false);
  const [isDisableCopyButton, setIsDisableCopyButton] = useState(true);

  const handelChangeSlider = (event: any) => {
    if (event.target) {
      const targetOptions: ValueName = event.target;

      switch (targetOptions.name) {
        case 'days':
          setDays(targetOptions.value);
          break;
        case 'hours':
          setHours(targetOptions.value);
          break;
        case 'minutes':
          setMinutes(targetOptions.value);
          break;
        default:
          break;
      }
    }
  };

  const maxDays = () => {
    if ((days === 6 && hours === 23 && minutes === 60) || (days === 6 && hours === 24)) return 0;
    return 7;
  };
  const maxHorse = () => {
    if (days === 7 || (days === 6 && hours === 23 && minutes === 60)) {
      return 0;
    }
    return 24;
  };
  const maxMinutes = () => {
    if (days === 7 || (days === 6 && hours === 24)) {
      return 0;
    }
    return 60;
  };

  const getShareLink = () => {
    setLoadLink(true);
    const input: any = inputRef.current?.children[0];

    let d = days;
    let h = hours;
    let m = minutes;

    if (!d && !h && !m) {
      h = 1;
    }

    if (d * 1440 + h * 60 + m >= 10080) {
      d = 7;
      h = 0;
      m = 0;
    }

    const fileUrlWithDate: string = `
      ${fileLink}?days=${d}&hours=${h}&minutes=${m}
    `;

    fetch(fileUrlWithDate).then((data) => {
      input.value = data.url;
      setIsDisableCopyButton(false);
      setLoadLink(false);
    });
  };

  const copyLink = () => {
    const input: any = inputRef.current?.children[0];
    navigator.clipboard.writeText(input.value).then(() => {
      setIsCopyLink(true);

      setTimeout(() => {
        setIsCopyLink(false);
        input.value = '';
        setDays(0);
        setHours(0);
        setMinutes(0);
        setIsDisableCopyButton(true);
      }, 1000);
    });
  };

  return (
    <PopoverShareContent>
      <Typography align="center" mb={3}>
        {translate('Generate link for share')}
      </Typography>

      <CopyLinkRange>
        <InputBase
          ref={inputRef}
          fullWidth
          sx={{ padding: '5px' }}
          placeholder={translate('Your link')}
          disabled
        />
        <Tooltip
          title={`${translate('Copy')}!`}
          placement="top"
          open={isCopyLink}
          TransitionComponent={Zoom}
        >
          <IconButton onClick={copyLink} color="secondary" disabled={isDisableCopyButton}>
            <CopyAll />
          </IconButton>
        </Tooltip>
      </CopyLinkRange>
      <Divider sx={{ marginBottom: '5px' }} />

      <Stack spacing={1}>
        <Box component="div" sx={{ width: 250 }}>
          <Typography>{translate('Days')}</Typography>
          <Slider
            size="small"
            name="days"
            onChange={handelChangeSlider}
            value={days}
            step={1}
            max={7}
            marks={marksDay}
            valueLabelDisplay="auto"
            disabled={maxDays() === 0}
          />
        </Box>

        <Box component="div" sx={{ width: 250 }}>
          <Typography>{translate('Hours')}</Typography>
          <Slider
            size="small"
            name="hours"
            onChange={handelChangeSlider}
            value={hours}
            step={1}
            max={24}
            marks={marksHours}
            valueLabelDisplay="auto"
            disabled={maxHorse() === 0}
          />
        </Box>

        <Box component="div" mb={5} sx={{ width: 250 }}>
          <Typography>{translate('Minutes')}</Typography>
          <Slider
            size="small"
            name="minutes"
            onChange={handelChangeSlider}
            value={minutes}
            step={1}
            max={60}
            marks={marksMinutes}
            valueLabelDisplay="auto"
            disabled={maxMinutes() === 0}
          />
        </Box>

        <LoadingButton loading={loadLink} onClick={getShareLink} variant="contained">
          {translate('Generate')}
        </LoadingButton>
      </Stack>
    </PopoverShareContent>
  );
};
