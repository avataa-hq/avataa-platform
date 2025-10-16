import { SxProps } from '@mui/system';

export interface IContentList {
  id: string;
  title: string;
  defaultTitle?: string;
  content: JSX.Element | null;
  isSidebar: boolean;
  icon?: () => JSX.Element;
  p_id?: string;
  child_count?: number;
  isAccessable: boolean;
  link?: string;
  sx?: SxProps;
}
