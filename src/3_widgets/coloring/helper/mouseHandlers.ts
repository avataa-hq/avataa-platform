import { SetStateAction } from 'react';

interface IProps {
  setHoveredRow: (value: SetStateAction<boolean[]>) => void;
  index: number;
}

export const handleMouseRowEnter = ({ setHoveredRow, index }: IProps) => {
  setHoveredRow((prevState: boolean[]) => {
    const newState = [...prevState];
    newState[index] = true;
    return newState;
  });
};

export const handleMouseRowLeave = ({ setHoveredRow, index }: IProps) => {
  setHoveredRow((prevState: boolean[]) => {
    const newState = [...prevState];
    newState[index] = false;
    return newState;
  });
};
