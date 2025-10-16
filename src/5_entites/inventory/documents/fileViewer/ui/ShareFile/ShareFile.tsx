import { useState } from 'react';
import { IconButton, Popover, Tooltip } from '@mui/material';
import { useTranslate } from '6_shared';
import { ShareFileContent } from './ShareFileContent';
import * as SC from './ShareFile.styled';

interface IProps {
  fileLink: string;
}

export const ShareFile = ({ fileLink }: IProps) => {
  const translate = useTranslate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handelShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handelClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Tooltip title={translate('Share')}>
        <IconButton aria-describedby={id} onClick={(e) => handelShareClick(e)}>
          <SC.LinkIconStyled />
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        id={id}
        anchorEl={anchorEl}
        onClose={handelClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <ShareFileContent fileLink={fileLink} />
      </Popover>
    </>
  );
};
