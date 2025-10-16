import { useEffect } from 'react';

interface IProps {
  isMenuOpen: boolean;
  isSmallScreen: boolean;
}

export const useColumnMenuPosition = ({ isMenuOpen, isSmallScreen }: IProps) => {
  useEffect(() => {
    if (!isMenuOpen || !isSmallScreen) return () => {};

    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const poppers = document.querySelectorAll(
            '.MuiPopper-root.MuiDataGrid-menu',
          ) as NodeListOf<HTMLElement>;

          poppers.forEach((popper) => {
            const currentTop = popper.style.top;
            const targetTop = '-150px';

            if (currentTop !== targetTop) {
              popper.style.top = targetTop;
              popper.style.transition = 'top 0.1s ease-in-out';
            }
          });
        }
      });
    });

    // Observe changes in the <body>
    const targetNode = document.body;
    observer.observe(targetNode, {
      childList: true, // Watch for addition/removal of child elements
      subtree: true, // Observe changes in the entire subtree
    });

    return () => observer.disconnect();
  }, [isMenuOpen, isSmallScreen]);
};
