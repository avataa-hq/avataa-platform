import HierarchyBubbleDarkIcon from 'assets/img/hierarchy_bubble.svg?react';
import HierarchyBubbleLightIcon from 'assets/img/hierarchy_bubble_light.svg?react';
import HierarchyExtBubbleDarkIcon from 'assets/img/hierarchy_ext_bubble.svg?react';
import HierarchyExtBubbleLightIcon from 'assets/img/hierarchy_ext_bubble_light.svg?react';
import { useMemo } from 'react';
import { useThemeSlice } from '6_shared';

interface HierarchyBubbleProps {
  onClick: (node: any, event: any) => void;
  nodeProps: any;
}

export const HierarchyBubble = ({ onClick, nodeProps }: HierarchyBubbleProps) => {
  const { mode } = useThemeSlice();

  let BubbleIcon;

  const isFictive =
    typeof nodeProps.nodeDatum.id === 'string' && nodeProps.nodeDatum.id?.startsWith('ext');

  if (isFictive) {
    BubbleIcon = mode === 'dark' ? HierarchyExtBubbleDarkIcon : HierarchyExtBubbleLightIcon;
  } else {
    BubbleIcon = mode === 'dark' ? HierarchyBubbleDarkIcon : HierarchyBubbleLightIcon;
  }

  const shortenedName = useMemo<string>(() => {
    const maxLength = 8;

    if (nodeProps.nodeDatum.name.length > maxLength) {
      return `${nodeProps.nodeDatum.name.substring(0, maxLength)}...`;
    }
    return nodeProps.nodeDatum.name;
  }, [nodeProps.nodeDatum.name]);

  const handleClick = (event: any) => onClick(nodeProps.hierarchyPointNode, event);
  return (
    <>
      <BubbleIcon data-testid={nodeProps.nodeDatum.name} onClick={handleClick} />

      <text
        style={{
          zIndex: 200,
          fontSize: 14,
          lineHeight: 15,
          fill: 'white',
          stroke: 'none',
          pointerEvents: 'none',
        }}
        textAnchor="middle"
      >
        {shortenedName}
      </text>
    </>
  );
};
