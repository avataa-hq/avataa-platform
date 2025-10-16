import { Typography } from '@mui/material';
import { StepComponentItemStyled } from './StepsComponent.styled';

export interface IStepItemModel {
  label: string;
  index: number;
}

const getColor = (
  currentIndex: number,
  activeIndex?: number | null,
  errorIndexes?: number[] | null,
) => {
  if (errorIndexes?.includes(currentIndex)) {
    return 'error';
  }
  if (currentIndex === activeIndex) {
    return 'primary';
  }
  return 'inherit';
};

export const StepsComponent = ({
  step,
  onClick,
  activeStepIndex,
  stepWithErrorIds,
}: {
  step: IStepItemModel;
  onClick?: (item: IStepItemModel) => void;
  activeStepIndex?: number | null;
  stepWithErrorIds?: number[] | null;
}) => {
  return (
    <StepComponentItemStyled onClick={() => onClick?.(step)}>
      <Typography
        variant="h4"
        fontSize={16}
        color={getColor(step.index, activeStepIndex, stepWithErrorIds)}
      >
        {step.label}
      </Typography>
    </StepComponentItemStyled>
  );
};
