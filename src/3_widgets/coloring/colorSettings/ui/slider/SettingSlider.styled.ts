import styled from '@emotion/styled';
import { SliderProps, Slider } from '@mui/material';

interface SettingSliderStyledProps extends SliderProps {
  slidercolors: string;
  selectedThumbIndex: number | null;
}
export const SettingSliderStyled = styled(Slider)<SettingSliderStyledProps>`
  & .MuiSlider-track {
    background: linear-gradient(to right, ${(p) => p.slidercolors});
    border: white;
    height: 50%;
  }

  & .MuiSlider-thumb {
    height: 12px;
    width: 12px;
    background: ${({ theme }) => theme.palette.common.white};
    border: 2px solid currentColor;
    & span {
      background: none;
      color: ${({ theme }) => theme.palette.common.black};
      top: 0;
    }

    & .slider-input {
      width: 200px;
    }

    /* &:first-child {
      display: none;
    } */

    /* &:last-child {
      display: none;
    } */

    &::before {
      content: '';
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid ${({ theme }) => theme.palette.primary.main};
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    ${({ selectedThumbIndex }) =>
      selectedThumbIndex !== null &&
      `
    &[data-index="${selectedThumbIndex}"]::before {
      opacity: 1;
    }
  `}
  }
`;
