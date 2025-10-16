import { Avatar, Box, Typography } from '@mui/material';

interface CommentProps {
  authorName: string;
  text: string;
  authorAvatar?: string;
  date?: string;
  float?: 'left' | 'right';
}

export const Comment = ({ authorName, authorAvatar, text, date, float = 'left' }: CommentProps) => {
  return (
    <Box
      component="div"
      display="flex"
      flexDirection={float === 'left' ? 'row' : 'row-reverse'}
      textAlign={float === 'left' ? 'left' : 'right'}
      gap="0.6125rem"
    >
      <Avatar alt={authorName} src={authorAvatar} sx={{ width: '30px', height: '30px' }} />
      <Box component="div">
        <Box
          component="div"
          display="flex"
          gap="5px"
          justifyContent={float === 'left' ? 'flex-start' : 'flex-end'}
        >
          <Typography>{authorName}</Typography>
          {date && <Typography sx={{ opacity: 0.6 }}>{date}</Typography>}
        </Box>
        <Typography fontWeight={400}>{text}</Typography>
      </Box>
    </Box>
  );
};
