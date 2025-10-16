const gridSettings: Record<number, Record<number, { gridCol: string; gridRow: string }>> = {
  6: {
    0: { gridCol: '1', gridRow: 'span 4' },

    1: { gridCol: '2', gridRow: '1 / span 3' },

    2: { gridCol: '3', gridRow: '1 / span 5' },

    3: { gridCol: '1', gridRow: 'span 4' },

    4: { gridCol: '2', gridRow: '4 / span 5' },

    5: { gridCol: '3', gridRow: '6 / span 3' },
  },
  5: {
    3: { gridCol: '1 / span 2', gridRow: '2' },
  },
  3: {
    2: {
      gridCol: '1 / span 2',
      gridRow: '2',
    },
  },
};

export const getGridCellSettings = (index: number, childrenLength: number) => {
  const grid = gridSettings[childrenLength]?.[index];

  return grid
    ? `
    grid-column: ${grid.gridCol};
    grid-row: ${grid.gridRow};
  `
    : undefined;
};
