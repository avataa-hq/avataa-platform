import { useState, useRef, useEffect } from 'react';
import {
  IconButton,
  Popover,
  CircularProgress,
  Typography,
  Slider,
  InputBase,
  Tooltip,
  Box,
  Button,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import DoneIcon from '@mui/icons-material/Done';

import { useTranslate } from '../../localization';
import {
  LinkInputContainer,
  LinkLifeMinutesInput,
  LinkSettingsContainer,
  ShareStatePopoverContainer,
} from './ShareState.styled';
import { useShareLink } from '../lib/useShareLink';

interface IProps {
  fastCopy?: boolean;
}

export const ShareState = ({ fastCopy }: IProps) => {
  const translate = useTranslate();

  const { link, onGenerateLink, isLoading, setLink } = useShareLink();

  const inputRef = useRef<HTMLElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isCopyLink, setIsCopyLink] = useState(false);
  const [isDisableCopyButton, setIsDisableCopyButton] = useState(false);
  const [linkLifeMinutes, setLinkLifeMinutes] = useState(1);

  const copyLink = (doneLink?: string) => {
    const input: any = inputRef.current?.children?.[0];
    setTimeout(() => {
      navigator.clipboard.writeText(doneLink ?? input?.value).then(() => {
        setIsCopyLink(true);
      });
    }, 100);
  };

  useEffect(() => {
    if (isCopyLink) {
      setTimeout(() => {
        setIsCopyLink(false);
      }, 1000);
    }
  }, [isCopyLink]);

  useEffect(() => {
    if (!inputRef.current || link === null) return;
    const input: any = inputRef.current.children[0];
    input.value = link;
  }, [link]);

  const onGenerateClick = async () => {
    await onGenerateLink?.(linkLifeMinutes);
  };

  const onMinutesChange = (minutes: number) => {
    if (minutes >= 1 && minutes <= 60) setLinkLifeMinutes(minutes);
  };

  const onShareClick = async (e: any) => {
    if (fastCopy) {
      await onGenerateLink?.(60);
      if (link) {
        copyLink(link);
      }
    }
    setAnchorEl(e.currentTarget);
  };

  const onPopoverClose = () => {
    const input: any = inputRef.current?.children?.[0];
    if (input?.value) input.value = '';
    setLink(null);
    setLinkLifeMinutes(1);
    setIsCopyLink(false);
    setIsDisableCopyButton(false);
    setAnchorEl(null);
  };

  return (
    <Box component="div">
      <IconButton color="primary" disabled={isLoading} onClick={onShareClick}>
        <ShareIcon color="primary" />
      </IconButton>

      <Popover
        id={anchorEl ? 'simple-popover' : undefined}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={onPopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <ShareStatePopoverContainer>
          <Typography variant="h2"> {translate('Generate link')}</Typography>

          <LinkSettingsContainer>
            <Box component="div" width="100" display="flex" alignItems="center">
              <Typography variant="body1">{translate('Link lifetime in minutes')}</Typography>
              <LinkLifeMinutesInput
                value={linkLifeMinutes}
                type="number"
                onChange={(e) => {
                  onMinutesChange(+e.target.value);
                }}
              />
            </Box>

            <Slider
              value={linkLifeMinutes}
              onChange={(e, val) => {
                if (typeof val === 'number') onMinutesChange(val);
              }}
              sx={{ width: '85%' }}
              min={1}
              max={60}
              step={1}
              marks={[
                { label: '1', value: 1 },
                { label: '10', value: 10 },
                { label: '30', value: 30 },
                { label: '60', value: 60 },
              ]}
            />
          </LinkSettingsContainer>

          <LinkInputContainer>
            <InputBase
              inputProps={{
                // @ts-ignore
                onDoubleClick: (e) => e.target.select(),
                sx: { cursor: 'pointer', userSelect: 'none' },
              }}
              ref={inputRef}
              sx={{ cursor: 'pointer', userSelect: 'none' }}
              fullWidth
              placeholder={translate('Your link')}
              onDoubleClick={() => copyLink()}
              onKeyDown={(e) => e.preventDefault()}
            />
            <Tooltip title={`${translate('Copy')}!`} placement="top" open={isCopyLink}>
              <IconButton
                onClick={() => copyLink()}
                color={isCopyLink ? 'success' : 'primary'}
                disabled={isDisableCopyButton || link === null}
              >
                {isLoading && <CircularProgress size={20} />}
                {!isLoading && !isCopyLink && <CopyAllIcon color="primary" />}
                {!isLoading && isCopyLink && <DoneIcon color="success" />}
              </IconButton>
            </Tooltip>
          </LinkInputContainer>

          <Button onClick={onGenerateClick} variant="contained">
            {translate('Generate')}
          </Button>
        </ShareStatePopoverContainer>
      </Popover>
    </Box>
  );
};
