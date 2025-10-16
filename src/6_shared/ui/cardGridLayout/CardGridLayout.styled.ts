import styled from '@emotion/styled';
import { Box } from '@mui/material';

import { getGridContainerGridSettings } from './lib/getGridContainerGridSettings';
import { getGridCellSettings } from './lib/getGridCellSettings';

export const CardGridLayout = styled(Box)`
  padding-bottom: 1rem;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  height: 100%;
  width: 100%;

  display: grid;
  gap: 1rem;
  align-self: stretch;

  ${({ children }) => Array.isArray(children) && getGridContainerGridSettings(children.length)}

  ${({ children }) =>
    Array.isArray(children)
      ? children?.map((child, i) => {
          return `
            *:nth-of-type(${i + 1}) {
              ${getGridCellSettings(i, children.length)}
              align-self: stretch;
            }
            `;
        })
      : ''}
`;
