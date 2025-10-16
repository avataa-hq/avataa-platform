const gridSettings: Record<number, { gridTemplateColumns: string; gridTemplateRows: string }> = {
  6: {
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(8, 1fr)',
  },
  5: {
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(2, calc(50% - 0.5rem))',
  },
  4: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(2, calc(50% - 0.5rem))',
  },
  3: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(2, calc(50% - 0.5rem))',
  },
  2: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'repeat(2, calc(50% - 0.5rem))',
  },
};

export const getGridContainerGridSettings = (childrenLength: number) => {
  const grid = gridSettings[childrenLength];

  if (childrenLength === 1) return 'height: 50%; display: block;';

  return grid
    ? `
  grid-template-rows: ${grid.gridTemplateRows};
  grid-template-columns: ${grid.gridTemplateColumns};
  `
    : undefined;
};
