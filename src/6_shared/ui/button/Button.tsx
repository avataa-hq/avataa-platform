import styled from '@emotion/styled';
import { ButtonBase, ButtonBaseProps } from '@mui/material';
import { forwardRef } from 'react';

interface IMapButtonStyledProps extends ButtonBaseProps {
  active?: boolean;
}

const ButtonStyled = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'active',
})<IMapButtonStyledProps>((props) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '5px',

  background: props.theme.palette.neutralVariant.outline,
  borderRadius: '10px',
  border: `1px solid ${props.theme.palette.neutralVariant.outline}`,

  boxShadow:
    props.active === true
      ? '0 11px 12px -3px rgba(0, 0, 0, 0.2)'
      : '0 10px 10px -5px rgba(0, 0, 0, 0.1)',

  transition: 'all 0.3s',

  '&:hover': {
    boxShadow: '0 11px 12px -3px rgba(0, 0, 0, 0.3)',
  },
  '&:active': {
    transform: 'scale(98%)',
    transition: 'all 0.2s',
  },
}));

export const Button = forwardRef<any, IMapButtonStyledProps>((props, ref) => {
  return <ButtonStyled {...props} ref={ref} />;
});
