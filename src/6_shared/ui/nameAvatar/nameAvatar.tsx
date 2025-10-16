import { Avatar, Box, Typography } from '@mui/material';

import StylizedAvatarRadar from './AvatarRadarStyles';

interface NameAvatarProps {
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  image?: string;
  name?: string;
}

export const NameAvatar = ({ onClick, image, name }: NameAvatarProps) => (
  <Box component="div" onClick={onClick} sx={{ cursor: 'pointer' }}>
    <StylizedAvatarRadar
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      sx={{ mr: '4px' }}
    >
      <Avatar src={image} />
    </StylizedAvatarRadar>
    <Typography component="span" sx={{ lineHeight: '40px', ml: 1.5 }}>
      {name}
    </Typography>
  </Box>
);
