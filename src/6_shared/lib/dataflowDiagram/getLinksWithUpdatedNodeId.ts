import { Link } from '6_shared';

export const getLinksWithUpdatedNodeId = (links: Link[], oldNodeId: number, newNodeId: number) => {
  return links.map((link) => {
    if (link.source === oldNodeId) return { ...link, source: newNodeId };
    if (link.target === oldNodeId) return { ...link, target: newNodeId };
    return link;
  });
};
