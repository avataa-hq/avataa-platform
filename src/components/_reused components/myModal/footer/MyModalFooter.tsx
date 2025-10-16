import { Box } from '@mui/material';
import MyModalFooterStyled from './MyModalFooter.styled';

const MyModalFooter = ({ children }: React.PropsWithChildren) => {
  return (
    <MyModalFooterStyled>
      <Box component="div" sx={{ flex: 1 }} />
      {children}
    </MyModalFooterStyled>
  );
};

export default MyModalFooter;
