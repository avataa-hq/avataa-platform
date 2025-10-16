export const useResponsiveText =
  (width: number, height: number, from?: 'width' | 'height') => (initialSize: number) => {
    let containerSize: number = 0;
    if (!from) {
      containerSize = width <= height ? width : height;
    }
    if (from === 'width') {
      containerSize = width;
    }
    if (from === 'height') {
      containerSize = height;
    }

    return `${Math.ceil(containerSize / initialSize)}px`;
  };
