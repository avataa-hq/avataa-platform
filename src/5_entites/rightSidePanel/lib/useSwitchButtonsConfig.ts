import {
  History as HistoryIcon,
  Textsms as CommentsIcon,
  ViewComfyAlt as AttributesIcon,
  MoreVert as TraceIcon,
} from '@mui/icons-material';
import { ActionTypes, ISwitchButtonsConfig } from '6_shared';

interface IProps {
  permissions?: Record<ActionTypes, boolean>;
}

export const useSwitchButtonsConfig = ({ permissions }: IProps) => {
  const switchButtonsConfig: ISwitchButtonsConfig[] = [
    {
      key: 'attributes',
      label: 'Attributes',
      Icon: AttributesIcon,
      dataTestId: 'attributes-button',
      permission: permissions?.view ?? true,
    },
    {
      key: 'history',
      label: 'History',
      Icon: HistoryIcon,
      dataTestId: 'history-button',
      permission: permissions?.view ?? true,
    },
    {
      key: 'comments',
      label: 'Comments',
      Icon: CommentsIcon,
      dataTestId: 'comments-button',
      permission: permissions?.view ?? true,
    },
    {
      key: 'trace',
      label: 'Trace',
      Icon: TraceIcon,
      dataTestId: 'trace-button',
      permission: permissions?.view ?? true,
    },
  ];

  return { switchButtonsConfig };
};
