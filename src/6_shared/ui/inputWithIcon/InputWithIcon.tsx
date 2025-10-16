import React, { useEffect, useRef, useState } from 'react';
import { Theme } from '@emotion/react';
import { Search } from '@mui/icons-material';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import { IconButton, SxProps, IconButtonProps } from '@mui/material';
import { useTranslate } from '6_shared/localization';
import { MyInputStyled } from './InputWithIcon.styled';

interface IMyInputProps extends InputBaseProps {
  iconPosition?: 'left' | 'right' | 'middle';
  placeHolderText?: string;
  width?: number | string;
  widthPercent?: boolean;
  height?: number | string;
  icon?: React.ReactNode;
  bgColor?: string;
  onIconClick?: () => void;
  customStyles?: Record<string, any>;
  customSX?: any;
  customInputStyles?: Record<string, any>;
  expandWidth?: number;
  customIconButtonSx?: SxProps<Theme>;
  iconButtonProps?: IconButtonProps;
}

export const InputWithIcon: React.FC<IMyInputProps> = ({
  iconPosition,
  placeHolderText = 'Search',
  width = 300,
  widthPercent,
  height = 40,
  icon = <Search fontSize="small" />,
  bgColor,
  onIconClick,
  customStyles,
  customSX,
  customInputStyles,
  expandWidth,
  customIconButtonSx,
  iconButtonProps,
  ...props
}) => {
  const translate = useTranslate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [newWidth, setNewWidth] = useState(width);
  const [newIconPosition, setNewIconPosition] = useState(iconPosition);
  const [newPlaceHolderText, setNewPlaceHolderText] = useState(placeHolderText);

  const handleFocus = () => {
    setIsFocused(true);
    if (inputRef.current) {
      const inputElement = inputRef.current?.querySelector('input');
      if (inputElement) {
        inputElement.focus();
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    if (iconPosition !== 'middle') return;
    if (isFocused && expandWidth) {
      setNewWidth(expandWidth);
      setNewIconPosition('right');
      setNewPlaceHolderText(translate('Search'));
    } else {
      setNewWidth(width);
      setNewIconPosition(iconPosition);
      setNewPlaceHolderText(placeHolderText);
    }
  }, [expandWidth, iconPosition, isFocused, width, placeHolderText, translate]);

  return (
    <MyInputStyled
      className={isFocused ? 'expanded-input' : ''}
      width={widthPercent ? '100%' : newWidth}
      height={height}
      style={{ backgroundColor: bgColor, ...customStyles, position: 'relative', display: 'flex' }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      autoFocus
    >
      {icon && newIconPosition === 'left' && (
        <IconButton onClick={() => onIconClick?.()}>{icon}</IconButton>
      )}
      <InputBase
        ref={inputRef}
        placeholder={translate(newPlaceHolderText as any)}
        className="text"
        {...props}
        sx={{
          ...customSX,
          input: {
            opacity: typeof newWidth === 'number' && newWidth < 40 ? 0 : 1,
          },
        }}
        style={{ flexGrow: 1, ...customInputStyles }}
      />
      {icon && newIconPosition === 'right' && (
        <IconButton onClick={() => onIconClick?.()}>{icon}</IconButton>
      )}
      {icon && newIconPosition === 'middle' && (
        <IconButton
          {...iconButtonProps}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            ...customIconButtonSx,
          }}
          onClick={() => {
            onIconClick?.();
            handleFocus();
          }}
        >
          {icon}
        </IconButton>
      )}
    </MyInputStyled>
  );
};
