import { MutableRefObject, useCallback, useEffect, useState } from 'react';
import { findParentWithClass, RESPONSIVE_TEXT_CONTAINER_CLASS } from '../../utils';
import { useResponsiveText } from './useResponsiveText';

interface UseResizeParams<T> {
  childRef: MutableRefObject<T | null>;
  parentClassName?: string;
  from?: 'width' | 'height';
  maxSize?: number;
}

export const useResize = <T extends HTMLElement>({
  childRef,
  parentClassName = RESPONSIVE_TEXT_CONTAINER_CLASS,
  from,
  maxSize,
}: UseResizeParams<T>) => {
  const [parent, setParent] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const getFontSize = useResponsiveText(
    maxSize ?? containerWidth,
    maxSize ?? containerHeight,
    from,
  );

  useEffect(() => {
    if (!childRef.current) return;
    const parentEl = findParentWithClass(childRef.current, parentClassName);
    setParent(parentEl);
  }, [childRef, parentClassName]);

  const onResize = useCallback(() => {
    if (parent) {
      // const clientRect = parent.getBoundingClientRect();
      setContainerWidth(() => parent.clientWidth);
      setContainerHeight(() => parent.clientHeight);
    }
  }, [parent]);

  useEffect(() => {
    if (!parent || !(parent instanceof Element)) return () => {};

    const resizeObserver = new ResizeObserver(() => {
      onResize();
    });

    resizeObserver.observe(parent);

    return () => {
      resizeObserver.disconnect();
    };
  }, [onResize, parent]);

  return {
    getFontSize,
    containerWidth,
    containerHeight,
  };
};
