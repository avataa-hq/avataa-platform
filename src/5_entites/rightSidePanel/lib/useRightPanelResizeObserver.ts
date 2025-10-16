import { useEffect, useState } from 'react';

export const useRightPanelResizeObserver = () => {
  const [rightPanelWidth, setRightPanelWidth] = useState(0);

  useEffect(() => {
    const element = document.getElementById('right-side-panel');

    if (!element) return () => {};

    const resizeObserver = new ResizeObserver((entries) => {
      Object.values(entries).forEach((entry) => {
        const { width } = entry.contentRect;
        setRightPanelWidth(width);
      });
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { rightPanelWidth };
};
