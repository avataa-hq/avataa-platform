import { HistoryRightPanelCountStyled } from './HistoryRightPanelCount.styled';

interface IProps {
  historyCount?: number;
}

export const HistoryRightPanelCount = ({ historyCount }: IProps) => {
  return <HistoryRightPanelCountStyled>{historyCount}</HistoryRightPanelCountStyled>;
};
