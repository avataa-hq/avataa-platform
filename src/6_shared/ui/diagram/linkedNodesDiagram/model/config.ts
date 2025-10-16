import { LinkLabelConfig } from './types';

interface LinkedNodesDiagramConfig {
  defaultLinkLabelConfig: LinkLabelConfig;
}

export const config: LinkedNodesDiagramConfig = {
  defaultLinkLabelConfig: {
    value: '',
    position: 0.5,
    offset: 0,
  },
};
