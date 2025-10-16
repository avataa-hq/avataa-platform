import {
  InputNode,
  LinkLabelConfig,
  LinkedNodesDiagramOptions,
  PopulatedLink,
  config,
} from '../model';

export const getLinkLabelConfig = <N extends InputNode = InputNode>(
  getLinkLabel: LinkedNodesDiagramOptions<N>['getLinkLabel'],
  d: PopulatedLink<N>,
): LinkLabelConfig => {
  const linkLabel = typeof getLinkLabel === 'function' ? getLinkLabel(d) : getLinkLabel;
  if (linkLabel === undefined) return config.defaultLinkLabelConfig;

  return typeof linkLabel === 'string'
    ? {
        ...config.defaultLinkLabelConfig,
        value: linkLabel,
      }
    : {
        value: linkLabel.value,
        position: linkLabel.position ?? config.defaultLinkLabelConfig.position,
        offset: linkLabel.offset ?? config.defaultLinkLabelConfig.offset,
      };
};
