import { useEffect, useRef } from 'react';

interface ClickAwayListenerProps {
  children: React.ReactNode;
  onClickAway: () => void;
}

export const ClickAwayListener = ({ children, onClickAway }: ClickAwayListenerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClickAway();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClickAway]);

  return <div ref={containerRef}>{children}</div>;
};
